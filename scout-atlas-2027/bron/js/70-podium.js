/* ═════════════ 7 · HET PODIUM (124–140 s): teksten, de plaatsen 4–10 ═════════════ */
(function () {
  const L = el("div", { class: "L", style: `color:${D.ink}` }, sceneRoot);
  const line = el("div", { class: "a serif", style: `left:480px;width:1400px;text-align:center;top:985px;font-size:42px;color:${D.ink}` }, L,
    `De beste som van ${V.length} vragen, ${CATS.length} categorieën, ${NR} rondes onderzoek.`);
  const flash = el("div", { class: "L", style: "background:radial-gradient(circle at 50% 55%, rgba(255,255,255,.85), rgba(255,255,255,0) 55%)" }, L);
  const rest = el("div", { class: "a", style: "left:110px;top:300px;width:330px" }, L);
  el("div", { class: "kick", style: `color:${D.mint};font-size:18px;margin-bottom:10px` }, rest, "En daarna");
  const restRows = ELIG.slice(3, 10).map((r, i) => {
    const row = el("div", { class: "a", style: `left:0;top:0;width:330px;height:46px;border-bottom:1.5px solid rgba(16,38,44,.14)` }, rest);
    el("div", { class: "mono", style: `position:absolute;left:0;top:10px;font-size:20px;color:${D.sub}` }, row, String(i + 4));
    el("div", { class: "mono", style: `position:absolute;left:40px;top:8px;font-size:${r.name.length > 12 ? 19 : 24}px;font-weight:500;color:${D.ink}` }, row, r.name);
    el("div", { class: "disp", style: `position:absolute;right:0;top:4px;font-size:34px;color:${D.ochre}` }, row, fTot(r));
    return row;
  });
  renders.push((t) => {
    const o = win(t, T.s7 - 0.1, T.s8, 0.01, 0.5);
    op(L, o);
    if (o <= 0) return;
    const tb = t - CUE.podium[2];
    op(flash, tb >= 0 ? Math.max(0, 1 - tb / 1.0) * 0.9 : 0);
    inout(line, t, CUE.podium[2] + 2.2, T.s8 + 0.2, 0.4, 14);
    op(rest, E.out(seg(t, CUE.rest, CUE.rest + 0.3)) * (1 - E.in(seg(t, T.s8 - 0.4, T.s8))));
    restRows.forEach((row, i) => { const p = E.out5(seg(t, CUE.rest + i * 0.12, CUE.rest + 0.4 + i * 0.12)); set(row, p * (1 - E.in(seg(t, T.s8 - 0.4, T.s8))), (1 - p) * -30, 44 + i * 52); });
  });
})();
