/* ═════════════ DE WERELDBOL (scène 1) ═════════════ */
/* — de wereldbol — */
const GLOBE = (() => {
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(30, 16 / 9, 0.1, 100);
  const cv = document.createElement("canvas"); cv.width = 4096; cv.height = 2048;
  const g = cv.getContext("2d");
  const grd = g.createLinearGradient(0, 0, 0, 2048);
  grd.addColorStop(0, "#8fbdb5"); grd.addColorStop(0.5, "#b2d5cc"); grd.addColorStop(1, "#8fbdb5");
  g.fillStyle = grd; g.fillRect(0, 0, 4096, 2048);
  g.scale(2, 2);
  g.strokeStyle = "rgba(16,38,44,.14)"; g.lineWidth = 1; g.stroke(new Path2D(MAP.grat));
  for (const c of MAP.globe) {
    const p = new Path2D(c.d);
    g.fillStyle = c.home ? "#e3bd52" : c.nl ? (isTop(c.nl) ? "#5cc79c" : "#9edcc1") : "#f3ead4";
    g.fill(p); g.strokeStyle = "rgba(16,38,44,.45)"; g.lineWidth = 0.7; g.stroke(p);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 8;
  const tilt = new THREE.Group(), spin = new THREE.Group();
  const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 128, 96), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92, metalness: 0 }));
  spin.add(earth); tilt.add(spin); scene.add(tilt);
  const haloMat = new THREE.ShaderMaterial({
    uniforms: { c: { value: col("#bfe9ff") }, k: { value: 1 } },
    vertexShader: "varying vec3 vN; void main(){ vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }",
    fragmentShader: "uniform vec3 c; uniform float k; varying vec3 vN; void main(){ float f = pow(clamp(-vN.z * 2.1, 0., 1.), 2.2); gl_FragColor = vec4(c, f*k); }",
    side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
  });
  const halo = new THREE.Mesh(new THREE.SphereGeometry(1.12, 64, 48), haloMat);
  scene.add(halo);
  const sun = new THREE.DirectionalLight(0xfff2da, 1.9); scene.add(sun);
  const amb = new THREE.AmbientLight(0x9fc4d6, 0.06); scene.add(amb);
  const hemi = new THREE.HemisphereLight(0xfff8ea, 0x7f9f98, 0); scene.add(hemi);
  function update(t) {
    const p = E.inOut(seg(t, 0, 9.4));
    const lon = lerp(-80, 13, p), lat = lerp(18, 46, E.inOut(seg(t, 0.6, 9.4)));
    const phi = ((lon + 180) / 180) * Math.PI;
    spin.rotation.y = Math.PI / 2 - phi;
    tilt.rotation.x = (lat * Math.PI) / 180;
    // de zon komt op: van achter de bol naar linksvoor
    const th = (lerp(165, -38, E.inOut(seg(t, 0.4, 6.4))) * Math.PI) / 180;
    sun.position.set(5 * Math.sin(th), 2.2, 5 * Math.cos(th));
    const l = lightAt(t);
    hemi.intensity = 0.55 * l; amb.intensity = 0.06 + 0.1 * l;
    haloMat.uniforms.k.value = lerp(0.65, 0.4, l);
    // camera: bol rechts, op het einde duik naar Europa
    const push = E.in(seg(t, CUE.push, CUE.pushEnd));
    const dist = lerp(6.4, 1.55, E.inOut2(seg(t, CUE.push, CUE.pushEnd)));
    cam.position.set(0, 0, dist); cam.lookAt(0, 0, 0);
    cam.setViewOffset(1920, 1080, lerp(-440, 0, E.inOut(seg(t, CUE.push - 0.4, CUE.pushEnd - 0.4))), 0, 1920, 1080);
    cam.updateProjectionMatrix();
    return push;
  }
  return { scene, cam, update };
})();
GL.add({ scene: GLOBE.scene, cam: GLOBE.cam, update: GLOBE.update,
  vis: (t) => (t < T.s2 + 0.15 ? 1 - E.inOut(seg(t, CUE.pushEnd - 0.25, T.s2 + 0.15)) : 0) });

