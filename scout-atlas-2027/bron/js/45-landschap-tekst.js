/* ═════════════ 4 · HET LANDSCHAP (60–78 s): teksten en landlabels bij het kubusveld ═════════════ */
(function () {
  const L = el("div", { class: "L", style: `--hlc:${COL.gold}` }, sceneRoot);
  const shadeL = el("div", { class: "L", style: "background:linear-gradient(90deg, rgba(4,9,11,.9) 0%, rgba(4,9,11,.62) 34%, rgba(4,9,11,0) 56%)" }, L);
  const shadeT = el("div", { class: "L", style: "background:linear-gradient(180deg, rgba(4,9,11,.92) 0%, rgba(4,9,11,.66) 22%, rgba(4,9,11,0) 38%)" }, L);
  const box = () => el("div", { class: "a", style: "left:140px;top:170px;width:820px;white-space:normal" }, L);
  const A = box(), B = box();
  el("div", { class: "kick", style: `color:${COL.mint}` }, A, "Lezen zoals een kaart");
  const aw = words(el("div", { class: "serif", style: "font-size:76px;line-height:1.05;margin-top:22px;color:#efe9da" }, A), "Elke kubus is *één score.*");
  const aw2 = words(el("div", { class: "serif", style: "font-size:76px;line-height:1.05;color:#efe9da" }, A), "Elke rij is *één land.*");
  el("div", { class: "kick", style: `color:${COL.gold}` }, B, "Pieken en dalen");
  const bw = words(el("div", { class: "serif", style: "font-size:76px;line-height:1.05;margin-top:22px;color:#efe9da" }, B), "Samen vormen ze *een landschap.*");
  const ROWS = TERRAIN.ROWS;
  const lo = ROWS.flatMap((c) => c.scores.map((s, i) => ({ s, c, v: V[i] }))).filter((x) => x.s != null).reduce((a, b) => (b.s < a.s ? b : a));
  el("div", { class: "mono", style: `font-size:28px;color:${COL.soft};margin-top:30px;line-height:1.55` }, B,
    `<span style="color:${COL.gold}">■</span> ${nl(TERRAIN.n100, 0)} keer een perfecte 100<br>laagste score: ${nl(lo.s, 1)}<br><span style="font-size:26px;color:${COL.soft}">${escapeHtml(lo.c.name)} · ${escapeHtml(lo.v.naam.toLowerCase())}</span>`);
  const Cc = el("div", { class: "a", style: "left:0;width:1920px;text-align:center;top:116px" }, L);
  el("div", { class: "kick", style: `color:${COL.mint}` }, Cc, "Gesorteerd op eindscore");
  const cw = words(el("div", { class: "serif", style: "font-size:68px;margin-top:16px;color:#efe9da" }, Cc), "Van *beste* links naar laatste rechts.");
  const Dd = el("div", { class: "a", style: "left:0;width:1920px;text-align:center;top:116px" }, L);
  el("div", { class: "kick", style: `color:${COL.gold}` }, Dd, "Naar de race");
  const dw = words(el("div", { class: "serif", style: "font-size:68px;margin-top:16px;color:#efe9da" }, Dd), `*De top tien* gaat door.`);
  const LABNAME = { "Bosnië en Herzegovina": "Bosnië-Herz.", "Noord-Macedonië": "N.-Macedonië", "Verenigd Koninkrijk": "Ver. Koninkrijk" };
  const labs = ROWS.map((c) => {
    const e = el("div", { class: "a mono", style: "left:0;top:0;font-size:24px;font-weight:600;transform-origin:0 50%;text-shadow:0 1px 8px #000" }, labLayer);
    e.textContent = c.name;
    return { c, e };
  });
  renders.push((t) => {
    const on = t >= T.s4 - 0.1 && t < T.s5 + 0.1;
    op(L, on ? 1 : 0);
    labs.forEach((l) => op(l.e, 0));
    if (!on) return;
    op(shadeL, win(t, LS.a - 0.4, LS.sort, 0.8, 0.8)); op(shadeT, win(t, LS.sort - 0.4, LS.end, 0.8, 0.5));
    inout(A, t, LS.a, LS.b - 0.3, 0.6, 16); revealWords(aw, t, LS.a, 0.14, 0.7); revealWords(aw2, t, LS.a + 1.8, 0.14, 0.7);
    inout(B, t, LS.b, LS.sort + 0.1, 0.6, 16); revealWords(bw, t, LS.b, 0.14, 0.7);
    inout(Cc, t, LS.sort + 0.4, LS.top - 0.2, 0.6, 16); revealWords(cw, t, LS.sort + 0.4, 0.12, 0.7);
    inout(Dd, t, LS.top, LS.end - 0.3, 0.6, 16); revealWords(dw, t, LS.top, 0.12, 0.7);
    const vis = TERRAIN.vis(t);
    if (vis <= 0) return;
    const sp = (j) => E.inOut(seg(t, LS.sort + j * 0.05, LS.sort + 1.4 + j * 0.05));
    const topP = E.inOut(seg(t, LS.top, LS.top + 0.8));
    const lo_ = E.out(seg(t, LS.b + 1.0, LS.b + 2.0)) * (1 - E.inOut(seg(t, LS.end - 0.5, LS.end)));
    labs.forEach((l, j) => {
      const x = lerp(TERRAIN.xA[l.c.name], TERRAIN.xB[l.c.name], sp(j));
      const [px, py, ok] = project(TERRAIN.cam, x, 0, 1.6);
      if (!ok) return;
      const dim = j >= 10 ? 1 - 0.6 * topP : 1;
      op(l.e, lo_ * vis * dim);
      l.e.style.transform = `translate(${px}px,${py + 12}px) rotate(48deg)`;
      const done = sp(j) > 0.98;
      l.e.innerHTML = (done ? `<span style="color:${j === 0 ? COL.gold : COL.mint}">${j + 1}</span> ` : "") + escapeHtml(LABNAME[l.c.name] || l.c.name);
      l.e.style.color = j === 0 && done ? COL.gold : COL.paper;
    });
  });
})();
