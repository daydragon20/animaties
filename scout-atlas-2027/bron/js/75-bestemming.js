/* ═════════════ 8 · DE BESTEMMING (128–140 s): de route van thuis naar de winnaar ═════════════ */
(function () {
  const t0 = T.s8;
  const L = el("div", { class: "L", style: `color:${D.ink}` }, sceneRoot);
  el("div", { class: "L", style: "background:linear-gradient(90deg, rgba(239,231,212,0) 46%, rgba(239,231,212,.9) 60%, rgba(239,231,212,.95) 100%)" }, L);
  const fin = el("div", { class: "a", style: "left:1130px;top:250px;width:740px;white-space:normal" }, L);
  const fKick = el("div", { class: "kick", style: `color:${D.mint}` }, fin, "Bovenaan de lijst");
  const nameSize = Math.min(210, Math.floor(700 / (WIN.name.length * 0.47)));
  const fName = el("div", { class: "disp", style: `font-size:${nameSize}px;margin-top:16px;color:${D.ink}` }, fin, escapeHtml(WIN.name) + ".");
  const fScore = el("div", { class: "mono", style: `font-size:44px;font-weight:600;margin-top:26px;color:${D.mint}` }, fin, `${fTot(WIN)} <span style="color:${D.sub};font-weight:500">van 100</span>`);
  const fProf = el("div", { class: "serif", style: `font-size:52px;margin-top:10px;line-height:1.1;color:${D.ink}` }, fin, escapeHtml(WIN.profile));
  const fMore = el("div", { class: "serif", style: `font-size:50px;margin-top:44px;line-height:1.12;color:${D.mint}` }, fin, "Alle scores zitten in de data. Zoek zelf verder.");
  const credits = el("div", { class: "a mono", style: `left:1126px;width:740px;top:928px;font-size:24px;line-height:1.5;font-weight:500;color:${D.sub};letter-spacing:.08em;white-space:normal` }, L,
    `SCOUT ATLAS ${YEAR} · DATA VAN ${GEN.toUpperCase()}<br>${CC.length} LANDEN · ${V.length} VRAGEN · ${CATS.length} CATEGORIEËN`);
  renders.push((t) => {
    const lt = t - t0;
    const o = win(t, t0 - 0.05, T.end + 5, 0.01, 0.01);
    op(L, o);
    if (o <= 0) return;
    inout(fKick, lt, 3.0, 99, 0.5, 10);
    inout(fName, lt, 3.4, 99, 0.6, 40);
    inout(fScore, lt, 5.2, 99, 0.5, 16);
    inout(fProf, lt, 5.8, 99, 0.5, 16);
    inout(fMore, lt, 8.0, 99, 0.5, 16);
    inout(credits, lt, 9.0, 99, 0.5, 0);
  });
})();
