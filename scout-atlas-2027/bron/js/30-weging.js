/* ═════════════ 2 · DE WEGING (12–38 s): 188 vragen, niet elke vraag weegt even zwaar ═════════════ */
(function () {
  const t0 = T.s2;
  const L = el("div", { class: "L", style: `color:${D.ink};--hlc:${D.mint}` }, sceneRoot);
  const svg = sv("svg", { width: 1920, height: 1080, style: "position:absolute;left:0;top:0;overflow:visible" }, L);
  const kick = el("div", { class: "a kick", style: `left:140px;top:132px;color:${D.mint}` }, L, "Hoe kies je eerlijk?");
  const big = el("div", { class: "a disp", style: `left:128px;top:228px;font-size:300px;color:${D.ink};transform-origin:0 70%` }, L, String(V.length));
  const bigLab = el("div", { class: "a serif", style: `left:146px;top:512px;font-size:84px;color:${D.mint}` }, L, "vragen per land");
  const bigSub = el("div", { class: "a mono", style: `left:146px;top:632px;font-size:36px;color:${D.sub}` }, L, `verdeeld over ${CATS.length} categorieën`);
  const txt = (size, w = 700) => el("div", { class: "a serif", style: `left:140px;top:220px;font-size:${size}px;line-height:1.06;white-space:normal;width:${w}px` }, L);
  const hA = txt(84), wA = words(hA, "Niet elke vraag weegt even zwaar.");
  const hB = txt(84), wB = words(hB, "Het zwaarste zit *onderaan.*");
  const hC = txt(70), wC = words(hC, "*Veilig,* *avontuurlijk* en goed *kamperen:* dát weegt.");
  const hlSum = PACK.HL.reduce((s, c) => s + M.catShare[c], 0);
  const sumLine = el("div", { class: "a mono", style: `left:146px;top:520px;font-size:32px;font-weight:600;color:${D.mint}` }, L, `Samen ${nl(hlSum, 0)} % van de eindscore`);
  const subC = el("div", { class: "a serif", style: `left:140px;top:618px;font-size:46px;line-height:1.15;white-space:normal;width:720px;color:${D.ochre}` }, L,
    "Een mooi uitzicht telt ook mee. Alleen lichter.");
  const note = el("div", { class: "a mono", style: `left:146px;top:790px;font-size:34px;font-weight:600;line-height:1.4;white-space:normal;width:720px;color:${D.coral}` }, L,
    `En wat het kost?<br>Dat weegt ook stevig: ${nl(M.catShare[PACK.COST], 0)} %.`);

  /* — de 188 tegels: elke vraag een tegel, de grootte is het gewicht — */
  const tilesG = sv("g", {}, svg);
  const maxW = heaviest.weight;
  const cols = 17, cell = 54, gx = 870, gy = 210, rowsN = Math.ceil(V.length / cols);
  const rnd = mulberry32(7);
  const layerOf = (v) => byWeight.indexOf(v.category);
  const tiles = V.map((v, i) => ({ v, r: sv("rect", { rx: 3 }, tilesG), gx: gx + (i % cols) * cell + cell / 2, gy: gy + Math.floor(i / cols) * cell + cell / 2, delay: rnd(), jx: rnd(), jy: rnd(), li: layerOf(v) }));
  const callG = sv("g", {}, svg);
  function callout(v, up, color) {
    const tile = tiles.find((x) => x.v === v);
    const g = sv("g", {}, callG);
    sv("circle", { cx: tile.gx, cy: tile.gy, r: 36, fill: "none", stroke: color, "stroke-width": 3.5 }, g);
    const ly = up ? gy - 74 : gy + rowsN * cell + 24;
    sv("line", { x1: tile.gx, y1: tile.gy + (up ? -36 : 36), x2: tile.gx, y2: up ? ly + 8 : ly - 38, stroke: color, "stroke-width": 3 }, g);
    const left = tile.gx > 1500, ax = left ? "end" : "start";
    const y1 = up ? ly - 36 : ly + 10, y2 = y1 + 36;
    const o = { "text-anchor": ax, "paint-order": "stroke", stroke: D.bg, "stroke-width": 8, "stroke-linejoin": "round" };
    sv("text", { x: tile.gx + (left ? 24 : -24), y: y1, "font-size": 31, "font-weight": 600, fill: D.ink, ...o }, g, v.name);
    sv("text", { x: tile.gx + (left ? 24 : -24), y: y2, "font-size": 29, "font-weight": 600, fill: color, ...o }, g, `weegt ${nl(v.weight, 2)} % van de eindscore`);
    return g;
  }
  const callHeavy = callout(heaviest, true, D.mint);
  const callLight = callout(lightest, false, D.coral);

  /* — labels naast de rugzak: elke laag een categorie met zijn aandeel — */
  const labG = sv("g", {}, svg);
  const ly = PACK.screen.map((p) => p[1]);
  for (let i = 1; i < ly.length; i++) if (ly[i - 1] - ly[i] < 44) ly[i] = ly[i - 1] - 44;
  const edge = PACK.cx + PACK.side + 30, lx = edge + 56;
  const labs = PACK.layers.map((l, i) => {
    const g = sv("g", {}, labG);
    sv("path", { d: `M${edge} ${PACK.screen[i][1]} L${edge + 22} ${PACK.screen[i][1]} L${lx - 12} ${ly[i]} L${lx - 2} ${ly[i]}`, stroke: "rgba(16,38,44,.5)", "stroke-width": 2, fill: "none" }, g);
    const tx = sv("text", { x: lx + 6, y: ly[i] + 10, "font-size": 30, "font-weight": 500, fill: D.ink }, g, short(l.c));
    const pc = sv("text", { x: 1884, y: ly[i] + 10, "font-size": 30, "font-weight": 600, "text-anchor": "end", fill: D.sub }, g, nl(M.catShare[l.c], 0) + " %");
    return { g, tx, pc, c: l.c };
  });
  svg.appendChild(tilesG);

  renders.push((t) => {
    const o = win(t, t0 - 0.1, T.s3, 0.01, 0.5);
    op(L, o);
    if (o <= 0) return;
    const lt = t - t0;
    L.style.transform = `scale(${1 + 0.015 * seg(lt, 0, 26)})`; L.style.transformOrigin = "960px 540px";
    inout(kick, lt, 0.1, 25.4, 0.5, 12);
    { const pi = E.back(seg(t, CUE.countA, CUE.countA + 0.5)), po = E.in(seg(lt, 4.2, 4.6)); set(big, clamp(pi * 3) * (1 - po), 0, -po * 40, lerp(1.6, 1, clamp(pi))); }
    inout(bigLab, lt, 1.2, 4.6, 0.5, 24);
    inout(bigSub, lt, 2.0, 4.6, 0.5, 18);
    set(hA, 1 - E.in(seg(lt, 9.0, 9.5)), 0, -E.in(seg(lt, 9.0, 9.5)) * 30); revealWords(wA, lt, 4.8, 0.12, 0.5);
    set(hB, 1 - E.in(seg(lt, 13.6, 14.2)), 0, -E.in(seg(lt, 13.6, 14.2)) * 30); revealWords(wB, lt, 9.8, 0.12, 0.5);
    set(hC, 1); revealWords(wC, lt, 14.8, 0.1, 0.5);
    inout(sumLine, lt, 17.0, 25.4, 0.5, 14);
    inout(subC, lt, 18.8, 25.4, 0.5, 16);
    inout(note, lt, 21.4, 25.4, 0.5, 16);
    const grow = E.inOut(seg(t, CUE.grow, CUE.grow + 0.8));
    tiles.forEach((k) => {
      const appear = E.back(seg(lt, 0.3 + k.delay * 1.6, 0.6 + k.delay * 1.6));
      const wsize = Math.sqrt(k.v.weight / maxW) * 48;
      let size = lerp(30, wsize, grow) * appear;
      const ft = PACK.layerTimes[k.li] + k.delay * 0.3;
      const fly = E.inOut(seg(t, ft - 1.0, ft + 0.1));
      const px = PACK.cx + (k.jx - 0.5) * PACK.side * 1.5;
      const lay = PACK.layers[k.li];
      const ty = PACK.screen[k.li][1] + (k.jy - 0.5) * Math.max(4, lay.h * PACK.ppu * 0.7);
      const x = lerp(k.gx, px, fly), y = lerp(k.gy, ty, fly) - Math.sin(fly * Math.PI) * 140 * (0.4 + k.jx);
      size = lerp(size, 10, fly);
      k.r.setAttribute("x", x - size / 2); k.r.setAttribute("y", y - size / 2);
      k.r.setAttribute("width", Math.max(0, size)); k.r.setAttribute("height", Math.max(0, size));
      const heavy = k.v.weight / maxW;
      k.r.setAttribute("fill", grow > 0 ? (heavy > 0.9 ? D.mint : heavy > 0.45 ? "#5f8f80" : "#a9b8ae") : D.ink);
      k.r.style.opacity = (0.4 + 0.6 * clamp(appear)) * (1 - E.in(seg(t, ft + 0.05, ft + 0.5)));
    });
    op(callHeavy, win(lt, 6.2, 9.4, 0.4, 0.4));
    op(callLight, win(lt, 6.6, 9.4, 0.4, 0.4));
    const hl = E.inOut(seg(t, CUE.hl, CUE.hl + 0.5));
    const coral = E.inOut(seg(t, CUE.coral, CUE.coral + 0.5));
    labs.forEach((lb, i) => {
      const lo = E.out(seg(t, PACK.layerTimes[i] + 0.2, PACK.layerTimes[i] + 0.7));
      const isHL = PACK.HL.includes(lb.c), isScenic = lb.c === PACK.SCENIC, isCost = lb.c === PACK.COST && coral > 0.5;
      const on = isHL || isScenic || isCost;
      op(lb.g, lo * (on ? 1 : lerp(1, 0.62, hl)));
      const c = hl > 0.5 && on ? (isHL ? D.mint : isScenic ? D.ochre : D.coral) : D.ink;
      lb.tx.setAttribute("fill", c); lb.pc.setAttribute("fill", hl > 0.5 && on ? c : D.sub);
      lb.tx.setAttribute("font-weight", hl > 0.5 && on ? 700 : 500);
    });
  });
})();
