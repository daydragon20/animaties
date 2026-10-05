// Usage: node tools/frames.cjs <outdir> <t1> [t2 ...]  — losse frames voor inspectie
const { chromium } = require('./pw.cjs');
const path = require('node:path');
const [,, outdir, ...ts] = process.argv;
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '../index.html') + '?render=1');
  await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 20000 }).catch(() => {});
  for (const t of ts) {
    await page.evaluate(t => window.__seek(t), parseFloat(t));
    await page.screenshot({ path: path.join(outdir, `t${String(parseFloat(t).toFixed(2)).padStart(6, '0')}.png`) });
  }
  if (errs.length) console.log('ERRORS:\n' + errs.join('\n'));
  await browser.close();
})();
