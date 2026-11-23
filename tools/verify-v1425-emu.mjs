// v1.4.25 — emulator verification of the 3-2-1 sync work, the French
// notification labels and the WebView text zoom.
//
//   1. Two 8s segments then the end: before each boundary the service
//      wakes the output (primer-on) BEFORE the 3-2-1 starts; the burst
//      starts from the top within a hair of the 3 (less its learned
//      output lag), its in-flight check finds it on the clock, every
//      boundary gets exactly one chime, and the end gets the finale.
//   2. With the app in French, the ongoing notification's actions are
//      French ("Arrêter la chaîne").
//   3. A larger system font no longer inflates the WebView's text:
//      the segment-name field stays 16px at font_scale 1.3.
//
// Cue timing is read from the service's debug-only ChainTimerCue trace
// (logcat) against device time taken in the WebView.
//
// Requires: emulator running, current DEBUG APK installed, app
// foregrounded, CDP on localhost:9222, POST_NOTIFICATIONS granted.
// Launch it all with: publishing\android\LAUNCH.ps1 -Devtools

import { execSync } from 'node:child_process';

const ADB = process.env.ADB || 'C:\\Users\\erwin\\AppData\\Local\\Android\\Sdk\\platform-tools\\adb.exe';
const PKG = 'com.github.chainedtimers';
const sh   = (cmd) => execSync(`"${ADB}" ${cmd}`, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const wait = (ms)  => new Promise(r => setTimeout(r, ms));

let failures = 0;
const ok  = (m) => console.log('  ✓', m);
const bad = (m) => { console.log('  ✗', m); failures++; };
const eq  = (a, e, label) => {
  const A = JSON.stringify(a), E = JSON.stringify(e);
  A === E ? ok(`${label} = ${A}`) : bad(`${label} expected ${E} got ${A}`);
};

async function connect() {
  const list = await (await fetch('http://localhost:9222/json/list')).json();
  const target = list.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
  if (!target) { console.error('no CDP page'); process.exit(2); }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let msgId = 0; const pending = new Map();
  ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(new Error(m.error.message)) : p.resolve(m.result); } };
  await new Promise(r => ws.onopen = r);
  const send = (method, params = {}) => { const id = ++msgId; return new Promise((res, rej) => { pending.set(id, { resolve: res, reject: rej }); ws.send(JSON.stringify({ id, method, params })); }); };
  return async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' :: ' + (r.exceptionDetails.exception?.description || ''));
    return r.result?.value;
  };
}

// Every ChainTimerCue line since the last clear: { at, text }.
function trace() {
  return sh('logcat -d -v epoch -s ChainTimerCue').split(/\r?\n/).map(l => {
    const m = l.match(/^\s*(\d+)\.(\d{3}).*?ChainTimerCue:\s*(.*)$/);
    return m ? { at: Number(m[1]) * 1000 + Number(m[2]), text: m[3] } : null;
  }).filter(Boolean);
}

function notifActions() {
  const dump = sh('shell dumpsys notification --noredact');
  const blocks = dump.split(/NotificationRecord\(/).filter(b => b.includes(`pkg=${PKG}`) && b.includes('chain-fg'));
  const titles = [];
  for (const b of blocks) {
    const m = b.match(/actions=\{([\s\S]*?)\n\s*\}/);
    if (!m) continue;
    for (const a of m[1].matchAll(/"([^"]+)"\s*->/g)) titles.push(a[1]);
  }
  return titles;
}

let evalJs = await connect();

const SEED = (lang) => `(() => {
  const seg = (id, name) => ({ id, kind: 'segment', name, duration: 8, color: 'amber' });
  const seed = {
    schemaVersion: 1,
    chains: [
      { id: 'v_sync', name: 'VSync', color: 'amber', loops: 1, hasRun: true,
        segments: [seg('a', 'Alpha'), seg('b', 'Beta')], createdAt: 1, updatedAt: 1 },
    ],
    settings: { sound: true, voice: false, vibrate: false, prestart: false,
                finalTick: true, ringUntilDismissed: false, language: '${lang}' },
  };
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const k = localStorage.key(i);
    if (k && k.indexOf('chained-timers/run/') === 0) localStorage.removeItem(k);
  }
  localStorage.setItem('chained-timers/v1', JSON.stringify(seed));
  return true;
})()`;

async function reseed(lang) {
  await evalJs(SEED(lang));
  await evalJs('location.reload()');
  await wait(3000);
  evalJs = await connect();
  await wait(500);
}

const START = `(() => { const t = Date.now(); window.ChainedApp.UI.startRunForChain(window.ChainedApp.Store.getChain('v_sync')); return t; })()`;

console.log('Test 1: primer before the 3-2-1, burst on the clock, one chime per boundary, finale');
await reseed('en');
sh('logcat -c');
const t0 = await evalJs(START);
await wait(18500);
{
  const tr = trace().map(x => ({ ...x, t: x.at - t0 }));
  for (const x of tr) console.log(`      ${String(x.t).padStart(6)}ms  ${x.text}`);
  const boundaries = [8000, 16000];
  for (const [i, end] of boundaries.entries()) {
    const win = tr.filter(x => x.t > end - 6500 && x.t < end + 600);
    const primer = win.find(x => x.text.startsWith('primer-on'));
    const burst  = win.find(x => x.text.includes('which=final3'));
    const sync   = win.find(x => x.text.startsWith('final3-sync'));
    if (primer && burst && primer.t < burst.t - 1000) ok(`boundary ${i + 1}: output primed ${burst.t - primer.t}ms before the burst`);
    else if (burst && !primer && i > 0 && tr.some(x => x.text.startsWith('primer-on') && x.t < burst.t)) ok(`boundary ${i + 1}: output still primed from before`);
    else bad(`boundary ${i + 1}: primer ${JSON.stringify(primer)} burst ${JSON.stringify(burst)}`);
    if (burst) {
      const early = (end - 3000) - burst.t;          // > 0: started ahead (lag compensation)
      (early >= -120 && early <= 400) ? ok(`boundary ${i + 1}: burst started ${early}ms ahead of the 3`)
                                     : bad(`boundary ${i + 1}: burst at ${burst.t}ms (3 is at ${end - 3000})`);
      (/from=0\b/.test(burst.text)) ? ok(`boundary ${i + 1}: from the top`) : bad(`boundary ${i + 1}: ${burst.text}`);
    }
    if (sync) {
      const drift = Number((sync.text.match(/drift=(-?\d+)/) || [])[1]);
      Math.abs(drift) <= 150 ? ok(`boundary ${i + 1}: in-flight drift ${drift}ms`) : bad(`boundary ${i + 1}: drift ${drift}ms`);
    } else bad(`boundary ${i + 1}: no final3-sync line`);
  }
  const chimes  = tr.filter(x => x.text.includes('which=chime'));
  const finales = tr.filter(x => x.text.includes('which=finale'));
  eq(chimes.length, 1, 'chimes (one, at the single mid-chain boundary)');
  if (chimes[0]) Math.abs(chimes[0].t - 8000) <= 250 ? ok(`chime at ${chimes[0].t}ms`) : bad(`chime at ${chimes[0].t}ms`);
  eq(finales.length, 1, 'finales');
  if (finales[0]) Math.abs(finales[0].t - 16000) <= 250 ? ok(`finale at ${finales[0].t}ms`) : bad(`finale at ${finales[0].t}ms`);
  const primerOff = tr.filter(x => x.text.startsWith('primer-off'));
  primerOff.length ? ok(`primer released (${primerOff.length}×)`) : bad('primer never released');
}

console.log('\nTest 2: French notification labels');
await reseed('fr');
await evalJs(START);
await wait(2000);
{
  const acts = notifActions();
  acts.includes('Arrêter la chaîne') ? ok(`actions ${JSON.stringify(acts)}`) : bad(`actions ${JSON.stringify(acts)}`);
}
await evalJs(`window.ChainedApp.Engine.stopRun('v_sync')`);
await wait(500);

console.log('\nTest 3: a larger system font does not inflate WebView text');
{
  sh('shell settings put system font_scale 1.3');
  sh(`shell am force-stop ${PKG}`);
  sh(`shell am start -n ${PKG}/.MainActivity`);
  await wait(4000);
  try { sh(`forward tcp:9222 localabstract:webview_devtools_remote_${sh(`shell pidof ${PKG}`).trim()}`); } catch {}
  await wait(500);
  evalJs = await connect();
  const fs = await evalJs(`(() => { window.ChainedApp.Editor.loadChain('v_sync'); window.ChainedApp.View.show('editor');
    const i = document.querySelector('.segment-name-input'); return getComputedStyle(i).fontSize; })()`);
  eq(fs, '16px', 'segment name font size at font_scale 1.3');
  sh('shell settings put system font_scale 1.0');
}

console.log('');
if (failures) { console.log(`❌ ${failures} check(s) failed`); process.exit(1); }
console.log('✅ all checks passed');
process.exit(0);
