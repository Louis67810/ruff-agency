// v4 (27/10/2026) : v3 sans le bloc « Louis Staub, fondateur » dans la section « Créé par des designers ».
import fs from "node:fs";
const [src, out] = process.argv.slice(2);
let s = fs.readFileSync(src, "utf8");
const rep = (a, b) => { if (!s.includes(a)) throw new Error("introuvable : " + a.slice(0, 80)); s = s.split(a).join(b); };
rep("<title>Ruff Agency Blueprint — v3</title>", "<title>Ruff Agency Blueprint — v4</title>");
rep("<!-- v3 (27/10/2026) :", "<!-- v4 (27/10/2026) : v3 sans le bloc fondateur dans « Créé par des designers ».\n     v3 (27/10/2026) :");
rep("Généré depuis pages/src/blueprint-v3.src.html", "Généré depuis pages/src/blueprint-v4.src.html");
rep(`      <div class="bp-founder" style="margin-top:0"><img src="../assets/louis.jpg" alt="Louis Staub"><div><b>Louis Staub</b><span class="bp-small">Fondateur de Ruff Agency</span></div></div>\n`, "");
rep('<div class="bp-proofs">', '<div class="bp-proofs" style="margin-top:0">');
rep("blueprint-merci-v3.html", "blueprint-merci-v4.html");
fs.writeFileSync(out, s);
console.log("ok", out);
