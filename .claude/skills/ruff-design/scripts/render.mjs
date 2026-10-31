// Rendu d'une maquette Ruff avec Edge (ou Chrome) en mode headless.
// Usage : node render.mjs <section.html> [outPrefix] [hauteur=2300]
// Produit : <outPrefix>-desktop.png (1440 px), <outPrefix>-mobile.png (375 px,
// via une iframe car le headless impose une largeur minimale de fenêtre) et
// <outPrefix>-close.png (desktop en densité ×2, pour les gros plans).
// Lire CHAQUE image produite avant de livrer (references/verify.md).
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [input, prefixArg, hArg = "2300"] = process.argv.slice(2);
if (!input) { console.error("usage: node render.mjs <section.html> [outPrefix] [hauteur]"); process.exit(2); }
const file = path.resolve(input);
const prefix = path.resolve(prefixArg || file.replace(/\.html$/, ""));
const height = Number(hArg);
const browsers = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
];
const browser = browsers.find((b) => fs.existsSync(b));
if (!browser) { console.error("aucun navigateur Chromium trouvé"); process.exit(2); }

const shot = (url, out, w, h, extra = []) => {
  // Profil neuf à chaque rendu : un profil verrouillé bloque le headless.
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "ruff-render-"));
  fs.rmSync(out, { force: true }); // sinon une ancienne capture passe pour la nouvelle
  const r = spawnSync(browser, ["--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars", "--allow-file-access-from-files",
    `--user-data-dir=${profile}`, `--window-size=${w},${h}`, "--virtual-time-budget=8000", `--screenshot=${out}`, ...extra, url],
    { timeout: 90000, stdio: "ignore" });
  // Délai dépassé (ex. iframe Cal.com) : fermer aussi les processus enfants, sinon ils bloquent les rendus suivants.
  if (r.error && process.platform === "win32") spawnSync("taskkill", ["/PID", String(r.pid), "/T", "/F"], { stdio: "ignore" });
  // Edge peut rendre la main avant d'écrire la capture : attendre le fichier (60 s au plus).
  for (let i = 0; i < 120 && !fs.existsSync(out); i++) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 500);
  console.log(fs.existsSync(out) ? `ok ${out}` : `ECHEC ${out}`);
};

const url = pathToFileURL(file).href;
shot(url, `${prefix}-desktop.png`, 1440, height);
shot(url, `${prefix}-close.png`, 1440, height, ["--force-device-scale-factor=2"]);
const harness = path.join(os.tmpdir(), `ruff-mobile-${Date.now()}.html`);
fs.writeFileSync(harness, `<!doctype html><body style="margin:0;background:#888"><iframe src="${url}" style="width:375px;height:${height + 1000}px;border:0;background:#fff"></iframe></body>`);
shot(pathToFileURL(harness).href, `${prefix}-mobile.png`, 375, height + 1000);
