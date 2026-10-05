"""Componeert en mixt de soundtrack van "De lus" — volledig in code, synchroon met timeline.js.

Muziek: een motief van 9 noten (de negen stappen) in achtsten over maten van 8 achtsten. Elke maat
schuift het accent één tel op (phasing): herhaling die nooit exact hetzelfde is.
Akte I klinkt bewust als de generieke AI-reclame en wordt met een tape-stop afgebroken.

Uitvoer: assets/soundtrack.wav (24-bit) + assets/soundtrack.m4a, en een rapport met de loudness.
Gebruik: python3 tools/compose_audio.py
"""
import json, re, subprocess, pathlib
import numpy as np
from scipy import signal as sg
import pyloudnorm as pyln

ROOT = pathlib.Path(__file__).resolve().parent.parent
TL = json.loads(re.search(r"window\.TIMELINE\s*=\s*(\{.*\});", (ROOT / "timeline.js").read_text(), re.S).group(1))
C = TL["cues"]
SR = 48000
DUR = TL["duration"]
N = int(SR * DUR)
BEAT = 60 / TL["bpm"]          # 0,5 s
E8 = BEAT / 2                  # achtste
rs = np.random.default_rng(20261005)

def mtof(m): return 440.0 * 2 ** ((m - 69) / 12)
def tt(d): return np.arange(int(SR * d)) / SR

# ---------------------------------------------------------------- bussen
buses = {k: np.zeros((2, N)) for k in ("music", "sfx", "echo", "send")}
def add(bus, x, t, gain=1.0, pan=0.0, send=0.0):
    """Plaats een mono- of stereosignaal op tijd t (s) met equal-power pan en reverb-send."""
    i = int(round(t * SR))
    if i >= N or len(x) == 0: return
    x = np.asarray(x)
    if x.ndim == 1:
        a = (pan + 1) * np.pi / 4
        x = np.vstack([x * np.cos(a), x * np.sin(a)])
    j = max(0, -i); i = max(0, i)
    n = min(x.shape[1] - j, N - i)
    if n <= 0: return
    buses[bus][:, i:i + n] += gain * x[:, j:j + n]
    if send: buses["send"][:, i:i + n] += gain * send * x[:, j:j + n]

def env_ad(n, a, d_tau):
    t = np.arange(n) / SR
    e = np.exp(-t / d_tau)
    na = max(1, int(a * SR)); e[:na] *= np.linspace(0, 1, na)
    return e

def fade(x, fi=0.003, fo=0.02):
    x = x.copy(); a, b = int(fi * SR), int(fo * SR)
    if a: x[..., :a] *= np.linspace(0, 1, a)
    if b: x[..., -b:] *= np.linspace(1, 0, b)
    return x

# ---------------------------------------------------------------- instrumenten
def marimba(m, vel=1.0, dur=1.6):
    f = mtof(m); t = tt(dur)
    tone = (np.sin(2 * np.pi * f * t) * np.exp(-t / (0.62 * (440 / f) ** .25))
            + .32 * np.sin(2 * np.pi * f * 3.93 * t) * np.exp(-t / .16)
            + .10 * np.sin(2 * np.pi * f * 9.4 * t) * np.exp(-t / .05))
    click = np.zeros_like(t); k = int(.006 * SR)
    click[:k] = rs.standard_normal(k) * np.linspace(1, 0, k) * .25
    click = sg.lfilter(*sg.butter(2, 2500 / (SR / 2), 'high'), click)
    a = int(.002 * SR); tone[:a] *= np.linspace(0, 1, a)
    return fade(vel * (tone + click) * .5)

def bell(m, vel=1.0, dur=2.6, ratio=3.5, index=3.0):
    f = mtof(m); t = tt(dur)
    mod = index * np.exp(-t / .5) * np.sin(2 * np.pi * f * ratio * t)
    return fade(vel * .35 * np.sin(2 * np.pi * f * t + mod) * env_ad(len(t), .003, .9))

def pluck(m, vel=1.0, dur=1.2):
    f = mtof(m); p = int(SR / f); n = int(dur * SR)
    buf = rs.uniform(-1, 1, p); out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = .996 * .5 * (buf[i % p] + buf[(i + 1) % p])
    out = sg.lfilter(*sg.butter(1, 3200 / (SR / 2)), out)
    return fade(vel * .32 * out)

def pad(ms, dur, att=.8, rel=1.2, cutoff=1400, bright=False, vol=.12):
    t = tt(dur + rel); x = np.zeros_like(t)
    for m in ms:
        for det in (-7, 0, 7):
            f = mtof(m) * 2 ** (det / 1200)
            ph = rs.uniform(0, 1)
            x += 2 * ((f * t + ph) % 1) - 1
    x /= (len(ms) * 3)
    x = sg.lfilter(*sg.butter(2, (4200 if bright else cutoff) / (SR / 2)), x)
    e = np.ones_like(t)
    na, nr = int(att * SR), int(rel * SR)
    e[:na] = np.linspace(0, 1, na) ** 2; e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return vol * x * e

def sine_pad(ms, dur, att=.6, rel=1.5, vol=.18):
    t = tt(dur + rel); x = sum(np.sin(2 * np.pi * mtof(m) * t + rs.uniform(0, 6)) for m in ms) / len(ms)
    e = np.ones_like(t); na, nr = int(att * SR), int(rel * SR)
    e[:na] = np.linspace(0, 1, na) ** 2; e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return vol * x * e

def sub(m, dur, vol=.5):
    t = tt(dur); x = np.tanh(1.6 * np.sin(2 * np.pi * mtof(m) * t)) * env_ad(len(t), .01, dur * .7)
    return fade(vol * x, .005, .05)

def kick(vol=1.0):
    t = tt(.45); f = 45 + 85 * np.exp(-t / .035)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .16)
    x[:int(.003 * SR)] += rs.standard_normal(int(.003 * SR)) * .3
    return fade(vol * .9 * np.tanh(1.4 * x))

def hat(vol=1.0, dec=.035):
    n = int(.12 * SR); x = rs.standard_normal(n) * env_ad(n, .0005, dec)
    return vol * .22 * sg.lfilter(*sg.butter(2, 7000 / (SR / 2), 'high'), x)

def tick(freq=1900, vol=1.0, dec=.018):
    t = tt(.08); x = (np.sin(2 * np.pi * freq * t) + .5 * np.sin(2 * np.pi * freq * 1.48 * t)) * np.exp(-t / dec)
    return vol * .3 * x

def ping(vol=1.0, hi=False):
    t = tt(.35); f1, f2 = (1568, 2349) if hi else (1318, 1976)
    x = np.sin(2 * np.pi * f1 * t) * np.exp(-t / .09) + .6 * np.sin(2 * np.pi * f2 * t) * np.exp(-(t - .045).clip(0) / .12) * (t > .045)
    return vol * .22 * x

def band_noise(dur, fc0, fc1, bw=.8, shape=None, vol=1.0):
    """Ruis met een bandfilter dat in de tijd verschuift (STFT-masker): whoosh/riser/papier."""
    n = int(dur * SR); x = rs.standard_normal(n)
    f, tseg, Z = sg.stft(x, SR, nperseg=1024)
    p = np.linspace(0, 1, Z.shape[1])
    fc = fc0 * (fc1 / fc0) ** p
    logf = np.log2(np.maximum(f, 20))[:, None]
    mask = np.exp(-.5 * ((logf - np.log2(fc)[None, :]) / bw) ** 2)
    _, y = sg.istft(Z * mask, SR, nperseg=1024)
    y = y[:n]
    e = shape(np.linspace(0, 1, n)) if shape else np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    y = y / (np.abs(y).max() + 1e-9)
    return vol * y * e

def stamp(vol=1.0):
    t = tt(.5)
    thud = np.sin(2 * np.pi * np.cumsum(70 * np.exp(-t / .12) + 40) / SR) * np.exp(-t / .11)
    slap = band_noise(.5, 1400, 900, bw=.7, shape=lambda p: np.exp(-p * 40), vol=1)
    return fade(vol * (.8 * thud + .55 * slap))

def pop(f0=620, vol=1.0):
    t = tt(.16); f = f0 * (1 - .45 * (1 - np.exp(-t / .03)))
    return fade(vol * .35 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .045))

def zip_(f0=500, f1=1500, dur=.3, vol=1.0):
    t = tt(dur); f = f0 * (f1 / f0) ** (t / dur)
    return fade(vol * .06 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / dur))

def scribble(dur, vol=1.0):
    n = int(dur * SR); x = band_noise(dur, 3200, 4200, bw=.5, vol=1)
    strokes = (np.sin(2 * np.pi * 7 * np.arange(n) / SR) ** 2) * (.6 + .4 * rs.random(n).cumsum() % 1)
    return vol * .35 * x * strokes

# ---------------------------------------------------------------- AKTE I — de echo (generiek, bewust)
for i, t0 in enumerate(C["msg_waves"]):
    count = [1, 3, 6, 18][i]
    span = [0, .18, .3, .9][i]
    for k in range(count):
        add("echo", ping(.9 if i < 2 else .55, hi=k % 2 == 1), t0 + (span * k / max(1, count - 1) if count > 1 else 0), pan=rs.uniform(-.7, .7), send=.2)
add("echo", pad([48, 52, 55, 59, 62], 2.4, att=1.2, rel=.4, cutoff=1800, vol=.07), 0.2, send=.3)
# harde cut naar de AI-tools: whoosh + brede "AI-reclame"-pad + sparkle-arpeggio
add("echo", band_noise(.7, 600, 4000, bw=1.0, shape=lambda p: p ** 2 * np.exp(-(p - 1) ** 2), vol=.35), C["ai_cut"] - .62)
add("echo", sub(36, 1.2, .55), C["ai_cut"])
add("echo", pad([50, 54, 57, 61, 64, 69], C["tape_stop"] - C["ai_cut"] + .4, att=.25, rel=.1, bright=True, vol=.13), C["ai_cut"], send=.45)
spark_notes = [86, 90, 93, 97, 98, 102]
k = 0; tcur = C["ai_cut"] + .1
while tcur < C["tape_stop"]:
    add("echo", bell(spark_notes[k % 6], .35, dur=.9, ratio=2.0, index=1.2), tcur, pan=(-.6 if k % 2 else .6), send=.5)
    k += 1; tcur += E8 / 2
# typen, enter, de bol
nch = len("maak iets origineels")
for i in range(nch):
    add("echo", tick(3200 + rs.uniform(-400, 400), .55, .006), C["type_start"] + (C["type_end"] - C["type_start"]) * i / nch, pan=rs.uniform(-.2, .2))
add("echo", tick(1200, 1.0, .01), C["enter"])
add("echo", band_noise(.5, 800, 6000, bw=.9, shape=lambda p: p ** 3, vol=.3), C["orb"] - .5)
add("echo", band_noise(1.2, 3000, 300, bw=1.1, shape=lambda p: np.exp(-p * 4), vol=.4), C["orb"], send=.4)
add("echo", sub(33, 1.0, .7), C["orb"])
for i, m in enumerate([93, 97, 100, 105]):
    add("echo", bell(m, .5, 1.6, 2.0, 1.5), C["orb"] + .05 + i * .06, pan=(i - 1.5) * .4, send=.6)

# ---------------------------------------------------------------- BELOFTE
add("sfx", stamp(.2), C["promise_1"] + .1, send=.15)
add("sfx", stamp(.2), C["promise_2"] + .1, send=.15)
add("sfx", scribble(.32, .6), C["promise_2"] + .35, pan=.4)
add("sfx", stamp(.5), C["promise_2"] + .62, pan=.35, send=.2)
MOTIF = [69, 76, 74, 72, 76, 79, 76, 74, 72]
for i, m in enumerate(MOTIF):              # de lus tekent zich: de negen noten van het motief
    add("music", marimba(m + 12, .5 + .05 * i), C["ring_draw"] + i * .07, pan=(i - 4) * .12, send=.35)

# ---------------------------------------------------------------- DE LUS — motief over de secties
def motif_run(t0, t1, step=E8, gain=.55, pan=0.0, transpose=0, drop=None, variant=None, send=.25):
    k = int(round((t0 - 12.0) / step)) if step == E8 else 0
    t = t0
    while t < t1 - 1e-6:
        idx = k % 9
        if not (drop and drop(k)):
            notes = variant if variant else MOTIF
            m = notes[idx] + transpose
            acc = 1.0 if idx == 0 else (.78 if (k % 8) == 0 else .6)
            add("music", marimba(m, acc), t, gain=gain, pan=pan, send=send)
        k += 1; t += step

S = {s["id"]: s for s in TL["scenes"]}
# S1 waarnemen — motief solo + zachte pad
motif_run(12.0, 18.0, gain=.5)
add("music", sine_pad([45, 52, 57, 60], 6.0, att=1.2, vol=.10), 12.0, send=.3)
for t0 in C["signals"]:
    add("sfx", ping(.35, hi=True), t0, pan=.6, send=.4)
add("sfx", tick(1500, 1.0, .02), C["post_lock"]); add("sfx", stamp(.3), C["post_lock"])
add("sfx", band_noise(.55, 500, 2500, bw=.9, vol=.18), C["post_open"] - .05, pan=.4)
# S2 bevragen — gaten in het motief, onopgeloste vraag
motif_run(18.0, 22.0, gain=.5, drop=lambda k: k % 3 == 2)
add("music", sine_pad([41, 48, 52, 59], 4.0, att=.8, vol=.10), 18.0, send=.3)
add("music", bell(76, .6), C["line_s2"], pan=-.3, send=.5); add("music", bell(82, .6), C["line_s2"] + .5, pan=.3, send=.5)
add("sfx", scribble(.55, .7), C["circle"], pan=.45)
add("sfx", band_noise(.75, 400, 3000, bw=.6, vol=.10), C["read_sweep"], pan=.5)
for t0, m in zip(C["checks"], [88, 93]):
    add("sfx", marimba(m, .6, .8), t0, pan=.4, send=.3)
# S3 ontleden — hats + sub, tik per laag, stempel
motif_run(22.0, 28.0, gain=.48)
add("music", sine_pad([38, 45, 48, 53, 64], 6.0, att=.6, vol=.10), 22.0, send=.3)
for b in np.arange(22.0, 28.0, BEAT * 4): add("music", sub(38, 1.6, .38), b)
for h in np.arange(22.0, 28.0, E8 / 2): add("music", hat(.5 if (h * 4) % 2 < 1 else .3), h, pan=.25)
add("sfx", band_noise(1.0, 200, 900, bw=.9, vol=.22), C["tilt"], send=.2)
for i, t0 in enumerate(C["layers"]):
    add("sfx", tick(900 + i * 160, .9, .03), t0, pan=.3 + i * .05, send=.2)
add("sfx", stamp(1.0), C["unknown_stamp"], pan=.3, send=.25)
# S4 genereren — tweede stem, plucks, pops
motif_run(28.0, 32.0, gain=.45)
motif_run(28.0, 32.0, gain=.3, transpose=3, pan=.35, send=.3)
add("music", sine_pad([41, 48, 53, 57, 64], 4.0, att=.4, vol=.10), 28.0, send=.3)
for i, t0 in enumerate(np.arange(28.0, 32.0, E8 / 2)):
    add("music", pluck([53, 57, 60, 64][i % 4] + 12, .5), t0, pan=-.4, send=.2)
for b in np.arange(28.0, 32.0, BEAT * 4): add("music", sub(41, 1.6, .38), b)
add("sfx", pop(560, .8), C["graph_root"]); add("sfx", zip_(), C["graph_root"] + .15, pan=.3)
for i, t0 in enumerate(C["hypotheses"]):
    add("sfx", pop(700 + i * 120, .7), t0, pan=.2 + i * .15); add("sfx", zip_(600, 1800, .25, .8), t0 - .1, pan=.3)
# S5 experimenteren — A links, B rechts (B is een variant)
VARIANT = [69, 72, 76, 74, 79, 74, 72, 76, 74]
motif_run(32.0, 40.55, gain=.42, pan=-.65)
motif_run(32.0, 40.55, gain=.36, pan=.65, transpose=-5, variant=VARIANT)
add("music", sine_pad([43, 50, 57, 59], 4.0, att=.3, vol=.10), 32.0, send=.3)
for b in np.arange(32.0, 36.0, BEAT * 4): add("music", sub(43, 1.6, .4), b)
for h in np.arange(32.0, 40.0, E8 / 2): add("music", hat(.35), h, pan=(-.5 if (h * 8) % 2 < 1 else .5))
add("sfx", band_noise(.5, 300, 2000, bw=.8, vol=.2), C["lanes"] - .15, pan=-.3)
add("sfx", band_noise(.5, 300, 2000, bw=.8, vol=.2), C["lanes"] - .05, pan=.4)
# S6 meten — kick + metronoom, tellerticks
for b in np.arange(36.0, 40.5, BEAT): add("music", kick(.75), b)
for b in np.arange(36.0, 40.5, E8): add("music", tick(2400, .35, .012), b, pan=.1)
add("music", sine_pad([45, 52, 57, 60], 4.5, att=.3, rel=.1, vol=.10), 36.0, send=.3)
for b in np.arange(36.0, 40.5, BEAT * 4): add("music", sub(45, 1.6, .42), b)
ct = C["count"]
while ct < C["count_end"]:
    add("sfx", tick(3000, .45, .006), ct, pan=rs.uniform(-.3, .3))
    ct += .035 + .09 * ((ct - C["count"]) / (C["count_end"] - C["count"])) ** 2
# S7 loslaten — stempel, val, stilte, drone, één klok
add("sfx", stamp(1.25), C["reject_stamp"], pan=.45, send=.3)
add("sfx", band_noise(.6, 2500, 180, bw=.9, shape=lambda p: np.sin(np.pi * p) ** .5, vol=.35), C["fall"], pan=.5)
add("music", sine_pad([33, 40], 2.9, att=.9, rel=.3, vol=.16), C["silence"][1], send=.3)
add("music", bell(81, .7), C["line_s7a"], send=.6)
add("music", bell(69, .9), C["line_s7b"], send=.6); add("music", bell(76, .6), C["line_s7b"] + .02, send=.6)
add("music", band_noise(1.0, 400, 5000, bw=1.0, shape=lambda p: p ** 2.5, vol=.28), 43.0, send=.2)
# S8 ontdekken — oplossing naar majeur: C · F · G · C
CH = [(44.0, [48, 55, 60, 64, 67], 36), (46.0, [41, 53, 57, 60, 65], 41), (48.0, [43, 55, 59, 62, 67], 43), (50.0, [48, 55, 60, 64, 72], 36)]
for t0, ms, root in CH:
    add("music", pad(ms, 2.0, att=.15, rel=.5, cutoff=2600, vol=.085), t0, send=.35)
    add("music", sub(root, 1.9, .45), t0)
    for i, b in enumerate(np.arange(t0, t0 + 2.0, E8 / 2)):
        add("music", pluck(ms[1:][i % 4] + 12, .4), b, pan=.45, send=.2)
motif_run(44.0, 52.0, gain=.45)
for b in np.arange(44.0, 52.0, BEAT): add("music", kick(.8), b)
for h in np.arange(44.0, 52.0, E8 / 2): add("music", hat(.4 if (h * 4) % 2 < 1 else .22), h, pan=.3)
add("sfx", stamp(1.0), 44.0, send=.3)
for i in range(18): add("sfx", tick(2600, .4, .006), C["days"] + i * .55 / 18, pan=.5)
add("sfx", stamp(.45), C["vacancy"] + .2, pan=.3)
add("sfx", stamp(1.1), C["replacement"], pan=.2, send=.25)
add("sfx", band_noise(.7, 300, 2500, bw=.9, vol=.25), C["brief"] - .1, send=.2)
for i in range(30): add("sfx", tick(3100, .3, .005), C["scores"] + i / 30, pan=rs.uniform(-.2, .3))
add("sfx", band_noise(.75, 900, 1600, bw=.5, vol=.08), C["cursor"], pan=.6)
add("sfx", tick(1100, 1.0, .012), C["approve"] - .07, pan=.4)
add("sfx", stamp(1.35), C["approve"] + .05, pan=.3, send=.35)
add("music", bell(84, .7), C["approve"] + .05, send=.6)
# S9 herhalen — dubbel tempo, riser
motif_run(52.0, 56.0, step=E8 / 2, gain=.4)
for t0, ms, root in [(52.0, [45, 52, 57, 60, 64], 33), (54.0, [41, 53, 57, 60, 65], 41), (55.0, [43, 55, 59, 62, 67], 43)]:
    add("music", pad(ms, 2.0 if t0 == 52.0 else 1.0, att=.1, rel=.2, cutoff=3000, vol=.08), t0, send=.3)
    add("music", sub(root, 1.0, .45), t0)
for b in np.arange(52.0, 56.0, BEAT): add("music", kick(.85), b)
add("sfx", pop(500, .6), C["move"] - .1); add("sfx", pop(760, .6), C["move"] + .35)
for i, t0 in enumerate(C["montage"]):
    add("sfx", stamp(.32), t0 + .2, pan=.4)
add("music", band_noise(2.0, 300, 7000, bw=1.0, shape=lambda p: p ** 2, vol=.32), 54.0, send=.3)

# ---------------------------------------------------------------- AFSLUITER
add("music", kick(1.2), C["outro_hit"]); add("music", sub(29, 3.0, .75), C["outro_hit"]); add("sfx", stamp(.9), C["outro_hit"], send=.4)
add("music", pad([41, 48, 55, 57, 60, 64, 67], 2.6, att=.02, rel=1.4, cutoff=2800, vol=.13), C["outro_hit"], send=.5)
for i, m in enumerate([72, 76, 79]): add("music", marimba(m, .8), C["outro_hit"] + i * .02, send=.4)
add("music", sine_pad([48, 55, 62, 64], 3.4, att=.4, rel=1.0, vol=.12), C["outro_2"], send=.5)
add("music", marimba(84, .5), C["outro_2"], send=.4)
# audiologo: drie stijgende kwinten (C–G–D), open, de lus loopt door
for i, m in enumerate([72, 79, 86]):
    add("music", marimba(m, .9 - i * .1, 2.4), C["logo"] + i * .18, send=.45)
    add("music", bell(m + 12, .45, 3.2), C["logo"] + i * .18, send=.6)
add("music", sine_pad([36, 43], 3.0, att=.3, rel=.6, vol=.16), C["logo"], send=.4)

# ---------------------------------------------------------------- reverb, tape-stop, stilte, master
def ir(rt=1.8, pre=.015):
    n = int(rt * 1.2 * SR); t = np.arange(n) / SR
    out = np.zeros((2, n + int(pre * SR)))
    for c in range(2):
        x = rs.standard_normal(n) * np.exp(-6.9 * t / rt)
        x = sg.lfilter(*sg.butter(1, 5200 / (SR / 2)), x)
        out[c, int(pre * SR):] = x
    return out / np.sqrt((out ** 2).sum() / 2)

R = ir()
wet = np.vstack([sg.fftconvolve(buses["send"][c], R[c])[:N] for c in range(2)]) * .22

# tape-stop op de echo-bus: afspeelsnelheid zakt naar nul tussen tape_stop en hard_cut
a, b = int(C["tape_stop"] * SR), int(C["hard_cut"] * SR)
seg = buses["echo"][:, a:b].copy()
L = b - a; rate = np.linspace(1, 0, L) ** 1.3
pos = np.cumsum(rate); pos = pos - pos[0]
for c in range(2):
    buses["echo"][c, a:b] = np.interp(pos, np.arange(L), seg[c])
buses["echo"][:, b:] = 0
wet_echo_cut = wet.copy(); wet_echo_cut[:, b:b + int(.02 * SR)] *= np.linspace(1, 0, int(.02 * SR))

mix = buses["music"] * .95 + buses["sfx"] * .8 + buses["echo"] * .55 + wet
# harde stilte op de cut (8,0 s) en bij Loslaten
def gate(t0, t1, f=.012):
    i0, i1, nf = int(t0 * SR), int(t1 * SR), int(f * SR)
    mix[:, i0 - nf:i0] *= np.linspace(1, 0, nf); mix[:, i0:i1] = 0; mix[:, i1:i1 + nf] *= np.linspace(0, 1, nf)
gate(C["hard_cut"], C["hard_cut"] + .3)
gate(C["silence"][0], C["silence"][1])
mix[:, -int(1.2 * SR):] *= np.linspace(1, 0, int(1.2 * SR)) ** 2   # natuurlijke uitloop

# zachte bus-compressie (RMS, traag) + true-peak-veilige limiter
def compress(x, thr_db=-16, ratio=2.2, win=.05):
    rms = np.sqrt(sg.lfilter([1], [1, -np.exp(-1 / (win * SR))], (x ** 2).mean(0)) * (1 - np.exp(-1 / (win * SR))) + 1e-12)
    lvl = 20 * np.log10(rms); over = np.maximum(lvl - thr_db, 0)
    g = 10 ** (-(over - over / ratio) / 20)
    return x * g

mix = compress(mix)
meter = pyln.Meter(SR)
gain_db = -14.0 - meter.integrated_loudness(mix.T)
mix *= 10 ** (gain_db / 20)

def limiter(x, ceil_db=-1.8, look=.004, rel=.08):
    ceil = 10 ** (ceil_db / 20)
    up = sg.resample_poly(x, 4, 1, axis=1)                    # true-peak-schatting via 4× oversampling
    pk = np.abs(up).max(0).reshape(-1, 4).max(1)[:x.shape[1]]
    need = np.minimum(1, ceil / np.maximum(pk, 1e-9))
    k = int(look * SR)
    # minimum over het lookahead-venster, daarna release
    from scipy.ndimage import minimum_filter1d
    g = minimum_filter1d(need, size=2 * k + 1)
    a_rel = np.exp(-1 / (rel * SR)); out = np.empty_like(g); cur = 1.0
    for i in range(len(g)):
        cur = g[i] if g[i] < cur else a_rel * cur + (1 - a_rel) * g[i]
        out[i] = cur
    return x * out

mix = limiter(mix)
for _ in range(2):   # na limiter opnieuw normaliseren (kleine correctie) en opnieuw begrenzen
    mix *= 10 ** ((-14.0 - meter.integrated_loudness(mix.T)) / 20)
    mix = limiter(mix)

# ---------------------------------------------------------------- wegschrijven + rapport
wav = ROOT / "assets/soundtrack.wav"
pcm = np.clip(mix.T, -1, 1)
import wave
with wave.open(str(wav), "wb") as w:
    w.setnchannels(2); w.setsampwidth(3); w.setframerate(SR)
    ints = np.ascontiguousarray((pcm * (2 ** 23 - 1)).astype('<i4'))
    b3 = ints.view(np.uint8).reshape(-1, 4)[:, :3].tobytes()
    w.writeframes(b3)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(wav), "-c:a", "libmp3lame", "-b:a", "192k", str(ROOT / "assets/soundtrack.mp3")], check=True)  # MP3: speelt in elke browser

up = sg.resample_poly(mix, 4, 1, axis=1)
tp = 20 * np.log10(np.abs(up).max())
print(f"integrated: {meter.integrated_loudness(mix.T):.2f} LUFS · true peak ≈ {tp:.2f} dBTP")
for s in TL["scenes"]:
    seg = mix[:, int(s['start'] * SR):int(s['end'] * SR)]
    try: l = meter.integrated_loudness(seg.T)
    except Exception: l = float('nan')
    print(f"  {s['id']:9s} {s['start']:5.1f}-{s['end']:5.1f}s  {l:6.1f} LUFS")
