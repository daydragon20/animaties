/* ═════════════ 1 · HET KAMP (0–16 s): één tent, dan de wereld, dan de zon ═════════════ */
(function () {
  const L = el("div", { class: "L", style: `--hlc:${N.sun}` }, sceneRoot);
  const shade = el("div", { class: "L", style: "background:linear-gradient(90deg, rgba(4,9,11,.55) 0%, rgba(4,9,11,.3) 40%, rgba(4,9,11,0) 60%)" }, L);
  const box = () => el("div", { class: "a", style: "left:140px;top:300px;width:900px;white-space:normal" }, L);
  const A = box(), B = box(), Cc = box(), Dd = box();
  el("div", { class: "kick", style: `color:${N.mint}` }, A, `Verkenners · zomer ${YEAR}`);
  const aw = words(el("div", { class: "serif", style: "font-size:84px;line-height:1.05;margin-top:22px;color:#efe9da" }, A), "Ergens staat *een tent.*");
  el("div", { class: "kick", style: `color:${N.mint}` }, B, "Tien dagen · tien tot vijftien verkenners");
  const bw = words(el("div", { class: "serif", style: "font-size:84px;line-height:1.05;margin-top:22px;color:#efe9da" }, B), "Eén kamp. *Ergens in Europa.*");
  const cKick = el("div", { class: "kick", style: `color:${N.sun}` }, Cc, "De vraag");
  const cHead = el("div", { class: "disp", style: "font-size:200px;line-height:.9;margin-top:18px;color:#efe9da" }, Cc);
  const cw = words(cHead, "Welk *land?*");
  el("div", { class: "kick", style: `color:${D.mint}` }, Dd, "Het antwoord");
  const dw = words(el("div", { class: "serif", style: `font-size:68px;line-height:1.08;margin-top:22px;color:${D.ink}` }, Dd),
    `*${CC.length}* landen. *${V.length}* vragen. *${NR}* rondes onderzoek.`);
  renders.push((t) => {
    const on = t < T.s2 + 0.2;
    op(L, on ? 1 : 0);
    if (!on) return;
    const l = lightAt(t);
    op(shade, (1 - l) * E.out(seg(t, CUE.hook[0] - 0.4, CUE.hook[0] + 0.8)));
    inout(A, t, CUE.hook[0], CUE.hook[1] - 0.2, 0.6, 16); revealWords(aw, t, CUE.hook[0], 0.14, 0.7);
    inout(B, t, CUE.hook[1], CUE.hook[2] - 0.3, 0.6, 16); revealWords(bw, t, CUE.hook[1], 0.12, 0.7);
    inout(Cc, t, CUE.hook[2], CUE.push - 0.2, 0.6, 20); revealWords(cw, t, CUE.hook[2], 0.2, 0.8);
    // de vraag verschijnt terwijl de zon opkomt: de kleuren schuiven mee van nacht naar dag
    cHead.style.color = hexLerp(N.paper, D.ink, l); cKick.style.color = hexLerp(N.sun, D.ochre, l); Cc.style.setProperty("--hlc", hexLerp(N.sun, D.mint, l));
    inout(Dd, t, CUE.push + 0.2, T.s2 + 0.1, 0.6, 16); revealWords(dw, t, CUE.push + 0.2, 0.1, 0.6);
    Dd.style.setProperty("--hlc", D.mint);
  });
})();
