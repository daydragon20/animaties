/* RecruitmentAI — "De lus". Eén gepauzeerde GSAP-tijdlijn; elk frame is een pure functie van t.
   Afspelen: de klok is audio.currentTime. Renderen: window.__seek(t) per frame (tools/render.cjs). */
(() => {
'use strict';
const T = window.TIMELINE, C = T.cues, DUR = T.duration;
const $ = (s, r = document) => r.querySelector(s);
const stage = $('#stage'), world = $('#world'), echo = $('#echo');
const RENDER = new URLSearchParams(location.search).has('render');
if (RENDER) document.body.classList.add('render');

// ---------- kleine gereedschappen ----------
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const R = rng(20261005);
function el(tag, cls, html, parent, css) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  if (css) Object.assign(e.style, css);
  (parent || world).appendChild(e);
  return e;
}
const svgNS = 'http://www.w3.org/2000/svg';
function sv(tag, attrs, parent) { const e = document.createElementNS(svgNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; }
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const prog = (t, a, b) => clamp((t - a) / (b - a));
const easeOut = p => 1 - Math.pow(1 - p, 3);
function box(e) { let x = 0, y = 0, n = e; while (n && n !== stage) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; } return { x, y, w: e.offsetWidth, h: e.offsetHeight }; }
const SPARK = 'M12 0C13 7 17 11 24 12C17 13 13 17 12 24C11 17 7 13 0 12C7 11 11 7 12 0Z';
const CHECK = '<svg width="16" height="16" viewBox="0 0 16 16" style="vertical-align:-2px;margin-right:8px"><path d="M2 8.5l4 4 8-9" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>';

const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out', duration: 0.5 } });
const proc = [];               // procedurele lagen: fn(t)
const scene = id => T.scenes.find(s => s.id === id);

// ---------- herbruikbare bewegingen ----------
function show(e, at, how = 'rise', o = {}) {
  const d = o.d;
  switch (how) {
    case 'rise':  tl.fromTo(e, { autoAlpha: 0, y: o.y ?? 34 }, { autoAlpha: 1, y: 0, duration: d ?? .55, ease: o.ease ?? 'expo.out' }, at); break;
    case 'pop':   tl.fromTo(e, { autoAlpha: 0, scale: o.s ?? .55 }, { autoAlpha: 1, scale: 1, duration: d ?? .5, ease: o.ease ?? 'back.out(2.2)' }, at); break;
    case 'slam':  tl.fromTo(e, { autoAlpha: 0, scale: o.s ?? 2.1, rotation: (o.r ?? -7) - 6 }, { autoAlpha: 1, scale: 1, rotation: o.r ?? -7, duration: d ?? .2, ease: 'power4.out' }, at); break;
    case 'drop':  tl.fromTo(e, { autoAlpha: 0, y: o.y ?? -140 }, { autoAlpha: 1, y: 0, duration: d ?? .55, ease: o.ease ?? 'power3.out' }, at); break;
    case 'fade':  tl.fromTo(e, { autoAlpha: 0 }, { autoAlpha: 1, duration: d ?? .4, ease: 'sine.out' }, at); break;
    case 'left':  tl.fromTo(e, { autoAlpha: 0, x: o.x ?? -60 }, { autoAlpha: 1, x: 0, duration: d ?? .5, ease: o.ease ?? 'power3.out' }, at); break;
    case 'right': tl.fromTo(e, { autoAlpha: 0, x: o.x ?? 80 }, { autoAlpha: 1, x: 0, duration: d ?? .5, ease: o.ease ?? 'power3.out' }, at); break;
  }
}
function hide(e, at, how = 'fade', o = {}) {
  const d = o.d ?? .28;
  if (how === 'up') tl.to(e, { autoAlpha: 0, y: o.y ?? -26, duration: d, ease: 'power2.in' }, at);
  else if (how === 'cut') tl.set(e, { autoAlpha: 0 }, at);
  else if (how === 'shrink') tl.to(e, { autoAlpha: 0, scale: o.s ?? .85, duration: d, ease: 'power2.in' }, at);
  else tl.to(e, { autoAlpha: 0, duration: d, ease: 'power1.in' }, at);
}
function vis(e) { gsap.set(e, { autoAlpha: 0 }); return e; }

// grote zin in de linkerkolom
function say(lines, o = {}) {
  const s = el('div', 'say' + (o.cls ? ' ' + o.cls : ''), lines.map(l => `<span class="ln">${l.split(' ').map(w => `<span class="w">${w}</span>`).join(' ')}</span>`).join(''));
  if (o.css) Object.assign(s.style, o.css);
  vis(s);
  return s;
}
function sayIn(s, at, o = {}) {
  const ws = s.querySelectorAll('.w');
  tl.set(s, { autoAlpha: 1 }, at);
  tl.fromTo(ws, { yPercent: 112 }, { yPercent: 0, duration: o.d ?? .7, ease: o.ease ?? 'expo.out', stagger: o.stagger ?? .055 }, at);
}
function sayOut(s, at) {
  tl.to(s.querySelectorAll('.w'), { yPercent: -112, duration: .32, ease: 'power2.in', stagger: .018 }, at);
  tl.set(s, { autoAlpha: 0 }, at + .45);
}

// werkwoord in de onderband
const VERB_MAX = 1760;
function verb(word, o = {}) {
  const v = el('div', 'verb', word.toUpperCase().split('').map(c => `<span class="l">${c}</span>`).join(''));
  if (o.size) v.style.fontSize = o.size + 'px';
  vis(v);
  return v;
}
function fitVerb(v) { const w = v.scrollWidth; if (w > VERB_MAX) v.style.fontSize = (parseFloat(getComputedStyle(v).fontSize) * VERB_MAX / w) + 'px'; }

// knoop + rand in de graph
function node(title, sub, x, y, cls = '') { const n = el('div', 'node ' + cls, `<b>${title}</b>${sub ? `<span>${sub}</span>` : ''}`, world, { left: x + 'px', top: y + 'px' }); vis(n); return n; }
const edgeSvg = document.createElementNS(svgNS, 'svg'); edgeSvg.id = 'edges';
function clipToBox(cx, cy, tx, ty, b) {
  const dx = tx - cx, dy = ty - cy; const sx = dx ? (b.w / 2 + 10) / Math.abs(dx) : Infinity, sy = dy ? (b.h / 2 + 10) / Math.abs(dy) : Infinity;
  const s = Math.min(sx, sy); return [cx + dx * s, cy + dy * s];
}
function edge(a, b, at, o = {}) {
  const A = box(a), B = box(b);
  const ac = [A.x + A.w / 2 + (o.ax ?? 0), A.y + A.h / 2 + (o.ay ?? 0)], bc = [B.x + B.w / 2 + (o.bx ?? 0), B.y + B.h / 2 + (o.by ?? 0)];
  const [x1, y1] = clipToBox(ac[0], ac[1], bc[0], bc[1], A), [x2, y2] = clipToBox(bc[0], bc[1], ac[0], ac[1], B);
  const ln = sv('line', { x1, y1, x2: x1, y2: y1, stroke: o.color || '#14120F', 'stroke-width': o.w || 2.5, 'stroke-dasharray': o.dashed ? '10 8' : 'none', 'stroke-linecap': 'round' }, edgeSvg);
  gsap.set(ln, { autoAlpha: 0 });
  tl.set(ln, { autoAlpha: 1 }, at);
  tl.fromTo(ln, { attr: { x2: x1, y2: y1 } }, { attr: { x2, y2 }, duration: o.d ?? .45, ease: 'power2.inOut' }, at);
  let lab = null;
  if (o.label) {
    lab = el('div', 'elab', o.label, world, { left: ((x1 + x2) / 2) + 'px', top: ((y1 + y2) / 2) + 'px' });
    gsap.set(lab, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    tl.to(lab, { autoAlpha: 1, duration: .3 }, at + (o.d ?? .45) * .7);
  }
  return { ln, lab, x1, y1, x2, y2 };
}

// ============================================================================================
// AKTE I — ECHO
// ============================================================================================
function buildEchoMsg() {
  const S = scene('echo_msg');
  const wrap = el('div', 'layer', '', echo, { background: '#E7E9EC' });
  const cam = el('div', 'cam', '', wrap);
  const COLS = 13, ROWS = 9, PX = 404, PY = 174, cards = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const m = el('div', 'msg', `<div class="av"></div><div><b>Recruiter</b><p>Hoi {voornaam}, ik zag je profiel en dacht meteen aan jou. Ik heb een spannende kans voor je!</p></div>`, cam,
      { left: ((c - (COLS - 1) / 2) * PX - 190) + 'px', top: ((r - (ROWS - 1) / 2) * PY - 75) + 'px' });
    vis(m);
    cards.push({ m, d: Math.max(Math.abs(c - 6), Math.abs(r - 4)) });
  }
  const waves = [[0, 0], [1, 1], [2, 2], [3, 9]];
  waves.forEach(([lo, hi], i) => {
    const set = cards.filter(k => k.d >= lo && k.d <= hi).map(k => k.m);
    tl.fromTo(set, { autoAlpha: 0, y: 18, scale: .94 }, { autoAlpha: 1, y: 0, scale: 1, duration: .32, ease: 'power3.out', stagger: { each: i === 3 ? .0035 : .02, from: 'center' } }, C.msg_waves[i]);
  });
  tl.fromTo(cam, { scale: 1.9 }, { scale: .355, duration: 2.35, ease: 'power2.inOut' }, .08);
  const cap = el('div', 'echo-cap', 'Elk bericht lijkt<br>op elkaar.', wrap); vis(cap);
  tl.fromTo(cap, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: .4, ease: 'expo.out' }, .55);
  hide(wrap, S.end, 'cut');
}

function buildEchoAI() {
  const S = scene('echo_ai'), S3 = scene('echo_orig');
  const wrap = el('div', 'layer', '', echo, { background: 'var(--ai-bg)' }); vis(wrap);
  tl.set(wrap, { autoAlpha: 1 }, S.start);
  const cam = el('div', 'cam', '', wrap);
  const COLS = 5, ROWS = 3, PX = 560, PY = 370; let center = null; const all = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const k = el('div', 'aicard', `<div class="glow"></div><svg class="spark" viewBox="0 0 24 24"><path d="${SPARK}" fill="#C4B5FD"/></svg><h4>Revolutioneer je recruitment met AI</h4><p>De slimste AI-assistent voor recruiters.</p><div class="inp"><span class="ph">Vraag het aan AI…</span><i></i></div>`, cam,
      { left: ((c - (COLS - 1) / 2) * PX - 260) + 'px', top: ((r - (ROWS - 1) / 2) * PY - 165) + 'px' });
    all.push(k); if (c === 2 && r === 1) center = k;
  }
  tl.fromTo(all, { autoAlpha: 0, scale: .97 }, { autoAlpha: 1, scale: 1, duration: .22, ease: 'power2.out', stagger: { each: .018, from: 'center' } }, S.start);
  tl.fromTo(cam, { scale: .62, x: 30 }, { scale: .665, x: -30, duration: S.end - S.start, ease: 'sine.inOut' }, S.start);
  const cap = el('div', 'echo-cap light', 'Elke AI-tool ook.', wrap); vis(cap);
  tl.fromTo(cap, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: .4 }, S.start + .25);
  hide(cap, S3.start, 'fade', { d: .18 });

  // --- origineel ---
  tl.to(cam, { scale: 2.85, x: 0, duration: .62, ease: 'power3.inOut' }, C.zoom_card);
  const others = all.filter(k => k !== center);
  tl.to(others, { autoAlpha: .0, duration: .5, ease: 'sine.in' }, C.zoom_card + .1);
  const inp = $('.inp', center), ph = $('.ph', inp);
  const typed = el('span', 'typed', '', inp); const caret = el('span', 'caret', '', inp); vis(typed); vis(caret);
  tl.set(ph, { autoAlpha: 0 }, C.type_start - .05); tl.set([typed, caret], { autoAlpha: 1 }, C.type_start - .05);
  const PROMPT = 'maak iets origineels';
  proc.push(t => {
    const p = prog(t, C.type_start, C.type_end);
    typed.textContent = PROMPT.slice(0, Math.round(p * PROMPT.length));
    caret.style.opacity = (t > C.type_end && t < C.enter + .4) ? (Math.floor(t * 3.4) % 2 ? 0 : 1) : 1;
  });
  tl.to($('i', inp), { scale: .82, duration: .08, ease: 'power2.in', yoyo: true, repeat: 1 }, C.enter);
  tl.to([$('h4', center), $('p', center), $('.spark', center), inp], { autoAlpha: 0, duration: .3, ease: 'power2.in' }, C.enter + .12);
  // de "originele" uitkomst: dezelfde bol
  const orb = el('div', '', '', wrap); orb.id = 'orb'; vis(orb);
  const sparks = [[-430, -250, 70], [400, -300, 46], [450, 230, 58], [-380, 300, 38]].map(([x, y, s]) => {
    const g = document.createElementNS(svgNS, 'svg'); g.setAttribute('viewBox', '0 0 24 24'); Object.assign(g.style, { position: 'absolute', left: (960 + x) + 'px', top: (540 + y) + 'px', width: s + 'px', height: s + 'px' });
    sv('path', { d: SPARK, fill: '#E9D5FF' }, g); wrap.appendChild(g); vis(g); return g;
  });
  tl.fromTo(orb, { autoAlpha: 0, scale: .1 }, { autoAlpha: 1, scale: 1, duration: .55, ease: 'expo.out' }, C.orb);
  tl.fromTo(sparks, { autoAlpha: 0, scale: 0, rotation: -40 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: .45, ease: 'back.out(2)', stagger: .05 }, C.orb + .1);
  const cap2 = el('div', 'echo-cap light', 'Zelfs ‘origineel’<br>bestaat al.', wrap); vis(cap2);
  tl.fromTo(cap2, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: .38 }, C.orb + .12);
  // tape-stop: alles zakt weg, ontkleurt en valt stil
  tl.fromTo(echo, { filter: 'grayscale(0) brightness(1)' }, { filter: 'grayscale(1) brightness(.72)', duration: C.hard_cut - C.tape_stop, ease: 'power2.in' }, C.tape_stop);
  tl.fromTo(wrap, { scale: 1 }, { scale: .965, duration: C.hard_cut - C.tape_stop, ease: 'power2.in' }, C.tape_stop);
  hide(echo, C.hard_cut, 'cut');
}

// ============================================================================================
// HUD — de lusring
// ============================================================================================
const VERBS = T.scenes.filter(s => s.step).map(s => s.verb);
function ringSvg(parent, size, stroke) {
  const g = document.createElementNS(svgNS, 'svg'); g.setAttribute('viewBox', '-50 -50 100 100');
  parent.appendChild(g);
  const ticks = [];
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * Math.PI * 2 - Math.PI / 2;
    ticks.push(sv('line', { x1: Math.cos(a) * 31, y1: Math.sin(a) * 31, x2: Math.cos(a) * 46, y2: Math.sin(a) * 46, stroke: '#14120F', 'stroke-width': stroke, 'stroke-linecap': 'round' }, g));
  }
  return { g, ticks };
}
function buildHud() {
  const hud = el('div', 'abs', '', world); hud.id = 'hud';
  const ring = ringSvg(hud, 66, 7);
  const k = el('div', 'k', '', hud);
  vis(hud);
  tl.set(hud, { autoAlpha: 1 }, 12.0);
  hide(hud, C.outro_hit + .1, 'fade', { d: .3 });
  proc.push(t => {
    if (t < 12 || t > 56.5) return;
    let step = T.scenes.find(s => s.step && t >= s.start && t < s.end)?.step ?? 9;
    const m = C.montage; let cycling = false;
    if (t >= m[0] && t < m[8] + .28) { step = clamp(Math.floor((t - m[0]) / .28) + 1, 1, 9); cycling = true; }
    ring.ticks.forEach((ln, i) => {
      const done = i < step - 1, cur = i === step - 1;
      ln.setAttribute('stroke', cur ? '#C2410C' : '#14120F');
      ln.setAttribute('opacity', cur ? 1 : done ? (cycling ? .9 : .9) : .22);
      ln.setAttribute('stroke-width', cur ? 10 : 7);
    });
    k.innerHTML = `<b>0${step}</b> / 09 · ${VERBS[step - 1]}`;
  });
}


// systeemklok rechtsboven: de lus draait elke ochtend (bible §38); de tijd versnelt en springt
function buildClock() {
  const c = el('div', 'abs', '<div class="k">systeemklok</div><div class="v"></div>', world); c.id = 'clock';
  const v = $('.v', c); vis(c);
  tl.set(c, { autoAlpha: 1 }, 12.0);
  hide(c, C.outro_hit + .1, 'fade', { d: .3 });
  const hm = m => { m = Math.floor(m); return String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
  proc.push(t => {
    if (t < 12 || t > 56.5) return;
    let day, min;
    if (t < C.days) { day = 1; min = 6 * 60 + 12 + (t - 12) * 10; }
    else if (t < C.move) { day = 1 + Math.round(18 * easeOut(prog(t, C.days, C.days + .55))); min = 6 * 60 + 2 + Math.max(0, t - C.days) * 2; }
    else { day = 19 + Math.round(151 * easeOut(prog(t, C.move, C.move + .7))); min = 6 * 60 + 1 + (t - C.move) * 40; }
    v.textContent = `dag ${String(day).padStart(3, '0')} · ${hm(min)}`;
  });
}

// ============================================================================================
// BELOFTE
// ============================================================================================
function buildPromise() {
  const p1 = say(['RecruitmentAI maakt', 'geen mooiere kopie.'], { css: { top: '330px', width: '1500px', fontSize: '150px' } });
  const p2 = say(['Het zoekt wat', '<em>beter</em> kan.'], { css: { top: '330px', width: '1500px', fontSize: '150px' } });
  sayIn(p1, C.promise_1, { stagger: .07, d: .8 });
  sayOut(p1, C.promise_2 - .4);
  sayIn(p2, C.promise_2, { stagger: .07, d: .8 });
  sayOut(p2, C.ring_draw + .55);
  // het geleende patroon uit akte I, opgeprikt als specimen — en losgelaten
  const spec = el('div', 'abs', `<div style="position:absolute;left:70px;top:58px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle at 38% 32%,#F5F3FF 0%,#C4B5FD 12%,#7C3AED 42%,#4C1D95 68%,#1E1B4B 100%);filter:grayscale(1) contrast(.9);opacity:.85"></div>
    <div class="mono" style="position:absolute;left:0;right:0;bottom:26px;text-align:center;font-size:17px">patroon · overal gezien</div>`, world,
    { left: '1400px', top: '330px', width: '360px', height: '400px', border: '2px dashed var(--ink)', background: 'rgba(244,244,240,.5)' });
  vis(spec);
  const strike = el('div', 'abs', '', spec, { left: '-20px', top: '196px', width: '400px', height: '7px', background: 'var(--crimson)', transformOrigin: '0 50%', rotate: '-38deg' });
  const nl = el('div', 'stamp', 'niet overnemen', spec, { left: '42px', top: '150px', fontSize: '24px', color: 'var(--crimson)' }); vis(nl);
  show(spec, C.promise_1 + .5, 'pop', { s: .8, d: .6 });
  tl.fromTo(strike, { scaleX: 0 }, { scaleX: 1, duration: .35, ease: 'power3.in' }, C.promise_2 + .35);
  show(nl, C.promise_2 + .62, 'slam', { r: -8 });
  hide(spec, C.ring_draw - .2, 'shrink', { d: .3, s: .9 });
  // de lus tekent zich, schuift dan naar de HUD
  const wrap = el('div', 'abs', '', world, { left: '1410px', top: '390px', width: '300px', height: '300px' });
  const ring = ringSvg(wrap, 300, 6); ring.g.style.width = '300px'; ring.g.style.height = '300px'; ring.g.style.overflow = 'visible';
  const lab = el('div', 'mono', '9 stappen · elke dag', world, { position: 'absolute', left: '1410px', width: '300px', top: '712px', textAlign: 'center', fontSize: '18px' }); vis(lab);
  gsap.set(ring.ticks, { autoAlpha: 0 });
  tl.fromTo(ring.ticks, { autoAlpha: 0, scale: .2, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .35, ease: 'back.out(3)', stagger: .07 }, C.ring_draw);
  tl.fromTo(lab, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .4 }, C.ring_draw + .45);
  hide(lab, 11.55, 'fade', { d: .2 });
  // naar HUD-positie (midden 97,85; schaal 66/300)
  tl.to(wrap, { x: 97 - 1560, y: 85 - 540, scale: 66 / 300, duration: .55, ease: 'power3.inOut' }, 11.5);
  tl.set(wrap, { autoAlpha: 0 }, 12.02);
}

// ============================================================================================
// DE LUS — één publieke post reist door negen stappen
// ============================================================================================
let post, pgroup, kw;
function buildS1() {
  const S = scene('s1');
  const v = verb('waarnemen'); fitVerb(v);
  tl.set(v, { autoAlpha: 1 }, S.start);
  tl.fromTo(v.querySelectorAll('.l'), { autoAlpha: 0, x: i => -40 - i * 26 }, { autoAlpha: 1, x: 0, duration: 1.3, ease: 'sine.out', stagger: .035 }, S.start);
  hide(v, S.end - .28, 'up', { d: .26, y: 40 });

  // signalen in drie talen, uit verschillende bronnen (bible §7, §9, §15)
  const SIG = [
    ['8 vacatures', 'bedrijfspagina'], ['nouveau défi', 'publieke post'], ['new chapter', 'publieke post'], ['nieuwe vestiging', 'nieuws'],
    ['werken bij', 'carrièrepagina'], ['dernier jour chez', 'publieke post'], ['nieuwe HR-manager', 'aankondiging'], ['uitbreiding', 'nieuws'],
    ['na 12 jaar', 'publieke post'], ['moving on', 'publieke post'], ['recrutement', 'jobboard'], ['afscheid', 'publieke post'], ['nieuw hoofdstuk', 'publieke post'],
  ];
  const lanes = [186, 356, 526, 666];   // baan 2 (356) is voor het ene signaal dat blijft hangen
  const other = [0, 2, 3];
  const chips = SIG.map(([w, src], i) => {
    const c = el('div', 'chip', `<b>${w}</b><span>${src}</span>`, world, { left: '1960px', top: lanes[other[i % 3]] + 'px' }); vis(c);
    const t0 = 12.2 + i * .23, speed = 1150;
    tl.set(c, { autoAlpha: 1 }, t0);
    tl.fromTo(c, { x: 0 }, { x: -(2600), duration: 2600 / speed, ease: 'none' }, t0);
    tl.set(c, { autoAlpha: 0 }, t0 + 2600 / speed);
    return c;
  });
  // het ene signaal dat blijft hangen
  const lock = el('div', 'chip', `<b>laatste werkdag</b><span>publieke post</span>`, world, { left: '1960px', top: lanes[1] + 'px' }); vis(lock);
  tl.set(lock, { autoAlpha: 1 }, 13.25);
  tl.fromTo(lock, { x: 0 }, { x: 1000 - 1960, duration: C.post_lock - 13.25, ease: 'power3.out' }, 13.25);
  tl.to(lock, { borderWidth: 3, scale: 1.08, duration: .16, ease: 'power2.out', yoyo: true, repeat: 1 }, C.post_lock);
  tl.to(chips, { opacity: .0, duration: .4 }, C.post_lock);
  // scanlijn
  const scan = el('div', 'abs', '<div class="mono" style="font-size:13px;margin:10px 0 0 10px;white-space:nowrap">scan · 06:12</div>', world, { left: '0', top: '150px', width: '2px', height: '560px', background: 'var(--ink)' }); vis(scan);
  tl.set(scan, { autoAlpha: .55 }, 12.25);
  tl.fromTo(scan, { x: 120 }, { x: 1800, duration: 3.1, ease: 'sine.inOut' }, 12.25);
  hide(scan, C.post_lock, 'fade', { d: .3 });

  // de post zelf
  pgroup = el('div', 'abs', '', world, { left: '960px', top: '200px', width: '860px', transformStyle: 'preserve-3d' });
  post = el('div', 'card', `<div class="who"><div class="av">SJ</div><div><b>S. J.</b><span>Supply Chain Manager</span></div></div>
    <div class="txt">Vandaag mijn <span class="kw">laatste werkdag</span> bij Bedrijf A. Na 7 jaar: tijd voor een nieuw hoofdstuk.</div>
    <div class="foot prov">bron · publieke post · voorbeeld</div>`, pgroup);
  post.id = 'post'; post.style.left = '0'; post.style.top = '0';
  kw = $('.kw', post);
  vis(post);
  tl.set(post, { autoAlpha: 1 }, C.post_open);
  tl.fromTo(post, { scaleX: .34, scaleY: .2, x: 40, y: 150, transformOrigin: '0% 0%' }, { scaleX: 1, scaleY: 1, x: 0, y: 0, duration: .7, ease: 'expo.out' }, C.post_open);
  tl.set(lock, { autoAlpha: 0 }, C.post_open + .05);
  tl.fromTo(post.querySelectorAll('.who, .txt, .foot'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .45, stagger: .09, ease: 'power2.out' }, C.post_open + .25);

  const s = say(['Vacatures.', 'Vertrekken.', 'Groei.']);
  sayIn(s, 16.3, { stagger: .14, d: .6 });
  sayOut(s, S.end - .4);
}

function buildS2() {
  const S = scene('s2');
  const v = verb('bevragen'); fitVerb(v);
  tl.fromTo(v, { autoAlpha: 0, x: -140 }, { autoAlpha: 1, x: -46, duration: .26, ease: 'power2.out' }, S.start);
  tl.to(v, { x: 0, duration: .34, ease: 'back.out(2.4)' }, S.start + .55);
  const qm = el('span', 'l', '?', v); qm.style.color = 'var(--terra)'; qm.style.marginLeft = '.04em';
  tl.fromTo(qm, { rotation: -12, transformOrigin: '50% 90%' }, { rotation: 10, duration: .55, ease: 'sine.inOut', yoyo: true, repeat: 5 }, S.start + .3);
  hide(v, S.end - .28, 'up', { d: .26, y: 40 });

  // omcirkel het trefwoord
  const k = box(kw);
  const g = document.createElementNS(svgNS, 'svg'); Object.assign(g.style, { position: 'absolute', left: (k.x - 30) + 'px', top: (k.y - 22) + 'px', width: (k.w + 60) + 'px', height: (k.h + 44) + 'px', overflow: 'visible' });
  world.appendChild(g);
  const W = k.w + 60, H = k.h + 44;
  const path = sv('path', { d: `M ${W * .55} ${4} C ${W * .95} ${2}, ${W + 6} ${H * .55}, ${W * .7} ${H - 4} C ${W * .4} ${H + 4}, ${-6} ${H * .8}, ${4} ${H * .45} C ${10} ${H * .1}, ${W * .3} ${-4}, ${W * .62} ${8}`, fill: 'none', stroke: '#C2410C', 'stroke-width': 4.5, 'stroke-linecap': 'round' }, g);
  const L = path.getTotalLength(); gsap.set(path, { strokeDasharray: L, strokeDashoffset: L, autoAlpha: 0 });
  tl.set(path, { autoAlpha: 1 }, C.circle);
  tl.to(path, { strokeDashoffset: 0, duration: .55, ease: 'power2.inOut' }, C.circle);
  hide(g, S.end - .1, 'fade', { d: .25 });

  const s = say(['Een trefwoord', 'is geen bewijs.']);
  sayIn(s, C.line_s2);
  sayOut(s, S.end - .45);

  // bron lezen: een leesbalk gaat over de post
  const P = box(post);
  const sweep = el('div', 'abs', '', world, { left: P.x + 'px', top: (P.y + 2) + 'px', width: '10px', height: (P.h - 4) + 'px', background: 'rgba(194,65,12,.16)', borderRight: '3px solid var(--terra)' }); vis(sweep);
  const rl = el('div', 'mono', 'bron lezen…', world, { position: 'absolute', left: P.x + 'px', top: (P.y - 34) + 'px', fontSize: '14px', color: 'var(--terra)' }); vis(rl);
  tl.set([sweep, rl], { autoAlpha: 1 }, C.read_sweep);
  tl.fromTo(sweep, { width: 10 }, { width: P.w, duration: .75, ease: 'power1.inOut' }, C.read_sweep);
  hide([sweep, rl], C.checks[0] - .05, 'fade', { d: .2 });
  const c1 = el('div', 'tag', CHECK + 'bron gelezen', world, { position: 'absolute', left: P.x + 'px', top: (P.y + P.h + 26) + 'px', background: 'var(--sheet)' });
  const c2 = el('div', 'tag', CHECK + 'professioneel vertrek', world, { position: 'absolute', left: (P.x + 268) + 'px', top: (P.y + P.h + 26) + 'px', background: 'var(--sheet)' });
  vis(c1); vis(c2);
  show(c1, C.checks[0], 'pop', { s: .7 }); show(c2, C.checks[1], 'pop', { s: .7 });
  hide([c1, c2], S.end + .05, 'fade', { d: .25 });
}

function buildS3() {
  const S = scene('s3');
  const v = verb('ontleden'); fitVerb(v);
  const ls = v.querySelectorAll('.l');
  tl.fromTo(v, { autoAlpha: 0, clipPath: 'inset(100% -40% 0% -5%)' }, { autoAlpha: 1, clipPath: 'inset(0% -40% 0% -5%)', duration: .5, ease: 'expo.out' }, S.start);
  tl.to(ls, { x: i => i * 20, y: () => (R() - .5) * 34, rotation: () => (R() - .5) * 6, duration: 1.0, ease: 'expo.inOut', stagger: .03 }, C.layers[0]);
  tl.to(v, { autoAlpha: 0, y: 30, duration: .26, ease: 'power2.in' }, S.end - .28);

  // exploded view: de post draait de ruimte in, de velden komen eruit als parallelle lagen (CSS-3D, tekst blijft scherp)
  tl.to(pgroup, { rotationY: -30, rotationX: 12, x: -110, y: 150, scale: .84, duration: 1.0, ease: 'expo.inOut' }, C.tilt);
  tl.to(post, { boxShadow: '40px 50px 70px -40px rgba(20,18,15,.38)', duration: 1 }, C.tilt);
  tl.to(post.querySelectorAll('.who, .txt, .foot'), { opacity: .28, duration: .6, ease: 'sine.inOut' }, C.layers[0]);
  const FIELDS = [
    ['oude werkgever', 'Bedrijf A', 'bevestigd', false],
    ['functie', 'Supply Chain Manager', 'bevestigd', false],
    ['anciënniteit', '7 jaar', 'waarschijnlijk', true],
    ['vertrek', 'vandaag', 'bevestigd', false],
    ['nieuwe werkgever', '—', null, false],
  ];
  let unknownPlate = null;
  FIELDS.forEach(([lab, val, st, dash], i) => {
    const plate = el('div', 'plate', `<span class="lab">${lab}</span><span class="val">${val}</span>${st ? `<span class="tag${dash ? ' dash' : ''}">${st}</span>` : '<span></span>'}`, pgroup, { width: '760px' });
    gsap.set(plate, { x: 70, y: -40 + i * 92, z: 0, autoAlpha: 0 });
    tl.fromTo(plate, { autoAlpha: 0, z: 0 }, { autoAlpha: 1, z: 120 + i * 85, duration: .75, ease: 'expo.out' }, C.layers[i]);
    if (i === 4) unknownPlate = plate;
  });
  const st = el('div', 'stamp', 'UNKNOWN', unknownPlate, { right: '34px', top: '50%', marginTop: '-31px', fontSize: '28px', color: 'var(--ink)' }); vis(st);
  show(st, C.unknown_stamp, 'slam', { r: -6 });
  tl.to(unknownPlate, { x: 6, duration: .05, yoyo: true, repeat: 3, ease: 'none' }, C.unknown_stamp + .12);

  const s = say(['Niet gokken.'], { css: { fontSize: '150px', top: '300px' } });
  sayIn(s, C.line_s3, { d: .55 });
  sayOut(s, S.end - .45);

  // naar de graph: het geheel krimpt tot één knoop
  tl.to(pgroup, { autoAlpha: 0, scale: .25, x: -80, y: 220, rotationX: 0, rotationY: 0, duration: .75, ease: 'power3.inOut' }, C.to_graph);
}

let nP, nA, nH1, nH2, nH3;
function buildS4() {
  const S = scene('s4');
  const v = verb('genereren'); fitVerb(v);
  tl.set(v, { autoAlpha: 1 }, S.start);
  tl.fromTo(v.querySelectorAll('.l'), { autoAlpha: 0, scale: .3, transformOrigin: '50% 100%' }, { autoAlpha: 1, scale: 1, duration: .55, ease: 'back.out(1.8)', stagger: { each: .04, from: 'center' } }, S.start);
  const ghosts = [1, 2, 3].map(k => { const g = verb('genereren'); g.classList.add('ghost'); g.style.fontSize = v.style.fontSize; return g; });
  ghosts.forEach((g, k) => {
    tl.set(g, { autoAlpha: 1 }, S.start + .35 + k * .12);
    tl.fromTo(g, { y: 0, opacity: .9 }, { y: -(k + 1) * 64, opacity: .55 - k * .15, duration: .7, ease: 'expo.out' }, S.start + .35 + k * .12);
    hide(g, S.end - .3, 'fade', { d: .22 });
  });
  hide(v, S.end - .28, 'up', { d: .26, y: 40 });

  world.appendChild(edgeSvg);
  nP = node('S. J.', 'persoon · bevestigd', 930, 400);
  nA = node('Bedrijf A', 'werkgever tot vandaag', 1480, 196);
  nH1 = node('Vervangingsvacature?', 'sales-kans · hypothese', 1400, 430, 'hyp sales');
  nH2 = node('3 profielen passen', 'uit je database · hypothese', 1350, 640, 'hyp recr');
  nH3 = node('Kandidaat voor later', 'talentpool · hypothese', 900, 640, 'hyp recr');
  show(nP, C.graph_root - .1, 'pop', { s: .8 });
  show(nA, C.graph_root + .25, 'pop', { s: .8 });
  const e1 = edge(nP, nA, C.graph_root + .15, { label: 'verliet · vandaag' });
  show(nH1, C.hypotheses[0], 'pop');
  const e2 = edge(nA, nH1, C.hypotheses[0] - .1, { dashed: true, color: '#047857' });
  show(nH2, C.hypotheses[1], 'pop');
  const e3 = edge(nH1, nH2, C.hypotheses[1] - .1, { dashed: true, color: '#C2410C' });
  show(nH3, C.hypotheses[2], 'pop');
  const e4 = edge(nP, nH3, C.hypotheses[2] - .1, { dashed: true, color: '#C2410C' });

  const s = say(['Hypotheses.', 'Geen conclusies.']);
  sayIn(s, C.line_s4);
  sayOut(s, S.end - .45);

  // alleen de sales-hypothese gaat door naar de test
  const gone = [nP, nA, nH2, nH3, e1.ln, e1.lab, e2.ln, e3.ln, e4.ln].filter(Boolean);
  tl.to(gone, { autoAlpha: 0, duration: .3, ease: 'power1.in' }, S.end - .35);
  tl.to(nH1, { x: 1000 - 1400, y: 170 - 430, duration: .6, ease: 'power3.inOut' }, S.end - .3);
}

let laneA, laneB, resA, resB;
function lane(x, name, sub, seed) {
  const l = el('div', 'lane', `<h5>${name}</h5><div class="sub">${sub}</div><div class="rows"><div class="rin"></div></div><div class="res"></div>`, world, { left: x + 'px' });
  const rin = $('.rin', l);
  const r = rng(seed);
  const rows = [];
  for (let i = 0; i < 20; i++) {
    const row = el('div', 'row', `<i></i><span>vacature ${String(i + 1).padStart(2, '0')}</span><u style="max-width:${60 + r() * 140}px"></u>`, rin);
    rows.push(row);
  }
  vis(l);
  return { l, rin, rows, res: $('.res', l) };
}
function buildS5() {
  const S = scene('s5');
  const v = verb('experimenteren'); fitVerb(v);
  tl.fromTo(v, { autoAlpha: 0, x: 420 }, { autoAlpha: 1, x: 0, duration: .6, ease: 'power3.out' }, S.start);
  [.7, .95, 1.2, 1.4, 1.58].forEach((d, k) => tl.set(v, { fontWeight: k % 2 ? 860 : 260 }, S.start + d));
  hide(v, S.end - .28, 'up', { d: .26, y: 40 });

  const test = el('div', 'mono', 'test · 20 bekende vacatures · voorbeeld', world, { position: 'absolute', left: '1000px', top: '286px', fontSize: '17px', color: 'var(--muted)' }); vis(test);
  show(test, C.lanes - .1, 'fade');
  laneA = lane(1000, 'Strategie A', 'carrièrepagina’s eerst', 7);
  laneB = lane(1450, 'Strategie B', 'jobboards eerst', 11);
  tl.fromTo(laneA.l, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: .5, ease: 'power3.out' }, C.lanes);
  tl.fromTo(laneB.l, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: .5, ease: 'power3.out' }, C.lanes + .1);
  // resultaten stromen binnen (tegelijk, elk in zijn eigen tempo)
  proc.push(t => {
    [[laneA, 0], [laneB, .17]].forEach(([L, off]) => {
      const p = prog(t, C.rows_a + off, C.count_end);
      L.rin.style.transform = `translateY(${-easeOut(p) * (20 * 30 - 200)}px)`;
    });
  });
  const s = say(['Twee strategieën.', 'Eén test.']);
  sayIn(s, C.line_s5);
  sayOut(s, S.end - .45);
  hide(test, scene('s7').start + 2.2, 'fade');
}

function buildS6() {
  const S = scene('s6');
  const v = verb('meten'); fitVerb(v);
  tl.fromTo(v, { autoAlpha: 0, x: -240 }, { autoAlpha: 1, x: 0, duration: .5, ease: 'steps(6)' }, S.start);
  const vw = Math.round(v.scrollWidth);
  const ru = el('div', 'ruler', `<span>${vw} px</span>`, world, { left: '70px', width: vw + 'px', bottom: '262px', transformOrigin: '0 50%' }); vis(ru);
  tl.set(ru, { autoAlpha: 1 }, S.start + .45);
  tl.fromTo(ru, { scaleX: 0 }, { scaleX: 1, duration: .55, ease: 'steps(8)' }, S.start + .45);
  hide(ru, S.end - .3, 'fade', { d: .2 });
  hide(v, S.end - .28, 'up', { d: .26, y: 40 });

  // bible §58: 18 juist · 1 gemist · 1 vals positief. B is een voorbeeld van een zwakkere strategie.
  const DATA = [[laneA, 18, 1, 1, '#047857'], [laneB, 12, 6, 4, '#14120F']];
  DATA.forEach(([L, ok, miss, fp, col]) => {
    L.res.innerHTML = `<div class="nums"><span><b class="n0">0</b>juist</span><span><b class="n1">0</b>gemist</span><span><b class="n2">0</b>vals</span></div><div class="bar"><i style="background:${col}"></i></div><div class="prec"><span class="mono" style="font-size:14px;color:var(--muted)">precisie</span><b class="pc" style="color:${col}">0%</b></div>`;
    gsap.set(L.res, { autoAlpha: 0 });
    show(L.res, C.count - .25, 'rise', { y: 20, d: .4 });
    const [b0, b1, b2, pc, bar] = ['.n0', '.n1', '.n2', '.pc', '.bar i'].map(q => $(q, L.res));
    const prec = ok / (ok + fp);
    proc.push(t => {
      const p = easeOut(prog(t, C.count, C.count_end));
      b0.textContent = Math.round(ok * p); b1.textContent = Math.round(miss * p); b2.textContent = Math.round(fp * p);
      pc.textContent = Math.round(prec * 100 * p) + '%';
      bar.style.transform = `scaleX(${prec * p})`;
      // vinkjes en kruisjes in de rijen
      const marked = Math.round(20 * p);
      L.rows.forEach((row, i) => {
        const ic = row.firstChild; const isOk = i < ok;
        const want = i < marked ? (isOk ? 'ok' : 'no') : '';
        if (ic.dataset.m !== want) {
          ic.dataset.m = want;
          ic.innerHTML = want === 'ok' ? '<svg width="12" height="12" viewBox="0 0 16 16"><path d="M2 8.5l4 4 8-9" fill="none" stroke="#14120F" stroke-width="3"/></svg>' : want === 'no' ? '×' : '';
          ic.style.background = want === 'no' ? 'var(--ink)' : 'transparent'; ic.style.color = 'var(--paper)';
        }
      });
    });
  });
  const s = say(['Meten,', 'niet geloven.']);
  sayIn(s, C.line_s6);
  sayOut(s, S.end - .45);
}

function buildS7() {
  const S = scene('s7');
  const v = verb('loslaten'); fitVerb(v);
  const ls = v.querySelectorAll('.l');
  tl.fromTo(v, { autoAlpha: 0, scale: 1.08, transformOrigin: '0% 100%' }, { autoAlpha: 1, scale: 1, duration: .3, ease: 'power4.out' }, S.start);
  // loslaten = de letters vallen
  tl.to(ls, { y: 520, rotation: () => (R() - .5) * 50, duration: .6, ease: 'power2.in', stagger: { each: .045, from: 'random' } }, S.end - .7);
  tl.set(v, { autoAlpha: 0 }, S.end);

  const st = el('div', 'stamp', 'afgewezen', laneB.l, { left: '50%', top: '42%', marginLeft: '-150px', fontSize: '34px', color: 'var(--crimson)', background: 'rgba(244,244,240,.88)', zIndex: 3 }); vis(st);
  show(st, C.reject_stamp, 'slam', { r: -9 });
  tl.to(laneB.l, { y: 900, rotation: 13, duration: .8, ease: 'power2.in' }, C.fall);
  const prom = el('div', 'tag', 'gepromoveerd', laneA.l, { position: 'absolute', right: '20px', top: '24px', background: 'var(--sheet)', borderColor: 'var(--emerald)', color: 'var(--emerald)' }); vis(prom);
  show(prom, C.fall + .45, 'pop', { s: .6 });

  const s1 = say(['Strategieën', 'laten we los.']);
  sayIn(s1, C.line_s7a);
  const s2 = say(['Kennis nooit.'], { css: { top: '470px' } });
  sayIn(s2, C.line_s7b, { d: .55 });
  const ul = el('div', 'abs', '', world, { left: '96px', top: '578px', width: '520px', height: '9px', background: 'var(--ink)', transformOrigin: '0 50%' }); vis(ul);
  tl.fromTo(ul, { autoAlpha: 1, scaleX: 0 }, { scaleX: 1, duration: .45, ease: 'power3.inOut' }, C.line_s7b + .35);
  sayOut(s1, S.end - .4); sayOut(s2, S.end - .36); hide(ul, S.end - .3, 'fade', { d: .2 });

  // de strategie verdwijnt, de persoon blijft (bible §2)
  hide([laneA.l, nH1], C.line_s7b - .25, 'fade', { d: .35 });
  const keep = el('div', 'card', `<div class="prov">persoon · blijft in het geheugen</div>
    <div style="display:flex;align-items:center;gap:20px;margin:18px 0 22px"><div style="width:72px;height:72px;border-radius:50%;border:2px solid var(--ink);display:grid;place-items:center;font-family:var(--mono);font-weight:600;font-size:22px">SJ</div>
      <div style="font-family:var(--cond);font-weight:780;font-stretch:80%;font-size:64px;line-height:1">S. J.</div></div>
    <div class="hist"><div><span class="prov">2019 – vandaag</span><b>Supply Chain Manager · Bedrijf A</b></div>
      <div><span class="prov">vandaag</span><b>vertrokken</b><span class="tag">bevestigd</span></div>
      <div><span class="prov">daarna</span><b>nieuwe werkgever</b><span class="tag dash">unknown</span></div></div>
    <div class="prov" style="margin-top:22px;padding-top:16px;border-top:1.5px solid var(--line);color:var(--ink)">status verandert · geschiedenis blijft</div>`, world, { left: '1040px', top: '250px', width: '780px', padding: '30px 36px 28px' });
  vis(keep);
  show(keep, C.line_s7b - .1, 'rise', { y: 30, d: .7 });
  hide(keep, scene('s8').start + .1, 'fade', { d: .25 });
}

function buildS8() {
  const S = scene('s8');
  const v = verb('ontdekken'); fitVerb(v);
  tl.fromTo(v, { autoAlpha: 0, scale: 1.35, transformOrigin: '0% 100%' }, { autoAlpha: 1, scale: 1, duration: .45, ease: 'back.out(1.4)' }, S.start);
  tl.to(v, { opacity: .1, duration: .5, ease: 'sine.inOut' }, C.brief);
  hide(v, S.end - .28, 'up', { d: .26, y: 40 });

  const q = say(['Waar zit vandaag', 'de beste kans?']);
  sayIn(q, S.start + .55);
  sayOut(q, C.approve + .1);
  const me = say(['Jij beslist.'], { cls: '', css: { fontSize: '150px', top: '330px' } });
  me.querySelector('.ln').classList.add('human'); me.querySelectorAll('.w').forEach(w => w.classList.add('human'));
  sayIn(me, C.approve + .45, { d: .8 });
  sayOut(me, S.end - .35);

  // +18 dagen: de vervangingsvacature verschijnt (bible §13)
  const pn = node('S. J.', 'vertrokken · Bedrijf A', 930, 300);
  const vac = node('Vacature: Supply Chain Manager', 'officiële vacature · Bedrijf A', 1270, 560);
  const days = el('div', 'abs', `<span class="mono" style="font-size:16px;color:var(--muted)">tijd</span><div style="font-family:var(--cond);font-weight:850;font-stretch:66%;font-size:92px;line-height:.9">+<span class="dn">0</span> dagen</div>`, world, { left: '1440px', top: '200px' }); vis(days);
  const dn = $('.dn', days);
  show(pn, S.start + .1, 'fade', { d: .3 });
  show(days, C.days - .1, 'rise', { y: 20 });
  proc.push(t => { dn.textContent = Math.round(18 * easeOut(prog(t, C.days, C.days + .55))); });
  show(vac, C.vacancy, 'drop');
  const e = edge(pn, vac, C.replacement - .25, { color: '#047857', w: 4, d: .35 });
  const rep = el('div', 'stamp', 'vervangingssignaal', world, { left: ((e.x1 + e.x2) / 2 - 230) + 'px', top: ((e.y1 + e.y2) / 2 - 34) + 'px', fontSize: '28px', color: 'var(--emerald)' }); vis(rep);
  show(rep, C.replacement, 'slam', { r: -5 });
  tl.to([pn, vac, days, e.ln, rep], { autoAlpha: 0, scale: .9, duration: .35, ease: 'power2.in' }, C.brief - .15);

  // de ochtendbriefing (bible §39, §62 — cijfers zijn het voorbeeld uit de bible)
  const br = el('div', 'card', `<div class="q">ochtendbriefing · waar zit vandaag de beste kans? · voorbeeld</div>
    <h3>Bedrijf A</h3>
    <ul><li>Supply Chain Manager vertrokken</li><li>vervangingsvacature na 18 dagen</li><li>nieuwe Operations Manager</li><li>3 passende kandidaten al in je database</li></ul>
    <div class="scores"><div class="sc"><b class="s1" style="color:var(--emerald)">0</b><span>sales-kans /100</span></div><div class="sc"><b class="s2" style="color:var(--terra)">0</b><span>recruitment-kans /100</span></div><div class="sc"><b class="s3">0%</b><span>zekerheid beslisser</span></div></div>
    <div class="act"><p>Voorstel: neem contact op met Persoon Y · 3 bronnen</p><div class="btn">Goedkeuren</div></div>`, world);
  br.id = 'brief'; vis(br);
  tl.fromTo(br, { autoAlpha: 0, scale: .55, y: 120, transformOrigin: '40% 70%' }, { autoAlpha: 1, scale: 1, y: 0, duration: .75, ease: 'expo.out' }, C.brief);
  tl.fromTo(br.querySelectorAll('.q, h3, li, .scores, .act'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .45, ease: 'power3.out', stagger: .1 }, C.brief + .3);
  const [s1, s2, s3] = ['.s1', '.s2', '.s3'].map(x => $(x, br));
  proc.push(t => { const p = easeOut(prog(t, C.scores, C.scores + 1.0)); s1.textContent = Math.round(94 * p); s2.textContent = Math.round(89 * p); s3.textContent = Math.round(91 * p) + '%'; });
  // de mens keurt goed
  const btn = $('.btn', br);
  const cur = document.createElementNS(svgNS, 'svg'); cur.id = 'cursor'; cur.setAttribute('viewBox', '0 0 24 24'); cur.style.left = '0'; cur.style.top = '0'; world.appendChild(cur);
  sv('path', { d: 'M3 2l7.5 19 2.6-7.6L21 11z', fill: '#14120F', stroke: '#F4F4F0', 'stroke-width': 1.4, 'stroke-linejoin': 'round' }, cur);
  gsap.set(cur, { autoAlpha: 0, x: 1880, y: 1000 });
  tl.set(cur, { autoAlpha: 1 }, C.cursor);
  const bb = () => box(btn);
  tl.to(cur, { x: () => bb().x + bb().w * .55, y: () => bb().y + bb().h * .45, duration: .75, ease: 'power3.inOut' }, C.cursor);
  tl.to(cur, { scale: .82, duration: .07, yoyo: true, repeat: 1, ease: 'power2.in' }, C.approve - .07);
  tl.to(btn, { backgroundColor: '#C2410C', duration: .12 }, C.approve);
  const ok = el('div', 'stamp', 'goedgekeurd', br, { right: '250px', bottom: '22px', fontSize: '40px', color: 'var(--ink)' }); vis(ok);
  show(ok, C.approve + .05, 'slam', { r: -8 });
  hide(cur, C.approve + .7, 'fade', { d: .3 });
  // de briefing wordt het eerste vel van de stapel
  tl.to(br, { autoAlpha: 0, scale: .5, x: 260, y: 220, duration: .5, ease: 'power3.in' }, S.end - .45);
}

let stack;
function buildS9AndOutro() {
  const S = scene('s9');
  const v = verb('herhalen'); fitVerb(v);
  tl.fromTo(v, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: .4, ease: 'power3.out' }, S.start);
  // montage: de negen werkwoorden flitsen voorbij, sneller dan eerst
  const vv = v; const orig = v.innerHTML;
  proc.push(t => {
    const m = C.montage;
    if (t >= m[0] && t < m[8] + .28) { const i = clamp(Math.floor((t - m[0]) / .28), 0, 8); const w = VERBS[i].toUpperCase(); if (vv.dataset.w !== w) { vv.textContent = w; vv.dataset.w = w; vv.style.fontSize = ''; fitVerb(vv); } }
    else if (vv.dataset.w !== 'HERHALEN') { vv.innerHTML = orig; vv.dataset.w = 'HERHALEN'; vv.style.fontSize = ''; fitVerb(vv); }
  });
  hide(v, S.end - .25, 'up', { d: .25, y: 40 });

  // de persoon verhuist: nieuw account én nieuwe kandidatenbron (bible §44)
  const a = node('S. J.', 'head of supply chain · nu', 96, 190);
  const b = node('Bedrijf B', '<span style="color:var(--emerald)">nieuw account</span> · <span style="color:var(--terra)">kandidatenbron</span>', 770, 190);
  show(a, C.move - .1, 'rise', { y: 20 });
  show(b, C.move + .35, 'pop', { s: .7 });
  const e = edge(a, b, C.move + .15, { label: '+5 maanden · voorbeeld' });
  hide([a, b, e.ln, e.lab], S.end - .3, 'fade', { d: .3 });

  const s = say(['Elke ronde', 'onthoudt meer.'], { css: { top: '400px' } });
  sayIn(s, C.line_s9, { d: .6 });
  sayOut(s, S.end - .3);

  // de stapel: elke ronde een vel, niets wordt weggegooid
  stack = el('div', 'abs', '', world, { left: '1390px', top: '600px', width: '1px', height: '1px', transformStyle: 'preserve-3d' });
  gsap.set(stack, { rotationX: 62, rotationZ: -10, scale: .78 });
  const sheets = [];
  for (let i = 0; i < 10; i++) {
    const label = i === 0 ? 'briefing' : VERBS[(i - 1) % 9];
    const sh = el('div', 'sheet', `<div class="mono">ronde ${String(i < 1 ? 1 : 2).padStart(2, '0')} · ${i === 0 ? 'bedrijf a' : '0' + (((i - 1) % 9) + 1)}</div><b>${label}</b>`, stack);
    gsap.set(sh, { z: 560, autoAlpha: 0 });
    sheets.push(sh);
    const at = i === 0 ? S.start + .05 : C.montage[i - 1];
    tl.fromTo(sh, { z: 560, autoAlpha: 0 }, { z: i * 16, autoAlpha: 1, duration: i === 0 ? .5 : .26, ease: 'power3.in' }, at);
  }
  vis(stack); tl.set(stack, { autoAlpha: 1 }, S.start);

  // ----------------------------- afsluiter -----------------------------
  const O = scene('outro');
  tl.to(stack, { left: 960, top: 600, scale: 1.0, rotationZ: -4, duration: 1.6, ease: 'power3.inOut' }, C.outro_hit);
  tl.to(stack, { rotationZ: 6, duration: 4.2, ease: 'sine.inOut' }, C.outro_hit + 1.6);
  tl.to(stack, { autoAlpha: .12, duration: .6 }, C.outro_hit + .2);
  const b1 = el('div', 'big', 'Originaliteit is<br>geen stijl.', world, { top: '330px' });
  const b2 = el('div', 'big', 'Het is een <span style="color:var(--terra)">lus.</span>', world, { top: '430px' });
  vis(b1); vis(b2);
  tl.fromTo(b1, { autoAlpha: 0, scale: 1.12, filter: 'blur(14px)' }, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: .9, ease: 'expo.out' }, C.outro_1);
  tl.to(b1, { autoAlpha: 0, y: -60, duration: .32, ease: 'power2.in' }, C.outro_2 - .35);
  tl.fromTo(b2, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: .7, ease: 'expo.out' }, C.outro_2);
  tl.to(b2, { autoAlpha: 0, scale: .96, duration: .3, ease: 'power2.in' }, C.logo - .3);
  tl.to(stack, { autoAlpha: 0, duration: .5 }, C.logo - .3);

  const logo = el('div', 'abs', '', world); logo.id = 'logo';
  const wm = el('div', 'wm', '', logo);
  const ring = ringSvg(wm, 132, 6);
  el('div', 'name', 'RecruitmentAI', wm);
  const desc = el('div', 'desc', 'lerend recruitment-intelligentiesysteem · voor belgische bureaus', logo);
  const tg = el('div', 'tl', 'Jij beslist. Het systeem leert.', logo);
  const inv = el('div', 'tag inv', 'op uitnodiging', logo);
  vis(logo);
  tl.set(logo, { autoAlpha: 1 }, C.logo);
  tl.fromTo(ring.ticks, { autoAlpha: 0, scale: .2, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .32, ease: 'back.out(3)', stagger: .055 }, C.logo);
  tl.fromTo($('.name', logo), { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: .8, ease: 'expo.out' }, C.logo + .25);
  show(desc, C.logo + .55, 'fade', { d: .5 });
  show(tg, C.tagline, 'rise', { y: 22, d: .7 });
  show(inv, C.invite, 'pop', { s: .8 });
  proc.push(t => {
    if (t < C.logo + .8) return;
    const hl = Math.floor((t - C.logo) * 2.25) % 9;   // de lus blijft lopen
    ring.ticks.forEach((ln, i) => { ln.setAttribute('stroke', i === hl ? '#C2410C' : '#14120F'); ln.setAttribute('stroke-width', i === hl ? 9 : 6); });
  });
}

// ============================================================================================
// textuur: korrel (deterministisch)
// ============================================================================================
const grain = $('#grain'), gctx = grain.getContext('2d');
const tiles = [];
function buildGrain() {
  for (let k = 0; k < 1; k++) {
    const r = rng(99 + k), img = gctx.createImageData(960, 540);
    for (let i = 0; i < img.data.length; i += 4) { const v = 128 + (r() - .5) * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
    tiles.push(img);
  }
}
// statisch: papier beweegt niet, en bewegende ruis vreet bitrate die platforms toch wegcomprimeren
proc.push(() => { if (!grain.dataset.f) { gctx.putImageData(tiles[0], 0, 0); grain.dataset.f = '0'; } });

// ============================================================================================
// opbouw + klok
// ============================================================================================
function render(t) {
  t = clamp(t, 0, DUR);
  tl.seek(t, false);
  for (const f of proc) f(t);
}
window.__seek = t => render(t);
window.__duration = DUR;

function fit() {
  if (RENDER) return;
  const s = Math.min(innerWidth / 1920, innerHeight / 1080);
  stage.style.transform = `translate(${(innerWidth - 1920 * s) / 2}px, ${(innerHeight - 1080 * s) / 2}px) scale(${s})`;
}
addEventListener('resize', fit);

document.fonts.ready.then(() => {
  buildGrain();
  buildEchoMsg(); buildEchoAI(); buildHud(); buildClock(); buildPromise();
  buildS1(); buildS2(); buildS3(); buildS4(); buildS5(); buildS6(); buildS7(); buildS8(); buildS9AndOutro();
  render(0);
  fit();
  document.body.dataset.ready = '1';
  if (!RENDER) player();
});

// ---------- speler ----------
function player() {
  const audio = $('#audio'), pp = $('#pp'), bar = $('#bar'), fill = $('#bar i'), tc = $('#tc'), start = $('#start');
  let playing = false, clock0 = 0, offset = 0, useAudio = true, hideTimer;
  audio.addEventListener('error', () => { useAudio = false; });
  const now = () => useAudio && !isNaN(audio.duration) ? audio.currentTime : offset + (playing ? (performance.now() - clock0) / 1000 : 0);
  function setT(t) { t = clamp(t, 0, DUR); offset = t; clock0 = performance.now(); if (useAudio) try { audio.currentTime = t; } catch (e) {} render(t); }
  function play() { if (now() >= DUR - .05) setT(0); playing = true; clock0 = performance.now(); offset = now(); if (useAudio) audio.play().catch(() => { useAudio = false; }); pp.textContent = '❚❚'; start.style.display = 'none'; loop(); }
  function pause() { offset = now(); playing = false; if (useAudio) audio.pause(); pp.textContent = '▶'; }
  function toggle() { playing ? pause() : play(); }
  function loop() {
    if (!playing) return;
    const t = now(); render(t);
    fill.style.width = (t / DUR * 100) + '%'; tc.textContent = `${t.toFixed(1).padStart(4, '0')} / ${DUR.toFixed(1)}`; bar.setAttribute('aria-valuenow', t.toFixed(1));
    if (t >= DUR) { pause(); return; }
    requestAnimationFrame(loop);
  }
  start.addEventListener('click', play);
  pp.addEventListener('click', toggle);
  bar.addEventListener('click', e => { const r = bar.getBoundingClientRect(); setT((e.clientX - r.left) / r.width * DUR); fill.style.width = (offset / DUR * 100) + '%'; });
  addEventListener('keydown', e => {
    if (e.code === 'Space') { e.preventDefault(); toggle(); }
    if (e.code === 'ArrowRight') setT(now() + 2);
    if (e.code === 'ArrowLeft') setT(now() - 2);
    if (e.key === 'f') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
  });
  addEventListener('mousemove', () => { document.body.classList.add('ui'); clearTimeout(hideTimer); hideTimer = setTimeout(() => document.body.classList.remove('ui'), 2400); });
}
})();
