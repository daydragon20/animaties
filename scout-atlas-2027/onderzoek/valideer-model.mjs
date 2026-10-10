// Controleert model/model.json: structuur, gewichten per tier en categorie, pakketten.
// Gebruik: node valideer-model.mjs [pad naar model.json]
import { laadModel } from "./lib.mjs";

const pad = process.argv[2] || new URL("./model/model.json", import.meta.url).pathname;
const { model, fouten, perCat, perTier } = laadModel(pad);
console.log(`${model.variabelen.length} variabelen, ${model.categorieen.length} categorieën, ${model.tiers.length} tiers, ${(model.pakketten || []).length} pakketten, ${model.landen.length} landen`);
for (const t of model.tiers) console.log(`  tier ${t.tier} ${t.naam.padEnd(24)} ${String(perTier[t.tier] ? perTier[t.tier].toFixed(2) : 0).padStart(7)} (doel ${t.aandeel})`);
for (const c of model.categorieen) console.log(`    ${String(c.tier)} ${c.naam.padEnd(28)} ${String((perCat[c.id] || 0).toFixed(2)).padStart(7)} (opgegeven ${c.gewicht}) · ${model.variabelen.filter((v) => v.categorie === c.id).length} variabelen`);
const types = {}; for (const v of model.variabelen) types[v.meter?.type] = (types[v.meter?.type] || 0) + 1;
console.log("metertypes:", JSON.stringify(types));
for (const p of model.pakketten || []) console.log(`  pakket ${p.id} ${p.naam}: ${p.variabelen.length} variabelen, ±${p.geschatte_opzoekingen} opzoekingen`);
if (fouten.length) { console.error("\nFOUTEN:"); fouten.forEach((f) => console.error(" - " + f)); process.exit(1); }
console.log("\nModel in orde.");
