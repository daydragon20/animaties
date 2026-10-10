/* ═════════════ 6 · DE RUIMTE (106–124 s): teksten en kwadranten bij de 3D-puntenwolk ═════════════ */
(function () {
  const L = el("div", { class: "L", style: `color:${D.ink};--hlc:${D.mint}` }, sceneRoot);
  const head = el("div", { class: "a", style: "left:140px;top:110px;width:600px;white-space:normal" }, L);
  el("div", { class: "kick", style: `color:${D.mint}` }, head, "De ruimte");
  const hw = words(el("div", { class: "serif", style: "font-size:58px;line-height:1.05;margin-top:14px" }, head), "Goedkoop, avontuurlijk *én kampeerbaar?*");
  const sub = el("div", { class: "mono", style: `font-size:24px;margin-top:16px;color:${D.sub};line-height:1.5` }, head,
    `Drie assen: ${escapeHtml(short(SPACE.XC).toLowerCase())}, ${escapeHtml(short(SPACE.YC).toLowerCase())} en ${SPACE.t2.length ? escapeHtml(short(SPACE.t2[0]).toLowerCase()) : "kamperen"}.<br>Elke bol is een land. Hoe groter, hoe hoger de eindscore.<br><span style="color:${D.ochre}">●</span> nummer één · <span style="color:${D.mint}">●</span> top 10`);
  // kwadranten (verschijnen in het vlakke beeld)
  const QA = ["translate(0,-50%)", "translate(-100%,-50%)", "translate(0,-50%)", "translate(-100%,-50%)"];
  const qs = [["spectaculair, maar duur", 0], ["goedkoop en wild", 1], ["duur, weinig avontuur", 2], ["goedkoop, weinig avontuur", 3]].map(([txt, i]) =>
    el("div", { class: "a serif", style: `left:0;top:0;font-size:28px;color:${D.sub};white-space:nowrap;background:rgba(239,231,212,.75);padding:2px 10px;border-radius:6px` }, L, txt));
  // focusteksten (data-gestuurd)
  const R = SPACE.R, px = SPACE.px, py = SPACE.py, pz = SPACE.pz;
  const xm = (Math.min(...R.map(px)) + Math.max(...R.map(px))) / 2, ym = (Math.min(...R.map(py)) + Math.max(...R.map(py))) / 2;
  const dear = R.filter((r) => px(r) < xm - 5 && py(r) > ym + 5).sort((a, b) => py(b) - py(a)).slice(0, 3);
  const wild = R.filter((r) => px(r) > xm + 5 && py(r) > ym + 5).sort((a, b) => py(b) - py(a)).slice(0, 3);
  const t2 = SPACE.t2;
  const f2 = (r) => nl(pz(r), 1);
  const RU_ = CUE.ru;
  const focus = [
    { a: RU_.focus[0], b: RU_.focus[1], sel: dear, html: dear.length
        ? `<b>Spectaculair, maar de rekening:</b> ${lijst(dear.map((r) => escapeHtml(r.name)))}. ${escapeHtml(dear[0].name)} scoort op ${escapeHtml(short(SPACE.XC).toLowerCase())} <b style="color:${D.coral}">${fCat(dear[0], SPACE.XC)}</b>.`
        : `Links boven is leeg: niemand is tegelijk heel duur en heel spectaculair.` },
    { a: RU_.focus[1], b: RU_.focus[2], sel: wild, html: wild.length
        ? `<b>Goedkoop en wild:</b> ${lijst(wild.map((r) => escapeHtml(r.name)))}. ${wild[0] === WIN ? `En ${escapeHtml(wild[0].name)} scoort ook op kamperen <b style="color:${D.mint}">${f2(wild[0])}</b>.` : `Maar op kamperen haalt ${escapeHtml(wild[0].name)} <b style="color:${wild[0].tierRank[2] <= 10 ? D.mint : D.coral}">${f2(wild[0])}</b>${wild[0].tierRank[2] > 10 ? ", en de rest weegt mee" : ""}.`}`
        : `Rechts boven is leeg: goedkoop en wild gaan zelden samen.` },
    { a: RU_.focus[2], b: T.s7, sel: [WIN], html: `<b style="color:${D.ochre}">${escapeHtml(WIN.name)}</b>: ${escapeHtml(short(SPACE.XC).toLowerCase())} <b>${fCat(WIN, SPACE.XC)}</b> (${WIN.catRank[SPACE.XC]}e), ${escapeHtml(short(SPACE.YC).toLowerCase())} <b>${fCat(WIN, SPACE.YC)}</b> (${WIN.catRank[SPACE.YC]}e)${t2.length ? `, kamperen <b>${f2(WIN)}</b> (${WIN.tierRank[2]}e)` : ""}. ${WIN.catRank[SPACE.XC] === 1 || WIN.catRank[SPACE.YC] === 1 ? "Sterk waar het zwaar weegt." : "Niet het goedkoopst, niet het wildst. Wel de beste som."}` },
  ];
  focus.forEach((f) => (f.e = el("div", { class: "a mono", style: `left:140px;top:500px;width:560px;white-space:normal;font-size:26px;line-height:1.45;color:${D.ink}` }, L, f.html)));
  const SZ = 60;
  renders.push((t) => {
    const on = t >= T.s6 - 0.1 && t < T.s7 + 0.1;
    op(L, on ? 1 : 0);
    if (!on) return;
    inout(head, t, T.s6 + 0.3, T.s7 - 0.3, 0.6, 16); revealWords(hw, t, T.s6 + 0.3, 0.1, 0.6);
    op(sub, win(t, RU_.dots + 0.4, T.s7 - 0.3, 0.4, 0.3));
    const flat = E.inOut(seg(t, RU_.flat[0], RU_.flat[1]));
    // kwadrantlabels op de achterwand
    const corners = [[-SZ, SZ + 5], [SZ, SZ + 5], [-SZ, -SZ - 5], [SZ, -SZ - 5]]; // net buiten het vlak, boven en onder
    qs.forEach((q, i) => {
      const [x, y, ok] = project(SPACE.cam, corners[i][0], corners[i][1], -SZ + 0.5);
      q.style.transform = `translate(${x}px,${y}px) ${QA[i]}`;
      op(q, ok ? flat * 0.95 * (1 - E.in(seg(t, T.s7 - 0.5, T.s7))) : 0);
    });
    let fIdx = -1; focus.forEach((f, i) => { if (t >= f.a) fIdx = i; });
    SPACE.setSel(fIdx >= 0 ? focus[fIdx].sel : []);
    focus.forEach((f) => inout(f.e, t, f.a, f.b, 0.3, 10));
  });
})();
