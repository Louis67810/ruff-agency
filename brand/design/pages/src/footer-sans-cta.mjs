// Produit la variante du footer réel SANS le bandeau d'appel bleu (R40) :
// retire le bloc .framer-1noh2n et remet le padding haut normal du footer (96 px, comme sur la page SaaS).
// Usage : node footer-sans-cta.mjs <site-footer.html> <site-footer-sans-cta.html>
import fs from "node:fs";
const [inp, out] = process.argv.slice(2);
let html = fs.readFileSync(inp, "utf8");
const start = html.indexOf('<div class="framer-1noh2n"');
if (start < 0) throw new Error("bandeau d'appel introuvable");
const re = /<(\/?)div\b[^>]*>/g;
re.lastIndex = start;
let depth = 0, end = -1, m;
while ((m = re.exec(html))) {
  depth += m[1] ? -1 : 1;
  if (depth === 0) { end = re.lastIndex; break; }
}
html = html.slice(0, start) + html.slice(end);
html = html.replace("--th1ufy:500px 48px 64px 48px", "--th1ufy:96px 48px 64px 48px").replace(" footer--with-cta", "");
fs.writeFileSync(out, html);
console.log("ok", out, html.length);
