// Resolve the globally installed Playwright (no local node_modules needed).
const { execSync } = require('node:child_process');
const root = execSync('npm root -g').toString().trim();
module.exports = require(require.resolve('playwright', { paths: [root] }));
