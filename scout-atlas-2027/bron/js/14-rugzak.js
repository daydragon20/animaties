/* ═════════════ DE RUGZAK (3D, blijft draaien): 14 lagen, de zwaarste categorie onderaan ═════════════ */
const PACK = (() => {
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(30, 16 / 9, 0.1, 60);
  const hemi = new THREE.HemisphereLight(0xfff8ea, 0xb9ab8c, 0.85);
  const sun = new THREE.DirectionalLight(0xfff3e0, 1.05);
  sun.position.set(-3.2, 5.5, 4.2); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 1, far: 16 });
  sun.shadow.bias = -0.0006; sun.shadow.radius = 4;
  const rim = new THREE.DirectionalLight(0xbfe9ff, 0.35); rim.position.set(4, 2, -4);
  scene.add(hemi, sun, rim);
  const H = 1.56, totalW = byWeight.reduce((s, c) => s + catW[c], 0);
  // lagen van onder naar boven; de hoogte van een laag is zijn aandeel in de eindscore
  let yy = -H / 2;
  const slots = byWeight.map((c) => { const h = (H * catW[c]) / totalW, s = { c, y0: yy, h, yc: yy + h / 2 }; yy += h; return s; });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ opacity: 0.2 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -H / 2 - 0.02; floor.receiveShadow = true; scene.add(floor);

  const tilt = new THREE.Group(), spin = new THREE.Group();
  tilt.add(spin); scene.add(tilt);
  const layers = slots.map((s) => {
    const u = (s.yc + H / 2) / H;
    const w = lerp(1.34, 1.12, u), d = lerp(0.86, 0.7, u);
    const bevel = Math.min(0.022, s.h * 0.3);
    const mat = new THREE.MeshStandardMaterial({ color: col("#a5c2b6"), roughness: 0.72, metalness: 0.02, transparent: true });
    const m = new THREE.Mesh(roundedBox(w, Math.max(0.02, s.h - 0.016), d, 0.2, bevel), mat);
    m.castShadow = true; m.receiveShadow = true;
    spin.add(m);
    return { ...s, m, mat };
  });
  const fabric = new THREE.MeshStandardMaterial({ color: col("#dfd3b6"), roughness: 0.8, transparent: true });
  const green = new THREE.MeshStandardMaterial({ color: col("#2f8a6c"), roughness: 0.7, transparent: true });
  const gold = new THREE.MeshStandardMaterial({ color: col("#e3b04f"), roughness: 0.55, transparent: true });
  const extras = []; // delen die samen met de rugzak verschijnen
  const addX = (m) => { m.castShadow = true; spin.add(m); extras.push(m); return m; };
  const lid = addX(new THREE.Mesh(roundedBox(1.18, 0.3, 0.8, 0.2, 0.05), fabric));
  lid.position.set(0, H / 2 + 0.17, 0); lid.rotation.x = -0.05;
  const pocket = addX(new THREE.Mesh(roundedBox(0.8, 0.5, 0.16, 0.1, 0.04), fabric));
  pocket.position.set(0, -0.42, 0.43);
  const roll = addX(new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 1.3, 32), gold));
  roll.rotation.z = Math.PI / 2; roll.position.set(0, H / 2 + 0.47, 0);
  [-0.42, 0.42].forEach((x) => {
    const s = addX(new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.022, 8, 28), green));
    s.position.set(x, H / 2 + 0.47, 0); s.rotation.y = Math.PI / 2;
  });
  [-0.34, 0.34].forEach((x) => { // schouderbanden aan de achterkant
    const c = new THREE.CatmullRomCurve3([new THREE.Vector3(x, 0.58, -0.36), new THREE.Vector3(x * 1.1, 0.4, -0.53), new THREE.Vector3(x * 1.15, -0.2, -0.53), new THREE.Vector3(x * 1.3, -0.68, -0.36)]);
    addX(new THREE.Mesh(new THREE.TubeGeometry(c, 40, 0.05, 10, false), green));
  });

  // vaste camera (de rugzak draait, de camera niet); de rugzak staat rechts, de labels nog verder rechts
  aimCam(cam, [0, 0.3, 0], 6.8, 9, 0);
  cam.setViewOffset(1920, 1080, -290, 10, 1920, 1080);
  cam.updateProjectionMatrix(); cam.updateMatrixWorld();
  // schermpositie van het midden van elke laag (staat vast: het midden ligt op de draai-as)
  const screen = layers.map((l) => project(cam, 0, l.yc, 0));
  const topY = project(cam, 0, H / 2 + 0.7, 0)[1], botY = project(cam, 0, -H / 2, 0)[1];
  const cx = project(cam, 0, 0, 0)[0];
  const ppu = Math.abs(project(cam, 0, 1, 0)[1] - project(cam, 0, 0, 0)[1]); // pixels per eenheid
  const side = Math.abs(project(cam, 0.67, 0, 0)[0] - cx);
  const layerTimes = layers.map((l, i) => CUE.fillA + (i / (layers.length - 1)) * (CUE.fillB - CUE.fillA));

  // kleur per laag: grijsgroen; na de nadruk: de zware lagen groen, het uitzicht goud, de kosten koraal
  const HL = ["Veiligheid & gezondheid", "Avontuur & activiteiten", "Kamp"], SCENIC = "Landschap & wow-factor", COST = "Kostprijs";
  [...HL, SCENIC, COST].forEach((c) => { if (!CATS.includes(c)) throw new Error("Categorie ontbreekt: " + c); });
  const baseCol = (i) => (i % 2 ? "#b5cbbf" : "#9dbbae");
  function update(t) {
    const hl = E.inOut(seg(t, CUE.hl, CUE.hl + 0.5));
    const coral = E.inOut(seg(t, CUE.coral, CUE.coral + 0.5));
    const appear = E.out(seg(t, T.s2 + 9.0, T.s2 + 10.2));
    layers.forEach((l, i) => {
      const p = E.out(seg(t, layerTimes[i], layerTimes[i] + 0.6));
      l.m.visible = p > 0.001;
      l.m.position.y = l.yc + (1 - p) * 1.6;
      l.mat.opacity = p;
      let c = baseCol(i);
      const isHL = HL.includes(l.c), isScenic = l.c === SCENIC, isCost = l.c === COST;
      if (hl > 0.001) {
        const target = isHL ? "#0e7a5f" : isScenic ? "#e3b04f" : isCost && coral > 0.5 ? "#d24a2a" : i % 2 ? "#e2dccb" : "#d6cfba";
        c = hexLerp(c, target, hl);
      }
      l.mat.color.set(c);
    });
    const pe = E.out(seg(t, CUE.fillB + 0.2, CUE.fillB + 1.2));
    extras.forEach((m) => { m.visible = pe > 0.001; m.material.opacity = pe; });
    extras.forEach((m) => (m.userData.k = pe));
    lid.position.y = H / 2 + 0.17 + (1 - pe) * 0.9; roll.position.y = H / 2 + 0.47 + (1 - pe) * 1.4;
    // de rugzak draait altijd: rustig, met een kleine wiegende beweging
    const rt = t - (T.s2 + 9.0);
    spin.rotation.y = -0.5 + rt * 0.62 + 2.2 * (1 - appear);
    tilt.rotation.z = 0.03 * Math.sin(t * 0.9); tilt.rotation.x = 0.025 * Math.sin(t * 0.7 + 1);
    tilt.position.y = 0.025 * Math.sin(t * 1.3);
  }
  return { scene, cam, update, layers, screen, cx, side, ppu, topY, botY, layerTimes, HL, SCENIC, COST };
})();
GL.add({ scene: PACK.scene, cam: PACK.cam, update: PACK.update, vis: (t) =>
  t >= T.s2 + 8.8 && t < T.s3 ? E.inOut(seg(t, T.s2 + 8.8, T.s2 + 9.6)) * (1 - E.inOut(seg(t, T.s3 - 0.6, T.s3 - 0.1))) : 0 });
