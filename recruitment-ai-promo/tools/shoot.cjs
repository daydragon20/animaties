// Usage: node tools/shoot.cjs <html> <outdir> <query1> [query2 ...]
const { chromium } = require('./pw.cjs');
const path = require('node:path');
const [,, base, outdir, ...queries] = process.argv;
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const q of queries) {
    await page.goto(`file://${path.resolve(base)}?${q}`);
    await page.waitForFunction(() => document.body.dataset.ready === '1');
    await page.screenshot({ path: path.join(outdir, q.replace(/[&=]/g, '_') + '.png') });
  }
  await browser.close();
})();
