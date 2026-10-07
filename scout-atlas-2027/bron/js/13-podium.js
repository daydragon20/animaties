/* ═════════════ HET PODIUM (3D) ═════════════ */
/* — het podium — */
const POD = (() => {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(col(D.bg), 1600, 3200);
  const cam = new THREE.PerspectiveCamera(30, 16 / 9, 10, 8000);
  const hemi = new THREE.HemisphereLight(0xfff8ea, 0xb9ab8c, 0.7);
  const sun = new THREE.DirectionalLight(0xfff3e0, 0.75);
  sun.position.set(-500, 900, 700); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -900, right: 900, top: 900, bottom: -900, near: 10, far: 3000 });
  sun.shadow.bias = -0.0008;
  const spot = new THREE.SpotLight(0xfff6da, 0, 2600, 0.32, 0.6, 1.2);
  spot.position.set(0, 1400, 400); spot.target.position.set(0, 300, 0); spot.castShadow = true;
  scene.add(hemi, sun, spot, spot.target);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(9000, 9000), new THREE.MeshStandardMaterial({ color: col("#ece3cd"), roughness: 1 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const spots = [{ r: CC[1], x: -400, rank: 2, c: "#d8cfb6" }, { r: CC[0], x: 0, rank: 1, c: "#4fc093" }, { r: CC[2], x: 400, rank: 3, c: "#cdbf9c" }];
  const faces = [];
  const blocks = spots.map((s) => {
    const h = 130 + (s.r.totalExact - CC[2].totalExact) * 130;
    const cv = document.createElement("canvas"); cv.width = 512; cv.height = 512;
    const tex = new THREE.CanvasTexture(cv); tex.encoding = THREE.sRGBEncoding;
    faces.push({ cv, tex, s });
    const side = new THREE.MeshStandardMaterial({ color: col(s.c), roughness: 0.7 });
    const front = new THREE.MeshStandardMaterial({ color: col("#ffffff"), map: tex, roughness: 0.7 });
    const geo = new THREE.BoxGeometry(290, 1, 240); geo.translate(0, 0.5, 0);
    const m = new THREE.Mesh(geo, [side, side, side, side, front, side]);
    m.castShadow = true; m.receiveShadow = true; m.position.x = s.x;
    scene.add(m);
    return { m, h, s, front };
  });
  function drawFaces() {
    for (const f of faces) {
      const g = f.cv.getContext("2d");
      g.fillStyle = f.s.c; g.fillRect(0, 0, 512, 512);
      g.fillStyle = f.s.rank === 1 ? "#0b3b2e" : "rgba(16,38,44,.55)";
      g.font = "800 400px 'Big Shoulders Display'"; g.textAlign = "center"; g.textBaseline = "middle";
      g.fillText(String(f.s.rank), 256, 286);
      f.tex.needsUpdate = true;
    }
  }
  drawFaces();
  // confetti
  const NC = 320, rnd = mulberry32(91);
  const conf = new THREE.InstancedMesh(new THREE.PlaneGeometry(12, 7), new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.6 }), NC);
  const cp = [];
  const palette = ["#12876a", "#e3bd52", "#d24a2a", "#4fc093", "#f8f3e6", "#10262c"].map(col);
  for (let i = 0; i < NC; i++) {
    const a = rnd() * Math.PI * 2, sp = 250 + rnd() * 650, upv = 500 + rnd() * 900;
    cp.push({ vx: Math.cos(a) * sp, vz: Math.sin(a) * sp * 0.6, vy: upv, rx: rnd() * 9, ry: rnd() * 9, rz: rnd() * 9, d: rnd() * 0.25 });
    conf.setColorAt(i, palette[i % palette.length]);
  }
  conf.castShadow = true; scene.add(conf);
  const dummy = new THREE.Object3D();
  // labels (DOM) boven elk blok
  const infoLayer = el("div", { class: "L" }, labLayer);
  const infos = blocks.map((b) => {
    const s = b.s, best = highestCat(s.r), worst = lowestCat(s.r), one = s.rank === 1;
    const e = el("div", { class: "a", style: "left:0;top:0;width:560px;height:0;transform-origin:50% 0" }, infoLayer);
    el("div", { class: "a", style: "left:0;bottom:0;width:560px;text-align:center;white-space:normal" }, e,
      `<div class="disp" style="font-size:${one ? 120 : 88}px;color:${one ? D.mint : D.ink}">${escapeHtml(s.r.name)}</div>` +
      `<div class="disp" style="font-size:${one ? 96 : 72}px;color:${one ? D.mint : D.ochre};margin-top:6px">${fTot(s.r)}</div>` +
      `<div class="serif" style="font-size:36px;color:${D.ink};margin-top:12px;line-height:1.1">${escapeHtml(s.r.profile)}</div>` +
      `<div class="mono" style="font-size:28px;font-weight:600;color:${D.mint};margin-top:16px">▲ ${escapeHtml(short(best))} ${fCat(s.r, best)}</div>` +
      `<div class="mono" style="font-size:28px;font-weight:600;color:${D.coral};margin-top:6px">▼ ${escapeHtml(short(worst))} ${fCat(s.r, worst)}</div>`);
    return { e, b };
  });
  const when = { 3: CUE.podium[0], 2: CUE.podium[1], 1: CUE.podium[2] };
  function update(t) {
    const lt = t - T.s7;
    const orbit = lerp(-9, 7, E.inOut2(seg(lt, 0, 14)));
    aimCam(cam, [0, 290, 0], lerp(1900, 1700, E.inOut2(seg(lt, 0, 14))), lerp(7, 11, seg(lt, 0, 14)), orbit);
    cam.updateProjectionMatrix();
    blocks.forEach((b, i) => {
      const a = when[b.s.rank];
      const g = E.back(seg(t, a, a + 0.6));
      b.m.scale.y = Math.max(0.001, b.h * g);
      b.m.visible = g > 0.001;
      const [x, y] = project(cam, b.s.x, b.h * g + 75, 115);
      const ii = E.out5(seg(t, a + 0.25, a + 0.7));
      infos[i].e.style.left = x - 280 + "px";
      infos[i].e.style.top = y - 18 + "px";
      set(infos[i].e, ii, 0, (1 - ii) * 30, b.s.rank === 1 ? lerp(1.15, 1, ii) : 1);
    });
    spot.intensity = 2.2 * E.out(seg(t, CUE.podium[2], CUE.podium[2] + 0.5));
    const tb = t - CUE.podium[2];
    conf.visible = tb > 0 && tb < 4.5;
    if (conf.visible) {
      for (let i = 0; i < NC; i++) {
        const c = cp[i], k = Math.max(0, tb - c.d);
        dummy.position.set(c.vx * k * 0.6, 380 + c.vy * k * 0.6 - 520 * k * k, c.vz * k * 0.6 + 60);
        if (dummy.position.y < 2) dummy.position.y = 2;
        dummy.rotation.set(c.rx * k, c.ry * k, c.rz * k);
        dummy.scale.setScalar(k > 0 ? Math.max(0.001, 1 - Math.max(0, tb - 3.5)) : 0.001);
        dummy.updateMatrix(); conf.setMatrixAt(i, dummy.matrix);
      }
      conf.instanceMatrix.needsUpdate = true;
    }
    op(infoLayer, 1 - E.in(seg(t, T.s8 - 0.5, T.s8)));
  }
  function hide() { op(infoLayer, 0); }
  return { scene, cam, update, hide, drawFaces };
})();
GL.add({ scene: POD.scene, cam: POD.cam, update: POD.update, hide: POD.hide, vis: (t) =>
  t >= T.s7 - 0.2 && t < T.s8 + 0.1 ? E.inOut(seg(t, T.s7 - 0.2, T.s7 + 0.3)) * (1 - E.inOut(seg(t, T.s8 - 0.5, T.s8 + 0.1))) : 0 });

