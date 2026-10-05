"""Controle van de gerenderde film: specs, loudness en of de geluidsklappen op de beeldmomenten vallen.

Gebruik: python3 tools/verify.py out/recruitment-ai-de-lus.mp4
"""
import json, re, subprocess, sys, pathlib
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
mp4 = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / "out/recruitment-ai-de-lus.mp4")
TL = json.loads(re.search(r"window\.TIMELINE\s*=\s*(\{.*\});", (ROOT / "timeline.js").read_text(), re.S).group(1))
C = TL["cues"]

probe = json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(mp4)], capture_output=True, text=True).stdout)
v = next(s for s in probe["streams"] if s["codec_type"] == "video"); a = next(s for s in probe["streams"] if s["codec_type"] == "audio")
print(f"bestand   {mp4.name} · {int(probe['format']['size']) / 1e6:.1f} MB · {float(probe['format']['duration']):.3f} s")
print(f"beeld     {v['codec_name']} {v['width']}×{v['height']} · {v['r_frame_rate']} fps · {v.get('nb_frames', '?')} frames · {v['pix_fmt']}")
print(f"geluid    {a['codec_name']} {a['sample_rate']} Hz · {a['channels']} kanalen · {int(a.get('bit_rate', 0)) // 1000} kb/s")

r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(mp4), "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
I = re.search(r"Integrated loudness:\s+I:\s+(-?[\d.]+)", r).group(1); TP = re.search(r"True peak:\s+Peak:\s+(-?[\d.]+)", r).group(1)
LRA = re.search(r"LRA:\s+(-?[\d.]+)", r).group(1)
print(f"loudness  {I} LUFS geïntegreerd · true peak {TP} dBFS · LRA {LRA} LU")

# synchronisatie: zoek per beeldcue de sterkste transiënt binnen ±150 ms
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(mp4), "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True).stdout
x = np.frombuffer(raw, np.float32); SR = 16000
hop = 80                                            # 5 ms
e = np.sqrt(np.convolve(x ** 2, np.ones(hop) / hop, "same")[::hop] + 1e-12)
flux = np.maximum(np.diff(20 * np.log10(e), prepend=-120), 0)
checks = {"UNKNOWN-stempel": C["unknown_stamp"], "AFGEWEZEN-stempel": C["reject_stamp"], "vervangingssignaal": C["replacement"],
          "goedgekeurd": C["approve"] + .05, "slotklap": C["outro_hit"], "ring tekent (1e noot)": C["ring_draw"]}
print("sync      cue → sterkste geluidsaanzet (±150 ms)")
worst = 0
for name, t in checks.items():
    i0, i1 = int((t - .15) * SR / hop), int((t + .15) * SR / hop)
    k = i0 + int(np.argmax(flux[i0:i1])); dt = (k * hop / SR - t) * 1000
    worst = max(worst, abs(dt)); print(f"          {name:22s} {t:6.2f} s → {dt:+5.0f} ms")
for name, (t0, t1) in {"harde cut": (C["hard_cut"] + .03, C["hard_cut"] + .27), "loslaten": (C["silence"][0] + .03, C["silence"][1] - .03)}.items():
    seg = x[int(t0 * SR):int(t1 * SR)]
    print(f"stilte    {name:22s} {t0:5.2f}–{t1:5.2f} s → piek {20 * np.log10(np.abs(seg).max() + 1e-9):6.1f} dBFS")
print(f"grootste sync-afwijking: {worst:.0f} ms (één frame = {1000 / TL['fps']:.1f} ms)")
