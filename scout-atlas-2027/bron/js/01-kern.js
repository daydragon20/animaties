/* ═════════════ KERN: hulpjes, data, tijdlijn ═════════════ */
const NS = "http://www.w3.org/2000/svg";
function el(tag, attrs, parent, html) {
  const e = document.createElement(tag);
  for (const k in attrs || {}) {
    if (k === "class") e.className = attrs[k];
    else if (k === "style") e.style.cssText = attrs[k];
    else e.setAttribute(k, attrs[k]);
  }
  if (html != null) e.innerHTML = html;
  if (parent) parent.appendChild(e);
  return e;
}
function sv(tag, attrs, parent, text) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs || {}) e.setAttribute(k, attrs[k]);
  if (text != null) e.textContent = text;
  if (parent) parent.appendChild(e);
  return e;
}
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const E = {
  out: (p) => 1 - Math.pow(1 - p, 3),
  out5: (p) => 1 - Math.pow(1 - p, 5),
  inOut: (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
  inOut2: (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
  in: (p) => p * p * p,
  back: (p) => { const c1 = 1.6, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
};
// zichtbaar van a tot b met in- en uitfade
function win(t, a, b, fi = 0.4, fo = 0.4) {
  if (t < a || t > b) return 0;
  return Math.min(fi > 0 ? E.out(seg(t, a, a + fi)) : 1, fo > 0 ? 1 - E.inOut(seg(t, b - fo, b)) : 1);
}
function set(e, o, x = 0, y = 0, s = 1, r = 0) {
  e.style.opacity = o;
  e.style.visibility = o <= 0.002 ? "hidden" : "visible";
  e.style.transform = `translate(${x}px,${y}px) scale(${s})` + (r ? ` rotate(${r}deg)` : "");
}
function op(e, o) { e.style.opacity = o; e.style.visibility = o <= 0.002 ? "hidden" : "visible"; }
function inout(e, t, a, b, d = 0.5, dist = 26) {
  const pi = E.out5(seg(t, a, a + d)), po = E.in(seg(t, b - 0.4, b));
  set(e, pi * (1 - po), 0, (1 - pi) * dist - po * dist);
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const hex2rgb = (h) => h.replace("#", "").match(/\w\w/g).map((x) => parseInt(x, 16));
const hexLerp = (h1, h2, p) => {
  const a = hex2rgb(h1), b = hex2rgb(h2);
  return "#" + a.map((v, i) => Math.round(lerp(v, b[i], clamp(p))).toString(16).padStart(2, "0")).join("");
};
// Nederlandse getallen: komma als decimaalteken, punt voor duizendtallen
function nl(x, d = 1) {
  const s = (Math.round(x * Math.pow(10, d) + 1e-9 * Math.sign(x)) / Math.pow(10, d)).toFixed(d);
  const [i, f] = s.split(".");
  return i.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + (f ? "," + f : "");
}
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function numWord(n) {
  const een = ["nul", "één", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen", "tien", "elf", "twaalf", "dertien", "veertien", "vijftien", "zestien", "zeventien", "achttien", "negentien"];
  const tien = ["", "", "twintig", "dertig", "veertig", "vijftig", "zestig", "zeventig", "tachtig", "negentig"];
  let s;
  if (n < 20) s = een[n];
  else if (n < 100) { const e = n % 10, z = Math.floor(n / 10); s = e ? een[e] + (een[e].endsWith("e") ? "ën" : "en") + tien[z] : tien[z]; s = s.replace("éénen", "eenen"); }
  else s = String(n);
  return s.charAt(0).toUpperCase() + s.slice(1);
}
const lijst = (xs) => (xs.length <= 1 ? xs.join("") : xs.slice(0, -1).join(", ") + " en " + xs[xs.length - 1]);
// woorden die één voor één binnenkomen; "*woord*" kleurt een woord (of reeks woorden) mee
function words(parent, text, cls = "") {
  const out = [];
  let mode = false;
  text.split(" ").forEach((w, i, arr) => {
    const o = el("span", { class: "w" }, parent);
    let m = mode;
    if (w.startsWith("*")) { m = true; w = w.slice(1); }
    const close = /\*[.,!?:;…]*$/.test(w);
    if (close) w = w.replace(/\*([.,!?:;…]*)$/, "$1");
    const sp = el("span", { class: m ? "hl" + cls : "" }, o, w);
    out.push(sp);
    mode = close ? false : m;
    if (i < arr.length - 1) parent.appendChild(document.createTextNode(" "));
  });
  return out;
}
function revealWords(ws, t, a, step = 0.1, dur = 0.5) {
  ws.forEach((w, i) => {
    const p = E.out5(seg(t, a + i * step, a + i * step + dur));
    w.style.transform = `translateY(${(1 - p) * 110}%)`;
    w.style.opacity = p;
  });
}

/* ───────────── kleuren: nacht (donker) en dag (atlaspapier) ───────────── */
const N = { bg: "#071519", paper: "#ede6d1", mint: "#7cf0c4", sun: "#f6e6a2", coral: "#ff8b66", muted: "#a9bdb9", soft: "#c9d8d4", dim: "#1a4a50", gold: "#f2c374" };
const D = { bg: "#efe7d4", ink: "#10262c", mint: "#0e7a5f", mintL: "#5cc79c", ochre: "#9a6606", gold: "#e3bd52", coral: "#c63f20", sub: "#34504a", soft: "#4d6862", card: "#f8f3e6" };
const COL = { night: "#04090b", paper: "#efe9da", muted: "#9bb0ac", soft: "#c3d2ce", gold: "#f2c374", mint: "#7cf0c4", coral: "#ff8b66" };
const RAMP = ["#0d2b2a", "#124240", "#185b55", "#1f776b", "#2a9580", "#3fb393", "#5fd0a8", "#8be6c0", "#c3f6dd"];
function scoreCol(v, lo = 30, hi = 100) {
  const p = clamp((v - lo) / (hi - lo)) * (RAMP.length - 1);
  const i = Math.min(RAMP.length - 2, Math.floor(p));
  return hexLerp(RAMP[i], RAMP[i + 1], p - i);
}
// kleur per tier: 1 = mint (zwaar), 2 = goud (kamperen), 3 = zacht
const TIERCOL = { 1: { n: "#7cf0c4", d: "#0e7a5f" }, 2: { n: "#f2c374", d: "#9a6606" }, 3: { n: "#c3d2ce", d: "#4d6862" } };

/* ───────────── data (alles rekenen we zelf uit de scores en gewichten) ───────────── */
const M = berekenModel(DATA);
const V = M.V, CATS = M.CATS, CC = M.C, ELIG = M.ELIG, TIERS = M.TIERS;
const byWeight = M.byWeight, catW = M.catW;
const TOP = ELIG.slice(0, 10);
const isTop = (n) => TOP.some((r) => r.name === n);
const WIN = ELIG[0];
const C = (name) => { const r = M.by[name]; if (!r) throw new Error("Land ontbreekt: " + name); return r; };
const fTot = (c) => nl(c.totalExact, 1);            // eindscore: 1 decimaal
const fTot2 = (c) => nl(c.totalExact, 2);           // eindscore: 2 decimalen (verkenner)
const fCat = (c, k) => nl(c.catExact[k], 1);        // categoriescore: 1 decimaal
const fTier = (c, t) => nl(c.tierExact[t], 1);
const catName = (k) => M.CATN[k], short = (k) => M.CATK[k];
const tierOf = (k) => M.CATT[k];
const NR = DATA.aantal_rondes || (DATA.rondeOverzicht || []).length || 0;
const KO = CC.filter((c) => !c.ok);                 // knock-outs (reisadvies)
const YEAR = (DATA.scope.match(/(20\d\d)/) || [])[1] || "2027";
const MONTHS = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
const [gy, gm, gd] = DATA.generated.split("-").map(Number);
const GEN = `${gd} ${MONTHS[gm - 1]} ${gy}`;
const pinOrder = Object.keys(MAP.pts).filter((n) => n !== "België").sort((a, b) => MAP.pts[a][0] - MAP.pts[b][0]);
pinOrder.forEach((n) => C(n)); // controle: elke kaartnaam bestaat in de data
if (pinOrder.length !== CC.length) throw new Error(`Kaart (${pinOrder.length}) en data (${CC.length}) hebben niet dezelfde landen`);

// Race: gewogen tussenstand van de top 10 na elke categorie (zwaarste eerst), op de scores per variabele.
// Na de laatste categorie is dat exact de eindscore en de eindvolgorde.
const RACE = (() => {
  const acc = TOP.map(() => [0, 0]);
  return byWeight.map((c, k) => {
    TOP.forEach((r, j) => V.forEach((v, i) => { if (v.categorie === c && r.scores[i] != null) { acc[j][0] += v.gewicht * r.scores[i]; acc[j][1] += v.gewicht; } }));
    const last = k === byWeight.length - 1;
    const val = TOP.map((r, j) => (last ? r.totalExact : acc[j][0] / acc[j][1]));
    const order = TOP.map((_, j) => j).sort((a, b) => val[b] - val[a]);
    const pos = []; order.forEach((j, p) => (pos[j] = p));
    return { c, val, pos, leader: TOP[order[0]], order };
  });
})();

/* ───────────── tijdlijn (120 BPM: 1 tel = 0,5 s, 1 maat = 2 s) ───────────── */
const T = { s1: 0, s2: 16, s3: 32, s4: 60, s5: 78, s6: 106, s7: 124, s8: 140, s9: 178, end: 204 };
const CHAPTERS = [["Het kamp", T.s1], ["De kandidaten", T.s2], ["De weging", T.s3], ["Het landschap", T.s4], ["De race", T.s5], ["De ruimte", T.s6], ["Het podium", T.s7], ["Het kamp daar", T.s8], ["De bestemming", T.s9]];
const chapterAt = (t) => { let k = 0; CHAPTERS.forEach(([, a], i) => { if (t >= a) k = i; }); return k; };
const CUE = {
  // 1 · het kamp: vuur, terugtrekken, snede naar de bol, zonsopgang, duik naar Europa
  fire: 0.6, pull: [1.2, 5.2], cut: [5.0, 5.5], hook: [2.4, 5.8, 9.2], sunrise: [7.2, 10.6], push: 12.6, pushEnd: 16.0,
  // 2 · de kandidaten
  pinA: T.s2 + 1.2, pinStep: 0.1, labelA: T.s2 + 5.6, labelStep: 0.08, drop: T.s2 + 10.0, count: T.s2 + 12.4,
  // 3 · de weging: (a) rugzak 32–44, (b) meters 44–52, (c) tien rondes 52–60
  wg: { a: T.s3, tiles: T.s3 + 1.2, fly: T.s3 + 4.6, layers: [T.s3 + 5.2, T.s3 + 7.4], shares: T.s3 + 8.0, b: T.s3 + 12, meter: [T.s3 + 12.8, T.s3 + 15.2, T.s3 + 17.6], c: T.s3 + 20, cols: T.s3 + 20.8, merge: T.s3 + 24.6, end: T.s4 },
  // 4 · het landschap
  ls: { grow: T.s4 + 0.4, a: T.s4 + 1.6, b: T.s4 + 6.0, peaks: T.s4 + 7.2, sort: T.s4 + 9.2, top: T.s4 + 13.6, end: T.s5 },
  // 5 · de race: drie uitgelegde stappen, dan sneller
  race: null, finalLabel: null,
  // 6 · de ruimte
  ru: { axes: T.s6 + 0.4, dots: T.s6 + 1.6, orbit: [T.s6 + 2.0, T.s6 + 9.0], flat: [T.s6 + 9.0, T.s6 + 11.0], focus: [T.s6 + 11.4, T.s6 + 14.2, T.s6 + 16.4], end: T.s7 },
  // 7 · het podium
  podium: [T.s7 + 1.0, T.s7 + 3.0, T.s7 + 6.4], rest: T.s7 + 8.6, wins: T.s7 + 9.6,
  // 8 · het kamp daar: titel, vijf activiteiten (elk 4,6 s), de slaapplaats, nummer 2 en 3
  kb: { title: T.s8 + 0.6, acts: [0, 1, 2, 3, 4].map((i) => T.s8 + 3.0 + i * 4.6), actD: 4.6, sleep: T.s8 + 26.0, others: T.s8 + 31.0, end: T.s9 },
  // 9 · de bestemming
  route: T.s9 + 2.0, routeEnd: T.s9 + 6.0, list: T.s9 + 9.0, credits: T.s9 + 18.0,
};
// race-tijden: de eerste drie categorieën krijgen 3,4 s, de rest 1,6 s; het geheel past in de scène
(() => {
  const n = byWeight.length, slow = Math.min(3, n), fast = n - slow;
  const avail = T.s6 - T.s5 - 2.4 - 3.6; // begin + slotlabel
  const slowD = 3.4, fastD = Math.max(1.2, (avail - slow * slowD) / Math.max(1, fast));
  const ts = []; let t = T.s5 + 1.8;
  for (let i = 0; i < n; i++) { ts.push(t); t += i < slow ? slowD : fastD; }
  CUE.race = ts; CUE.finalLabel = t + 0.4;
})();
// licht (1) of donker (0) per moment
function lightAt(t) {
  if (t < T.s2) return E.inOut(seg(t, CUE.sunrise[0], CUE.sunrise[1]));
  if (t < T.s4 - 0.5) return 1;
  if (t < T.s6 - 0.5) return 1 - E.inOut(seg(t, T.s4 - 0.5, T.s4 + 0.1));
  return E.inOut(seg(t, T.s6 - 0.5, T.s6 + 0.1));
}

const stage = document.getElementById("stage");
const renders = [];   // elke functie krijgt de tijd t en zet de scène op dat moment
