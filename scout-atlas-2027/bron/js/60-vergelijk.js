/* ═════════════ 6 · HET VERGELIJK (94–114 s): top 10 × 14 categorieën ═════════════ */
(function () {
  const t0 = T.s6;
  const L = el("div", { class: "L", style: `color:${D.ink}` }, sceneRoot);
  const kick = el("div", { class: "a kick", style: `left:100px;top:98px;color:${D.mint}` }, L, "De top 10 naast elkaar");
  const head = el("div", { class: "a serif", style: "left:100px;top:132px;font-size:64px" }, L);
  const wH = words(head, "Niemand is overal de beste.");
  const GX = 520, GY = 352, CW = 134, GH = 47;
  const rowsC = byWeight;
  const colHead = TOP.map((r, j) => el("div", { class: "a disp", style: `left:${GX + j * CW}px;top:${GY - 44}px;width:${CW}px;text-align:center;font-size:27px;font-weight:700;letter-spacing:0` }, L, r.name));
  const rowHead = rowsC.map((c, i) => el("div", { class: "a disp", style: `left:100px;top:${GY + i * GH + 8}px;width:410px;font-size:30px;font-weight:600;text-transform:none;letter-spacing:.01em;color:${D.sub}` }, L, c));
  const lo = 55, hi = 99;
  const cells = [];
  rowsC.forEach((c, i) => TOP.forEach((r, j) => {
    const v = r.cat[c];
    const k = clamp((v - lo) / (hi - lo));
    const bgc = `rgba(14,122,95,${(0.06 + 0.86 * k * k * k).toFixed(3)})`;
    const e = el("div", { class: "a", style: `left:${GX + j * CW + 3}px;top:${GY + i * GH + 3}px;width:${CW - 6}px;height:${GH - 6}px;border-radius:4px;background:${bgc};display:flex;align-items:center;justify-content:center` }, L,
      `<span class="disp" style="font-size:33px;font-weight:700;color:${k > 0.78 ? "#f8f3e6" : D.ink}">${nl(v, 1)}</span>`);
    const ring = el("div", { class: "a", style: `left:${GX + j * CW}px;top:${GY + i * GH}px;width:${CW}px;height:${GH}px;border-radius:6px;border:4px solid ${v === topMax[c] ? "#d99a0c" : D.coral}` }, L);
    cells.push({ e, ring, i, j, c, r, best: v === topMax[c], worst: v === topMin[c] });
  }));
  const legend = el("div", { class: "a mono", style: `right:100px;top:132px;font-size:26px;color:${D.sub};text-align:right;line-height:1.5` }, L,
    `<span style="color:#d99a0c">■</span> beste van de tien<br><span style="color:${D.coral}">■</span> zwakste van de tien`);

  // drie lichtpunten: de categoriekampioen onder de tien, de winnaar, de nummer twee. Alles volgt uit de data.
  const star = TOP.reduce((a, r) => (bestIn(r).length > bestIn(a).length ? r : a), TOP[0]);
  const runner = CC[1];
  const b = (c, x) => `<b style="color:${c}">${escapeHtml(x)}</b>`;
  const winBest = bestIn(WIN).length;
  const costNote = worstIn(star).includes("Kostprijs") ? ` Kostprijs: ${b(D.coral, fCat(star, "Kostprijs"))}.` : "";
  const focus = [
    { r: star, a: CUE.gridFocus[1], b: CUE.gridFocus[2] - 0.2,
      html: `${b(D.ink, star.name)}: ${bestIn(star).length}× de beste van de tien… en ${worstIn(star).length}× de zwakste.${costNote}` },
    { r: WIN, a: CUE.gridFocus[2], b: CUE.gridFocus[3] - 0.2,
      html: `${b(D.mint, WIN.name)}: ${winBest === 0 ? "nooit de beste" : winBest <= 2 ? "zelden de beste" : "vaak de beste"}, nooit diep. Laagste score: ${b(D.ink, fCat(WIN, lowestCat(WIN)))} (${escapeHtml(short(lowestCat(WIN)).toLowerCase())})${M.floorRank[0] === WIN ? `, de hoogste bodem van alle ${CC.length} landen` : ""}.` },
    { r: runner, a: CUE.gridFocus[3], b: T.s7 - 0.2,
      html: `${b(D.ink, runner.name)}: nummer twee. Zwakste plek: ${b(D.coral, fCat(runner, lowestCat(runner)))} (${escapeHtml(short(lowestCat(runner)).toLowerCase())}).` },
  ];
  focus.forEach((f) => (f.e = el("div", { class: "a serif", style: `left:100px;top:208px;width:1720px;white-space:normal;font-size:36px;line-height:1.14;color:${D.ink}` }, L, f.html)));
  renders.push((t) => {
    const o = win(t, t0 - 0.1, T.s7, 0.01, 0.5);
    op(L, o);
    if (o <= 0) return;
    const lt = t - t0;
    inout(kick, lt, 0.1, 19.4, 0.5, 10);
    set(head, 1); revealWords(wH, lt, 0.2, 0.12, 0.5);
    colHead.forEach((e, j) => inout(e, lt, 0.5 + j * 0.06, 19.6, 0.4, 12));
    rowHead.forEach((e, i) => inout(e, lt, 0.6 + i * 0.05, 19.6, 0.4, 0));
    const marks = E.out(seg(t, CUE.gridFocus[0], CUE.gridFocus[0] + 0.5));
    let fIdx = -1; focus.forEach((f, i) => { if (t >= f.a) fIdx = i; });
    const fj = fIdx >= 0 ? TOP.indexOf(focus[fIdx].r) : -1;
    const fP = fIdx >= 0 ? E.out(seg(t, focus[fIdx].a, focus[fIdx].a + 0.4)) : 0;
    cells.forEach((c) => {
      const d = 0.9 + (c.i + c.j) * 0.05;
      const p = E.out5(seg(lt, d, d + 0.4));
      const dim = fj >= 0 ? (c.j === fj ? 1 : lerp(1, 0.2, fP)) : 1;
      set(c.e, p * dim, 0, (1 - p) * 14, lerp(0.85, 1, p) * (fj === c.j ? lerp(1, 1.04, fP) : 1));
      op(c.ring, (c.best || c.worst ? marks * (fj < 0 || c.j === fj ? 1 : lerp(1, 0.15, fP)) : 0) * p);
    });
    colHead.forEach((e, j) => (e.style.color = fj === j && fP > 0.5 ? D.mint : D.ink));
    op(legend, E.out(seg(t, CUE.gridFocus[0] + 0.2, CUE.gridFocus[0] + 0.7)) * (1 - E.in(seg(lt, 19.4, 19.8))));
    focus.forEach((f) => inout(f.e, t, f.a, f.b, 0.4, 10));
  });
})();
