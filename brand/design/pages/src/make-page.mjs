// Crée le gabarit d'une nouvelle page à partir du gabarit Blueprint (mêmes styles, même
// navigation, même footer) : remplace <main>, le titre, le commentaire d'en-tête et le
// bouton de navigation, ajoute des styles propres à la page.
// Usage : node make-page.mjs <gabarit-base.src.html> <main.html> <sortie.src.html> <titre> <libellé bouton nav> <lien bouton nav> <commentaire> [extra.css]
import fs from "node:fs";
const [base, mainFile, out, title, navLabel, navHref, comment, extraCss] = process.argv.slice(2);
let s = fs.readFileSync(base, "utf8");
const main = fs.readFileSync(mainFile, "utf8").trim();
const a = s.indexOf("<main>"), b = s.indexOf("</main>") + "</main>".length;
if (a < 0 || b < 7) throw new Error("<main> introuvable");
s = s.slice(0, a) + main + s.slice(b);
s = s.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
s = s.replace(/<!-- v\d[\s\S]*?-->/, `<!-- ${comment} -->`);
s = s.replace(/<a class="rf-btn rf-btn--primary" href="#formulaire"><span class="rf-btn__inner">Recevoir le Blueprint (<img class="rf-btn__avatar"[^>]*>)<\/span><\/a>/, `<a class="rf-btn rf-btn--primary" href="${navHref}"><span class="rf-btn__inner">${navLabel} $1</span></a>`);
// Le script du formulaire n'existe que si la page a un formulaire.
s = s.replace(/  \/\/ Maquette : on n'envoie pas l'email dans l'URL\.[\s\S]*?\n  \}\);\n/, `  // Maquette : formulaire éventuel, sans envoyer l'email dans l'URL.
  const form = document.querySelector(".bp-form");
  if (form) form.addEventListener("submit", (e) => { e.preventDefault(); const i = form.querySelector("input[type=email]"); if (!i.checkValidity()) { i.reportValidity(); return; } });
`);
if (extraCss) s = s.replace("</style>", fs.readFileSync(extraCss, "utf8") + "\n</style>");
fs.writeFileSync(out, s);
console.log("ok", out);
