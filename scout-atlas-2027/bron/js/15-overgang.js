/* ═════════════ OVERGANGEN: hoofdstukkaarten (kleurvlak + cirkelwipe), witte flits ═════════════ */
const CARD_DUR = 3 * BEAT; // een hoofdstukkaart duurt 3 tellen
function buildOvergangen() {
  const cards = [
    { t: T.s1, n: 1, title: "De meetlat", sub: `${V.length} vragen · ${CATS.length} categorieën`, bg: COL.mint, ink: "#04110d", from: [1500, 540] },
    { t: T.s2, n: 2, title: "Het landschap", sub: `${nl(M.nScores, 0)} scores in één beeld`, bg: "#e9e2cf", ink: "#071113", from: [420, 540] },
    { t: T.s3, n: 3, title: `${CC.length} → 1`, sub: "De afvaltocht", bg: COL.gold, ink: "#140d02", from: [960, 900] },
    { t: T.s4, n: 4, title: `Waarom ${WIN.name}?`, sub: "Wat de winnaar draagt", bg: COL.mint, ink: "#04110d", from: [1500, 300] },
    { t: T.s5, n: 5, title: "Eerlijk is eerlijk", sub: "Versie 1", bg: "#e9e2cf", ink: "#071113", from: [960, 540] },
  ];
  const L = el("div", { class: "L" }, stage);
  cards.forEach((c) => {
    const f = el("div", { class: "L", style: `background:${c.bg};color:${c.ink};overflow:hidden` }, L);
    // zachte gloed in het vlak (zoals de oranje vlakken in de referentie)
    el("div", { class: "L", style: `background:radial-gradient(ellipse 60% 55% at 50% 45%, rgba(255,255,255,.28), rgba(255,255,255,0) 70%)` }, f);
    const rowsBg = [0, 1, 2, 3].map((i) => {
      const r = el("div", { class: "a disp", style: `left:0;top:${70 + i * 250}px;font-size:250px;color:transparent;-webkit-text-stroke:1.6px ${c.ink};opacity:.13;letter-spacing:.02em` }, f,
        Array(6).fill(c.title.toUpperCase()).join(" · "));
      return r;
    });
    const kick = el("div", { class: "a kick", style: `left:0;width:1920px;text-align:center;top:372px;font-size:18px;color:${c.ink};opacity:.75` }, f,
      `Hoofdstuk ${c.n} / ${CHAPTERS.length - 1}`);
    const ttl = el("div", { class: "a disp", style: `left:0;width:1920px;text-align:center;top:420px;font-size:${c.title.length > 16 ? 168 : 210}px;color:${c.ink}` }, f);
    const letters = [...c.title].map((ch) => el("span", { style: "display:inline-block;white-space:pre" }, ttl, ch === " " ? " " : ch));
    const sub = el("div", { class: "a it", style: `left:0;width:1920px;text-align:center;top:${c.title.length > 16 ? 600 : 636}px;font-size:46px;color:${c.ink}` }, f, c.sub);
    const line = el("div", { class: "a", style: `left:760px;width:400px;top:${c.title.length > 16 ? 586 : 622}px;height:2px;background:${c.ink};opacity:.5;transform-origin:50% 50%` }, f);
    c.els = { f, rowsBg, kick, ttl, letters, sub, line };
  });
  // witte flits (voor de winnaar)
  const flash = el("div", { class: "L", style: "background:radial-gradient(circle at 50% 50%, #fffdf6 0%, #fff6dc 40%, #f2c374 100%)" }, stage);
  renders.push((t) => {
    cards.forEach((c) => {
      const lt = t - c.t, { f, rowsBg, kick, letters, sub, line } = c.els;
      if (lt < -0.05 || lt > CARD_DUR + 0.05) { op(f, 0); return; }
      op(f, 1);
      // in: cirkel groeit vanuit een punt; uit: het vlak krimpt tot een gat in het midden
      const pin = E.inOut(seg(lt, 0, 0.42)), pout = E.in2(seg(lt, CARD_DUR - 0.5, CARD_DUR));
      const R = 2300;
      if (pout <= 0) f.style.clipPath = `circle(${pin * R}px at ${c.from[0]}px ${c.from[1]}px)`;
      else f.style.clipPath = `polygon(evenodd, 0 0, 1920px 0, 1920px 1080px, 0 1080px, 0 0, ${circlePoly(960, 540, pout * R)})`;
      rowsBg.forEach((r, i) => (r.style.transform = `translateX(${(i % 2 ? -1 : 1) * (lt * 160) - 600}px)`));
      letters.forEach((s, i) => {
        const p = E.out5(seg(lt, 0.16 + i * 0.03, 0.62 + i * 0.03));
        s.style.transform = `translateX(${(1 - p) * 220}px) skewX(${(1 - p) * -18}deg) scaleX(${1 + (1 - p) * 0.6})`;
        s.style.opacity = p; s.style.filter = p < 0.98 ? `blur(${(1 - p) * 14}px)` : "";
      });
      set(kick, E.out(seg(lt, 0.3, 0.8)) * 0.75, 0, (1 - E.out(seg(lt, 0.3, 0.8))) * 12);
      set(sub, E.out(seg(lt, 0.7, 1.2)), 0, (1 - E.out(seg(lt, 0.7, 1.2))) * 16, 1, 0, (1 - E.out(seg(lt, 0.7, 1.2))) * 8);
      line.style.transform = `scaleX(${E.out5(seg(lt, 0.55, 1.3))})`;
    });
    const fl = t - T.flash;
    op(flash, fl >= -0.12 && fl < 2 ? (fl < 0 ? E.in(seg(fl, -0.12, 0)) : 1 - E.out(seg(fl, 0.05, 1.6))) : 0);
  });
}
// een cirkel als polygoon (voor het "gat" bij het uitwipen; clip-path kent geen ring)
function circlePoly(cx, cy, r) {
  const pts = [];
  for (let i = 0; i <= 48; i++) { const a = (i / 48) * Math.PI * 2; pts.push(`${(cx + Math.cos(a) * r).toFixed(1)}px ${(cy + Math.sin(a) * r).toFixed(1)}px`); }
  return pts.join(", ");
}
