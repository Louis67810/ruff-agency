// Assemble une page à partir de son gabarit : insère les Heroicons utilisés,
// les questions de FAQ (structure réelle du site) et le footer réel du site.
// Usage : node build.mjs <gabarit.src.html> <sortie.html> [faq.json]
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../../..");
const [src, out, faqFile] = process.argv.slice(2);
let html = fs.readFileSync(src, "utf8");

// 1. Heroicons : extraire uniquement ceux utilisés (#hi-outline-xxx / #hi-solid-xxx).
const used = [...new Set([...html.matchAll(/#hi-(outline|solid)-([a-z-]+)/g)].map((m) => `${m[1]}:${m[2]}`))];
const byStyle = { outline: [], solid: [] };
for (const u of used) {
  const [style, name] = u.split(":");
  byStyle[style].push(name.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(""));
}
const script = path.join(root, ".claude/skills/ruff-design/scripts/heroicons.mjs");
let icons = "";
for (const style of ["outline", "solid"]) {
  if (byStyle[style].length) icons += execFileSync(process.execPath, [script, root, style, ...byStyle[style]], { encoding: "utf8" });
}
html = html.replace("<!--@ICONS-->", icons.trim());

// 2. FAQ : mêmes classes que components/sections/StackSection3.
if (faqFile) {
  const items = JSON.parse(fs.readFileSync(faqFile, "utf8"));
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const li = items.map(([q, a]) => `<li class="s3-faq-item s3-reveal-up is-visible"><button type="button" class="s3-faq-header" aria-expanded="false"><span class="s3-faq-question">${esc(q)}</span><div class="s3-faq-chevron-wrap"><svg class="s3-faq-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M 12 6 L 6 0 L 0 6" transform="translate(6 9)"></path></svg></div></button><div class="s3-answer-clip" aria-hidden="true"><div class="s3-answer-inner"><p class="s3-faq-answer">${a}</p></div></div><div class="s3-faq-line"></div></li>`).join("\n      ");
  html = html.replace("<!--@FAQ-ITEMS-->", li);
}

// 2 bis. Avis clients (R45) : photo réelle + citation. Chaque <!--@REVIEWS--> reçoit la liste
//        complète (deux marqueurs = liste doublée pour un ticker sans coupure).
const reviewsFile = process.argv[5];
if (reviewsFile && html.includes("<!--@REVIEWS-->")) {
  const reviews = JSON.parse(fs.readFileSync(reviewsFile, "utf8"));
  const cards = reviews.map(([photo, name, role, quote]) => `<blockquote class="bp-card bp-quote bp-review"><p>« ${quote} »</p><cite class="bp-review__author"><img src="../assets/avis/${photo}" alt="Photo de ${name}" width="52" height="52"><span>${name}<span>${role}</span></span></cite></blockquote>`).join("\n      ");
  html = html.split("<!--@REVIEWS-->").join(cards);
}

// 2 ter. Formes SVG du site (R48) : <!--@SHAPES--> (bleu pâle) ou <!--@SHAPES-LIGHT--> (blanc, sur fond bleu).
const shapes = fs.readFileSync(path.join(root, "brand/design/components/shapes.html"), "utf8").replace(/<!--[\s\S]*?-->\s*/, "").trim();
html = html.split("<!--@SHAPES-LIGHT-->").join(shapes.replace('class="rf-shapes"', 'class="rf-shapes rf-shapes--light"'));
html = html.split("<!--@SHAPES-->").join(shapes);

// 3. Footer réel : liens relatifs du site → liens absolus vers ruff.agency.
//    <!--@FOOTER--> = footer avec bandeau d'appel ; <!--@FOOTER-SANS-CTA--> = sans (R40,
//    pour une page qui a déjà son propre appel final).
const loadFooter = (f) => fs.readFileSync(path.join(root, "brand/design/components", f), "utf8").replace(/href="\//g, 'href="https://ruff.agency/');
if (html.includes("<!--@FOOTER-SANS-CTA-->")) html = html.replace("<!--@FOOTER-SANS-CTA-->", loadFooter("site-footer-sans-cta.html"));
if (html.includes("<!--@FOOTER-->")) html = html.replace("<!--@FOOTER-->", loadFooter("site-footer.html"));

fs.writeFileSync(out, html);
console.log("ok", out, "icônes :", used.length);
