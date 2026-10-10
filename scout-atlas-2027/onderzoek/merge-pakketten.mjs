// Voegt de pakketbestanden van een ronde samen tot feiten.json en meldt wat ontbreekt.
// Gebruik: node merge-pakketten.mjs <ronde>
import { readdirSync, writeFileSync, existsSync } from "node:fs";
import { leesJson } from "./lib.mjs";

const ronde = Number(process.argv[2]);
if (!ronde) { console.error("Gebruik: node merge-pakketten.mjs <ronde>"); process.exit(1); }
const map = new URL(`./rondes/r${String(ronde).padStart(2, "0")}/`, import.meta.url).pathname;
const model = leesJson(new URL("./model/model.json", import.meta.url).pathname);
const files = readdirSync(map).filter((f) => /^pakket-p\d+\.json$/.test(f)).sort();
const landen = {};
for (const l of model.landen) landen[l.naam] = {};
const gezien = new Set();
for (const f of files) {
  let p;
  try { p = leesJson(map + f); } catch (e) { console.error(`${f}: ongeldige JSON (${e.message})`); continue; }
  const pak = (model.pakketten || []).find((x) => x.id === p.pakket);
  if (!pak) { console.error(`${f}: onbekend pakket ${p.pakket}`); continue; }
  for (const l of model.landen) {
    const cel = (p.landen || {})[l.naam] || {};
    for (const vid of pak.variabelen) { if (cel[vid]) { landen[l.naam][vid] = cel[vid]; gezien.add(vid); } }
  }
}
const ontbrekendePakketten = (model.pakketten || []).filter((p) => !files.some((f) => f === `pakket-${p.id}.json`)).map((p) => p.id);
const ontbrekend = [];
for (const l of model.landen) for (const v of model.variabelen) { const c = landen[l.naam][v.id]; if (!c) ontbrekend.push(`${l.naam}/${v.id}`); else if (c.waarde == null) ontbrekend.push(`${l.naam}/${v.id} (null)`); }
const bestaand = existsSync(map + "feiten.json") ? leesJson(map + "feiten.json") : null;
writeFileSync(map + "feiten.json", JSON.stringify({ ronde, datum: new Date().toISOString().slice(0, 10), bron: "samengevoegd uit " + files.join(", "), landen }, null, 1));
console.log(`ronde ${ronde}: ${files.length} pakketten samengevoegd → feiten.json${bestaand ? " (vorige versie overschreven)" : ""}`);
if (ontbrekendePakketten.length) console.log(`  ontbrekende pakketten: ${ontbrekendePakketten.join(", ")}`);
console.log(`  ${ontbrekend.length} ontbrekende of lege cellen van ${model.landen.length * model.variabelen.length}`);
ontbrekend.slice(0, 60).forEach((x) => console.log("   - " + x));
if (ontbrekend.length > 60) console.log(`   … en ${ontbrekend.length - 60} meer`);
