/* ═════════════ 2 · DE KANDIDATEN (16–32 s): heel Europa rijst op; drie vallen af ═════════════ */
(function () {
  const L = el("div", { class: "L", style: `color:${D.ink};--hlc:${D.mint}` }, sceneRoot);
  const box = () => el("div", { class: "a", style: "left:140px;top:120px;width:600px;white-space:normal" }, L);
  const A = box(), B = box(), Cc = box();
  B.style.setProperty("--hlc", D.coral);
  el("div", { class: "kick", style: `color:${D.mint}` }, A, "De kandidaten");
  const aw = words(el("div", { class: "serif", style: "font-size:64px;line-height:1.05;margin-top:18px" }, A), "Heel Europa *doet mee.*");
  el("div", { class: "kick", style: `color:${D.coral}` }, B, "Alle reizen afgeraden");
  const bw = words(el("div", { class: "serif", style: "font-size:54px;line-height:1.08;margin-top:18px" }, B),
    KO.length ? `${numWord(KO.length)} vallen af: *${lijst(KO.map((c) => c.name))}.*` : "Niemand valt af.");
  el("div", { class: "mono", style: `font-size:24px;margin-top:16px;color:${D.sub};line-height:1.5` }, B, KO.length ? "Een negatief reisadvies is een knock-out, geen minpunt. Ze staan op de kaart, maar doen niet mee aan de race." : "");
  el("div", { class: "kick", style: `color:${D.mint}` }, Cc, "In de race");
  const big = el("div", { class: "disp", style: `font-size:220px;line-height:.9;margin-top:10px;color:${D.ink}` }, Cc, String(ELIG.length));
  const cw = words(el("div", { class: "serif", style: "font-size:54px;line-height:1.08;margin-top:10px" }, Cc), `landen, *${numWord(V.length).toLowerCase()} vragen* per land.`);
  renders.push((t) => {
    const on = t >= T.s2 - 0.1 && t < T.s3 + 0.1;
    op(L, on ? 1 : 0);
    if (!on) return;
    inout(A, t, T.s2 + 0.5, CUE.drop - 0.3, 0.6, 16); revealWords(aw, t, T.s2 + 0.5, 0.14, 0.7);
    inout(B, t, CUE.drop, CUE.count - 0.3, 0.6, 16); revealWords(bw, t, CUE.drop, 0.12, 0.7);
    inout(Cc, t, CUE.count, T.s3 - 0.2, 0.6, 16); revealWords(cw, t, CUE.count + 0.4, 0.12, 0.7);
    const n = E.out(seg(t, CUE.count, CUE.count + 1.2));
    big.textContent = String(Math.round(n * ELIG.length));
  });
})();
