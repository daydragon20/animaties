/* ═════════════ 1 · DE VRAAG (0–12 s): zonsopgang boven de bol ═════════════ */
(function () {
  const L = el("div", { class: "L" }, sceneRoot);
  const svg = sv("svg", { width: 1920, height: 1080, style: "position:absolute;left:0;top:0;overflow:visible" }, L);
  // kompasring rond de bol
  const ring = sv("g", {}, svg);
  const R0 = 372;
  const ringO = sv("circle", { r: R0, fill: "none", "stroke-width": 2.5 }, ring);
  const ticks = [];
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * Math.PI * 2, big = i % 30 === 0, mid = i % 10 === 0;
    const r1 = R0 + (big ? 6 : 4), r2 = R0 + (big ? 30 : mid ? 18 : 11);
    ticks.push(sv("line", { x1: Math.sin(a) * r1, y1: -Math.cos(a) * r1, x2: Math.sin(a) * r2, y2: -Math.cos(a) * r2, "stroke-width": big ? 3.5 : 1.6 }, ring));
  }
  const letters = [["N", 0], ["O", 90], ["Z", 180], ["W", 270]].map(([l, d]) => {
    const a = (d * Math.PI) / 180, r = R0 + 66;
    return sv("text", { x: Math.sin(a) * r, y: -Math.cos(a) * r + 15, "text-anchor": "middle", "font-size": 46, "font-weight": 700, style: "font-family:var(--disp)" }, ring, l);
  });
  const circ = 2 * Math.PI * R0;
  ringO.setAttribute("stroke-dasharray", circ);
  const kicker = el("div", { class: "a kick", style: "left:140px;top:270px" }, L, `Verkenners ${AGES[1] || ""}–${AGES[2] || ""} · zomer ${YEAR}`);
  const lineA = el("div", { class: "a disp", style: "left:132px;top:340px;font-size:184px" }, L, "Eén kamp.");
  const subA = el("div", { class: "a serif", style: "left:140px;top:560px;font-size:50px;white-space:normal;width:800px;line-height:1.15" }, L,
    `${MEMBERS[1] ? numWord(+MEMBERS[1]) : "Tien"} tot ${MEMBERS[2] ? numWord(+MEMBERS[2]).toLowerCase() : "vijftien"} verkenners.<br>Eén rugzak elk.`);
  const lineB = el("div", { class: "a disp", style: "left:132px;top:340px;font-size:184px" }, L, `<span class="n">${CC.length}</span> landen.`);
  const subB = el("div", { class: "a serif", style: "left:140px;top:560px;font-size:50px;white-space:normal;width:800px;line-height:1.15" }, L,
    `${V.length} vragen per land.<br>Samen ${nl(M.nScores, 0)} scores.`);
  const lineC = el("div", { class: "a serif", style: "left:140px;top:330px;font-size:150px;line-height:1.0;white-space:normal;width:860px" }, L, "Welk wordt<br>het?");
  const flash = el("div", { class: "L", style: `background:${D.bg}` }, L);
  renders.push((t) => {
    const o = win(t, 0, T.s2 + 0.3, 0.01, 0.3);
    op(L, o);
    if (o <= 0) return;
    const l = lightAt(t);
    const ink = hexLerp(N.paper, D.ink, l), acc = hexLerp(N.mint, D.mint, l), hi = hexLerp(N.sun, D.ochre, l), sub = hexLerp(N.soft, D.sub, l);
    const p = E.out(seg(t, 0.2, 1.8));
    ringO.setAttribute("stroke-dashoffset", circ * (1 - p));
    ringO.setAttribute("stroke", ink); ringO.setAttribute("stroke-opacity", 0.6);
    ticks.forEach((k, i) => { k.style.opacity = seg(t, 0.5 + i * 0.006, 0.8 + i * 0.006) * (i % 30 === 0 ? 1 : 0.6); k.setAttribute("stroke", i % 30 === 0 ? acc : ink); });
    letters.forEach((k, i) => { k.style.opacity = E.out(seg(t, 1.0 + i * 0.08, 1.4 + i * 0.08)); k.setAttribute("fill", i === 0 ? acc : ink); });
    const settle = 50 * Math.exp(-1.2 * t) * Math.cos(2.6 * t);
    const push = E.in(seg(t, CUE.push, CUE.pushEnd));
    ring.setAttribute("transform", `translate(${lerp(1400, 960, E.inOut(seg(t, CUE.push - 0.4, CUE.pushEnd - 0.4)))},540) rotate(${settle}) scale(${1 + push * 2.4})`);
    ring.style.opacity = 1 - push;
    kicker.style.color = hi;
    inout(kicker, t, 1.0, CUE.push + 0.4, 0.5, 14);
    kicker.style.letterSpacing = lerp(0.6, 0.28, E.out(seg(t, 1.0, 2.0))) + "em";
    lineA.style.color = ink; lineB.style.color = ink; lineC.style.color = ink;
    subA.style.color = sub; subB.style.color = sub;
    lineB.querySelector(".n").style.color = acc;
    inout(lineA, t, CUE.hook[0], CUE.hook[1], 0.5, 60);
    inout(subA, t, CUE.hook[0] + 0.7, CUE.hook[1], 0.5, 24);
    inout(lineB, t, CUE.hook[1], CUE.hook[2], 0.5, 60);
    inout(subB, t, CUE.hook[1] + 0.7, CUE.hook[2], 0.5, 24);
    inout(lineC, t, CUE.hook[2], CUE.push + 0.9, 0.6, 50);
    op(flash, E.inOut(seg(t, CUE.pushEnd - 0.1, CUE.pushEnd + 0.3)) * (1 - E.inOut(seg(t, T.s2, T.s2 + 0.3))));
  });
})();
