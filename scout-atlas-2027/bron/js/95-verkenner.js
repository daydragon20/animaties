/* ═════════════ VERKENNER: alle data, elke bron, de spreiding over de rondes ═════════════
   Ranglijst, kaart van alle scores (landen × vragen, zoombaar), speel met de gewichten, de rondes, bronnen en meters.
   Opent vanzelf na de film, of met de knop "data" / toets D. */
const VK = (() => {
  const $v = (id) => document.getElementById(id);
  const root = $v("vk"), cv = $v("vkCanvas"), g = cv.getContext("2d"), wrap = $v("vkWrap"), tipEl = $v("vkTip"), side = $v("vkSide");
  const mini = $v("vkMini"), mg = mini.getContext("2d"), hint = $v("vkHint");
  const CW = 64, QH = 24, CHH = 34, TRH = 40, GAP = 8;
  let LW = 330, TH = 132;
  const st = { s: 1, ox: 0, oy: 0, collapsed: new Set(), order: CC.slice(), sortBy: null, hover: null, sel: null, q: "", tab: "rank" };
  let rows = [], rowY = [], rowH = [], totalW = 0, totalH = 0, W = 0, H = 0, dpr = 1, dirty = true, opened = false;
  const catOrder = [...CATS].sort((a, b) => tierOf(a) - tierOf(b) || catW[b] - catW[a]);
  const tiersAsc = [...TIERS].sort((a, b) => a - b);
  const NAME_FONT = "500 15px 'IBM Plex Mono', monospace";
  const lum = (hex) => { const [r, g_, b] = hex2rgb(hex).map((x) => x / 255); return 0.2126 * r + 0.7152 * g_ + 0.0722 * b; };
  const cellCol = (v) => (v == null ? "#1a2224" : v === 100 ? COL.gold : scoreCol(v));
  const qMatch = (txt) => !st.q || String(txt).toLowerCase().includes(st.q);
  const HEADNAME = { "Bosnië en Herzegovina": "Bosnië-Herz.", "Noord-Macedonië": "N.-Macedonië", "Verenigd Koninkrijk": "Ver. Koninkrijk" };
  const fv = (x, d = 1) => (x == null ? "—" : nl(x, d));
  const zk = (z) => `<span class="z ${z || "midden"}">${z || "?"}</span>`;
  const fraw = (f, v) => (f == null || f.waarde == null ? "—" : (f.waarde % 1 ? nl(Number(f.waarde), Math.abs(f.waarde) < 10 ? 2 : 1) : nl(Number(f.waarde), 0)) + (f.eenheid || v.meter.eenheid ? ` <small>${escapeHtml(f.eenheid || v.meter.eenheid)}</small>` : ""));
  const srcHtml = (b) => !b ? `<span class="vk-muted">geen bron genoteerd</span>` : (b.url ? `<a href="${escapeHtml(b.url)}" target="_blank" rel="noopener">${escapeHtml(b.naam || b.url)}</a>` : escapeHtml(b.naam || "")) + (b.jaar ? ` <span class="vk-muted">(${escapeHtml(b.jaar)})</span>` : "");
  const tierCol = (t) => (TIERCOL[t] ? TIERCOL[t].n : COL.soft);

  function layout() {
    rows = []; rowY = []; rowH = [];
    let y = 0;
    tiersAsc.forEach((t) => {
      rows.push({ type: "tier", t }); rowY.push(y); rowH.push(TRH); y += TRH;
      catOrder.filter((c) => tierOf(c) === t).forEach((c) => {
        rows.push({ type: "cat", c }); rowY.push(y); rowH.push(CHH); y += CHH;
        if (!st.collapsed.has(c)) V.filter((v) => v.categorie === c).forEach((v) => { rows.push({ type: "q", v, c }); rowY.push(y); rowH.push(QH); y += QH; });
        y += GAP;
      });
      y += GAP;
    });
    totalH = y; totalW = st.order.length * CW;
    drawMiniBase();
    dirty = true;
  }
  function resize() {
    const r = wrap.getBoundingClientRect();
    W = Math.max(200, r.width); H = Math.max(200, r.height); dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    LW = W < 640 ? 150 : W < 1000 ? 230 : 330; TH = W < 640 ? 110 : 132;
    dirty = true;
  }
  const viewW = () => (W - LW) / st.s, viewH = () => (H - TH) / st.s;
  function clampView() {
    const vw = viewW(), vh = viewH();
    st.ox = totalW <= vw ? (totalW - vw) / 2 : clamp(st.ox, -vw * 0.15, totalW - vw * 0.85);
    st.oy = totalH <= vh ? 0 : clamp(st.oy, -vh * 0.1, totalH - vh * 0.6);
  }
  function fitWidth() { st.s = clamp((W - LW - 24) / totalW, 0.08, 6); st.ox = 0; st.oy = 0; clampView(); dirty = true; }
  function fitAll() { st.s = clamp(Math.min((W - LW - 24) / totalW, (H - TH - 24) / totalH), 0.05, 6); st.ox = 0; st.oy = 0; clampView(); dirty = true; }
  function zoomAt(f, mx, my) {
    const s2 = clamp(st.s * f, 0.05, 8);
    const wx = st.ox + (mx - LW) / st.s, wy = st.oy + (my - TH) / st.s;
    st.s = s2; st.ox = wx - (mx - LW) / s2; st.oy = wy - (my - TH) / s2;
    clampView(); dirty = true;
  }
  let anim = null;
  function zoomAnim(f, mx = LW + (W - LW) / 2, my = TH + (H - TH) / 2) {
    const s0 = st.s, t0 = performance.now();
    cancelAnimationFrame(anim);
    const step = (now) => { const p = E.out(clamp((now - t0) / 260)); const target = s0 * Math.pow(f, p); zoomAt(target / st.s, mx, my); if (p < 1) anim = requestAnimationFrame(step); };
    anim = requestAnimationFrame(step);
  }
  function rowAt(wy) { let lo = 0, hi = rows.length - 1, k = -1; while (lo <= hi) { const m = (lo + hi) >> 1; if (rowY[m] <= wy) { k = m; lo = m + 1; } else hi = m - 1; } return k >= 0 && wy < rowY[k] + rowH[k] ? k : -1; }
  function hit(mx, my) {
    const wx = st.ox + (mx - LW) / st.s, wy = st.oy + (my - TH) / st.s;
    const col_ = Math.floor(wx / CW), ri = rowAt(wy);
    const okC = col_ >= 0 && col_ < st.order.length;
    if (mx < LW && my < TH) return { zone: "corner" };
    if (my < TH) return okC ? { zone: "top", col: col_ } : null;
    if (mx < LW) return ri >= 0 ? { zone: "left", ri } : null;
    return okC && ri >= 0 ? { zone: "cell", col: col_, ri } : null;
  }
  const rowVal = (row, c) => (row.type === "tier" ? c.tierExact[row.t] : row.type === "cat" ? c.catExact[row.c] : c.scores[row.v.i]);

  function draw() {
    if (!opened || st.tab !== "matrix") return;
    dirty = false;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = "#05090b"; g.fillRect(0, 0, W, H);
    const s = st.s, cw = CW * s;
    const c0 = Math.max(0, Math.floor(st.ox / CW)), c1 = Math.min(st.order.length - 1, Math.floor((st.ox + viewW()) / CW));
    let r0 = 0; while (r0 < rows.length - 1 && rowY[r0] + rowH[r0] < st.oy) r0++;
    let r1 = r0; while (r1 < rows.length - 1 && rowY[r1 + 1] < st.oy + viewH()) r1++;
    const sx = (wx) => LW + (wx - st.ox) * s, sy = (wy) => TH + (wy - st.oy) * s;
    const gap = s > 0.45 ? 2 : s > 0.2 ? 1 : 0;
    const showVal = cw >= 34 && QH * s >= 15;
    const selName = st.sel && st.sel.c ? st.sel.c.name : null;
    const selVar = st.sel && st.sel.v ? st.sel.v.i : null;
    const hv = st.hover;
    g.save(); g.beginPath(); g.rect(LW, TH, W - LW, H - TH); g.clip();
    g.textAlign = "center"; g.textBaseline = "middle";
    for (let ri = r0; ri <= r1; ri++) {
      const row = rows[ri], y = sy(rowY[ri]), h = rowH[ri] * s;
      const isAgg = row.type !== "q";
      const match = isAgg ? true : qMatch(row.v.naam) || qMatch(catName(row.c));
      for (let ci = c0; ci <= c1; ci++) {
        const c = st.order[ci], x = sx(ci * CW);
        const v = rowVal(row, c);
        let a = match ? 1 : 0.16;
        if (!c.ok) a *= 0.45;
        if (selName && c.name !== selName && !(st.sel.type === "var")) a *= 0.55;
        g.globalAlpha = a;
        g.fillStyle = cellCol(isAgg ? Math.round(v * 10) / 10 : v);
        const rr = Math.min(4, gap * 2);
        if (rr > 0 && g.roundRect) { g.beginPath(); g.roundRect(x + gap / 2, y + gap / 2, cw - gap, h - gap, rr); g.fill(); } else g.fillRect(x, y, cw, h);
        if (isAgg && h > 10) { g.globalAlpha = a * 0.9; g.strokeStyle = "#05090b"; g.lineWidth = 1; g.strokeRect(x + gap / 2 + 0.5, y + gap / 2 + 0.5, cw - gap - 1, h - gap - 1); }
        if (showVal || (isAgg && cw >= 34 && h >= 15)) {
          const col_ = cellCol(isAgg ? Math.round(v * 10) / 10 : v);
          g.fillStyle = lum(col_) > 0.45 ? "#04110d" : "#efe9da";
          const fs = Math.min(isAgg ? 16 : 14, h * 0.5, cw * 0.3);
          g.font = `${isAgg ? 600 : 500} ${fs}px 'IBM Plex Mono', monospace`;
          g.fillText(v == null ? "—" : isAgg ? nl(v, 1) : v === 100 ? "100" : nl(v, 1), x + cw / 2, y + h / 2 + 0.5);
        }
      }
    }
    g.globalAlpha = 1;
    const outline = (ci, ri, color) => { if (ci < c0 || ci > c1 || ri < r0 || ri > r1) return; g.strokeStyle = color; g.lineWidth = 2; g.strokeRect(sx(ci * CW) + 1, sy(rowY[ri]) + 1, cw - 2, rowH[ri] * s - 2); };
    if (hv && hv.zone === "cell") {
      g.fillStyle = "rgba(239,233,218,.05)";
      g.fillRect(sx(hv.col * CW), TH, cw, H - TH); g.fillRect(LW, sy(rowY[hv.ri]), W - LW, rowH[hv.ri] * s);
      outline(hv.col, hv.ri, "#efe9da");
    }
    if (st.sel && st.sel.type === "cell") { const ci = st.order.indexOf(st.sel.c), ri = rows.findIndex((r) => r.type === "q" && r.v === st.sel.v); if (ri >= 0) outline(ci, ri, COL.gold); }
    if (selName) { const ci = st.order.findIndex((c) => c.name === selName); if (ci >= c0 && ci <= c1) { g.strokeStyle = COL.gold; g.lineWidth = 1.5; g.strokeRect(sx(ci * CW) + 0.5, TH, cw - 1, Math.min(H - TH, sy(totalH) - TH)); } }
    g.restore();
    // kop boven: rang, naam (schuin), eindscore
    g.fillStyle = "#05090b"; g.fillRect(LW, 0, W - LW, TH);
    g.save(); g.beginPath(); g.rect(LW, 0, W - LW, TH); g.clip();
    for (let ci = c0; ci <= c1; ci++) {
      const c = st.order[ci], x = sx(ci * CW), xc = x + cw / 2;
      const on = c.name === selName, hov = hv && (hv.zone === "top" || hv.zone === "cell") && hv.col === ci;
      g.textAlign = "center"; g.textBaseline = "alphabetic";
      g.fillStyle = on ? COL.gold : hov ? COL.paper : c.ok ? COL.muted : COL.coral;
      g.font = `500 ${Math.min(14, Math.max(9, cw * 0.32))}px 'IBM Plex Mono', monospace`;
      g.fillText(c.ok ? String(c.rank) : "✕", xc, 16);
      if (cw >= 9) {
        g.save(); g.translate(xc - 4, TH - (cw >= 40 ? 30 : 12)); g.rotate(-Math.PI / 4.2);
        g.textAlign = "left"; g.fillStyle = on ? COL.gold : hov ? COL.paper : c.ok ? COL.soft : COL.muted;
        g.font = cw >= 26 ? NAME_FONT : `500 ${Math.max(9, cw * 0.58)}px 'IBM Plex Mono', monospace`;
        g.fillText(HEADNAME[c.name] || c.name, 0, 0, (TH - 56) / Math.sin(Math.PI / 4.2)); g.restore();
      }
      if (cw >= 40) { g.textAlign = "center"; g.fillStyle = on ? COL.gold : c.ok ? COL.mint : COL.muted; g.font = "300 19px 'Big Shoulders Display', sans-serif"; g.fillText(fTot(c), xc, TH - 8); }
    }
    g.restore();
    g.strokeStyle = "rgba(239,233,218,.12)"; g.lineWidth = 1; g.beginPath(); g.moveTo(LW, TH - 0.5); g.lineTo(W, TH - 0.5); g.moveTo(LW - 0.5, 0); g.lineTo(LW - 0.5, H); g.stroke();
    // kop links: tiers, categorieën en vragen
    g.fillStyle = "#05090b"; g.fillRect(0, TH, LW, H - TH);
    g.save(); g.beginPath(); g.rect(0, TH, LW, H - TH); g.clip();
    const qFs = Math.min(15, QH * s * 0.6);
    for (let ri = r0; ri <= r1; ri++) {
      const row = rows[ri], y = sy(rowY[ri]), h = rowH[ri] * s;
      g.textBaseline = "middle"; g.textAlign = "left";
      if (row.type === "tier") {
        if (h < 4) continue;
        g.fillStyle = tierCol(row.t) + "22"; g.fillRect(0, y, LW, h);
        g.fillStyle = tierCol(row.t); g.font = `600 ${Math.min(16, Math.max(11, h * 0.42))}px 'IBM Plex Mono', monospace`;
        g.fillText((LW < 200 ? "T" + row.t : "TIER " + row.t + " · " + M.TIERN[row.t]).toUpperCase(), 12, y + h / 2, LW - 80);
        g.textAlign = "right"; g.fillText(nl(M.tierShare[row.t], 0) + "%", LW - 12, y + h / 2);
      } else if (row.type === "cat") {
        if (h < 4) continue;
        const coll = st.collapsed.has(row.c);
        g.fillStyle = "rgba(239,233,218,.04)"; g.fillRect(0, y, LW, h);
        g.fillStyle = COL.paper; g.font = `600 ${Math.min(14, Math.max(10, h * 0.42))}px 'IBM Plex Mono', monospace`;
        g.fillText((coll ? "▸ " : "▾ ") + (LW < 200 ? short(row.c) : catName(row.c)).toUpperCase(), 14, y + h / 2, LW - 74);
        g.textAlign = "right"; g.fillStyle = COL.gold; g.fillText(nl(M.catShare[row.c], 0) + "%", LW - 12, y + h / 2);
      } else if (qFs >= 7) {
        const sel = selVar === row.v.i, hov = hv && (hv.zone === "left" || hv.zone === "cell") && hv.ri === ri;
        const match = qMatch(row.v.naam) || qMatch(catName(row.c));
        g.globalAlpha = match ? 1 : 0.3;
        g.font = `${sel ? 600 : 400} ${qFs}px 'IBM Plex Mono', monospace`;
        g.fillStyle = sel ? COL.gold : hov ? COL.paper : COL.soft;
        g.fillText(row.v.naam, 16, y + h / 2, LW - 70);
        g.textAlign = "right"; g.fillStyle = COL.muted; g.fillText(nl(row.v.gewicht, 1), LW - 12, y + h / 2);
        g.globalAlpha = 1;
      }
    }
    g.restore();
    g.fillStyle = "#05090b"; g.fillRect(0, 0, LW, TH);
    g.textAlign = "left"; g.textBaseline = "alphabetic";
    g.fillStyle = COL.paper; g.font = "800 22px 'Big Shoulders Display', sans-serif";
    g.fillText(`${CC.length} landen × ${V.length} vragen`.toUpperCase(), 14, 30);
    g.fillStyle = COL.muted; g.font = "400 13px 'IBM Plex Mono', monospace";
    g.fillText(st.sortBy ? `landen gesorteerd op: ${st.sortBy.label}` : "landen in volgorde van de eindstand", 14, 52, LW - 24);
    g.fillText("gewicht % →", LW - 96, TH - 10);
    g.fillText(st.sortBy ? "klik hier om terug te zetten" : "klik op een vraag om te sorteren", 14, 70, LW - 24);
    drawMiniView();
  }
  const miniBase = document.createElement("canvas");
  function drawMiniBase() {
    miniBase.width = 200; miniBase.height = 140;
    const m = miniBase.getContext("2d");
    m.fillStyle = "#05090b"; m.fillRect(0, 0, 200, 140);
    const sc = Math.min(188 / totalW, 128 / totalH), ox = (200 - totalW * sc) / 2, oy = (140 - totalH * sc) / 2;
    rows.forEach((row, ri) => st.order.forEach((c, ci) => {
      const v = rowVal(row, c);
      m.fillStyle = cellCol(row.type !== "q" ? Math.round(v * 10) / 10 : v);
      m.fillRect(ox + ci * CW * sc, oy + rowY[ri] * sc, Math.max(1, CW * sc), Math.max(1, rowH[ri] * sc));
    }));
    miniBase._t = { sc, ox, oy };
  }
  function drawMiniView() {
    mg.drawImage(miniBase, 0, 0);
    const { sc, ox, oy } = miniBase._t;
    mg.strokeStyle = COL.gold; mg.lineWidth = 1.5;
    mg.strokeRect(ox + st.ox * sc, oy + st.oy * sc, viewW() * sc, viewH() * sc);
  }
  function miniGo(e) {
    const r = mini.getBoundingClientRect(), { sc, ox, oy } = miniBase._t;
    st.ox = ((e.clientX - r.left) * (200 / r.width) - ox) / sc - viewW() / 2;
    st.oy = ((e.clientY - r.top) * (140 / r.height) - oy) / sc - viewH() / 2;
    clampView(); dirty = true;
  }
  let miniDrag = false;
  mini.addEventListener("pointerdown", (e) => { miniDrag = true; mini.setPointerCapture(e.pointerId); miniGo(e); });
  mini.addEventListener("pointermove", (e) => miniDrag && miniGo(e));
  mini.addEventListener("pointerup", () => (miniDrag = false));

  /* tooltip */
  function tooltip(h, mx, my) {
    if (!h || (h.zone !== "cell" && h.zone !== "top" && h.zone !== "left")) { tipEl.style.opacity = 0; return; }
    let html = "";
    if (h.zone === "cell") {
      const c = st.order[h.col], row = rows[h.ri];
      if (row.type === "tier") {
        html = `<div class="v" style="color:${COL.mint}">${fTier(c, row.t)}</div><div class="k">${escapeHtml(c.name)} · tier ${row.t}: ${escapeHtml(M.TIERN[row.t])}</div>` +
          `<div class="r"><span>plaats in deze tier</span><span>${c.ok ? c.tierRank[row.t] + "e van " + ELIG.length : "—"}</span></div><div class="r"><span>telt mee voor</span><span>${nl(M.tierShare[row.t], 0)} %</span></div>`;
      } else if (row.type === "cat") {
        html = `<div class="v" style="color:${COL.mint}">${fCat(c, row.c)}</div><div class="k">${escapeHtml(c.name)} · ${escapeHtml(catName(row.c))}</div>` +
          `<div class="r"><span>plaats in deze categorie</span><span>${c.ok ? c.catRank[row.c] + "e van " + ELIG.length : "—"}</span></div>` +
          `<div class="r"><span>telt mee voor</span><span>${nl(M.catShare[row.c], 1)} % van de eindscore</span></div>` +
          `<div class="r"><span>vragen</span><span>${M.catN[row.c]}</span></div>`;
      } else {
        const v = row.v, sc = c.scores[v.i], f = c.feiten[v.id];
        html = `<div class="v" style="color:${sc === 100 ? COL.gold : COL.mint}">${sc == null ? "—" : sc === 100 ? "100" : nl(sc, 1)}</div><div class="k">${escapeHtml(c.name)}</div>` +
          `<div style="margin:6px 0 8px;color:${COL.paper}">${escapeHtml(v.naam)}</div>` +
          `<div class="r"><span>gemeten</span><span>${fraw(f, v)}</span></div>` +
          `<div class="r"><span>bron</span><span style="max-width:200px;overflow:hidden;text-overflow:ellipsis">${f && f.bron ? escapeHtml(f.bron.naam || "") : "—"}</span></div>` +
          `<div class="r"><span>plaats op deze vraag</span><span>${c.ok ? M.varRank[v.i][c.name] + "e van " + ELIG.length : "—"}</span></div>` +
          `<div class="k" style="margin-top:8px">klik voor de meter en de rondes</div>`;
      }
    } else if (h.zone === "top") {
      const c = st.order[h.col];
      html = `<div class="v" style="color:${c.ok ? COL.mint : COL.coral}">${fTot(c)}</div><div class="k">${c.ok ? c.rank + ". " : "✕ "}${escapeHtml(c.name)}</div>` +
        (c.knockout ? `<div style="margin-top:6px;color:${COL.coral}">${escapeHtml(c.knockout)}</div>` : "") +
        `<div class="r" style="margin-top:6px"><span>rang in de ${NR} rondes</span><span>${c.rondes.rankMin ?? "—"}–${c.rondes.rankMax ?? "—"}</span></div><div class="k" style="margin-top:8px">klik voor het profiel</div>`;
    } else {
      const row = rows[h.ri];
      if (row.type === "tier") html = `<div class="k">tier ${row.t} · ${escapeHtml(M.TIERN[row.t])}</div><div class="r"><span>aandeel in eindscore</span><span>${nl(M.tierShare[row.t], 0)} %</span></div>`;
      else if (row.type === "cat") html = `<div class="k">${escapeHtml(catName(row.c))}</div><div class="r"><span>aandeel in eindscore</span><span>${nl(M.catShare[row.c], 1)} %</span></div><div class="r"><span>vragen</span><span>${M.catN[row.c]}</span></div><div class="k" style="margin-top:8px">klik om ${st.collapsed.has(row.c) ? "open" : "dicht"} te klappen</div>`;
      else html = `<div class="k">${escapeHtml(short(row.v.categorie))} · gewicht ${nl(row.v.gewicht, 1)} %</div><div style="margin:6px 0;color:${COL.paper}">${escapeHtml(row.v.vraag || row.v.naam)}</div><div class="r"><span>zekerheid</span><span>${escapeHtml(row.v.zekerheid || "")}</span></div><div class="k" style="margin-top:8px">klik om de landen hierop te sorteren</div>`;
    }
    tipEl.innerHTML = html;
    const tw = tipEl.offsetWidth, th = tipEl.offsetHeight;
    let x = mx + 18, y = my + 18;
    if (x + tw > W - 8) x = mx - tw - 18;
    if (y + th > H - 8) y = my - th - 18;
    tipEl.style.transform = `translate(${Math.max(8, x)}px,${Math.max(8, y)}px)`;
    tipEl.style.opacity = 1;
  }

  /* zijpaneel */
  const bar = (name, val, max, txtVal, rank, color, sel) =>
    `<div class="vk-bar${sel ? " sel" : ""}"><span class="nm">${escapeHtml(name)}</span><span class="val">${txtVal}</span><span class="rk">${rank || ""}</span><span class="track"><i style="width:${clamp(val / max) * 100}%;background:${color}"></i></span></div>`;
  const rondesHtml = (f, v) => {
    if (!f || !f.rondes || !f.rondes.length) return "";
    const vals = f.rondes.map((x) => (x == null ? null : Number(x)));
    const nums = vals.filter((x) => x != null);
    if (!nums.length) return "";
    const lo = Math.min(...nums, Number(f.waarde)), hi = Math.max(...nums, Number(f.waarde)), span = hi - lo || 1;
    return `<div class="vk-rondes">${vals.map((x, i) => x == null ? `<i class="leeg" title="ronde ${i + 1}: geen waarde"></i>` : `<i title="ronde ${i + 1}: ${nl(x, 2)}" style="height:${8 + ((x - lo) / span) * 38}px${Math.abs(x - Number(f.waarde)) < 1e-9 ? ";background:var(--gold)" : ""}"></i>`).join("")}</div>` +
      `<div class="meta">${escapeHtml(f.methode || "")} · spreiding ${f.spreiding == null ? "—" : nl(f.spreiding, 2)} ${escapeHtml(f.eenheid || v.meter.eenheid || "")}</div>`;
  };
  const meterHtml = (v) => {
    const m = v.meter || {}, s = m.schaal || {};
    let sc = "";
    if (s.type === "ankers") sc = s.punten.map((p) => `${nl(p[0], p[0] % 1 ? 1 : 0)} → ${nl(p[1], 0)}`).join(" · ");
    else if (s.type === "rubriek") sc = (s.niveaus || []).map((n) => `<b>${n.score}</b> ${escapeHtml(n.criterium || "")}`).join("<br>");
    else if (s.type === "log") sc = `logschaal: ${s.van} → 0, ${s.tot} → 100`;
    return `<p><b style="color:var(--paper)">Meter.</b> ${escapeHtml(m.wat || "")}${m.eenheid ? ` <span class="vk-muted">(${escapeHtml(m.eenheid)}, ${escapeHtml(m.richting || "")})</span>` : ""}</p>` +
      (sc ? `<p class="vk-muted" style="font-size:13px"><b style="color:var(--soft)">Schaal naar 0–100:</b> ${sc}</p>` : "") +
      (m.bronnen && m.bronnen.length ? `<p class="src"><b style="color:var(--paper)">Voorziene bronnen.</b> ${m.bronnen.map((b) => srcHtml(b)).join(" · ")}</p>` : "");
  };
  function panel() {
    const s_ = st.sel;
    let h = "";
    if (!s_) {
      h = `<div class="kk" style="margin-top:0">Alle data achter de film</div>
        <h3>${nl(M.nScores, 0)}<br>scores</h3>
        <p>${CC.length} landen × ${V.length} vragen, in ${CATS.length} categorieën en ${TIERS.length} tiers. Elke cel is één score van 0 tot 100: donker = lager, licht = hoger, <span style="color:${COL.gold}">goud = 100</span>.
        De volle rijen tonen de score per categorie en per tier.</p>
        <p>Bovenaan staan de landen in volgorde van de eindstand, met hun eindscore. ✕ = valt af door het reisadvies.</p>
        <div class="kk">Zo werkt het</div>
        <p>Slepen = bewegen · scrollen of knijpen = zoomen · dubbelklik = inzoomen.<br>Klik op een <b>cel</b> voor de gemeten waarde, de bron en de ${NR} rondes. Klik op een <b>land</b> voor zijn profiel, op een <b>vraag</b> om de landen erop te sorteren, op een <b>categorie</b> om ze open of dicht te klappen.<br>
        Toetsen: <kbd>←↑→↓</kbd> bewegen · <kbd>+</kbd> <kbd>−</kbd> zoomen · <kbd>0</kbd> alles tonen · <kbd>Esc</kbd> terug naar de film.</p>
        <div class="kk">Eerlijk</div>
        <p class="vk-muted">Elke score komt uit een meter met een vaste schaal. De waarde per cel is die van ${NR} onafhankelijke onderzoeksrondes die het vaakst voorkomt (anders de mediaan). Zie het tabblad "Bronnen en meters".</p>`;
    } else if (s_.type === "country" || s_.type === "cell") {
      const c = s_.c;
      const sorted = V.map((v) => ({ v, s: c.scores[v.i] })).filter((x) => x.s != null);
      const top = [...sorted].sort((a, b) => b.s - a.s).slice(0, 6), low = [...sorted].sort((a, b) => a.s - b.s).slice(0, 6);
      const zTel = { hoog: 0, midden: 0, laag: 0 }; V.forEach((v) => { const f = c.feiten[v.id]; if (f && f.zekerheid) zTel[f.zekerheid] = (zTel[f.zekerheid] || 0) + 1; });
      h = `<div class="kk" style="margin-top:0">${c.ok ? `Plaats ${c.rank} van ${ELIG.length}` : "Buiten de race"}</div><h3>${escapeHtml(c.name)}</h3>
        <div class="big" style="${c.ok ? "" : "color:var(--coral)"}">${fTot2(c)}</div>
        ${c.knockout ? `<div class="it" style="color:var(--coral)">${escapeHtml(c.knockout)}</div>` : ""}
        <div class="meta">${escapeHtml(c.region || "")} · rang in de ${NR} rondes: ${c.rondes.rankMin ?? "—"}–${c.rondes.rankMax ?? "—"} · ${c.rondes.wins} keer gewonnen<br>zekerheid: ${zTel.hoog} hoog · ${zTel.midden} midden · ${zTel.laag} laag</div>`;
      if (s_.type === "cell") {
        const v = s_.v, sc = c.scores[v.i], f = c.feiten[v.id];
        const all = [...ELIG].sort((a, b) => (b.scores[v.i] ?? -1) - (a.scores[v.i] ?? -1));
        h += `<div class="kk">${escapeHtml(short(v.categorie))} · gewicht ${nl(v.gewicht, 1)} %</div><p style="color:var(--paper);margin:0 0 8px;font-size:17px">${escapeHtml(v.vraag || v.naam)}</p>
          <div class="raw">${fraw(f, v)}</div>
          <div class="meta" style="margin-top:6px">score <b style="color:${sc === 100 ? "var(--gold)" : "var(--mint)"}">${sc == null ? "—" : nl(sc, 1)}</b> · ${c.ok ? M.varRank[v.i][c.name] + "e van " + ELIG.length : "buiten de race"} · ${f ? zk(f.zekerheid) : ""}</div>
          <p class="src" style="margin-top:10px"><b style="color:var(--paper)">Bron.</b> ${srcHtml(f && f.bron)}${f && f.opmerking ? `<br><span class="vk-muted">${escapeHtml(f.opmerking)}</span>` : ""}</p>
          <div class="kk">De ${NR} rondes (goud = de gekozen waarde)</div>${rondesHtml(f, v) || `<p class="vk-muted">geen rondewaarden</p>`}
          <div class="kk">De meter</div>${meterHtml(v)}
          <div class="kk">Alle landen op deze vraag</div>
          <div class="vk-bars">${all.map((x) => bar(x.name, x.scores[v.i] ?? 0, 100, x.scores[v.i] == null ? "—" : x.scores[v.i] === 100 ? "100" : nl(x.scores[v.i], 1), M.varRank[v.i][x.name], x === c ? COL.gold : scoreCol(x.scores[v.i] ?? 0), x === c)).join("")}</div>`;
      }
      h += `<div class="kk">Per tier</div><div class="vk-bars">` + tiersAsc.map((t) => bar(`Tier ${t} · ${M.TIERN[t]}`, c.tierExact[t], 100, fTier(c, t), c.ok ? c.tierRank[t] + "e" : "", tierCol(t), false)).join("") + `</div>
        <div class="kk">Per categorie · plaats op ${ELIG.length}</div><div class="vk-bars">` +
        catOrder.map((k) => bar(catName(k), c.catExact[k], 100, fCat(c, k), c.ok ? c.catRank[k] + "e" : "", scoreCol(c.catExact[k]), false)).join("") + `</div>
        <div class="kk">Sterkste vragen</div><ul class="vk-list">${top.map((x) => `<li><span>${escapeHtml(x.v.naam)}</span><span>${x.s === 100 ? "100" : nl(x.s, 1)}</span></li>`).join("")}</ul>
        <div class="kk">Zwakste vragen</div><ul class="vk-list">${low.map((x) => `<li><span>${escapeHtml(x.v.naam)}</span><span style="color:${COL.coral}">${nl(x.s, 1)}</span></li>`).join("")}</ul>
        <button class="vk-link" data-act="clear">← terug naar het overzicht</button>`;
    } else if (s_.type === "var") {
      const v = s_.v, all = [...ELIG].sort((a, b) => (b.scores[v.i] ?? -1) - (a.scores[v.i] ?? -1));
      h = `<div class="kk" style="margin-top:0">${escapeHtml(catName(v.categorie))} · tier ${v.tier}</div><h3 style="font-size:30px">${escapeHtml(v.naam)}</h3>
        <p style="color:var(--paper);margin:8px 0 0;font-size:17px">${escapeHtml(v.vraag || "")}</p>
        <div class="meta">gewicht ${nl(v.gewicht, 1)} % van de eindscore · zekerheid ${zk(v.zekerheid)}${v.spreiding_mediaan != null ? ` · mediane spreiding tussen de rondes ${nl(v.spreiding_mediaan, 2)}` : ""}</div>
        <div class="kk">De meter</div>${meterHtml(v)}
        <div class="kk">Alle landen op deze vraag</div><div class="vk-bars">${all.map((x) => bar(x.name, x.scores[v.i] ?? 0, 100, x.scores[v.i] == null ? "—" : x.scores[v.i] === 100 ? "100" : nl(x.scores[v.i], 1), M.varRank[v.i][x.name], scoreCol(x.scores[v.i] ?? 0), false)).join("")}</div>
        <button class="vk-link" data-act="clear">← terug naar het overzicht</button>`;
    }
    side.innerHTML = h;
    side.scrollTop = 0;
  }
  side.addEventListener("click", (e) => { const a = e.target.closest("[data-act]"); if (a && a.dataset.act === "clear") { st.sel = null; panel(); dirty = true; } });

  function sortBy(row) {
    const key = !row ? null : row.type === "tier" ? "t:" + row.t : row.type === "cat" ? "c:" + row.c : "v:" + row.v.i;
    if (!row || (st.sortBy && st.sortBy.key === key)) { st.sortBy = null; st.order = CC.slice(); }
    else if (row.type === "tier") { st.sortBy = { key, label: "tier " + row.t }; st.order = [...CC].sort((a, b) => (a.ok ? 0 : 1) - (b.ok ? 0 : 1) || b.tierExact[row.t] - a.tierExact[row.t]); }
    else if (row.type === "cat") { st.sortBy = { key, label: catName(row.c) }; st.order = [...CC].sort((a, b) => (a.ok ? 0 : 1) - (b.ok ? 0 : 1) || b.catExact[row.c] - a.catExact[row.c]); }
    else { st.sortBy = { key, label: row.v.naam }; st.order = [...CC].sort((a, b) => (a.ok ? 0 : 1) - (b.ok ? 0 : 1) || (b.scores[row.v.i] ?? -1) - (a.scores[row.v.i] ?? -1) || a.rank - b.rank); }
    drawMiniBase(); dirty = true;
  }

  /* bediening: slepen, zoomen, knijpen, klikken */
  const ptrs = new Map();
  let drag = null, pinch = null, moved = false;
  const local = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  cv.addEventListener("pointerdown", (e) => {
    cv.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, local(e));
    if (ptrs.size === 1) { const [x, y] = local(e); drag = { x, y, ox: st.ox, oy: st.oy }; moved = false; }
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), s: st.s }; drag = null; }
    hint.style.opacity = 0;
  });
  cv.addEventListener("pointermove", (e) => {
    const [x, y] = local(e);
    if (ptrs.has(e.pointerId)) ptrs.set(e.pointerId, [x, y]);
    if (pinch && ptrs.size === 2) {
      const [a, b] = [...ptrs.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      zoomAt((pinch.s * (d / pinch.d)) / st.s, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); moved = true; return;
    }
    if (drag) {
      if (Math.abs(x - drag.x) + Math.abs(y - drag.y) > 4) { moved = true; cv.classList.add("drag"); }
      if (moved) { st.ox = drag.ox - (x - drag.x) / st.s; st.oy = drag.oy - (y - drag.y) / st.s; clampView(); dirty = true; tipEl.style.opacity = 0; return; }
    }
    const h = hit(x, y);
    const key = h ? `${h.zone}:${h.col}:${h.ri}` : "";
    if (key !== (st.hover && st.hover.key)) { st.hover = h ? { ...h, key } : null; dirty = true; }
    tooltip(h, x, y);
    cv.style.cursor = h && h.zone !== "cell" ? "pointer" : "";
  });
  const up = (e) => {
    ptrs.delete(e.pointerId);
    if (ptrs.size < 2) pinch = null;
    cv.classList.remove("drag");
    if (drag && !moved && e.type === "pointerup") click(...local(e));
    if (!ptrs.size) drag = null;
  };
  cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
  cv.addEventListener("pointerleave", () => { st.hover = null; tipEl.style.opacity = 0; dirty = true; });
  function click(x, y) {
    const h = hit(x, y);
    if (!h) return;
    if (h.zone === "corner") { sortBy(null); return; }
    if (h.zone === "top") { const c = st.order[h.col]; st.sel = st.sel && st.sel.type === "country" && st.sel.c === c ? null : { type: "country", c }; }
    else if (h.zone === "left") {
      const row = rows[h.ri];
      if (row.type === "cat") { st.collapsed.has(row.c) ? st.collapsed.delete(row.c) : st.collapsed.add(row.c); layout(); clampView(); }
      else if (row.type === "tier") sortBy(row);
      else { sortBy(row); st.sel = st.sortBy ? { type: "var", v: row.v } : null; }
    } else {
      const c = st.order[h.col], row = rows[h.ri];
      st.sel = row.type !== "q" ? { type: "country", c } : { type: "cell", c, v: row.v };
    }
    panel(); dirty = true;
  }
  cv.addEventListener("dblclick", (e) => { const [x, y] = local(e); zoomAnim(2, x, y); });
  cv.addEventListener("wheel", (e) => {
    e.preventDefault();
    const [x, y] = local(e);
    const mouseWheel = e.deltaMode === 1 || (Math.abs(e.deltaY) >= 50 && e.deltaX === 0 && Number.isInteger(e.deltaY));
    if (e.ctrlKey || e.metaKey || mouseWheel) zoomAt(Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : e.ctrlKey ? 0.012 : 0.0018)), x, y);
    else { st.ox += e.deltaX / st.s; st.oy += e.deltaY / st.s; clampView(); dirty = true; }
    hint.style.opacity = 0;
  }, { passive: false });
  cv.addEventListener("keydown", (e) => {
    const step = 80 / st.s;
    if (e.key === "ArrowLeft") st.ox -= step; else if (e.key === "ArrowRight") st.ox += step;
    else if (e.key === "ArrowUp") st.oy -= step; else if (e.key === "ArrowDown") st.oy += step;
    else if (e.key === "+" || e.key === "=") zoomAnim(1.5); else if (e.key === "-") zoomAnim(1 / 1.5);
    else if (e.key === "0") fitAll(); else return;
    e.preventDefault(); clampView(); dirty = true;
  });
  $v("vkZin").onclick = () => zoomAnim(1.6);
  $v("vkZout").onclick = () => zoomAnim(1 / 1.6);
  $v("vkFit").onclick = () => fitAll();

  /* zoeken */
  $v("vkSearch").addEventListener("input", (e) => {
    st.q = e.target.value.trim().toLowerCase();
    const land = st.q.length > 2 && CC.find((c) => c.name.toLowerCase().startsWith(st.q));
    if (land) { st.sel = { type: "country", c: land }; panel(); const ci = st.order.indexOf(land); st.ox = ci * CW - viewW() / 2 + CW / 2; clampView(); }
    else if (st.q) { const ri = rows.findIndex((r) => r.type === "q" && (r.v.naam.toLowerCase().includes(st.q) || (r.v.vraag || "").toLowerCase().includes(st.q))); if (ri >= 0) { st.oy = rowY[ri] - viewH() * 0.3; clampView(); } }
    if (st.tab !== "matrix") setTab("matrix");
    dirty = true;
  });

  /* ranglijst (tabel) */
  const tbl = $v("vkTable");
  let tSort = { k: "rank", dir: 1 };
  const spark = (c) => {
    const rk = c.rondes.ranks || [];
    if (!rk.length) return "";
    const n = ELIG.length, w = 12, h = 26;
    return `<svg width="${rk.length * w}" height="${h}" viewBox="0 0 ${rk.length * w} ${h}">${rk.map((r, i) => `<rect x="${i * w + 1}" y="${((r - 1) / (n - 1)) * (h - 6)}" width="${w - 2}" height="6" rx="1.5" fill="${r === 1 ? COL.gold : r <= 3 ? COL.mint : r <= 10 ? "#3fb393" : "#2c3d3a"}"><title>ronde ${i + 1}: plaats ${r}</title></rect>`).join("")}</svg>`;
  };
  function table() {
    const cols = [["rank", "#"], ["name", "Land"], ["total", "Eindscore"], ...tiersAsc.map((t) => ["t:" + t, `Tier ${t} <span style="color:${COL.gold}">${nl(M.tierShare[t], 0)}%</span>`]),
      ...catOrder.map((c) => ["c:" + c, short(c) + ` <span style="color:${COL.gold}">${nl(M.catShare[c], 0)}%</span>`]), ["rounds", `Plaats per ronde (${NR})`], ["wins", "Gewonnen"], ["range", "Min–max"]];
    const val = (c, k) => (k === "rank" ? (c.ok ? c.rank : 999) : k === "name" ? c.name : k === "total" ? c.totalExact : k === "wins" ? c.rondes.wins : k === "range" ? (c.rondes.rankMax ?? 999) : k === "rounds" ? (c.rondes.rankMediaan ?? 999) : k.startsWith("t:") ? c.tierExact[Number(k.slice(2))] : c.catExact[k.slice(2)]);
    const list = [...CC].sort((a, b) => { const x = val(a, tSort.k), y = val(b, tSort.k); return (typeof x === "string" ? x.localeCompare(y, "nl") : x - y) * tSort.dir; });
    tbl.innerHTML = `<thead><tr>${cols.map(([k, l]) => `<th data-k="${k}" class="${tSort.k === k ? "on" : ""}${k.startsWith("c:") ? " t" + tierOf(k.slice(2)) : k.startsWith("t:") ? " t" + k.slice(2) : ""}">${l}${tSort.k === k ? (tSort.dir > 0 ? " ↑" : " ↓") : ""}</th>`).join("")}</tr></thead><tbody>` +
      list.map((c) => `<tr data-n="${escapeHtml(c.name)}" class="${c.ok ? "" : "ko"}"><td class="vk-muted">${c.ok ? c.rank : "✕"}</td><td class="nm" style="color:${c.rank === 1 ? COL.gold : c.ok ? COL.paper : COL.coral}">${escapeHtml(c.name)}</td><td class="tot">${fTot2(c)}</td>` +
        tiersAsc.map((t) => { const v = Math.round(c.tierExact[t] * 10) / 10, bg = scoreCol(v); return `<td class="c" style="background:${bg};color:${lum(bg) > 0.45 ? "#04110d" : "#efe9da"}" title="${escapeHtml(c.name)} · tier ${t}: ${fTier(c, t)}">${fTier(c, t)}</td>`; }).join("") +
        catOrder.map((k) => { const v = Math.round(c.catExact[k] * 10) / 10, bg = scoreCol(v); return `<td class="c" style="background:${bg};color:${lum(bg) > 0.45 ? "#04110d" : "#efe9da"}" title="${escapeHtml(c.name)} · ${escapeHtml(catName(k))}: ${fCat(c, k)}${c.ok ? ` (${c.catRank[k]}e)` : ""}">${fCat(c, k)}</td>`; }).join("") +
        `<td class="sp">${spark(c)}</td><td>${c.rondes.wins || 0}</td><td class="vk-muted">${c.rondes.rankMin ?? "—"}–${c.rondes.rankMax ?? "—"}</td></tr>`).join("") + `</tbody>`;
  }
  tbl.addEventListener("click", (e) => {
    const th = e.target.closest("th");
    if (th) { const k = th.dataset.k; tSort = { k, dir: tSort.k === k ? -tSort.dir : k === "rank" || k === "name" || k === "range" || k === "rounds" ? 1 : -1 }; table(); return; }
    const tr = e.target.closest("tr[data-n]");
    if (tr) { st.sel = { type: "country", c: M.by[tr.dataset.n] }; setTab("matrix"); panel(); const ci = st.order.indexOf(st.sel.c); st.ox = ci * CW - viewW() / 2; clampView(); dirty = true; }
  });
  $v("vkRankIntro").innerHTML = `<b>${escapeHtml(WIN.name)}</b> staat bovenaan met ${fTot2(WIN)}; nummer 2 is ${escapeHtml(ELIG[1].name)} (${fTot2(ELIG[1])}). ` +
    `De kolom "plaats per ronde" toont waar elk land in elk van de ${NR} onderzoeksrondes stond (<span style="color:${COL.gold}">goud</span> = eerste). ` +
    `Modale winnaar: <b>${escapeHtml(DATA.consensus.modaleWinnaar || "")}</b> (${DATA.consensus.keerGewonnen} van ${NR} rondes). Klik op een land voor zijn profiel; klik op een kolomkop om te sorteren.`;

  /* gewichten: per tier en per categorie */
  const mult = {};
  tiersAsc.forEach((t) => (mult["t" + t] = 1)); catOrder.forEach((c) => (mult[c] = 1));
  const slWrap = $v("vkSliders"), live = $v("vkLive");
  const sl = [];
  tiersAsc.forEach((t) => {
    const r = el("div", { class: "vk-sl tier" }, slWrap);
    el("span", { class: "nm" }, r, `Tier ${t} · ${escapeHtml(M.TIERN[t])}`);
    const inp = el("input", { type: "range", min: 0, max: 300, step: 5, value: 100, "aria-label": `Gewicht tier ${t}` }, r);
    const pc = el("span", { class: "pc" }, r);
    inp.addEventListener("input", () => { mult["t" + t] = inp.value / 100; weights(); });
    sl.push({ key: "t" + t, inp, pc, base: M.tierShare[t] });
    catOrder.filter((c) => tierOf(c) === t).forEach((c) => {
      const rr = el("div", { class: "vk-sl" }, slWrap);
      el("span", { class: "nm" }, rr, escapeHtml(catName(c)));
      const ii = el("input", { type: "range", min: 0, max: 300, step: 5, value: 100, "aria-label": `Gewicht ${catName(c)}` }, rr);
      const pp = el("span", { class: "pc" }, rr);
      ii.addEventListener("input", () => { mult[c] = ii.value / 100; weights(); });
      sl.push({ key: c, inp: ii, pc: pp, base: M.catShare[c] });
    });
  });
  const liveRows = {};
  CC.forEach((c) => { liveRows[c.name] = el("li", { class: (c.rank === 1 ? "w" : "") + (c.ok ? "" : " ko") }, live, `<span class="r"></span><span class="n">${escapeHtml(c.name)}</span><span class="s"></span><span class="d"></span>`); });
  function weights() {
    const m2 = berekenModel(DATA, mult);
    const tot = Object.values(m2.catWnow).reduce((a, b) => a + b, 0);
    sl.forEach((s) => {
      const now = s.key.startsWith("t") && !CATS.includes(s.key) ? m2.V.filter((v) => "t" + v.tier === s.key).reduce((a, v) => a + m2.catWnow[v.categorie] / m2.catN[v.categorie], 0) : m2.catWnow[s.key];
      const eff = s.key.startsWith("t") && !CATS.includes(s.key) ? CATS.filter((c) => "t" + tierOf(c) === s.key).reduce((a, c) => a + m2.catWnow[c], 0) : m2.catWnow[s.key];
      s.pc.innerHTML = `${s.inp.value}%<small>= ${nl((eff / (tot || 1)) * 100, 1)}%</small>`;
    });
    m2.C.forEach((c, i) => {
      const li = liveRows[c.name], d = M.by[c.name].rank - (i + 1);
      li.style.transform = `translateY(${(i - (M.by[c.name].rank - 1)) * 30}px)`;
      li.querySelector(".r").textContent = c.ok ? i + 1 : "✕";
      li.querySelector(".s").textContent = tot ? nl(c.totalExact, 2) : "—";
      const dd = li.querySelector(".d");
      dd.textContent = !c.ok ? "" : d > 0 ? `▲ ${d}` : d < 0 ? `▼ ${-d}` : "·";
      dd.style.color = d > 0 ? COL.mint : d < 0 ? COL.coral : COL.muted;
      li.querySelector(".n").style.color = i === 0 ? COL.gold : "";
    });
  }
  CC.forEach((c) => live.appendChild(liveRows[c.name]));
  $v("vkReset").onclick = () => { sl.forEach((s) => { s.inp.value = 100; mult[s.key] = 1; }); weights(); };

  /* de rondes */
  function rounds() {
    const RO = DATA.rondeOverzicht || [];
    const n = ELIG.length;
    const rkCol = (r) => (r === 1 ? COL.gold : scoreCol(100 - ((r - 1) / (n - 1)) * 100, 0, 100));
    let h = `<div class="vk-rounds"><h2>${NR} onafhankelijke onderzoeksrondes</h2>
      <p>Elke ronde verzamelden Haiku-agents per pakket vragen opnieuw de cijfers en bronnen voor alle ${CC.length} landen, waarna een Sonnet-agent de feiten controleerde en de scores berekende. Vanaf ronde 2 kregen de vragen licht andere gewichten (×0,8 tot ×1,2, met de tier-aandelen ongewijzigd), zodat de uitkomst niet aan één gewichtskeuze hangt.
      Per land en vraag telt daarna de waarde die het vaakst voorkomt, anders de mediaan. <b style="color:var(--paper)">${escapeHtml(DATA.consensus.modaleWinnaar || "")}</b> won ${DATA.consensus.keerGewonnen} van de ${NR} rondes; op de consensusfeiten staat <b style="color:var(--paper)">${escapeHtml(WIN.name)}</b> bovenaan.</p>
      <table class="vk-rt"><thead><tr><th>Ronde</th><th>Gewichten</th><th>Winnaar</th><th>Top 5</th><th>Ontbrekende waarden</th></tr></thead><tbody>` +
      RO.map((r) => `<tr><td>${r.ronde}</td><td class="vk-muted">${escapeHtml(r.variant || "")}</td><td class="win">${escapeHtml(r.winnaar || "")}</td><td>${(r.top5 || []).map(escapeHtml).join(", ")}</td><td class="vk-muted">${r.ontbrekend ?? "—"}</td></tr>`).join("") +
      `</tbody></table>
      <h2>Plaats van elk land in elke ronde</h2>
      <table class="vk-rt"><thead><tr><th>#</th><th>Land</th><th>Eindscore</th>${RO.map((r) => `<th>r${r.ronde}</th>`).join("")}<th>Mediaan</th><th>Min–max</th></tr></thead><tbody>` +
      CC.map((c) => `<tr class="${c.ok ? "" : "ko"}"><td class="vk-muted">${c.ok ? c.rank : "✕"}</td><td style="color:${c.rank === 1 ? COL.gold : c.ok ? COL.paper : COL.coral}">${escapeHtml(c.name)}</td><td>${fTot2(c)}</td>` +
        (c.rondes.ranks || []).map((r) => `<td class="rk" style="background:${c.ok ? rkCol(r) : "#2a2a2a"};color:${lum(c.ok ? rkCol(r) : "#2a2a2a") > 0.45 ? "#04110d" : "#efe9da"}">${r}</td>`).join("") +
        `<td>${c.rondes.rankMediaan ?? "—"}</td><td class="vk-muted">${c.rondes.rankMin ?? "—"}–${c.rondes.rankMax ?? "—"}</td></tr>`).join("") + `</tbody></table></div>`;
    $v("vkRounds").innerHTML = h;
  }

  /* bronnen en meters */
  function sources() {
    const usedBy = {};
    V.forEach((v) => { const u = {}; CC.forEach((c) => { const f = c.feiten[v.id]; if (f && f.bron && (f.bron.naam || f.bron.url)) { const k = f.bron.url || f.bron.naam; u[k] = u[k] || { ...f.bron, n: 0 }; u[k].n++; } }); usedBy[v.id] = Object.values(u).sort((a, b) => b.n - a.n); });
    const zt = { hoog: 0, midden: 0, laag: 0 }; V.forEach((v) => (zt[v.zekerheid] = (zt[v.zekerheid] || 0) + 1));
    let h = `<div class="vk-sources"><h2>${V.length} meters, ${(DATA.bronTelling || []).length} bronnen</h2>
      <p>Elke vraag heeft een meter: wat precies gemeten wordt, in welke eenheid, uit welke bron, en hoe de ruwe waarde naar een score van 0 tot 100 gaat (vaste ankers, dus onafhankelijk van wie meedoet). Zekerheid per vraag: ${zt.hoog} hoog · ${zt.midden} midden · ${zt.laag} laag.
      Hieronder per vraag de meter en de bronnen die in de consensus gebruikt zijn (met het aantal landen).</p>
      <h2>Meest gebruikte bronnen</h2><p>${(DATA.bronTelling || []).slice(0, 30).map((b) => `${escapeHtml(b.naam)} <span class="vk-muted">(${b.n})</span>`).join(" · ")}</p>
      <div class="vk-srcgrid">` +
      [...V].sort((a, b) => a.tier - b.tier || b.gewicht - a.gewicht).map((v) => `<div class="vk-card"><span class="tag" style="background:${tierCol(v.tier)}22;color:${tierCol(v.tier)}">tier ${v.tier} · ${escapeHtml(short(v.categorie))} · ${nl(v.gewicht, 1)} %</span>${zk(v.zekerheid)}<h4 style="margin-top:8px">${escapeHtml(v.vraag || v.naam)}</h4>
        <div class="what">${escapeHtml(v.meter.wat || "")}${v.meter.eenheid ? ` <span class="vk-muted">(${escapeHtml(v.meter.eenheid)}, ${escapeHtml(v.meter.richting || "")})</span>` : ""}</div>
        <div class="links"><b>Gebruikt:</b> ${usedBy[v.id].length ? usedBy[v.id].slice(0, 6).map((b) => `${srcHtml(b)} <span>(${b.n})</span>`).join(" · ") : "—"}</div>
        ${v.meter.bronnen && v.meter.bronnen.length ? `<div class="links"><b>Voorzien:</b> ${v.meter.bronnen.map((b) => srcHtml(b)).join(" · ")}</div>` : ""}
        ${v.meter.ontbrekend ? `<div class="links"><b>Bij ontbreken:</b> ${escapeHtml(v.meter.ontbrekend)}</div>` : ""}</div>`).join("") + `</div></div>`;
    $v("vkSources").innerHTML = h;
  }

  /* CSV (puntkomma en komma, zoals Excel in België verwacht) */
  $v("vkCsv").onclick = () => {
    const q = (s) => `"${String(s == null ? "" : s).replace(/"/g, '""')}"`, n = (x, d) => (x == null ? "" : nl(x, d).replace(/\./g, ""));
    const lines = [["id", "tier", "categorie", "vraag", "gewicht", "zekerheid", "meter", "eenheid", ...CC.map((c) => `${c.ok ? c.rank + ". " : "✕ "}${c.name} score`), ...CC.map((c) => `${c.name} gemeten`), ...CC.map((c) => `${c.name} bron`)].map(q).join(";")];
    V.forEach((v) => lines.push([v.id, v.tier, q(catName(v.categorie)), q(v.vraag || v.naam), n(v.gewicht, 2), q(v.zekerheid), q(v.meter.wat), q(v.meter.eenheid), ...CC.map((c) => n(c.scores[v.i], 1)), ...CC.map((c) => (c.feiten[v.id] && c.feiten[v.id].waarde != null ? n(Number(c.feiten[v.id].waarde), 3) : "")), ...CC.map((c) => q(c.feiten[v.id] && c.feiten[v.id].bron ? (c.feiten[v.id].bron.naam || "") + " " + (c.feiten[v.id].bron.url || "") : ""))].join(";")));
    lines.push("");
    catOrder.forEach((k) => lines.push(["", tierOf(k), q(catName(k)), q("categoriescore (gewogen)"), n(M.catW[k], 2), "", "", "", ...CC.map((c) => n(c.catExact[k], 1))].join(";")));
    tiersAsc.forEach((t) => lines.push(["", t, q("tier " + t), q(M.TIERN[t]), n(M.tierW[t], 2), "", "", "", ...CC.map((c) => n(c.tierExact[t], 1))].join(";")));
    lines.push(["", "", "", q("EINDSCORE (gewogen gemiddelde)"), n(M.totW, 2), "", "", "", ...CC.map((c) => n(c.totalExact, 2))].join(";"));
    lines.push(["", "", "", q("plaats per ronde"), "", "", "", "", ...CC.map((c) => q((c.rondes.ranks || []).join(" ")))].join(";"));
    const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = el("a", { href: URL.createObjectURL(blob), download: `scout-atlas-${YEAR}-data.csv` }, document.body);
    a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  };

  /* tabs */
  let built = { rank: false, rounds: false, sources: false }, fitted = false;
  function setTab(k) {
    st.tab = k;
    root.querySelectorAll(".vk-tabs button").forEach((b) => b.classList.toggle("on", b.dataset.tab === k));
    root.querySelectorAll(".vk-pane").forEach((p) => p.classList.toggle("on", p.dataset.pane === k));
    if (k === "matrix") { resize(); if (!fitted && W > 300) { layout(); fitWidth(); fitted = true; } clampView(); dirty = true; }
    if (k === "rank" && !built.rank) { table(); built.rank = true; }
    if (k === "weights") weights();
    if (k === "rounds" && !built.rounds) { rounds(); built.rounds = true; }
    if (k === "sources" && !built.sources) { sources(); built.sources = true; }
  }
  root.querySelectorAll(".vk-tabs button").forEach((b) => (b.onclick = () => setTab(b.dataset.tab)));
  $v("vkFilm").onclick = () => { close(); seek(0); play(); };

  $v("vkRamp").style.background = `linear-gradient(90deg, ${RAMP.join(",")})`;
  $v("vkRampLbl").textContent = "30 → 100";
  $v("vkTitle").textContent = `Scout Atlas ${YEAR}`;
  $v("vkSrc").textContent = `Data van ${GEN} · ${DATA.scope} · ${NR} onderzoeksrondes · eindscore = gewogen gemiddelde van ${V.length} vragen`;

  function loop() { if (opened && dirty) draw(); requestAnimationFrame(loop); }
  requestAnimationFrame(loop);
  addEventListener("resize", () => { if (opened) { resize(); clampView(); } });
  layout();
  function open() {
    if (!opened) { opened = true; root.classList.add("open"); root.setAttribute("aria-hidden", "false"); }
    setTimeout(() => { if (opened) stage.style.visibility = "hidden"; }, 650);
    document.getElementById("ctrl").classList.add("hide");
    panel(); setTab(st.tab);
    hint.style.opacity = 1;
  }
  function close() { opened = false; stage.style.visibility = "visible"; root.classList.remove("open"); root.setAttribute("aria-hidden", "true"); tipEl.style.opacity = 0; }
  return { open, close, isOpen: () => opened, st, setTab };
})();
function openExplorer() { VK.open(); }
function closeExplorer(showUi) { if (!VK.isOpen()) return; VK.close(); if (showUi) showCtrl(); }
function explorerOpen() { return VK.isOpen(); }
