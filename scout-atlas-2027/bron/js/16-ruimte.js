/* ═════════════ DE RUIMTE (hoofdstuk 6): elk land een bol in drie dimensies ═════════════
   x = kostprijs, y = avontuur, z = kamperen (tier 2). Grootte = eindscore. De camera draait rond
   en kijkt daarna recht van voren: dan is het het speelveld kostprijs × avontuur. */
const RU = CUE.ru;
const SPACE = (() => {
  // welke categorieën zijn de assen: de twee tier-1-categorieën (kost, avontuur) en tier 2
  const t1 = CATS.filter((c) => tierOf(c) === 1), t2 = CATS.filter((c) => tierOf(c) === 2);
  const XC = t1.find((c) => /kost|prijs|budget/i.test(catName(c))) || t1[0];
  const YC = t1.find((c) => c !== XC && /avontuur|activ/i.test(catName(c))) || t1.find((c) => c !== XC) || t1[0];
  const px = (r) => r.catExact[XC], py = (r) => r.catExact[YC];
  const pz = (r) => (t2.length ? t2.reduce((s, c) => s + r.catExact[c] * catW[c], 0) / t2.reduce((s, c) => s + catW[c], 0) : 50);
  const R = ELIG;
  const lo = (f) => Math.floor((Math.min(...R.map(f)) - 4) / 10) * 10, hi = (f) => Math.ceil((Math.max(...R.map(f)) + 4) / 10) * 10;
  const xr = [lo(px), hi(px)], yr = [lo(py), hi(py)], zr = [lo(pz), hi(pz)];
  const SZ = 60; // halve zijde van de ruimte
  const X = (v) => lerp(-SZ, SZ, (v - xr[0]) / (xr[1] - xr[0])), Y = (v) => lerp(-SZ, SZ, (v - yr[0]) / (yr[1] - yr[0])), Z = (v) => lerp(SZ, -SZ, (v - zr[0]) / (zr[1] - zr[0]));
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(col(D.bg), 260, 520);
  const cam = new THREE.PerspectiveCamera(32, 16 / 9, 1, 2000);
  scene.add(new THREE.HemisphereLight(0xfff8ea, 0xb9ab8c, 0.8));
  const sun = new THREE.DirectionalLight(0xfff3e0, 0.9); sun.position.set(-120, 200, 160); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -140, right: 140, top: 140, bottom: -140, near: 10, far: 700 }); sun.shadow.bias = -0.0004;
  scene.add(sun);
  // drie wanden met raster: vloer (y = min), achterwand (z = max → -SZ), linkerwand (x = min)
  const gridMat = new THREE.LineBasicMaterial({ color: col("#10262c"), transparent: true, opacity: 0.16 });
  const wallMat = new THREE.MeshStandardMaterial({ color: col("#e8dfc8"), roughness: 1, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
  const walls = [];
  const mkWall = (rot, pos) => { const w = new THREE.Mesh(new THREE.PlaneGeometry(2 * SZ, 2 * SZ), wallMat); w.rotation.set(rot[0], rot[1], rot[2]); w.position.set(pos[0], pos[1], pos[2]); w.receiveShadow = true; scene.add(w); walls.push(w); return w; };
  mkWall([-Math.PI / 2, 0, 0], [0, -SZ, 0]);
  mkWall([0, 0, 0], [0, 0, -SZ]);
  mkWall([0, Math.PI / 2, 0], [-SZ, 0, 0]);
  const gpts = [];
  for (let i = 0; i <= 10; i++) { const u = lerp(-SZ, SZ, i / 10);
    gpts.push(-SZ, -SZ, u, SZ, -SZ, u, u, -SZ, -SZ, u, -SZ, SZ);          // vloer
    gpts.push(-SZ, u, -SZ, SZ, u, -SZ, u, -SZ, -SZ, u, SZ, -SZ);          // achterwand
    gpts.push(-SZ, u, -SZ, -SZ, u, SZ, -SZ, -SZ, u, -SZ, SZ, u);          // linkerwand
  }
  const gridG = new THREE.BufferGeometry(); gridG.setAttribute("position", new THREE.Float32BufferAttribute(gpts, 3));
  const grid = new THREE.LineSegments(gridG, gridMat); scene.add(grid);
  // de bollen
  const tmin = Math.min(...R.map((r) => r.totalExact)), tmax = Math.max(...R.map((r) => r.totalExact));
  const rad = (r) => 2.2 + ((r.totalExact - tmin) / (tmax - tmin)) * 4.2;
  const balls = R.map((r) => {
    const win_ = r === WIN, top = isTop(r.name);
    const m = new THREE.Mesh(new THREE.SphereGeometry(rad(r), 28, 20), new THREE.MeshStandardMaterial({ color: col(win_ ? "#e3bd52" : top ? "#0e7a5f" : "#8f9f99"), roughness: 0.5, metalness: 0.05, transparent: true }));
    m.castShadow = true; m.position.set(X(px(r)), Y(py(r)), Z(pz(r))); scene.add(m);
    // schaduwstip op de vloer (projectie) voor leesbaarheid
    const sh = new THREE.Mesh(new THREE.CircleGeometry(rad(r) * 0.9, 20), new THREE.MeshBasicMaterial({ color: col("#10262c"), transparent: true, opacity: 0.12 }));
    sh.rotation.x = -Math.PI / 2; sh.position.set(m.position.x, -SZ + 0.1, m.position.z); scene.add(sh);
    const drop = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(m.position.x, -SZ, m.position.z), m.position.clone()]), new THREE.LineBasicMaterial({ color: col("#10262c"), transparent: true, opacity: 0.1 }));
    scene.add(drop);
    return { r, m, sh, drop, win: win_, top };
  });
  // as-labels als sprites
  const mkLabel = (txt, size = 56, color = D.ink) => { const { tex, w, h } = textTexture(txt, { font: `600 ${size}px 'IBM Plex Mono'`, color }); const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false })); s.scale.set((w / h) * 9, 9, 1); s.renderOrder = 20; scene.add(s); return s; };
  const lx = mkLabel(`${short(XC).toUpperCase()} →`), ly = mkLabel(`${short(YC).toUpperCase()} ↑`), lz = mkLabel(t2.length ? `${short(t2[0]).toUpperCase()} ↗` : "");
  lx.position.set(SZ * 0.4, -SZ - 9, -SZ + 2); ly.position.set(-SZ - 4, -SZ * 0.72, SZ + 3); lz.position.set(SZ + 14, -SZ - 7, 0);
  // naamlabels (DOM) voor de top 10 en de uitersten
  const ext = new Set([R.reduce((a, b) => (px(b) < px(a) ? b : a)).name, R.reduce((a, b) => (px(b) > px(a) ? b : a)).name, R.reduce((a, b) => (py(b) > py(a) ? b : a)).name, R.reduce((a, b) => (py(b) < py(a) ? b : a)).name]);
  const labelled = R.filter((r) => isTop(r.name) || ext.has(r.name));
  const labs = labelled.map((r) => ({ r, e: el("div", { class: "a mono", style: `left:0;top:0;font-size:${r === WIN ? 30 : 24}px;font-weight:600;color:${r === WIN ? D.ochre : isTop(r.name) ? D.ink : D.sub};text-shadow:0 0 8px ${D.bg},0 0 4px ${D.bg};transform-origin:0 50%` }, labLayer, r.name) }));
  let sel = [];
  function update(t) {
    const orbit = E.inOut(seg(t, RU.orbit[0], RU.orbit[1])), flat = E.inOut(seg(t, RU.flat[0], RU.flat[1]));
    const appear = E.out(seg(t, RU.axes, RU.axes + 1.0));
    const az = lerp(lerp(-44, 26, orbit), 0, flat), elv = lerp(lerp(30, 15, orbit), 0.01, flat), dist = lerp(lerp(300, 280, orbit), 262, flat);
    aimCam(cam, [lerp(-6, 0, flat), lerp(-4, 0, flat), 0], dist, elv, az);
    cam.setViewOffset(1920, 1080, lerp(-120, -300, flat), 0, 1920, 1080);
    cam.updateProjectionMatrix();
    walls.forEach((w) => (w.material.opacity = 0.9 * appear));
    gridMat.opacity = 0.16 * appear;
    walls[2].visible = flat < 0.98; // de linkerwand verdwijnt in het vlakke beeld
    [lx, ly, lz].forEach((l) => (l.material.opacity = appear));
    lz.material.opacity = appear * (1 - flat);
    balls.forEach((b, i) => {
      const pin = E.back(seg(t, RU.dots + i * 0.03, RU.dots + i * 0.03 + 0.5));
      const inSel = sel.includes(b.r);
      const dim = sel.length ? (inSel ? 1 : 0.22) : 1;
      b.m.scale.setScalar(Math.max(0.001, pin) * (inSel ? 1.25 : 1));
      b.m.material.opacity = dim;
      b.sh.material.opacity = 0.12 * pin * (1 - flat) * dim; b.drop.material.opacity = 0.1 * pin * (1 - flat) * dim;
    });
    labs.forEach((l) => {
      const b = balls.find((x) => x.r === l.r);
      const [x, y, ok] = project(cam, b.m.position.x, b.m.position.y + rad(l.r) + 1.5, b.m.position.z);
      const o = ok ? E.out(seg(t, RU.dots + 1.2, RU.dots + 1.8)) * (sel.length ? (sel.includes(l.r) ? 1 : 0.25) : 1) : 0;
      op(l.e, o);
      l.e.style.transform = `translate(${x - 4}px,${y - 30}px)`;
    });
  }
  return { scene, cam, update, XC, YC, t2, px, py, pz, R, labs, setSel: (s) => (sel = s), hide: () => labs.forEach((l) => op(l.e, 0)) };
})();
GL.add({ scene: SPACE.scene, cam: SPACE.cam, update: SPACE.update, hide: SPACE.hide, vis: (t) =>
  t >= T.s6 - 0.1 && t < T.s7 + 0.05 ? E.inOut(seg(t, T.s6 - 0.1, T.s6 + 0.6)) * (1 - E.inOut(seg(t, RU.end - 0.5, RU.end))) : 0 });
