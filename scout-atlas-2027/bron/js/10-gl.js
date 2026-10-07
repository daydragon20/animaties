/* ═════════════ WEBGL (three.js): renderer, hulpjes, scènebeheer ═════════════ */
const glCanvas = el("canvas", { id: "gl", width: 1920, height: 1080 }, stage);
THREE.ColorManagement.legacyMode = false;
const renderer = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: true, alpha: true, powerPreference: "high-performance" });
renderer.setPixelRatio(1);
renderer.setSize(1920, 1080, false);
renderer.setClearColor(0x000000, 0);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const labLayer = el("div", { class: "L" }, stage);   // labels die aan 3D-punten hangen
const sceneRoot = el("div", { class: "L" }, stage);  // DOM-lagen van de scènes
const col = (h) => new THREE.Color(h);

function project(cam, x, y, z) {
  const v = new THREE.Vector3(x, y, z).project(cam);
  return [(v.x + 1) * 960, (1 - v.y) * 540, v.z < 1 && v.z > -1];
}
function aimCam(cam, target, dist, elev, az) {
  const e = (elev * Math.PI) / 180, a = (az * Math.PI) / 180;
  cam.position.set(target[0] + dist * Math.cos(e) * Math.sin(a), target[1] + dist * Math.sin(e), target[2] + dist * Math.cos(e) * Math.cos(a));
  cam.lookAt(target[0], target[1], target[2]);
  cam.updateMatrixWorld();
}
const lerp3 = (a, b, p) => [lerp(a[0], b[0], p), lerp(a[1], b[1], p), lerp(a[2], b[2], p)];

// afgeronde plaat en doos (voor de rugzak)
function roundedRect(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
function roundedBox(w, h, d, r, bevel = 0.02) {
  const g = new THREE.ExtrudeGeometry(roundedRect(w - 2 * bevel, d - 2 * bevel, r), { depth: Math.max(0.001, h - 2 * bevel), bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 6 });
  g.rotateX(-Math.PI / 2); g.translate(0, -h / 2 + bevel, 0); // hoogte langs y, gecentreerd
  g.computeVertexNormals();
  return g;
}

/* — scènebeheer: per moment maximaal één 3D-scène; de canvas faded mee — */
const GL = { list: [], add(s) { this.list.push(s); return s; } };
renders.push((t) => {
  let shown = null, o = 0;
  for (const s of GL.list) { const v = s.vis(t); if (v > 0.001) { shown = s; o = v; break; } }
  for (const s of GL.list) if (s !== shown && s.hide) s.hide();
  if (shown) {
    shown.update(t);
    renderer.render(shown.scene, shown.cam);
  }
  op(glCanvas, o);
  op(labLayer, o); // labels volgen de 3D-scène (ook bij het in- en uitfaden)
});
