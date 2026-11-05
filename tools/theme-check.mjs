// Runs Shopify Theme Check (@shopify/theme-check-node) against the theme root and prints offenses.
// Usage: node tools/theme-check.mjs   (requires: npm i @shopify/theme-check-node, see docs/07-testing-and-qa.md)
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(process.env.THEME_CHECK_MODULES || path.join(here, 'package.json'));
const { themeCheckRun } = require('@shopify/theme-check-node');
const root = path.resolve(here, '..');
const { offenses } = await themeCheckRun(root);
const sev = ['error', 'warning', 'info'];
const byFile = {};
for (const o of offenses) (byFile[o.uri.replace('file://' + root + '/', '')] ||= []).push(o);
let counts = { error: 0, warning: 0, info: 0 };
for (const [f, list] of Object.entries(byFile)) {
  for (const o of list) { counts[sev[o.severity]]++; console.log(`${sev[o.severity].toUpperCase().padEnd(7)} ${f}:${o.start.line + 1} [${o.check}] ${o.message}`); }
}
console.log(`\n${counts.error} errors, ${counts.warning} warnings, ${counts.info} info`);
process.exit(counts.error ? 1 : 0);
