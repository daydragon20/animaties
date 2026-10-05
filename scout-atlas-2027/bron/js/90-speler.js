/* ═════════════ SPELER: startscherm, bediening, geluid, schalen ═════════════ */
buildOvergangen();
buildHud();
buildGrain();

let t = 0, playing = false, last = 0;
const DUR = T.end;
function render(tt) { for (const f of renders) f(tt); }
function fit() {
  const s = Math.min(innerWidth / 1920, innerHeight / 1080);
  stage.style.transform = `translate(${(innerWidth - 1920 * s) / 2}px,${(innerHeight - 1080 * s) / 2}px) scale(${s})`;
  const pr = clamp(s * (window.devicePixelRatio || 1), 0.75, 1.5) * QUALITY;
  if (Math.abs(pr - renderer.getPixelRatio()) > 0.01) { renderer.setPixelRatio(pr); renderer.setSize(1920, 1080, false); POST.resize(pr); render(t); }
}
const qs = new URLSearchParams(location.search);
const QUALITY = qs.has("q") ? clamp(parseFloat(qs.get("q")), 0.3, 1.5) : 1;
addEventListener("resize", fit);

/* — geluid: muziek (zelf opgewekt) + stem (optioneel, Fish Audio) — */
let actx = null, music = null, voices = [], srcs = [], master = null, mGain = null, vGain = null, aStart = 0;
let muted = false, voiceOn = true;
const sndState = document.getElementById("sndState"), ringP = document.getElementById("ringP"), playBtn = document.getElementById("play");
const CIRC = 2 * Math.PI * 57;
function ctx() {
  if (!actx) {
    actx = new (window.AudioContext || window.webkitAudioContext)();
    master = actx.createGain(); master.connect(actx.destination);
    mGain = actx.createGain(); mGain.connect(master);
    vGain = actx.createGain(); vGain.connect(master);
  }
  return actx;
}
const VOICE = STEM && STEM.lijnen && STEM.lijnen.length ? STEM.lijnen : null;
function audioStop() { srcs.forEach((s) => { try { s.stop(); } catch (e) {} s.disconnect(); }); srcs = []; }
function audioStart() {
  if (!music) return;
  const c = ctx();
  if (c.state === "suspended") c.resume();
  audioStop();
  master.gain.value = muted ? 0 : 1;
  const now = c.currentTime + 0.03;
  aStart = now - t;
  const m = c.createBufferSource(); m.buffer = music; m.connect(mGain);
  m.start(now, Math.min(t, music.duration - 0.01)); srcs.push(m);
  // muziek zachter onder de stem (ducking)
  mGain.gain.cancelScheduledValues(0); mGain.gain.setValueAtTime(1, now);
  vGain.gain.value = voiceOn ? 1 : 0;
  if (voiceOn) for (const v of voices) {
    const a = v.t, b = v.t + v.buf.duration;
    if (b <= t) continue;
    const s = c.createBufferSource(); s.buffer = v.buf; s.connect(vGain);
    if (a >= t) s.start(now + (a - t)); else s.start(now, t - a);
    srcs.push(s);
    const da = now + Math.max(0, a - t), db = now + Math.max(0, b - t);
    mGain.gain.setTargetAtTime(0.42, Math.max(now, da - 0.25), 0.09);
    mGain.gain.setTargetAtTime(1, db + 0.1, 0.35);
  }
}
async function loadVoices() {
  if (!VOICE) return;
  const c = ctx();
  for (const l of VOICE) {
    const bin = Uint8Array.from(atob(l.mp3), (ch) => ch.charCodeAt(0));
    try { voices.push({ t: resolveCue(l.t), buf: await c.decodeAudioData(bin.buffer) }); } catch (e) { console.warn("stem", l.id, e); }
  }
}
// tijd van een stemzin: getal, of "cue+offset" (bv. "flash-4.2")
function resolveCue(x) {
  if (typeof x === "number") return x;
  const m = String(x).match(/^([a-z0-9]+)(?:\.([a-z0-9]+))?\s*([+-]\s*[\d.]+)?$/i);
  if (!m) return parseFloat(x) || 0;
  let base = 0;
  if (m[1] === "slot") base = SLOT[+m[2]].a;
  else if (T[m[1]] != null) base = T[m[1]];
  else if (typeof window[m[1]] === "object" && m[2]) base = window[m[1]][m[2]];
  return base + (m[3] ? parseFloat(m[3].replace(/\s/g, "")) : 0);
}

/* — bediening — */
const $ = (id) => document.getElementById(id);
const startEl = $("start"), ctrl = $("ctrl"), tl = $("tl"), tip = tl.querySelector(".tip"), head = tl.querySelector(".head");
const ICON = {
  play: '<svg width="18" height="18" viewBox="0 0 18 18"><path d="M4 2 L16 9 L4 16 Z" fill="currentColor"/></svg>',
  pause: '<svg width="18" height="18" viewBox="0 0 18 18"><path d="M4 2h3.5v14H4zM10.5 2H14v14h-3.5z" fill="currentColor"/></svg>',
  snd: '<svg width="20" height="18" viewBox="0 0 20 18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 6h4l5-4v14l-5-4H2z" fill="currentColor"/><path d="M14 5c1.5 1.2 1.5 6.8 0 8M16.5 2.5c3 2.6 3 10.4 0 13"/></svg>',
  mute: '<svg width="20" height="18" viewBox="0 0 20 18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 6h4l5-4v14l-5-4H2z" fill="currentColor"/><path d="M14 6l5 6M19 6l-5 6"/></svg>',
};
const segs = CHAPTERS.map(([n, a], i) => {
  const b = i < CHAPTERS.length - 1 ? CHAPTERS[i + 1][1] : DUR;
  const s = el("div", { class: "seg", style: `left:calc(${(a / DUR) * 100}% + ${i ? 3 : 0}px);width:calc(${((b - a) / DUR) * 100}% - ${i ? 3 : 0}px)` }, tl);
  return { s, fill: el("i", {}, s), a, b, n };
});
tl.appendChild(head); tl.appendChild(tip);
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
function ui() {
  $("bPlay").innerHTML = playing ? ICON.pause : ICON.play;
  $("bMute").innerHTML = muted ? ICON.mute : ICON.snd;
  $("bVoice").classList.toggle("off", !voiceOn);
  $("bVoice").innerHTML = `<span class="lbl">stem ${voiceOn ? "aan" : "uit"}</span>`;
  $("time").textContent = `${fmt(t)} / ${fmt(DUR)}`;
  const k = chapterAt(t);
  $("chap").innerHTML = `<b>${String(k + 1).padStart(2, "0")}</b>&nbsp;&nbsp;${CHAPTERS[k][0]}`;
  segs.forEach((g, i) => { g.fill.style.width = clamp((t - g.a) / (g.b - g.a)) * 100 + "%"; g.s.classList.toggle("cur", i === k); });
  head.style.left = (t / DUR) * 100 + "%";
}
function play() {
  if (t >= DUR - 0.05) t = 0;
  playing = true; last = performance.now();
  startEl.classList.add("gone"); closeExplorer(false);
  audioStart(); poke(); ui();
}
function pause() { playing = false; audioStop(); showCtrl(); ui(); }
function toggle() { playing ? pause() : play(); }
function seek(s) { t = clamp(s, 0, DUR); render(t); if (playing) audioStart(); ui(); }
function setMute(m) { muted = m; if (master) master.gain.value = muted ? 0 : 1; ui(); }
function setVoice(v) { voiceOn = v; $("stVoice").textContent = "Stem: " + (v ? "aan" : "uit"); $("stVoice").classList.toggle("on", v); if (playing) audioStart(); ui(); }
function loop(now) {
  if (playing) {
    if (srcs.length && actx && actx.state === "running") t = actx.currentTime - aStart;
    else t += Math.min(0.1, (now - last) / 1000);
    if (t >= DUR) { t = DUR; playing = false; audioStop(); render(t); ui(); openExplorer(true); }
    else { render(t); ui(); }
  }
  last = now;
  requestAnimationFrame(loop);
}
let idleTimer = 0, uiHidden = false;
function showCtrl() { if (!uiHidden) ctrl.classList.remove("hide"); document.body.classList.remove("idle"); }
function poke() {
  showCtrl();
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (playing) { ctrl.classList.add("hide"); document.body.classList.add("idle"); } }, 2200);
}
addEventListener("mousemove", poke);
addEventListener("pointerdown", poke);
$("bPlay").onclick = toggle;
$("bBack").onclick = () => seek(t - 10);
$("bFwd").onclick = () => seek(t + 10);
$("bMute").onclick = () => setMute(!muted);
$("bVoice").onclick = () => setVoice(!voiceOn);
$("stVoice").onclick = (e) => { e.stopPropagation(); setVoice(!voiceOn); };
$("bData").onclick = () => { pause(); openExplorer(false); };
$("stData").onclick = (e) => { e.stopPropagation(); startEl.classList.add("gone"); openExplorer(false); };
$("bFull").onclick = () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());
playBtn.onclick = play;
let dragging = false;
const posToT = (e) => { const r = tl.getBoundingClientRect(); return clamp((e.clientX - r.left) / r.width) * DUR; };
tl.addEventListener("pointerdown", (e) => { dragging = true; tl.setPointerCapture(e.pointerId); seek(posToT(e)); });
tl.addEventListener("pointermove", (e) => {
  const tt = posToT(e), k = chapterAt(tt);
  tip.innerHTML = `<b>${CHAPTERS[k][0]}</b> &nbsp;${fmt(tt)}`;
  tip.style.left = (tt / DUR) * 100 + "%";
  if (dragging) seek(tt);
});
tl.addEventListener("pointerup", () => (dragging = false));
tl.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") { seek(t + 10); e.stopPropagation(); } if (e.key === "ArrowLeft") { seek(t - 10); e.stopPropagation(); } });
addEventListener("keydown", (e) => {
  if (explorerOpen()) { if (e.key === "Escape") closeExplorer(true); return; }
  if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
  if (e.code === "Space" || e.key === "k") { e.preventDefault(); toggle(); }
  else if (e.key === "ArrowRight") seek(t + 10);
  else if (e.key === "ArrowLeft") seek(t - 10);
  else if (e.key === "r" || e.key === "R") { seek(0); play(); }
  else if (e.key === "m" || e.key === "M") setMute(!muted);
  else if ((e.key === "v" || e.key === "V") && VOICE) setVoice(!voiceOn);
  else if (e.key === "f" || e.key === "F") $("bFull").click();
  else if (e.key === "d" || e.key === "D") { pause(); startEl.classList.add("gone"); openExplorer(false); }
  else if (e.key === "h" || e.key === "H") { uiHidden = !uiHidden; ctrl.classList.toggle("hide", uiHidden); }
  poke();
});

/* — startscherm: langzaam schuivende hoogtelijnen en sterren — */
(function startFx() {
  const cv = $("startFx"), g = cv.getContext("2d");
  const W = 1200, H = 800, step = 8, cols = W / step + 1, rows = H / step + 1;
  const rnd = mulberry32(2027), peaks = [];
  for (let i = 0; i < 9; i++) peaks.push({ x: rnd() * W, y: rnd() * H, a: 0.5 + rnd() * 0.8, s: 90 + rnd() * 200 });
  const f = new Float32Array(cols * rows);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    let v = 0; for (const p of peaks) v += p.a * Math.exp(-((i * step - p.x) ** 2 + (j * step - p.y) ** 2) / (2 * p.s * p.s));
    f[j * cols + i] = v + 0.05 * Math.sin(i * step / 60) * Math.cos(j * step / 70);
  }
  const off = document.createElement("canvas"); off.width = W; off.height = H;
  const o = off.getContext("2d");
  for (let k = 0, lv = 0.05; lv < 1.6; lv += 0.07, k++) {
    o.strokeStyle = k % 5 === 0 ? "rgba(124,240,196,.22)" : "rgba(124,240,196,.09)"; o.lineWidth = k % 5 === 0 ? 1.3 : 0.9;
    o.beginPath();
    for (let j = 0; j < rows - 1; j++) for (let i = 0; i < cols - 1; i++) {
      const a = f[j * cols + i], b = f[j * cols + i + 1], c = f[(j + 1) * cols + i + 1], d = f[(j + 1) * cols + i];
      const idx = (a > lv ? 8 : 0) | (b > lv ? 4 : 0) | (c > lv ? 2 : 0) | (d > lv ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const x = i * step, y = j * step;
      const Tp = [x + step * (lv - a) / (b - a), y], Rt = [x + step, y + step * (lv - b) / (c - b)], Bt = [x + step * (lv - d) / (c - d), y + step], Lf = [x, y + step * (lv - a) / (d - a)];
      const sg = { 1: [[Lf, Bt]], 2: [[Bt, Rt]], 3: [[Lf, Rt]], 4: [[Tp, Rt]], 5: [[Lf, Tp], [Bt, Rt]], 6: [[Tp, Bt]], 7: [[Lf, Tp]], 8: [[Lf, Tp]], 9: [[Tp, Bt]], 10: [[Tp, Rt], [Lf, Bt]], 11: [[Tp, Rt]], 12: [[Lf, Rt]], 13: [[Bt, Rt]], 14: [[Lf, Bt]] }[idx];
      for (const [p, q] of sg) { o.moveTo(p[0], p[1]); o.lineTo(q[0], q[1]); }
    }
    o.stroke();
  }
  const stars = Array.from({ length: 160 }, () => [rnd(), rnd(), rnd() * 1.2 + 0.3, rnd() * 6]);
  function frame(now) {
    if (!startEl.classList.contains("gone")) {
      const w = cv.width = cv.clientWidth * (devicePixelRatio || 1), h = cv.height = cv.clientHeight * (devicePixelRatio || 1);
      const tt = now / 1000;
      g.fillStyle = "#030607"; g.fillRect(0, 0, w, h);
      const sc = Math.max(w / W, h / H) * 1.25;
      g.save(); g.globalAlpha = 0.9;
      g.translate(w / 2, h / 2); g.rotate(Math.sin(tt * 0.03) * 0.04); g.scale(sc, sc);
      g.drawImage(off, -W / 2 + Math.sin(tt * 0.05) * 40, -H / 2 + Math.cos(tt * 0.04) * 30);
      g.restore();
      for (const s of stars) { g.fillStyle = `rgba(239,233,218,${0.15 + 0.35 * (0.5 + 0.5 * Math.sin(tt * 0.8 + s[3]))})`; g.beginPath(); g.arc(s[0] * w, s[1] * h, s[2] * (devicePixelRatio || 1), 0, 7); g.fill(); }
      const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.6);
      gr.addColorStop(0, "rgba(3,6,7,.55)"); gr.addColorStop(1, "rgba(3,6,7,.15)");
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
$("stYear").textContent = YEAR;
$("stKick").textContent = `Verkenners ${AGES[1] || ""}–${AGES[2] || ""} · zomer ${YEAR}`;
$("stSub").textContent = `${numWord(CC.length)} landen. ${numWord(V.length).toLowerCase()} vragen. Eén kamp.`.replace(/^./, (c) => c.toUpperCase());
$("stTop").textContent = `Scout Atlas ${YEAR} · versie 1`;
$("stDur").textContent = `Film · ${fmt(DUR)} · met geluid`;
if (VOICE) { $("bVoice").hidden = false; $("stVoice").hidden = false; setVoice(true); }

// testhaakjes: ?t=42 (pauzeer op 42 s) · ?play · ?clean (zonder bediening) · ?nosound · ?data (meteen de verkenner) · ?q=0.6 (lagere 3D-kwaliteit)
const audioReady = qs.has("nosound") ? Promise.resolve(null) : (async () => {
  try {
    const r = await renderScore((p) => { ringP.setAttribute("stroke-dashoffset", CIRC * (1 - p)); sndState.textContent = `muziek wordt gecomponeerd… ${Math.round(p * 100)}%`; });
    music = r.buf;
    await loadVoices();
    ringP.setAttribute("stroke-dashoffset", 0);
    sndState.textContent = VOICE ? "klaar · muziek en stem" : "klaar · zet je geluid aan";
    playBtn.classList.add("ready");
    if (playing) audioStart();
    return r;
  } catch (e) { sndState.textContent = "geluid niet beschikbaar in deze browser"; console.error(e); return null; }
})();
window.__film = { seek, play, pause, get t() { return t; }, DUR, render, T, SLOT, M, audioReady, get music() { return music; } };
document.fonts.ready.then(() => {
  fit();
  render(0); ui();
  if (qs.has("clean")) document.getElementById("ui").style.display = "none";
  if (qs.has("t")) { startEl.classList.add("gone"); seek(parseFloat(qs.get("t"))); showCtrl(); }
  if (qs.has("data")) { startEl.classList.add("gone"); openExplorer(false); }
  if (qs.has("play")) play();
  requestAnimationFrame(loop);
});
