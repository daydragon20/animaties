/* ═════════════ ACHTERGROND: atlaspapier of nacht, hoogtelijnen, sterren; KADER ═════════════ */
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
  for (let i = 0; i < 520; i++) { const r = rnd() < 0.08 ? 1.7 : 0.85; g.fillStyle = `rgba(237,230,209,${0.22 + rnd() * 0.6})`; g.beginPath(); g.arc(rnd() * 1920, rnd() * 1080, r, 0, 7); g.fill(); }
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
  contNight.style.opacity = (1 - l) * (t < T.s2 ? 0.35 * E.out(seg(t, CUE.cut[0], CUE.cut[1] + 1)) : 1);
  contDay.style.opacity = l;
  op(stars, t < T.s2 ? (1 - l) * E.out(seg(t, 0, 1.2)) : 0);
  op(vigNight, 1 - l); op(vigDay, l);
});

/* ═════════════ KADER: hoeken, merknaam, hoofdstuk en een wandelpad ═════════════ */
(function () {
  const frame = el("div", { class: "L", style: "z-index:6" }, stage);
  const frameSvg = sv("svg", { width: 1920, height: 1080, style: "position:absolute;left:0;top:0" }, frame);
  const frameRect = sv("rect", { x: 28, y: 28, width: 1864, height: 1024, fill: "none", "stroke-width": 1.5 }, frameSvg);
  const corners = [[28, 28, 1, 1], [1892, 28, -1, 1], [28, 1052, 1, -1], [1892, 1052, -1, -1]].map(([x, y, sx, sy]) =>
    sv("path", { d: `M${x} ${y + sy * 34} L${x} ${y} L${x + sx * 34} ${y}`, fill: "none", "stroke-width": 3.5 }, frameSvg));
  const brand = el("div", { class: "a mono", style: "left:64px;top:50px;font-size:25px;letter-spacing:.24em;font-weight:600" }, frame, "SCOUT ATLAS " + YEAR);
  const chapEls = CHAPTERS.map(([n]) => el("div", { class: "a mono", style: "right:64px;top:50px;font-size:25px;letter-spacing:.24em;font-weight:600;text-transform:uppercase" }, frame, n));
  const NCH = CHAPTERS.length;
  const trail = { x0: 700, x1: 1260, y: 66 };
  const trailBase = sv("line", { x1: trail.x0, y1: trail.y, x2: trail.x1, y2: trail.y, "stroke-width": 2.5, "stroke-dasharray": "3 8" }, frameSvg);
  const trailFill = sv("line", { x1: trail.x0, y1: trail.y, x2: trail.x0, y2: trail.y, "stroke-width": 3.5 }, frameSvg);
  const wps = CHAPTERS.map((c, i) => sv("circle", { cx: lerp(trail.x0, trail.x1, i / (NCH - 1)), cy: trail.y, r: 6, "stroke-width": 2.5 }, frameSvg));
  const walker = sv("path", { d: "M0 -10 L8 7 L-8 7 Z" }, frameSvg);
  renders.push((t) => {
    const l = lightAt(t);
    const ink = hexLerp(N.paper, D.ink, l), acc = hexLerp(N.mint, D.mint, l), hi = hexLerp(N.sun, D.ochre, l), bgc = hexLerp(N.bg, D.bg, l);
    op(frame, E.out(seg(t, CUE.cut[1], CUE.cut[1] + 1.2)));
    frameRect.setAttribute("stroke", ink); frameRect.setAttribute("stroke-opacity", 0.2);
    corners.forEach((c) => c.setAttribute("stroke", acc));
    brand.style.color = hexLerp(N.soft, D.sub, l);
    CHAPTERS.forEach(([, a], i) => {
      const b = i < NCH - 1 ? CHAPTERS[i + 1][1] : T.end + 1;
      set(chapEls[i], win(t, a, b, 0.4, 0.3), 0, (1 - E.out(seg(t, a, a + 0.4))) * 10);
      chapEls[i].style.color = hi;
    });
    let pos = 0;
    for (let i = 0; i < NCH; i++) {
      const a = CHAPTERS[i][1], b = i < NCH - 1 ? CHAPTERS[i + 1][1] : T.end;
      if (t >= a) pos = i + (i < NCH - 1 ? E.inOut(seg(t, b - 0.8, b + 0.1)) : 0);
    }
    const wx = lerp(trail.x0, trail.x1, pos / (NCH - 1));
    trailBase.setAttribute("stroke", ink); trailBase.setAttribute("stroke-opacity", 0.35);
    trailFill.setAttribute("x2", wx); trailFill.setAttribute("stroke", acc);
    walker.setAttribute("transform", `translate(${wx},${trail.y - 18})`); walker.setAttribute("fill", hi);
    wps.forEach((w, i) => { w.setAttribute("fill", pos >= i - 0.01 ? acc : bgc); w.setAttribute("stroke", pos >= i - 0.01 ? acc : ink); w.setAttribute("stroke-opacity", 0.6); });
  });
})();
