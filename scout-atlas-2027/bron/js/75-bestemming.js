/* ═════════════ 9 · DE BESTEMMING (178–204 s): de route, het plannen, de aftiteling ═════════════ */
(function () {
  const t0 = T.s9;
  const L = el("div", { class: "L", style: `color:${D.ink};--hlc:${D.mint}` }, sceneRoot);
  el("div", { class: "L", style: "background:linear-gradient(90deg, rgba(239,231,212,0) 50%, rgba(239,231,212,.85) 62%, rgba(239,231,212,.94) 100%)" }, L);
  const fin = el("div", { class: "a", style: "left:1090px;top:200px;width:790px;white-space:normal" }, L);
  const fKick = el("div", { class: "kick", style: `color:${D.mint}` }, fin, "Bovenaan de lijst");
  const nameSize = WIN.name.length <= 7 ? 190 : WIN.name.length <= 10 ? 140 : WIN.name.length <= 13 ? 108 : 92;
  const fName = el("div", { class: "disp", style: `font-size:${nameSize}px;margin-top:16px;color:${D.ink};line-height:.92` }, fin, WIN.name + ".");
  const fScore = el("div", { class: "mono", style: `font-size:28px;margin-top:14px;color:${D.sub}` }, fin,
    `${fTot(WIN)} punten · ${WIN.rondes.wins} van ${NR} rondes gewonnen · nummer 2: ${escapeHtml(ELIG[1].name)} ${fTot(ELIG[1])}`);
  const fLine = el("div", { class: "serif", style: `font-size:54px;margin-top:22px;color:${D.mint};line-height:1.1` }, fin, "Nu begint het echte plannen.");
  // de lijst
  const card = el("div", { class: "a", style: "left:1110px;top:560px;width:720px;height:330px;background:#f8f3e6;border-radius:6px;color:#0b1d21;box-shadow:0 30px 80px rgba(0,0,0,.25)" }, L);
  el("div", { class: "a", style: "left:0;top:0;width:720px;height:330px;background:repeating-linear-gradient(180deg, transparent 0 55px, rgba(61,156,127,.28) 55px 57px);border-radius:6px" }, card);
  el("div", { class: "a", style: "left:60px;top:0;width:2px;height:330px;background:rgba(255,139,102,.55)" }, card);
  el("div", { class: "a serif", style: "left:88px;top:16px;font-size:30px;font-weight:600;color:#0b1d21" }, card, "Nog uitzoeken, vóór we boeken:");
  const ITEMS = ["Welke kampplaats, en is ze vrij in juli?", "Trein, bus of vliegtuig: wat kost het echt?", "Het reisadvies vlak voor vertrek", "De zwakste cijfers nakijken (zie de verkenner)"];
  const items = ITEMS.map((txt, i) => {
    const row = el("div", { class: "a", style: `left:88px;top:${72 + i * 58}px;width:600px;height:50px` }, card);
    el("div", { class: "a", style: "left:0;top:9px;width:30px;height:30px;border:3px solid #0b1d21;border-radius:5px" }, row);
    el("div", { class: "a roman", style: "left:48px;top:6px;font-size:28px;color:#0b1d21;white-space:nowrap" }, row, txt);
    return row;
  });
  const credits = el("div", { class: "a mono", style: `left:1110px;width:760px;top:930px;font-size:15px;line-height:1.8;font-weight:500;color:${D.sub};letter-spacing:.1em;white-space:normal` }, L,
    `SCOUT ATLAS ${YEAR} · VERSIE ${DATA.version || 3} · DATA VAN ${GEN.toUpperCase()}<br>${CC.length} LANDEN · ${V.length} VRAGEN · ${CATS.length} CATEGORIEËN · ${NR} ONDERZOEKSRONDES · ${nl(CC.length * V.length * NR, 0)} OPZOEKINGEN<br>` +
    `BUITEN DE RACE: ${(DATA.buiten || []).map((b) => b.land || b.naam || b).join(", ").toUpperCase()}`);
  renders.push((t) => {
    const lt = t - t0;
    const o = win(t, t0 - 0.05, T.end + 5, 0.01, 0.01);
    op(L, o);
    if (o <= 0) return;
    inout(fKick, lt, 1.2, 999, 0.35, 10);
    inout(fName, lt, 1.5, 999, 0.45, 40);
    inout(fScore, lt, 2.2, 999, 0.4, 16);
    inout(fLine, t, CUE.routeEnd, 999, 0.4, 16);
    const c2 = E.out5(seg(t, CUE.list, CUE.list + 0.6));
    set(card, c2, (1 - c2) * 80, 0, 1, lerp(3, -1.5, c2));
    items.forEach((r, i) => set(r, E.out5(seg(t, CUE.list + 0.5 + i * 0.35, CUE.list + 0.9 + i * 0.35)), (1 - E.out5(seg(t, CUE.list + 0.5 + i * 0.35, CUE.list + 0.9 + i * 0.35))) * -16, 0));
    inout(credits, t, CUE.credits, 999, 0.4, 0);
  });
})();
