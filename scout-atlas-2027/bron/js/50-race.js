/* ═════════════ 5 · DE RACE (66–94 s): top 10, categorie per categorie, zwaarste eerst ═════════════
   Elke rij toont dezelfde tussenstand als de balk en de volgorde: het gewogen gemiddelde van de categorieën tot nu toe.
   Links daarvan staat de score in de categorie die net is toegevoegd. Aan het eind is de tussenstand de eindscore. */
(function () {
  const t0 = T.s5;
  const L = el("div", { class: "L" }, sceneRoot);
  const kick = el("div", { class: "a kick", style: `left:110px;top:124px;color:${N.mint}` }, L, "De race");
  const head = el("div", { class: "a serif", style: "left:110px;top:170px;font-size:56px;line-height:1.08;white-space:normal;width:540px;color:#ede6d1" }, L);
  const wH = words(head, "Categorie per categorie. De zwaarste eerst.");
  const catBox = el("div", { class: "a", style: "left:110px;top:410px;width:560px;height:170px" }, L);
  const kFinal = RACE.length - 1;
  const catEls = RACE.map((s) => el("div", { class: "a disp", style: `left:0;top:0;width:560px;white-space:normal;font-size:74px;line-height:.95;color:${N.sun}` }, catBox, "+ " + s.c));
  const lines = [];
  const say = (a, b, html, color = N.paper) => {
    const e = el("div", { class: "a mono", style: `left:110px;top:600px;width:560px;white-space:normal;font-size:32px;line-height:1.38;color:${color}` }, L, html);
    lines.push({ e, a, b });
  };
  const B = (c, txt) => `<b style="color:${c}">${escapeHtml(txt)}</b>`;
  const [s0, s1, s2] = RACE;
  const nm = (s) => short(s.c).toLowerCase();
  say(CUE.race[0] + 0.3, CUE.race[1] - 0.1, `Na ${nm(s0)} staat ${B(N.mint, s0.leader.name)} vooraan.`);
  say(CUE.race[1] + 0.3, CUE.race[2] - 0.1, s1.leader === s0.leader
    ? `${short(s1.c)} erbij: ${B(N.mint, s1.leader.name)} blijft vooraan.`
    : `${short(s1.c)} erbij: ${B(N.mint, s1.leader.name)} neemt over.`);
  // wie zakt het meest als de derde categorie erbij komt?
  const dj = TOP.map((_, j) => j).reduce((a, j) => (s2.pos[j] - s1.pos[j] > s2.pos[a] - s1.pos[a] ? j : a), 0);
  const dropper = TOP[dj];
  say(CUE.race[2] + 0.3, CUE.race[3] + 0.4,
    `${short(s2.c)} erbij.<br>${B(N.coral, dropper.name + ": " + fCat(dropper, s2.c))}<br>Van plek ${s1.pos[dj] + 1} naar plek ${s2.pos[dj] + 1}.`);
  // wanneer pakt de uiteindelijke winnaar de leiding, en houdt ze die vast?
  const wj = TOP.indexOf(WIN);
  let lastTake = -1;
  RACE.forEach((s, k) => { if (s.leader === WIN && (k === 0 || RACE[k - 1].leader !== WIN)) lastTake = k; });
  const ledBefore = RACE.some((s, k) => k < lastTake && s.leader === WIN);
  say(CUE.race[3] + 0.5, CUE.race[Math.max(4, lastTake)] - 0.1, `Nog ${numWord(RACE.length - 3).toLowerCase()} categorieën.<br>Elke seconde één.`);
  say(CUE.race[Math.max(4, lastTake)] + 0.2, CUE.finalLabel - 0.2,
    `${B(N.mint, WIN.name)} ${ledBefore ? "pakt de leiding terug" : "pakt de leiding"}.<br>En geeft ze niet meer af.`);
  say(CUE.finalLabel + 0.2, T.s6 - 0.2, `Alle ${V.length} vragen gewogen.<br>Dit is de eindstand van de top 10.`, N.soft);
  const finalHead = el("div", { class: "a disp", style: `left:110px;top:410px;font-size:96px;color:${N.mint}` }, L, "Eindstand");
  const stackG = sv("svg", { width: 200, height: 220, style: "position:absolute;left:110px;top:810px;overflow:visible" }, L);
  const totalW = byWeight.reduce((s, c) => s + catW[c], 0);
  let sy = 200;
  const stack = byWeight.map((c) => {
    const h = (catW[c] / totalW) * 200; sy -= h;
    return sv("rect", { x: 0, y: sy + 1, width: 44, height: Math.max(1.5, h - 2), fill: N.dim, rx: 2 }, stackG);
  });
  sv("text", { x: 60, y: 200, "font-size": 24, fill: N.muted }, stackG, "zwaar");
  sv("text", { x: 60, y: 22, "font-size": 24, fill: N.muted }, stackG, "licht");

  // kolommen: rang · naam · score deze categorie · balk · tussenstand
  const RX = 700, RY = 178, RH = 78, BX = 520, BW = 440, TOTX = 970;
  const BASE = 80, TOPV = 97;
  const bw = (v) => clamp((v - BASE) / (TOPV - BASE), 0, 1) * BW;
  const rows = TOP.map((r, j) => {
    const row = el("div", { class: "a", style: `left:${RX}px;top:0;width:1170px;height:${RH}px` }, L);
    const plate = el("div", { class: "a", style: `left:-16px;top:6px;width:1170px;height:${RH - 12}px;border-radius:8px` }, row);
    const num = el("div", { class: "a mono", style: "left:0;top:19px;width:44px;text-align:right;font-size:30px;color:" + N.muted }, row, "");
    const name = el("div", { class: "a mono", style: "left:66px;top:15px;font-size:36px;font-weight:500" }, row, r.name);
    const chipC = el("div", { class: "a disp", style: `left:${BX - 170}px;width:150px;text-align:right;top:14px;font-size:46px;font-weight:700` }, row, "");
    const bar = el("div", { class: "a", style: `left:${BX}px;top:24px;height:30px;border-radius:3px` }, row);
    const chipT = el("div", { class: "a disp", style: `left:${TOTX}px;width:190px;text-align:right;top:10px;font-size:54px;font-weight:700` }, row, "");
    return { r, j, row, plate, num, name, chipC, bar, chipT };
  });
  const hdr = `top:128px;font-size:24px;letter-spacing:.04em;color:${N.muted}`;
  const hCat = el("div", { class: "a mono", style: `left:${RX + BX - 320}px;width:300px;text-align:right;${hdr}` }, L, "deze categorie");
  const hBar = el("div", { class: "a mono", style: `left:${RX + BX}px;${hdr}` }, L, "tussenstand →");
  const hTot = el("div", { class: "a mono", style: `left:${RX + TOTX - 120}px;width:310px;text-align:right;${hdr};color:${N.mint}` }, L, "eindscore");
  renders.push((t) => {
    const o = win(t, t0 - 0.1, T.s6, 0.01, 0.5);
    op(L, o);
    if (o <= 0) return;
    const lt = t - t0;
    inout(kick, lt, 0.1, 40, 0.5, 12);
    set(head, 1); revealWords(wH, lt, 0.2, 0.1, 0.5);
    let k = -1;
    CUE.race.forEach((c, i) => { if (t >= c) k = i; });
    catEls.forEach((e, i) => {
      const a = CUE.race[i], b = i < kFinal ? CUE.race[i + 1] : CUE.finalLabel;
      const pi = E.out5(seg(t, a, a + 0.3)), po = E.in(seg(t, b - 0.15, b));
      set(e, pi * (1 - po), (1 - pi) * -40 + po * 40, 0);
    });
    inout(finalHead, t, CUE.finalLabel, T.s6 - 0.2, 0.5, 30);
    lines.forEach((l) => inout(l.e, t, l.a, l.b, 0.5, 14));
    const fin = t >= CUE.finalLabel;
    stack.forEach((r, i) => r.setAttribute("fill", i === k && !fin ? N.sun : t >= CUE.race[i] ? N.mint : N.dim));
    const p = k >= 0 ? E.inOut(seg(t, CUE.race[k], CUE.race[k] + 0.5)) : 0;
    const cur = k >= 0 ? RACE[k] : null, prev = k > 0 ? RACE[k - 1] : null;
    const isFinal = k === kFinal;
    rows.forEach((w) => {
      const j = w.j;
      const posNow = cur ? cur.pos[j] : RACE[0].pos[j], posPrev = prev ? prev.pos[j] : RACE[0].pos[j];
      const pos = lerp(posPrev, posNow, p);
      const enter = E.out5(seg(lt, 0.6 + RACE[0].pos[j] * 0.06, 1.0 + RACE[0].pos[j] * 0.06));
      set(w.row, enter, (1 - enter) * 120, RY + pos * RH);
      const vNow = cur ? cur.val[j] : BASE, vPrev = prev ? prev.val[j] : BASE;
      const vShown = lerp(vPrev, vNow, p);
      w.bar.style.width = bw(vShown) + "px";
      w.num.textContent = String(Math.round(pos) + 1);
      const lead = cur && cur.pos[j] === 0;
      const c = cur ? cur.c : null, val = c ? w.r.cat[c] : null;
      // score in de nieuwe categorie (links van de balk)
      if (c && !fin) {
        w.chipC.textContent = nl(val, 1);
        w.chipC.style.color = val === topMin[c] ? N.coral : val === topMax[c] ? N.sun : N.paper;
      } else w.chipC.textContent = "";
      // tussenstand (rechts van de balk); aan het eind de eindscore met twee decimalen
      if (cur) w.chipT.textContent = isFinal ? fTot(w.r) : nl(vNow, 1);
      else w.chipT.textContent = "";
      w.chipT.style.color = lead ? N.mint : isFinal && j < 3 ? N.sun : N.paper;
      const chipIn = cur ? E.out5(seg(t, CUE.race[k] + 0.05, CUE.race[k] + 0.35)) : 0;
      w.chipC.style.opacity = chipIn * (fin ? 0 : 1); w.chipT.style.opacity = chipIn;
      w.chipC.style.transform = `translateY(${(1 - chipIn) * 10}px)`;
      const hot = cur && c && val === topMin[c] && !fin;
      w.bar.style.background = lead ? N.mint : hot ? N.coral : isFinal && j < 3 ? N.sun : "rgba(237,230,209,.5)";
      w.name.style.color = lead ? N.mint : N.paper;
      w.plate.style.background = `rgba(124,240,196,${lead ? 0.12 : 0})`;
    });
    op(hCat, win(t, CUE.race[0] + 0.4, CUE.finalLabel, 0.3, 0.2));
    op(hBar, win(t, CUE.race[0] + 0.4, T.s6, 0.3, 0.2));
    op(hTot, win(t, CUE.race[0] + 0.4, T.s6, 0.3, 0.2));
    hTot.textContent = fin ? "eindscore" : "tussenstand";
    hBar.textContent = fin ? "" : "gewogen gemiddelde →";
  });
})();
