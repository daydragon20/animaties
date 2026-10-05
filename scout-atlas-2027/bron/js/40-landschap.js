/* ═════════════ 2 · HET LANDSCHAP — 25 × 188 scores als een veld van kubussen ═════════════ */
// donkerder schaal voor het landschap (anders wordt het één felle massa): 60 → 100
const terrCol = (s) => { const p = clamp((s - 60) / 40) * 6; const i = Math.min(5, Math.floor(p)); return hexLerp(RAMP[i], RAMP[i + 1], p - i); };
const LS = { grow: T.s2 + CARD_DUR, a: T.s2 + 3.0, b: T.s2 + 6.75, peaks: T.s2 + 9.0, sort: T.s2 + 11.25, sortEnd: T.s2 + 14.25, end: T.s3 };
const TERRAIN = GL.add((() => {
  const scene = new THREE.Scene();
  scene.background = col(COL.night);
  scene.fog = new THREE.Fog(col(COL.night), 50, 190);
  const cam = new THREE.PerspectiveCamera(36, 16 / 9, 0.5, 600);
  scene.add(new THREE.HemisphereLight(0xcfeee4, 0x0a1514, 0.42));
  const sun = new THREE.DirectionalLight(0xffe2b8, 0.95); sun.position.set(-40, 60, 30); scene.add(sun);
  const back = new THREE.DirectionalLight(0x7cf0c4, 0.5); back.position.set(30, 20, -80); scene.add(back);
  // z-positie per vraag: groepjes per categorie met een open strook ertussen
  const GAP = 2.2, SX = 1.25;
  const zOf = [];
  let z = 0, prev = null;
  V.forEach((v) => { if (prev !== null && v.ci !== prev) z += GAP; zOf.push(-z); z += 1; prev = v.ci; });
  const depth = z;
  const catZ = CATS.map((c) => { const zs = V.filter((v) => v.category === c).map((v) => zOf[v.i]); return (Math.max(...zs) + Math.min(...zs)) / 2; });
  // beginvolgorde alfabetisch, eindvolgorde = rang
  const alpha = [...CC].sort((a, b) => a.name.localeCompare(b.name, "nl"));
  const xA = {}, xB = {};
  alpha.forEach((c, i) => (xA[c.name] = (i - (CC.length - 1) / 2) * SX));
  CC.forEach((c, i) => (xB[c.name] = (i - (CC.length - 1) / 2) * SX));
  const N = M.nScores;
  const geo = new THREE.BoxGeometry(0.86, 1, 0.8); geo.translate(0, 0.5, 0);
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.08, emissive: col("#ffffff"), emissiveIntensity: 0.0 });
  // per-instantie emissie via de kleur: we gebruiken twee meshes (gewoon en "100") voor de gouden pieken
  const inst = new THREE.InstancedMesh(geo, mat, N);
  const gold = new THREE.MeshStandardMaterial({ color: col(COL.gold), roughness: 0.35, metalness: 0.2, emissive: col(COL.gold), emissiveIntensity: 0.4 });
  const n100 = CC.reduce((a, c) => a + c.scores.filter((s) => s === 100).length, 0);
  const inst100 = new THREE.InstancedMesh(geo, gold, n100);
  scene.add(inst, inst100);
  const cells = [];
  let k = 0, k100 = 0;
  CC.forEach((c, j) => V.forEach((v, i) => {
    const s = c.scores[i];
    const h = Math.max(0.2, (s - 40) * 0.11);
    const is100 = s === 100;
    const cell = { c, i, s, h, z: zOf[i], is100, idx: is100 ? k100++ : k++, delay: (-zOf[i] / depth) * 1.8 + (j % 5) * 0.03 };
    if (!is100) inst.setColorAt(cell.idx, col(terrCol(s)));
    cells.push(cell);
  }));
  inst.instanceColor.needsUpdate = true;
  const dummy = new THREE.Object3D();
  // grondplaat met fijne lijnen
  const grid = new THREE.GridHelper(260, 130, 0x1a3b36, 0x10231f);
  grid.position.set(0, -0.01, -depth / 2); scene.add(grid);
  function update(t) {
    const grow = t - LS.grow;
    const sp = (j) => E.inOut(seg(t, LS.sort + j * 0.06, LS.sort + 1.4 + j * 0.06));
    const rankOf = {}; CC.forEach((c, i) => (rankOf[c.name] = i));
    cells.forEach((cl) => {
      const g = E.out5(seg(grow, cl.delay, cl.delay + 1.2));
      const wave = Math.sin(t * 1.6 - cl.z * 0.12 + rankOf[cl.c.name] * 0.4) * 0.05 * g;
      const x = lerp(xA[cl.c.name], xB[cl.c.name], sp(rankOf[cl.c.name]));
      dummy.position.set(x, 0, cl.z);
      dummy.scale.set(1, Math.max(0.001, cl.h * g * (1 + wave)), 1);
      dummy.updateMatrix();
      (cl.is100 ? inst100 : inst).setMatrixAt(cl.idx, dummy.matrix);
    });
    inst.instanceMatrix.needsUpdate = true; inst100.instanceMatrix.needsUpdate = true;
    const pk = seg(t, LS.peaks, LS.peaks + 0.8);
    gold.emissiveIntensity = 0.25 + 0.9 * E.out(pk) * (0.7 + 0.3 * Math.sin(t * 5));
    // camera: hoog boven het verre einde → laag langs de voorkant → schuin overzicht
    const p1 = E.inOut2(seg(t, LS.grow, LS.b)), p2 = E.inOut2(seg(t, LS.b, LS.sort)), p3 = E.inOut2(seg(t, LS.sort - 0.5, LS.end));
    let tgt = lerp3([0, 0, -depth * 0.7], [0, 0, -depth * 0.3], p1);
    tgt = lerp3(tgt, [lerp(-4, 4, p2), 0, -depth * 0.26], p2);
    tgt = lerp3(tgt, [0, 0, -depth * 0.2], p3);
    let dist = lerp(lerp(170, 70, p1), 62, p2); dist = lerp(dist, 74, p3);
    let el_ = lerp(lerp(55, 24, p1), 21, p2); el_ = lerp(el_, 30, p3);
    let az = lerp(lerp(-34, -14, p1), 10, p2); az = lerp(az, 0, p3);
    aimCam(cam, tgt, dist, el_, az);
    cam.updateProjectionMatrix();
    HUD.tag = `${nl(N, 0)} SCORES`;
  }
  const vis = (t) => (t >= LS.grow - 0.1 && t < LS.end ? E.inOut(seg(t, LS.grow - 0.1, LS.grow + 0.8)) : 0);
  return { scene, cam, update, vis, xA, xB, catZ, depth, post: () => ({ bloom: 0.8, th: 0.6 }) };
})());

(function () {
  const L = el("div", { class: "L" }, sceneRootEl);
  const box = (top) => el("div", { class: "a", style: `left:150px;top:${top}px;width:760px;white-space:normal` }, L);
  const A = box(150), B = box(150);
  el("div", { class: "kick", style: `color:${COL.mint}` }, A, "Lezen zoals een kaart");
  const ah = el("div", { class: "serif", style: "font-size:64px;line-height:1.05;margin-top:16px" }, A);
  const aw = words(ah, "Elke kubus is *één score.*");
  const ah2 = el("div", { class: "serif", style: "font-size:64px;line-height:1.05" }, A);
  const aw2 = words(ah2, "Elke rij is *één land.*");
  el("div", { class: "kick", style: `color:${COL.gold}` }, B, "Pieken en dalen");
  const bh = el("div", { class: "serif", style: "font-size:64px;line-height:1.05;margin-top:16px" }, B);
  const bw = words(bh, "Samen vormen ze *een landschap.*");
  const n100 = CC.reduce((a, c) => a + c.scores.filter((s) => s === 100).length, 0);
  const lo = CC.flatMap((c) => c.scores.map((s, i) => ({ s, c, v: V[i] }))).reduce((a, b) => (b.s < a.s ? b : a));
  const bn = el("div", { class: "mono", style: `font-size:19px;color:${COL.soft};margin-top:24px;line-height:1.7` }, B,
    `<span style="color:${COL.gold}">■</span> ${n100} keer een perfecte 100 &nbsp;·&nbsp; laagste: ${nl(lo.s, 1)} (${lo.c.name}, ${escapeHtml(lo.v.name.toLowerCase())})`);
  const C = el("div", { class: "a", style: "left:0;width:1920px;text-align:center;top:118px" }, L);
  el("div", { class: "kick", style: `color:${COL.mint}` }, C, "Gesorteerd op eindscore");
  const ch = el("div", { class: "serif", style: "font-size:56px;margin-top:14px" }, C);
  const cw = words(ch, "Van *beste* links naar laatste rechts.");
  // landlabels aan de voorkant
  const labs = CC.map((c) => {
    const e = el("div", { class: "a mono", style: "left:0;top:0;font-size:15px;transform-origin:0 50%" }, labLayer);
    e.textContent = c.name;
    return { c, e };
  });
  const catLabs = CATS.map((c, i) => {
    const e = el("div", { class: "a mono", style: `left:0;top:0;font-size:14px;color:${COL.muted};letter-spacing:.06em;text-transform:uppercase` }, labLayer, short(c));
    return { c, e, i };
  });
  renders.push((t) => {
    const on = t >= T.s2 && t < T.s3 + 0.1;
    op(L, on ? 1 : 0);
    labs.forEach((l) => op(l.e, 0)); catLabs.forEach((l) => op(l.e, 0));
    if (!on) return;
    inout(A, t, LS.a, LS.b - 0.2, 0.9, 16, 0.6); revealWords(aw, t, LS.a, 0.13, 1.0); revealWords(aw2, t, LS.a + 1.3, 0.13, 1.0);
    inout(B, t, LS.b, LS.sort - 0.2, 0.9, 16, 0.6); revealWords(bw, t, LS.b, 0.13, 1.0);
    inout(C, t, LS.sort + 0.4, LS.end - 0.3, 0.9, 16, 0.5); revealWords(cw, t, LS.sort + 0.4, 0.12, 1.0);
    const vis = TERRAIN.vis(t);
    if (vis <= 0) return;
    const sp = (j) => E.inOut(seg(t, LS.sort + j * 0.06, LS.sort + 1.4 + j * 0.06));
    const lo_ = E.out(seg(t, LS.b + 1.0, LS.b + 2.0)) * (1 - E.inOut(seg(t, LS.end - 0.5, LS.end)));
    labs.forEach((l, j) => {
      const x = lerp(TERRAIN.xA[l.c.name], TERRAIN.xB[l.c.name], sp(j));
      const [px, py, ok] = project(TERRAIN.cam, x, 0, 1.6);
      if (!ok) return;
      op(l.e, lo_ * vis);
      l.e.style.transform = `translate(${px}px,${py + 12}px) rotate(48deg)`;
      const done = sp(j) > 0.98;
      l.e.innerHTML = (done ? `<span style="color:${j === 0 ? COL.gold : COL.mint}">${j + 1}</span> ` : "") + escapeHtml(l.c.name);
      l.e.style.color = j === 0 && done ? COL.gold : COL.paper;
    });
    const co = E.out(seg(t, LS.sort + 0.6, LS.sort + 1.6)) * (1 - E.inOut(seg(t, LS.end - 0.5, LS.end)));
    catLabs.forEach((l) => {
      const [px, py, ok] = project(TERRAIN.cam, (-(CC.length - 1) / 2) * 1.25 - 1.4, 0, TERRAIN.catZ[l.i]);
      if (!ok) return;
      op(l.e, co * vis);
      l.e.style.transform = `translate(${px}px,${py}px) translate(-100%,-50%)`;
    });
  });
})();
