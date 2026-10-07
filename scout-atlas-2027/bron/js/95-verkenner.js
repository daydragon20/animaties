/* ═════════════ VERKENNER: alle data, verschuifbaar en zoombaar ═════════════
   Een kaart van alle scores (alle landen × alle vragen, gegroepeerd per categorie), een ranglijst als tabel,
   en een speelveld voor de gewichten. Opent vanzelf na de film, of met de knop "data" / toets D. */
const VK = (() => {
  const $v = (id) => document.getElementById(id);
  const root = $v("vk"), cv = $v("vkCanvas"), g = cv.getContext("2d"), wrap = $v("vkWrap"), tipEl = $v("vkTip"), side = $v("vkSide");
  const mini = $v("vkMini"), mg = mini.getContext("2d"), hint = $v("vkHint");
  const CW = 64, QH = 24, CHH = 34, GAP = 8;  // wereldmaten: kolombreedte, vraagrij, categorierij, ruimte na een groep
  let LW = 310, TH = 132;                      // vaste kop links en boven (schermpixels)
  const st = { s: 1, ox: 0, oy: 0, collapsed: new Set(), order: CC.slice(), sortBy: null, hover: null, sel: null, q: "", tab: "matrix" };
  let rows = [], rowY = [], rowH = [], totalW = 0, totalH = 0, W = 0, H = 0, dpr = 1, dirty = true, opened = false;
  const catOrder = M.byWeight;
  const NAME_FONT = "500 15px 'IBM Plex Mono', monospace";
  const lum = (hex) => { const [r, g_, b] = hex2rgb(hex).map((x) => x / 255); return 0.2126 * r + 0.7152 * g_ + 0.0722 * b; };
  const cellCol = (v) => (v === 100 ? COL.gold : scoreCol(v));
  const qMatch = (txt) => !st.q || txt.toLowerCase().includes(st.q);
  const HEADNAME = { "Bosnië en Herzegovina": "Bosnië-Herz.", "Noord-Macedonië": "N.-Macedonië" };

  function layout() {
    rows = []; rowY = []; rowH = [];
    let y = 0;
    catOrder.forEach((c) => {
      rows.push({ type: "cat", c }); rowY.push(y); rowH.push(CHH); y += CHH;
      if (!st.collapsed.has(c)) V.filter((v) => v.category === c).forEach((v) => { rows.push({ type: "q", v, c }); rowY.push(y); rowH.push(QH); y += QH; });
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
    LW = W < 640 ? 150 : W < 1000 ? 230 : 310; TH = W < 640 ? 110 : 132;
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
  // scherm → cel
  function rowAt(wy) { let lo = 0, hi = rows.length - 1, k = -1; while (lo <= hi) { const m = (lo + hi) >> 1; if (rowY[m] <= wy) { k = m; lo = m + 1; } else hi = m - 1; } return k >= 0 && wy < rowY[k] + rowH[k] ? k : -1; }
  function hit(mx, my) {
    const wx = st.ox + (mx - LW) / st.s, wy = st.oy + (my - TH) / st.s;
    const col = Math.floor(wx / CW), ri = rowAt(wy);
    const okC = col >= 0 && col < st.order.length;
    if (mx < LW && my < TH) return { zone: "corner" };
    if (my < TH) return okC ? { zone: "top", col } : null;
    if (mx < LW) return ri >= 0 ? { zone: "left", ri } : null;
    return okC && ri >= 0 ? { zone: "cell", col, ri } : null;
  }

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
      const isCat = row.type === "cat";
      const match = isCat ? true : qMatch(row.v.name) || qMatch(row.c);
      for (let ci = c0; ci <= c1; ci++) {
        const c = st.order[ci], x = sx(ci * CW);
        const v = isCat ? c.catExact[row.c] : c.scores[row.v.i];
        let a = match ? 1 : 0.16;
        if (selName && c.name !== selName && !(st.sel.type === "var")) a *= 0.55;
        g.globalAlpha = a;
        g.fillStyle = cellCol(isCat ? Math.round(v * 10) / 10 : v);
        const rr = Math.min(4, gap * 2);
        if (rr > 0 && g.roundRect) { g.beginPath(); g.roundRect(x + gap / 2, y + gap / 2, cw - gap, h - gap, rr); g.fill(); } else g.fillRect(x, y, cw, h);
        if (isCat && h > 10) { g.globalAlpha = a * 0.9; g.strokeStyle = "#05090b"; g.lineWidth = 1; g.strokeRect(x + gap / 2 + 0.5, y + gap / 2 + 0.5, cw - gap - 1, h - gap - 1); }
        if (showVal || (isCat && cw >= 34 && h >= 15)) {
          const col_ = cellCol(isCat ? Math.round(v * 10) / 10 : v);
          g.fillStyle = lum(col_) > 0.45 ? "#04110d" : "#efe9da";
          const fs = Math.min(isCat ? 16 : 14, h * 0.5, cw * 0.3);
          g.font = `${isCat ? 600 : 500} ${fs}px 'IBM Plex Mono', monospace`;
          g.fillText(isCat ? nl(v, 1) : v === 100 ? "100" : nl(v, 1), x + cw / 2, y + h / 2 + 0.5);
        }
      }
    }
    g.globalAlpha = 1;
    // kruisdraad bij hover / selectie
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
      g.fillStyle = on ? COL.gold : hov ? COL.paper : COL.muted;
      g.font = `500 ${Math.min(14, Math.max(9, cw * 0.32))}px 'IBM Plex Mono', monospace`;
      g.fillText(String(c.rank), xc, 16);
      if (cw >= 9) {
        g.save(); g.translate(xc - 4, TH - (cw >= 40 ? 30 : 12)); g.rotate(-Math.PI / 4.2);
        g.textAlign = "left"; g.fillStyle = on ? COL.gold : hov ? COL.paper : COL.soft;
        g.font = cw >= 26 ? NAME_FONT : `500 ${Math.max(9, cw * 0.58)}px 'IBM Plex Mono', monospace`;
        g.fillText(HEADNAME[c.name] || c.name, 0, 0, (TH - 56) / Math.sin(Math.PI / 4.2)); g.restore();
      }
      if (cw >= 40) { g.textAlign = "center"; g.fillStyle = on ? COL.gold : COL.mint; g.font = "300 19px 'Big Shoulders Display', sans-serif"; g.fillText(fTot(c), xc, TH - 8); }
    }
    g.restore();
    g.strokeStyle = "rgba(239,233,218,.12)"; g.lineWidth = 1; g.beginPath(); g.moveTo(LW, TH - 0.5); g.lineTo(W, TH - 0.5); g.moveTo(LW - 0.5, 0); g.lineTo(LW - 0.5, H); g.stroke();
    // kop links: categorieën en vragen
    g.fillStyle = "#05090b"; g.fillRect(0, TH, LW, H - TH);
    g.save(); g.beginPath(); g.rect(0, TH, LW, H - TH); g.clip();
    const qFs = Math.min(15, QH * s * 0.6);
    for (let ri = r0; ri <= r1; ri++) {
      const row = rows[ri], y = sy(rowY[ri]), h = rowH[ri] * s;
      g.textBaseline = "middle"; g.textAlign = "left";
      if (row.type === "cat") {
        if (h < 4) continue;
        const coll = st.collapsed.has(row.c);
        g.fillStyle = "rgba(124,240,196,.06)"; g.fillRect(0, y, LW, h);
        g.fillStyle = COL.mint; g.font = `600 ${Math.min(15, Math.max(11, h * 0.46))}px 'IBM Plex Mono', monospace`;
        const label = (coll ? "▸ " : "▾ ") + (LW < 200 ? short(row.c) : row.c).toUpperCase();
        g.fillText(label, 12, y + h / 2, LW - 70);
        g.textAlign = "right"; g.fillStyle = COL.gold; g.fillText(nl(M.catShare[row.c], 0) + "%", LW - 12, y + h / 2);
      } else if (qFs >= 7) {
        const sel = selVar === row.v.i, hov = hv && (hv.zone === "left" || hv.zone === "cell") && hv.ri === ri;
        const match = qMatch(row.v.name) || qMatch(row.c);
        g.globalAlpha = match ? 1 : 0.3;
        g.font = `${sel ? 600 : 400} ${qFs}px 'IBM Plex Mono', monospace`;
        g.fillStyle = sel ? COL.gold : hov ? COL.paper : COL.soft;
        g.fillText(row.v.name, 12, y + h / 2, LW - 66);
        g.textAlign = "right"; g.fillStyle = COL.muted; g.fillText(nl(row.v.weight, 2), LW - 12, y + h / 2);
        g.globalAlpha = 1;
      }
    }
    g.restore();
    // hoek
    g.fillStyle = "#05090b"; g.fillRect(0, 0, LW, TH);
    g.textAlign = "left"; g.textBaseline = "alphabetic";
    g.fillStyle = COL.paper; g.font = "800 22px 'Big Shoulders Display', sans-serif";
    g.fillText(`${CC.length} landen × ${V.length} vragen`.toUpperCase(), 14, 30);
    g.fillStyle = COL.muted; g.font = "400 13px 'IBM Plex Mono', monospace";
    const sortTxt = st.sortBy ? `landen gesorteerd op: ${st.sortBy.label}` : "landen in volgorde van de eindstand";
    g.fillText(sortTxt, 14, 52, LW - 24);
    g.fillText("gewicht →", LW - 82, TH - 10);
    g.fillText(st.sortBy ? "klik hier om terug te zetten" : "klik op een vraag om te sorteren", 14, 70, LW - 24);
    drawMiniView();
  }
  /* minikaart */
  const miniBase = document.createElement("canvas");
  function drawMiniBase() {
    miniBase.width = 200; miniBase.height = 140;
    const m = miniBase.getContext("2d");
    m.fillStyle = "#05090b"; m.fillRect(0, 0, 200, 140);
    const sc = Math.min(188 / totalW, 128 / totalH), ox = (200 - totalW * sc) / 2, oy = (140 - totalH * sc) / 2;
    rows.forEach((row, ri) => st.order.forEach((c, ci) => {
      const v = row.type === "cat" ? c.catExact[row.c] : c.scores[row.v.i];
      m.fillStyle = cellCol(row.type === "cat" ? Math.round(v * 10) / 10 : v);
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
      if (row.type === "cat") {
        html = `<div class="v" style="color:${COL.mint}">${fCat(c, row.c)}</div><div class="k">${escapeHtml(c.name)} · ${escapeHtml(row.c)}</div>` +
          `<div class="r"><span>plaats in deze categorie</span><span>${c.catRank[row.c]}e van ${CC.length}</span></div>` +
          `<div class="r"><span>telt mee voor</span><span>${nl(M.catShare[row.c], 1)} % van de eindscore</span></div>` +
          `<div class="r"><span>vragen</span><span>${M.catN[row.c]}</span></div>`;
      } else {
        const v = row.v, sc = c.scores[v.i];
        html = `<div class="v" style="color:${sc === 100 ? COL.gold : COL.mint}">${sc === 100 ? "100" : nl(sc, 1)}</div><div class="k">${escapeHtml(c.name)}</div>` +
          `<div style="margin:6px 0 8px;color:${COL.paper}">${escapeHtml(v.name)}</div>` +
          `<div class="r"><span>plaats op deze vraag</span><span>${M.varRank[v.i][c.name]}e van ${CC.length}</span></div>` +
          `<div class="r"><span>categorie</span><span>${escapeHtml(short(v.category))} · ${fCat(c, v.category)}</span></div>` +
          `<div class="r"><span>gewicht</span><span>${nl(v.weight, 3)} (${nl((v.weight / M.totW) * 100, 2)} %)</span></div>`;
      }
    } else if (h.zone === "top") {
      const c = st.order[h.col];
      html = `<div class="v" style="color:${COL.mint}">${fTot(c)}</div><div class="k">${c.rank}. ${escapeHtml(c.name)}</div><div style="margin-top:6px;font-family:var(--serif);font-style:italic">${escapeHtml(c.profile)}</div><div class="r" style="margin-top:6px"><span>zekerheid</span><span>${c.zeker}</span></div><div class="k" style="margin-top:8px">klik voor details</div>`;
    } else {
      const row = rows[h.ri];
      if (row.type === "cat") html = `<div class="k">${escapeHtml(row.c)}</div><div class="r"><span>aandeel in eindscore</span><span>${nl(M.catShare[row.c], 1)} %</span></div><div class="r"><span>vragen</span><span>${M.catN[row.c]}</span></div><div class="k" style="margin-top:8px">klik om ${st.collapsed.has(row.c) ? "open" : "dicht"} te klappen</div>`;
      else html = `<div class="k">vraag ${row.v.id} · ${escapeHtml(short(row.v.category))}</div><div style="margin:6px 0;color:${COL.paper}">${escapeHtml(row.v.name)}</div><div class="r"><span>gewicht</span><span>${nl(row.v.weight, 3)}</span></div><div class="k" style="margin-top:8px">klik om de landen hierop te sorteren</div>`;
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
  function panel() {
    const s_ = st.sel;
    let h = "";
    if (!s_) {
      h = `<div class="kk" style="margin-top:0">Alle data achter de film</div>
        <h3>${nl(M.nScores, 0)}<br>scores</h3>
        <p>${CC.length} landen × ${V.length} vragen, in ${CATS.length} categorieën. Elke cel is één score van 0 tot 100: donker = lager, licht = hoger, <span style="color:${COL.gold}">goud = 100</span>.
        De volle rijen per categorie tonen de categoriescore.</p>
        <p>Bovenaan staan de landen in volgorde van de eindstand, met hun eindscore.</p>
        <div class="kk">Zo werkt het</div>
        <p>Slepen = bewegen · scrollen of knijpen = zoomen · dubbelklik = inzoomen.<br>Klik op een <b>land</b> voor zijn profiel, op een <b>vraag</b> om de landen erop te sorteren, op een <b>categorie</b> om ze open of dicht te klappen.<br>
        Toetsen: <kbd>←↑→↓</kbd> bewegen · <kbd>+</kbd> <kbd>−</kbd> zoomen · <kbd>0</kbd> alles tonen · <kbd>Esc</kbd> terug naar de film.</p>
        <div class="kk">Eerlijk</div>
        <p class="vk-muted">Eindscores zijn exact herberekend uit de ruwe scores en gewichten (2 decimalen), categoriescores zijn gewogen. Daardoor staat Polen vóór Oostenrijk en Frankrijk vóór Montenegro. Zie DATACONTROLE.md.</p>`;
    } else if (s_.type === "country" || s_.type === "cell") {
      const c = s_.c;
      const sorted = V.map((v) => ({ v, s: c.scores[v.i] }));
      const top = [...sorted].sort((a, b) => b.s - a.s).slice(0, 6), low = [...sorted].sort((a, b) => a.s - b.s).slice(0, 6);
      h = `<div class="kk" style="margin-top:0">Plaats ${c.rank} van ${CC.length}</div><h3>${escapeHtml(c.name)}</h3>
        <div class="big">${fTot(c)}</div><div class="it">${escapeHtml(c.profile)}</div>
        <div class="meta">zekerheid ${c.zeker} · ${c.region === "Europe" ? "Europa" : c.region === "North America" ? "Noord-Amerika" : "Europa/Azië"}${c.rankJson !== c.rank ? ` · in de JSON op plaats ${c.rankJson} (${nl(c.totalJson, 1)})` : ""}</div>`;
      if (s_.type === "cell") {
        const v = s_.v, sc = c.scores[v.i];
        const all = [...CC].sort((a, b) => b.scores[v.i] - a.scores[v.i]);
        h += `<div class="kk">Vraag ${v.id} · ${escapeHtml(short(v.category))}</div><p style="color:var(--paper);margin:0 0 8px">${escapeHtml(v.name)}</p>
          <div class="vk-bars">${all.map((x) => bar(x.name, x.scores[v.i] - 40, 60, x.scores[v.i] === 100 ? "100" : nl(x.scores[v.i], 1), M.varRank[v.i][x.name], x === c ? COL.gold : scoreCol(x.scores[v.i]), x === c)).join("")}</div>
          <div class="meta">gewicht ${nl(v.weight, 3)} · score ${sc === 100 ? "100" : nl(sc, 1)}</div>`;
      }
      h += `<div class="kk">Per categorie (zwaarste eerst) · plaats op ${CC.length}</div><div class="vk-bars">` +
        catOrder.map((k) => bar(k, c.catExact[k] - 50, 50, fCat(c, k), c.catRank[k] + "e", scoreCol(c.catExact[k]), false)).join("") + `</div>
        <div class="kk">Sterkste vragen</div><ul class="vk-list">${top.map((x) => `<li><span>${escapeHtml(x.v.name)}</span><span>${x.s === 100 ? "100" : nl(x.s, 1)}</span></li>`).join("")}</ul>
        <div class="kk">Zwakste vragen</div><ul class="vk-list">${low.map((x) => `<li><span>${escapeHtml(x.v.name)}</span><span style="color:${COL.coral}">${nl(x.s, 1)}</span></li>`).join("")}</ul>
        <button class="vk-link" data-act="clear">← terug naar het overzicht</button>`;
    } else if (s_.type === "var") {
      const v = s_.v, all = [...CC].sort((a, b) => b.scores[v.i] - a.scores[v.i]);
      h = `<div class="kk" style="margin-top:0">Vraag ${v.id} · ${escapeHtml(v.category)}</div><h3 style="font-size:30px">${escapeHtml(v.name)}</h3>
        <div class="meta">gewicht ${nl(v.weight, 3)} · ${nl((v.weight / M.totW) * 100, 2)} % van de eindscore</div>
        <div class="kk">Alle landen op deze vraag</div><div class="vk-bars">${all.map((x) => bar(x.name, x.scores[v.i] - 40, 60, x.scores[v.i] === 100 ? "100" : nl(x.scores[v.i], 1), M.varRank[v.i][x.name], scoreCol(x.scores[v.i]), false)).join("")}</div>
        <button class="vk-link" data-act="clear">← terug naar het overzicht</button>`;
    }
    side.innerHTML = h;
    side.scrollTop = 0;
  }
  side.addEventListener("click", (e) => { const a = e.target.closest("[data-act]"); if (a && a.dataset.act === "clear") { st.sel = null; panel(); dirty = true; } });

  function sortBy(row) {
    if (!row || (st.sortBy && st.sortBy.key === (row.type === "cat" ? "c:" + row.c : "v:" + row.v.i))) { st.sortBy = null; st.order = CC.slice(); }
    else if (row.type === "cat") { st.sortBy = { key: "c:" + row.c, label: row.c }; st.order = [...CC].sort((a, b) => b.catExact[row.c] - a.catExact[row.c]); }
    else { st.sortBy = { key: "v:" + row.v.i, label: row.v.name }; st.order = [...CC].sort((a, b) => b.scores[row.v.i] - a.scores[row.v.i] || a.rank - b.rank); }
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
      else { sortBy(row); st.sel = st.sortBy ? { type: "var", v: row.v } : null; }
    } else {
      const c = st.order[h.col], row = rows[h.ri];
      st.sel = row.type === "cat" ? { type: "country", c } : { type: "cell", c, v: row.v };
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
    else if (st.q) { const ri = rows.findIndex((r) => r.type === "q" && r.v.name.toLowerCase().includes(st.q)); if (ri >= 0) { st.oy = rowY[ri] - viewH() * 0.3; clampView(); } }
    if (st.tab !== "matrix") setTab("matrix");
    dirty = true;
  });

  /* ranglijst (tabel) */
  const tbl = $v("vkTable");
  let tSort = { k: "rank", dir: 1 };
  function table() {
    const cols = [["rank", "#"], ["name", "Land"], ["total", "Eindscore"], ...catOrder.map((c) => ["c:" + c, short(c) + ` <span style="color:${COL.gold}">${nl(M.catShare[c], 0)}%</span>`]), ["zeker", "Zekerheid"], ["profile", "Profiel"]];
    const val = (c, k) => (k === "rank" ? c.rank : k === "name" ? c.name : k === "total" ? c.totalExact : k === "zeker" ? c.zeker : k === "profile" ? c.profile : c.catExact[k.slice(2)]);
    const list = [...CC].sort((a, b) => { const x = val(a, tSort.k), y = val(b, tSort.k); return (typeof x === "string" ? x.localeCompare(y, "nl") : x - y) * tSort.dir; });
    tbl.innerHTML = `<thead><tr>${cols.map(([k, l]) => `<th data-k="${k}" class="${tSort.k === k ? "on" : ""}">${l}${tSort.k === k ? (tSort.dir > 0 ? " ↑" : " ↓") : ""}</th>`).join("")}</tr></thead><tbody>` +
      list.map((c) => `<tr data-n="${escapeHtml(c.name)}"><td class="vk-muted">${c.rank}</td><td class="nm" style="color:${c.rank === 1 ? COL.gold : COL.paper}">${escapeHtml(c.name)}</td><td class="tot">${fTot(c)}</td>` +
        catOrder.map((k) => { const v = Math.round(c.catExact[k] * 10) / 10, bg = scoreCol(v); return `<td class="c" style="background:${bg};color:${lum(bg) > 0.45 ? "#04110d" : "#efe9da"}" title="${escapeHtml(c.name)} · ${escapeHtml(k)}: ${fCat(c, k)} (${c.catRank[k]}e)">${fCat(c, k)}</td>`; }).join("") +
        `<td>${c.zeker}</td><td class="pf">${escapeHtml(c.profile)}</td></tr>`).join("") + `</tbody>`;
  }
  tbl.addEventListener("click", (e) => {
    const th = e.target.closest("th");
    if (th) { const k = th.dataset.k; tSort = { k, dir: tSort.k === k ? -tSort.dir : k === "rank" || k === "name" || k === "zeker" || k === "profile" ? 1 : -1 }; table(); return; }
    const tr = e.target.closest("tr[data-n]");
    if (tr) { st.sel = { type: "country", c: M.by[tr.dataset.n] }; setTab("matrix"); panel(); const ci = st.order.indexOf(st.sel.c); st.ox = ci * CW - viewW() / 2; clampView(); dirty = true; }
  });

  /* gewichten */
  const mult = {};
  catOrder.forEach((c) => (mult[c] = 1));
  const slWrap = $v("vkSliders"), live = $v("vkLive");
  const sl = catOrder.map((c) => {
    const r = el("div", { class: "vk-sl" }, slWrap);
    el("span", { class: "nm" }, r, escapeHtml(c));
    const inp = el("input", { type: "range", min: 0, max: 300, step: 5, value: 100, "aria-label": `Gewicht ${c}` }, r);
    const pc = el("span", { class: "pc" }, r);
    inp.addEventListener("input", () => { mult[c] = inp.value / 100; weights(); });
    return { c, inp, pc };
  });
  const liveRows = {};
  CC.forEach((c) => { liveRows[c.name] = el("li", { class: c.rank === 1 ? "w" : "" }, live, `<span class="r"></span><span class="n">${escapeHtml(c.name)}</span><span class="s"></span><span class="d"></span>`); });
  function weights() {
    const m2 = berekenModel(DATA, mult);
    const tot = Object.values(m2.catWnow).reduce((a, b) => a + b, 0);
    sl.forEach((s) => (s.pc.innerHTML = `${s.inp.value}%<small>= ${nl((m2.catWnow[s.c] / (tot || 1)) * 100, 1)}%</small>`));
    m2.C.forEach((c, i) => {
      const li = liveRows[c.name], d = c.rankJson ? M.by[c.name].rank - (i + 1) : 0;
      li.style.transform = `translateY(${(i - (M.by[c.name].rank - 1)) * 30}px)`;
      li.querySelector(".r").textContent = i + 1;
      li.querySelector(".s").textContent = tot ? nl(c.totalExact, 2) : "—";
      const dd = li.querySelector(".d");
      dd.textContent = d > 0 ? `▲ ${d}` : d < 0 ? `▼ ${-d}` : "·";
      dd.style.color = d > 0 ? COL.mint : d < 0 ? COL.coral : COL.muted;
      li.querySelector(".n").style.color = i === 0 ? COL.gold : "";
    });
  }
  // volgorde in de DOM = oorspronkelijke rang; de verschuiving doet de animatie
  CC.forEach((c) => live.appendChild(liveRows[c.name]));
  $v("vkReset").onclick = () => { sl.forEach((s) => { s.inp.value = 100; mult[s.c] = 1; }); weights(); };

  /* CSV (puntkomma en komma, zoals Excel in België verwacht) */
  $v("vkCsv").onclick = () => {
    const q = (s) => `"${String(s).replace(/"/g, '""')}"`, n = (x, d) => nl(x, d).replace(/\./g, "");
    const lines = [["id", "categorie", "vraag", "gewicht", ...CC.map((c) => `${c.rank}. ${c.name}`)].map(q).join(";")];
    V.forEach((v) => lines.push([v.id, q(v.category), q(v.name), n(v.weight, 3), ...CC.map((c) => n(c.scores[v.i], 1))].join(";")));
    lines.push("");
    catOrder.forEach((k) => lines.push(["", q(k), q("categoriescore (gewogen)"), n(M.catW[k], 3), ...CC.map((c) => n(c.catExact[k], 1))].join(";")));
    lines.push(["", "", q("EINDSCORE (gewogen gemiddelde)"), n(M.totW, 3), ...CC.map((c) => n(c.totalExact, 2))].join(";"));
    const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = el("a", { href: URL.createObjectURL(blob), download: `scout-atlas-${YEAR}-data.csv` }, document.body);
    a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  };

  /* tabs */
  function setTab(k) {
    st.tab = k;
    root.querySelectorAll(".vk-tabs button").forEach((b) => b.classList.toggle("on", b.dataset.tab === k));
    root.querySelectorAll(".vk-pane").forEach((p) => p.classList.toggle("on", p.dataset.pane === k));
    if (k === "matrix") { resize(); dirty = true; }
    if (k === "rank") table();
    if (k === "weights") weights();
  }
  root.querySelectorAll(".vk-tabs button").forEach((b) => (b.onclick = () => setTab(b.dataset.tab)));
  $v("vkFilm").onclick = () => { close(); seek(0); play(); };

  // legenda
  $v("vkRamp").style.background = `linear-gradient(90deg, ${RAMP.join(",")})`;
  $v("vkRampLbl").textContent = "60 → 100";
  $v("vkTitle").textContent = `Scout Atlas ${YEAR}`;
  $v("vkSrc").textContent = `Data van ${GEN} · ${DATA.scope} · eindscore = gewogen gemiddelde van ${V.length} vragen`;

  function loop() { if (opened && dirty) draw(); requestAnimationFrame(loop); }
  requestAnimationFrame(loop);
  addEventListener("resize", () => { if (opened) { resize(); clampView(); } });
  layout();
  function open() {
    if (!opened) { opened = true; root.classList.add("open"); root.setAttribute("aria-hidden", "false"); }
    // de film eronder hoeft niet mee te tekenen zolang de verkenner open is
    setTimeout(() => { if (opened) stage.style.visibility = "hidden"; }, 650);
    document.getElementById("ctrl").classList.add("hide");
    resize(); layout(); fitWidth(); panel(); setTab(st.tab);
    hint.style.opacity = 1;
    setTimeout(() => { if (document.activeElement !== $v("vkSearch")) cv.focus({ preventScroll: true }); }, 50);
  }
  function close() { opened = false; stage.style.visibility = "visible"; root.classList.remove("open"); root.setAttribute("aria-hidden", "true"); tipEl.style.opacity = 0; }
  return { open, close, isOpen: () => opened, st };
})();
function openExplorer() { VK.open(); }
function closeExplorer(showUi) { if (!VK.isOpen()) return; VK.close(); if (showUi) showCtrl(); }
function explorerOpen() { return VK.isOpen(); }
