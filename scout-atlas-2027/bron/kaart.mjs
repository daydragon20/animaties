// Bouwt de Europa-kaart (SVG-paden in 1920x1080-coördinaten) uit Natural Earth 1:50m.
import { geoConicConformal, geoEquirectangular, geoPath, geoGraticule10 } from "d3-geo";
import { feature } from "topojson-client";
import { readFileSync, writeFileSync } from "node:fs";

// Vereist: npm i d3-geo topojson-client world-atlas@2 (in een werkmap), daarna: node kaart.mjs
const topo = JSON.parse(readFileSync("node_modules/world-atlas/countries-50m.json", "utf8"));
const fc = feature(topo, topo.objects.countries);

// Kandidaten: Nederlandse naam (zoals in de JSON) -> Natural Earth-naam + labelpunt (lon, lat)
const CAND = {
  "Portugal": ["Portugal", -8.1, 39.7],
  "Slowakije": ["Slovakia", 19.6, 48.7],
  "Kroatië": ["Croatia", 15.9, 45.45],
  "Oostenrijk": ["Austria", 14.2, 47.55],
  "Polen": ["Poland", 19.3, 52.1],
  "Tsjechië": ["Czechia", 15.4, 49.8],
  "Zwitserland": ["Switzerland", 8.2, 46.8],
  "Spanje": ["Spain", -3.6, 40.0],
  "Griekenland": ["Greece", 21.9, 39.4],
  "Montenegro": ["Montenegro", 19.25, 42.8],
  "Frankrijk": ["France", 2.4, 46.7],
  "Hongarije": ["Hungary", 19.3, 47.15],
  "Italië": ["Italy", 12.6, 42.9],
  "Duitsland": ["Germany", 10.3, 51.1],
  "Albanië": ["Albania", 20.05, 41.1],
  "Bosnië en Herzegovina": ["Bosnia and Herz.", 17.8, 44.2],
  "Canada": ["Canada", null, null],
  "Roemenië": ["Romania", 24.9, 45.9],
  "Noord-Macedonië": ["Macedonia", 21.7, 41.6],
  "Servië": ["Serbia", 20.8, 44.1],
  "Bulgarije": ["Bulgaria", 25.2, 42.7],
  "Turkije": ["Turkey", 34.0, 39.1],
  "Kosovo": ["Kosovo", 20.85, 42.6],
  "Georgië": ["Georgia", 43.6, 42.15],
};

const W = 1920, H = 1080;
const proj = geoConicConformal().parallels([38, 56]).rotate([-17, 0]).center([0, 47]);
const bbox = { type: "MultiPoint", coordinates: [[-10, 36.2], [45.5, 36.2], [-10, 55.4], [45.5, 55.4], [17, 56.6], [17, 35.2]] };
proj.fitExtent([[150, 150], [W - 150, H - 120]], bbox);
proj.clipExtent([[-40, -40], [W + 40, H + 40]]);

const path = geoPath(proj);
const r1 = (s) => s.replace(/(\d+\.\d)\d+/g, "$1");

// Alleen landen die (deels) in beeld liggen; bounding test op geprojecteerde bounds
const countries = [];
for (const f of fc.features) {
  const n = f.properties.name;
  if (n === "Canada" || n === "Greenland" || n === "Antarctica") continue;
  const b = path.bounds(f);
  if (!isFinite(b[0][0])) continue;
  if (b[1][0] < -100 || b[0][0] > W + 100 || b[1][1] < -100 || b[0][1] > H + 100) continue;
  // Rusland e.d. hebben enorme bounds; d3 clipt niet vanzelf, dus clippen we via extent
  const d = r1(path(f) || "");
  if (!d) continue;
  const cand = Object.entries(CAND).find(([, v]) => v[0] === n);
  countries.push({ nl: cand ? cand[0] : null, home: n === "Belgium", d });
}

const pts = {};
for (const [nl, [, lon, lat]] of Object.entries(CAND)) {
  if (lon == null) continue;
  const [x, y] = proj([lon, lat]);
  pts[nl] = [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}
const [bx, by] = proj([4.47, 50.65]);
pts["België"] = [Math.round(bx * 10) / 10, Math.round(by * 10) / 10];

// Wereldbol: equirectangulaire paden (2048 x 1024) uit 1:110m, voor de bol-textuur
const topo110 = JSON.parse(readFileSync("node_modules/world-atlas/countries-110m.json", "utf8"));
const fc110 = feature(topo110, topo110.objects.countries);
const eq = geoEquirectangular().scale(2048 / (2 * Math.PI)).translate([1024, 512]).precision(0.2);
const eqPath = geoPath(eq);
const r0 = (s) => s.replace(/(\d+)\.\d+/g, "$1");
const globe = fc110.features.map((f) => {
  const n = f.properties.name;
  const cand = Object.entries(CAND).find(([, v]) => v[0] === n);
  return { nl: cand ? cand[0] : null, home: n === "Belgium", d: r0(eqPath(f) || "") };
}).filter((g) => g.d);
const grat = r0(eqPath(geoGraticule10()));
writeFileSync("kaart.json", JSON.stringify({ countries, pts, globe, grat }));
console.log("globe", globe.length, "bytes", JSON.stringify(globe).length);
console.log(countries.length, "landen;", JSON.stringify(pts));
console.log("bytes", JSON.stringify(countries).length);
