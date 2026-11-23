// v1.4.25 — French localisation.
//
//   1. A French browser gets the French UI with no setting touched
//      (Settings → Language = Auto), and <html lang="fr">.
//   2. Template chains are French: names, descriptions, segment names —
//      and forking one copies the French words into the new chain.
//   3. User-typed names are never translated (a chain named "Rest" stays
//      "Rest").
//   4. Plurals follow French rules (0 and 1 are singular).
//   5. Settings → Language → English switches the whole UI live, without
//      a reload, and persists; → Auto goes back to French.
//   6. An English browser stays English on Auto.
//   7. Every static text node in index.html that the French dictionary
//      knows is translated (no English left over among known strings).
//
// Run via:
//   npm run serve   # in another shell
//   node tools/smoke-i18n.mjs

import { chromium } from 'playwright';

const URL = process.env.URL || 'http://localhost:4321/';
const STORAGE_KEY = 'chained-timers/v1';

let failures = 0;
const ok  = m => console.log('  ✓', m);
const bad = m => { console.log('  ✗', m); failures++; };
const eq  = (a, e, label) => {
  const A = JSON.stringify(a), E = JSON.stringify(e);
  A === E ? ok(`${label} = ${A}`) : bad(`${label} expected ${E} got ${A}`);
};

const SEED = {
  schemaVersion: 1,
  chains: [
    { id: 'c_rest', name: 'Rest', color: 'amber', loops: 1, hasRun: true,
      segments: [{ id: 's1', kind: 'segment', name: 'Work', duration: 30, color: 'amber' }],
      createdAt: 1, updatedAt: 1 },
  ],
  settings: { sound: false, voice: false, vibrate: false, prestart: false },
};

const browser = await chromium.launch({ headless: true });

async function open(locale) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale });
  const page = await ctx.newPage();
  page.on('pageerror', e => bad('pageerror: ' + e.message));
  page.on('console', msg => { if (msg.type() === 'error') bad('console: ' + msg.text()); });
  await page.addInitScript(({ key, seed }) => {
    if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(seed));
  }, { key: STORAGE_KEY, seed: SEED });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(200);
  return { ctx, page };
}

const text = (page, sel) => page.evaluate(s => document.querySelector(s)?.textContent?.trim(), sel);

console.log('Test 1: a French browser gets French on Auto');
const { ctx, page } = await open('fr-FR');
eq(await page.evaluate(() => document.documentElement.lang), 'fr', '<html lang>');
eq(await page.evaluate(() => window.I18n.setting), 'auto', 'language setting');
eq(await text(page, '.tab[data-tab="library"] span'), 'Chaînes', 'tab label');
eq(await text(page, '.tagline em'), 'La forge à intervalles.', 'tagline');
eq(await page.evaluate(() => document.getElementById('new-chain-fab').getAttribute('aria-label')), 'Nouvelle chaîne', 'FAB aria-label');

console.log('\nTest 3: user names are left alone');
eq(await text(page, '.chain-card-name'), 'Rest', 'chain named "Rest" is not translated');

console.log('\nTest 4: French plurals');
eq(await text(page, '#library-count'), '1 chaîne', 'one chain');
eq(await page.evaluate(() => window.Tn(0, '{n} chain', '{n} chains')), '0 chaîne', 'zero is singular in French');
eq(await page.evaluate(() => window.Tn(2, '{n} chain', '{n} chains')), '2 chaînes', 'two is plural');

console.log('\nTest 2: templates are French, and forking copies French words');
await page.click('.tab[data-tab="templates"]');
await page.waitForTimeout(150);
const tplNames = await page.evaluate(() => [...document.querySelectorAll('.template-card-title')].map(e => e.textContent));
eq(tplNames.includes('Respiration carrée'), true, 'Box Breath → Respiration carrée');
eq(tplNames.includes('Série de gainage'), true, 'Plank Stack → Série de gainage');
await page.evaluate(() => {
  const card = [...document.querySelectorAll('.template-card')].find(c => c.textContent.includes('Respiration carrée'));
  card.click();
});
await page.waitForTimeout(200);
const forked = await page.evaluate(() => ({
  name: window.ChainedApp.Editor.draft.name,
  segs: window.ChainedApp.Editor.draft.segments.map(s => s.name),
}));
eq(forked.name, 'Respiration carrée', 'forked chain name');
eq(forked.segs, ['Inspirez', 'Retenez', 'Expirez', 'Retenez'], 'forked segment names');
eq(await text(page, '#editor-mode-label'), 'Nouvelle', 'editor eyebrow');
eq(await page.evaluate(() => document.querySelector('.segment-name-input').placeholder), 'Nom', 'segment name placeholder');

console.log('\nTest 7: no known static string left in English');
const leftovers = await page.evaluate(() => {
  // Every collected static entry must currently show its translation
  // (or have been rewritten by app code since — then it isn't ours).
  const I = window.I18n;
  return I._textNodes
    .filter(e => e.node.isConnected && e.node.nodeValue === e.applied && e.node.nodeValue.trim() === e.src && I.t(e.src) !== e.src)
    .map(e => e.src);
});
eq(leftovers, [], 'untranslated static strings');
// Coverage: every English text node / label in index.html has an entry
// (except placeholders that app code always overwrites, and brand words).
const missing = await page.evaluate(async () => {
  const ALLOW = new Set(['CHAINED', 'TIMERS', 'GitHub', 'English', 'Français', 'Auto',
    'Segment 1', 'of —', '00:00 elapsed', '00:00 remaining', 'Version —', '0 selected',
    'Chained Timers — Interval Chains for Sport & Focus']);
  const html = await (await fetch('./index.html')).text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const out = [];
  const w = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    const t = n.nodeValue.trim();
    if (!/[A-Za-z]{2,}/.test(t) || ALLOW.has(t)) continue;
    if (n.parentElement.closest('script,style')) continue;
    if (!window.I18n.has(t)) out.push(t);
  }
  doc.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el => {
    for (const a of ['placeholder', 'aria-label', 'title']) {
      const v = el.getAttribute(a);
      if (v && /[A-Za-z]{2,}/.test(v) && !ALLOW.has(v) && !window.I18n.has(v)) out.push(`@${a}=${v}`);
    }
  });
  return [...new Set(out)];
});
eq(missing, [], 'index.html strings without a French entry');

console.log('\nTest 5: Settings → English switches live and persists; Auto returns to French');
await page.evaluate(() => window.ChainedApp.View.show('library'));
await page.click('#open-settings');
await page.waitForTimeout(150);
eq(await page.evaluate(() => document.querySelector('#setting-language [data-lang="auto"]').getAttribute('aria-pressed')), 'true', 'Auto is selected');
await page.click('#setting-language [data-lang="en"]');
await page.waitForTimeout(200);
eq(await text(page, '#settings-sheet .sheet-title'), 'Settings', 'settings title now English');
eq(await text(page, '.tab[data-tab="library"] span'), 'Chains', 'tab label now English');
eq(await text(page, '#library-count'), '1 chain', 'library count now English');
eq(await page.evaluate(k => JSON.parse(localStorage.getItem(k)).settings.language, STORAGE_KEY), 'en', 'persisted');
eq(await page.evaluate(() => document.documentElement.lang), 'en', '<html lang> follows');
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(200);
eq(await text(page, '.tab[data-tab="library"] span'), 'Chains', 'still English after reload');
await page.click('#open-settings');
await page.click('#setting-language [data-lang="auto"]');
await page.waitForTimeout(200);
eq(await text(page, '.tab[data-tab="library"] span'), 'Chaînes', 'Auto → back to French');
await ctx.close();

console.log('\nTest 6: an English browser stays English on Auto');
{
  const { ctx: c2, page: p2 } = await open('en-US');
  eq(await text(p2, '.tab[data-tab="library"] span'), 'Chains', 'tab label');
  eq(await p2.evaluate(() => document.documentElement.lang), 'en', '<html lang>');
  await c2.close();
}

await browser.close();
console.log(failures ? `\n✗ ${failures} failure(s)` : '\n✓ all passed');
process.exit(failures ? 1 : 0);
