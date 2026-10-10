// Controleert model/referenties-kamperen.json: elk land, elk van de drie kampeervariabelen, een geldig voorstel en minstens één bron.
// Gebruik: node valideer-referenties.mjs
import { leesJson } from "./lib.mjs";
const hier = new URL("./", import.meta.url).pathname;
const model = leesJson(hier + "model/model.json");
let ref;
try { ref = leesJson(hier + "model/referenties-kamperen.json"); } catch (e) { console.error("Ongeldige of ontbrekende JSON:", e.message); process.exit(1); }
const VARS = ["kamp_wild", "kamp_vuur", "kamp_groepsterrein"];
const niveaus = Object.fromEntries(VARS.map((id) => [id, model.variabelen.find((v) => v.id === id).meter.schaal.niveaus.map((n) => Number(n.score))]));
const fouten = [], waarschuwingen = [];
const landen = ref.landen || {};
for (const l of model.landen) {
  const cel = landen[l.naam];
  if (!cel) { fouten.push(`land ontbreekt: ${l.naam}`); continue; }
  for (const id of VARS) {
    const r = cel[id];
    if (!r) { fouten.push(`${l.naam}/${id} ontbreekt`); continue; }
    if (!niveaus[id].includes(Number(r.voorstel))) fouten.push(`${l.naam}/${id}: voorstel ${r.voorstel} is geen rubriekniveau (${niveaus[id].join("/")})`);
    const bronnen = r.bronnen || [];
    if (id === "kamp_groepsterrein") {
      const n = ["A", "B", "C", "D"].filter((k) => r[k] && r[k].vervuld === true).length;
      if (n * 25 !== Number(r.voorstel)) fouten.push(`${l.naam}/${id}: ${n} criteria vervuld maar voorstel ${r.voorstel}`);
      for (const k of ["A", "B", "C", "D"]) if (!r[k]) fouten.push(`${l.naam}/${id}: criterium ${k} ontbreekt`);
      if (r.B && r.B.vervuld && !(r.B.terreinen || []).length) fouten.push(`${l.naam}/${id}: B vervuld zonder terreinen`);
      const urls = ["A", "B", "C", "D"].filter((k) => r[k] && r[k].vervuld && !(r[k].url || (r[k].terreinen || []).some((t) => t.url)));
      if (urls.length) fouten.push(`${l.naam}/${id}: criterium ${urls.join(", ")} vervuld zonder URL`);
    } else {
      if (!bronnen.length) fouten.push(`${l.naam}/${id}: geen bron`);
      if (!bronnen.some((b) => b.url && b.bereikbaar === "ja")) waarschuwingen.push(`${l.naam}/${id}: geen bereikbare bron met URL`);
    }
  }
}
for (const n of Object.keys(landen)) if (!model.landen.some((l) => l.naam === n)) fouten.push(`onbekende landnaam "${n}"`);
fouten.forEach((f) => console.log("FOUT  " + f));
waarschuwingen.forEach((w) => console.log("let op " + w));
console.log(`${Object.keys(landen).length} landen · ${fouten.length} fouten · ${waarschuwingen.length} waarschuwingen`);
if (fouten.length) process.exit(1);
console.log("Referenties in orde.");
