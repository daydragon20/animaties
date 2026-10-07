/* ═════════════ DATA ═════════════
   Eén rekenmodel voor de film, de verkenner én het controlescript (controle.mjs).
   Enige bron: de ruwe scores (188 per land) en de gewichten (188 vragen) uit de JSON.

   Wat we zelf (her)berekenen, en waarom:
   - Eindscore = gewogen gemiddelde van alle 188 scores. Exact, en getoond met 2 decimalen.
     De JSON rondt af op 1 decimaal, waardoor Oostenrijk en Polen allebei "89,1" hebben (en
     Montenegro, Frankrijk en Hongarije allebei "88,0"). Met 2 decimalen is de volgorde eerlijk.
   - Categoriescore = gewogen gemiddelde van de vragen in die categorie (1 decimaal).
     In de JSON is dat een óngewogen gemiddelde, terwijl de eindscore wél gewogen is. Gewogen
     maakt het sluitend: eindscore = Σ (categoriegewicht × categoriescore) / 100.
*/
function berekenModel(DATA, extraGewicht) {
  const V = DATA.variables.map((v, i) => ({ ...v, i }));
  const CATS = [];
  V.forEach((v) => { if (!CATS.includes(v.category)) CATS.push(v.category); });
  V.forEach((v) => (v.ci = CATS.indexOf(v.category)));
  // extraGewicht: optionele vermenigvuldiger per categorie (verkenner: "speel met de gewichten")
  const mul = (c) => (extraGewicht && extraGewicht[c] != null ? extraGewicht[c] : 1);
  const w = V.map((v) => v.weight * mul(v.category));
  const catW = {}, catN = {}, catW0 = {};
  CATS.forEach((c) => { catW[c] = 0; catN[c] = 0; catW0[c] = 0; });
  V.forEach((v, i) => { catW[v.category] += w[i]; catW0[v.category] += v.weight; catN[v.category]++; });
  const totW = w.reduce((a, b) => a + b, 0);
  const totW0 = V.reduce((a, v) => a + v.weight, 0);
  const catShare = {};
  CATS.forEach((c) => (catShare[c] = (catW0[c] / totW0) * 100));
  const byWeight = [...CATS].sort((a, b) => catW0[b] - catW0[a]);
  const r1 = (x) => Math.round((x + 1e-9) * 10) / 10;
  const r2 = (x) => Math.round((x + 1e-9) * 100) / 100;

  const C = DATA.ranking.map((r, jsonIdx) => {
    let s = 0;
    r.scores.forEach((x, i) => (s += w[i] * x));
    const catExact = {};
    CATS.forEach((c) => (catExact[c] = 0));
    r.scores.forEach((x, i) => (catExact[V[i].category] += (V[i].weight * x)));
    CATS.forEach((c) => (catExact[c] /= catW0[c]));
    const cat = {};
    CATS.forEach((c) => (cat[c] = r1(catExact[c])));
    return {
      name: r.country, region: r.region, profile: r.profile, confidence: r.confidence,
      zeker: r.confidence === "High" ? "hoog" : r.confidence === "Medium" ? "gemiddeld" : r.confidence,
      scores: r.scores, totalExact: s / totW, total: r2(s / totW), totalJson: r.total, rankJson: jsonIdx + 1,
      catExact, cat, catJson: r.categories,
    };
  });
  const ranked = [...C].sort((a, b) => b.totalExact - a.totalExact);
  ranked.forEach((c, i) => (c.rank = i + 1));
  // per categorie: rang van elk land (1 = beste van 25), op de exacte gewogen waarde
  CATS.forEach((c) => {
    const s = [...ranked].sort((a, b) => b.catExact[c] - a.catExact[c]);
    s.forEach((x, i) => { x.catRank = x.catRank || {}; x.catRank[c] = i + 1; });
  });
  ranked.forEach((x) => {
    x.best = CATS.reduce((a, c) => (x.catExact[c] > x.catExact[a] ? c : a), CATS[0]);
    x.worst = CATS.reduce((a, c) => (x.catExact[c] < x.catExact[a] ? c : a), CATS[0]);
    x.catWins = CATS.filter((c) => x.catRank[c] === 1);
    x.floor = x.cat[x.worst];
    x.ceil = x.cat[x.best];
  });
  // per vraag: rang van elk land
  const varRank = V.map((v, i) => {
    const s = [...ranked].sort((a, b) => b.scores[i] - a.scores[i]);
    const m = {};
    s.forEach((x, k) => {
      // gedeelde plaats bij gelijke score
      m[x.name] = k > 0 && s[k - 1].scores[i] === x.scores[i] ? m[s[k - 1].name] : k + 1;
    });
    return m;
  });
  const heaviest = V.reduce((a, b) => (b.weight > a.weight ? b : a));
  const lightest = V.reduce((a, b) => (b.weight < a.weight ? b : a));
  const floorRank = [...ranked].sort((a, b) => b.floor - a.floor);
  return {
    V, CATS, catW: catW0, catWnow: catW, catN, catShare, byWeight, totW: totW0,
    C: ranked, by: Object.fromEntries(ranked.map((x) => [x.name, x])),
    varRank, heaviest, lightest, floorRank, r1, r2,
    nScores: ranked.length * V.length,
  };
}
if (typeof module !== "undefined") module.exports = { berekenModel };
