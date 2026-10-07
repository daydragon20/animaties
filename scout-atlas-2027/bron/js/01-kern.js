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
const N = { bg: "#071519", paper: "#ede6d1", mint: "#7cf0c4", sun: "#f6e6a2", coral: "#ff8b66", muted: "#a9bdb9", soft: "#c9d8d4", dim: "#1a4a50" };
const D = { bg: "#efe7d4", ink: "#10262c", mint: "#0e7a5f", mintL: "#5cc79c", ochre: "#9a6606", coral: "#c63f20", sub: "#34504a", soft: "#4d6862", card: "#f8f3e6" };
// kleuren voor de verkenner en de landschapskubussen (één tint: donker teal → helder mint)
const COL = { night: "#04090b", paper: "#efe9da", muted: "#9bb0ac", soft: "#c3d2ce", gold: "#f2c374", mint: "#7cf0c4", coral: "#ff8b66" };
const RAMP = ["#0d2b2a", "#124240", "#185b55", "#1f776b", "#2a9580", "#3fb393", "#5fd0a8", "#8be6c0", "#c3f6dd"];
function scoreCol(v, lo = 60, hi = 100) {
  const p = clamp((v - lo) / (hi - lo)) * (RAMP.length - 1);
  const i = Math.min(RAMP.length - 2, Math.floor(p));
  return hexLerp(RAMP[i], RAMP[i + 1], p - i);
}

/* ───────────── data (alles rekenen we zelf uit de ruwe scores en gewichten) ───────────── */
const M = berekenModel(DATA);
const V = M.V, CATS = M.CATS, CC = M.C;       // CC: landen op exacte eindscore, 1 = beste
const byWeight = M.byWeight, catW = M.catW;
const TOP = CC.slice(0, 10);
const isTop = (n) => TOP.some((r) => r.name === n);
const WIN = CC[0];
const C = (name) => { const r = M.by[name]; if (!r) throw new Error("Land ontbreekt: " + name); return r; };
const heaviest = M.heaviest, lightest = M.lightest;
const fTot = (c) => nl(c.totalExact, 2);           // eindscore: 2 decimalen
const fCat = (c, k) => nl(c.catExact[k], 1);       // categoriescore: 1 decimaal (gewogen)
const topMax = {}, topMin = {};
CATS.forEach((c) => { topMax[c] = Math.max(...TOP.map((r) => r.cat[c])); topMin[c] = Math.min(...TOP.map((r) => r.cat[c])); });
const bestIn = (r) => CATS.filter((c) => r.cat[c] === topMax[c]);
const worstIn = (r) => CATS.filter((c) => r.cat[c] === topMin[c]);
const lowestCat = (r) => r.worst, highestCat = (r) => r.best;
const SHORT = { // korte namen waar de ruimte krap is
  "Veiligheid & gezondheid": "Veiligheid", "Avontuur & activiteiten": "Avontuur", "Landschap & wow-factor": "Landschap",
  "Internationale scouting": "Int. scouting", "Uniek tegenover andere groepen": "Uniek",
};
const short = (c) => SHORT[c] || c;
const YEAR = (DATA.scope.match(/(20\d\d)/) || [])[1] || "";
const MONTHS = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
const [gy, gm, gd] = DATA.generated.split("-").map(Number);
const GEN = `${gd} ${MONTHS[gm - 1]} ${gy}`;
const AGES = (DATA.scope.match(/(\d+)\s*-\s*(\d+)\s*,/) || []);
const MEMBERS = (DATA.scope.match(/,\s*(\d+)\s*-\s*(\d+)\s*leden/) || []);
const pinOrder = Object.keys(MAP.pts).filter((n) => n !== "België").sort((a, b) => MAP.pts[a][0] - MAP.pts[b][0]);
pinOrder.forEach((n) => C(n)); // controle: elke kaartnaam bestaat in de data
if (pinOrder.length !== CC.filter((c) => c.name !== "Canada").length) throw new Error("Kaart en data hebben niet dezelfde landen");

// Race: gewogen tussenstand van de top 10 na elke categorie (zwaarste eerst), op de ruwe scores.
// Na de laatste categorie is dat exact de eindscore en de eindvolgorde.
const RACE = (() => {
  const acc = TOP.map(() => [0, 0]);
  return byWeight.map((c, k) => {
    TOP.forEach((r, j) => V.forEach((v, i) => { if (v.category === c) { acc[j][0] += v.weight * r.scores[i]; acc[j][1] += v.weight; } }));
    const last = k === byWeight.length - 1;
    const val = TOP.map((r, j) => (last ? r.totalExact : acc[j][0] / acc[j][1]));
    const order = TOP.map((_, j) => j).sort((a, b) => val[b] - val[a]);
    const pos = []; order.forEach((j, p) => (pos[j] = p));
    return { c, val, pos, leader: TOP[order[0]], order };
  });
})();

/* ───────────── tijdlijn (120 BPM: 1 tel = 0,5 s, 1 maat = 2 s) ───────────── */
const T = { s1: 0, s2: 12, s3: 38, s4: 50, s5: 66, s6: 94, s7: 114, s8: 128, end: 140 };
const CHAPTERS = [["De vraag", T.s1], ["De weging", T.s2], ["De kandidaten", T.s3], ["Het landschap", T.s4], ["De race", T.s5], ["Het vergelijk", T.s6], ["Het podium", T.s7], ["De bestemming", T.s8]];
const chapterAt = (t) => { let k = 0; CHAPTERS.forEach(([, a], i) => { if (t >= a) k = i; }); return k; };
const CUE = {
  // 1 · de vraag
  hook: [2.4, 5.2, 7.8], sunrise: [3.4, 5.0], push: 9.0, pushEnd: 11.6,
  // 2 · de weging
  countA: T.s2 + 0.4, grow: T.s2 + 5.2, fly: T.s2 + 9.8,
  fillA: T.s2 + 10.6, fillB: T.s2 + 14.4, hl: T.s2 + 14.6, coral: T.s2 + 21.2,
  // 3 · de kandidaten
  pinA: T.s3 + 1.0, pinStep: 0.12, labelA: T.s3 + 5.4, labelStep: 0.1, focus: T.s3 + 8.6,
  // 4 · het landschap
  ls: { grow: T.s4 + 0.4, a: T.s4 + 1.6, b: T.s4 + 5.8, peaks: T.s4 + 7.0, sort: T.s4 + 8.6, end: T.s4 + 16 },
  // 5 · de race: drie uitgelegde stappen, dan elke seconde een categorie
  race: [1.8, 5.2, 8.6, 12.6, 13.6, 14.6, 15.6, 16.6, 17.6, 18.6, 19.6, 20.6, 21.6, 22.6].map((x) => T.s5 + x),
  finalLabel: T.s5 + 24.0,
  // 6 · het vergelijk
  gridFocus: [T.s6 + 4.6, T.s6 + 7.0, T.s6 + 11.8, T.s6 + 16.4],
  // 7 · het podium
  podium: [T.s7 + 1.0, T.s7 + 3.0, T.s7 + 6.4],
  // 8 · de bestemming
  route: T.s8 + 2.0, routeEnd: T.s8 + 5.6,
};
// licht (1) of donker (0) per moment: dag in de meeste scènes, nacht voor het landschap en de race
function lightAt(t) {
  if (t < T.s2) return E.inOut(seg(t, CUE.sunrise[0], CUE.sunrise[1]));
  if (t < T.s4 - 0.5) return 1;
  if (t < T.s6 - 0.5) return 1 - E.inOut(seg(t, T.s4 - 0.5, T.s4 + 0.1));
  return E.inOut(seg(t, T.s6 - 0.5, T.s6 + 0.1));
}

const stage = document.getElementById("stage");
const renders = [];   // elke functie krijgt de tijd t en zet de scène op dat moment
