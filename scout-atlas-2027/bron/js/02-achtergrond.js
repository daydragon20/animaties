/* ═════════════ ACHTERGROND: atlaspapier of nacht, hoogtelijnen, sterren ═════════════ */
function makeContours(stroke, strokeMajor) {
  const W = 2240, H = 1360, step = 10;
  const cols = Math.ceil(W / step) + 1, rows = Math.ceil(H / step) + 1;
  const rnd = mulberry32(2027);
  const peaks = [];
  for (let i = 0; i < 11; i++) peaks.push({ x: rnd() * W, y: rnd() * H, a: (rnd() < 0.2 ? -0.5 : 0.55) + rnd() * 0.8, s: 150 + rnd() * 260 });
  const f = new Float32Array(cols * rows);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const x = i * step, y = j * step;
    let v = 0;
    for (const p of peaks) v += p.a * Math.exp(-((x - p.x) ** 2 + (y - p.y) ** 2) / (2 * p.s * p.s));
    v += 0.07 * Math.sin(x / 83 + Math.cos(y / 121) * 2) * Math.cos(y / 77 + Math.sin(x / 140));
    f[j * cols + i] = v;
  }
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const g = cv.getContext("2d");
  g.lineCap = "round";
  for (let k = 0, lv = -0.6; lv < 1.8; lv += 0.075, k++) {
    const major = k % 5 === 0;
    g.strokeStyle = major ? strokeMajor : stroke;
    g.lineWidth = major ? 1.6 : 1.1;
    g.beginPath();
    for (let j = 0; j < rows - 1; j++) for (let i = 0; i < cols - 1; i++) {
      const a = f[j * cols + i], b = f[j * cols + i + 1], c = f[(j + 1) * cols + i + 1], d = f[(j + 1) * cols + i];
      const idx = (a > lv ? 8 : 0) | (b > lv ? 4 : 0) | (c > lv ? 2 : 0) | (d > lv ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const x = i * step, y = j * step;
      const Tp = [x + step * (lv - a) / (b - a), y], Rt = [x + step, y + step * (lv - b) / (c - b)];
      const Bt = [x + step * (lv - d) / (c - d), y + step], Lf = [x, y + step * (lv - a) / (d - a)];
      const segs = { 1: [[Lf, Bt]], 2: [[Bt, Rt]], 3: [[Lf, Rt]], 4: [[Tp, Rt]], 5: [[Lf, Tp], [Bt, Rt]], 6: [[Tp, Bt]], 7: [[Lf, Tp]],
        8: [[Lf, Tp]], 9: [[Tp, Bt]], 10: [[Tp, Rt], [Lf, Bt]], 11: [[Tp, Rt]], 12: [[Lf, Rt]], 13: [[Bt, Rt]], 14: [[Lf, Bt]] }[idx];
      for (const [p, q] of segs) { g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); }
    }
    g.stroke();
  }
  cv.style.cssText = "position:absolute;left:-160px;top:-140px;width:2240px;height:1360px";
  return cv;
}
const bg = el("div", { class: "L" }, stage);
const stars = (() => {
  const cv = document.createElement("canvas"); cv.width = 1920; cv.height = 1080;
  const g = cv.getContext("2d"), rnd = mulberry32(5);
  for (let i = 0; i < 420; i++) { const r = rnd() < 0.08 ? 1.6 : 0.8; g.fillStyle = `rgba(237,230,209,${0.25 + rnd() * 0.6})`; g.beginPath(); g.arc(rnd() * 1920, rnd() * 1080, r, 0, 7); g.fill(); }
  cv.style.cssText = "position:absolute;left:0;top:0"; bg.appendChild(cv); return cv;
})();
const contNight = makeContours("rgba(124,240,196,0.075)", "rgba(124,240,196,0.16)");
const contDay = makeContours("rgba(16,38,44,0.07)", "rgba(16,38,44,0.13)");
bg.appendChild(contNight); bg.appendChild(contDay);
const vigNight = el("div", { class: "L", style: "background:radial-gradient(ellipse 75% 70% at 50% 50%, rgba(7,21,25,0) 40%, rgba(3,10,12,.85) 100%)" }, stage);
const vigDay = el("div", { class: "L", style: "background:radial-gradient(ellipse 80% 75% at 50% 45%, rgba(255,250,236,.55) 0%, rgba(239,231,212,0) 55%, rgba(150,120,70,.22) 100%)" }, stage);
renders.push((t) => {
  const l = lightAt(t);
  stage.style.background = hexLerp(N.bg, D.bg, l);
  const tr = `translate(${-40 * Math.sin(t / 30)}px,${-t * 0.8}px)`;
  contNight.style.transform = tr; contDay.style.transform = tr;
  contNight.style.opacity = (1 - l) * (0.3 + 0.7 * E.out(seg(t, 0, 2.4)));
  contDay.style.opacity = l;
  op(stars, t < T.s2 ? (1 - l) * E.out(seg(t, 0, 1.2)) : 0);
  op(vigNight, 1 - l); op(vigDay, l);
});
