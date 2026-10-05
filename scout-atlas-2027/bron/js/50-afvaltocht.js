/* ═════════════ 3 · DE AFVALTOCHT — van 25 naar 1 op de kaart van Europa, dan het podium ═════════════ */
const AF = { map: T.s3 + CARD_DUR, start: SLOT[CC.length].a };
// slot (eerlijk is eerlijk + route): tijden ook nodig voor de kaart
const FIN = { card: T.s5, v1: T.s5 + CARD_DUR, map: T.s5 + 9.0, route: T.s5 + 9.75, routeEnd: T.s5 + 13.5, title: T.s5 + 15.75, out: T.end - 1.0 };
const byRank = (r) => CC[r - 1];
const slotOf = (c) => SLOT[c.rank];
const isCanada = (c) => !MAP.pts[c.name];
function parseRings(d) {
  const rings = []; let cur = null; const re = /([MLZ])([^MLZ]*)/g; let m;
  while ((m = re.exec(d))) {
    if (m[1] === "Z") { if (cur && cur.length > 2) rings.push(cur); cur = null; continue; }
    const nums = m[2].split(/[ ,]+/).filter(Boolean).map(Number);
    if (m[1] === "M") { if (cur && cur.length > 2) rings.push(cur); cur = []; }
    for (let i = 0; i + 1 < nums.length; i += 2) {
      const pt = [nums[i], nums[i + 1]], lp = cur[cur.length - 1];
      if (!lp || lp[0] !== pt[0] || lp[1] !== pt[1]) cur.push(pt);
    }
  }
  if (cur && cur.length > 2) rings.push(cur);
  return rings.map((r) => { const a = r[0], b = r[r.length - 1]; if (a[0] === b[0] && a[1] === b[1]) r.pop(); return r; });
}
// kaartpositie (x, z) van een land; Canada ligt links buiten de kaart
const CAN_XZ = [-1130, -60];
const mapXZ = (n) => (MAP.pts[n] ? [MAP.pts[n][0] - 960, MAP.pts[n][1] - 540] : CAN_XZ);
const colH = (c) => 30 + (c.totalExact - 80) * 24; // visuele hoogte; het getal staat er altijd bij

const DIO = GL.add((() => {
  const scene = new THREE.Scene();
  scene.background = col("#03080a");
  scene.fog = new THREE.Fog(col("#03080a"), 1600, 4200);
  const cam = new THREE.PerspectiveCamera(34, 16 / 9, 10, 9000);
  const hemi = new THREE.HemisphereLight(0x9fc8d0, 0x050a0b, 0.35);
  const moon = new THREE.DirectionalLight(0xbfd8ff, 0.55); moon.position.set(-600, 900, 500);
  moon.castShadow = true; moon.shadow.mapSize.set(2048, 2048);
  Object.assign(moon.shadow.camera, { left: -1300, right: 1300, top: 900, bottom: -900, near: 10, far: 4000 });
  moon.shadow.bias = -0.0008;
  scene.add(hemi, moon, moon.target);
  const board = new THREE.Mesh(new THREE.PlaneGeometry(6000, 4000), new THREE.MeshStandardMaterial({ color: col("#061215"), roughness: 1 }));
  board.rotation.x = -Math.PI / 2; board.position.y = -1; board.receiveShadow = true; scene.add(board);
  const grid = new THREE.GridHelper(6000, 120, 0x0f2a28, 0x0a1d1c); grid.position.y = 0; scene.add(grid);
  // landen
  const lineMat = new THREE.LineBasicMaterial({ color: col("#2c6f5e"), transparent: true, opacity: 0.55 });
  const lineMatCand = new THREE.LineBasicMaterial({ color: col(COL.mint), transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false });
  const lands = [], landBy = {};
  for (const c of MAP.countries) {
    const rings = parseRings(c.d);
    if (!rings.length) continue;
    const shapes = rings.map((r) => new THREE.Shape(r.map(([x, y]) => new THREE.Vector2(x - 960, -(y - 540)))));
    const geo = new THREE.ExtrudeGeometry(shapes, { depth: 1, bevelEnabled: false, curveSegments: 1 });
    geo.rotateX(-Math.PI / 2);
    const cand = !!(c.nl && M.by[c.nl]);
    const mat = new THREE.MeshStandardMaterial({ color: col(c.home ? "#6b5220" : cand ? "#14302c" : "#0c191b"), roughness: 0.9, emissive: col("#000000") });
    const mesh = new THREE.Mesh(geo, mat); mesh.castShadow = true; mesh.receiveShadow = true;
    const pts = [];
    rings.forEach((r) => r.forEach((a, i) => { const b = r[(i + 1) % r.length]; pts.push(a[0] - 960, 1, a[1] - 540, b[0] - 960, 1, b[1] - 540); }));
    const lg = new THREE.BufferGeometry(); lg.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    const grp = new THREE.Group(); grp.add(mesh, new THREE.LineSegments(lg, cand ? lineMatCand : lineMat)); scene.add(grp);
    grp.scale.y = cand ? 8 : 4;
    const rec = { name: c.nl || (c.home ? "België" : null), grp, mat, cand, home: !!c.home };
    lands.push(rec); if (rec.name) landBy[rec.name] = rec;
  }
  // lichtzuilen per kandidaat
  const colGeo = new THREE.CylinderGeometry(13, 13, 1, 6); colGeo.translate(0, 0.5, 0);
  const beamMat = new THREE.ShaderMaterial({
    uniforms: { c: { value: col(COL.gold) }, k: { value: 0 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }",
    fragmentShader: "uniform vec3 c; uniform float k; varying vec2 vUv; void main(){ float a = pow(1.-vUv.y, 1.6)*k; gl_FragColor = vec4(c*a*0.9, 1.); }",
  });
  const beamGeo = new THREE.CylinderGeometry(9, 15, 700, 24, 1, true); beamGeo.translate(0, 350, 0);
  const cols = CC.map((c) => {
    const m = new THREE.MeshStandardMaterial({ color: col(COL.mint), roughness: 0.35, metalness: 0.1, emissive: col(COL.mint), emissiveIntensity: 0.6 });
    const mesh = new THREE.Mesh(colGeo, m); mesh.castShadow = true;
    const [x, z] = mapXZ(c.name);
    mesh.position.set(x, 8, z);
    const beam = new THREE.Mesh(beamGeo, beamMat.clone()); beam.position.set(x, 8, z);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW_TEX, color: col(COL.mint), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    halo.position.set(x, 10, z); halo.scale.set(90, 90, 1);
    scene.add(mesh, beam, halo);
    return { c, mesh, m, beam, halo, x, z, h: colH(c) };
  });
  const colBy = Object.fromEntries(cols.map((k) => [k.c.name, k]));
  // Canada: een eigen eilandje met een stippellijn over de oceaan
  const canPlate = new THREE.Mesh(new THREE.CylinderGeometry(70, 70, 6, 6), new THREE.MeshStandardMaterial({ color: col("#14302c"), roughness: 0.9 }));
  canPlate.position.set(CAN_XZ[0], 0, CAN_XZ[1]); scene.add(canPlate);
  const dash = (() => {
    const a = new THREE.Vector3(CAN_XZ[0] + 60, 4, CAN_XZ[1]), b = new THREE.Vector3(mapXZ("Portugal")[0] - 80, 4, mapXZ("Portugal")[1] - 120);
    const g = new THREE.BufferGeometry().setFromPoints([a, b]);
    const l = new THREE.Line(g, new THREE.LineDashedMaterial({ color: col(COL.mint), dashSize: 14, gapSize: 12, transparent: true, opacity: 0.5 }));
    l.computeLineDistances(); scene.add(l); return l;
  })();
  // route België → winnaar (voor het slot), met een draaiende rugzak als wandelaar
  const P3 = (n, y) => { const [x, z] = mapXZ(n); return new THREE.Vector3(x, y, z); };
  const ra = P3("België", 16), rb = P3(WIN.name, colH(WIN) + 10);
  const curve = new THREE.QuadraticBezierCurve3(ra, new THREE.Vector3((ra.x + rb.x) / 2 - 30, 330, (ra.z + rb.z) / 2 - 40), rb);
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 260, 3.6, 10, false), new THREE.MeshStandardMaterial({ color: col(COL.gold), emissive: col(COL.gold), emissiveIntensity: 0.9, roughness: 0.4 }));
  scene.add(tube);
  const tubeCount = tube.geometry.index.count;
  const walker = makeBackpack({ solid: true });
  walker.scale.setScalar(26); scene.add(walker);
  const walkGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW_TEX, color: col(COL.gold), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  walkGlow.scale.set(64, 64, 1); scene.add(walkGlow);
  const tent = new THREE.Mesh(new THREE.ConeGeometry(30, 46, 4), new THREE.MeshStandardMaterial({ color: col(COL.mint), roughness: 0.5, emissive: col("#0d4a39"), emissiveIntensity: 0.6 }));
  tent.rotation.y = Math.PI / 4; tent.castShadow = true; scene.add(tent);
  const tentFlag = new THREE.Mesh(new THREE.PlaneGeometry(18, 11), new THREE.MeshStandardMaterial({ color: col(COL.gold), emissive: col(COL.gold), emissiveIntensity: 0.6, side: THREE.DoubleSide }));
  scene.add(tentFlag);
  // sterren / stof boven de kaart
  const rnd = mulberry32(51), ND = 900, dp = new Float32Array(ND * 3);
  for (let i = 0; i < ND; i++) { dp[i * 3] = (rnd() - 0.5) * 3200; dp[i * 3 + 1] = 40 + rnd() * 700; dp[i * 3 + 2] = (rnd() - 0.5) * 2200; }
  const dg = new THREE.BufferGeometry(); dg.setAttribute("position", new THREE.BufferAttribute(dp, 3));
  const dust = new THREE.Points(dg, new THREE.PointsMaterial({ color: col("#cfeee4"), size: 2.2, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(dust);

  // wie is er aan de beurt?
  const activeAt = (t) => { for (let r = CC.length; r >= 4; r--) { const s = SLOT[r]; if (t >= s.a && t < s.b) return r; } return 0; };
  function camFor(t) {
    // overzicht → per land → "nog tien over" (overzicht) → per land
    const wide = { tgt: [-40, 0, 60], dist: 2350, el: 58, az: -6 };
    let r = activeAt(t);
    const keyOf = (rank) => { const c = byRank(rank); const [x, z] = mapXZ(c.name); const fast = (SLOT[rank].b - SLOT[rank].a) < 2; return { tgt: [x - 120, colH(c) * 0.3, z + 40], dist: fast ? 1650 : 1450, el: 52, az: -8 + ((rank * 37) % 24) - 12 }; };
    if (t < AF.start) return wide;
    if (t >= T.ten && t < SLOT[10].a) {
      const p = E.inOut(seg(t, T.ten, T.ten + 1.6)); const k = keyOf(11);
      return { tgt: lerp3(k.tgt, wide.tgt, p), dist: lerp(k.dist, wide.dist * 0.85, p), el: lerp(k.el, 52, p), az: lerp(k.az, 4, p) };
    }
    if (!r) r = 4;
    const cur = keyOf(r);
    const prevRank = r === 10 ? null : r + 1;
    const prev = prevRank && prevRank <= CC.length ? keyOf(prevRank) : wide;
    const from = r === 10 ? { ...wide, dist: wide.dist * 0.85, el: 52, az: 4 } : r === CC.length ? wide : prev;
    const s = SLOT[r], d = Math.min(1.6, (s.b - s.a) * 0.7);
    const p = E.inOut(seg(t, s.a - 0.15, s.a + d));
    const drift = (t - s.a) * 6;
    return { tgt: lerp3(from.tgt, cur.tgt, p), dist: lerp(from.dist, cur.dist, p) - drift * 4, el: lerp(from.el, cur.el, p), az: lerp(from.az, cur.az, p) + drift * 0.6 };
  }
  function update(t) {
    const fin = t >= FIN.map - 0.5;
    if (!fin) {
      const k = camFor(t);
      aimCam(cam, k.tgt, k.dist, k.el, k.az);
      cam.clearViewOffset();
      cam.updateProjectionMatrix();
      hemi.intensity = 0.35; moon.intensity = 0.55; scene.background.set("#03080a"); scene.fog.color.set("#03080a");
      const r = activeAt(t);
      const rise = E.out5(seg(t, AF.map + 0.2, AF.map + 1.4));
      cols.forEach((k) => {
        const s = slotOf(k.c);
        const placed = s && t >= s.b - 0.02 && k.c.rank > 3; // al geplaatst: valt af voor de titel
        const active = r === k.c.rank;
        const ap = active ? E.out5(seg(t, s.a, s.a + 0.5)) : 0;
        const fade = placed ? E.inOut(seg(t, s.b - 0.1, s.b + 0.5)) : 0;
        k.mesh.scale.y = Math.max(0.001, k.h * rise * (1 + ap * 0.06) * (1 - fade * 0.55));
        const c = active ? hexLerp(COL.mint, COL.gold, ap) : placed ? hexLerp(COL.mint, "#26403c", fade) : COL.mint;
        k.m.color.set(c); k.m.emissive.set(c);
        k.m.emissiveIntensity = active ? 0.45 + 0.25 * ap : placed ? 0.5 - 0.42 * fade : 0.42 + 0.12 * Math.sin(t * 3 + k.x);
        k.beam.material.uniforms.k.value = active ? 0.45 * ap * (1 - E.in(seg(t, s.b - 0.3, s.b))) : 0;
        k.beam.scale.y = 1;
        k.halo.material.opacity = (active ? 1 : placed ? 0.12 * (1 - fade) : 0.55) * rise;
        k.halo.material.color.set(active ? COL.gold : COL.mint);
        k.halo.position.y = 10 + k.mesh.scale.y;
        k.halo.scale.setScalar(active ? 110 : 64);
      });
      lands.forEach((L) => { L.grp.scale.y = L.cand ? 8 : L.home ? 10 : 4; L.mat.emissive.set(L.home ? "#3a2a08" : "#000000"); });
      tube.visible = false; walker.visible = false; walkGlow.visible = false; tent.visible = false; tentFlag.visible = false;
      dash.visible = true; canPlate.visible = true;
      // HUD
      if (r) { const g = GEO[byRank(r).name]; HUD.geo.lon = g[0]; HUD.geo.lat = g[1]; HUD.tag = `PLAATS ${r}`; }
      else HUD.tag = "EUROPA";
    } else {
      // slot: gouden ochtend, route van thuis naar de winnaar
      const rp = E.inOut(seg(t, FIN.route, FIN.routeEnd));
      const fly = E.inOut2(seg(t, FIN.map, FIN.title + 2));
      const [bx, bz] = mapXZ("België"), [wx, wz] = mapXZ(WIN.name);
      const tA = [bx + 40, 0, bz + 30], tB = [wx - 40, 60, wz - 20];
      aimCam(cam, lerp3(tA, tB, fly), lerp(1300, 820, fly), lerp(54, 30, fly), lerp(-30, 18, fly));
      cam.setViewOffset(1920, 1080, lerp(260, 420, fly), lerp(0, 60, fly), 1920, 1080);
      cam.updateProjectionMatrix();
      const dawn = E.inOut(seg(t, FIN.map, FIN.title));
      scene.background.set(hexLerp("#03080a", "#140f0b", dawn)); scene.fog.color.copy(scene.background);
      hemi.intensity = lerp(0.35, 0.75, dawn); hemi.color.set(hexLerp("#9fc8d0", "#ffd9a8", dawn));
      moon.intensity = lerp(0.55, 1.2, dawn); moon.color.set(hexLerp("#bfd8ff", "#ffc98a", dawn)); moon.position.set(lerp(-600, -1500, dawn), lerp(900, 380, dawn), 300);
      cols.forEach((k) => {
        const w = k.c === WIN;
        k.mesh.scale.y = w ? k.h : Math.max(0.001, k.h * 0.35);
        const c = w ? COL.gold : "#2a4541";
        k.m.color.set(c); k.m.emissive.set(c); k.m.emissiveIntensity = w ? 0.9 : 0.15;
        k.beam.material.uniforms.k.value = w ? 0.5 * E.out(seg(t, FIN.routeEnd - 0.4, FIN.routeEnd + 1)) : 0;
        k.halo.material.opacity = w ? 1 : 0.05; k.halo.material.color.set(w ? COL.gold : COL.mint); k.halo.position.y = 10 + k.mesh.scale.y; k.halo.scale.setScalar(w ? 170 : 60);
      });
      lands.forEach((L) => { L.grp.scale.y = L.name === WIN.name ? 18 : L.home ? 14 : L.cand ? 6 : 4; L.mat.emissive.set(L.name === WIN.name ? "#3a2a08" : L.home ? "#3a2a08" : "#000000"); });
      tube.visible = rp > 0;
      tube.geometry.setDrawRange(0, Math.floor((tubeCount * rp) / 6) * 6);
      const hp = curve.getPoint(Math.max(0.0001, Math.min(0.9999, rp)));
      walker.visible = rp > 0 && rp < 1; walkGlow.visible = walker.visible;
      walker.position.copy(hp).add(new THREE.Vector3(0, 30, 0));
      walker.rotation.y = t * 2.2; walker.rotation.z = Math.sin(t * 4) * 0.1;
      walkGlow.position.copy(walker.position);
      const tp = E.back(seg(t, FIN.routeEnd - 0.1, FIN.routeEnd + 0.5));
      tent.visible = tp > 0.001; tent.scale.setScalar(Math.max(0.001, tp));
      tent.position.set(wx + 46, colH(WIN) * 0 + 24, wz + 30);
      tentFlag.visible = tent.visible; tentFlag.position.set(wx + 46, 24 + 23 * tp + 12, wz + 30); tentFlag.scale.setScalar(Math.max(0.001, tp)); tentFlag.rotation.y = Math.sin(t * 3) * 0.4;
      dash.visible = false; canPlate.visible = false;
      const g = GEO[WIN.name], b = GEO["België"];
      HUD.geo.lon = lerp(b[0], g[0], rp); HUD.geo.lat = lerp(b[1], g[1], rp); HUD.tag = rp > 0 && rp < 1 ? "ONDERWEG" : rp >= 1 ? WIN.name.toUpperCase() : "THUIS";
    }
    dust.rotation.y = t * 0.01;
  }
  const vis = (t) => {
    if (t >= AF.map - 0.1 && t < T.top3 + 0.2) return E.inOut(seg(t, AF.map - 0.1, AF.map + 0.6)) * (1 - E.inOut(seg(t, T.top3 - 0.4, T.top3 + 0.2)));
    if (t >= FIN.map - 0.5 && t < T.end) return E.inOut(seg(t, FIN.map - 0.5, FIN.map + 0.6)) * (1 - E.inOut(seg(t, FIN.out, T.end)));
    return 0;
  };
  return { scene, cam, update, vis, cols, colBy, activeAt, post: (t) => ({ bloom: 1.0, th: 0.5 }) };
})());

/* — het podium: de top 3 — */
const POD = GL.add((() => {
  const scene = new THREE.Scene();
  scene.background = col("#030607");
  scene.fog = new THREE.Fog(col("#030607"), 1400, 3400);
  const cam = new THREE.PerspectiveCamera(30, 16 / 9, 10, 8000);
  const hemi = new THREE.HemisphereLight(0x9fc8d0, 0x050a0b, 0.18);
  scene.add(hemi);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(2600, 96), new THREE.MeshStandardMaterial({ color: col("#0a1416"), roughness: 0.35, metalness: 0.4 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const rings = [600, 900, 1250].map((r, i) => { const m = new THREE.Mesh(new THREE.RingGeometry(r, r + 3, 128), new THREE.MeshBasicMaterial({ color: col(COL.mint), transparent: true, opacity: 0.18 - i * 0.04, blending: THREE.AdditiveBlending, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.position.y = 1; scene.add(m); return m; });
  const spots = [{ c: byRank(2), x: -330, rank: 2 }, { c: byRank(1), x: 0, rank: 1 }, { c: byRank(3), x: 330, rank: 3 }];
  const blocks = spots.map((s) => {
    const h = 150 + (s.c.totalExact - byRank(3).totalExact) * 110;
    const cv = document.createElement("canvas"); cv.width = 512; cv.height = 512;
    const tex = new THREE.CanvasTexture(cv); tex.encoding = THREE.sRGBEncoding;
    const side = new THREE.MeshStandardMaterial({ color: col(s.rank === 1 ? COL.gold : "#cfd8d2"), roughness: 0.4, metalness: 0.25, emissive: col(s.rank === 1 ? COL.gold : "#1d2b2a"), emissiveIntensity: 0 });
    const front = new THREE.MeshStandardMaterial({ color: col("#ffffff"), map: tex, roughness: 0.5, emissive: col("#ffffff"), emissiveMap: tex, emissiveIntensity: 0 });
    const geo = new THREE.BoxGeometry(280, 1, 240); geo.translate(0, 0.5, 0);
    const m = new THREE.Mesh(geo, [side, side, side, side, front, side]);
    m.castShadow = true; m.receiveShadow = true; m.position.x = s.x;
    scene.add(m);
    // spot van boven
    const spot = new THREE.SpotLight(s.rank === 1 ? 0xffe6b0 : 0xdff7ee, 0, 2600, 0.26, 0.55, 1.2);
    spot.position.set(s.x, 1500, 380); spot.target.position.set(s.x, 0, 0); spot.castShadow = true; spot.shadow.mapSize.set(1024, 1024);
    scene.add(spot, spot.target);
    const coneMat = new THREE.ShaderMaterial({
      uniforms: { c: { value: col(s.rank === 1 ? "#ffe2a8" : "#bfeedd") }, k: { value: 0 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }",
      fragmentShader: "uniform vec3 c; uniform float k; varying vec2 vUv; void main(){ float a = pow(vUv.y, 1.8)*0.11*k; gl_FragColor = vec4(c*a, 1.); }",
    });
    const cone = new THREE.Mesh(new THREE.CylinderGeometry(8, 230, 1500, 40, 1, true), coneMat);
    cone.position.set(s.x, 750, 190); cone.rotation.x = Math.atan2(380 - 0, 1500) * 0.5;
    scene.add(cone);
    return { s, m, h, cv, tex, side, front, spot, cone, coneMat };
  });
  function drawFaces() {
    blocks.forEach((b) => {
      const g = b.cv.getContext("2d");
      g.fillStyle = b.s.rank === 1 ? "#f2c374" : "#cfd8d2"; g.fillRect(0, 0, 512, 512);
      g.fillStyle = b.s.rank === 1 ? "#2a1b02" : "#13201f";
      g.font = "200 360px 'Big Shoulders Display'"; g.textAlign = "center"; g.textBaseline = "middle";
      g.fillText(String(b.s.rank), 256, 280);
      b.tex.needsUpdate = true;
    });
  }
  drawFaces();
  // confetti en vonken
  const NC = 420, rnd = mulberry32(91);
  const conf = new THREE.InstancedMesh(new THREE.PlaneGeometry(12, 7), new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.5, emissive: col("#222222") }), NC);
  const cp = [];
  const pal = [COL.gold, COL.mint, COL.paper, "#ffb347", COL.gold].map(col);
  for (let i = 0; i < NC; i++) {
    const a = rnd() * Math.PI * 2, sp = 200 + rnd() * 700, up = 600 + rnd() * 1000;
    cp.push({ vx: Math.cos(a) * sp, vz: Math.sin(a) * sp * 0.6, vy: up, rx: rnd() * 9, ry: rnd() * 9, rz: rnd() * 9, d: rnd() * 0.3 });
    conf.setColorAt(i, pal[i % pal.length]);
  }
  scene.add(conf);
  const dummy = new THREE.Object3D();
  const when = { 3: SLOT[3].a, 2: SLOT[2].a, 1: SLOT[1].a };
  function update(t) {
    const lt = t - T.top3;
    aimCam(cam, [0, 210, 0], lerp(2200, 1500, E.inOut2(seg(t, T.top3, T.s4))), lerp(14, 9, seg(t, T.top3, T.s4)), lerp(-12, 9, E.inOut2(seg(t, T.top3, T.s4))) + (t > T.flash ? Math.sin((t - T.flash) * 0.6) * 2 : 0));
    cam.setViewOffset(1920, 1080, 220, 0, 1920, 1080); cam.updateProjectionMatrix();
    blocks.forEach((b) => {
      const a = when[b.s.rank];
      const g = E.back(seg(t, a, a + 0.7));
      b.m.scale.y = Math.max(0.001, b.h * g);
      b.m.visible = g > 0.001;
      const on = E.out(seg(t, a - 0.1, a + 0.3));
      const pre = b.s.rank === 1 ? E.inOut(seg(t, T.build, T.flash)) * 0.35 : 0;
      b.spot.intensity = (b.s.rank === 1 ? 5.0 : 3.2) * Math.max(on, pre);
      b.coneMat.uniforms.k.value = Math.max(on, pre) * (b.s.rank === 1 ? 1.2 : 0.8);
      b.side.emissiveIntensity = b.s.rank === 1 ? 0.35 * on : 0.05 * on;
      b.front.emissiveIntensity = b.s.rank === 1 ? 0.25 * on : 0.08 * on;
    });
    // zoekende spots vóór de onthulling
    hemi.intensity = 0.18 + 0.25 * E.out(seg(t, T.flash, T.flash + 0.6));
    rings.forEach((r, i) => { r.rotation.z = t * (0.05 + i * 0.03); r.material.opacity = (0.18 - i * 0.04) * (1 + 2 * E.out(seg(t, T.flash, T.flash + 0.4)) * (1 - E.out(seg(t, T.flash + 0.4, T.flash + 3)))); });
    const tb = t - T.flash;
    conf.visible = tb > 0 && tb < 6;
    if (conf.visible) {
      for (let i = 0; i < NC; i++) {
        const c = cp[i], k = Math.max(0, tb - c.d);
        dummy.position.set(c.vx * k * 0.55, 420 + c.vy * k * 0.55 - 430 * k * k, c.vz * k * 0.55 + 80);
        if (dummy.position.y < 2) dummy.position.y = 2;
        dummy.rotation.set(c.rx * k, c.ry * k, c.rz * k);
        dummy.scale.setScalar(k > 0 ? Math.max(0.001, 1 - Math.max(0, tb - 4.5) / 1.5) : 0.001);
        dummy.updateMatrix(); conf.setMatrixAt(i, dummy.matrix);
      }
      conf.instanceMatrix.needsUpdate = true;
    }
    HUD.tag = t >= T.flash ? "PLAATS 1" : t >= SLOT[2].a ? "PLAATS 2" : t >= SLOT[3].a ? "PLAATS 3" : "DE TOP DRIE";
    if (t >= T.flash) { HUD.geo.lon = GEO[WIN.name][0]; HUD.geo.lat = GEO[WIN.name][1]; }
  }
  const vis = (t) => (t >= T.top3 - 0.2 && t < T.s4 ? E.inOut(seg(t, T.top3 - 0.2, T.top3 + 0.6)) : 0);
  return { scene, cam, update, vis, blocks, drawFaces, post: (t) => ({ bloom: 1.05, th: 0.55, exposure: 1 + 0.6 * Math.max(0, 1 - Math.abs(t - T.flash) / 0.6) }) };
})());

/* — DOM: de kaart van elk land, de ladder (rangorde), de podiumnamen — */
(function () {
  const L = el("div", { class: "L" }, sceneRootEl);
  // links: donker verloop zodat de tekst leesbaar blijft boven de kaart
  const shadeL = el("div", { class: "L", style: "background:linear-gradient(90deg, rgba(3,8,10,.82) 0%, rgba(3,8,10,.55) 28%, rgba(3,8,10,0) 46%)" }, L);
  // links: de kaart van het land dat nu aan de beurt is
  const card = el("div", { class: "a", style: "left:130px;top:250px;width:640px;white-space:normal" }, L);
  const cRank = el("div", { class: "thin", style: "font-size:150px;font-variant-numeric:tabular-nums;color:" + COL.gold }, card);
  const cName = el("div", { class: "disp", style: "font-size:118px;margin-top:-4px;white-space:nowrap" }, card);
  const cScore = el("div", { style: "display:flex;align-items:baseline;gap:16px;margin-top:16px" }, card);
  const cTot = el("span", { class: "thin", style: "font-size:76px;color:" + COL.mint }, cScore);
  const cTotL = el("span", { class: "mono", style: `font-size:16px;letter-spacing:.2em;color:${COL.muted};text-transform:uppercase` }, cScore, "eindscore");
  const cProf = el("div", { class: "it", style: "font-size:36px;margin-top:14px;color:" + COL.soft }, card);
  const cMeta = el("div", { class: "mono", style: `font-size:16px;margin-top:16px;color:${COL.muted};letter-spacing:.1em;text-transform:uppercase` }, card);
  const cMore = el("div", { style: "margin-top:26px;display:grid;grid-template-columns:auto 1fr auto;gap:10px 16px;align-items:center;width:600px" }, card);
  const moreRow = (lbl, color) => {
    const a = el("span", { class: "mono", style: `font-size:15px;letter-spacing:.18em;color:${color};text-transform:uppercase` }, cMore, lbl);
    const n = el("span", { class: "mono", style: "font-size:21px;font-weight:500" }, cMore);
    const v = el("span", { class: "thin", style: `font-size:40px;color:${color}` }, cMore);
    return { a, n, v };
  };
  const mBest = moreRow("sterkst", COL.mint), mWorst = moreRow("zwakst", COL.coral);
  // rechts: de ladder
  const lad = el("div", { class: "a", style: "left:1440px;top:150px;width:400px;height:790px;padding:22px 24px;border-radius:14px;background:rgba(4,10,12,.62);border:1px solid rgba(239,233,218,.08);backdrop-filter:blur(6px)" }, L);
  el("div", { class: "kick", style: `font-size:13px;color:${COL.muted};margin-bottom:14px` }, lad, "Eindstand");
  const rows = CC.map((c, i) => {
    const r = el("div", { style: "position:relative;height:28.5px;display:flex;align-items:center;gap:12px;font-size:15px" }, lad);
    const n = el("span", { class: "mono", style: `width:24px;text-align:right;color:${COL.muted};font-variant-numeric:tabular-nums` }, r, String(c.rank));
    const nm = el("span", { class: "mono", style: "flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" }, r, "");
    const sc = el("span", { class: "mono", style: "font-variant-numeric:tabular-nums;font-weight:500" }, r, "");
    const bar = el("i", { style: `position:absolute;left:36px;bottom:3px;height:2px;border-radius:1px;background:${COL.mint};opacity:.5` }, r);
    return { c, r, n, nm, sc, bar };
  });
  // midden: grote tussentitels
  const mid = el("div", { class: "a", style: "left:0;width:1920px;text-align:center;top:430px" }, L);
  const midK = el("div", { class: "kick", style: `color:${COL.gold}` }, mid, "");
  const midT = el("div", { class: "serif", style: "font-size:110px;margin-top:16px" }, mid);
  const tenW = words(el("div", {}, midT), `Nog *${numWord(10).toLowerCase()}* over.`);
  const top3 = el("div", { class: "a", style: "left:0;width:1920px;text-align:center;top:150px" }, L);
  el("div", { class: "kick", style: `color:${COL.gold}` }, top3, "Het podium");
  const top3T = el("div", { class: "serif", style: "font-size:84px;margin-top:14px" }, top3);
  const t3W = words(top3T, "De *top drie.*");
  const build = el("div", { class: "a it", style: "left:0;width:1920px;text-align:center;top:180px;font-size:64px;color:" + COL.soft }, L);
  const bW = words(build, "En op nummer één…");
  // namen boven het podium
  const pod = POD.blocks.map((b) => {
    const e = el("div", { class: "a", style: "left:0;top:0;width:560px;text-align:center;white-space:normal" }, L);
    const nm = el("div", { class: "disp", style: `font-size:${b.s.rank === 1 ? 120 : 76}px;color:${b.s.rank === 1 ? COL.gold : COL.paper}` }, e, b.s.c.name);
    const sc = el("div", { class: "thin", style: `font-size:${b.s.rank === 1 ? 92 : 64}px;color:${b.s.rank === 1 ? COL.paper : COL.mint};margin-top:6px` }, e, fTot(b.s.c));
    const pf = el("div", { class: "it", style: `font-size:${b.s.rank === 1 ? 32 : 26}px;color:${COL.soft};margin-top:8px` }, e, escapeHtml(b.s.c.profile));
    return { b, e, nm, sc, pf };
  });
  const tag = el("div", { class: "tag", style: `background:rgba(242,195,116,.92);color:#140d02` }, labLayer);
  renders.push((t) => {
    const on = t >= T.s3 && t < T.s4 + 0.2;
    op(L, on ? 1 : 0); op(tag, 0);
    if (!on) return;
    const r = DIO.activeAt(t);
    op(shadeL, DIO.vis(t));
    // kaart van het actieve land (25..4)
    if (r) {
      const c = byRank(r), s = SLOT[r];
      const ap = E.out5(seg(t, s.a, s.a + 0.45)), ao = (s.b - s.a) > 2 ? E.inOut(seg(t, s.b - 0.3, s.b)) : 0;
      set(card, ap * (1 - ao), (1 - ap) * -30, 0, 1, 0, (1 - ap) * 10);
      cRank.textContent = String(r).padStart(2, "0");
      cName.textContent = c.name; cName.style.fontSize = (c.name.length > 14 ? 78 : c.name.length > 10 ? 98 : 118) + "px";
      cTot.textContent = fTot(c);
      cProf.textContent = c.profile;
      cMeta.textContent = `zekerheid ${c.zeker}` + (c.region !== "Europe" ? ` · ${c.region === "North America" ? "Noord-Amerika" : "Europa/Azië"}` : "");
      const detail = r <= 10;
      op(cMore, detail ? E.out(seg(t, s.a + 0.5, s.a + 1.0)) : 0);
      if (detail) {
        mBest.n.textContent = c.best; mBest.v.textContent = fCat(c, c.best);
        mWorst.n.textContent = c.worst; mWorst.v.textContent = fCat(c, c.worst);
      }
      // label boven de zuil
      const k = DIO.colBy[c.name];
      const [x, y, okp] = project(DIO.cam, k.x, k.mesh.scale.y + 30, k.z);
      if (okp) { op(tag, ap * DIO.vis(t)); tag.style.transform = `translate(${x}px,${y}px) translate(-50%,-100%)`; tag.textContent = `${r} · ${c.name}`; }
    } else op(card, 0);
    // ladder: vult zich van onder naar boven
    const ladO = win(t, AF.map + 0.4, T.s4 + 0.1, 0.8, 0.6) * (t >= T.top3 - 0.2 && t < T.flash + 1.5 ? 1 : 1);
    op(lad, ladO);
    rows.forEach((w) => {
      const s = slotOf(w.c);
      const shown = t >= s.a;
      const p = E.out5(seg(t, s.a, s.a + 0.5));
      w.nm.textContent = shown ? w.c.name : "";
      w.sc.textContent = shown ? fTot(w.c) : "";
      w.r.style.opacity = shown ? 0.35 + 0.65 * p : 0.35;
      w.n.style.color = shown && r === w.c.rank ? COL.gold : COL.muted;
      w.nm.style.color = r === w.c.rank || (w.c.rank === 1 && shown) ? COL.gold : COL.paper;
      w.r.style.transform = `translateX(${(1 - p) * 20}px)`;
      w.bar.style.width = shown ? (clamp((w.c.totalExact - 80) / 12) * 300 * p) + "px" : "0px";
      w.bar.style.background = w.c.rank === 1 ? COL.gold : COL.mint;
    });
    // tussentitels
    inout(mid, t, T.ten, SLOT[10].a, 0.6, 16, 0.4); revealWords(tenW, t, T.ten, 0.14, 0.9);
    op(midK, 0);
    inout(top3, t, T.top3 + 0.2, SLOT[3].a + 0.1, 0.7, 16, 0.4); revealWords(t3W, t, T.top3 + 0.2, 0.14, 0.9);
    inout(build, t, T.build + 0.3, T.flash - 0.15, 0.9, 12, 0.3); revealWords(bW, t, T.build + 0.3, 0.3, 1.1);
    // podiumnamen
    pod.forEach((p) => {
      const a = SLOT[p.b.s.rank].a;
      const ii = E.out5(seg(t, a + 0.3, a + 0.9));
      if (POD.vis(t) <= 0) { op(p.e, 0); return; }
      const [x, y] = project(POD.cam, p.b.s.x, p.b.m.scale.y + 30, 120);
      p.e.style.left = x - 280 + "px"; p.e.style.top = "0px";
      set(p.e, ii, 0, y - p.e.offsetHeight - 10 + (1 - ii) * 30, p.b.s.rank === 1 ? lerp(1.25, 1, ii) : 1, 0, (1 - ii) * 8);
    });
  });
})();
