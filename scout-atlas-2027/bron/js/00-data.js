/* ═════════════ DATA ═════════════
   Eén rekenmodel voor de film, de verkenner én het controlescript (controle.mjs).
   Enige bron: scout-atlas-2027-data.json (uit onderzoek/consensus.mjs):
   - variables: id, naam, vraag, categorie, gewicht, meter, zekerheid
   - categories: id, naam, kort, tier, gewicht · tiers: tier, naam, aandeel
   - countries: scores per variabele (0–100), feiten (ruwe waarde, bron, rondes), rondes (rangen per ronde)
   Eindscore = Σ gewicht × score / Σ gewicht. Landen met een knock-out (reisadvies) staan altijd onderaan.
   mult (optioneel): vermenigvuldiger per categorie-id of per tier ("t1", "t2", "t3") voor "speel met de gewichten". */
function berekenModel(DATA, mult) {
  const V = DATA.variables.map((v, i) => ({ ...v, i }));
  const CATS = DATA.categories.map((c) => c.id);
  const CATN = Object.fromEntries(DATA.categories.map((c) => [c.id, c.naam]));
  const CATK = Object.fromEntries(DATA.categories.map((c) => [c.id, c.kort || c.naam]));
  const CATT = Object.fromEntries(DATA.categories.map((c) => [c.id, c.tier]));
  const TIERS = DATA.tiers.map((t) => t.tier);
  V.forEach((v) => { v.ci = CATS.indexOf(v.categorie); v.tier = CATT[v.categorie]; });
  const m = (v) => (mult ? (mult[v.categorie] != null ? mult[v.categorie] : 1) * (mult["t" + v.tier] != null ? mult["t" + v.tier] : 1) : 1);
  const w = V.map((v) => v.gewicht * m(v));
  const catW = {}, catW0 = {}, catN = {}, tierW = {}, tierW0 = {};
  CATS.forEach((c) => { catW[c] = 0; catW0[c] = 0; catN[c] = 0; });
  TIERS.forEach((t) => { tierW[t] = 0; tierW0[t] = 0; });
  V.forEach((v, i) => { catW[v.categorie] += w[i]; catW0[v.categorie] += v.gewicht; catN[v.categorie]++; tierW[v.tier] += w[i]; tierW0[v.tier] += v.gewicht; });
  const totW = w.reduce((a, b) => a + b, 0), totW0 = V.reduce((a, v) => a + v.gewicht, 0);
  const catShare = {}, tierShare = {};
  CATS.forEach((c) => (catShare[c] = (catW0[c] / totW0) * 100));
  TIERS.forEach((t) => (tierShare[t] = (tierW0[t] / totW0) * 100));
  const byWeight = [...CATS].sort((a, b) => catW0[b] - catW0[a] || CATS.indexOf(a) - CATS.indexOf(b));
  const r1 = (x) => Math.round((x + 1e-9) * 10) / 10, r2 = (x) => Math.round((x + 1e-9) * 100) / 100;

  const C = DATA.countries.map((r) => {
    const scores = V.map((v) => r.scores[v.id]);
    let s = 0, sw = 0;
    const catExact = {}, catSw = {}, tierExact = {}, tierSw = {};
    CATS.forEach((c) => { catExact[c] = 0; catSw[c] = 0; });
    TIERS.forEach((t) => { tierExact[t] = 0; tierSw[t] = 0; });
    scores.forEach((x, i) => {
      if (x == null) return;
      s += w[i] * x; sw += w[i];
      catExact[V[i].categorie] += w[i] * x; catSw[V[i].categorie] += w[i];
      tierExact[V[i].tier] += w[i] * x; tierSw[V[i].tier] += w[i];
    });
    CATS.forEach((c) => (catExact[c] = catSw[c] ? catExact[c] / catSw[c] : 0));
    TIERS.forEach((t) => (tierExact[t] = tierSw[t] ? tierExact[t] / tierSw[t] : 0));
    const cat = {}; CATS.forEach((c) => (cat[c] = r1(catExact[c])));
    const tier = {}; TIERS.forEach((t) => (tier[t] = r1(tierExact[t])));
    return {
      name: r.naam, iso2: r.iso2, region: r.regio, knockout: r.knockout, ok: r.status === "ok",
      scores, feiten: r.feiten || {}, rondes: r.rondes || { ranks: [], totals: [], wins: 0 },
      totalExact: sw ? s / sw : 0, total: r2(sw ? s / sw : 0), totalJson: r.total, exactJson: r.exact, rankJson: r.rank,
      catExact, cat, tierExact, tier, catJson: r.categories,
    };
  });
  const ranked = [...C].sort((a, b) => (a.ok ? 0 : 1) - (b.ok ? 0 : 1) || b.totalExact - a.totalExact || a.name.localeCompare(b.name, "nl"));
  ranked.forEach((c, i) => (c.rank = i + 1));
  const ELIG = ranked.filter((c) => c.ok);
  CATS.forEach((c) => { const s = [...ELIG].sort((a, b) => b.catExact[c] - a.catExact[c]); s.forEach((x, i) => { x.catRank = x.catRank || {}; x.catRank[c] = i + 1; }); });
  TIERS.forEach((t) => { const s = [...ELIG].sort((a, b) => b.tierExact[t] - a.tierExact[t]); s.forEach((x, i) => { x.tierRank = x.tierRank || {}; x.tierRank[t] = i + 1; }); });
  ranked.forEach((x) => {
    x.catRank = x.catRank || {}; x.tierRank = x.tierRank || {};
    x.best = CATS.reduce((a, c) => (x.catExact[c] > x.catExact[a] ? c : a), CATS[0]);
    x.worst = CATS.reduce((a, c) => (x.catExact[c] < x.catExact[a] ? c : a), CATS[0]);
    x.catWins = CATS.filter((c) => x.catRank[c] === 1);
  });
  const varRank = V.map((v, i) => {
    const s = [...ELIG].sort((a, b) => (b.scores[i] ?? -1) - (a.scores[i] ?? -1));
    const mm = {};
    s.forEach((x, k) => { mm[x.name] = k > 0 && s[k - 1].scores[i] === x.scores[i] ? mm[s[k - 1].name] : k + 1; });
    return mm;
  });
  const heaviest = V.reduce((a, b) => (b.gewicht > a.gewicht ? b : a));
  const lightest = V.reduce((a, b) => (b.gewicht < a.gewicht ? b : a));
  return {
    V, CATS, CATN, CATK, CATT, TIERS, TIERN: Object.fromEntries(DATA.tiers.map((t) => [t.tier, t.naam])),
    catW: catW0, catWnow: catW, catN, catShare, tierW: tierW0, tierShare, byWeight, totW: totW0,
    C: ranked, ELIG, by: Object.fromEntries(ranked.map((x) => [x.name, x])),
    varRank, heaviest, lightest, r1, r2, nScores: ELIG.length * V.length,
  };
}
if (typeof module !== "undefined") module.exports = { berekenModel };
