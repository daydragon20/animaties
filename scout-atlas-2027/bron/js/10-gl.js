/* ═════════════ WEBGL: renderer, gloed (bloom), scènebeheer ═════════════ */
const glCanvas = el("canvas", { id: "gl", width: 1920, height: 1080 }, stage);
THREE.ColorManagement.legacyMode = false;
const renderer = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: false, alpha: false, powerPreference: "high-performance" });
renderer.setPixelRatio(1);
renderer.setSize(1920, 1080, false);
renderer.setClearColor(0x04090b, 1);
renderer.outputEncoding = THREE.LinearEncoding; // de eindpass zet zelf om naar sRGB
renderer.toneMapping = THREE.NoToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
sceneRootEl = el("div", { class: "L" }, stage);       // DOM-lagen van de scènes
const labLayer = el("div", { class: "L" }, stage);    // labels die aan 3D-punten hangen
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

// zachte gloeiende stip als textuur (sprites, deeltjes)
const GLOW_TEX = (() => {
  const cv = document.createElement("canvas"); cv.width = cv.height = 128;
  const g = cv.getContext("2d"), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.18, "rgba(255,255,255,.75)"); gr.addColorStop(0.45, "rgba(255,255,255,.18)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(cv); return t;
})();
// "hologram-glas": doorschijnend met een heldere rand (fresnel)
function glassMat(color, base = 0.06, rim = 0.75, power = 2.2) {
  return new THREE.ShaderMaterial({
    uniforms: { c: { value: col(color) }, base: { value: base }, rim: { value: rim }, pw: { value: power }, k: { value: 1 } },
    vertexShader: "varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }",
    fragmentShader: "uniform vec3 c; uniform float base, rim, pw, k; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.-abs(dot(normalize(vN), normalize(vV))), pw); gl_FragColor = vec4(c*(0.6+1.6*f), (base + rim*f)*k); }",
    transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
  });
}

/* — nabewerking: scène → HDR-buffer → heldere delen vervagen → terug optellen — */
const POST = (() => {
  const isGL2 = renderer.capabilities.isWebGL2;
  const mk = (w, h, ms) => new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples: ms && isGL2 ? 4 : 0, depthBuffer: !!ms });
  let W = 1920, H = 1080;
  let rtS = mk(W, H, true), rtA = mk(W / 2, H / 2), rtB = mk(W / 2, H / 2), rtC = mk(W / 4, H / 4), rtD = mk(W / 4, H / 4);
  const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quadScene = new THREE.Scene();
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), null);
  quadScene.add(quad);
  const VS = "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy,0.,1.); }";
  const bright = new THREE.ShaderMaterial({ uniforms: { tex: { value: null }, th: { value: 0.72 } }, vertexShader: VS,
    fragmentShader: "uniform sampler2D tex; uniform float th; varying vec2 vUv; void main(){ vec3 c = texture2D(tex,vUv).rgb; float l = max(c.r,max(c.g,c.b)); gl_FragColor = vec4(c*smoothstep(th, th+0.45, l), 1.); }" });
  const blur = new THREE.ShaderMaterial({ uniforms: { tex: { value: null }, dir: { value: new THREE.Vector2() } }, vertexShader: VS,
    fragmentShader: "uniform sampler2D tex; uniform vec2 dir; varying vec2 vUv; void main(){ vec3 s = texture2D(tex,vUv).rgb*0.2270270; " +
      "s += texture2D(tex,vUv+dir*1.3846154).rgb*0.3162162; s += texture2D(tex,vUv-dir*1.3846154).rgb*0.3162162; " +
      "s += texture2D(tex,vUv+dir*3.2307692).rgb*0.0702703; s += texture2D(tex,vUv-dir*3.2307692).rgb*0.0702703; gl_FragColor = vec4(s,1.); }" });
  const comp = new THREE.ShaderMaterial({
    uniforms: { tex: { value: null }, b1: { value: null }, b2: { value: null }, k: { value: 0.9 }, ca: { value: 0.0012 }, exposure: { value: 1 }, lift: { value: 0 } },
    vertexShader: VS,
    fragmentShader: `uniform sampler2D tex, b1, b2; uniform float k, ca, exposure, lift; varying vec2 vUv;
      // zachte knie: alles onder 0,8 blijft exact (kleuren kloppen met de tekst), alleen hooglichten worden afgevlakt
      vec3 knee(vec3 c){ float l = max(c.r,max(c.g,c.b)); if (l <= 0.8) return c; float n = 0.8 + 0.2*(1.-exp(-(l-0.8)/0.2)); return c*(n/l); }
      vec3 toSRGB(vec3 c){ c = max(c, vec3(0.)); return mix(c*12.92, 1.055*pow(c, vec3(1./2.4))-0.055, step(0.0031308, c)); }
      void main(){
        vec2 d = (vUv-0.5)*ca;
        vec3 c = vec3(texture2D(tex,vUv+d).r, texture2D(tex,vUv).g, texture2D(tex,vUv-d).b);
        vec3 b = texture2D(b1,vUv).rgb*0.65 + texture2D(b2,vUv).rgb*0.9;
        c = (c + b*k) * exposure + lift;
        c = knee(c);
        gl_FragColor = vec4(toSRGB(c), 1.);
      }`,
  });
  const pass = (mat, target) => { quad.material = mat; renderer.setRenderTarget(target); renderer.render(quadScene, quadCam); };
  function resize(pr) {
    W = Math.round(1920 * pr); H = Math.round(1080 * pr);
    [rtS, rtA, rtB, rtC, rtD].forEach((r) => r.dispose());
    rtS = mk(W, H, true); rtA = mk(W >> 1, H >> 1); rtB = mk(W >> 1, H >> 1); rtC = mk(W >> 2, H >> 2); rtD = mk(W >> 2, H >> 2);
  }
  function render(scene, cam, opts = {}) {
    renderer.setRenderTarget(rtS);
    renderer.render(scene, cam);
    bright.uniforms.tex.value = rtS.texture; bright.uniforms.th.value = opts.th != null ? opts.th : 0.72;
    pass(bright, rtA);
    blur.uniforms.tex.value = rtA.texture; blur.uniforms.dir.value.set(1 / rtA.width, 0); pass(blur, rtB);
    blur.uniforms.tex.value = rtB.texture; blur.uniforms.dir.value.set(0, 1 / rtA.height); pass(blur, rtA);
    blur.uniforms.tex.value = rtA.texture; blur.uniforms.dir.value.set(2 / rtA.width, 0); pass(blur, rtC);
    blur.uniforms.tex.value = rtC.texture; blur.uniforms.dir.value.set(0, 1 / rtC.height); pass(blur, rtD);
    blur.uniforms.tex.value = rtD.texture; blur.uniforms.dir.value.set(1 / rtC.width, 0); pass(blur, rtC);
    blur.uniforms.tex.value = rtC.texture; blur.uniforms.dir.value.set(0, 2 / rtC.height); pass(blur, rtD);
    comp.uniforms.tex.value = rtS.texture; comp.uniforms.b1.value = rtA.texture; comp.uniforms.b2.value = rtD.texture;
    comp.uniforms.k.value = opts.bloom != null ? opts.bloom : 0.9;
    comp.uniforms.exposure.value = opts.exposure != null ? opts.exposure : 1;
    comp.uniforms.lift.value = opts.lift || 0;
    pass(comp, null);
  }
  return { render, resize };
})();

/* — scènebeheer: per moment maximaal één 3D-scène; de canvas faded mee — */
const GL = { list: [], add(s) { this.list.push(s); return s; } };
renders.push((t) => {
  let shown = null, o = 0;
  for (const s of GL.list) { const v = s.vis(t); if (v > 0.001) { shown = s; o = v; break; } }
  for (const s of GL.list) if (s !== shown && s.hide) s.hide();
  if (shown) {
    shown.update(t);
    POST.render(shown.scene, shown.cam, shown.post ? shown.post(t) : {});
  }
  op(glCanvas, o);
});
