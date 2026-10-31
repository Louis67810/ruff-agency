// Extrait les tracés Heroicons (paquet @heroicons/react du projet) en <symbol> SVG.
// Usage : node heroicons.mjs <projet> <style: outline|solid|mini> Nom1 Nom2 ...
import fs from "node:fs";
import path from "node:path";
const [root, style, ...names] = process.argv.slice(2);
const dir = { outline: "24/outline", solid: "24/solid", mini: "20/solid" }[style];
const out = [];
for (const n of names) {
  const f = path.join(root, "node_modules/@heroicons/react", dir, `${n}Icon.js`);
  if (!fs.existsSync(f)) { console.error("absent:", n); continue; }
  const src = fs.readFileSync(f, "utf8");
  const paths = [...src.matchAll(/React\.createElement\("path", \{([\s\S]*?)\}\)/g)].map((m) => {
    const attrs = {};
    for (const a of m[1].matchAll(/(\w+):\s*"([^"]*)"/g)) attrs[a[1]] = a[2];
    const map = { strokeLinecap: "stroke-linecap", strokeLinejoin: "stroke-linejoin", fillRule: "fill-rule", clipRule: "clip-rule", d: "d" };
    return "<path " + Object.entries(attrs).map(([k, v]) => `${map[k] || k}="${v}"`).join(" ") + "/>";
  });
  const vb = style === "mini" ? "0 0 20 20" : "0 0 24 24";
  const kebab = n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").toLowerCase();
  const id = `hi-${style}-${kebab}`;
  const attrs = style === "outline" ? `fill="none" stroke="currentColor" stroke-width="1.5"` : `fill="currentColor"`;
  out.push(`<symbol id="${id}" viewBox="${vb}" ${attrs}>${paths.join("")}</symbol>`);
}
console.log(out.join("\n"));
