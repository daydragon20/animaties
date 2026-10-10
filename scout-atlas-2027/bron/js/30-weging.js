/* ═════════════ 3 · DE WEGING (32–60 s): de rugzak, de meters, de tien rondes ═════════════ */
(function () {
  const W = CUE.wg;
  const L = el("div", { class: "L", style: `color:${D.ink};--hlc:${D.mint}` }, sceneRoot);

  /* — (a) de rugzak: wat telt het zwaarst — */
  const A = el("div", { class: "a", style: "left:140px;top:120px;width:760px;white-space:normal" }, L);
  el("div", { class: "kick", style: `color:${D.mint}` }, A, "De weging");
  const aw = words(el("div", { class: "serif", style: "font-size:70px;line-height:1.05;margin-top:18px" }, A), "Wat telt *het zwaarst?*");
  const aSub = el("div", { class: "mono", style: `font-size:26px;margin-top:18px;color:${D.sub};line-height:1.5` }, A, `${V.length} vragen. Niet allemaal even zwaar.`);
  // tegels: alle vragen, in een rooster rechts; daarna vliegen ze naar hun vak in de rugzak
  const tileLayer = el("div", { class: "L" }, L);
  const COLS = 3, TW = 300, TH_ = 44, TX0 = 960, TY0 = 150;
  const tiles = V.map((v, i) => {
    const tc = TIERCOL[v.tier] ? TIERCOL[v.tier].d : D.sub;
    const e = el("div", { class: "a mono", style: `left:0;top:0;width:${TW - 12}px;height:${TH_ - 8}px;border-radius:6px;background:${D.card};border:2px solid ${tc};color:${D.ink};font-size:17px;line-height:${TH_ - 12}px;padding:0 10px;overflow:hidden;text-overflow:ellipsis;transform-origin:0 0;box-shadow:0 2px 6px rgba(16,38,44,.12)` }, tileLayer, escapeHtml(v.naam));
    return { v, e, x0: TX0 + (i % COLS) * TW, y0: TY0 + Math.floor(i / COLS) * TH_ };
  });
  // vaklabels rechts van de rugzak
  const tierInfo = [...TIERS].sort((a, b) => a - b).map((t) => {
    const cats = CATS.filter((c) => tierOf(c) === t);
    return { t, name: M.TIERN[t], share: M.tierShare[t], cats, n: V.filter((v) => v.tier === t).length };
  });
  const ANCH = { 1: "-10%", 2: "-50%", 3: "-90%" }; // het onderste vak hangt onder zijn lijn, het bovenste erboven
  const tierEls = tierInfo.map((ti) => {
    const sl = PACK.layers.find((l) => l.t === ti.t), [, sy] = sl ? PACK.screen[PACK.layers.indexOf(sl)] : [0, 540];
    const e = el("div", { class: "a", style: `left:${PACK.cx + PACK.side + 70}px;top:${sy}px;width:820px;white-space:normal` }, L);
    const tc = TIERCOL[ti.t] ? TIERCOL[ti.t].d : D.sub;
    el("div", { style: `display:flex;align-items:baseline;gap:18px` }, e,
      `<span class="disp" style="font-size:${ti.t === 1 ? 92 : 72}px;color:${tc}">${nl(ti.share, 0)}<span style="font-size:.5em">%</span></span>` +
      `<span class="roman" style="font-size:${ti.t === 1 ? 42 : 34}px;color:${D.ink}">${escapeHtml(ti.name)}</span>`);
    el("div", { class: "mono", style: `font-size:${ti.cats.length > 3 ? 19 : 22}px;color:${D.sub};margin-top:2px;line-height:1.35` }, e, ti.cats.map((c) => `${escapeHtml(catName(c))} <b style="color:${tc}">${nl(catW[c], 0)}%</b>`).join(" · ") + ` · ${ti.n} vragen`);
    return { ti, e, sy, anch: ANCH[ti.t] || "-50%" };
  });
  // lijnen van de laag naar het label
  const lineSvg = sv("svg", { width: 1920, height: 1080, style: "position:absolute;left:0;top:0" }, L);
  const tierLines = tierEls.map((te) => sv("line", { x1: PACK.cx + PACK.side + 8, y1: te.sy, x2: PACK.cx + PACK.side + 56, y2: te.sy, stroke: D.ink, "stroke-opacity": 0.35, "stroke-width": 2 }, lineSvg));
  const layerOf = (tier) => PACK.layers.findIndex((l) => l.t === tier);

  /* — (b) de meters: hoe we meten — */
  const B = el("div", { class: "a", style: "left:140px;top:120px;width:1640px;white-space:normal" }, L);
  el("div", { class: "kick", style: `color:${D.mint}` }, B, "De meters");
  const bw = words(el("div", { class: "serif", style: "font-size:70px;line-height:1.05;margin-top:18px" }, B), "Geen buikgevoel: *elke vraag heeft een meetlat.*");
  // per tier de zwaarste vraag, met de waarde van de (latere) winnaar als voorbeeld
  const meters = [...TIERS].sort((a, b) => a - b).map((t) => V.filter((v) => v.tier === t).sort((a, b) => b.gewicht - a.gewicht)[0]).filter(Boolean);
  const srcName = (b) => (b && b.naam ? (b.naam.length > 60 ? b.naam.slice(0, 58) + "…" : b.naam) : "bron in de verkenner");
  // korte eenheid voor de labels op de meetlat: tot de eerste komma of haak, hoogstens 22 tekens
  const kortEenheid = (e) => { const s = String(e || "").split(/[,(]/)[0].trim(); return s.length > 22 ? s.slice(0, 21) + "…" : s; };
  const meterEls = meters.map((v, i) => {
    const f = WIN.feiten[v.id] || {}, s = v.meter && v.meter.schaal;
    const tc = TIERCOL[v.tier] ? TIERCOL[v.tier].d : D.sub;
    const e = el("div", { class: "a", style: `left:0;top:${150 + i * 245}px;width:1640px;height:220px;white-space:normal` }, B);
    el("div", { class: "mono", style: `font-size:21px;letter-spacing:.2em;text-transform:uppercase;color:${tc}` }, e, `${escapeHtml(catName(v.categorie))} · gewicht ${nl(v.gewicht, 1)} %`);
    el("div", { class: "roman", style: `font-size:38px;color:${D.ink};margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:1100px` }, e, escapeHtml(v.vraag || v.naam));
    el("div", { class: "mono", style: `font-size:20px;color:${D.sub};margin-top:4px;line-height:1.35;width:1100px;height:54px;overflow:hidden` }, e, escapeHtml((v.meter && v.meter.wat) || "") + ` <span style="color:${D.mint}">· ${escapeHtml(srcName(f.bron))}</span>`);
    // de meetlat
    const lo_ = s && s.type === "ankers" ? Math.min(...s.punten.map((p) => p[0])) : 0, hi_ = s && s.type === "ankers" ? Math.max(...s.punten.map((p) => p[0])) : 100;
    const invert = s && s.type === "ankers" && s.punten[0][1] > s.punten[s.punten.length - 1][1] && s.punten[0][0] < s.punten[s.punten.length - 1][0];
    const isRub = s && s.type === "rubriek";
    const BY = 150;
    el("div", { class: "a", style: `left:0;top:${BY}px;width:1100px;height:14px;border-radius:7px;background:linear-gradient(90deg, ${invert ? tc : "#d9d2bf"}, ${invert ? "#d9d2bf" : tc})` }, e);
    const needle = el("div", { class: "a", style: `left:0;top:${BY - 14}px;width:4px;height:42px;background:${D.ink};border-radius:2px;transform-origin:50% 50%` }, e);
    const val = el("div", { class: "a mono", style: `left:0;top:${BY + 34}px;font-size:24px;font-weight:600;color:${D.ink};transform:translateX(-50%);white-space:nowrap;background:${D.bg};padding:0 8px` }, e);
    const score = el("div", { class: "a", style: `left:1180px;top:${BY - 70}px;width:420px` }, e);
    el("div", { class: "mono", style: `font-size:18px;letter-spacing:.2em;text-transform:uppercase;color:${D.sub}` }, score, `score ${escapeHtml(WIN.name)}`);
    const scoreN = el("div", { class: "disp", style: `font-size:88px;color:${tc};line-height:.95` }, score, "");
    const eenh = kortEenheid(v.meter && v.meter.eenheid);
    const endL = el("div", { class: "a mono", style: `left:0;top:${BY + 34}px;font-size:18px;color:${D.sub}` }, e, isRub ? "laagste niveau" : nl(lo_, lo_ % 1 ? 1 : 0) + " " + escapeHtml(eenh));
    const endR = el("div", { class: "a mono", style: `left:1100px;top:${BY + 34}px;font-size:18px;color:${D.sub};transform:translateX(-100%)` }, e, isRub ? "hoogste niveau" : nl(hi_, hi_ % 1 ? 1 : 0) + " " + escapeHtml(eenh));
    const sc = WIN.scores[v.i] == null ? 0 : WIN.scores[v.i];
    const isLog = s && s.type === "log";
    const frac = isRub || !s || (s.type !== "ankers" && !isLog) ? sc / 100 : isLog ? clamp((Math.log(Math.max(Number(f.waarde), 1e-9)) - Math.log(Math.min(s.van, s.tot))) / (Math.log(Math.max(s.van, s.tot)) - Math.log(Math.min(s.van, s.tot)))) : clamp((Number(f.waarde) - lo_) / (hi_ - lo_));
    const txt = f.waarde == null ? "—" : isRub ? `niveau ${nl(Number(f.waarde), 0)}` : `${nl(Number(f.waarde), Number.isInteger(Number(f.waarde)) ? 0 : 1)} ${eenh}`;
    return { v, e, needle, val, scoreN, frac, sc, txt, endL, endR, at: W.meter[i] || W.meter[W.meter.length - 1], y0: 150 + i * 245 };
  });

  /* — (c) tien rondes: de kolommen vallen samen — */
  const Cc = el("div", { class: "a", style: "left:140px;top:120px;width:760px;white-space:normal" }, L);
  el("div", { class: "kick", style: `color:${D.mint}` }, Cc, "Tien keer gemeten");
  const cw = words(el("div", { class: "serif", style: "font-size:66px;line-height:1.05;margin-top:18px" }, Cc), `${numWord(NR)} onderzoeksrondes, *elk met eigen bronnen.*`);
  el("div", { class: "mono", style: `font-size:26px;margin-top:18px;color:${D.sub};line-height:1.5` }, Cc, `Per land en per vraag telt de waarde die <b style="color:${D.ink}">het vaakst voorkomt</b>.<br>Eén uitschieter beslist nooit.`);
  const colLayer = el("div", { class: "L" }, L);
  const RO = DATA.rondeOverzicht || [];
  const NROWS = ELIG.length, RH = Math.min(16, Math.floor(700 / NROWS)), CW_ = 54, CX0 = 1010, CY0 = 170;
  const colEls = RO.map((r, k) => {
    const g = el("div", { class: "a", style: `left:${CX0 + k * CW_}px;top:${CY0}px;width:${CW_ - 10}px` }, colLayer);
    el("div", { class: "mono", style: `font-size:15px;color:${D.sub};text-align:center;margin-bottom:6px` }, g, String(r.ronde));
    const cells = [];
    for (let j = 0; j < NROWS; j++) {
      // kleur: hoe hoog dit land in de consensus staat (rang 1 = licht, laatste = donker)
      const name = (ELIG.find((c) => c.rondes.ranks[k] === j + 1) || {}).name;
      const rank = name ? C(name).rank : NROWS;
      cells.push(el("div", { class: "a", style: `left:0;top:${28 + j * RH}px;width:${CW_ - 10}px;height:${RH - 3}px;border-radius:3px;background:${scoreCol(100 - ((rank - 1) / (NROWS - 1)) * 100, 0, 100)}` }, g));
    }
    return { g, cells, k };
  });
  const consCol = el("div", { class: "a", style: `left:${CX0 + RO.length * CW_ + 60}px;top:${CY0}px;width:${CW_ * 2}px` }, colLayer);
  el("div", { class: "mono", style: `font-size:15px;color:${D.ink};text-align:center;margin-bottom:6px;font-weight:600` }, consCol, "samen");
  for (let j = 0; j < NROWS; j++) el("div", { class: "a", style: `left:0;top:${28 + j * RH}px;width:${CW_ * 2}px;height:${RH - 3}px;border-radius:3px;background:${scoreCol(100 - (j / (NROWS - 1)) * 100, 0, 100)}` }, consCol);
  const colFoot = el("div", { class: "a mono", style: `left:${CX0}px;top:${CY0 + 28 + NROWS * RH + 14}px;width:780px;white-space:normal;font-size:18px;line-height:1.4;color:${D.sub}` }, colLayer, `Elke kolom: de ${NROWS} landen in de volgorde van die ronde.<br>Lichter = hoger in de uiteindelijke ranglijst.`);

  renders.push((t) => {
    const on = t >= T.s3 - 0.1 && t < T.s4 + 0.1;
    op(L, on ? 1 : 0);
    if (!on) return;
    // (a)
    const aOn = win(t, W.a, W.b, 0.01, 0.5);
    inout(A, t, W.a + 0.3, W.b - 0.2, 0.6, 16); revealWords(aw, t, W.a + 0.3, 0.14, 0.7);
    op(aSub, win(t, W.tiles - 0.2, W.fly + 0.6, 0.4, 0.4));
    tiles.forEach((tl, i) => {
      const inP = E.out5(seg(t, W.tiles + i * 0.04, W.tiles + i * 0.04 + 0.5));
      const li = layerOf(tl.v.tier), [lx, ly] = li >= 0 ? PACK.screen[li] : [PACK.cx, 540];
      const fl = E.inOut(seg(t, W.fly + i * 0.03, W.fly + i * 0.03 + 0.7));
      const x = lerp(tl.x0, lx - 60 + ((i * 37) % 120), fl), y = lerp(tl.y0, ly - 10 + ((i * 53) % 40), fl);
      const s = lerp(1, 0.12, fl);
      set(tl.e, inP * (1 - E.in(seg(fl, 0.6, 1))) * aOn, x, y, s);
    });
    tierEls.forEach((te, i) => {
      const li = layerOf(te.ti.t);
      const a = li >= 0 ? PACK.layerTimes[li] + 0.5 : W.layers[0];
      const p = E.out5(seg(t, a, a + 0.6)) * (1 - E.in(seg(t, W.b - 0.5, W.b - 0.1)));
      te.e.style.opacity = p; te.e.style.visibility = p <= 0.002 ? "hidden" : "visible";
      te.e.style.transform = `translate(${(1 - p) * 30}px, ${te.anch})`;
      tierLines[i].setAttribute("stroke-opacity", 0.35 * p);
    });
    // (b)
    inout(B, t, W.b, W.c - 0.2, 0.6, 16); revealWords(bw, t, W.b, 0.12, 0.7);
    meterEls.forEach((m) => {
      const p = E.out5(seg(t, m.at, m.at + 0.6));
      set(m.e, p, (1 - p) * -24, 0);
      const q = E.inOut(seg(t, m.at + 0.5, m.at + 1.6));
      const x = 1100 * m.frac * q;
      m.needle.style.transform = `translateX(${x - 2}px)`;
      // het waardelabel blijft binnen de meetlat; de eindlabels wijken als het label erover zou vallen
      m.val.style.left = x + "px";
      m.val.style.transform = x < 160 ? "translateX(0)" : x > 940 ? "translateX(-100%)" : "translateX(-50%)";
      m.val.textContent = q > 0.02 ? m.txt : "";
      op(m.endL, x < 330 && q > 0.02 ? 0 : 1); op(m.endR, x > 770 && q > 0.02 ? 0 : 1);
      m.scoreN.textContent = q > 0.02 ? nl(m.sc * q, m.sc % 1 ? 1 : 0) : "";
    });
    // (c)
    inout(Cc, t, W.c, W.end - 0.2, 0.6, 16); revealWords(cw, t, W.c, 0.12, 0.7);
    const merge = E.inOut(seg(t, W.merge, W.merge + 1.2));
    colEls.forEach((ce) => {
      const p = E.out5(seg(t, W.cols + ce.k * 0.25, W.cols + ce.k * 0.25 + 0.5));
      const tx = lerp(0, (RO.length * CW_ + 60) - ce.k * CW_, merge);
      set(ce.g, p * (1 - E.in(seg(merge, 0.5, 1))), tx + (1 - p) * 40, 0);
    });
    set(consCol, E.out(seg(t, W.merge + 0.6, W.merge + 1.4)) * win(t, W.merge, W.end, 0.01, 0.3), 0, 0, lerp(0.9, 1, E.out(seg(t, W.merge + 0.6, W.merge + 1.4))));
    op(colFoot, win(t, W.cols + 1.2, W.end - 0.3, 0.4, 0.3));
  });
})();
