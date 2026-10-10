/* ═════════════ DE WERELDBOL (hoofdstuk 1, na het kampvuur) ═════════════
   Van het kamp naar de wereld: de bol hangt rechts, met een minuscuul kampvuur op België. De zon komt op
   boven Europa, daarna duiken we Europa in. */
const GLOBE = (() => {
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(30, 16 / 9, 0.05, 100);
  // textuur: atlaspapier, kandidaten mint, thuis goud
  const cv = document.createElement("canvas"); cv.width = 4096; cv.height = 2048;
  const g = cv.getContext("2d");
  const grd = g.createLinearGradient(0, 0, 0, 2048);
  grd.addColorStop(0, "#8fbdb5"); grd.addColorStop(0.5, "#b2d5cc"); grd.addColorStop(1, "#8fbdb5");
  g.fillStyle = grd; g.fillRect(0, 0, 4096, 2048);
  g.scale(2, 2);
  g.strokeStyle = "rgba(16,38,44,.14)"; g.lineWidth = 1; g.stroke(new Path2D(MAP.grat));
  for (const c of MAP.globe) {
    const p = new Path2D(c.d);
    g.fillStyle = c.home ? "#e3bd52" : c.nl ? "#9edcc1" : "#f3ead4";
    g.fill(p); g.strokeStyle = "rgba(16,38,44,.45)"; g.lineWidth = 0.7; g.stroke(p);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 8;
  const tilt = new THREE.Group(), spin = new THREE.Group();
  const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 160, 112), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92, metalness: 0 }));
  spin.add(earth); tilt.add(spin); scene.add(tilt);
  const haloMat = new THREE.ShaderMaterial({
    uniforms: { c: { value: col("#bfe9ff") }, k: { value: 1 } },
    vertexShader: "varying vec3 vN; void main(){ vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }",
    fragmentShader: "uniform vec3 c; uniform float k; varying vec3 vN; void main(){ float f = pow(clamp(-vN.z * 2.1, 0., 1.), 2.2); gl_FragColor = vec4(c, f*k); }",
    side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
  });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.12, 64, 48), haloMat));
  const sun = new THREE.DirectionalLight(0xfff2da, 1.9); scene.add(sun);
  const amb = new THREE.AmbientLight(0x9fc4d6, 0.06); scene.add(amb);
  const hemi = new THREE.HemisphereLight(0xfff8ea, 0x7f9f98, 0); scene.add(hemi);
  const moon = new THREE.DirectionalLight(0x9fb8d6, 0.22); moon.position.set(-2, 3, 4); scene.add(moon);
  // het kampvuur op België: een gloeiende stip die 's nachts zichtbaar is
  const surface = (lon, lat) => {
    const phi = ((lon + 180) / 180) * Math.PI, th = Math.PI / 2 - (lat * Math.PI) / 180;
    return new THREE.Vector3(-Math.cos(phi) * Math.sin(th), Math.cos(th), Math.sin(phi) * Math.sin(th));
  };
  const BE = surface(4.47, 50.65);
  const ember = new THREE.Mesh(new THREE.SphereGeometry(0.008, 10, 10), new THREE.MeshBasicMaterial({ color: col("#ffd27a") }));
  ember.position.copy(BE).multiplyScalar(1.004); spin.add(ember);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: (() => { const c = document.createElement("canvas"); c.width = c.height = 64; const x = c.getContext("2d"); const r = x.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, "rgba(255,190,90,.9)"); r.addColorStop(0.4, "rgba(255,150,60,.35)"); r.addColorStop(1, "rgba(255,120,40,0)"); x.fillStyle = r; x.fillRect(0, 0, 64, 64); const tx = new THREE.CanvasTexture(c); return tx; })(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.scale.set(0.09, 0.09, 1); glow.position.copy(BE).multiplyScalar(1.01); spin.add(glow);

  function face(lon, lat) {
    const phi = ((lon + 180) / 180) * Math.PI;
    spin.rotation.y = Math.PI / 2 - phi;
    tilt.rotation.x = (lat * Math.PI) / 180;
  }
  function update(t) {
    const p = E.inOut(seg(t, CUE.cut[0], CUE.sunrise[1]));
    face(lerp(-6, 13, p), lerp(49, 46, p));
    const th = (lerp(170, -38, E.inOut(seg(t, CUE.sunrise[0] - 1.2, CUE.sunrise[1]))) * Math.PI) / 180;
    sun.position.set(5 * Math.sin(th), 2.2, 5 * Math.cos(th));
    const l = lightAt(t);
    hemi.intensity = 0.55 * l; amb.intensity = 0.06 + 0.1 * l;
    moon.intensity = 0.22 * (1 - l);
    haloMat.uniforms.k.value = lerp(0.55, 0.4, l);
    const flick = 0.8 + 0.2 * Math.sin(t * 23) * Math.sin(t * 7.3);
    glow.material.opacity = (1 - l) * flick; ember.material.color.set(hexLerp("#e3bd52", "#ffd27a", 1 - l));
    const push = E.inOut2(seg(t, CUE.push, CUE.pushEnd));
    const dist = lerp(lerp(7.4, 6.4, E.inOut(seg(t, CUE.cut[0], CUE.sunrise[1]))), 1.5, push);
    cam.position.set(0, 0, dist); cam.lookAt(0, 0, 0);
    cam.setViewOffset(1920, 1080, lerp(-440, 0, E.inOut(seg(t, CUE.push - 0.4, CUE.pushEnd - 0.4))), 0, 1920, 1080);
    cam.updateProjectionMatrix();
  }
  return { scene, cam, update };
})();
GL.add({ scene: GLOBE.scene, cam: GLOBE.cam, update: GLOBE.update,
  vis: (t) => (t >= CUE.cut[1] - 0.05 && t < T.s2 + 0.15 ? E.inOut(seg(t, CUE.cut[1] - 0.05, CUE.cut[1] + 0.5)) * (1 - E.inOut(seg(t, CUE.pushEnd - 0.25, T.s2 + 0.15))) : 0) });
