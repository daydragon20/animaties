// Gedeelde rekenregels voor het onderzoek: schalen, gewichten, scores.
// Wordt gebruikt door scoor.mjs (één ronde), consensus.mjs (alle rondes) en valideer-model.mjs.
import { readFileSync } from "node:fs";

export const clamp = (x, a = 0, b = 100) => Math.min(b, Math.max(a, x));
export const r1 = (x) => Math.round((x + 1e-9) * 10) / 10;
export const r2 = (x) => Math.round((x + 1e-9) * 100) / 100;
export const r3 = (x) => Math.round((x + 1e-9) * 1000) / 1000;

export function leesJson(p) { return JSON.parse(readFileSync(p, "utf8")); }

/** Ruwe waarde → score 0–100 volgens de schaal van de meter. */
export function schaal(meter, raw) {
  const s = meter.schaal;
  if (raw == null || Number.isNaN(Number(raw))) return null;
  const x = Number(raw);
  if (!s || s.type === "direct") return clamp(x);
  if (s.type === "omgekeerd") return clamp(100 - x);
  if (s.type === "rubriek") {
    // de waarde is de score van het gekozen niveau; dichtstbijzijnde niveau telt
    const lv = s.niveaus.map((n) => Number(n.score));
    let best = lv[0];
    for (const v of lv) if (Math.abs(v - x) < Math.abs(best - x)) best = v;
    return clamp(best);
  }
  if (s.type === "ankers") {
    const pts = [...s.punten].map(([a, b]) => [Number(a), Number(b)]).sort((p, q) => p[0] - q[0]);
    if (x <= pts[0][0]) return clamp(pts[0][1]);
    if (x >= pts[pts.length - 1][0]) return clamp(pts[pts.length - 1][1]);
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      if (x <= x1) return clamp(y0 + ((x - x0) / (x1 - x0)) * (y1 - y0));
    }
  }
  if (s.type === "log") {
    const a = Number(s.van), b = Number(s.tot);
    const lx = Math.log10(Math.max(x, 1e-9)), la = Math.log10(Math.max(a, 1e-9)), lb = Math.log10(Math.max(b, 1e-9));
    const sc = ((lx - la) / (lb - la)) * 100;
    return clamp(Number.isFinite(sc) ? sc : 0);
  }
  throw new Error("Onbekende schaal: " + JSON.stringify(s));
}

/** Controleert de structuur van model.json en geeft handige indexen terug. */
export function laadModel(p) {
  const m = leesJson(p);
  const fouten = [];
  const catById = Object.fromEntries(m.categorieen.map((c) => [c.id, c]));
  const varById = {};
  let tot = 0;
  const perCat = {}, perTier = {};
  for (const v of m.variabelen) {
    if (varById[v.id]) fouten.push(`dubbele variabele ${v.id}`);
    varById[v.id] = v;
    if (!catById[v.categorie]) fouten.push(`${v.id}: onbekende categorie ${v.categorie}`);
    if (!(v.gewicht >= 1.2 && v.gewicht <= 8)) fouten.push(`${v.id}: gewicht ${v.gewicht} buiten 1,2–8`);
    if (!v.meter || !v.meter.schaal) fouten.push(`${v.id}: geen meter of schaal`);
    tot += v.gewicht;
    perCat[v.categorie] = (perCat[v.categorie] || 0) + v.gewicht;
    const tier = catById[v.categorie] && catById[v.categorie].tier;
    perTier[tier] = (perTier[tier] || 0) + v.gewicht;
  }
  if (Math.abs(tot - 100) > 0.01) fouten.push(`som gewichten = ${tot.toFixed(3)}, verwacht 100`);
  for (const c of m.categorieen) if (Math.abs((perCat[c.id] || 0) - c.gewicht) > 0.01) fouten.push(`categorie ${c.id}: ${(perCat[c.id] || 0).toFixed(2)} ≠ ${c.gewicht}`);
  for (const t of m.tiers) if (Math.abs((perTier[t.tier] || 0) - t.aandeel) > 1) fouten.push(`tier ${t.tier}: ${(perTier[t.tier] || 0).toFixed(2)} ≠ ${t.aandeel}`);
  const inPakket = new Set();
  for (const p of m.pakketten || []) for (const id of p.variabelen) { if (!varById[id]) fouten.push(`pakket ${p.id}: onbekende variabele ${id}`); if (inPakket.has(id)) fouten.push(`variabele ${id} zit in twee pakketten`); inPakket.add(id); }
  for (const v of m.variabelen) if (!inPakket.has(v.id)) fouten.push(`variabele ${v.id} zit in geen pakket`);
  if (!m.landen || m.landen.length !== 42) fouten.push(`${m.landen ? m.landen.length : 0} landen, verwacht 42`);
  return { model: m, fouten, catById, varById, perCat, perTier };
}

/** Gewichtsvariant: per variabele een vermenigvuldiger; binnen elke tier wordt het tier-aandeel bewaard. */
export function gewichtenMet(model, mult) {
  const catById = Object.fromEntries(model.categorieen.map((c) => [c.id, c]));
  const w = {};
  const perTier = {}, perTierBasis = {};
  for (const v of model.variabelen) {
    const t = catById[v.categorie].tier;
    const m = mult && mult[v.id] != null ? mult[v.id] : 1;
    w[v.id] = v.gewicht * m;
    perTier[t] = (perTier[t] || 0) + w[v.id];
    perTierBasis[t] = (perTierBasis[t] || 0) + v.gewicht;
  }
  for (const v of model.variabelen) { const t = catById[v.categorie].tier; w[v.id] = (w[v.id] * perTierBasis[t]) / perTier[t]; }
  return w;
}

/**
 * Scoort alle landen. feiten: { land: { varId: { waarde, ... } } }.
 * Geeft per land scores per variabele, per categorie, per tier en de eindscore (op basis van de meegegeven gewichten).
 */
export function scoor(model, feiten, w) {
  const catById = Object.fromEntries(model.categorieen.map((c) => [c.id, c]));
  const uit = [];
  for (const land of model.landen) {
    const f = feiten[land.naam] || {};
    const scores = {}, ontbreekt = [];
    for (const v of model.variabelen) {
      const cel = f[v.id];
      const s = cel ? schaal(v.meter, cel.waarde) : null;
      if (s == null) ontbreekt.push(v.id);
      scores[v.id] = s == null ? null : r1(s);
    }
    const cat = {}, tier = {};
    let sw = 0, ss = 0;
    for (const c of model.categorieen) { cat[c.id] = { sw: 0, ss: 0 }; }
    for (const v of model.variabelen) {
      const s = scores[v.id];
      if (s == null) continue;
      const wi = w[v.id];
      cat[v.categorie].sw += wi; cat[v.categorie].ss += wi * s;
      const t = catById[v.categorie].tier;
      tier[t] = tier[t] || { sw: 0, ss: 0 };
      tier[t].sw += wi; tier[t].ss += wi * s;
      sw += wi; ss += wi * s;
    }
    const categories = {}; for (const c of model.categorieen) categories[c.id] = cat[c.id].sw ? r1(cat[c.id].ss / cat[c.id].sw) : null;
    const tiers = {}; for (const t of model.tiers) tiers[t.tier] = tier[t.tier] && tier[t.tier].sw ? r1(tier[t.tier].ss / tier[t.tier].sw) : null;
    const exact = sw ? ss / sw : null;
    uit.push({ naam: land.naam, iso2: land.iso2, regio: land.regio, knockout: land.knockout || null, status: land.knockout ? "knockout" : "ok",
      scores, categories, tiers, exact: exact == null ? null : r3(exact), total: exact == null ? null : r1(exact), ontbreekt, dekking: r3(sw / 100) });
  }
  // ranglijst: knock-outs onderaan, dan op exacte score
  uit.sort((a, b) => (a.status === "ok" ? 0 : 1) - (b.status === "ok" ? 0 : 1) || (b.exact ?? -1) - (a.exact ?? -1) || a.naam.localeCompare(b.naam, "nl"));
  uit.forEach((c, i) => (c.rank = i + 1));
  return uit;
}
