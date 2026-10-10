// Berekent scout-atlas-2027-data.json uit feiten.mjs en variabelen.mjs.
// Gebruik: node bereken.mjs   (vanuit deze map)
//
// Stap 1  elk feit gaat naar een 0–100-score via zijn schaal (absolute ankers, dus onafhankelijk van wie meedoet)
// Stap 2  elke vraag = gewogen mix van feitscores (1 decimaal)
// Stap 3  categoriescore = gewogen gemiddelde van de vragen; eindscore = som van gewicht × score / 100
import { writeFileSync } from "node:fs";
import { INDICATOREN, KOLOMMEN, LANDEN, BUITEN } from "./feiten.mjs";
import { CATEGORIEEN, VRAGEN } from "./variabelen.mjs";

const clamp = (x, a = 0, b = 100) => Math.min(b, Math.max(a, x));
const r1 = (x) => Math.round(x * 10) / 10;
const r3 = (x) => Math.round(x * 1000) / 1000;

function schaal(ind, raw) {
  const s = ind.schaal;
  if (s === "direct") return clamp(raw);
  if (s === "omgekeerd") return clamp(100 - raw);
  const [type, a, b] = s;
  if (type === "ankers") {
    const pts = a;
    if (raw <= pts[0][0]) return pts[0][1];
    if (raw >= pts[pts.length - 1][0]) return pts[pts.length - 1][1];
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      if (raw <= x1) return y0 + ((raw - x0) / (x1 - x0)) * (y1 - y0);
    }
  }
  if (type === "log") { // a → 0, b → 100 op logschaal
    return clamp(((Math.log10(Math.max(raw, 1e-6)) - Math.log10(a)) / (Math.log10(b) - Math.log10(a))) * 100);
  }
  if (type === "log-omgekeerd") { // ≤ a → 100, ≥ b → 20 op logschaal
    if (raw <= a) return 100;
    return clamp(100 - ((Math.log10(raw) - Math.log10(a)) / (Math.log10(b) - Math.log10(a))) * 80, 20, 100);
  }
  throw new Error("Onbekende schaal voor " + ind.k);
}

// Feitscores per land (0–100), plus afgeleide feiten
const landen = LANDEN.map((row) => {
  const [naam, regio, profiel, status, ...vals] = row;
  if (vals.length !== KOLOMMEN.length) throw new Error(`${naam}: ${vals.length} waarden, verwacht ${KOLOMMEN.length}`);
  const raw = {}, f = {};
  KOLOMMEN.forEach((k, i) => { raw[k] = vals[i]; f[k] = schaal(INDICATOREN[i], vals[i]); });
  f.ver = 100 - f.afstand;
  f.rustig = f.toerisme;           // toerisme is al "omgekeerd" geschaald: hoog = rustig
  f.nieuw = f.vlaams;              // idem: hoog = weinig Vlaamse groepen
  f.bergzee = Math.sqrt(f.bergen * f.zee);
  f.laagland = 100 - f.bergen;
  return { naam, regio, profiel, status, raw, f };
});

// Vragen met gewicht
const catW = Object.fromEntries(CATEGORIEEN);
const variables = [];
let id = 1;
for (const [cat] of CATEGORIEEN) {
  const vs = VRAGEN[cat];
  if (!vs) throw new Error("Geen vragen voor " + cat);
  const units = vs.reduce((s, [, t]) => s + (t === "Z" ? 1 : 0.69), 0);
  const unit = catW[cat] / units;
  for (const [name, tier, mix] of vs) {
    const sum = Object.values(mix).reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 1) > 1e-6) throw new Error(`Mix van "${name}" telt op tot ${sum}`);
    variables.push({ id: id++, name, category: cat, weight: r3(unit * (tier === "Z" ? 1 : 0.69)), mix });
  }
}
// gewichten exact op 100 laten uitkomen (afrondingsrest op de zwaarste vraag)
const wsum = variables.reduce((s, v) => s + v.weight, 0);
const heaviest = variables.reduce((a, b) => (b.weight > a.weight ? b : a));
heaviest.weight = r3(heaviest.weight + (100 - wsum));

// Scores
const ranking = landen.map((l) => {
  const scores = variables.map((v) => {
    let s = 0;
    for (const [k, w] of Object.entries(v.mix)) {
      if (l.f[k] == null || Number.isNaN(l.f[k])) throw new Error(`Feit "${k}" ontbreekt voor ${l.naam}`);
      s += w * l.f[k];
    }
    return r1(s);
  });
  const categories = {};
  for (const [cat] of CATEGORIEEN) {
    let sw = 0, ss = 0;
    variables.forEach((v, i) => { if (v.category === cat) { sw += v.weight; ss += v.weight * scores[i]; } });
    categories[cat] = r1(ss / sw);
  }
  const exact = variables.reduce((s, v, i) => s + v.weight * scores[i], 0) / 100;
  const total = r1(exact);
  const feiten = {};
  KOLOMMEN.forEach((k) => { feiten[k] = { waarde: l.raw[k], score: r1(l.f[k]) }; });
  return { country: l.naam, region: l.regio, profile: l.profiel, status: l.status, scores, total, exact: Math.round(exact * 1000) / 1000, categories, feiten };
});
// landen met een negatief reisadvies doen niet mee: altijd onderaan, met hun score erbij voor de volledigheid
ranking.sort((a, b) => (a.status === "ok" ? 0 : 1) - (b.status === "ok" ? 0 : 1) || b.exact - a.exact || a.country.localeCompare(b.country));

const zekerheid = { hoog: 0, midden: 0, laag: 0 };
INDICATOREN.forEach((i) => zekerheid[i.zekerheid]++);

const out = {
  generated: new Date().toISOString().slice(0, 10),
  version: 2,
  scope: "Scouts verkenners 14-16, 10-15 leden, zomer 2027",
  method: "Elke vraag is een gewogen mix van feiten per land; feiten worden met vaste ankers naar 0–100 geschaald.",
  variables: variables.map(({ mix, ...v }) => ({ ...v, bron: mix })),
  indicators: INDICATOREN,
  zekerheid,
  buiten: BUITEN,
  ranking,
};
writeFileSync(new URL("./scout-atlas-2027-data.json", import.meta.url), JSON.stringify(out, null, 1));

// Controle-uitvoer
console.log(`${variables.length} vragen, ${CATEGORIEEN.length} categorieën, gewicht ${variables.reduce((s, v) => s + v.weight, 0).toFixed(3)}`);
console.log(`${ranking.length} landen, feiten: ${zekerheid.hoog} hoog · ${zekerheid.midden} midden · ${zekerheid.laag} laag`);
ranking.forEach((r, i) => {
  const cats = CATEGORIEEN.map(([c]) => String(r.categories[c]).padStart(5)).join(" ");
  console.log(`${String(i + 1).padStart(2)} ${r.country.padEnd(22)} ${String(r.total).padStart(5)} ${r.status === "ok" ? " " : "✗"} ${cats}`);
});
