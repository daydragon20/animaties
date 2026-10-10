/* ═════════════ HET LANDSCHAP (hoofdstuk 4): alle scores als een veld van kubussen ═════════════ */
const terrCol = (s) => { const p = clamp(s / 100) * 6; const i = Math.min(5, Math.floor(p)); return hexLerp(RAMP[i], RAMP[i + 1], p - i); };
const LS = CUE.ls;
const TERRAIN = (() => {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(col("#071519"), 60, 210);
  const cam = new THREE.PerspectiveCamera(36, 16 / 9, 0.5, 600);
  scene.add(new THREE.HemisphereLight(0xcfeee4, 0x0a1514, 0.42));
  const sun = new THREE.DirectionalLight(0xffe2b8, 0.95); sun.position.set(-40, 60, 30); scene.add(sun);
  const back = new THREE.DirectionalLight(0x7cf0c4, 0.5); back.position.set(30, 20, -80); scene.add(back);
  // z-positie per variabele: groepjes per categorie met een open strook ertussen; tiers verder uit elkaar
  const GAP = 1.6, TGAP = 3.0, SX = 1.25;
  const zOf = [];
  let z = 0, prevC = null, prevT = null;
  const Vs = [...V].sort((a, b) => a.tier - b.tier || M.byWeight.indexOf(a.categorie) - M.byWeight.indexOf(b.categorie) || a.i - b.i);
  Vs.forEach((v) => { if (prevC !== null && v.categorie !== prevC) z += v.tier !== prevT ? TGAP : GAP; zOf[v.i] = -z; z += 1; prevC = v.categorie; prevT = v.tier; });
  const depth = z;
  const ROWS = ELIG;
  const alpha = [...ROWS].sort((a, b) => a.name.localeCompare(b.name, "nl"));
  const xA = {}, xB = {};
  alpha.forEach((c, i) => (xA[c.name] = (i - (ROWS.length - 1) / 2) * SX));
  ROWS.forEach((c, i) => (xB[c.name] = (i - (ROWS.length - 1) / 2) * SX));
  const N_ = ROWS.length * V.length;
  const geo = new THREE.BoxGeometry(0.86, 1, 0.8); geo.translate(0, 0.5, 0);
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.08 });
  const inst = new THREE.InstancedMesh(geo, mat, N_);
  const gold = new THREE.MeshStandardMaterial({ color: col(COL.gold), roughness: 0.35, metalness: 0.2, emissive: col(COL.gold), emissiveIntensity: 0.4 });
  const n100 = ROWS.reduce((a, c) => a + c.scores.filter((s) => s === 100).length, 0);
  const inst100 = new THREE.InstancedMesh(geo, gold, Math.max(1, n100));
  scene.add(inst, inst100);
  const cells = [];
  let k = 0, k100 = 0;
  ROWS.forEach((c, j) => V.forEach((v, i) => {
    const s = c.scores[i] == null ? 0 : c.scores[i];
    const h = Math.max(0.15, s * 0.075);
    const is100 = s === 100;
    const cell = { c, i, s, h, z: zOf[i], is100, idx: is100 ? k100++ : k++, delay: (-zOf[i] / depth) * 1.8 + (j % 5) * 0.03 };
    if (!is100) inst.setColorAt(cell.idx, col(terrCol(s)));
    cells.push(cell);
  }));
  inst.instanceColor.needsUpdate = true;
  const dummy = new THREE.Object3D();
  const grid = new THREE.GridHelper(260, 130, 0x1a3b36, 0x10231f);
  grid.position.set(0, -0.01, -depth / 2); scene.add(grid);
  function update(t) {
    const grow = t - LS.grow;
    const sp = (j) => E.inOut(seg(t, LS.sort + j * 0.05, LS.sort + 1.4 + j * 0.05));
    const topP = E.inOut(seg(t, LS.top, LS.top + 0.8));
    const rankOf = {}; ROWS.forEach((c, i) => (rankOf[c.name] = i));
    cells.forEach((cl) => {
      const g = E.out5(seg(grow, cl.delay, cl.delay + 1.2));
      const wave = Math.sin(t * 1.6 - cl.z * 0.12 + rankOf[cl.c.name] * 0.4) * 0.05 * g;
      const x = lerp(xA[cl.c.name], xB[cl.c.name], sp(rankOf[cl.c.name]));
      const dim = rankOf[cl.c.name] >= 10 ? 1 - 0.55 * topP : 1;
      dummy.position.set(x, 0, cl.z);
      dummy.scale.set(1, Math.max(0.001, cl.h * g * (1 + wave) * dim), 1);
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
    let dist = lerp(lerp(118, 70, p1), 62, p2); dist = lerp(dist, 50, p3);
    let el_ = lerp(lerp(40, 24, p1), 21, p2); el_ = lerp(el_, 44, p3);
    let az = lerp(lerp(-26, -14, p1), 10, p2); az = lerp(az, 0, p3);
    aimCam(cam, tgt, dist, el_, az);
    cam.setViewOffset(1920, 1080, 0, 150 * p3, 1920, 1080);
    cam.updateProjectionMatrix();
  }
  const vis = (t) => (t >= T.s4 - 0.1 && t < T.s5 + 0.05 ? E.inOut(seg(t, T.s4 - 0.1, T.s4 + 0.8)) * (1 - E.inOut(seg(t, LS.end - 0.5, LS.end))) : 0);
  return { scene, cam, update, vis, xA, xB, depth, ROWS, n100 };
})();
GL.add(TERRAIN);
