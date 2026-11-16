// Capture d'un vrai site (y compris Framer / animations au défilement) via Chrome + DevTools Protocol.
// Usage : node capture-site.mjs <url> <dossier> [largeur=1440] [echelle=2]
// Produit : page.png (page entière), sections.json (titres et positions des sections pour recadrer).
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const [url, out, width = '1440', scale = '2'] = process.argv.slice(2);
const W = Number(width), S = Number(scale);
fs.mkdirSync(out, { recursive: true });
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cap-'));
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, `--window-size=${W},1000`, 'about:blank'], { stdio: 'ignore' });
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
await cdp('Emulation.setDeviceMetricsOverride', { width: W, height: 1000, deviceScaleFactor: S, mobile: false });
await cdp('Page.navigate', { url });
await sleep(6000);
// Défilement progressif pour déclencher toutes les animations d'apparition.
const total = await evalJs('document.documentElement.scrollHeight');
for (let y = 0; y <= total; y += 400) { await evalJs(`window.scrollTo(0, ${y})`); await sleep(250); }
await sleep(2500);
await evalJs('window.scrollTo(0, 0)');
await sleep(1500);
const H = await evalJs('document.documentElement.scrollHeight');
// Positions des titres de section pour recadrer ensuite.
const sections = await evalJs(`[...document.querySelectorAll('h1,h2,h3')].map(h => { const r = h.getBoundingClientRect(); return { text: h.innerText.trim().slice(0, 90), top: Math.round(r.top + scrollY), left: Math.round(r.left), w: Math.round(r.width) }; }).filter(s => s.text)`);
fs.writeFileSync(path.join(out, 'sections.json'), JSON.stringify({ width: W, height: H, scale: S, sections }, null, 1));
await cdp('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: S, mobile: false });
await sleep(2500);
const shot = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: W, height: H, scale: 1 } });
fs.writeFileSync(path.join(out, 'page.png'), Buffer.from(shot.result.data, 'base64'));
console.log('ok', W, H, sections.length);
ws.close(); chrome.kill();
