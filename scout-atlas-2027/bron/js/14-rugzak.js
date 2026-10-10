/* ═════════════ DE RUGZAK (3D, blijft draaien): drie vakken, het zwaarste onderaan ═════════════
   Onderaan tier 1 (kostprijs en avontuur), dan tier 2 (kamperen), bovenaan tier 3 (de rest).
   De hoogte van een vak is zijn aandeel in de eindscore. */
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
  const H = 1.56;
  const tiersAsc = [...TIERS].sort((a, b) => a - b); // tier 1 onderaan
  let yy = -H / 2;
  const slots = tiersAsc.map((t) => { const h = (H * M.tierShare[t]) / 100, s = { t, y0: yy, h, yc: yy + h / 2 }; yy += h; return s; });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ opacity: 0.2 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -H / 2 - 0.02; floor.receiveShadow = true; scene.add(floor);

  const tilt = new THREE.Group(), spin = new THREE.Group();
  tilt.add(spin); scene.add(tilt);
  const layers = slots.map((s) => {
    const u = (s.yc + H / 2) / H;
    const w = lerp(1.34, 1.12, u), d = lerp(0.86, 0.7, u);
    const bevel = Math.min(0.03, s.h * 0.3);
    const mat = new THREE.MeshStandardMaterial({ color: col("#a5c2b6"), roughness: 0.72, metalness: 0.02, transparent: true });
    const m = new THREE.Mesh(roundedBox(w, Math.max(0.02, s.h - 0.02), d, 0.2, bevel), mat);
    m.castShadow = true; m.receiveShadow = true;
    spin.add(m);
    // naad tussen de vakken: een dun lint
    return { ...s, m, mat };
  });
  const fabric = new THREE.MeshStandardMaterial({ color: col("#dfd3b6"), roughness: 0.8, transparent: true });
  const green = new THREE.MeshStandardMaterial({ color: col("#2f8a6c"), roughness: 0.7, transparent: true });
  const gold = new THREE.MeshStandardMaterial({ color: col("#e3b04f"), roughness: 0.55, transparent: true });
  const extras = [];
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
  [-0.34, 0.34].forEach((x) => {
    const c = new THREE.CatmullRomCurve3([new THREE.Vector3(x, 0.58, -0.36), new THREE.Vector3(x * 1.1, 0.4, -0.53), new THREE.Vector3(x * 1.15, -0.2, -0.53), new THREE.Vector3(x * 1.3, -0.68, -0.36)]);
    addX(new THREE.Mesh(new THREE.TubeGeometry(c, 40, 0.05, 10, false), green));
  });

  // vaste camera; de rugzak staat links van het midden, de uitleg rechts
  aimCam(cam, [0, 0.62, 0], 7.2, 9, 0);
  cam.setViewOffset(1920, 1080, 300, 10, 1920, 1080);
  cam.updateProjectionMatrix(); cam.updateMatrixWorld();
  const screen = layers.map((l) => project(cam, 0, l.yc, 0));
  const topY = project(cam, 0, H / 2 + 0.7, 0)[1], botY = project(cam, 0, -H / 2, 0)[1];
  const cx = project(cam, 0, 0, 0)[0];
  const ppu = Math.abs(project(cam, 0, 1, 0)[1] - project(cam, 0, 0, 0)[1]);
  const side = Math.abs(project(cam, 0.67, 0, 0)[0] - cx);
  const W = CUE.wg;
  const layerTimes = layers.map((l, i) => W.layers[0] + (i / Math.max(1, layers.length - 1)) * (W.layers[1] - W.layers[0]));
  const baseCol = { 1: "#0e7a5f", 2: "#e3b04f", 3: "#b5cbbf" };
  function update(t) {
    const appear = E.out(seg(t, W.fly - 0.2, W.fly + 1.0));
    layers.forEach((l, i) => {
      const p = E.out(seg(t, layerTimes[i], layerTimes[i] + 0.6));
      l.m.visible = p > 0.001;
      l.m.position.y = l.yc + (1 - p) * 1.6;
      l.mat.opacity = p;
      const hl = E.inOut(seg(t, W.shares, W.shares + 0.5));
      l.mat.color.set(hexLerp(i % 2 ? "#b5cbbf" : "#9dbbae", baseCol[l.t] || "#b5cbbf", hl));
    });
    const pe = E.out(seg(t, W.layers[1] + 0.3, W.layers[1] + 1.3));
    extras.forEach((m) => { m.visible = pe > 0.001; m.material.opacity = pe; });
    lid.position.y = H / 2 + 0.17 + (1 - pe) * 0.9; roll.position.y = H / 2 + 0.47 + (1 - pe) * 1.4;
    const rt = t - (W.fly - 0.2);
    spin.rotation.y = -0.5 + rt * 0.55 + 2.2 * (1 - appear);
    tilt.rotation.z = 0.03 * Math.sin(t * 0.9); tilt.rotation.x = 0.025 * Math.sin(t * 0.7 + 1);
    tilt.position.y = 0.025 * Math.sin(t * 1.3);
  }
  return { scene, cam, update, layers, screen, cx, side, ppu, topY, botY, layerTimes, H };
})();
GL.add({ scene: PACK.scene, cam: PACK.cam, update: PACK.update, vis: (t) =>
  t >= CUE.wg.fly - 0.4 && t < CUE.wg.b ? E.inOut(seg(t, CUE.wg.fly - 0.4, CUE.wg.fly + 0.4)) * (1 - E.inOut(seg(t, CUE.wg.b - 0.6, CUE.wg.b - 0.1))) : 0 });
