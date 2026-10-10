/* ═════════════ GELUID ═════════════
   Alles wordt hier zelf opgewekt: een kleine synthesizer in JavaScript (oscillatoren, filters,
   galm), gerenderd tot één stereospoor dat exact met de tijdlijn meeloopt.
   Tempo 120: 1 tel = 0,5 s, 1 maat = 2 s. Toonsoort d-klein, slot in D-groot. */
const SR = 44100;

// De partituur: een lijst gebeurtenissen (instrument + tijd + parameters)
function buildScore() {
  const EV = [];
  const ev = (type, o) => EV.push(Object.assign({ type }, o));
  const pad = (t, dur, notes, gain, bright = 1) => ev("pad", { t, dur, notes, gain, bright });
  const bass = (t, dur, m, gain) => ev("bass", { t, dur, m, gain });
  const kick = (t, gain) => ev("kick", { t, gain });
  const hat = (t, gain, open = false, pan = 0.2) => ev("hat", { t, gain, open, pan });
  const snare = (t, gain) => ev("snare", { t, gain });
  const pluck = (t, m, gain, pan = 0, send = 0.45, len = 0.7) => ev("pluck", { t, m, gain, pan, send, len });
  const boom = (t, gain) => ev("boom", { t, gain });
  const riser = (t0, t1, gain) => ev("riser", { t: t0, t1, gain });
  const whoosh = (t, dur, gain, up = true, pan = 0) => ev("whoosh", { t, dur, gain, up, pan });
  const tick = (t, gain, freq = 2600) => ev("tick", { t, gain, freq });
  const crackle = (t0, t1, gain) => ev("crackle", { t: t0, t1, gain });

  const PROG = [[50, 53, 57, 62], [46, 50, 53, 58], [48, 53, 57, 60], [48, 52, 55, 60]]; // Dm  Bb  F  C
  const ROOT = [38, 34, 41, 36];
  const chordIn = (t0) => (t) => Math.floor(Math.max(0, t - t0) / 4) % 4;
  const beat = 0.5;
  const W = CUE.wg, LS_ = CUE.ls, RU_ = CUE.ru;

  // 1 · het kamp: knisperend vuur, een paar zachte tonen, de zon komt op
  crackle(0.4, CUE.pull[1] + 1.5, 0.22);
  pad(0.8, T.s2 - 0.8, [38, 50, 57, 62], 0.045, 0.6);
  [74, 77, 81, 86, 81, 77].forEach((m, i) => pluck(1.0 + i * 0.26, m, 0.045, i % 2 ? 0.5 : -0.5, 0.8, 1.4));
  CUE.hook.forEach((h, i) => { boom(h, 0.5); pad(h, 1.8, PROG[i].map((m) => m + 12), 0.035, 1.6); kick(h, 0.6); });
  pad(CUE.sunrise[0], CUE.sunrise[1] - CUE.sunrise[0] + 3.0, [50, 57, 62, 66, 69], 0.045, 1.6); // zonsopgang (D-groot)
  [62, 66, 69, 74, 78].forEach((m, i) => pluck(CUE.sunrise[0] + 0.6 + i * 0.3, m, 0.05, (i - 2) * 0.3, 0.9, 1.8));
  whoosh(CUE.push, 2.2, 0.2, true);
  riser(CUE.push - 0.4, T.s2, 0.25);
  // 2 · de kandidaten
  { const ch = chordIn(T.s2);
    boom(T.s2, 0.5);
    for (let t = T.s2; t < T.s3 - 0.1; t += 4) pad(t, Math.min(4, T.s3 - t), PROG[ch(t)], 0.045, 1.0);
    for (let t = T.s2; t < T.s3 - 0.1; t += 1) kick(t, 0.42);
    for (let t = T.s2 + 0.5; t < T.s3 - 0.1; t += 0.5) hat(t, 0.045, false, t % 1 ? 0.3 : -0.3);
    const penta = [62, 65, 67, 69, 72, 74, 77, 79, 81, 84];
    pinOrder.forEach((n, i) => pluck(CUE.pinA + i * CUE.pinStep, penta[i % penta.length] - (i >= 10 ? 12 : 0) - (i >= 30 ? 12 : 0), 0.05, (MAP.pts[n][0] - 960) / 960, 0.5, 0.5));
    whoosh(CUE.drop - 0.3, 0.9, 0.16, false);
    pluck(CUE.drop, 46, 0.12, 0, 0.4, 1.0); pluck(CUE.drop + 0.14, 45, 0.1, 0, 0.4, 1.0);
    kick(CUE.count, 0.7); [69, 74, 78].forEach((m) => pluck(CUE.count + 0.2, m, 0.06, 0, 0.8, 1.6));
    riser(T.s3 - 1.8, T.s3, 0.25); }
  // 3 · de weging
  { const ch = chordIn(T.s3);
    boom(T.s3, 0.5);
    for (let t = T.s3; t < T.s4 - 0.1; t += 4) pad(t, Math.min(4, T.s4 - t), PROG[ch(t)], 0.045, 0.9);
    for (let t = T.s3; t < T.s4 - 0.1; t += 1) kick(t, 0.4);
    for (let t = T.s3 + 0.5; t < T.s4 - 0.1; t += 1) hat(t, 0.05);
    for (let t = W.tiles; t < W.tiles + 1.6; t += 0.05) tick(t, 0.045, 2200 + (t - W.tiles) * 700); // tegels verschijnen
    whoosh(W.fly - 0.2, 1.4, 0.18, false);
    const lay = [38, 45, 50];
    PACK.layerTimes.forEach((t, i) => pluck(t + 0.1, lay[i % lay.length], 0.1, 0, 0.3, 0.6));
    [74, 78, 81].forEach((m, i) => pluck(W.shares + i * 0.06, m, 0.07, (i - 1) * 0.4, 0.8, 1.4));
    W.meter.forEach((t, i) => { whoosh(t, 0.5, 0.08, true, 0.3); for (let k = 0; k < 14; k++) tick(t + 0.5 + k * 0.08, 0.03, 1500 + k * 120); pluck(t + 1.6, [69, 74, 78][i], 0.07, 0, 0.8, 1.2); });
    (DATA.rondeOverzicht || []).forEach((r, k) => pluck(W.cols + k * 0.25, [62, 65, 69, 72, 74][k % 5] + 12, 0.04, (k / 10 - 0.5) * 1.2, 0.5, 0.35));
    whoosh(W.merge - 0.2, 1.4, 0.2, true); boom(W.merge + 1.0, 0.45); pluck(W.merge + 1.0, 62, 0.1, 0, 0.7, 1.4);
    riser(T.s4 - 1.8, T.s4, 0.3); }
  // 4 · het landschap (nacht): donker en breed
  { const ch = chordIn(T.s4);
    boom(T.s4, 0.6);
    for (let t = T.s4; t < T.s5 - 0.1; t += 4) pad(t, Math.min(4, T.s5 - t), PROG[ch(t)].map((m) => m - 12).concat(PROG[ch(t)][3]), 0.05, 0.8);
    for (let t = T.s4 + 1; t < T.s5 - 0.1; t += 1) kick(t, 0.32);
    for (let t = T.s4; t < T.s5 - 0.1; t += 0.5) bass(t, 0.45, ROOT[ch(t)], 0.1);
    for (let t = T.s4 + 4; t < T.s5 - 0.6; t += 0.5) hat(t + 0.25, 0.04);
    riser(LS_.grow, LS_.a + 0.4, 0.14);
    [57, 62, 65, 69].forEach((m, i) => pluck(LS_.a + i * 0.16, m, 0.05, (i - 1.5) * 0.4, 0.8, 1.4));
    boom(LS_.peaks, 0.4); [86, 90, 93].forEach((m, i) => pluck(LS_.peaks + 0.1 + i * 0.08, m, 0.06, (i - 1) * 0.5, 0.9, 1.6));
    whoosh(LS_.sort - 0.3, 1.2, 0.2, true);
    ELIG.forEach((c, j) => pluck(LS_.sort + j * 0.05, [62, 65, 69, 72, 74, 77, 81, 84][j % 8], 0.035, (j / ELIG.length - 0.5) * 1.2, 0.5, 0.35));
    kick(LS_.top, 0.6); [69, 74, 78].forEach((m) => pluck(LS_.top + 0.1, m, 0.06, 0, 0.8, 1.6));
    riser(LS_.end - 1.6, LS_.end, 0.3); }
  // 5 · de race (volle groove)
  { const ch = chordIn(T.s5);
    boom(T.s5, 0.6);
    const drop = CUE.race[Math.min(2, CUE.race.length - 1)];
    const gap = (t) => t > drop - 0.5 && t < drop;
    const fast = CUE.race[Math.min(3, CUE.race.length - 1)];
    for (let t = T.s5; t < T.s6 - 0.1; t += 4) pad(t, Math.min(4, T.s6 - t), PROG[ch(t)], 0.04, 1.3);
    for (let t = T.s5; t < T.s6 - 0.05; t += beat) if (!gap(t + 0.01)) kick(t, t < fast ? 0.42 : 0.6);
    for (let t = T.s5 + 0.25; t < T.s6 - 0.1; t += beat) if (!gap(t)) hat(t, 0.07, Math.round((t - T.s5) / 0.25) % 4 === 3);
    for (let t = T.s5 + 2.5; t < T.s6 - 0.1; t += 1) if (!gap(t)) snare(t, t > CUE.finalLabel ? 0.12 : 0.18);
    for (let t = T.s5; t < T.s6 - 0.1; t += 0.25) if (!gap(t)) bass(t, 0.22, ROOT[ch(t)] + (Math.round((t - T.s5) / 0.25) % 8 === 6 ? 12 : 0), 0.14);
    for (let t = T.s5 + 4; t < T.s6 - 0.1; t += 0.125) {
      if (gap(t)) continue;
      const i = Math.round((t - T.s5) / 0.125);
      pluck(t, PROG[ch(t)][[0, 1, 2, 3, 2, 1, 3, 2][i % 8]] + 12, 0.032, i % 2 ? 0.45 : -0.45, 0.35, 0.22);
    }
    CUE.race.forEach((t, i) => { whoosh(t - 0.18, 0.35, i < 3 ? 0.16 : 0.09, true, i % 2 ? 0.4 : -0.4); tick(t, 0.07, 3200); });
    boom(drop, 0.75); pluck(drop, 41, 0.18, 0, 0.6, 1.4);
    const last = CUE.race[CUE.race.length - 1];
    boom(last, 0.6);
    pad(last, 3.2, [50, 57, 62, 65, 69], 0.04, 1.8);
    riser(T.s6 - 1.6, T.s6, 0.2); }
  // 6 · de ruimte (lichter, zwevend)
  { const ch = chordIn(T.s6);
    for (let t = T.s6; t < T.s7; t += 4) pad(t, Math.min(4, T.s7 - t), PROG[ch(t)], 0.05, 0.8);
    for (let t = T.s6; t < T.s7 - 0.1; t += 0.5) hat(t + 0.25, 0.045);
    for (let t = T.s6; t < T.s7 - 0.1; t += 1) kick(t, 0.32);
    for (let t = T.s6; t < T.s7 - 0.1; t += 0.25) { const i = Math.round((t - T.s6) / 0.25); pluck(t, PROG[ch(t)][[0, 2, 1, 3][i % 4]] + 12, 0.025, i % 2 ? 0.5 : -0.5, 0.5, 0.3); }
    for (let t = T.s6; t < T.s7 - 0.1; t += 0.5) bass(t, 0.45, ROOT[ch(t)], 0.08);
    ELIG.forEach((c, j) => tick(RU_.dots + j * 0.03, 0.03, 1800 + j * 30));
    whoosh(RU_.flat[0], 1.6, 0.14, false);
    RU_.focus.forEach((t, i) => { pluck(t, [74, 77, 81][i], 0.08, 0, 0.8, 1.3); whoosh(t - 0.15, 0.3, 0.07); });
    riser(T.s7 - 1.4, T.s7, 0.15); }
  // 7 · het podium: roffel, klap, D-groot
  boom(T.s7, 0.45);
  pad(T.s7, 3, [46, 50, 53, 58], 0.05, 1.2);
  pad(T.s7 + 3, 2.4, [48, 52, 55, 60], 0.05, 1.4);
  CUE.podium.slice(0, 2).forEach((t) => { kick(t, 0.6); pluck(t, 57, 0.08, 0, 0.5, 0.8); });
  { const a = T.s7 + 4.0, b = CUE.podium[2];
    for (let t = a, step = 0.18; t < b - 0.03; t += step, step = Math.max(0.045, step * 0.9)) snare(t, 0.06 + 0.16 * ((t - a) / (b - a)));
    riser(a - 0.4, b, 0.3); }
  boom(CUE.podium[2], 0.9);
  pad(CUE.podium[2], T.s8 - CUE.podium[2] - 0.4, [38, 50, 54, 57, 62, 66], 0.06, 1.8);
  for (let t = CUE.podium[2]; t < T.s8 - 0.6; t += 0.5) kick(t, 0.5);
  for (let t = CUE.podium[2] + 0.25; t < T.s8 - 0.6; t += 0.5) hat(t, 0.06, true);
  for (let t = CUE.podium[2]; t < T.s8 - 0.6; t += 0.25) bass(t, 0.22, 38, 0.12);
  [74, 78, 81, 86, 90].forEach((m, i) => pluck(CUE.podium[2] + 0.05 + i * 0.07, m, 0.07, (i - 2) * 0.3, 0.9, 1.6));
  for (let t = CUE.podium[2] + 1; t < T.s8 - 0.6; t += 0.125) { const i = Math.round((t - CUE.podium[2]) / 0.125); pluck(t, [62, 66, 69, 74][i % 4] + 12, 0.028, i % 2 ? 0.5 : -0.5, 0.4, 0.2); }
  // 8 · de bestemming: rustig, de route, de lijst, het slotakkoord
  pad(T.s8, 3, [46, 50, 53, 58], 0.045, 0.8);
  pad(T.s8 + 2.6, 2.4, [41, 48, 53, 57], 0.045, 0.8);
  [69, 67, 65, 62].forEach((m, i) => pluck(T.s8 + 0.4 + i * 0.4, m, 0.06, (i - 1.5) * 0.3, 0.7, 1.2));
  for (let t = CUE.route; t < CUE.routeEnd; t += 0.25) pluck(t, [62, 66, 69, 74, 78, 74, 69, 66][Math.round((t - CUE.route) / 0.25) % 8], 0.035, 0.3, 0.6, 0.4);
  [74, 78, 81, 86].forEach((m, i) => pluck(CUE.routeEnd - 0.2 + i * 0.12, m, 0.07, (i - 1.5) * 0.3, 1.0, 2.5));
  boom(CUE.routeEnd - 0.2, 0.4);
  pad(CUE.routeEnd - 0.4, CUE.credits - CUE.routeEnd + 1, [38, 50, 54, 57, 62, 66, 69], 0.055, 1.5);
  for (let i = 0; i < 4; i++) pluck(CUE.list + 0.5 + i * 0.35, [62, 66, 69, 74][i], 0.05, 0.3, 0.6, 0.8);
  pad(CUE.credits - 0.5, T.end - CUE.credits + 1, [38, 50, 54, 57, 62, 66, 69], 0.05, 1.2);
  [74, 78, 81].forEach((m, i) => pluck(CUE.credits + i * 0.3, m, 0.05, (i - 1) * 0.4, 1.0, 3.0));
  return EV;
}

// De synthesizer zelf. Staat los van de rest zodat hij in een achtergrondthread kan draaien.
function synthCore() {
  const TAU = Math.PI * 2;
  function render(events, SR, dur) {
    const N = Math.ceil(SR * dur);
    const L = new Float32Array(N), R = new Float32Array(N), VL = new Float32Array(N), VR = new Float32Array(N);
    let seed = 2027;
    const rnd = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return ((seed >>> 0) / 4294967296) * 2 - 1; };
    const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
    const clampP = (p) => Math.max(-1, Math.min(1, p));
    const pan = (p) => { const a = ((clampP(p) + 1) * Math.PI) / 4; return [Math.cos(a) * Math.SQRT2, Math.sin(a) * Math.SQRT2]; };
    const BQ = () => ({ b0: 1, b1: 0, b2: 0, a1: 0, a2: 0, x1: 0, x2: 0, y1: 0, y2: 0 });
    function setBQ(f, type, freq, Q) {
      const w = (TAU * Math.min(Math.max(freq, 20), SR * 0.45)) / SR, cs = Math.cos(w), sn = Math.sin(w), al = sn / (2 * Q);
      const a0 = 1 + al;
      let b0, b1, b2;
      if (type === 0) { b1 = 1 - cs; b0 = b1 / 2; b2 = b0; }
      else if (type === 1) { b1 = -(1 + cs); b0 = (1 + cs) / 2; b2 = b0; }
      else { b0 = al; b1 = 0; b2 = -al; }
      f.b0 = b0 / a0; f.b1 = b1 / a0; f.b2 = b2 / a0; f.a1 = (-2 * cs) / a0; f.a2 = (1 - al) / a0;
    }
    function bq(f, x) { const y = f.b0 * x + f.b1 * f.x1 + f.b2 * f.x2 - f.a1 * f.y1 - f.a2 * f.y2; f.x2 = f.x1; f.x1 = x; f.y2 = f.y1; f.y1 = y; return y; }
    const expRamp = (a, b, p) => a * Math.pow(b / a, Math.min(1, Math.max(0, p)));
    function blep(t, dt) { if (t < dt) { t /= dt; return t + t - t * t - 1; } if (t > 1 - dt) { t = (t - 1) / dt; return t * t + t + t + 1; } return 0; }
    function span(t, len) { const i0 = Math.max(0, Math.round(t * SR)); return [i0, Math.min(N, i0 + Math.round(len * SR))]; }
    const decay = (k, d) => (k >= d ? 0 : Math.pow(0.001, k / d));

    const I = {
      pad(e) {
        const a = Math.min(1.2, e.dur * 0.4), hold = Math.max(0, e.dur - 1.2), rel = 1.4, len = a + hold + rel;
        const [i0, i1] = span(e.t, len);
        const vs = [];
        e.notes.forEach((m, j) => [-8, 8].forEach((det) => vs.push({ f: mtof(m) * Math.pow(2, (det + (j - 1) * 2) / 1200), p: Math.abs(rnd()), side: det < 0 ? 0 : 1 })));
        const fl = BQ(), fr = BQ();
        const [gl0, gr0] = pan(-0.35), [gl1, gr1] = pan(0.35);
        for (let i = i0; i < i1; i++) {
          const k = (i - i0) / SR;
          if ((i - i0) % 32 === 0) {
            const fc = (500 + 1000 * Math.min(1, k / Math.min(e.dur, 3))) * e.bright;
            setBQ(fl, 0, fc, 0.707); fr.b0 = fl.b0; fr.b1 = fl.b1; fr.b2 = fl.b2; fr.a1 = fl.a1; fr.a2 = fl.a2;
          }
          let sl = 0, sr = 0;
          for (let v = 0; v < vs.length; v++) {
            const o = vs[v], dt = o.f / SR;
            const s = 2 * o.p - 1 - blep(o.p, dt);
            o.p += dt; if (o.p >= 1) o.p -= 1;
            if (o.side) sr += s; else sl += s;
          }
          const env = k < a ? k / a : k < a + hold ? 1 : Math.max(0, 1 - (k - a - hold) / rel);
          const yl = bq(fl, sl) * env * e.gain, yr = bq(fr, sr) * env * e.gain;
          const l = yl * gl0 + yr * gl1, r = yl * gr0 + yr * gr1;
          L[i] += l; R[i] += r; VL[i] += l * 0.6; VR[i] += r * 0.6;
        }
      },
      bass(e) {
        const a = 0.006, hold = e.dur * 0.5, rel = e.dur * 0.45;
        const [i0, i1] = span(e.t, a + hold + rel);
        const f = mtof(e.m), dt = f / SR, fl = BQ();
        let p = 0, ps = 0;
        for (let i = i0; i < i1; i++) {
          const k = (i - i0) / SR;
          if ((i - i0) % 16 === 0) setBQ(fl, 0, expRamp(900, 220, k / 0.15), 2);
          const saw = 2 * p - 1 - blep(p, dt);
          p += dt; if (p >= 1) p -= 1;
          const sn = Math.sin(TAU * ps); ps += dt; if (ps >= 1) ps -= 1;
          const env = k < a ? k / a : k < a + hold ? 1 : Math.max(0, 1 - (k - a - hold) / rel);
          const y = (bq(fl, saw) + sn) * env * e.gain;
          L[i] += y; R[i] += y; VL[i] += y * 0.05; VR[i] += y * 0.05;
        }
      },
      kick(e) {
        const [i0, i1] = span(e.t, 0.45);
        let ph = 0;
        const hp = BQ(); setBQ(hp, 1, 3000, 0.707);
        for (let i = i0; i < i1; i++) {
          const k = (i - i0) / SR;
          const f = expRamp(150, 44, k / 0.13);
          ph += f / SR;
          let y = Math.sin(TAU * ph) * e.gain * decay(k, 0.42);
          if (k < 0.016) y += bq(hp, rnd()) * e.gain * 0.25 * (k < 0.001 ? k / 0.001 : 1 - (k - 0.001) / 0.015);
          L[i] += y; R[i] += y;
        }
      },
      hat(e) {
        const d = e.open ? 0.22 : 0.05;
        const [i0, i1] = span(e.t, d + 0.01);
        const hp = BQ(); setBQ(hp, 1, 7800, 0.707);
        const [gl, gr] = pan(e.pan);
        for (let i = i0; i < i1; i++) {
          const k = (i - i0) / SR;
          const y = bq(hp, rnd()) * e.gain * decay(k, d);
          L[i] += y * gl; R[i] += y * gr; VL[i] += y * gl * 0.08; VR[i] += y * gr * 0.08;
        }
      },
      snare(e) {
        const [i0, i1] = span(e.t, 0.22);
        const bp = BQ(); setBQ(bp, 2, 1900, 0.7);
        let ph = 0;
        for (let i = i0; i < i1; i++) {
          const k = (i - i0) / SR;
          const n = bq(bp, rnd()) * e.gain * 2.2 * decay(k, 0.2);
          ph += expRamp(220, 150, k / 0.08) / SR;
          const tri = (1 - 4 * Math.abs((ph % 1) - 0.5)) * e.gain * 0.7 * decay(k, 0.1);
          const y = n + tri;
          L[i] += y; R[i] += y; VL[i] += n * 0.25 + tri * 0.1; VR[i] += n * 0.25 + tri * 0.1;
        }
      },
      pluck(e) {
        const [i0, i1] = span(e.t, e.len + 0.02);
        const f = mtof(e.m), dt = f / SR, lp = BQ();
        const [gl, gr] = pan(e.pan);
        let p = Math.abs(rnd()), p2 = 0;
        for (let i = i0; i < i1; i++) {
          const k = (i - i0) / SR;
          if ((i - i0) % 16 === 0) setBQ(lp, 0, expRamp(5000, 900, k / 0.3), 0.707);
          const tri = 1 - 4 * Math.abs(p - 0.5);
          p += dt; if (p >= 1) p -= 1;
          const sn = Math.sin(TAU * p2) * 0.35; p2 += dt * 2; if (p2 >= 1) p2 -= 1;
          const env = k < 0.004 ? k / 0.004 : decay(k - 0.004, e.len);
          const y = bq(lp, tri + sn) * env * e.gain;
          L[i] += y * gl; R[i] += y * gr; VL[i] += y * gl * e.send; VR[i] += y * gr * e.send;
        }
      },
      boom(e) {
        const [i0, i1] = span(e.t, 1.9);
        const lp = BQ();
        let ph = 0;
        for (let i = i0; i < i1; i++) {
          const k = (i - i0) / SR;
          ph += expRamp(90, 30, k / 1.3) / SR;
          const s = Math.sin(TAU * ph) * e.gain * decay(k, 1.8);
          if ((i - i0) % 16 === 0) setBQ(lp, 0, expRamp(2500, 120, k / 1.0), 0.707);
          const n = bq(lp, rnd()) * e.gain * 0.6 * decay(k, 1.1);
          L[i] += s + n; R[i] += s + n; VL[i] += s * 0.3 + n * 0.6; VR[i] += s * 0.3 + n * 0.6;
        }
      },
      riser(e) {
        const len = e.t1 - e.t;
        const [i0, i1] = span(e.t, len);
        const bp = BQ();
        let ph = 0;
        for (let i = i0; i < i1; i++) {
          const k = (i - i0) / SR, u = k / len;
          if ((i - i0) % 16 === 0) setBQ(bp, 2, expRamp(300, 7000, u), 4);
          let g = expRamp(0.0001, e.gain, k / (len - 0.02));
          if (k > len - 0.02) g = e.gain * Math.max(0, (len - k) / 0.02);
          ph += expRamp(180, 1400, u) / SR;
          const y = (bq(bp, rnd()) * 2.5 + Math.sin(TAU * ph) * 0.25) * g;
          L[i] += y; R[i] += y; VL[i] += y * 0.3; VR[i] += y * 0.3;
        }
      },
      whoosh(e) {
        const [i0, i1] = span(e.t, e.dur);
        const bp = BQ();
        const [gl, gr] = pan(e.pan);
        for (let i = i0; i < i1; i++) {
          const k = (i - i0) / SR, u = k / e.dur;
          if ((i - i0) % 16 === 0) setBQ(bp, 2, e.up ? expRamp(500, 3500, u) : expRamp(3500, 400, u), 1.4);
          const g = u < 0.6 ? expRamp(0.0001, e.gain, u / 0.6) : expRamp(e.gain, 0.0001, (u - 0.6) / 0.4);
          const y = bq(bp, rnd()) * 1.6 * g;
          L[i] += y * gl; R[i] += y * gr; VL[i] += y * gl * 0.2; VR[i] += y * gr * 0.2;
        }
      },
      tick(e) {
        const [i0, i1] = span(e.t, 0.04);
        for (let i = i0; i < i1; i++) {
          const k = (i - i0) / SR;
          const y = Math.sin(TAU * e.freq * k) * e.gain * decay(k, 0.035);
          L[i] += y; R[i] += y; VL[i] += y * 0.1; VR[i] += y * 0.1;
        }
      },
      // kampvuur: zacht gefilterde ruis met willekeurige knapjes
      crackle(e) {
        const len = e.t1 - e.t;
        const [i0, i1] = span(e.t, len);
        const lp = BQ(); setBQ(lp, 0, 900, 0.8);
        const bp = BQ(); setBQ(bp, 2, 3200, 2.5);
        let pop = 0, popK = 0;
        for (let i = i0; i < i1; i++) {
          const k = (i - i0) / SR;
          const g = Math.min(1, k / 0.8) * (k > len - 2.5 ? Math.max(0, (len - k) / 2.5) : 1) * e.gain;
          const n = rnd();
          let y = bq(lp, n) * 0.35 * (0.7 + 0.3 * Math.sin(k * 3.1) * Math.sin(k * 7.7));
          if (pop <= 0 && Math.abs(n) > 0.99985) { pop = 1; popK = 0; }
          if (pop > 0) { y += bq(bp, n) * 1.6 * Math.pow(0.001, popK / 0.03); popK += 1 / SR; if (popK > 0.04) pop = 0; }
          y *= g;
          L[i] += y * 0.8; R[i] += y * 1.0; VL[i] += y * 0.05; VR[i] += y * 0.05;
        }
      },
    };
    for (const e of events) I[e.type](e);

    // galm: Freeverb (8 kamfilters + 4 allpass per kanaal)
    const combT = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617], apT = [556, 441, 341, 225], spread = 23;
    const fb = 0.86 * 0.28 + 0.7, damp = 0.45 * 0.4, wet = 0.55;
    for (let ch = 0; ch < 2; ch++) {
      const out = ch ? R : L, off = ch ? spread : 0;
      const combs = combT.map((n) => ({ b: new Float32Array(n + off), i: 0, s: 0 }));
      const aps = apT.map((n) => ({ b: new Float32Array(n + off), i: 0 }));
      for (let i = 0; i < N; i++) {
        const x = (VL[i] + VR[i]) * 0.015;
        let acc = 0;
        for (let c = 0; c < 8; c++) {
          const cb = combs[c], y = cb.b[cb.i];
          cb.s = y * (1 - damp) + cb.s * damp;
          cb.b[cb.i] = x + cb.s * fb;
          if (++cb.i >= cb.b.length) cb.i = 0;
          acc += y;
        }
        for (let a = 0; a < 4; a++) {
          const ap = aps[a], bo = ap.b[ap.i];
          ap.b[ap.i] = acc + bo * 0.5;
          acc = bo - acc;
          if (++ap.i >= ap.b.length) ap.i = 0;
        }
        out[i] += acc * wet;
      }
    }
    const peakOf = () => { let p = 0; for (let i = 0; i < N; i++) { const a = Math.abs(L[i]), b = Math.abs(R[i]); if (a > p) p = a; if (b > p) p = b; } return p; };
    const scale = (k) => { for (let i = 0; i < N; i++) { L[i] *= k; R[i] *= k; } };
    const rawPeak = peakOf();
    scale(1 / rawPeak);
    const thr = Math.pow(10, -20 / 20), ratio = 4, att = Math.exp(-1 / (0.004 * SR)), relc = Math.exp(-1 / (0.2 * SR));
    let envc = 0;
    for (let i = 0; i < N; i++) {
      const x = Math.max(Math.abs(L[i]), Math.abs(R[i]));
      envc = x > envc ? att * envc + (1 - att) * x : relc * envc + (1 - relc) * x;
      if (envc > thr) { const g = Math.pow(envc / thr, 1 / ratio - 1); L[i] *= g; R[i] *= g; }
    }
    scale(1.9 / peakOf());
    for (let i = 0; i < N; i++) { L[i] = Math.tanh(L[i]); R[i] = Math.tanh(R[i]); }
    scale(0.93 / peakOf());
    const fadeN = Math.round(SR * 1.2);
    for (let i = 0; i < fadeN; i++) { const g = i / fadeN; L[N - 1 - i] *= g; R[N - 1 - i] *= g; }
    return { L, R, rawPeak };
  }
  return { render };
}

function renderScore(onProgress) {
  const events = buildScore();
  const dur = T.end + 0.6;
  const started = performance.now();
  const timer = setInterval(() => onProgress && onProgress(0.95 * (1 - Math.exp(-(performance.now() - started) / 3500))), 120);
  return new Promise((resolve, reject) => {
    let worker = null;
    try {
      const src = synthCore.toString() + "\nconst core = synthCore();\nonmessage = (e) => { const r = core.render(e.data.events, e.data.SR, e.data.dur); postMessage(r, [r.L.buffer, r.R.buffer]); };";
      worker = new Worker(URL.createObjectURL(new Blob([src], { type: "text/javascript" })));
    } catch (e) { worker = null; }
    const local = () => setTimeout(() => { try { resolve(synthCore().render(events, SR, dur)); } catch (e) { reject(e); } }, 50);
    if (!worker) return local();
    worker.onmessage = (e) => { resolve(e.data); worker.terminate(); };
    worker.onerror = (e) => { e.preventDefault(); worker.terminate(); local(); };
    worker.postMessage({ events, SR, dur });
  }).then((r) => {
    clearInterval(timer); onProgress && onProgress(1);
    const buf = new AudioBuffer({ length: r.L.length, numberOfChannels: 2, sampleRate: SR });
    buf.copyToChannel(r.L, 0); buf.copyToChannel(r.R, 1);
    return { buf, peak: r.rawPeak, events: events.length };
  });
}
