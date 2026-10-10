// Controleert een pakketbestand van een onderzoeksronde: alle 42 landen, alle variabelen van het pakket,
// getallen (of null met opmerking), bronnen, zekerheid, rubriekniveaus.
// Gebruik: node valideer-pakket.mjs <pad naar pakket-pXX.json>
import { leesJson } from "./lib.mjs";

const pad = process.argv[2];
if (!pad) { console.error("Gebruik: node valideer-pakket.mjs <pakket.json>"); process.exit(1); }
const model = leesJson(new URL("./model/model.json", import.meta.url).pathname);
let p;
try { p = leesJson(pad); } catch (e) { console.error("Geen geldige JSON: " + e.message); process.exit(1); }
const fouten = [], waarschuwingen = [];
const pak = (model.pakketten || []).find((x) => x.id === p.pakket);
if (!pak) fouten.push(`onbekend pakket "${p.pakket}"`);
if (!p.ronde) fouten.push("ronde ontbreekt");
const vars = pak ? pak.variabelen : [];
const varById = Object.fromEntries(model.variabelen.map((v) => [v.id, v]));
const landen = p.landen || {};
const telling = {};
for (const v of vars) telling[v] = { ok: 0, nul: 0, laag: 0 };
for (const land of model.landen) {
  const cel = landen[land.naam];
  if (!cel) { fouten.push(`land ontbreekt: ${land.naam}`); continue; }
  for (const vid of vars) {
    const f = cel[vid];
    if (!f) { fouten.push(`${land.naam}: variabele ${vid} ontbreekt`); continue; }
    const v = varById[vid];
    if (f.waarde == null) { telling[vid].nul++; if (!f.opmerking) waarschuwingen.push(`${land.naam}/${vid}: waarde null zonder opmerking`); continue; }
    if (typeof f.waarde !== "number" || !Number.isFinite(f.waarde)) { fouten.push(`${land.naam}/${vid}: waarde is geen getal (${JSON.stringify(f.waarde)})`); continue; }
    const s = v.meter && v.meter.schaal;
    if (s && s.type === "rubriek") {
      const lv = s.niveaus.map((n) => Number(n.score));
      if (!lv.includes(Number(f.waarde))) fouten.push(`${land.naam}/${vid}: ${f.waarde} is geen rubriekniveau (${lv.join("/")})`);
    }
    if (s && s.type === "ankers") {
      const xs = s.punten.map((q) => Number(q[0])), lo = Math.min(...xs), hi = Math.max(...xs), span = hi - lo;
      if (f.waarde < lo - span * 1.5 || f.waarde > hi + span * 1.5) waarschuwingen.push(`${land.naam}/${vid}: ${f.waarde} ligt ver buiten de ankers ${lo}–${hi}; eenheid juist?`);
    }
    if (!f.bron || !(f.bron.naam || f.bron.url)) fouten.push(`${land.naam}/${vid}: geen bron`);
    if (!["hoog", "midden", "laag"].includes(f.zekerheid)) fouten.push(`${land.naam}/${vid}: zekerheid moet hoog/midden/laag zijn`);
    telling[vid].ok++; if (f.zekerheid === "laag") telling[vid].laag++;
  }
  for (const k of Object.keys(cel)) if (!vars.includes(k)) waarschuwingen.push(`${land.naam}: ${k} hoort niet bij dit pakket (genegeerd)`);
}
for (const n of Object.keys(landen)) if (!model.landen.some((l) => l.naam === n)) fouten.push(`onbekende landnaam "${n}" (gebruik exact de Nederlandse namen uit het model)`);
console.log(`pakket ${p.pakket} · ronde ${p.ronde} · ${vars.length} variabelen`);
for (const v of vars) console.log(`  ${v.padEnd(26)} ${String(telling[v].ok).padStart(2)} waarden · ${telling[v].nul} ontbrekend · ${telling[v].laag} laag`);
if (waarschuwingen.length) { console.log(`\n${waarschuwingen.length} waarschuwingen:`); waarschuwingen.slice(0, 25).forEach((w) => console.log("  ! " + w)); }
if (fouten.length) { console.error(`\n${fouten.length} FOUTEN:`); fouten.slice(0, 40).forEach((f) => console.error("  - " + f)); process.exit(1); }
console.log("\nPakket in orde.");
