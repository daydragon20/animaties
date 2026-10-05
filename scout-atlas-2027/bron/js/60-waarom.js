/* ═════════════ 4 · WAAROM DE WINNAAR — nergens de beste, nergens zwak ═════════════ */
const WH = { a: T.s4 + CARD_DUR, b: T.s4 + 8.25, c: T.s4 + 15.75, end: T.s5 };

/* — sfeer in 3D voor hoofdstuk 4 en 5: een trage draadbol, stof en gloed (geen informatie) — */
const AMB = GL.add((() => {
  const scene = new THREE.Scene();
  scene.background = col(COL.night);
  const cam = new THREE.PerspectiveCamera(40, 16 / 9, 0.1, 200);
  const wire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(6, 3)), new THREE.LineBasicMaterial({ color: col(COL.mint), transparent: true, opacity: 0.075, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(wire);
  const wire2 = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(9.5, 2)), new THREE.LineBasicMaterial({ color: col(COL.gold), transparent: true, opacity: 0.035, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(wire2);
  const rnd = mulberry32(64), N = 1400, p = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { const u = rnd() * 2 - 1, a = rnd() * 6.283, r = 4 + rnd() * 18; p[i * 3] = Math.sqrt(1 - u * u) * Math.cos(a) * r; p[i * 3 + 1] = u * r; p[i * 3 + 2] = Math.sqrt(1 - u * u) * Math.sin(a) * r; }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(p, 3));
  const dust = new THREE.Points(g, new THREE.PointsMaterial({ color: col("#cfeee4"), size: 0.06, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(dust);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW_TEX, color: col("#1f776b"), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.35 }));
  glow.scale.set(26, 26, 1); scene.add(glow);
  function update(t) {
    wire.rotation.y = t * 0.08; wire.rotation.x = t * 0.03; wire2.rotation.y = -t * 0.05; dust.rotation.y = t * 0.02;
    const warm = E.inOut(seg(t, T.s5, T.s5 + 2));
    glow.material.color.set(hexLerp("#1f776b", "#6b4a12", warm));
    cam.position.set(Math.sin(t * 0.05) * 3, Math.cos(t * 0.04) * 1.5, 22); cam.lookAt(0, 0, 0);
    cam.setViewOffset(1920, 1080, -520, 0, 1920, 1080); cam.updateProjectionMatrix();
  }
  const vis = (t) => (t >= T.s4 && t < FIN.map ? E.inOut(seg(t, T.s4, T.s4 + 1.5)) * (1 - E.inOut(seg(t, FIN.map - 0.6, FIN.map))) * 0.9 : 0);
  return { scene, cam, update, vis, post: () => ({ bloom: 0.9, th: 0.4 }) };
})());

(function () {
  const L = el("div", { class: "L" }, sceneRootEl);
  const w = WIN;
  /* A — geen enkele categorie gewonnen */
  const A = el("div", { class: "a", style: "left:150px;top:150px;width:1620px;white-space:normal" }, L);
  el("div", { class: "kick", style: `color:${COL.mint}` }, A, `Plaats van ${w.name} per categorie, op ${CC.length}`);
  const ah = el("div", { class: "serif", style: "font-size:74px;margin-top:18px" }, A);
  const aw = words(ah, `${w.name} wint *${w.catWins.length ? numWord(w.catWins.length).toLowerCase() : "geen enkele"}* categorie.`);
  const grid = el("div", { style: "display:grid;grid-template-columns:repeat(7,1fr);gap:14px;margin-top:48px" }, A);
  const chips = M.byWeight.map((c) => {
    const k = el("div", { style: "position:relative;height:178px;border-radius:12px;padding:18px 18px 16px;background:rgba(239,233,218,.04);border:1px solid rgba(239,233,218,.1);overflow:hidden" }, grid);
    const r = w.catRank[c];
    el("div", { class: "mono", style: `font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:${COL.muted};white-space:normal;line-height:1.3;height:36px` }, k, escapeHtml(short(c)));
    const n = el("div", { class: "thin", style: `font-size:78px;margin-top:6px;color:${r <= 3 ? COL.gold : r >= CC.length - 2 ? COL.coral : COL.paper}` }, k, `${r}<span style="font-size:30px;color:${COL.muted}">e</span>`);
    el("div", { class: "mono", style: `font-size:14px;color:${COL.soft};margin-top:2px` }, k, `score ${fCat(w, c)} · ${nl(M.catShare[c], 0)}%`);
    return { k, c, r };
  });
  const aNote = el("div", { class: "mono", style: `font-size:18px;color:${COL.soft};margin-top:28px;line-height:1.7` }, A,
    `Zwaarste categorie eerst. Beste plaats: <span style="color:${COL.gold}">${Math.min(...CATS.map((c) => w.catRank[c]))}e</span> (${escapeHtml(CATS.filter((c) => w.catRank[c] === Math.min(...CATS.map((x) => w.catRank[x]))).join(", "))}). ` +
    `Minst goed: <span style="color:${COL.coral}">${Math.max(...CATS.map((c) => w.catRank[c]))}e</span> (${escapeHtml(CATS.filter((c) => w.catRank[c] === Math.max(...CATS.map((x) => w.catRank[x]))).join(", "))}).`);

  /* B — bereik per land: van zwakste tot sterkste categorie */
  const B = el("div", { class: "a", style: "left:150px;top:110px;width:1620px;white-space:normal" }, L);
  el("div", { class: "kick", style: `color:${COL.gold}` }, B, "Van zwakste tot sterkste categorie, per land");
  const bh = el("div", { class: "serif", style: "font-size:66px;margin-top:16px" }, B);
  const bw = words(bh, "Maar het zakt *nergens diep* weg.");
  const X0 = 210, X1 = 1770, Y0 = 940, Y1 = 330, LO = 50, HI = 100;
  const yOf = (v) => lerp(Y0, Y1, (v - LO) / (HI - LO));
  const svg = sv("svg", { width: 1920, height: 1080, style: "position:absolute;left:0;top:0;overflow:visible" }, L);
  const axis = sv("g", {}, svg);
  [50, 60, 70, 80, 90, 100].forEach((v) => {
    sv("line", { x1: X0 - 10, x2: X1, y1: yOf(v), y2: yOf(v), stroke: COL.paper, "stroke-opacity": v === 50 ? 0.25 : 0.08, "stroke-width": 1 }, axis);
    sv("text", { x: X0 - 22, y: yOf(v) + 5, "text-anchor": "end", "font-size": 15, fill: COL.muted }, axis, String(v));
  });
  const n = CC.length, dx = (X1 - X0) / n;
  const bars = CC.map((c, i) => {
    const x = X0 + dx * (i + 0.5);
    const g = sv("g", {}, svg);
    const isW = c === w;
    const ln = sv("line", { x1: x, x2: x, y1: yOf(c.floor), y2: yOf(c.floor), stroke: isW ? COL.mint : COL.paper, "stroke-opacity": isW ? 1 : 0.45, "stroke-width": isW ? 10 : 6, "stroke-linecap": "round" }, g);
    const dot = sv("circle", { cx: x, cy: yOf(c.totalExact), r: isW ? 8 : 5, fill: isW ? COL.gold : COL.paper, stroke: COL.night, "stroke-width": 2 }, g);
    const lb = sv("text", { x, y: Y0 + 26, "text-anchor": "end", "font-size": 14, fill: isW ? COL.mint : COL.muted, transform: `rotate(-50 ${x} ${Y0 + 26})` }, g, c.name);
    return { c, g, ln, dot, lb, x, isW, i };
  });
  const lowest = [...CC].sort((a, b) => a.floor - b.floor)[0];
  // waarde naast het onderste uiteinde van een staaf
  const endVal = (c, color) => {
    const b = bars.find((x) => x.c === c);
    return sv("text", { x: b.x + 12, y: yOf(c.floor) + 6, "font-size": 18, "font-weight": 600, fill: color }, svg, fCat(c, c.worst));
  };
  const annW = endVal(w, COL.mint), annL = endVal(lowest, COL.coral);
  // uitleg rechtsboven in de grafiek, niet over de staven
  const callout = el("div", { class: "a mono", style: `left:1150px;top:${Y1 - 10}px;width:640px;white-space:normal;font-size:18px;line-height:1.7;padding:14px 18px;border-radius:10px;background:rgba(4,10,12,.78);border:1px solid rgba(239,233,218,.1)` }, L,
    `<div><span style="color:${COL.mint}">●</span>&nbsp; <b style="font-weight:600;color:${COL.mint}">${w.name}</b>: laagste categorie ${fCat(w, w.worst)} (${escapeHtml(w.worst.toLowerCase())}) — de ${M.floorRank.indexOf(w) + 1}e hoogste bodem van alle ${CC.length}</div>` +
    `<div><span style="color:${COL.coral}">●</span>&nbsp; <b style="font-weight:600;color:${COL.coral}">${lowest.name}</b>: ${fCat(lowest, lowest.worst)} (${escapeHtml(lowest.worst.toLowerCase())}) — de laagste bodem</div>`);
  const legend = el("div", { class: "a mono", style: `left:${X0}px;top:${Y1 - 40}px;font-size:15px;color:${COL.muted};letter-spacing:.04em` }, L,
    `<span style="display:inline-block;width:5px;height:16px;background:${COL.paper};opacity:.5;vertical-align:-3px;border-radius:2px"></span>&nbsp; zwakste → sterkste categorie &nbsp;&nbsp;&nbsp;<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${COL.paper};vertical-align:0"></span>&nbsp; eindscore &nbsp;&nbsp;&nbsp; landen op volgorde van de eindstand`);

  /* C — eerlijk: zwakke punten en hoe dicht het bij elkaar ligt */
  const C = el("div", { class: "a", style: "left:150px;top:200px;width:1620px;white-space:normal" }, L);
  el("div", { class: "kick", style: `color:${COL.coral}` }, C, "Waar het punten laat liggen");
  const cRow = el("div", { style: "display:flex;gap:80px;margin-top:26px;align-items:flex-end" }, C);
  const lastCat = CATS.reduce((a, c) => (w.catRank[c] > w.catRank[a] ? c : a), CATS[0]);
  const weak = [...new Set([w.worst, lastCat])];
  weak.forEach((c) => el("div", {}, cRow,
    `<div class="thin" style="font-size:120px;color:${COL.coral}">${fCat(w, c)}</div><div class="mono" style="font-size:20px;margin-top:4px">${escapeHtml(c)}</div>` +
    `<div class="mono" style="font-size:16px;color:${COL.muted};margin-top:6px">${w.catRank[c]}e van ${CC.length}${c === w.worst ? " · zijn laagste categorie" : ""}</div>`));
  const gapRow = el("div", { style: "display:flex;gap:80px;margin-top:70px;align-items:flex-end" }, C);
  el("div", {}, gapRow, `<div class="kick" style="color:${COL.mint};font-size:14px">Verschil met nummer 2</div><div class="thin" style="font-size:104px;margin-top:8px">${nl(w.totalExact - SECOND.totalExact, 2)}</div><div class="mono" style="font-size:16px;color:${COL.muted}">${SECOND.name} ${fTot(SECOND)}</div>`);
  el("div", {}, gapRow, `<div class="kick" style="color:${COL.mint};font-size:14px">Tussen nummer 1 en ${CC.length}</div><div class="thin" style="font-size:104px;margin-top:8px">${nl(w.totalExact - LAST.totalExact, 2)}</div><div class="mono" style="font-size:16px;color:${COL.muted}">${LAST.name} ${fTot(LAST)}</div>`);
  const cEnd = el("div", { class: "serif", style: "font-size:58px;margin-top:64px" }, C);
  const cw = words(cEnd, "Elk land op deze lijst is *een goed kamp.*");

  renders.push((t) => {
    const on = t >= T.s4 && t < T.s5 + 0.3;
    op(L, on ? 1 : 0);
    if (!on) return;
    inout(A, t, WH.a, WH.b, 0.8, 18, 0.6); revealWords(aw, t, WH.a, 0.13, 1.0);
    chips.forEach((k, i) => { const p = E.out5(seg(t, WH.a + 1.3 + i * 0.12, WH.a + 1.9 + i * 0.12)); k.k.style.opacity = p; k.k.style.transform = `translateY(${(1 - p) * 24}px) rotateX(${(1 - p) * 40}deg)`; });
    op(aNote, E.out(seg(t, WH.a + 3.4, WH.a + 4.2)));
    inout(B, t, WH.b, WH.c, 0.8, 18, 0.6); revealWords(bw, t, WH.b, 0.13, 1.0);
    const bo = win(t, WH.b, WH.c, 0.6, 0.6);
    op(svg, bo); op(legend, bo * E.out(seg(t, WH.b + 0.6, WH.b + 1.2)));
    bars.forEach((b) => {
      const p = E.out5(seg(t, WH.b + 0.6 + b.i * 0.05, WH.b + 1.6 + b.i * 0.05));
      b.ln.setAttribute("y2", lerp(yOf(b.c.floor), yOf(b.c.ceil), p));
      b.dot.setAttribute("opacity", E.out(seg(t, WH.b + 1.4 + b.i * 0.05, WH.b + 1.8 + b.i * 0.05)));
      b.g.setAttribute("opacity", 0.25 + 0.75 * p);
    });
    annW.setAttribute("opacity", E.out(seg(t, WH.b + 3.0, WH.b + 3.6)));
    annL.setAttribute("opacity", E.out(seg(t, WH.b + 3.6, WH.b + 4.2)));
    op(callout, bo * E.out(seg(t, WH.b + 3.2, WH.b + 4.0)));
    inout(C, t, WH.c, WH.end + 0.2, 0.8, 18, 0.5);
    revealWords(cw, t, WH.c + 2.6, 0.13, 1.0);
  });
})();
