/* ═════════════ HET KAMPVUUR (hoofdstuk 1, eerste seconden): een heuvel, drie tenten, een vuur ═════════════
   Een miniatuur in dezelfde stijl als het diorama. De camera begint laag bij het vuur en trekt terug en omhoog;
   daarna gaan we naar de wereldbol. */
const CAMP = (() => {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(col("#061216"), 0.034);
  const cam = new THREE.PerspectiveCamera(34, 16 / 9, 0.1, 200);
  const moon = new THREE.DirectionalLight(0x9fb8d6, 0.5); moon.position.set(-14, 20, -10); moon.castShadow = true;
  moon.shadow.mapSize.set(2048, 2048); Object.assign(moon.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 80 });
  scene.add(moon, new THREE.HemisphereLight(0x2a4a52, 0x0a1a18, 0.5));
  // de heuvel: een vlak met zachte golven, hoekig gearceerd
  const G = 60, SEGS = 64;
  const geo = new THREE.PlaneGeometry(G, G, SEGS, SEGS);
  const pos = geo.attributes.position;
  const rnd = mulberry32(31);
  const bump = Array.from({ length: 10 }, () => ({ x: (rnd() - 0.5) * G, z: (rnd() - 0.5) * G, a: 0.6 + rnd() * 1.6, s: 5 + rnd() * 9 }));
  // hoogte: zachte golven en een paar heuvels; het kamp zelf ligt op een vlak plateau (straal 7), daarbuiten loopt het geleidelijk op
  const hAt = (x, z) => {
    let h = 0.5 * Math.sin(x * 0.21) * Math.cos(z * 0.17) + 0.2 * Math.sin(x * 0.7 + z * 0.4);
    for (const b of bump) h += b.a * Math.exp(-((x - b.x) ** 2 + (z - b.z) ** 2) / (2 * b.s * b.s));
    const d = Math.hypot(x, z), k = clamp((d - 7) / 10); // 0 op het plateau, 1 ver weg
    return h * k * k;
  };
  for (let i = 0; i < pos.count; i++) pos.setZ(i, hAt(pos.getX(i), -pos.getY(i)));
  geo.rotateX(-Math.PI / 2); geo.computeVertexNormals();
  const ground = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: col("#24564a"), roughness: 1, flatShading: true }));
  ground.receiveShadow = true; scene.add(ground);
  // tenten
  const mkTent = (x, z, s, c, ry) => { const m = new THREE.Mesh(new THREE.ConeGeometry(0.9 * s, 1.3 * s, 4), new THREE.MeshStandardMaterial({ color: col(c), roughness: 0.8, flatShading: true })); m.position.set(x, hAt(x, z) + 0.65 * s, z); m.rotation.y = ry; m.castShadow = true; m.receiveShadow = true; scene.add(m); return m; };
  mkTent(-2.6, -1.6, 1.15, "#2f8a6c", Math.PI / 4); mkTent(2.4, -2.4, 0.95, "#dfd3b6", Math.PI / 4 + 0.3); mkTent(0.4, -3.6, 0.85, "#dfd3b6", Math.PI / 4 - 0.2);
  // vuur
  const fireG = new THREE.Group(); fireG.position.set(0, hAt(0, 0), 0); scene.add(fireG);
  const stoneMat = new THREE.MeshStandardMaterial({ color: col("#6b6a63"), roughness: 1, flatShading: true });
  for (let i = 0; i < 9; i++) { const s = new THREE.Mesh(new THREE.DodecahedronGeometry(0.17 + rnd() * 0.08), stoneMat); const a = (i / 9) * Math.PI * 2; s.position.set(Math.cos(a) * 0.7, 0.08, Math.sin(a) * 0.7); s.castShadow = true; fireG.add(s); }
  for (let i = 0; i < 4; i++) { const log = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.9, 6), new THREE.MeshStandardMaterial({ color: col("#3b2a1a"), roughness: 1 })); log.rotation.z = Math.PI / 2; log.rotation.y = (i / 4) * Math.PI; log.position.y = 0.08 + (i % 2) * 0.06; fireG.add(log); }
  const flameMat = new THREE.MeshBasicMaterial({ color: col("#ffb347"), transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false });
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.34, 1.1, 7), flameMat); flame.position.y = 0.6; fireG.add(flame);
  const flame2 = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.8, 6), new THREE.MeshBasicMaterial({ color: col("#fff1c0"), transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })); flame2.position.y = 0.45; fireG.add(flame2);
  const fire = new THREE.PointLight(0xffa040, 0, 26, 2); fire.position.y = 0.9; fire.castShadow = true; fire.shadow.mapSize.set(1024, 1024); fireG.add(fire);
  const NS_ = 60, sparks = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ color: col("#ffcc66"), size: 0.07, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
  const sp = new Float32Array(NS_ * 3); sparks.geometry.setAttribute("position", new THREE.BufferAttribute(sp, 3)); fireG.add(sparks);
  const sparkSeed = Array.from({ length: NS_ }, () => [rnd(), rnd(), rnd()]);
  // bomen: donkere kegels op de heuvelrug
  const treeMat = new THREE.MeshStandardMaterial({ color: col("#0f2b24"), roughness: 1, flatShading: true });
  for (let i = 0; i < 70; i++) {
    const a = rnd() * Math.PI * 2, d = 7 + rnd() * 20, x = Math.cos(a) * d, z = Math.sin(a) * d;
    if (z > 3 && Math.abs(x) < 6) continue; // vrij zicht naar voren
    const s = 1.2 + rnd() * 2.2;
    const tr = new THREE.Mesh(new THREE.ConeGeometry(0.45 * s, 2.2 * s, 6), treeMat);
    tr.position.set(x, hAt(x, z) + 1.1 * s, z); tr.castShadow = true; scene.add(tr);
    const st = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.6 * s, 5), treeMat); st.position.set(x, hAt(x, z) + 0.3 * s, z); scene.add(st);
  }
  // een lichtstip voor "wij": kompasnaald op de voorgrond? Nee: rust. Alleen het vuur en de tenten.
  function update(t) {
    const p = E.inOut(seg(t, CUE.pull[0], CUE.pull[1]));
    const flick = 0.75 + 0.25 * Math.sin(t * 23) * Math.sin(t * 7.3) + 0.1 * Math.sin(t * 41);
    const fl = E.out(seg(t, CUE.fire, CUE.fire + 1.4));
    fire.intensity = 7 * fl * flick;
    flame.scale.set(1, 0.85 + 0.3 * flick, 1); flameMat.opacity = 0.95 * fl;
    flame2.scale.set(1, 0.8 + 0.4 * (0.5 + 0.5 * Math.sin(t * 31)), 1); flame2.material.opacity = 0.9 * fl;
    for (let i = 0; i < NS_; i++) {
      const [a, b, c] = sparkSeed[i], life = (t * 0.45 + a * 3) % 1;
      sp[i * 3] = (Math.sin(t * 2 + b * 9) * 0.3 + (b - 0.5) * 0.5) * life;
      sp[i * 3 + 1] = 0.6 + life * 3.2;
      sp[i * 3 + 2] = (Math.cos(t * 1.7 + c * 9) * 0.3 + (c - 0.5) * 0.5) * life;
    }
    sparks.geometry.attributes.position.needsUpdate = true; sparks.material.opacity = 0.9 * fl;
    // camera: laag en dichtbij → hoger en verder, lichte draai; het kamp blijft rechts van het midden
    const az = lerp(18, -22, p), elv = lerp(10, 22, p), dist = lerp(6.5, 20, p);
    aimCam(cam, [lerp(0.4, 0.8, p), 0.9, lerp(-0.6, -1.2, p)], dist, elv, az);
    const floor = hAt(cam.position.x, cam.position.z) + 1.3;
    if (cam.position.y < floor) { cam.position.y = floor; cam.lookAt(lerp(0.4, 0.8, p), 0.9, lerp(-0.6, -1.2, p)); cam.updateMatrixWorld(); }
    cam.setViewOffset(1920, 1080, lerp(-120, -300, p), 0, 1920, 1080);
    cam.updateProjectionMatrix();
  }
  return { scene, cam, update };
})();
GL.add({ scene: CAMP.scene, cam: CAMP.cam, update: CAMP.update, vis: (t) => (t < CUE.cut[1] ? E.out(seg(t, 0, 1.0)) * (1 - E.inOut(seg(t, CUE.cut[0], CUE.cut[1]))) : 0) });
