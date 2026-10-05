/* ═════════════ 0 · DE VRAAG — zwart, drie zinnen, zonsopgang boven de aarde ═════════════ */
const PRO = {
  lines: [[3.0, 6.9], [7.5, 11.4], [12.0, 14.7]],
  globeIn: 14.7, title: 17.4, titleOut: 21.0, pull: 20.4, pins: 21.75, sub: 23.25, push: 25.9,
};
// lengte/breedte → punt op de bol (zelfde mapping als THREE.SphereGeometry)
function lonLat(lon, lat, r = 1) {
  const phi = ((lon + 180) / 360) * Math.PI * 2, th = ((90 - lat) / 180) * Math.PI;
  return new THREE.Vector3(-Math.cos(phi) * Math.sin(th) * r, Math.cos(th) * r, Math.sin(phi) * Math.sin(th) * r);
}
const GLOBE = GL.add((() => {
  const scene = new THREE.Scene();
  scene.background = col("#020506");
  const cam = new THREE.PerspectiveCamera(30, 16 / 9, 0.01, 200);
  // texturen: dag (kleur) en gloed (randen van de kandidaten)
  const S = 2;
  const cv = document.createElement("canvas"); cv.width = 2048 * S; cv.height = 1024 * S;
  const ev = document.createElement("canvas"); ev.width = 2048 * S; ev.height = 1024 * S;
  const g = cv.getContext("2d"), ge = ev.getContext("2d");
  const grd = g.createLinearGradient(0, 0, 0, cv.height);
  grd.addColorStop(0, "#0a1d26"); grd.addColorStop(0.5, "#0e2a34"); grd.addColorStop(1, "#0a1d26");
  g.fillStyle = grd; g.fillRect(0, 0, cv.width, cv.height);
  ge.fillStyle = "#000"; ge.fillRect(0, 0, ev.width, ev.height);
  g.scale(S, S); ge.scale(S, S);
  g.strokeStyle = "rgba(124,240,196,.08)"; g.lineWidth = 0.6; g.stroke(new Path2D(MAP.grat));
  const isCand = (n) => !!M.by[n];
  for (const c of MAP.globe) {
    const p = new Path2D(c.d);
    g.fillStyle = c.home ? "#8a6a2a" : c.nl && isCand(c.nl) ? "#2c6f5e" : "#26302f";
    g.fill(p); g.strokeStyle = "rgba(4,9,11,.7)"; g.lineWidth = 0.6; g.stroke(p);
    if (c.nl && isCand(c.nl)) { ge.strokeStyle = "rgba(124,240,196,.95)"; ge.lineWidth = 1.1; ge.stroke(p); ge.fillStyle = "rgba(124,240,196,.10)"; ge.fill(p); }
    if (c.home) { ge.fillStyle = "rgba(242,195,116,.55)"; ge.fill(p); }
  }
  const tex = new THREE.CanvasTexture(cv); tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 8;
  const etex = new THREE.CanvasTexture(ev); etex.encoding = THREE.sRGBEncoding; etex.anisotropy = 8;
  const tilt = new THREE.Group(), spin = new THREE.Group();
  const earthMat = new THREE.MeshStandardMaterial({ map: tex, emissiveMap: etex, emissive: col("#ffffff"), emissiveIntensity: 0.0, roughness: 0.78, metalness: 0 });
  const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 160, 120), earthMat);
  spin.add(earth); tilt.add(spin); scene.add(tilt);
  // atmosfeer: twee schillen (binnen en buiten) met een fresnel-gloed
  const atmo = new THREE.ShaderMaterial({
    uniforms: { c: { value: col("#7fd8ff") }, sun: { value: new THREE.Vector3(0, 1, -1) }, k: { value: 1 } },
    vertexShader: "varying vec3 vN; varying vec3 vW; void main(){ vN = normalize(mat3(modelMatrix)*normal); vec4 w = modelMatrix*vec4(position,1.); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }",
    fragmentShader: "uniform vec3 c; uniform vec3 sun; uniform float k; varying vec3 vN; varying vec3 vW; void main(){ vec3 V = normalize(cameraPosition - vW); float rim = 1. - abs(dot(vN, V)); float f = pow(rim, 6.0); float lit = 0.12 + 0.88*smoothstep(-0.25, 0.7, dot(vN, normalize(sun))); vec3 warm = mix(c, vec3(1.0,0.78,0.5), smoothstep(0.55, 0.95, dot(vN, normalize(sun)))*0.7); gl_FragColor = vec4(warm*f*lit*1.6*k, 1.); }",
    side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
  });
  const halo = new THREE.Mesh(new THREE.SphereGeometry(1.028, 128, 96), atmo);
  scene.add(halo);
  const atmo2 = atmo.clone(); atmo2.side = THREE.FrontSide; atmo2.uniforms = { c: { value: col("#9fe6ff") }, sun: atmo.uniforms.sun, k: { value: 0.22 } };
  const halo2 = new THREE.Mesh(new THREE.SphereGeometry(1.004, 96, 64), atmo2);
  scene.add(halo2);
  // zon: licht + gloeiende schijf + horizontale streep (lensflare)
  const sunL = new THREE.DirectionalLight(0xfff0d6, 2.4); scene.add(sunL);
  const amb = new THREE.AmbientLight(0x6f9ab0, 0.05); scene.add(amb);
  const sunSp = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW_TEX, color: col("#ffe2a8"), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  const streak = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW_TEX, color: col("#ffcf8a"), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW_TEX, color: col("#fffaf0"), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  scene.add(sunSp, streak, core);
  // sterren
  const rnd = mulberry32(17), N = 2600, sp = new Float32Array(N * 3), ss = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const u = rnd() * 2 - 1, a = rnd() * Math.PI * 2, r = 60;
    sp[i * 3] = Math.sqrt(1 - u * u) * Math.cos(a) * r; sp[i * 3 + 1] = u * r; sp[i * 3 + 2] = Math.sqrt(1 - u * u) * Math.sin(a) * r;
    ss[i] = rnd() < 0.06 ? 2.6 : 0.8 + rnd() * 1.1;
  }
  const sg = new THREE.BufferGeometry(); sg.setAttribute("position", new THREE.BufferAttribute(sp, 3)); sg.setAttribute("size", new THREE.BufferAttribute(ss, 1));
  const starMat = new THREE.ShaderMaterial({ uniforms: { k: { value: 1 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: "attribute float size; varying float vS; void main(){ vS = size; gl_PointSize = size*1.6; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }",
    fragmentShader: "uniform float k; varying float vS; void main(){ float d = length(gl_PointCoord-0.5); float a = smoothstep(0.5, 0.0, d); gl_FragColor = vec4(vec3(0.9,0.95,1.)*a*k*(0.35+vS*0.25), 1.); }" });
  scene.add(new THREE.Points(sg, starMat));
  // kandidaten op de bol
  const pins = CC.map((c, i) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW_TEX, color: col(COL.mint), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    s.position.copy(lonLat(GEO[c.name][0], GEO[c.name][1], 1.006));
    spin.add(s);
    return { c, s, order: i };
  });
  // volgorde van verschijnen: van west naar oost (Canada eerst)
  [...pins].sort((a, b) => GEO[a.c.name][0] - GEO[b.c.name][0]).forEach((p, k) => (p.k = k));
  const home = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW_TEX, color: col(COL.gold), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  home.position.copy(lonLat(GEO["België"][0], GEO["België"][1], 1.006)); spin.add(home);

  const face = (lon, lat) => { spin.rotation.y = -Math.PI / 2 - ((lon + 180) / 180) * Math.PI + Math.PI; tilt.rotation.x = (lat * Math.PI) / 180; };
  function update(t) {
    // 1) horizon-shot: de bol vult de onderkant van het beeld, de zon komt op achter de rand
    // 2) terugtrekken: de hele bol, Europa draait naar ons toe
    const pull = E.inOut2(seg(t, PRO.pull, PRO.pull + 3.4));
    const push = E.in(seg(t, PRO.push, T.s1 + 0.2));
    const rise = E.out(seg(t, PRO.globeIn, PRO.globeIn + 5.5));
    const lon = lerp(lerp(-40, -10, seg(t, PRO.globeIn, PRO.pull)), 12, pull), lat = lerp(18, 44, pull);
    face(lon + Math.sin(t * 0.2) * 1.5, lat);
    // camera
    const camA = new THREE.Vector3(0, 1.03, 1.95), tgtA = new THREE.Vector3(0, 1.32, 0);
    const camB = new THREE.Vector3(0, 0, 4.9), tgtB = new THREE.Vector3(0, 0, 0);
    const drift = seg(t, PRO.globeIn, PRO.pull) * 0.06;
    const cp = camA.clone().lerp(camB, pull).add(new THREE.Vector3(0, -drift, drift));
    const tp = tgtA.clone().lerp(tgtB, pull);
    cp.lerp(new THREE.Vector3(0.0, 0.25, 1.32), push);
    tp.lerp(new THREE.Vector3(0.0, 0.25, 0), push);
    cam.position.copy(cp); cam.lookAt(tp);
    cam.setViewOffset(1920, 1080, lerp(0, -420, pull * (1 - push)), 0, 1920, 1080);
    cam.updateProjectionMatrix();
    // zon: eerst achter de bol (tegenlicht), daarna links-voor
    const sunBack = new THREE.Vector3(0.0, lerp(0.85, 1.75, rise), -6);
    const sunFront = new THREE.Vector3(-5.5, 2.6, 4.2);
    const sunPos = sunBack.clone().lerp(sunFront, pull);
    sunL.position.copy(sunPos); sunL.intensity = lerp(1.6, 2.5, pull);
    atmo.uniforms.sun.value.copy(sunPos).normalize();
    const sunVis = (1 - pull) * E.out(seg(t, PRO.globeIn, PRO.globeIn + 2.4));
    sunSp.position.copy(new THREE.Vector3(0.0, lerp(0.86, 1.62, rise), -5));
    sunSp.scale.setScalar(lerp(0.7, 1.25, rise)); sunSp.material.opacity = sunVis;
    core.position.copy(sunSp.position); core.scale.setScalar(lerp(0.16, 0.24, rise)); core.material.opacity = sunVis;
    streak.position.copy(sunSp.position); streak.scale.set(lerp(5, 11, rise), 0.05, 1); streak.material.opacity = sunVis * 0.7;
    amb.intensity = 0.05 + 0.25 * pull;
    earthMat.emissiveIntensity = lerp(0.12, 1.0, pull) * (1 - push * 0.5);
    starMat.uniforms.k.value = E.out(seg(t, 0, 3)) * (1 - push);
    // pinnen
    pins.forEach((p) => {
      const a = PRO.pins + p.k * 0.075;
      const s = E.back(seg(t, a, a + 0.5));
      p.s.scale.setScalar(Math.max(0.0001, s * (0.075 + 0.02 * Math.sin(t * 3 + p.k))));
      p.s.material.opacity = s;
    });
    home.scale.setScalar(Math.max(0.0001, E.back(seg(t, PRO.pins - 0.4, PRO.pins + 0.2)) * 0.1));
    // HUD: coördinaten volgen de blik
    HUD.geo.lon = lon; HUD.geo.lat = lat; HUD.tag = "ZONSOPGANG";
  }
  return {
    scene, cam, update,
    vis: (t) => (t >= PRO.globeIn - 0.05 && t < T.s1 + 0.3 ? E.inOut(seg(t, PRO.globeIn, PRO.globeIn + 1.6)) : 0),
    post: (t) => ({ bloom: 1.0, th: 0.62, exposure: 1 }),
  };
})());

(function () {
  const L = el("div", { class: "L" }, sceneRootEl);
  // drie zinnen, gecentreerd, zoals in de referentie: één gedachte per keer
  const mk = (top, size) => el("div", { class: "a serif", style: `left:0;width:1920px;text-align:center;top:${top}px;font-size:${size}px;line-height:1.2;white-space:normal` }, L);
  const l1 = mk(498, 58), l2 = mk(470, 58), l3 = mk(470, 92);
  const w1 = words(l1, "Volgende *zomer* trekken we weg.");
  const l2a = el("div", {}, l2), l2b = el("div", { style: "margin-top:12px" }, l2);
  const w2a = words(l2a, `${MEMBERS[1] ? numWord(+MEMBERS[1]) : "Tien"} tot ${MEMBERS[2] ? numWord(+MEMBERS[2]).toLowerCase() : "vijftien"} verkenners.`);
  const w2b = words(l2b, "*Eén* rugzak elk.");
  const w3 = words(l3, "Maar *waarheen?*");
  // titel boven de opkomende zon
  const title = el("div", { class: "a", style: "left:0;width:1920px;text-align:center;top:190px" }, L);
  const tk = el("div", { class: "kick", style: `color:${COL.gold};font-size:16px;letter-spacing:.6em` }, title, `Verkenners · zomer ${YEAR}`);
  const tt = el("div", { class: "disp", style: "font-size:200px;margin-top:22px;letter-spacing:.14em" }, title, `Scout Atlas`);
  const ty = el("div", { class: "thin", style: `font-size:120px;color:${COL.gold};margin-top:10px;letter-spacing:.3em` }, title, YEAR);
  // ondertitel bij de bol
  const sub = el("div", { class: "a", style: "left:150px;top:400px;width:640px;white-space:normal" }, L);
  const sk = el("div", { class: "kick", style: `color:${COL.mint}` }, sub, "De kandidaten");
  const sh = el("div", { class: "serif", style: "font-size:84px;line-height:1.02;margin-top:22px" }, sub);
  const ws = words(sh, `*${numWord(CC.length)}* landen.`);
  const sh2 = el("div", { class: "serif", style: "font-size:84px;line-height:1.02" }, sub);
  const ws2 = words(sh2, "Eén kamp.");
  const sn = el("div", { class: "mono", style: `font-size:18px;color:${COL.muted};margin-top:30px;letter-spacing:.06em;line-height:1.7` }, sub,
    `${CC.filter((c) => c.region === "Europe").length} in Europa · ${CC.filter((c) => c.region === "Europe/Asia").map((c) => c.name).join(" en ")} op de grens met Azië · ${CC.filter((c) => !c.region.startsWith("Europe")).map((c) => c.name).join(", ")} over de oceaan`);
  renders.push((t) => {
    const o = t < T.s1 + 0.2 ? 1 : 0;
    op(L, o);
    if (!o) return;
    const [a1, a2, a3] = PRO.lines;
    inout(l1, t, a1[0], a1[1], 1.0, 14, 0.9); revealWords(w1, t, a1[0], 0.16, 1.1);
    inout(l2, t, a2[0], a2[1], 1.0, 14, 0.9); revealWords(w2a, t, a2[0], 0.14, 1.1); revealWords(w2b, t, a2[0] + 1.5, 0.16, 1.1);
    inout(l3, t, a3[0], a3[1], 1.0, 14, 0.7); revealWords(w3, t, a3[0], 0.38, 1.3);
    // titel: elke letter komt uit de gloed
    const ti = E.out(seg(t, PRO.title, PRO.title + 1.8)), to = E.inOut(seg(t, PRO.titleOut - 0.8, PRO.titleOut));
    set(title, ti * (1 - to), 0, (1 - ti) * 20, 1, 0, (1 - ti) * 16 + to * 10);
    tt.style.letterSpacing = lerp(0.42, 0.14, E.out(seg(t, PRO.title, PRO.title + 3.4))) + "em";
    ty.style.letterSpacing = lerp(0.7, 0.3, E.out(seg(t, PRO.title + 0.4, PRO.title + 3.6))) + "em";
    op(tk, E.out(seg(t, PRO.title + 0.8, PRO.title + 1.8)));
    inout(sub, t, PRO.sub - 0.3, T.s1 - 0.4, 0.8, 16, 0.5);
    revealWords(ws, t, PRO.sub - 0.2, 0.14, 1.0); revealWords(ws2, t, PRO.sub + 0.6, 0.14, 1.0);
    op(sn, E.out(seg(t, PRO.sub + 1.2, PRO.sub + 2.2)));
    op(sk, E.out(seg(t, PRO.sub - 0.3, PRO.sub + 0.6)));
  });
})();

// getallen voluit (voor zinnen en de stem)
function numWord(n) {
  const een = ["nul", "één", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen", "tien", "elf", "twaalf", "dertien", "veertien", "vijftien", "zestien", "zeventien", "achttien", "negentien"];
  const tien = ["", "", "twintig", "dertig", "veertig", "vijftig", "zestig", "zeventig", "tachtig", "negentig"];
  let s;
  if (n < 20) s = een[n];
  else if (n < 100) { const e = n % 10, z = Math.floor(n / 10); s = e ? een[e] + (een[e].endsWith("e") ? "ën" : "en") + tien[z] : tien[z]; s = s.replace("éénen", "eenen"); }
  else s = String(n);
  return s.charAt(0).toUpperCase() + s.slice(1);
}
