// Onafhankelijke controle van de data achter de film: herberekent uit de scores en gewichten in de JSON
// alle getallen die de film en de verkenner tonen, en vergelijkt ze met wat consensus.mjs heeft geschreven.
// Gebruik: node controle.mjs   (vanuit deze map)
import { readFileSync } from "node:fs";
const DATA = JSON.parse(readFileSync(new URL("./scout-atlas-2027-data.json", import.meta.url), "utf8"));
const { berekenModel } = await import("./js/00-data.js").catch(() => ({ berekenModel: null }));

let fouten = 0;
const check = (ok, msg) => { if (!ok) { fouten++; console.log("  ✗ " + msg); } };
const r1 = (x) => Math.round((x + 1e-9) * 10) / 10, r3 = (x) => Math.round((x + 1e-9) * 1000) / 1000;

// 1. structuur
const V = DATA.variables, C = DATA.countries;
console.log(`${C.length} landen · ${V.length} variabelen · ${DATA.categories.length} categorieën · ${DATA.tiers.length} tiers · ${DATA.aantal_rondes} rondes`);
const wsum = V.reduce((s, v) => s + v.gewicht, 0);
check(Math.abs(wsum - 100) < 0.01, `som van de gewichten = ${wsum.toFixed(3)} (verwacht 100)`);
for (const c of DATA.categories) { const s = V.filter((v) => v.categorie === c.id).reduce((a, v) => a + v.gewicht, 0); check(Math.abs(s - c.gewicht) < 0.01, `categorie ${c.id}: ${s.toFixed(2)} ≠ ${c.gewicht}`); }
for (const t of DATA.tiers) { const s = V.filter((v) => DATA.categories.find((c) => c.id === v.categorie).tier === t.tier).reduce((a, v) => a + v.gewicht, 0); check(Math.abs(s - t.aandeel) <= 1, `tier ${t.tier}: ${s.toFixed(2)} ≠ ${t.aandeel}`); }

// 2. eindscores en rangen herberekend uit scores × gewichten
const eigen = C.map((c) => {
  let s = 0, sw = 0;
  for (const v of V) { const x = c.scores[v.id]; if (x == null) continue; s += v.gewicht * x; sw += v.gewicht; }
  const exact = sw ? s / sw : 0;
  const cats = {};
  for (const k of DATA.categories) { let a = 0, b = 0; for (const v of V) if (v.categorie === k.id && c.scores[v.id] != null) { a += v.gewicht * c.scores[v.id]; b += v.gewicht; } cats[k.id] = b ? r1(a / b) : null; }
  return { naam: c.naam, ok: c.status === "ok", exact, total: r1(exact), cats, json: c };
});
eigen.sort((a, b) => (a.ok ? 0 : 1) - (b.ok ? 0 : 1) || b.exact - a.exact || a.naam.localeCompare(b.naam, "nl"));
eigen.forEach((e, i) => {
  check(Math.abs(e.exact - e.json.exact) < 0.0015, `${e.naam}: eindscore ${r3(e.exact)} ≠ JSON ${e.json.exact}`);
  check(e.total === e.json.total, `${e.naam}: afgeronde eindscore ${e.total} ≠ JSON ${e.json.total}`);
  check(i + 1 === e.json.rank, `${e.naam}: rang ${i + 1} ≠ JSON ${e.json.rank}`);
  for (const k of DATA.categories) check(e.cats[k.id] === e.json.categories[k.id], `${e.naam}/${k.id}: categoriescore ${e.cats[k.id]} ≠ JSON ${e.json.categories[k.id]}`);
});

// 3. scores per cel herberekend uit de ruwe feiten en de schaal van de meter
const clamp = (x, a = 0, b = 100) => Math.min(b, Math.max(a, x));
function schaal(s, raw) {
  const x = Number(raw);
  if (!s || s.type === "direct") return clamp(x);
  if (s.type === "rubriek") { let best = Number(s.niveaus[0].score); for (const n of s.niveaus) if (Math.abs(Number(n.score) - x) < Math.abs(best - x)) best = Number(n.score); return clamp(best); }
  if (s.type === "ankers") { const pts = [...s.punten].map(([a, b]) => [Number(a), Number(b)]).sort((p, q) => p[0] - q[0]); if (x <= pts[0][0]) return clamp(pts[0][1]); if (x >= pts[pts.length - 1][0]) return clamp(pts[pts.length - 1][1]); for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; if (x <= x1) return clamp(y0 + ((x - x0) / (x1 - x0)) * (y1 - y0)); } }
  if (s.type === "log") { const a = Math.log10(Math.max(Number(s.van), 1e-9)), b = Math.log10(Math.max(Number(s.tot), 1e-9)); return clamp(((Math.log10(Math.max(x, 1e-9)) - a) / (b - a)) * 100); }
  return NaN;
}
let cellen = 0, leeg = 0;
for (const c of C) for (const v of V) {
  const f = c.feiten && c.feiten[v.id];
  if (!f || f.waarde == null) { leeg++; check(c.scores[v.id] == null, `${c.naam}/${v.id}: score ${c.scores[v.id]} zonder ruwe waarde`); continue; }
  cellen++;
  const s = r1(schaal(v.meter.schaal, f.waarde));
  check(Math.abs(s - c.scores[v.id]) < 0.051, `${c.naam}/${v.id}: score uit feit ${f.waarde} = ${s}, JSON ${c.scores[v.id]}`);
}
console.log(`${cellen} cellen herberekend uit de ruwe waarde, ${leeg} zonder waarde`);

// 4. het rekenmodel van de film geeft dezelfde uitkomst
if (berekenModel) {
  const M = berekenModel(DATA);
  M.C.forEach((c) => { const j = C.find((x) => x.naam === c.name); check(Math.abs(c.totalExact - j.exact) < 0.0015, `film: ${c.name} eindscore ${r3(c.totalExact)} ≠ ${j.exact}`); check(c.rank === j.rank, `film: ${c.name} rang ${c.rank} ≠ ${j.rank}`); });
  console.log(`rekenmodel van de film: ${M.C.length} landen, winnaar ${M.ELIG[0].name} ${M.r2(M.ELIG[0].totalExact)}`);
}

// 5. rondes: rangen per ronde consistent met rondeOverzicht
const RO = DATA.rondeOverzicht || [];
for (const r of RO) { const w = C.find((c) => c.naam === r.winnaar); check(w && w.rondes.ranks[r.ronde - 1] === 1, `ronde ${r.ronde}: winnaar ${r.winnaar} staat niet op 1 in zijn rangenlijst`); }
const wins = {}; C.forEach((c) => (wins[c.naam] = c.rondes.wins));
RO.forEach((r) => (wins[r.winnaar]--));
check(Object.values(wins).every((x) => x === 0), "aantal gewonnen rondes per land klopt niet met rondeOverzicht");
check(DATA.consensus.winnaar === eigen[0].naam, `consensuswinnaar ${DATA.consensus.winnaar} ≠ herberekend ${eigen[0].naam}`);

console.log(fouten ? `\n${fouten} FOUTEN` : "\nAlles klopt: eindscores, rangen, categoriescores, celscores, rondes.");
process.exit(fouten ? 1 : 0);
