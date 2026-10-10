// Scoort één ronde: model + feiten van die ronde + gewichtsvariant → scores.json en een ranglijst op het scherm.
// Gebruik: node scoor.mjs <ronde>     (leest rondes/rNN/feiten.json en variant.json, schrijft rondes/rNN/scores.json)
import { writeFileSync, existsSync } from "node:fs";
import { leesJson, scoor } from "./lib.mjs";
import { maakVariant } from "./variant.mjs";

const ronde = Number(process.argv[2]);
if (!ronde) { console.error("Gebruik: node scoor.mjs <ronde>"); process.exit(1); }
const map = new URL(`./rondes/r${String(ronde).padStart(2, "0")}/`, import.meta.url).pathname;
const model = leesJson(new URL("./model/model.json", import.meta.url).pathname);
const feitenBestand = leesJson(map + "feiten.json");
const feiten = feitenBestand.landen || feitenBestand;
const variant = existsSync(map + "variant.json") ? leesJson(map + "variant.json") : maakVariant(model, ronde);
if (!existsSync(map + "variant.json")) writeFileSync(map + "variant.json", JSON.stringify(variant, null, 1));

const ranglijst = scoor(model, feiten, variant.gewichten);
const ontbreekt = ranglijst.reduce((s, c) => s + c.ontbreekt.length, 0);
const uit = { ronde, datum: new Date().toISOString().slice(0, 10), model_versie: model.versie, variant: variant.omschrijving, gewichten: variant.gewichten,
  aantal_ontbrekend: ontbreekt, winnaar: ranglijst[0].naam, ranglijst };
writeFileSync(map + "scores.json", JSON.stringify(uit, null, 1));

console.log(`Ronde ${ronde} · ${variant.omschrijving} · ${ontbreekt} ontbrekende waarden`);
const cats = model.categorieen;
console.log("   " + "land".padEnd(22) + " score  " + cats.map((c) => (c.kort || c.naam).slice(0, 6).padStart(7)).join(""));
for (const c of ranglijst) {
  console.log(`${String(c.rank).padStart(2)} ${c.naam.padEnd(22)} ${String(c.total ?? "—").padStart(5)} ${c.status === "ok" ? " " : "✗"} ` + cats.map((k) => String(c.categories[k.id] ?? "—").padStart(7)).join("") + (c.ontbreekt.length ? `   ontbreekt: ${c.ontbreekt.join(", ")}` : ""));
}
