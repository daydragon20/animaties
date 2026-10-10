// Maakt de gewichtsvariant van een ronde: ronde 1 = de basisgewichten; daarna per variabele ×0,8–1,2 (vast zaad),
// waarna elke tier weer exact zijn aandeel krijgt. Zo verschuift de nadruk binnen tiers, niet tussen tiers.
// Gebruik: node variant.mjs <ronde> [model.json] [uit.json]
import { writeFileSync } from "node:fs";
import { leesJson, gewichtenMet, r3 } from "./lib.mjs";

function mulberry32(a) { return function () { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export function maakVariant(model, ronde) {
  const rnd = mulberry32(2027 * 101 + ronde * 7919);
  const mult = {};
  for (const v of model.variabelen) mult[v.id] = ronde === 1 ? 1 : r3(0.8 + 0.4 * rnd());
  const gewichten = gewichtenMet(model, mult);
  const g = {}; for (const k of Object.keys(gewichten)) g[k] = r3(gewichten[k]);
  return { ronde, omschrijving: ronde === 1 ? "basisgewichten" : "per variabele ×0,8–1,2 (zaad " + ronde + "), tier-aandelen ongewijzigd", vermenigvuldigers: mult, gewichten: g };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const ronde = Number(process.argv[2] || 1);
  const model = leesJson(process.argv[3] || new URL("./model/model.json", import.meta.url).pathname);
  const v = maakVariant(model, ronde);
  const uit = process.argv[4] || new URL(`./rondes/r${String(ronde).padStart(2, "0")}/variant.json`, import.meta.url).pathname;
  writeFileSync(uit, JSON.stringify(v, null, 1));
  console.log(`variant ronde ${ronde} → ${uit}`);
}
