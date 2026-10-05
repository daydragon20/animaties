/* ═════════════ KERN: hulpjes, data, tijdlijn, HUD ═════════════ */
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
  sine: (p) => -(Math.cos(Math.PI * p) - 1) / 2,
  in: (p) => p * p * p,
  in2: (p) => p * p,
  back: (p) => { const c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
  expo: (p) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p)),
};
// zichtbaarheid van a tot b met in- en uitfade
function win(t, a, b, fi = 0.5, fo = 0.5) {
  if (t < a || t > b) return 0;
  return Math.min(fi > 0 ? E.out(seg(t, a, a + fi)) : 1, fo > 0 ? 1 - E.inOut(seg(t, b - fo, b)) : 1);
}
function set(e, o, x = 0, y = 0, s = 1, r = 0, blur = 0) {
  e.style.opacity = o;
  e.style.visibility = o <= 0.002 ? "hidden" : "visible";
  e.style.transform = `translate(${x}px,${y}px) scale(${s})` + (r ? ` rotate(${r}deg)` : "");
  e.style.filter = blur > 0.05 ? `blur(${blur}px)` : "";
}
function op(e, o) { e.style.opacity = o; e.style.visibility = o <= 0.002 ? "hidden" : "visible"; }
// rustig in, rustig uit: zachte blur en een kleine verschuiving (geen "pop")
function inout(e, t, a, b, d = 0.9, dist = 18, fo = 0.6) {
  const pi = E.out5(seg(t, a, a + d)), po = E.inOut(seg(t, b - fo, b));
  set(e, pi * (1 - po), 0, (1 - pi) * dist - po * dist * 0.5, 1, 0, (1 - pi) * 10 + po * 8);
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
const fTot = (c) => nl(c.totalExact, 2);           // eindscore: 2 decimalen
const fCat = (c, k) => nl(c.catExact[k], 1);       // categoriescore: 1 decimaal (gewogen)
// woorden die één voor één binnenkomen (zachte blur, geen harde sprong)
// opmaak in de tekst: *goud cursief* en _mint_ (mag over meerdere woorden lopen)
function words(parent, text) {
  const out = [];
  let mode = "";
  text.split(" ").forEach((w, i, arr) => {
    const o = el("span", { class: "w" }, parent);
    let m = mode;
    if (/^[*_]/.test(w)) { m = w[0]; w = w.slice(1); }
    const close = /[*_][.,!?:;…]*$/.test(w);
    if (close) w = w.replace(/[*_]([.,!?:;…]*)$/, "$1");
    const cls = m === "*" ? "it gold" : m === "_" ? "mint" : "";
    out.push(el("span", { class: cls }, o, w));
    mode = close ? "" : m;
    if (i < arr.length - 1) parent.appendChild(document.createTextNode(" "));
  });
  return out;
}
function revealWords(ws, t, a, step = 0.12, dur = 0.9) {
  ws.forEach((w, i) => {
    const p = E.out5(seg(t, a + i * step, a + i * step + dur));
    w.style.transform = `translateY(${(1 - p) * 40}%)`;
    w.style.opacity = p;
    w.style.filter = p < 0.99 ? `blur(${(1 - p) * 12}px)` : "";
  });
}

/* ───────────── kleuren ───────────── */
const COL = { night: "#04090b", paper: "#efe9da", muted: "#7d918e", soft: "#a9bab6", gold: "#f2c374", mint: "#7cf0c4", coral: "#ff7d5c", deep: "#0b2a26" };
// sequentiële schaal voor scores (één tint: donker teal → helder mint), domein 60–100
const RAMP = ["#0d2b2a", "#124240", "#185b55", "#1f776b", "#2a9580", "#3fb393", "#5fd0a8", "#8be6c0", "#c3f6dd"];
function scoreCol(v, lo = 60, hi = 100) {
  const p = clamp((v - lo) / (hi - lo)) * (RAMP.length - 1);
  const i = Math.min(RAMP.length - 2, Math.floor(p));
  return hexLerp(RAMP[i], RAMP[i + 1], p - i);
}

/* ───────────── data ───────────── */
const M = berekenModel(DATA);
const V = M.V, CATS = M.CATS, CC = M.C; // CC: landen op exacte eindscore, 1 = beste
const WIN = CC[0], SECOND = CC[1], LAST = CC[CC.length - 1];
const YEAR = (DATA.scope.match(/(20\d\d)/) || [])[1] || "";
const MONTHS = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
const [gy, gm, gd] = DATA.generated.split("-").map(Number);
const GEN = `${gd} ${MONTHS[gm - 1]} ${gy}`;
const AGES = (DATA.scope.match(/(\d+)\s*-\s*(\d+)\s*,/) || []);
const MEMBERS = (DATA.scope.match(/,\s*(\d+)\s*-\s*(\d+)\s*leden/) || []);
const SHORT = { // korte namen voor categorieën waar de ruimte krap is
  "Veiligheid & gezondheid": "Veiligheid", "Avontuur & activiteiten": "Avontuur", "Landschap & wow-factor": "Landschap",
  "Internationale scouting": "Int. scouting", "Uniek tegenover andere groepen": "Uniek", "Weer & natuur": "Weer & natuur",
};
const short = (c) => SHORT[c] || c;
// coördinaten (lengte, breedte) voor bol en HUD; kaartpunten komen uit kaart.json
const GEO = {
  "Slovenië": [14.8, 46.12], "Portugal": [-8.1, 39.7], "Slowakije": [19.6, 48.7], "Kroatië": [15.9, 45.45], "Oostenrijk": [14.2, 47.55],
  "Polen": [19.3, 52.1], "Tsjechië": [15.4, 49.8], "Zwitserland": [8.2, 46.8], "Spanje": [-3.6, 40.0], "Griekenland": [21.9, 39.4],
  "Montenegro": [19.25, 42.8], "Frankrijk": [2.4, 46.7], "Hongarije": [19.3, 47.15], "Italië": [12.6, 42.9], "Duitsland": [10.3, 51.1],
  "Albanië": [20.05, 41.1], "Bosnië en Herzegovina": [17.8, 44.2], "Canada": [-100.0, 56.0], "Roemenië": [24.9, 45.9],
  "Noord-Macedonië": [21.7, 41.6], "Servië": [20.8, 44.1], "Bulgarije": [25.2, 42.7], "Turkije": [34.0, 39.1], "Kosovo": [20.85, 42.6],
  "Georgië": [43.6, 42.15], "België": [4.47, 50.65],
};
CC.forEach((c) => { if (!GEO[c.name]) throw new Error("Coördinaten ontbreken voor " + c.name); });

/* ───────────── tijdlijn (80 BPM: 1 tel = 0,75 s, 1 maat = 3 s) ───────────── */
const BEAT = 0.75, BAR = 3;
const T = {};
T.s0 = 0;            // proloog
T.s1 = 27;           // de meetlat
T.s2 = 66;           // het landschap
T.s3 = 84;           // de afvaltocht
// de afvaltocht: van 25 naar 11, dan 10..4, dan de top 3
const SLOT = {};
(() => {
  let t = T.s3 + 3 * BEAT + 2 * BEAT; // hoofdstukkaart (3 tellen) + kaart van Europa (2 tellen)
  const n = CC.length;
  // eerst traag, dan versnellend; Canada (over de oceaan) krijgt extra tijd voor de camerareis
  const beatsFor = (rank) => (CC[rank - 1].name === "Canada" ? 4 : rank === n ? 4 : rank >= n - 3 ? 3 : 2);
  for (let r = n; r >= 11; r--) { SLOT[r] = { a: t, b: t + beatsFor(r) * BEAT }; t = SLOT[r].b; }
  T.ten = t; t += 4 * BEAT;                      // "nog tien over"
  for (let r = 10; r >= 4; r--) { SLOT[r] = { a: t, b: t + 4 * BEAT }; t = SLOT[r].b; }
  T.top3 = t; t += 4 * BEAT;                     // "de top drie"
  SLOT[3] = { a: t, b: t + 6 * BEAT }; t = SLOT[3].b;
  SLOT[2] = { a: t, b: t + 6 * BEAT }; t = SLOT[2].b;
  T.build = t; t += 6 * BEAT;                    // spanning
  SLOT[1] = { a: t, b: t + 10 * BEAT }; t = SLOT[1].b;
  T.flash = SLOT[1].a;
  T.s4 = t;                                      // waarom de winnaar
})();
T.s5 = T.s4 + 21;    // eerlijk is eerlijk + slot
T.end = T.s5 + 24;
const CHAPTERS = [
  ["De vraag", T.s0], ["De meetlat", T.s1], ["Het landschap", T.s2], ["De afvaltocht", T.s3],
  ["Waarom " + WIN.name, T.s4], ["Eerlijk is eerlijk", T.s5],
];
const chapterAt = (t) => { let k = 0; CHAPTERS.forEach(([, a], i) => { if (t >= a) k = i; }); return k; };

const stage = document.getElementById("stage");
const renders = [];   // elke functie krijgt de tijd t en zet de scène op dat moment
let sceneRootEl = null;
// gedeelde HUD-toestand: scènes zetten coördinaten en een label; elke frame begint opnieuw bij België
const HUD = { geo: { lon: GEO["België"][0], lat: GEO["België"][1] }, tag: "", dim: 0 };
renders.push(() => { HUD.geo.lon = GEO["België"][0]; HUD.geo.lat = GEO["België"][1]; HUD.tag = ""; HUD.dim = 0; });

/* ───────────── HUD (kader zoals in de referenties) ───────────── */
function buildHud() {
  const H = el("div", { class: "L" }, stage);
  const svg = sv("svg", { width: 1920, height: 1080, style: "position:absolute;left:0;top:0" }, H);
  const br = [[34, 34, 1, 1], [1886, 34, -1, 1], [34, 1046, 1, -1], [1886, 1046, -1, -1]].map(([x, y, sx, sy]) =>
    sv("path", { d: `M${x} ${y + sy * 22} L${x} ${y} L${x + sx * 22} ${y}`, fill: "none", "stroke-width": 1.4, stroke: COL.paper }, svg));
  const tl = el("div", { class: "a mono", style: "left:66px;top:46px;font-size:12px;letter-spacing:.34em;font-weight:500" }, H,
    `<span style="color:${COL.mint}">●</span>&nbsp; SCOUT ATLAS ${YEAR} <span style="color:${COL.muted}">— VERKENNERS ${AGES[1] || ""}–${AGES[2] || ""}</span>`);
  const tr = el("div", { class: "a mono", style: "right:66px;top:46px;font-size:12px;letter-spacing:.34em;font-weight:500;text-align:right" }, H);
  const bl = el("div", { class: "a mono", style: "left:66px;bottom:44px;font-size:12px;letter-spacing:.22em;color:" + COL.muted }, H);
  const brt = el("div", { class: "a mono", style: "right:66px;bottom:44px;font-size:12px;letter-spacing:.22em;font-variant-numeric:tabular-nums;color:" + COL.muted }, H);
  // hoofdstuk-diamantjes onderaan in het midden
  const dots = CHAPTERS.map((c, i) => sv("rect", { x: 960 - (CHAPTERS.length - 1) * 14 + i * 28 - 3.5, y: 1046 - 3.5, width: 7, height: 7, transform: "", fill: "none", "stroke-width": 1.2 }, svg));
  dots.forEach((d) => { const x = +d.getAttribute("x") + 3.5, y = 1046; d.setAttribute("transform", `rotate(45 ${x} ${y})`); });
  const hud = HUD;
  renders.push((t) => {
    const o = E.out(seg(t, 1.2, 3.2)) * (1 - 0.65 * hud.dim);
    op(H, o);
    const k = chapterAt(t);
    tr.innerHTML = `<span style="color:${COL.muted}">${String(k + 1).padStart(2, "0")} / ${String(CHAPTERS.length).padStart(2, "0")}</span>&nbsp;&nbsp;${CHAPTERS[k][0].toUpperCase()}`;
    const la = hud.geo.lat, lo = hud.geo.lon;
    const dm = (x) => { const a = Math.abs(x), d = Math.floor(a), m = Math.floor((a - d) * 60); return `${d}°${String(m).padStart(2, "0")}′`; };
    bl.textContent = `${la >= 0 ? "N" : "Z"} ${dm(la)}  ${lo >= 0 ? "O" : "W"} ${dm(lo)}${hud.tag ? "  ·  " + hud.tag : ""}`;
    const fr = Math.floor(t * 25);
    const hh = Math.floor(fr / 90000), mm = Math.floor(fr / 1500) % 60, ss = Math.floor(fr / 25) % 60, ff = fr % 25;
    brt.textContent = [hh, mm, ss, ff].map((x) => String(x).padStart(2, "0")).join(":");
    dots.forEach((d, i) => { d.setAttribute("stroke", i <= k ? COL.mint : COL.paper); d.setAttribute("fill", i < k ? COL.mint : i === k ? COL.mint : "none"); d.setAttribute("stroke-opacity", i <= k ? 0.9 : 0.35); d.setAttribute("fill-opacity", i === k ? 1 : 0.35); });
    br.forEach((b) => b.setAttribute("stroke-opacity", 0.5));
  });
}

/* ───────────── filmkorrel en vignet ───────────── */
function buildGrain() {
  const cv = el("canvas", { id: "grain", width: 480, height: 270 }, stage);
  const g = cv.getContext("2d");
  const frames = [];
  const rnd = mulberry32(99);
  for (let f = 0; f < 6; f++) {
    const img = g.createImageData(480, 270);
    for (let i = 0; i < img.data.length; i += 4) { const v = rnd() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
    frames.push(img);
  }
  cv.style.width = "1920px"; cv.style.height = "1080px";
  let last = -1;
  renders.push((t) => { const n = frames.length, f = ((Math.floor(t * 18) % n) + n) % n; if (f !== last) { g.putImageData(frames[f], 0, 0); last = f; } });
  el("div", { id: "vig" }, stage);
}
