/* ═════════════ MUZIEK ═════════════
   Alles wordt hier zelf opgewekt: een kleine synthesizer in JavaScript (oscillatoren, filters, galm),
   gerenderd tot één stereospoor dat exact met de tijdlijn meeloopt.
   Tempo 80: 1 tel = 0,75 s, 1 maat = 3 s. D-klein; de zonsopgang, de winnaar en het slot in D-groot. */
const SR = 44100;

function buildScore() {
  const EV = [];
  const ev = (type, o) => EV.push(Object.assign({ type }, o));
  const pad = (t, dur, notes, gain, bright = 1) => ev("pad", { t, dur, notes, gain, bright });
  const str = (t, dur, notes, gain, bright = 1, att = 1.4) => ev("strings", { t, dur, notes, gain, bright, att });
  const bass = (t, dur, m, gain) => ev("bass", { t, dur, m, gain });
  const kick = (t, gain) => ev("kick", { t, gain });
  const hat = (t, gain, open = false, pan = 0.2) => ev("hat", { t, gain, open, pan });
  const snare = (t, gain) => ev("snare", { t, gain });
  const pluck = (t, m, gain, pan = 0, send = 0.45, len = 0.7) => ev("pluck", { t, m, gain, pan, send, len });
  const piano = (t, m, gain, pan = 0, len = 2.4) => ev("piano", { t, m, gain, pan, len });
  const bell = (t, m, gain, pan = 0, len = 3) => ev("bell", { t, m, gain, pan, len });
  const boom = (t, gain) => ev("boom", { t, gain });
  const taiko = (t, gain, pitch = 1) => ev("taiko", { t, gain, pitch });
  const crash = (t, gain, len = 3) => ev("crash", { t, gain, len });
  const revcym = (t0, t1, gain) => ev("revcym", { t: t0, t1, gain });
  const riser = (t0, t1, gain) => ev("riser", { t: t0, t1, gain });
  const whoosh = (t, dur, gain, up = true, pan = 0) => ev("whoosh", { t, dur, gain, up, pan });
  const tick = (t, gain, freq = 2600) => ev("tick", { t, gain, freq });
  const heart = (t, gain) => ev("heart", { t, gain });
  const air = (t, dur, gain) => ev("air", { t, dur, gain });

  const B = BEAT, BR = BAR;
  // akkoorden (MIDI): D-klein reeks en D-groot reeks
  const Dm = [50, 53, 57, 62], Bb = [46, 50, 53, 58], F = [48, 53, 57, 60], C = [48, 52, 55, 60];
  const D = [50, 54, 57, 62], A = [49, 52, 57, 61], Bm = [47, 50, 54, 59], G = [47, 50, 55, 59];
  const MIN = [Dm, Bb, F, C], MAJ = [D, A, Bm, G];
  const rootOf = (ch) => ch[0] - 12;
  const at = (t0, t) => Math.floor((t - t0) / BR) % 4;
  const chapterHit = (t, big = 1) => { boom(t, 0.55 * big); crash(t, 0.1 * big, 2.6); taiko(t, 0.5 * big); whoosh(t - 0.45, 0.6, 0.16, true); };
  const groove = (a, b, o = {}) => {
    const { kickG = 0.5, hatG = 0.05, snareG = 0.14, bassG = 0.12, prog = MIN, sixteenth = false, arp = 0.024, snareOn = true } = o;
    for (let t = a; t < b - 0.01; t += B) kick(t, kickG);
    for (let t = a + B / 2; t < b - 0.01; t += B) hat(t, hatG, false, 0.25);
    if (sixteenth) for (let t = a + B / 4; t < b - 0.01; t += B / 2) hat(t, hatG * 0.55, false, -0.3);
    if (snareOn) for (let t = a + B; t < b - 0.01; t += 2 * B) snare(t, snareG);
    for (let t = a; t < b - 0.01; t += B / 2) { const ch = prog[at(a, t)]; bass(t, B / 2 * 0.9, rootOf(ch) + (Math.round((t - a) / (B / 2)) % 4 === 3 ? 12 : 0), bassG); }
    if (arp) for (let t = a; t < b - 0.01; t += B / 4) { const i = Math.round((t - a) / (B / 4)), ch = prog[at(a, t)]; pluck(t, ch[[0, 1, 2, 3, 2, 1, 3, 2][i % 8]] + 12, arp, i % 2 ? 0.45 : -0.45, 0.35, 0.22); }
  };

  /* 0 · de vraag */
  air(0, PRO.globeIn + 1, 0.028);
  pad(0, PRO.globeIn + 0.4, [38, 45, 50], 0.032, 0.42);
  const [l1, l2, l3] = PRO.lines.map((x) => x[0]);
  [62, 69, 74, 77].forEach((m, i) => piano(l1 + i * 0.5, m, 0.07, (i - 1.5) * 0.25, 3));
  [58, 65, 70, 74].forEach((m, i) => piano(l2 + i * 0.5, m, 0.07, (i - 1.5) * 0.25, 3));
  piano(l3, 57, 0.08, 0, 4); piano(l3 + 0.75, 64, 0.06, 0.2, 4); piano(l3 + 1.1, 69, 0.07, -0.2, 4);
  heart(l3 - 0.1, 0.5); heart(l3 + 1.4, 0.45);
  revcym(PRO.globeIn - 1.8, PRO.globeIn, 0.18); riser(PRO.globeIn - 2.2, PRO.globeIn, 0.12);
  boom(PRO.globeIn, 0.6); taiko(PRO.globeIn, 0.45);
  str(PRO.globeIn, 2.8, [38, 50, 54, 57, 62], 0.05, 1.2, 1.2);              // zonsopgang: D-groot
  str(PRO.title, 3.0, [37, 49, 52, 57, 61, 64], 0.05, 1.3, 0.8);           // A/C#
  str(PRO.pull, 3.0, [35, 47, 50, 54, 59], 0.05, 1.2, 0.8);                 // Bm
  str(PRO.pull + 3.0, T.s1 - PRO.pull - 3.0 + 0.4, [31, 43, 47, 50, 55, 59], 0.05, 1.3, 0.8); // G
  taiko(PRO.title, 0.55); crash(PRO.title, 0.12, 3.5); boom(PRO.title, 0.35);
  [74, 78, 81, 86].forEach((m, i) => bell(PRO.title + 0.08 + i * 0.11, m, 0.05, (i - 1.5) * 0.35, 3.5));
  const pent = [74, 76, 78, 81, 83, 86, 88, 90, 93, 95];
  CC.forEach((c, i) => bell(PRO.pins + i * 0.075, pent[i % pent.length] - (i % 3 === 0 ? 12 : 0), 0.022, ((i % 7) - 3) * 0.25, 1.4));
  for (let t = PRO.pull; t < T.s1 - 0.1; t += B) kick(t, 0.22 + 0.25 * seg(t, PRO.pull, T.s1));
  whoosh(PRO.push, 1.2, 0.18, true); riser(PRO.push - 0.8, T.s1, 0.2);

  /* 1 · de meetlat */
  chapterHit(T.s1);
  groove(ML.helix, ML.collapse, { kickG: 0.42, hatG: 0.045, snareG: 0.1, bassG: 0.11, sixteenth: true, arp: 0.02 });
  for (let t = ML.helix; t < ML.collapse; t += BR) pad(t, BR, MIN[at(ML.helix, t)], 0.035, 0.8);
  for (let i = 0; i < 48; i++) { const u = i / 47; tick(lerp(ML.count, ML.countEnd, 1 - Math.pow(1 - u, 2.2)), 0.035, 2000 + u * 1800); }
  whoosh(ML.collapse, 0.9, 0.2, false); riser(ML.collapse - 1.2, ML.sphere, 0.18);
  boom(ML.sphere, 0.6); crash(ML.sphere, 0.07, 3);
  [62, 65, 69, 74, 77, 81, 86, 89].forEach((m, i) => bell(ML.sphere + 0.1 + i * 0.09, m, 0.04, (i % 2 ? 0.4 : -0.4), 3));
  for (let t = ML.sphere; t < ML.sphereOut; t += BR) { str(t, BR, MIN[at(ML.sphere, t)].map((m) => m - 12).concat(MIN[at(ML.sphere, t)][3]), 0.045, 1.0, 0.6); }
  for (let t = ML.sphere; t < ML.sphereOut - 0.1; t += B / 4) { const i = Math.round((t - ML.sphere) / (B / 4)), ch = MIN[at(ML.sphere, t)]; pluck(t, ch[[0, 2, 1, 3][i % 4]] + 24, 0.016, i % 2 ? 0.5 : -0.5, 0.6, 0.3); }
  for (let t = ML.sphere; t < ML.sphereOut; t += B) hat(t + B / 2, 0.035, false, 0.3);
  // adempauze: alleen pad en piano
  pad(ML.sphereOut - 0.4, ML.packIn - ML.sphereOut + 1.5, Dm, 0.045, 0.6);
  piano(ML.weigh, 69, 0.06, 0, 3); piano(ML.weigh + 1.5, 65, 0.055, 0.2, 3); piano(ML.weigh + 2.25, 62, 0.06, -0.2, 3.5);
  whoosh(ML.packIn - 0.3, 1.0, 0.18, true); boom(ML.packIn + 0.4, 0.35);
  // de lagen vallen in de rugzak: elke laag een dreun en een noot (zwaar → licht, laag → hoog)
  const scale = [38, 41, 43, 45, 48, 50, 53, 55, 57, 60, 62, 65, 67, 69];
  M.byWeight.forEach((c, i) => { const t = ML.layerAt(i); taiko(t, 0.18 + 0.32 * (M.catShare[c] / 16), 1.25 - i * 0.03); pluck(t, scale[i] + 12, 0.07, ((i % 5) - 2) * 0.2, 0.4, 0.6); });
  for (let t = ML.layers; t < ML.hl - 0.1; t += B) { kick(t, 0.32); hat(t + B / 2, 0.04 + 0.03 * seg(t, ML.layers, ML.hl), false, 0.3); }
  for (let t = ML.layers; t < ML.hl; t += BR) { pad(t, BR, MIN[at(ML.layers, t)], 0.04, 0.8 + 0.6 * seg(t, ML.layers, ML.hl)); bass(t, BR * 0.9, rootOf(MIN[at(ML.layers, t)]), 0.08); }
  riser(ML.hl - 1.5, ML.hl, 0.15);
  boom(ML.hl, 0.45); crash(ML.hl, 0.08, 3);
  str(ML.hl, 3.75, [38, 50, 54, 57, 62, 66], 0.06, 1.5, 0.3);
  [74, 78, 81].forEach((m, i) => bell(ML.hl + 0.06 * i, m, 0.05, (i - 1) * 0.4, 3));
  pad(ML.fact - 0.5, T.s2 - ML.fact + 0.5, Bb, 0.04, 0.8);
  piano(ML.fact + 0.2, 74, 0.08, -0.3, 2.5); piano(ML.fact + 0.9, 50, 0.08, 0.3, 2.5);
  for (let t = ML.fact; t < T.s2 - 0.1; t += B) kick(t, 0.25);
  riser(T.s2 - 1.8, T.s2, 0.2);

  /* 2 · het landschap: episch, half tempo */
  chapterHit(T.s2);
  for (let t = LS.grow; t < LS.sort; t += BR) {
    const ch = MIN[at(LS.grow, t)];
    str(t, BR + 0.2, [rootOf(ch) - 12, ...ch], 0.055, 1.1, 0.5);
    pad(t, BR, ch.map((m) => m + 12), 0.025, 1.4);
    taiko(t, 0.42); taiko(t + 2 * B, 0.3, 1.1); taiko(t + 3.5 * B, 0.18, 1.2);
    bass(t, BR * 0.95, rootOf(ch), 0.1);
  }
  const mel = [[LS.grow, 69, 3], [LS.grow + 3, 70, 3], [LS.grow + 6, 72, 2.25], [LS.grow + 8.25, 76, 0.75], [LS.grow + 9, 74, 3]];
  mel.forEach(([t, m, d]) => str(t, d, [m], 0.04, 1.6, 0.25));
  [86, 88, 90, 93, 95, 98].forEach((m, i) => bell(LS.peaks + i * 0.12, m - 12, 0.035, (i % 2 ? 0.5 : -0.5), 2.5));
  for (let t = LS.sort; t < LS.sortEnd; t += B / 4) { const u = seg(t, LS.sort, LS.sortEnd), i = Math.round((t - LS.sort) / (B / 4)); pluck(t, [50, 53, 57, 62, 65, 69, 74, 77][i % 8] + Math.floor(u * 2) * 12, 0.028, i % 2 ? 0.5 : -0.5, 0.4, 0.25); }
  riser(LS.sort, LS.sortEnd, 0.14);
  str(LS.sortEnd, T.s3 - LS.sortEnd, [38, 50, 54, 57, 62], 0.055, 1.3, 0.4); boom(LS.sortEnd, 0.4);
  riser(T.s3 - 1.6, T.s3, 0.2);

  /* 3 · de afvaltocht */
  chapterHit(T.s3, 1.15);
  boom(AF.map, 0.4); pad(AF.map, AF.start - AF.map + 0.4, Dm, 0.04, 0.7);
  groove(AF.start, T.ten, { kickG: 0.5, hatG: 0.055, snareG: 0.15, bassG: 0.13, sixteenth: true, arp: 0.022 });
  for (let t = AF.start; t < T.ten; t += BR) pad(t, BR, MIN[at(AF.start, t)], 0.035, 1.0 + 0.6 * seg(t, AF.start, T.ten));
  for (let r = CC.length; r >= 11; r--) { const a = SLOT[r].a; taiko(a, 0.32); pluck(a, 62 + (CC.length - r) % 8 * 2, 0.06, ((r % 5) - 2) * 0.25, 0.5, 0.5); whoosh(a - 0.25, 0.3, 0.07, true, (r % 2 ? 0.4 : -0.4)); }
  riser(T.ten - 2.2, T.ten - 0.05, 0.16);
  // nog tien over: alles valt weg
  boom(T.ten, 0.55); pad(T.ten, SLOT[10].a - T.ten + 0.5, [38, 45, 50, 53], 0.05, 0.5);
  heart(T.ten + 0.8, 0.5); heart(T.ten + 2.0, 0.45); revcym(SLOT[10].a - 1.4, SLOT[10].a, 0.16);
  groove(SLOT[10].a, T.top3, { kickG: 0.5, hatG: 0.05, snareG: 0.16, bassG: 0.12, sixteenth: false, arp: 0.02 });
  for (let t = SLOT[10].a; t < T.top3; t += BR) str(t, BR + 0.1, MIN[at(SLOT[10].a, t)], 0.04, 1.1, 0.5);
  for (let r = 10; r >= 4; r--) { const a = SLOT[r].a; taiko(a, 0.4); crash(a, 0.04, 1.5); bell(a, 74 + (10 - r) * 2, 0.04, 0, 2); }
  riser(T.top3 - 1.5, T.top3, 0.14);
  // de top drie
  boom(T.top3, 0.5); pad(T.top3, T.flash - T.top3, [38, 45, 50], 0.05, 0.5); air(T.top3, T.flash - T.top3, 0.04);
  for (let t = T.top3; t < SLOT[3].a - 0.05; t += B / 2) snare(t, 0.02 + 0.05 * seg(t, T.top3, SLOT[3].a));
  [[SLOT[3].a, F], [SLOT[2].a, C]].forEach(([a, ch], k) => { taiko(a, 0.55 + 0.1 * k); boom(a, 0.45); crash(a, 0.08, 2.5); str(a, SLOT[3].b - SLOT[3].a, [rootOf(ch) - 12, ...ch], 0.05, 1.2, 0.2); for (let t = a + B; t < a + 6 * B - 0.05; t += B) heart(t, 0.22 + 0.06 * k); });
  // de spanning: roffel die versnelt, dan stilte
  for (let t = T.build, s = 0.24; t < T.flash - 0.4; t += s, s = Math.max(0.05, s * 0.9)) snare(t, 0.04 + 0.18 * seg(t, T.build, T.flash));
  riser(T.build, T.flash - 0.38, 0.32); revcym(T.flash - 2.4, T.flash - 0.38, 0.2);
  str(T.build, T.flash - T.build - 0.35, [33, 45, 49, 52, 57, 61, 64], 0.05, 1.5, 1.5);  // A7 (spanning)
  // de winnaar
  boom(T.flash, 1.0); taiko(T.flash, 0.9); crash(T.flash, 0.22, 4.5); kick(T.flash, 0.8);
  str(T.flash, SLOT[1].b - T.flash + 0.6, [26, 38, 50, 54, 57, 62, 66, 69], 0.07, 1.8, 0.15);
  pad(T.flash, SLOT[1].b - T.flash + 0.6, [62, 66, 69, 74, 78], 0.035, 2.0);
  [74, 78, 81, 86, 90, 93].forEach((m, i) => bell(T.flash + 0.05 + i * 0.09, m, 0.06, (i - 2.5) * 0.3, 4));
  for (let t = T.flash + 2 * B; t < SLOT[1].b - 0.2; t += B) { kick(t, 0.5); hat(t + B / 2, 0.06, true); }
  for (let t = T.flash + 2 * B; t < SLOT[1].b - 0.2; t += B / 2) bass(t, B / 2 * 0.9, 38, 0.12);
  for (let t = T.flash + 2 * B; t < SLOT[1].b - 0.2; t += B / 4) { const i = Math.round((t - T.flash) / (B / 4)); pluck(t, [62, 66, 69, 74][i % 4] + 12, 0.025, i % 2 ? 0.5 : -0.5, 0.4, 0.2); }

  /* 4 · waarom: ontroerend, piano en strijkers in D-groot */
  bell(T.s4, 81, 0.05, 0, 3); whoosh(T.s4 - 0.4, 0.6, 0.12, true); boom(T.s4, 0.3);
  for (let t = WH.a; t < T.s5; t += BR) {
    const ch = MAJ[at(WH.a, t)];
    str(t, BR + 0.1, [rootOf(ch) - 12, ...ch], 0.045, 0.9, 0.7);
    for (let k = 0; k < 8; k++) piano(t + k * B / 2, ch[[0, 1, 2, 3, 2, 1, 2, 3][k]] + 12, 0.03 + (k === 0 ? 0.015 : 0), (k % 2 ? 0.3 : -0.3), 1.6);
    if (t >= WH.b) kick(t, 0.28);
    if (t >= WH.b) kick(t + 2 * B, 0.2);
  }
  [[WH.b, 78], [WH.b + 3, 76], [WH.b + 6, 74], [WH.c, 81], [WH.c + 3, 78]].forEach(([t, m]) => str(t, 2.8, [m], 0.035, 1.5, 0.4));

  /* 5 · eerlijk is eerlijk en het slot */
  bell(T.s5, 74, 0.05, 0, 3); whoosh(T.s5 - 0.4, 0.6, 0.12, true);
  for (let t = FIN.v1; t < FIN.map; t += BR) { const ch = MIN[at(FIN.v1, t)]; pad(t, BR + 0.2, ch, 0.04, 0.6); piano(t, ch[3] + 12, 0.05, 0, 3); piano(t + 1.5, ch[1] + 12, 0.04, 0.2, 3); }
  str(FIN.map - 0.3, FIN.title - FIN.map + 0.3, [38, 50, 54, 57, 62], 0.05, 1.0, 1.2);
  for (let t = FIN.route; t < FIN.routeEnd; t += B / 4) { const i = Math.round((t - FIN.route) / (B / 4)); pluck(t, [62, 66, 69, 74, 78, 74, 69, 66][i % 8] + (seg(t, FIN.route, FIN.routeEnd) > 0.5 ? 12 : 0), 0.026, i % 2 ? 0.4 : -0.4, 0.5, 0.35); }
  for (let t = FIN.route; t < FIN.routeEnd; t += B) kick(t, 0.25);
  pluck(FIN.routeEnd, 74, 0.08, 0, 0.8, 1.5); bell(FIN.routeEnd + 0.05, 86, 0.05, 0.2, 3);
  boom(FIN.title, 0.6); taiko(FIN.title, 0.5); crash(FIN.title, 0.1, 5);
  str(FIN.title, T.end - FIN.title + 1, [26, 38, 50, 54, 57, 62, 66, 69], 0.065, 1.4, 0.6);
  pad(FIN.title, T.end - FIN.title + 1, [62, 66, 69, 74], 0.03, 1.6);
  [74, 78, 81, 86, 90].forEach((m, i) => bell(FIN.title + 0.4 + i * 0.16, m, 0.045, (i - 2) * 0.35, 4.5));
  piano(FIN.title + 3, 74, 0.05, 0, 5); piano(FIN.title + 3.75, 78, 0.04, 0.2, 5); piano(FIN.title + 4.5, 81, 0.045, -0.2, 5);
  return EV;
}

// De synthesizer zelf. Staat los van de rest zodat hij in een achtergrondthread kan draaien.
function synthCore() {
  const TAU = Math.PI * 2;
  function render(events, SR, dur, onProgress) {
    const N = Math.ceil(SR * dur);
    const L = new Float32Array(N), R = new Float32Array(N), VL = new Float32Array(N), VR = new Float32Array(N);
    let seed = 2027;
    const rnd = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return ((seed >>> 0) / 4294967296) * 2 - 1; };
    const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
    const clampP = (p) => Math.max(-1, Math.min(1, p));
    const pan = (p) => { const a = ((clampP(p) + 1) * Math.PI) / 4; return [Math.cos(a) * Math.SQRT2, Math.sin(a) * Math.SQRT2]; };
    const BQ = () => ({ b0: 1, b1: 0, b2: 0, a1: 0, a2: 0, x1: 0, x2: 0, y1: 0, y2: 0 });
    function setBQ(f, type, freq, Q) { // 0 laagdoorlaat, 1 hoogdoorlaat, 2 banddoorlaat
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
    function saws(e, att, rel, vib, side) {
      const a = Math.min(att, e.dur * 0.5), hold = Math.max(0, e.dur - a), len = a + hold + rel;
      const [i0, i1] = span(e.t, len);
      const vs = [];
      e.notes.forEach((m, j) => [-7, 7].forEach((det) => vs.push({ f: mtof(m) * Math.pow(2, (det + (j - 1) * 1.5) / 1200), p: Math.abs(rnd()), side: det < 0 ? 0 : 1, ph: Math.abs(rnd()) * 6 })));
      const fl = BQ(), fr = BQ();
      const [gl0, gr0] = pan(-0.4), [gl1, gr1] = pan(0.4);
      const norm = 1 / Math.sqrt(e.notes.length);
      for (let i = i0; i < i1; i++) {
        const k = (i - i0) / SR;
        if ((i - i0) % 32 === 0) {
          const fc = (400 + 1100 * Math.min(1, k / Math.min(e.dur, 3))) * e.bright;
          setBQ(fl, 0, fc, 0.707); fr.b0 = fl.b0; fr.b1 = fl.b1; fr.b2 = fl.b2; fr.a1 = fl.a1; fr.a2 = fl.a2;
        }
        let sl = 0, sr = 0;
        for (let v = 0; v < vs.length; v++) {
          const o = vs[v];
          const fm = vib ? 1 + vib * Math.sin(TAU * 5.2 * k + o.ph) * Math.min(1, k / 1.2) : 1;
          const dt = (o.f * fm) / SR;
          const s = 2 * o.p - 1 - blep(o.p, dt);
          o.p += dt; if (o.p >= 1) o.p -= 1;
          if (o.side) sr += s; else sl += s;
        }
        const env = k < a ? Math.sin((k / a) * Math.PI / 2) : k < a + hold ? 1 : Math.max(0, 1 - (k - a - hold) / rel);
        const yl = bq(fl, sl) * env * e.gain * norm, yr = bq(fr, sr) * env * e.gain * norm;
        const l = yl * gl0 + yr * gl1, r = yl * gr0 + yr * gr1;
        L[i] += l; R[i] += r; VL[i] += l * side; VR[i] += r * side;
      }
    }
    const I = {
      pad(e) { saws(e, Math.min(1.2, e.dur * 0.4), 1.4, 0, 0.6); },
      strings(e) { saws(e, e.att, 1.6, 0.0035, 0.8); },
      bass(e) {
        const a = 0.006, hold = e.dur * 0.5, rel = e.dur * 0.45;
        const [i0, i1] = span(e.t, a + hold + rel);
        const f = mtof(e.m), dt = f / SR, fl = BQ();
        let p = 0, ps = 0;
        for (let i = i0; i < i1; i++) {
          const k = (i - i0) / SR;
          if ((i - i0) % 16 === 0) setBQ(fl, 0, expRamp(800, 200, k / 0.15), 2);
          const saw = 2 * p - 1 - blep(p, dt);
          p += dt; if (p >= 1) p -= 1;
          const sn = Math.sin(TAU * ps); ps += dt; if (ps >= 1) ps -= 1;
          const env = k < a ? k / a : k < a + hold ? 1 : Math.max(0, 1 - (k - a - hold) / rel);
          const y = (bq(fl, saw) * 0.8 + sn) * env * e.gain;
          L[i] += y; R[i] += y; VL[i] += y * 0.04; VR[i] += y * 0.04;
        }
      },
      kick(e) {
        const [i0, i1] = span(e.t, 0.45);
        let ph = 0;
        const hp = BQ(); setBQ(hp, 1, 3000, 0.707);
        for (let i = i0; i < i1; i++) {
          const k = (i - i0) / SR;
          ph += expRamp(140, 42, k / 0.12) / SR;
          let y = Math.sin(TAU * ph) * e.gain * decay(k, 0.42);
          if (k < 0.014) y += bq(hp, rnd()) * e.gain * 0.2 * (1 - k / 0.014);
          L[i] += y; R[i] += y;
        }
      },
      hat(e) {
        const d = e.open ? 0.22 : 0.05;
        const [i0, i1] = span(e.t, d + 0.01);
        const hp = BQ(); setBQ(hp, 1, 8000, 0.707);
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
          L[i] += y; R[i] += y; VL[i] += n * 0.3 + tri * 0.1; VR[i] += n * 0.3 + tri * 0.1;
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
      piano(e) {
        const [i0, i1] = span(e.t, e.len + 0.05);
        const f = mtof(e.m), lp = BQ();
        const [gl, gr] = pan(e.pan);
        const parts = [[1, 1, 1], [2.0015, 0.42, 0.6], [3.004, 0.18, 0.4], [4.01, 0.08, 0.3]];
        const ph = parts.map(() => 0);
        for (let i = i0; i < i1; i++) {
          const k = (i - i0) / SR;
          if ((i - i0) % 32 === 0) setBQ(lp, 0, expRamp(4200, 700, k / 1.2), 0.6);
          let s = 0;
          for (let q = 0; q < parts.length; q++) { const [mul, amp, dk] = parts[q]; ph[q] += (f * mul) / SR; if (ph[q] >= 1) ph[q] -= 1; s += Math.sin(TAU * ph[q]) * amp * decay(k, e.len * dk); }
          const env = k < 0.006 ? k / 0.006 : 1;
          const y = bq(lp, s) * env * e.gain;
          L[i] += y * gl; R[i] += y * gr; VL[i] += y * gl * 0.7; VR[i] += y * gr * 0.7;
        }
      },
      bell(e) {
        const [i0, i1] = span(e.t, e.len);
        const f = mtof(e.m);
        const [gl, gr] = pan(e.pan);
        const parts = [[1, 1, 1], [2.756, 0.45, 0.5], [5.404, 0.25, 0.3], [8.933, 0.12, 0.18], [0.5, 0.2, 0.9]];
        const ph = parts.map(() => 0);
        for (let i = i0; i < i1; i++) {
          const k = (i - i0) / SR;
          let s = 0;
          for (let q = 0; q < parts.length; q++) { const [mul, amp, dk] = parts[q]; ph[q] += (f * mul) / SR; if (ph[q] >= 1) ph[q] -= 1; s += Math.sin(TAU * ph[q]) * amp * decay(k, e.len * dk); }
          const env = k < 0.002 ? k / 0.002 : 1;
          const y = s * env * e.gain;
          L[i] += y * gl; R[i] += y * gr; VL[i] += y * gl * 0.9; VR[i] += y * gr * 0.9;
        }
      },
      boom(e) {
        const [i0, i1] = span(e.t, 2.2);
        const lp = BQ();
        let ph = 0;
        for (let i = i0; i < i1; i++) {
          const k = (i - i0) / SR;
          ph += expRamp(85, 28, k / 1.4) / SR;
          const s = Math.sin(TAU * ph) * e.gain * decay(k, 2.0);
          if ((i - i0) % 16 === 0) setBQ(lp, 0, expRamp(2400, 110, k / 1.0), 0.707);
          const n = bq(lp, rnd()) * e.gain * 0.55 * decay(k, 1.2);
          L[i] += s + n; R[i] += s + n; VL[i] += s * 0.3 + n * 0.7; VR[i] += s * 0.3 + n * 0.7;
        }
      },
      taiko(e) {
        const [i0, i1] = span(e.t, 1.1);
        const lp = BQ(); setBQ(lp, 0, 900, 0.8);
        let ph = 0;
        for (let i = i0; i < i1; i++) {
          const k = (i - i0) / SR;
          ph += expRamp(115 * e.pitch, 52 * e.pitch, k / 0.22) / SR;
          const s = Math.sin(TAU * ph) * e.gain * decay(k, 0.95);
          const n = k < 0.05 ? bq(lp, rnd()) * e.gain * 0.9 * (1 - k / 0.05) : 0;
          const y = s + n;
          L[i] += y; R[i] += y; VL[i] += y * 0.55; VR[i] += y * 0.55;
        }
      },
      crash(e) {
        const [i0, i1] = span(e.t, e.len);
        const hp = BQ(), hp2 = BQ(); setBQ(hp, 1, 4500, 0.7); setBQ(hp2, 1, 4500, 0.7);
        for (let i = i0; i < i1; i++) {
          const k = (i - i0) / SR;
          const g = e.gain * decay(k, e.len) * (k < 0.003 ? k / 0.003 : 1);
          const l = bq(hp, rnd()) * g, r = bq(hp2, rnd()) * g;
          L[i] += l; R[i] += r; VL[i] += l * 0.4; VR[i] += r * 0.4;
        }
      },
      revcym(e) {
        const len = e.t1 - e.t;
        const [i0, i1] = span(e.t, len);
        const hp = BQ(), hp2 = BQ(); setBQ(hp, 1, 3500, 0.7); setBQ(hp2, 1, 3500, 0.7);
        for (let i = i0; i < i1; i++) {
          const k = (i - i0) / SR, u = k / len;
          const g = e.gain * Math.pow(u, 2.5);
          const l = bq(hp, rnd()) * g, r = bq(hp2, rnd()) * g;
          L[i] += l; R[i] += r; VL[i] += l * 0.3; VR[i] += r * 0.3;
        }
      },
      riser(e) {
        const len = e.t1 - e.t;
        const [i0, i1] = span(e.t, len);
        const bp = BQ();
        let ph = 0;
        for (let i = i0; i < i1; i++) {
          const k = (i - i0) / SR, u = k / len;
          if ((i - i0) % 16 === 0) setBQ(bp, 2, expRamp(300, 6500, u), 4);
          let g = expRamp(0.0001, e.gain, k / (len - 0.02));
          if (k > len - 0.02) g = e.gain * Math.max(0, (len - k) / 0.02);
          ph += expRamp(160, 1200, u) / SR;
          const y = (bq(bp, rnd()) * 2.5 + Math.sin(TAU * ph) * 0.2) * g;
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
          L[i] += y; R[i] += y; VL[i] += y * 0.15; VR[i] += y * 0.15;
        }
      },
      heart(e) {
        [0, 0.28].forEach((off, q) => {
          const [i0, i1] = span(e.t + off, 0.4);
          let ph = 0;
          for (let i = i0; i < i1; i++) {
            const k = (i - i0) / SR;
            ph += expRamp(70, 38, k / 0.12) / SR;
            const y = Math.sin(TAU * ph) * e.gain * (q ? 0.7 : 1) * decay(k, 0.32);
            L[i] += y; R[i] += y; VL[i] += y * 0.1; VR[i] += y * 0.1;
          }
        });
      },
      air(e) {
        const [i0, i1] = span(e.t, e.dur);
        const bp = BQ(), bp2 = BQ();
        for (let i = i0; i < i1; i++) {
          const k = (i - i0) / SR;
          if ((i - i0) % 64 === 0) { const fq = 500 + 350 * Math.sin(k * 0.6) + 200 * Math.sin(k * 1.7); setBQ(bp, 2, fq, 1.2); setBQ(bp2, 2, fq * 1.13, 1.2); }
          const env = Math.min(1, k / 2, (e.dur - k) / 2) * (0.7 + 0.3 * Math.sin(k * 0.9));
          const l = bq(bp, rnd()) * e.gain * env * 2, r = bq(bp2, rnd()) * e.gain * env * 2;
          L[i] += l; R[i] += r; VL[i] += l * 0.5; VR[i] += r * 0.5;
        }
      },
    };
    events.forEach((e, n) => { I[e.type](e); if (onProgress && n % 40 === 0) onProgress((n / events.length) * 0.85); });

    // galm: Freeverb (8 kamfilters + 4 allpass per kanaal), wat ruimer dan voorheen
    const combT = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617], apT = [556, 441, 341, 225], spread = 23;
    const fb = 0.9 * 0.28 + 0.7, damp = 0.4 * 0.4, wet = 0.6;
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
      if (onProgress) onProgress(0.85 + 0.06 * (ch + 1));
    }
    // normaliseren, zachte compressie, begrenzer
    const peakOf = () => { let p = 0; for (let i = 0; i < N; i++) { const a = Math.abs(L[i]), b = Math.abs(R[i]); if (a > p) p = a; if (b > p) p = b; } return p; };
    const scale = (k) => { for (let i = 0; i < N; i++) { L[i] *= k; R[i] *= k; } };
    const rawPeak = peakOf();
    scale(1 / rawPeak);
    const thr = Math.pow(10, -18 / 20), ratio = 3.5, att = Math.exp(-1 / (0.005 * SR)), relc = Math.exp(-1 / (0.25 * SR));
    let envc = 0;
    for (let i = 0; i < N; i++) {
      const x = Math.max(Math.abs(L[i]), Math.abs(R[i]));
      envc = x > envc ? att * envc + (1 - att) * x : relc * envc + (1 - relc) * x;
      if (envc > thr) { const g = Math.pow(envc / thr, 1 / ratio - 1); L[i] *= g; R[i] *= g; }
    }
    scale(1.8 / peakOf());
    for (let i = 0; i < N; i++) { L[i] = Math.tanh(L[i]); R[i] = Math.tanh(R[i]); }
    scale(0.92 / peakOf());
    const fadeN = Math.round(SR * 2.0);
    for (let i = 0; i < fadeN; i++) { const g = i / fadeN; L[N - 1 - i] *= g; R[N - 1 - i] *= g; }
    if (onProgress) onProgress(1);
    return { L, R, rawPeak };
  }
  return { render };
}

function renderScore(onProgress) {
  const events = buildScore();
  const dur = T.end + 0.8;
  return new Promise((resolve, reject) => {
    let worker = null;
    try {
      const src = synthCore.toString() + "\nconst core = synthCore();\nonmessage = (e) => { const r = core.render(e.data.events, e.data.SR, e.data.dur, (p) => postMessage({ p })); postMessage({ done: true, L: r.L, R: r.R, rawPeak: r.rawPeak }, [r.L.buffer, r.R.buffer]); };";
      worker = new Worker(URL.createObjectURL(new Blob([src], { type: "text/javascript" })));
    } catch (e) { worker = null; }
    const local = () => setTimeout(() => { try { resolve(synthCore().render(events, SR, dur, onProgress)); } catch (e) { reject(e); } }, 50);
    if (!worker) return local();
    worker.onmessage = (e) => { if (e.data.p != null && !e.data.done) { onProgress && onProgress(e.data.p); return; } resolve(e.data); worker.terminate(); };
    worker.onerror = (e) => { e.preventDefault(); worker.terminate(); local(); };
    worker.postMessage({ events, SR, dur });
  }).then((r) => {
    const buf = new AudioBuffer({ length: r.L.length, numberOfChannels: 2, sampleRate: SR });
    buf.copyToChannel(r.L, 0); buf.copyToChannel(r.R, 1);
    return { buf, peak: r.rawPeak, events: events.length, L: r.L, R: r.R };
  });
}
