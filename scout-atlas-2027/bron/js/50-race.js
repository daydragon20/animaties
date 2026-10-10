/* ═════════════ 5 · DE RACE (78–106 s): de top 10, categorie per categorie, zwaarste eerst ═════════════ */
(function () {
  const L = el("div", { class: "L", style: `--hlc:${COL.mint}` }, sceneRoot);
  const head = el("div", { class: "a", style: "left:140px;top:110px;width:1640px;white-space:normal" }, L);
  el("div", { class: "kick", style: `color:${COL.mint}` }, head, "De race");
  const hw = words(el("div", { class: "serif", style: "font-size:64px;line-height:1.05;margin-top:14px;color:#efe9da" }, head), "Tien landen, *categorie per categorie.* De zwaarste eerst.");
  // staven
  const X0 = 500, X1 = 1440, Y0 = 318, RH = 64, BH = 42;
  const vmin = Math.min(...RACE.flatMap((s) => s.val)) - 6, vmax = Math.max(...RACE.flatMap((s) => s.val)) + 2;
  const XV = (v) => X0 + ((v - vmin) / (vmax - vmin)) * (X1 - X0);
  const rows = TOP.map((r, j) => {
    const g = el("div", { class: "a", style: `left:0;top:0;width:1920px;height:${RH}px` }, L);
    const rank = el("div", { class: "disp", style: `position:absolute;left:${X0 - 360}px;top:6px;font-size:42px;color:${COL.muted};width:60px;text-align:right` }, g, String(j + 1));
    const name = el("div", { class: "mono", style: `position:absolute;left:${X0 - 280}px;top:14px;font-size:${r.name.length > 14 ? 23 : 29}px;font-weight:600;color:${COL.paper}` }, g, r.name);
    const bar = el("div", { class: "a", style: `left:${X0}px;top:${(RH - BH) / 2}px;height:${BH}px;width:0;border-radius:4px;background:${r === WIN ? COL.gold : COL.mint}` }, g);
    const val = el("div", { class: "mono", style: `position:absolute;left:${X0}px;top:12px;font-size:31px;font-weight:600;color:${COL.paper}` }, g, "");
    const cat = el("div", { class: "mono", style: `position:absolute;left:${X1 + 160}px;top:16px;font-size:26px;color:${COL.soft}` }, g, "");
    return { r, g, rank, name, bar, val, cat, j };
  });
  // categorielabel bovenaan de staven, en de score in de nieuwe categorie rechts
  const catLab = el("div", { class: "a", style: `left:${X0}px;top:226px;width:900px` }, L);
  const catKick = el("div", { class: "mono", style: `font-size:20px;letter-spacing:.2em;text-transform:uppercase;color:${COL.gold}` }, catLab, "");
  const catBig = el("div", { class: "roman", style: `font-size:40px;color:${COL.paper};margin-top:2px;line-height:1.1` }, catLab, "");
  const colHead = el("div", { class: "a mono", style: `left:${X1 + 160}px;top:248px;width:240px;white-space:normal;font-size:18px;line-height:1.3;letter-spacing:.14em;text-transform:uppercase;color:${COL.muted}` }, L, "score in deze categorie");
  const note = el("div", { class: "a", style: `left:140px;top:${Y0 + 10 * RH + 14}px;width:1640px;white-space:normal;font-size:30px;line-height:1.4;color:${COL.soft}` }, L, "");
  note.className += " serif";
  // data-gestuurde zinnen per stap
  const notes = RACE.map((s, k) => {
    const prev = k ? RACE[k - 1] : null;
    const lead = s.leader.name;
    if (!prev) return `Na <b style="color:${COL.mint}">${escapeHtml(catName(s.c))}</b> (${nl(M.catShare[s.c], 0)} % van het gewicht) leidt <b style="color:${COL.gold}">${escapeHtml(lead)}</b>.`;
    const took = prev.leader.name !== lead;
    let best = null, bestD = 0;
    TOP.forEach((r, j) => { const d = prev.pos[j] - s.pos[j]; if (d > bestD) { bestD = d; best = r; } });
    let worst = null, worstD = 0;
    TOP.forEach((r, j) => { const d = s.pos[j] - prev.pos[j]; if (d > worstD) { worstD = d; worst = r; } });
    const parts = [];
    parts.push(`+ <b style="color:${COL.mint}">${escapeHtml(catName(s.c))}</b>: ` + (took ? `<b style="color:${COL.gold}">${escapeHtml(lead)}</b> neemt de leiding over.` : `<b style="color:${COL.gold}">${escapeHtml(lead)}</b> blijft aan kop.`));
    if (best && bestD >= 2) parts.push(`${escapeHtml(best.name)} klimt ${bestD} plaatsen.`);
    else if (worst && worstD >= 2) parts.push(`${escapeHtml(worst.name)} zakt ${worstD} plaatsen.`);
    if (k === RACE.length - 1) parts.push(`Eindstand: <b style="color:${COL.gold}">${escapeHtml(WIN.name)}</b> ${fTot(WIN)}, ${escapeHtml(TOP[1].name)} ${fTot(TOP[1])}.`);
    return parts.join(" ");
  });
  let shownNote = -1;
  renders.push((t) => {
    const on = t >= T.s5 - 0.1 && t < T.s6 + 0.1;
    op(L, on ? 1 : 0);
    if (!on) return;
    inout(head, t, T.s5 + 0.3, T.s6 - 0.3, 0.6, 16); revealWords(hw, t, T.s5 + 0.3, 0.08, 0.6);
    let k = -1; CUE.race.forEach((a, i) => { if (t >= a) k = i; });
    const intro = E.out(seg(t, T.s5 + 0.8, T.s5 + 1.6));
    const stepP = k >= 0 ? E.inOut(seg(t, CUE.race[k], CUE.race[k] + 0.9)) : 0;
    const cur = k >= 0 ? RACE[k] : null, prev = k > 0 ? RACE[k - 1] : null;
    rows.forEach((row) => {
      const j = row.j;
      const pos0 = prev ? prev.pos[j] : j, pos1 = cur ? cur.pos[j] : j;
      const y = Y0 + lerp(pos0, pos1, stepP) * RH;
      const v0 = prev ? prev.val[j] : vmin, v1 = cur ? cur.val[j] : vmin;
      const v = lerp(v0, v1, stepP);
      set(row.g, intro * (1 - E.in(seg(t, T.s6 - 0.5, T.s6))), 0, y);
      const w = cur ? XV(v) - X0 : 0;
      row.bar.style.width = Math.max(0, w) + "px";
      row.val.style.left = X0 + Math.max(0, w) + 16 + "px";
      row.val.textContent = cur ? nl(v, 1) : "";
      const p1 = Math.round(lerp(pos0, pos1, stepP));
      row.rank.textContent = String(p1 + 1);
      row.rank.style.color = p1 === 0 && cur ? COL.gold : COL.muted;
      row.cat.textContent = cur ? fCat(row.r, cur.c) : "";
      row.cat.style.color = cur && row.r.catRank[cur.c] === 1 ? COL.gold : COL.soft;
      row.name.style.color = cur && p1 === 0 ? COL.gold : COL.paper;
    });
    if (cur) {
      catKick.textContent = `categorie ${k + 1} van ${RACE.length} · gewicht ${nl(M.catShare[cur.c], 0)} %`;
      catBig.textContent = (k ? "+ " : "") + catName(cur.c);
    }
    op(catLab, cur ? win(t, CUE.race[k], k < RACE.length - 1 ? CUE.race[k + 1] : T.s6 - 0.3, 0.3, 0.2) : 0);
    op(colHead, cur ? intro : 0);
    if (k !== shownNote && k >= 0) { shownNote = k; note.innerHTML = notes[k]; }
    op(note, cur ? win(t, CUE.race[k] + 0.3, k < RACE.length - 1 ? CUE.race[k + 1] : T.s6 - 0.3, 0.3, 0.2) : 0);
  });
})();
