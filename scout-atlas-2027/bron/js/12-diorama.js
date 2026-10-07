/* ═════════════ HET DIORAMA VAN EUROPA (kandidaten en bestemming) ═════════════ */
/* — het diorama van Europa (scène 3 en het slot) — */
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
const DIO = (() => {
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(32, 16 / 9, 10, 9000);
  const hemi = new THREE.HemisphereLight(0xfff8ea, 0x8fb3aa, 0.75);
  const sun = new THREE.DirectionalLight(0xfff0d8, 0.95);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -1150, right: 1150, top: 800, bottom: -800, near: 10, far: 4000 });
  sun.shadow.bias = -0.0006;
  scene.add(hemi, sun, sun.target);
  const board = new THREE.Mesh(new THREE.BoxGeometry(2000, 30, 1160), new THREE.MeshStandardMaterial({ color: col("#86b9b3"), roughness: 1 }));
  board.position.y = -15; board.receiveShadow = true; scene.add(board);
  const lineMat = new THREE.LineBasicMaterial({ color: col("#10262c"), transparent: true, opacity: 0.32 });
  const list = [], by = {};
  for (const c of MAP.countries) {
    const rings = parseRings(c.d);
    if (!rings.length) continue;
    const shapes = rings.map((r) => new THREE.Shape(r.map(([x, y]) => new THREE.Vector2(x - 960, -(y - 540)))));
    const geo = new THREE.ExtrudeGeometry(shapes, { depth: 1, bevelEnabled: false, curveSegments: 1 });
    geo.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshStandardMaterial({ color: col("#e4dac0"), roughness: 0.86, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true; mesh.receiveShadow = true;
    const pts = [];
    rings.forEach((r) => r.forEach((a, i) => { const b = r[(i + 1) % r.length]; pts.push(a[0] - 960, 1, a[1] - 540, b[0] - 960, 1, b[1] - 540); }));
    const lg = new THREE.BufferGeometry(); lg.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    const grp = new THREE.Group(); grp.add(mesh, new THREE.LineSegments(lg, lineMat)); scene.add(grp);
    const name = c.nl || (c.home ? "België" : null);
    const rec = { name, grp, mat, cand: !!c.nl, top: c.nl ? isTop(c.nl) : false, home: !!c.home };
    list.push(rec); if (name) by[name] = rec;
  }
  // route België → winnaar
  const P = (n, y) => new THREE.Vector3(MAP.pts[n][0] - 960, y, MAP.pts[n][1] - 540);
  const a = P("België", 20), b = P(WIN.name, 42);
  const curve = new THREE.QuadraticBezierCurve3(a, new THREE.Vector3((a.x + b.x) / 2 - 40, 230, (a.z + b.z) / 2 - 30), b);
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 240, 4.2, 10, false), new THREE.MeshStandardMaterial({ color: col("#d9a21b"), emissive: col("#6a4800"), roughness: 0.5 }));
  tube.castShadow = true; scene.add(tube);
  const tubeCount = tube.geometry.index.count;
  const hiker = new THREE.Mesh(new THREE.SphereGeometry(8, 24, 16), new THREE.MeshStandardMaterial({ color: col("#fffaf0"), emissive: col("#5a4a20"), roughness: 0.4 }));
  hiker.castShadow = true; scene.add(hiker);
  const tent = new THREE.Mesh(new THREE.ConeGeometry(17, 32, 4), new THREE.MeshStandardMaterial({ color: col("#12876a"), roughness: 0.6 }));
  tent.rotation.y = Math.PI / 4; tent.castShadow = true; scene.add(tent);
  const tentAt = P(WIN.name, 42 + 16);

  // labels (DOM) per kandidaat: de plaats naast de stip wordt één keer berekend, zodat geen enkel label een ander of een stip raakt
  const labs = {};
  for (const n of pinOrder) {
    const w = el("div", { class: "lab3" }, labLayer);
    const dot = el("div", { class: "dot" }, w);
    const leader = el("div", { style: "position:absolute;left:0;top:-1px;height:2px;background:rgba(16,38,44,.6);transform-origin:0 50%;display:none" }, w);
    const pill = el("div", { class: "pill" }, w, n);
    labs[n] = { w, dot, pill, leader, cfg: [18, 0, "start"] };
  }
  const home = el("div", { class: "lab3" }, labLayer, `<div class="pill" style="background:#e3bd52;color:#10262c;transform:translate(-50%,-150%)">thuis</div>`);
  const canada = el("div", { class: "a mono", style: "left:100px;top:300px;font-size:30px;font-weight:600;color:#10262c;line-height:1.3" }, labLayer,
    `<span style="color:#0e7a5f">◀</span> Canada<br><span style="font-weight:500;font-size:26px;color:#34504a">over de oceaan</span>`);

  const BASE = 6;
  // camera tijdens de kandidaten: eerst hoog overzicht, dan naar Centraal-Europa; daarna rustig
  const camS3 = (lt) => {
    const p1 = E.inOut(seg(lt, 0, 3.6)), p2 = E.inOut(seg(lt, 3.0, 5.2));
    const target = lerp3(lerp3([20, 0, 10], [0, 0, 30], p1), [-25, 0, 50], p2);
    aimCam(cam, target, lerp(lerp(2500, 2250, p1), 1500, p2) - 20 * seg(lt, 5.2, 12), lerp(lerp(64, 56, p1), 50, p2), lerp(lerp(-8, -2, p1), 4, p2) + 0.5 * seg(lt, 5.2, 12));
    cam.clearViewOffset(); cam.updateProjectionMatrix();
  };
  function heightsS3(t, rec) {
    if (!rec.cand) return rec.home ? lerp(BASE, 14, E.out(seg(t, T.s3 + 0.6, T.s3 + 1.2))) : BASE;
    const a = CUE.pinA + pinOrder.indexOf(rec.name) * CUE.pinStep;
    const rise = E.back(seg(t, a, a + 0.5));
    const f = E.inOut(seg(t, CUE.focus, CUE.focus + 0.8));
    return BASE + 22 * rise + (rec.top ? 38 * f : -10 * f);
  }
  // plaats van de labels: voorrang voor de top 10, dan de rest; eerste kandidaatplek zonder botsing
  let placed = false;
  function placeLabels() {
    placed = true;
    camS3(6.0);
    const boxes = [], dots = [];
    const [hx0, hy0] = project(cam, MAP.pts["België"][0] - 960, 14, MAP.pts["België"][1] - 540);
    boxes.push([hx0 - 56, hy0 - 60, hx0 + 56, hy0 - 16]);   // het label "thuis"
    boxes.push([90, 290, 400, 400]);                          // "Canada, over de oceaan"
    const cand = [[18, 0, "start"], [-18, 0, "end"], [16, -30, "start"], [16, 30, "start"], [-16, -30, "end"], [-16, 30, "end"], [0, -34, "mid"], [0, 34, "mid"],
      [34, -62, "start"], [34, 62, "start"], [-34, -62, "end"], [-34, 62, "end"], [60, 0, "start"], [-60, 0, "end"], [0, -72, "mid"], [0, 72, "mid"],
      [50, -102, "start"], [50, 102, "start"], [-50, -102, "end"], [-50, 102, "end"], [80, -40, "start"], [80, 40, "start"], [-80, -40, "end"], [-80, 40, "end"]];
    const pos = {};
    for (const n of pinOrder) { const [x, y] = project(cam, MAP.pts[n][0] - 960, BASE + 22 + (isTop(n) ? 38 : -10), MAP.pts[n][1] - 540); pos[n] = [x, y]; dots.push([x - 12, y - 12, x + 12, y + 12]); }
    const hit = (a, b) => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];
    const area = (a, b) => Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));
    const order = [...pinOrder].sort((a, b) => (isTop(b) - isTop(a)) || (MAP.pts[a][0] - MAP.pts[b][0]));
    for (const n of order) {
      const [x, y] = pos[n], w = n.length * (isTop(n) ? 17.6 : 15.6) + 30, h = 40;
      let best = null, bestCost = Infinity;
      for (const c of cand) {
        const x0 = c[2] === "end" ? x + c[0] - w : c[2] === "mid" ? x + c[0] - w / 2 : x + c[0];
        const b = [x0, y + c[1] - h / 2, x0 + w, y + c[1] + h / 2];
        let cost = 0;
        boxes.forEach((o) => (cost += area(b, o) * 4));
        dots.forEach((o, i) => { if (pinOrder[i] !== n) cost += area(b, o) * 6; });
        if (b[0] < 40 || b[2] > 1880 || b[1] < 330 || b[3] > 1030) cost += 1e5;
        cost += Math.hypot(c[0], c[1]) * 0.08;
        if (cost < bestCost) { bestCost = cost; best = { c, b }; }
        if (cost < 1) break;
      }
      labs[n].cfg = best.c; boxes.push(best.b);
      const len = Math.hypot(best.c[0], best.c[1]);
      if (len > 34) { const ld = labs[n].leader; ld.style.display = "block"; ld.style.width = len - 4 + "px"; ld.style.transform = `rotate(${(Math.atan2(best.c[1], best.c[0]) * 180) / Math.PI}deg)`; }
    }
  }
  function updateS3(t) {
    const lt = t - T.s3;
    const f = E.inOut(seg(t, CUE.focus, CUE.focus + 0.8));
    camS3(lt);
    hemi.intensity = 0.58; hemi.color.set("#fff8ea");
    sun.color.set("#fff0d8"); sun.intensity = 0.85; sun.position.set(-700, 1100, 650); sun.target.position.set(0, 0, 0);
    for (const rec of list) {
      rec.grp.scale.y = heightsS3(t, rec);
      let c = "#e4dac0";
      if (rec.home) c = "#e3bd52";
      else if (rec.cand) {
        const a = CUE.pinA + pinOrder.indexOf(rec.name) * CUE.pinStep, r = seg(t, a, a + 0.3);
        c = hexLerp("#e4dac0", "#bfe3cf", r);
        c = rec.top ? hexLerp(c, "#4fc093", f) : hexLerp(c, "#ddd8c5", f);
      } else c = hexLerp("#e4dac0", "#e4dcc6", f);
      rec.mat.color.set(c); rec.mat.emissive.set("#000000");
    }
    tube.visible = false; hiker.visible = false; tent.visible = false;
    for (const n of pinOrder) {
      const L = labs[n], rec = by[n];
      const a = CUE.labelA + pinOrder.indexOf(n) * CUE.labelStep;
      const [x, y] = project(cam, MAP.pts[n][0] - 960, rec.grp.scale.y, MAP.pts[n][1] - 540);
      const o = E.out(seg(t, a, a + 0.35)) * (rec.top ? 1 : 1 - f);
      op(L.w, o);
      L.w.style.transform = `translate(${x}px,${y}px)`;
      const [dx, dy, anc] = L.cfg;
      L.pill.style.transform = `translate(${anc === "end" ? "-100%" : anc === "mid" ? "-50%" : "0"},-50%) translate(${dx}px,${dy}px)`;
      const hot = rec.top && f > 0.5;
      L.pill.style.background = hot ? "#0e7a5f" : "rgba(248,243,230,.95)";
      L.pill.style.color = hot ? "#f8f3e6" : "#10262c";
      L.pill.style.fontSize = hot ? "28px" : "25px";
      L.dot.style.background = hot ? "#e3bd52" : "#12876a";
    }
    const [hx, hy] = project(cam, MAP.pts["België"][0] - 960, by["België"].grp.scale.y, MAP.pts["België"][1] - 540);
    home.style.transform = `translate(${hx}px,${hy}px)`;
    op(home, win(lt, 0.9, 11.6, 0.4, 0.4));
    op(canada, win(lt, 1.0, 11.6, 0.4, 0.4) * (1 - 0.7 * f));
  }
  // de bestemming: gouden uur, route van thuis naar de winnaar
  function updateS8(t) {
    const lt = t - T.s8;
    const rp = E.inOut(seg(t, CUE.route, CUE.routeEnd));
    const fly = E.inOut2(seg(lt, 0, 11));
    const tA = [MAP.pts["België"][0] - 960 + 60, 0, MAP.pts["België"][1] - 540 + 40];
    const tB = [MAP.pts[WIN.name][0] - 960 + 40, 20, MAP.pts[WIN.name][1] - 540 - 40];
    aimCam(cam, lerp3(tA, tB, fly), lerp(1150, 900, fly), lerp(58, 40, fly), lerp(-28, 12, fly));
    cam.setViewOffset(1920, 1080, lerp(120, 380, fly), lerp(0, 20, fly), 1920, 1080);
    cam.updateProjectionMatrix();
    hemi.intensity = 0.55; hemi.color.set("#fff1dc");
    sun.color.set("#ffdcaa"); sun.intensity = 1.0; sun.position.set(-1200, 520, 240); sun.target.position.set(0, 0, 0);
    const up = E.back(seg(lt, 1.0, 1.8));
    for (const rec of list) {
      let h = BASE, c = "#e4dac0", em = "#000000";
      if (rec.name === WIN.name) { h = lerp(BASE, 42, up); c = "#4fc093"; em = hexLerp("#000000", "#0d4a39", up); }
      else if (rec.home) { h = 20; c = "#e3bd52"; }
      else if (rec.cand) c = "#e6e3cf";
      rec.grp.scale.y = h; rec.mat.color.set(c); rec.mat.emissive.set(em);
    }
    tube.visible = rp > 0;
    tube.geometry.setDrawRange(0, Math.floor((tubeCount * rp) / 6) * 6);
    const hp = curve.getPoint(Math.max(0.0001, rp));
    hiker.visible = rp > 0 && rp < 1;
    hiker.position.copy(hp).add(new THREE.Vector3(0, 6, 0));
    const tp = E.back(seg(t, CUE.routeEnd - 0.2, CUE.routeEnd + 0.4));
    tent.visible = tp > 0.001; tent.scale.setScalar(Math.max(0.001, tp)); tent.position.copy(tentAt);
    for (const n of pinOrder) op(labs[n].w, 0);
    op(canada, 0);
    const [hx, hy] = project(cam, MAP.pts["België"][0] - 960, 20, MAP.pts["België"][1] - 540);
    home.style.transform = `translate(${hx}px,${hy}px)`;
    op(home, E.out(seg(lt, 1.2, 1.8)));
  }
  function update(t) {
    if (!placed) placeLabels();
    if (t < T.s8 - 1) updateS3(t); else updateS8(t);
  }
  function hideLabels() { for (const n of pinOrder) op(labs[n].w, 0); op(home, 0); op(canada, 0); }
  return { scene, cam, update, hideLabels };
})();
GL.add({ scene: DIO.scene, cam: DIO.cam, update: DIO.update, hide: DIO.hideLabels, vis: (t) =>
  t >= T.s3 - 0.2 && t < T.s4 + 0.1 ? E.inOut(seg(t, T.s3 - 0.2, T.s3 + 0.5)) * (1 - E.inOut(seg(t, T.s4 - 0.5, T.s4 + 0.1)))
  : t >= T.s8 - 1.0 ? E.inOut(seg(t, T.s8 - 1.0, T.s8)) : 0 });
