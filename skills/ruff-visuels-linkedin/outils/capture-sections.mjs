// Capture écran par écran d'un vrai site (sections animées au défilement, sticky, Framer…).
// Usage : node capture-sections.mjs <url> <dossier> '<json [{"nom":"hero","y":0}, …]>' [largeur=1440] [hauteur=1000] [echelle=2]
// Chaque entrée : on défile jusqu'à y, on laisse jouer les animations, on capture la fenêtre visible -> <nom>.png
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const [url, out, list, width = '1440', height = '1000', scale = '2'] = process.argv.slice(2);
const W = Number(width), Hh = Number(height), S = Number(scale);
const targets = JSON.parse(list);
fs.mkdirSync(out, { recursive: true });
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cap-'));
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, `--window-size=${W},${Hh}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let wsUrl;
for (let i = 0; i < 50 && !wsUrl; i++) {
  await sleep(300);
  try { const t = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); wsUrl = t.find((x) => x.type === 'page')?.webSocketDebuggerUrl; } catch {}
}
const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const cdp = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evalJs = async (expr) => (await cdp('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;

await cdp('Page.enable');
await cdp('Emulation.setDeviceMetricsOverride', { width: W, height: Hh, deviceScaleFactor: S, mobile: W < 700 });
await cdp('Page.navigate', { url });
await sleep(6000);
let cur = 0;
for (const t of targets) {
  // défilement progressif jusqu'à la cible, pour déclencher les animations intermédiaires
  const step = t.y > cur ? 300 : -300;
  for (let y = cur; step > 0 ? y < t.y : y > t.y; y += step) { await evalJs(`window.scrollTo(0, ${y})`); await sleep(120); }
  await evalJs(`window.scrollTo(0, ${t.y})`);
  cur = t.y;
  await sleep(t.attente || 2200);
  const shot = await cdp('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(out, `${t.nom}.png`), Buffer.from(shot.result.data, 'base64'));
  console.log('capturé', t.nom, t.y);
}
ws.close(); chrome.kill();
