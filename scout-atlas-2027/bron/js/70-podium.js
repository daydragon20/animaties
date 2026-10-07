/* ═════════════ 7 · HET PODIUM (114–128 s): tekst bij de 3D-scène ═════════════ */
(function () {
  const L = el("div", { class: "L", style: `color:${D.ink}` }, sceneRoot);
  const kick = el("div", { class: "a kick", style: `left:100px;top:104px;color:${D.mint}` }, L, "Het podium");
  const hA = el("div", { class: "a serif", style: "left:100px;top:148px;font-size:76px" }, L);
  const wA = words(hA, "De top drie.");
  const hB = el("div", { class: "a serif", style: `left:100px;top:148px;font-size:76px;--hlc:${D.mint}` }, L);
  const wB = words(hB, "En op nummer *één…*");
  const wins = WIN.catWins.length;
  const sentence = `${escapeHtml(WIN.name)} wint ${wins === 0 ? "geen enkele categorie" : wins === 1 ? "één categorie" : numWord(wins).toLowerCase() + " categorieën"}. Maar zakt nergens onder <b style="color:${D.mint}">${fCat(WIN, lowestCat(WIN))}</b>.`;
  const line = el("div", { class: "a serif", style: `left:0;width:1920px;text-align:center;top:948px;font-size:52px;color:${D.ink}` }, L, sentence);
  const flash = el("div", { class: "L", style: "background:radial-gradient(circle at 50% 55%, rgba(255,255,255,.85), rgba(255,255,255,0) 55%)" }, L);
  renders.push((t) => {
    const o = win(t, T.s7 - 0.1, T.s8, 0.01, 0.5);
    op(L, o);
    if (o <= 0) return;
    const lt = t - T.s7;
    const tb = t - CUE.podium[2];
    op(flash, tb >= 0 ? Math.max(0, 1 - tb / 1.0) * 0.9 : 0);
    inout(kick, lt, 0.2, 6.6, 0.5, 10);
    set(hA, 1 - E.in(seg(lt, 3.4, 3.8)), 0, -E.in(seg(lt, 3.4, 3.8)) * 20); revealWords(wA, lt, 0.4, 0.12, 0.5);
    set(hB, 1 - E.in(seg(lt, 6.2, 6.6)), 0, -E.in(seg(lt, 6.2, 6.6)) * 20); revealWords(wB, lt, 3.9, 0.12, 0.5);
    inout(line, t, CUE.podium[2] + 2.4, T.s8 + 0.2, 0.5, 14);
  });
})();
