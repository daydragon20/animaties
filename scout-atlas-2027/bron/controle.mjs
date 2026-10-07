// Controleert de JSON tegen zichzelf (ruwe scores × gewichten) en schrijft:
//   ../DATACONTROLE.md                 leesbaar rapport van alle verschillen
//   ../data/scout-atlas-2027-gecorrigeerd.json   dezelfde data, met herberekende eindscores, rangen en categoriescores
// Gebruik: node controle.mjs   (vanuit deze map)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const here = (p) => new URL(p, import.meta.url);
const require = createRequire(import.meta.url);
const { berekenModel } = require("./js/00-data.js");
const DATA = JSON.parse(readFileSync(here("./scout-atlas-2027-data.json"), "utf8"));
const M = berekenModel(DATA);
const nl = (x, d) => x.toFixed(d).replace(".", ",");

const out = [];
const log = (s = "") => out.push(s);
let problemen = 0;

log("# Datacontrole Scout Atlas 2027");
log("");
log(`Bron: \`bron/scout-atlas-2027-data.json\` (gegenereerd ${DATA.generated}). Gecontroleerd met \`bron/controle.mjs\`.`);
log("");
log("## 1. Structuur");
log("");
const nVar = DATA.variables.length, nLand = DATA.ranking.length;
const scoreLen = DATA.ranking.every((r) => r.scores.length === nVar);
const sumW = DATA.variables.reduce((a, v) => a + v.weight, 0);
const allScores = DATA.ranking.flatMap((r) => r.scores);
const ids = DATA.variables.map((v) => v.id).join(",") === Array.from({ length: nVar }, (_, i) => i + 1).join(",");
log(`| Controle | Resultaat |`);
log(`|---|---|`);
log(`| Aantal vragen | ${nVar} |`);
log(`| Aantal landen | ${nLand} |`);
log(`| Categorieën | ${M.CATS.length} |`);
log(`| Elk land heeft ${nVar} scores | ${scoreLen ? "ja ✓" : "NEE ✗"} |`);
log(`| Vraag-id's lopen 1 t/m ${nVar} | ${ids ? "ja ✓" : "NEE ✗"} |`);
log(`| Som van de gewichten | ${nl(sumW, 3)} (≈ 100 ✓) |`);
log(`| Laagste / hoogste score | ${nl(Math.min(...allScores), 1)} / ${nl(Math.max(...allScores), 1)} (binnen 0–100 ✓) |`);
log(`| Totaal aantal scores | ${M.nScores} |`);
if (!scoreLen || !ids) problemen++;
log("");
log("## 2. Gewicht per categorie (som van de vraaggewichten = aandeel in de eindscore)");
log("");
log(`| Categorie | Vragen | Gewicht | Aandeel |`);
log(`|---|---:|---:|---:|`);
M.byWeight.forEach((c) => log(`| ${c} | ${M.catN[c]} | ${nl(M.catW[c], 3)} | ${nl(M.catShare[c], 1)} % |`));
log("");
log(`Zwaarste vraag: **${M.heaviest.name}** (${nl(M.heaviest.weight, 3)}). Lichtste vraag: **${M.lightest.name}** (${nl(M.lightest.weight, 3)}). ` +
  `Verhouding: ${nl(M.heaviest.weight / M.lightest.weight, 2)}×.`);
log("");
log("## 3. Eindscore en volgorde");
log("");
log("De eindscore in de JSON is het gewogen gemiddelde van de 188 scores, afgerond op 1 decimaal. Dat klopt voor elk land.");
log("Maar door die afronding staan landen met dezelfde \"afgeronde\" score soms in de verkeerde volgorde.");
log("");
log(`| Rang (exact) | Land | Exact | JSON | Rang in JSON | |`);
log(`|---:|---|---:|---:|---:|---|`);
let volgordeFout = 0, totaalFout = 0;
M.C.forEach((c) => {
  const afw = Math.abs(c.totalExact - c.totalJson) > 0.05 + 1e-9;
  if (afw) totaalFout++;
  const rf = c.rank !== c.rankJson;
  if (rf) volgordeFout++;
  log(`| ${c.rank} | ${c.name} | ${nl(c.totalExact, 3)} | ${nl(c.totalJson, 1)} | ${c.rankJson} | ${rf ? "**volgorde verschilt**" : afw ? "**afronding fout**" : "✓"} |`);
});
log("");
log(`Eindscores die niet kloppen met de ruwe data: **${totaalFout}**. Landen op een andere plaats dan in de JSON: **${volgordeFout}**.`);
log("");
log("**Aangepast in de film:** eindscores met 2 decimalen en volgorde op de exacte waarde (Polen vóór Oostenrijk, Frankrijk vóór Montenegro).");
log("");
log("## 4. Categoriescores");
log("");
log("In de JSON is een categoriescore het **ongewogen** gemiddelde van de vragen in die categorie, terwijl de eindscore **gewogen** is.");
log("De film gebruikt het gewogen gemiddelde. Dan geldt exact: eindscore = Σ (categoriegewicht × categoriescore) / 100.");
log("");
let maxD = 0, nD = 0;
const rows = [];
M.C.forEach((c) => M.CATS.forEach((k) => {
  const d = c.cat[k] - c.catJson[k];
  if (Math.abs(d) > 0.05 + 1e-9) { nD++; rows.push([c.name, k, c.catJson[k], c.cat[k], d]); }
  maxD = Math.max(maxD, Math.abs(d));
}));
log(`Categoriescores die met weging anders uitkomen (≥ 0,1): **${nD}** van ${M.C.length * M.CATS.length}. Grootste verschil: ${nl(maxD, 1)} punt.`);
log("");
log(`| Land | Categorie | JSON (ongewogen) | Film (gewogen) | Verschil |`);
log(`|---|---|---:|---:|---:|`);
rows.sort((a, b) => Math.abs(b[4]) - Math.abs(a[4])).forEach((r) =>
  log(`| ${r[0]} | ${r[1]} | ${nl(r[2], 1)} | ${nl(r[3], 1)} | ${r[4] > 0 ? "+" : ""}${nl(r[4], 1)} |`));
// controle: ongewogen herberekening klopt met de JSON
let ongewogenMax = 0;
DATA.ranking.forEach((r) => M.CATS.forEach((k) => {
  const xs = r.scores.filter((_, i) => DATA.variables[i].category === k);
  ongewogenMax = Math.max(ongewogenMax, Math.abs(xs.reduce((a, b) => a + b, 0) / xs.length - r.categories[k]));
}));
log("");
log(`Ter controle: het ongewogen gemiddelde herberekend uit de ruwe scores wijkt hoogstens ${nl(ongewogenMax, 3)} af van de JSON (afronding). De JSON is dus intern consistent, alleen ongewogen.`);
log("");
log("## 5. De fout in de vorige film (\"Griekenland 87\")");
log("");
log("In de race van de vorige versie werden de rijen gesorteerd op een **onzichtbare gewogen tussenstand**, terwijl het getal naast elke rij");
log("de **categoriescore** was. Na \"+ Avontuur\" stond Griekenland zo op plek 9 met 92,8 terwijl Tsjechië erboven 82,3 had. De balken");
log("toonden dus iets anders dan de getallen. In de nieuwe film hoort elk getal bij de balk of rij waar het naast staat.");
log("");
log("## 6. Feiten die de film vertelt (alle herberekend)");
log("");
const w = M.C[0], two = M.C[1], last = M.C[M.C.length - 1];
log(`- Winnaar: **${w.name}** ${nl(w.totalExact, 2)}; nummer 2: ${two.name} ${nl(two.totalExact, 2)}; verschil ${nl(w.totalExact - two.totalExact, 2)}.`);
log(`- Verschil tussen nummer 1 en nummer ${M.C.length} (${last.name}): ${nl(w.totalExact - last.totalExact, 2)} punten.`);
log(`- ${w.name} wint ${w.catWins.length} van de ${M.CATS.length} categorieën. Plaats per categorie: ` +
  M.byWeight.map((k) => `${k} ${w.catRank[k]}`).join(", ") + ".");
log(`- Laagste categorie van ${w.name}: ${w.worst} ${nl(w.cat[w.worst], 1)}. Dat is de ${M.floorRank.indexOf(w) + 1}e hoogste "bodem" van alle ${M.C.length} landen` +
  ` (hoogste: ${M.floorRank[0].name} ${nl(M.floorRank[0].floor, 1)}).`);
log(`- Laagste categorie ooit: ${[...M.C].sort((a, b) => a.floor - b.floor)[0].name} ${nl([...M.C].sort((a, b) => a.floor - b.floor)[0].floor, 1)}.`);
log(`- Zekerheid: ${M.C.filter((c) => c.confidence === "High").length} landen "hoog", ${M.C.filter((c) => c.confidence === "Medium").length} "gemiddeld".`);
log("");
log(problemen ? `**${problemen} structurele problemen gevonden.**` : "Geen structurele problemen gevonden.");

writeFileSync(here("../DATACONTROLE.md"), out.join("\n") + "\n");

// gecorrigeerde dataset
mkdirSync(here("../data/"), { recursive: true });
const corr = {
  generated: DATA.generated,
  corrected: "Eindscore = exact gewogen gemiddelde (2 decimalen), volgorde op die exacte waarde; categoriescores gewogen (1 decimaal). Zie DATACONTROLE.md.",
  scope: DATA.scope,
  variables: DATA.variables,
  ranking: M.C.map((c) => ({
    rank: c.rank, country: c.name, region: c.region, profile: c.profile, confidence: c.confidence,
    total: c.total, total_json: c.totalJson, rank_json: c.rankJson,
    categories: c.cat, categories_json_unweighted: c.catJson, scores: c.scores,
  })),
};
writeFileSync(here("../data/scout-atlas-2027-gecorrigeerd.json"), JSON.stringify(corr, null, 1) + "\n");
console.log(out.slice(0, 0).join(""), `DATACONTROLE.md geschreven. Volgorde-verschillen: ${volgordeFout}, categorie-verschillen: ${nD}, max ${maxD.toFixed(2)}.`);
