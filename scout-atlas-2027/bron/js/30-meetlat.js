/* ═════════════ 1 · DE MEETLAT — 188 vragen, 4.700 scores, de rugzak ═════════════ */
const ML = {
  helix: T.s1 + CARD_DUR, count: T.s1 + CARD_DUR + 0.4, countEnd: T.s1 + CARD_DUR + 4.2,
  collapse: T.s1 + 8.25, sphere: T.s1 + 9.0, scores: T.s1 + 9.4, sphereOut: T.s1 + 16.8,
  weigh: T.s1 + 17.25, packIn: T.s1 + 19.5, layers: T.s1 + 21.0, hl: T.s1 + 31.5, fact: T.s1 + 35.25, end: T.s2,
};
ML.layerAt = (i) => ML.layers + i * BEAT;

/* — de rugzak: één model, ook gebruikt als "wandelaar" in het slot — */
function roundedRect(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
function roundedBox(w, h, d, r, bevel = 0.02) {
  const g = new THREE.ExtrudeGeometry(roundedRect(w - 2 * bevel, d - 2 * bevel, r), { depth: h - 2 * bevel, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 6 });
  g.rotateX(-Math.PI / 2); g.translate(0, -h / 2 + bevel, 0); // hoogte langs y, gecentreerd
  g.computeVertexNormals();
  return g;
}
function makeBackpack(opts = {}) {
  const solid = !!opts.solid;
  const grp = new THREE.Group();
  const shellColor = opts.shell || COL.mint;
  const glass = glassMat(shellColor, 0.035, 0.6, 2.4);
  const fabric = new THREE.MeshStandardMaterial({ color: col(opts.fabric || "#1c4a40"), roughness: 0.75, metalness: 0.05 });
  const body = new THREE.Mesh(roundedBox(1.1, 1.55, 0.66, 0.2, 0.09), solid ? fabric : glass);
  grp.add(body);
  if (!solid) {
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(body.geometry, 35), new THREE.LineBasicMaterial({ color: col(shellColor), transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
    grp.add(edges); grp.userData.edges = edges;
  }
  const lid = new THREE.Mesh(roundedBox(1.04, 0.26, 0.72, 0.18, 0.08), solid ? fabric : glass);
  lid.position.set(0, 0.86, 0.02); lid.rotation.x = -0.06; grp.add(lid);
  const pocket = new THREE.Mesh(roundedBox(0.72, 0.5, 0.16, 0.1, 0.05), solid ? fabric : glass);
  pocket.position.set(0, -0.36, 0.38); grp.add(pocket);
  // matje bovenop
  const matM = new THREE.MeshStandardMaterial({ color: col("#e3b04f"), roughness: 0.55, emissive: col("#5a3c08"), emissiveIntensity: 0.4 });
  const mat = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.2, 28), matM);
  mat.rotation.z = Math.PI / 2; mat.position.set(0, 1.1, 0.0); grp.add(mat);
  const strapM = new THREE.MeshStandardMaterial({ color: col("#0e2a25"), roughness: 0.6 });
  [-0.36, 0.36].forEach((x) => { const s = new THREE.Mesh(new THREE.TorusGeometry(0.158, 0.018, 8, 28), strapM); s.position.set(x, 1.1, 0); s.rotation.y = Math.PI / 2; grp.add(s); });
  // schouderbanden achteraan
  [-0.28, 0.28].forEach((x) => {
    const c = new THREE.CatmullRomCurve3([new THREE.Vector3(x, 0.62, -0.36), new THREE.Vector3(x * 1.1, 0.4, -0.56), new THREE.Vector3(x * 1.15, -0.2, -0.56), new THREE.Vector3(x * 1.3, -0.68, -0.36)]);
    grp.add(new THREE.Mesh(new THREE.TubeGeometry(c, 40, 0.045, 10, false), fabric));
  });
  // drinkfles aan de zijkant
  const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.36, 24), solid ? new THREE.MeshStandardMaterial({ color: col(COL.mint), roughness: 0.3, emissive: col("#0d4a39"), emissiveIntensity: 0.6 }) : glassMat("#bfe9ff", 0.05, 0.8));
  bottle.position.set(0.62, -0.42, 0.05); grp.add(bottle);
  // karabiner + kompas
  const metal = new THREE.MeshStandardMaterial({ color: col("#d9d3c2"), roughness: 0.25, metalness: 0.9 });
  const kara = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.012, 8, 24), metal); kara.position.set(-0.6, 0.2, 0.12); kara.scale.set(0.7, 1.1, 1); grp.add(kara);
  const compass = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.03, 28), new THREE.MeshStandardMaterial({ color: col(COL.gold), roughness: 0.3, metalness: 0.7, emissive: col("#3a2a06"), emissiveIntensity: 0.5 }));
  compass.rotation.x = Math.PI / 2; compass.position.set(-0.6, 0.06, 0.14); grp.add(compass);
  grp.userData.glass = glass;
  return grp;
}

/* — 4.700 lichtpunten: elk punt is één score — */
const DATA3 = GL.add((() => {
  const scene = new THREE.Scene();
  scene.background = col(COL.night);
  const cam = new THREE.PerspectiveCamera(34, 16 / 9, 0.1, 200);
  const N = M.nScores;
  const pos = new Float32Array(N * 3), colr = new Float32Array(N * 3), size = new Float32Array(N), sph = [];
  let k = 0;
  const ga = Math.PI * (3 - Math.sqrt(5));
  CC.forEach((c, j) => V.forEach((v, i) => {
    const s = c.scores[i];
    const n = j * V.length + i;
    const y = 1 - (n / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = ga * n;
    sph.push([Math.cos(th) * r, y, Math.sin(th) * r]);
    const cc = col(s === 100 ? COL.gold : scoreCol(s));
    colr[k * 3] = cc.r; colr[k * 3 + 1] = cc.g; colr[k * 3 + 2] = cc.b;
    size[k] = s === 100 ? 5.5 : 2.2 + 2.6 * clamp((s - 60) / 40);
    k++;
  }));
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.BufferAttribute(colr, 3));
  g.setAttribute("size", new THREE.BufferAttribute(size, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms: { k: { value: 1 }, px: { value: 1 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true,
    vertexShader: "attribute float size; varying vec3 vC; uniform float px; void main(){ vC = color; vec4 mv = modelViewMatrix*vec4(position,1.); gl_PointSize = size*px*(9./-mv.z); gl_Position = projectionMatrix*mv; }",
    fragmentShader: "uniform float k; varying vec3 vC; void main(){ float d = length(gl_PointCoord-0.5); float a = smoothstep(0.5,0.0,d); gl_FragColor = vec4(vC*a*1.6*k, 1.); }",
  });
  const pts = new THREE.Points(g, mat);
  scene.add(pts);
  const rnd = mulberry32(3);
  const jitter = sph.map(() => [rnd() - 0.5, rnd() - 0.5, rnd() - 0.5]);
  function update(t) {
    const born = seg(t, ML.sphere - 0.2, ML.sphere + 1.6);
    const out = E.in(seg(t, ML.sphereOut - 0.6, ML.sphereOut + 0.5));
    const R = 1.85;
    for (let n = 0; n < N; n++) {
      const d = clamp(born * 1.6 - (n % 97) / 97 * 0.6);
      const e = E.out5(d), s = sph[n], j = jitter[n];
      const r = R * e * (1 + out * (2.5 + j[0] * 3));
      pos[n * 3] = s[0] * r + j[0] * 0.04; pos[n * 3 + 1] = s[1] * r + j[1] * 0.04; pos[n * 3 + 2] = s[2] * r + j[2] * 0.04;
    }
    g.attributes.position.needsUpdate = true;
    pts.rotation.y = t * 0.22; pts.rotation.x = 0.35 + Math.sin(t * 0.3) * 0.08;
    mat.uniforms.k.value = (1 - out) * E.out(seg(t, ML.sphere - 0.2, ML.sphere + 0.6));
    mat.uniforms.px.value = renderer.getPixelRatio();
    cam.position.set(0, 0, lerp(8.2, 7.4, seg(t, ML.sphere, ML.sphereOut))); cam.lookAt(0, 0, 0);
    cam.setViewOffset(1920, 1080, -440, 0, 1920, 1080); cam.updateProjectionMatrix();
    HUD.tag = "4.700 SCORES".replace("4.700", nl(N, 0));
  }
  return { scene, cam, update, vis: (t) => (t >= ML.sphere - 0.3 && t < ML.sphereOut + 0.5 ? 1 : 0), post: () => ({ bloom: 1.1, th: 0.45 }) };
})());

/* — de rugzak met 14 lagen — */
const PACK = GL.add((() => {
  const scene = new THREE.Scene();
  scene.background = col(COL.night);
  scene.fog = new THREE.Fog(col(COL.night), 9, 22);
  const cam = new THREE.PerspectiveCamera(30, 16 / 9, 0.1, 100);
  scene.add(new THREE.HemisphereLight(0xdff7ee, 0x0b1a1a, 0.55));
  const key = new THREE.DirectionalLight(0xfff1dc, 1.6); key.position.set(-3, 4, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0x7cf0c4, 1.3); rim.position.set(4, 2, -4); scene.add(rim);
  // vloer: een ring van licht onder de rugzak
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.95, 1.0, 96), new THREE.MeshBasicMaterial({ color: col(COL.mint), transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = -1.02; scene.add(ring);
  const ring2 = ring.clone(); ring2.scale.setScalar(1.45); ring2.material = ring.material.clone(); ring2.material.opacity = 0.18; scene.add(ring2);
  const floorGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW_TEX, color: col("#1f776b"), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  floorGlow.scale.set(4, 1.2, 1); floorGlow.position.y = -1.05; scene.add(floorGlow);
  // stofdeeltjes
  const rnd = mulberry32(8), ND = 500, dp = new Float32Array(ND * 3);
  for (let i = 0; i < ND; i++) { dp[i * 3] = (rnd() - 0.5) * 12; dp[i * 3 + 1] = (rnd() - 0.5) * 7; dp[i * 3 + 2] = (rnd() - 0.5) * 8 - 2; }
  const dg = new THREE.BufferGeometry(); dg.setAttribute("position", new THREE.BufferAttribute(dp, 3));
  const dust = new THREE.Points(dg, new THREE.PointsMaterial({ color: col("#9fdcc8"), size: 0.025, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(dust);

  const pivot = new THREE.Group(); scene.add(pivot);
  const pack = makeBackpack(); pivot.add(pack);
  // lagen binnenin: zwaarste onderaan, dikte = aandeel in de eindscore
  const stackH = 1.32, bottom = -0.7, inner = [0.88, 0.48];
  let y = bottom;
  const shares = M.byWeight.map((c) => M.catShare[c]);
  const maxS = Math.max(...shares), minS = Math.min(...shares);
  const layers = M.byWeight.map((c, i) => {
    const h = (M.catShare[c] / 100) * stackH;
    const base = col(RAMP[Math.round(lerp(3, 8, (M.catShare[c] - minS) / (maxS - minS)))]);
    const m = new THREE.MeshStandardMaterial({ color: base.clone(), roughness: 0.45, metalness: 0.1, emissive: base.clone(), emissiveIntensity: 0.35 });
    const mesh = new THREE.Mesh(roundedBox(inner[0], Math.max(0.012, h - 0.012), inner[1], 0.08, Math.min(0.02, h * 0.3)), m);
    const cy = y + h / 2; y += h;
    pack.add(mesh);
    return { c, h, cy, mesh, m, base, i };
  });
  const HL = M.byWeight.slice(0, 3);
  function update(t) {
    const lt = t - ML.weigh;
    // altijd draaien; bij binnenkomst sneller, daarna rustig
    const enter = E.out5(seg(t, ML.packIn, ML.packIn + 1.6));
    pivot.rotation.y = t * 0.62 + (1 - enter) * 4.0;
    pivot.rotation.x = Math.sin(t * 0.7) * 0.05;
    pivot.rotation.z = Math.sin(t * 0.43) * 0.03;
    pivot.position.y = lerp(-3.2, 0, enter) + Math.sin(t * 1.3) * 0.03;
    pivot.scale.setScalar(lerp(0.6, 1, enter));
    pack.userData.glass.uniforms.k.value = enter;
    if (pack.userData.edges) pack.userData.edges.material.opacity = 0.5 * enter;
    const hl = E.inOut(seg(t, ML.hl, ML.hl + 0.6)) * (1 - E.inOut(seg(t, ML.fact + 2.4, ML.fact + 3.2)));
    layers.forEach((L) => {
      const a = ML.layerAt(L.i);
      const p = seg(t, a - 0.45, a);
      const bounce = p < 1 ? E.in2(p) : 1;
      const landed = t - a;
      const sq = landed > 0 && landed < 0.35 ? Math.sin((landed / 0.35) * Math.PI) * 0.12 : 0;
      L.mesh.position.y = L.cy + (1 - bounce) * 2.4;
      L.mesh.scale.set(1 + sq * 0.6, 1 - sq, 1 + sq * 0.6);
      L.mesh.visible = p > 0;
      const isHL = HL.includes(L.c);
      L.m.color.copy(L.base).lerp(col(COL.gold), isHL ? hl : 0);
      L.m.emissive.copy(L.base).lerp(col(isHL ? COL.gold : "#071413"), isHL ? hl : hl * 0.7);
      L.m.emissiveIntensity = 0.35 + (isHL ? hl * 0.55 : 0) + (landed > 0 && landed < 0.5 ? (0.5 - landed) * 1.6 : 0);
    });
    ring.scale.setScalar(1 + Math.sin(t * 2) * 0.02);
    dust.rotation.y = t * 0.02; dust.position.y = Math.sin(t * 0.2) * 0.2;
    aimCam(cam, [0, 0.12, 0], lerp(7.8, 6.6, E.inOut2(seg(t, ML.packIn, ML.end))), lerp(10, 16, seg(t, ML.packIn, ML.end)), Math.sin(t * 0.18) * 6);
    cam.setViewOffset(1920, 1080, -40, 0, 1920, 1080); cam.updateProjectionMatrix();
    HUD.tag = "GEWICHT PER CATEGORIE";
  }
  const vis = (t) => (t >= ML.weigh - 0.1 && t < ML.end + 0.1 ? E.inOut(seg(t, ML.weigh - 0.1, ML.weigh + 1.0)) * (1 - E.inOut(seg(t, ML.end - 0.6, ML.end))) : 0);
  return { scene, cam, update, vis, layers, pack, pivot, post: () => ({ bloom: 0.95, th: 0.55 }) };
})());

/* — DOM: helix van vragen, teller, labels bij de lagen, het feit — */
(function () {
  const L = el("div", { class: "L" }, sceneRootEl);
  // de helix: elke vraag een regel tekst, als een spiraal rond een as
  const HX = el("div", { class: "L" }, L);
  const labs = V.map((v, i) => {
    const e = el("div", { class: "a mono", style: "left:0;top:0;font-size:24px;letter-spacing:.01em;transform-origin:0 50%" }, HX);
    e.innerHTML = `<span style="color:${COL.muted}">${String(v.id).padStart(3, "0")}</span>&nbsp;&nbsp;${escapeHtml(v.name)} <span style="font-size:15px;color:${COL.muted};letter-spacing:.08em">&nbsp;${escapeHtml(short(v.category).toUpperCase())} · ${nl(v.weight, 3)}</span>`;
    return e;
  });
  const focusLine = el("div", { class: "a", style: `left:960px;top:${540 - 1}px;width:30px;height:2px;background:${COL.mint}` }, HX);
  // teller links
  const cnt = el("div", { class: "a", style: "left:150px;top:300px" }, L);
  const ck = el("div", { class: "kick", style: `color:${COL.mint}` }, cnt, "Wat we vroegen");
  const cn = el("div", { class: "thin", style: "font-size:330px;margin-top:8px;font-variant-numeric:tabular-nums" }, cnt, "0");
  const cl = el("div", { class: "it", style: "font-size:60px;margin-top:-6px" }, cnt, "vragen. Aan elk land.");
  const cs = el("div", { class: "mono", style: `font-size:19px;color:${COL.muted};margin-top:22px;letter-spacing:.04em` }, cnt, `verdeeld over ${CATS.length} categorieën · van veiligheid tot vuurregels`);
  // scores
  const sc = el("div", { class: "a", style: "left:150px;top:300px" }, L);
  const sk = el("div", { class: "kick", style: `color:${COL.gold}` }, sc, "Samen");
  const sn = el("div", { class: "thin", style: "font-size:330px;margin-top:8px;font-variant-numeric:tabular-nums" }, sc, "0");
  const sl = el("div", { class: "it", style: "font-size:60px;margin-top:-6px" }, sc, "scores.");
  const sf = el("div", { class: "mono", style: `font-size:21px;color:${COL.soft};margin-top:22px;letter-spacing:.04em` }, sc,
    `${V.length} vragen × ${CC.length} landen · elk lichtpuntje is één score · <span style="color:${COL.gold}">goud = 100</span>`);
  // "Niet elke vraag weegt even zwaar."
  const wq = el("div", { class: "a serif", style: "left:0;width:1920px;text-align:center;top:470px;font-size:76px" }, L);
  const ww = words(wq, "Niet elke vraag weegt *even zwaar.*");
  // titel linksboven tijdens de lagen
  const head = el("div", { class: "a", style: "left:150px;top:170px;width:520px;white-space:normal" }, L);
  el("div", { class: "kick", style: `color:${COL.mint}` }, head, "De rugzak");
  const hh = el("div", { class: "serif", style: "font-size:50px;line-height:1.08;margin-top:18px" }, head);
  const hw = words(hh, "Het zwaarste gaat *onderaan.*");
  el("div", { class: "mono", style: `font-size:18px;line-height:1.65;color:${COL.muted};margin-top:22px;letter-spacing:.02em` }, head,
    "Elke laag is een categorie. Hoe dikker de laag, hoe meer ze meetelt in de eindscore.");
  // labels rechts van de rugzak
  const lab = M.byWeight.map((c) => {
    const e = el("div", { class: "a", style: "left:0;top:0;height:0" }, labLayer);
    const ln = sv("svg", { width: 300, height: 120, style: "position:absolute;left:0;top:0;overflow:visible" }, e);
    const path = sv("path", { fill: "none", stroke: COL.paper, "stroke-opacity": 0.35, "stroke-width": 1.2 }, ln);
    const tx = el("div", { class: "a", style: "left:0;top:0;transform:translateY(-50%);display:flex;align-items:baseline;gap:14px" }, e);
    const pct = el("span", { class: "thin", style: "font-size:34px;width:86px;text-align:right;font-variant-numeric:tabular-nums" }, tx, nl(M.catShare[c], 0) + "%");
    const nm = el("span", { class: "mono", style: "font-size:18px;font-weight:500" }, tx, c);
    const nq = el("span", { class: "mono", style: `font-size:15px;color:${COL.muted}` }, tx, `${M.catN[c]} vragen`);
    return { c, e, path, tx, pct, nm, nq };
  });
  // het feit: zwaarste vs lichtste vraag
  const fact = el("div", { class: "a", style: "left:150px;top:690px;width:620px;white-space:normal" }, L);
  el("div", { class: "kick", style: `color:${COL.gold}` }, fact, "Eén vraag tegen één vraag");
  const fx = el("div", { style: "display:flex;gap:36px;align-items:flex-end;margin-top:18px" }, fact);
  const fa = el("div", {}, fx, `<div class="thin" style="font-size:96px;color:${COL.gold}">${nl(M.heaviest.weight, 3)}</div><div class="mono" style="font-size:17px;color:${COL.soft};margin-top:6px">${escapeHtml(M.heaviest.name)}</div>`);
  el("div", { class: "it", style: `font-size:40px;color:${COL.muted};padding-bottom:30px` }, fx, "vs");
  const fb = el("div", {}, fx, `<div class="thin" style="font-size:96px">${nl(M.lightest.weight, 3)}</div><div class="mono" style="font-size:17px;color:${COL.soft};margin-top:6px">${escapeHtml(M.lightest.name)}</div>`);
  const fl = el("div", { class: "serif", style: "font-size:34px;margin-top:22px;line-height:1.2" }, fact,
    `Een veiligheidsvraag weegt <span class="it gold">${nl(M.heaviest.weight / M.lightest.weight, 1)} keer</span> zoveel.`);

  renders.push((t) => {
    const on = t >= T.s1 && t < T.s2 + 0.2;
    op(L, on ? 1 : 0);
    lab.forEach((l) => op(l.e, 0));
    if (!on) return;
    // de rol: elke vraag een regel op een draaiende trommel (leesbaar vooraan, wegdraaiend naar boven en onder)
    const hIn = E.out(seg(t, ML.helix, ML.helix + 1.2)), col_ = E.inOut(seg(t, ML.collapse, ML.collapse + 0.9));
    op(HX, hIn * (1 - E.in(seg(t, ML.collapse + 0.3, ML.collapse + 0.95))));
    if (t < ML.collapse + 1) {
      const cx = 1010, cy = 540, R = 1250, P = 1900, step = (Math.PI * 2) / V.length;
      const phi = (t - ML.helix) * 0.36 + E.in(seg(t, ML.collapse - 1.2, ML.collapse + 0.9)) * 1.6;
      labs.forEach((e, i) => {
        let th = i * step - phi + 0.55;
        th = Math.atan2(Math.sin(th), Math.cos(th));
        if (Math.abs(th) > 0.9) { e.style.opacity = 0; return; }
        const y = Math.sin(th) * R * (1 - col_), z = (Math.cos(th) - 1) * R;
        const s = P / (P - z);
        const front = Math.pow(Math.cos(th), 14);
        e.style.transform = `translate(${cx + (1 - s) * 400}px,${cy + y * s - 12}px) scale(${s * (1 + front * 0.35)},${s * Math.cos(th) * (1 + front * 0.35)})`;
        e.style.opacity = (0.12 + 0.88 * Math.pow(Math.cos(th), 6)) * (1 - col_);
        e.style.color = front > 0.6 ? COL.mint : COL.paper;
      });
    }
    // teller 0 → 188
    const cp = E.out(seg(t, ML.count, ML.countEnd));
    cn.textContent = String(Math.round(cp * V.length));
    inout(cnt, t, ML.helix + 0.1, ML.collapse + 0.6, 0.8, 20, 0.6);
    op(cl, E.out(seg(t, ML.countEnd - 0.6, ML.countEnd + 0.4)));
    op(cs, E.out(seg(t, ML.countEnd + 0.3, ML.countEnd + 1.2)));
    op(ck, E.out(seg(t, ML.helix, ML.helix + 0.8)));
    // 4.700 scores
    const sp = E.out(seg(t, ML.scores, ML.scores + 2.4));
    sn.textContent = nl(Math.round(lerp(V.length, M.nScores, sp)), 0);
    inout(sc, t, ML.scores - 0.2, ML.sphereOut, 0.8, 20, 0.6);
    op(sl, E.out(seg(t, ML.scores + 1.6, ML.scores + 2.4)));
    op(sf, E.out(seg(t, ML.scores + 2.6, ML.scores + 3.4)));
    // niet elke vraag…
    inout(wq, t, ML.weigh, ML.packIn + 0.2, 0.8, 16, 0.6); revealWords(ww, t, ML.weigh, 0.13, 1.0);
    inout(head, t, ML.layers - 0.6, ML.fact - 0.2, 0.8, 16, 0.6); revealWords(hw, t, ML.layers - 0.6, 0.12, 1.0);
    // labels: vastgemaakt aan de rechterrand van de rugzak, op de hoogte van elke laag
    if (t >= ML.layers - 0.5 && t < ML.end) {
      const P = PACK, ys = [];
      const pts = P.layers.map((Ly) => {
        const wp = new THREE.Vector3(0, Ly.cy, 0).applyMatrix4(P.pivot.matrixWorld);
        const [x, y] = project(P.cam, wp.x + 0.68, wp.y, wp.z);
        return [x, y];
      });
      pts.forEach((p) => ys.push(p[1]));
      for (let i = 1; i < ys.length; i++) if (ys[i - 1] - ys[i] < 31) ys[i] = ys[i - 1] - 31;
      const hl = E.inOut(seg(t, ML.hl, ML.hl + 0.6)) * (1 - E.inOut(seg(t, ML.fact - 0.4, ML.fact + 0.4)));
      lab.forEach((l, i) => {
        const a = ML.layerAt(i);
        const o = E.out(seg(t, a, a + 0.5)) * (1 - E.inOut(seg(t, ML.end - 0.6, ML.end))) * PACK.vis(t);
        const isHL = i < 3;
        op(l.e, o * (isHL ? 1 : lerp(1, 0.45, hl)));
        const [x0, y0] = pts[i], x1 = Math.max(x0 + 40, 1290);
        l.e.style.transform = `translate(${x0}px,${y0}px)`;
        l.path.setAttribute("d", `M0 0 L${x1 - x0 - 30} ${ys[i] - y0} L${x1 - x0} ${ys[i] - y0}`);
        l.tx.style.left = x1 - x0 + 10 + "px"; l.tx.style.top = ys[i] - y0 + "px";
        l.pct.style.color = isHL && hl > 0.5 ? COL.gold : COL.paper;
        l.nm.style.color = isHL && hl > 0.5 ? COL.gold : COL.paper;
        l.tx.style.transform = `translateY(-50%) translateX(${(1 - E.out5(seg(t, a, a + 0.6))) * 30}px)`;
      });
    }
    inout(fact, t, ML.fact, ML.end - 0.2, 0.9, 18, 0.6);
    set(fa, E.out(seg(t, ML.fact + 0.2, ML.fact + 1.0)), 0, 0);
    set(fb, E.out(seg(t, ML.fact + 0.9, ML.fact + 1.7)), 0, 0);
    op(fl, E.out(seg(t, ML.fact + 1.8, ML.fact + 2.6)));
  });
})();
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
