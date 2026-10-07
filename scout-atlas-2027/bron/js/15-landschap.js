/* ═════════════ HET LANDSCHAP (scène 4): alle scores als een veld van kubussen ═════════════ */
// donkerder schaal voor het landschap (anders wordt het één felle massa): 60 → 100
const terrCol = (s) => { const p = clamp((s - 60) / 40) * 6; const i = Math.min(5, Math.floor(p)); return hexLerp(RAMP[i], RAMP[i + 1], p - i); };
const LS = CUE.ls;
const TERRAIN = (() => {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(col("#071519"), 60, 210);
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
    const p1 = E.inOut2(seg(t, LS.grow, LS.b)), p2 = E.inOut2(seg(t, LS.b, LS.sort)), p3 = E.inOut2(seg(t, LS.sort - 0.5, LS.sort + 3.2));
    let tgt = lerp3([0, 0, -depth * 0.5], [0, 0, -depth * 0.3], p1);
    tgt = lerp3(tgt, [lerp(-4, 4, p2), 0, -depth * 0.26], p2);
    tgt = lerp3(tgt, [0, 0, -10], p3);
    let dist = lerp(lerp(118, 70, p1), 62, p2); dist = lerp(dist, 44, p3);
    let el_ = lerp(lerp(40, 24, p1), 21, p2); el_ = lerp(el_, 44, p3);
    let az = lerp(lerp(-26, -14, p1), 10, p2); az = lerp(az, 0, p3);
    aimCam(cam, tgt, dist, el_, az);
    cam.setViewOffset(1920, 1080, 0, 150 * p3, 1920, 1080); // in het overzicht schuift het veld omhoog, zodat de landnamen onderaan passen
    cam.updateProjectionMatrix();
  }
  const vis = (t) => (t >= T.s4 - 0.1 && t < T.s5 + 0.05 ? E.inOut(seg(t, T.s4 - 0.1, T.s4 + 0.8)) * (1 - E.inOut(seg(t, LS.end - 0.5, LS.end))) : 0);
  return { scene, cam, update, vis, xA, xB, catZ, depth };
})();
GL.add(TERRAIN);

(function () {
  const L = el("div", { class: "L", style: `--hlc:${COL.gold}` }, sceneRoot);
  const shadeL = el("div", { class: "L", style: "background:linear-gradient(90deg, rgba(4,9,11,.9) 0%, rgba(4,9,11,.62) 34%, rgba(4,9,11,0) 56%)" }, L);
  const shadeT = el("div", { class: "L", style: "background:linear-gradient(180deg, rgba(4,9,11,.92) 0%, rgba(4,9,11,.66) 22%, rgba(4,9,11,0) 38%)" }, L);
  const box = () => el("div", { class: "a", style: "left:140px;top:170px;width:820px;white-space:normal" }, L);
  const A = box(), B = box();
  el("div", { class: "kick", style: `color:${COL.mint}` }, A, "Lezen zoals een kaart");
  const ah = el("div", { class: "serif", style: "font-size:76px;line-height:1.05;margin-top:22px;color:#efe9da" }, A);
  const aw = words(ah, "Elke kubus is *één score.*");
  const ah2 = el("div", { class: "serif", style: "font-size:76px;line-height:1.05;color:#efe9da" }, A);
  const aw2 = words(ah2, "Elke rij is *één land.*");
  el("div", { class: "kick", style: `color:${COL.gold}` }, B, "Pieken en dalen");
  const bh = el("div", { class: "serif", style: "font-size:76px;line-height:1.05;margin-top:22px;color:#efe9da" }, B);
  const bw = words(bh, "Samen vormen ze *een landschap.*");
  const n100 = CC.reduce((a, c) => a + c.scores.filter((s) => s === 100).length, 0);
  const lo = CC.flatMap((c) => c.scores.map((s, i) => ({ s, c, v: V[i] }))).reduce((a, b) => (b.s < a.s ? b : a));
  const bn = el("div", { class: "mono", style: `font-size:28px;color:${COL.soft};margin-top:30px;line-height:1.55` }, B,
    `<span style="color:${COL.gold}">■</span> ${nl(n100, 0)} keer een perfecte 100<br>laagste score: ${nl(lo.s, 1)}<br><span style="font-size:26px;color:${COL.soft}">${escapeHtml(lo.c.name)} · ${escapeHtml(lo.v.name.toLowerCase())}</span>`);
  const Cc = el("div", { class: "a", style: "left:0;width:1920px;text-align:center;top:116px" }, L);
  el("div", { class: "kick", style: `color:${COL.mint}` }, Cc, "Gesorteerd op eindscore");
  const ch = el("div", { class: "serif", style: "font-size:68px;margin-top:16px;color:#efe9da" }, Cc);
  const cw = words(ch, "Van *beste* links naar laatste rechts.");
  // landlabels aan de voorkant
  const LABNAME = { "Bosnië en Herzegovina": "Bosnië-Herz.", "Noord-Macedonië": "N.-Macedonië" };
  const labs = CC.map((c) => {
    const e = el("div", { class: "a mono", style: "left:0;top:0;font-size:24px;font-weight:600;transform-origin:0 50%;text-shadow:0 1px 8px #000" }, labLayer);
    e.textContent = c.name;
    return { c, e };
  });
  renders.push((t) => {
    const on = t >= T.s4 - 0.1 && t < T.s5 + 0.1;
    op(L, on ? 1 : 0);
    labs.forEach((l) => op(l.e, 0));
    if (!on) return;
    op(shadeL, win(t, LS.a - 0.4, LS.sort, 0.8, 0.8)); op(shadeT, win(t, LS.sort - 0.4, LS.end, 0.8, 0.5));
    inout(A, t, LS.a, LS.b - 0.3, 0.6, 16); revealWords(aw, t, LS.a, 0.14, 0.7); revealWords(aw2, t, LS.a + 1.8, 0.14, 0.7);
    inout(B, t, LS.b, LS.sort + 0.1, 0.6, 16); revealWords(bw, t, LS.b, 0.14, 0.7);
    inout(Cc, t, LS.sort + 0.4, LS.end - 0.3, 0.6, 16); revealWords(cw, t, LS.sort + 0.4, 0.12, 0.7);
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
      l.e.innerHTML = (done ? `<span style="color:${j === 0 ? COL.gold : COL.mint}">${j + 1}</span> ` : "") + escapeHtml(LABNAME[l.c.name] || l.c.name);
      l.e.style.color = j === 0 && done ? COL.gold : COL.paper;
    });
  });
})();
