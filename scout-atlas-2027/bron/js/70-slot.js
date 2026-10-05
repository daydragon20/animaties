/* ═════════════ 5 · EERLIJK IS EERLIJK — versie 1, de route, de eindtitel ═════════════ */
(function () {
  const L = el("div", { class: "L" }, sceneRootEl);
  /* A — versie 1 + notitieboekje met open vragen */
  const A = el("div", { class: "a", style: "left:150px;top:250px;width:860px;white-space:normal" }, L);
  el("div", { class: "kick", style: `color:${COL.gold}` }, A, "Eerlijk is eerlijk");
  const ah = el("div", { class: "disp", style: `font-size:132px;margin-top:18px;color:${COL.gold};white-space:nowrap` }, A, "Dit is versie 1.");
  const as = el("div", { class: "serif", style: "font-size:46px;line-height:1.2;margin-top:26px" }, A);
  const aw = words(as, "Een eerste kaart. Nog niet *elk cijfer* is bron per bron nagetrokken.");
  as.style.width = "760px";
  const am = el("div", { class: "mono", style: `font-size:17px;color:${COL.muted};margin-top:26px;line-height:1.7` }, A,
    `${CC.filter((c) => c.confidence !== "High").length} van de ${CC.length} landen hebben zekerheid "gemiddeld". De volledige data zit in deze film: druk op D.`);
  const book = el("div", { class: "a", style: "left:1080px;top:220px;width:680px;height:620px;perspective:1600px" }, L);
  const page = el("div", { style: "position:absolute;inset:0;border-radius:8px;background:#ece5d3;color:#0b1d21;box-shadow:0 40px 90px rgba(0,0,0,.55);transform-origin:50% 60%;overflow:hidden" }, book);
  el("div", { style: "position:absolute;inset:0;background:repeating-linear-gradient(180deg, transparent 0 63px, rgba(31,119,107,.25) 63px 65px)" }, page);
  el("div", { style: "position:absolute;left:78px;top:0;bottom:0;width:2px;background:rgba(255,125,92,.55)" }, page);
  [120, 300, 480].forEach((y) => el("div", { style: `position:absolute;left:24px;top:${y}px;width:22px;height:22px;border-radius:50%;background:#04090b;box-shadow:inset 0 2px 4px rgba(0,0,0,.6)` }, page));
  el("div", { class: "serif", style: "position:absolute;left:110px;top:34px;font-size:44px;font-weight:500;font-style:italic" }, page, "Nog uitzoeken:");
  const ITEMS = [["Waar slaan we onze tenten op?", "kampplaats"], ["Hoe geraken we daar?", "vervoer"], ["Wat kost het per persoon?", "budget"], ["Wat zegt het reisadvies dan?", "actuele reisadviezen"]];
  const items = ITEMS.map(([txt, tag], i) => {
    const r = el("div", { style: `position:absolute;left:110px;top:${140 + i * 112}px;width:540px` }, page);
    el("div", { style: "position:absolute;left:0;top:10px;width:36px;height:36px;border:3px solid #0b1d21;border-radius:6px" }, r);
    el("div", { class: "disp", style: "position:absolute;left:58px;top:4px;font-size:44px;text-transform:none;font-weight:700;white-space:nowrap" }, r, txt);
    el("div", { class: "mono", style: "position:absolute;left:60px;top:58px;font-size:15px;letter-spacing:.16em;text-transform:uppercase;color:#1f776b" }, r, tag);
    return r;
  });
  /* B — de route */
  const B = el("div", { class: "a", style: "left:150px;top:170px;width:700px;white-space:normal" }, L);
  el("div", { class: "kick", style: `color:${COL.gold}` }, B, `België → ${WIN.name}`);
  const bh = el("div", { class: "serif", style: "font-size:76px;line-height:1.05;margin-top:18px" }, B);
  const bw = words(bh, "Nu begint *het echte plannen.*");
  /* C — de eindtitel */
  const C = el("div", { class: "a", style: "left:0;width:1920px;text-align:center;top:290px" }, L);
  const ck = el("div", { class: "kick", style: `color:${COL.gold};font-size:16px;letter-spacing:.6em` }, C, `Zomer ${YEAR}`);
  const ct = el("div", { class: "disp", style: "font-size:230px;margin-top:20px;letter-spacing:.16em" }, C, WIN.name);
  const cl = el("div", { style: "width:520px;height:1px;background:rgba(239,233,218,.4);margin:34px auto 0" }, C);
  const cs = el("div", { class: "it", style: `font-size:44px;margin-top:28px;color:${COL.soft}` }, C, "Waar ons beste kamp ooit begint.");
  const cr = el("div", { class: "a mono", style: `left:0;width:1920px;text-align:center;top:930px;font-size:13px;letter-spacing:.32em;color:${COL.muted};text-transform:uppercase` }, L,
    `Scout Atlas ${YEAR} · versie 1 · data van ${GEN} · ${CC.length} landen · ${V.length} vragen · ${CATS.length} categorieën`);
  const shade = el("div", { class: "L", style: "background:radial-gradient(ellipse 70% 60% at 50% 45%, rgba(3,6,7,.55), rgba(3,6,7,0) 70%)" }, L);
  L.insertBefore(shade, A);
  const blk = el("div", { class: "L", style: "background:#000" }, L);
  renders.push((t) => {
    const on = t >= T.s5 && t <= T.end + 1;
    op(L, on ? 1 : 0);
    if (!on) return;
    inout(A, t, FIN.v1, FIN.map, 0.8, 18, 0.6); revealWords(aw, t, FIN.v1 + 1.0, 0.1, 0.9);
    op(am, E.out(seg(t, FIN.v1 + 3.0, FIN.v1 + 3.8)));
    const bp = E.out5(seg(t, FIN.v1 + 0.8, FIN.v1 + 1.8)), bo = E.inOut(seg(t, FIN.map - 0.6, FIN.map));
    set(book, bp * (1 - bo), (1 - bp) * 160, 0, 1, 0, (1 - bp) * 6);
    page.style.transform = `rotateY(${lerp(-24, -8, bp) + Math.sin(t * 0.6) * 2}deg) rotateX(${4 + Math.sin(t * 0.5) * 1.5}deg) rotateZ(${lerp(6, -2, bp)}deg)`;
    items.forEach((r, i) => { const p = E.out5(seg(t, FIN.v1 + 1.8 + i * 0.6, FIN.v1 + 2.4 + i * 0.6)); r.style.opacity = p; r.style.transform = `translateX(${(1 - p) * -20}px)`; });
    inout(B, t, FIN.route - 0.2, FIN.title - 0.2, 0.8, 18, 0.6); revealWords(bw, t, FIN.route + 0.4, 0.14, 1.0);
    const ci = E.out(seg(t, FIN.title, FIN.title + 1.8));
    op(shade, ci);
    set(C, ci, 0, (1 - ci) * 20, 1, 0, (1 - ci) * 14);
    ct.style.letterSpacing = lerp(0.42, 0.16, E.out(seg(t, FIN.title, FIN.title + 4))) + "em";
    op(ck, E.out(seg(t, FIN.title + 0.6, FIN.title + 1.4)));
    cl.style.transform = `scaleX(${E.out5(seg(t, FIN.title + 1.0, FIN.title + 2.2))})`;
    op(cs, E.out(seg(t, FIN.title + 1.6, FIN.title + 2.6)));
    op(cr, E.out(seg(t, FIN.title + 2.6, FIN.title + 3.6)));
    op(blk, E.inOut(seg(t, FIN.out, T.end)));
  });
})();
