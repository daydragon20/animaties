/* ═════════════ 3 · DE KANDIDATEN (38–50 s): 3D-diorama van Europa ═════════════ */
(function () {
  const t0 = T.s3;
  const L = el("div", { class: "L", style: `color:${D.ink};--hlc:${D.mint}` }, sceneRoot);
  el("div", { class: "L", style: "background:linear-gradient(180deg, rgba(239,231,212,.97) 0%, rgba(239,231,212,.75) 20%, rgba(239,231,212,0) 36%)" }, L);
  const kick = el("div", { class: "a kick", style: `left:140px;top:116px;color:${D.mint}` }, L, "De kandidaten");
  const head = (txt) => el("div", { class: "a serif", style: "left:140px;top:150px;font-size:92px;line-height:1.0" }, L);
  const hA = head(), wA = words(hA, `*${CC.length}* landen op de kaart.`);
  const hB = head(), wB = words(hB, "*Tien* springen eruit.");
  const subB = el("div", { class: "a serif", style: `left:140px;top:960px;font-size:46px;color:${D.ink}` }, L, "De tien met de hoogste eindscore.");
  renders.push((t) => {
    const lt = t - t0;
    const o = win(t, t0 - 0.05, T.s4, 0.01, 0.5);
    op(L, o);
    if (o <= 0) return;
    inout(kick, lt, 0.2, 11.4, 0.5, 10);
    set(hA, 1 - E.in(seg(lt, 8.0, 8.4)), 0, -E.in(seg(lt, 8.0, 8.4)) * 30); revealWords(wA, lt, 0.4, 0.12, 0.5);
    set(hB, 1); revealWords(wB, lt, 8.6, 0.12, 0.5);
    inout(subB, lt, 9.6, 11.6, 0.5, 14);
  });
})();
