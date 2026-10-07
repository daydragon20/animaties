/* ═════════════ KADER: hoeken, merknaam, hoofdstuk en een wandelpad ═════════════ */
(function () {
  const frame = el("div", { class: "L" }, stage);
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
    op(frame, E.out(seg(t, 0.6, 1.6)));
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
