// Applique les retours du 27/10/2026 (R40 à R45) au gabarit v3 (copie du v2).
import fs from "node:fs";
const f = process.argv[2];
let s = fs.readFileSync(f, "utf8");
const rep = (a, b) => { if (!s.includes(a)) throw new Error("introuvable : " + a.slice(0, 80)); s = s.replace(a, b); };

// En-tête
rep("<title>Ruff Agency Blueprint — v2</title>", "<title>Ruff Agency Blueprint — v3</title>");
rep("<!-- v2 (26/10/2026) : structure refaite selon R21 à R39 (feedback.md) et la", "<!-- v3 (27/10/2026) : v2 + R40 à R45 (footer sans bandeau d'appel, moins d'illustrations,\n     emplacements vidéo pour les exemples, H1 plus petit, flèche dans un tag, avis avec photo en ticker).\n     v2 (26/10/2026) : structure refaite selon R21 à R39 (feedback.md) et la");
rep("Généré depuis pages/src/blueprint-v2.src.html", "Généré depuis pages/src/blueprint-v3.src.html");

// R43 : H1 plus petit
rep(".bp-hero h1 { margin: 28px auto 0; max-width: 900px; font: 700 80px/1.04 var(--rf-font-title);", ".bp-hero h1 { margin: 28px auto 0; max-width: 820px; font: 700 64px/1.06 var(--rf-font-title);");
rep("    .bp-hero h1 { font-size: 64px; }\n", "    .bp-hero h1 { font-size: 56px; }\n");

// R44 : la flèche de défilement dans un tag avec ombre (comme les étiquettes du site)
rep(".bp-hint { margin-top: 6px; display: inline-flex; align-items: center; gap: 10px; text-decoration: none;", ".bp-hint { margin-top: 10px; display: inline-flex; align-items: center; gap: 10px; text-decoration: none; padding: 12px 18px; border-radius: 15px; background: #fff; border: .8px solid rgba(0, 0, 0, .15); box-shadow: var(--rf-shadow-card);");

// R41 : section problème sans illustration — titre à gauche, texte à droite
rep(`      <!-- CONCEPT : « la moyenne ». Objet central : une grille de six pages
           générées, construites pareil. Mécanique : l'uniforme (sans intrus). -->`, "");
s = s.replace(/      <div class="bp-same-wrap"[\s\S]*?\n      <\/div>\n    <\/div>\n    <div class="bp-conclusion"><p>Le problème/, `    </div>\n    <div class="bp-conclusion"><p>Le problème`);
rep(`        <h2 class="bp-h2" id="bp-h2-pb">Tout le monde utilise l'IA. Tout le monde obtient le même design.</h2>
        <p class="bp-intro">Demande à dix entreprises`, `        <h2 class="bp-h2" id="bp-h2-pb">Tout le monde utilise l'IA. Tout le monde obtient le même design.</h2>
      </div>
      <div>
        <p class="bp-intro" style="margin-top:0">Demande à dix entreprises`);

// R42 : trois niveaux = emplacements vidéo, même taille
const video = (lbl) => `<div class="bp-level__shot bp-level__video" role="img" aria-label="Emplacement vidéo : ${lbl}"><span class="bp-media__play"><svg class="ico"><use href="#hi-solid-play"/></svg></span><p class="bp-small bp-media__cap"><span class="bp-todo">[Vidéo : même contenu, ${lbl}]</span></p></div>`;
s = s.replace(/<div class="bp-level__shot" style="background:var\(--rf-tint-red\)"[\s\S]*?<\/div>\n        <div class="bp-level__head"><h3>Sans système/, video("sans système") + `\n        <div class="bp-level__head"><h3>Sans système`);
s = s.replace(/<div class="bp-level__shot" style="background:var\(--rf-tint-blue\)"[\s\S]*?<\/div>\n        <div class="bp-level__head"><h3>Blueprint gratuit/, video("avec le Blueprint gratuit") + `\n        <div class="bp-level__head"><h3>Blueprint gratuit`);
s = s.replace(/<div class="bp-level__shot" style="background:var\(--rf-tint-yellow\)"[\s\S]*?<\/div>\n        <div class="bp-level__head"><h3>Système sur mesure/, video("avec un système sur mesure") + `\n        <div class="bp-level__head"><h3>Système sur mesure`);
rep(`    <!-- CONCEPT : « même contenu, trois bases » (comparaison côte à côte). Trois
         maquettes du même site, de la plus générique à la plus construite. -->`, `    <!-- R42 : ce sont des exemples → emplacements vidéo (même contenu, trois bases), pas d'illustration. -->`);
rep(".bp-level__shot .rf-wire {", `.bp-level__video { display: grid; place-items: center; background: #e2e2e2; border: 8px solid #fff; box-shadow: 0 2.87px 7.18px rgba(0, 0, 0, .05), 0 12.93px 12.93px rgba(0, 0, 0, .04), 0 28.74px 17.24px rgba(0, 0, 0, .03), 0 50.29px 20.12px rgba(0, 0, 0, .01); }
  .bp-level__video .bp-media__play { width: 64px; height: 64px; }
  .bp-level__video .bp-media__play .ico { width: 26px; height: 26px; }
  .bp-level__video .bp-media__cap { bottom: 18px; }
  .bp-level__shot .rf-wire {`);

// R45 : « qui est derrière » — avis avec photo, en ticker
s = s.replace(/    <div class="bp-quotes">[\s\S]*?<\/div>\n  <\/div>\n<\/section>\n\n<!-- 10\. FAQ/, `  </div>
  <!-- R45 : avis réels avec photo, en ticker (pause au survol, arrêt si mouvement réduit). -->
  <div class="bp-ticker" aria-label="Avis clients">
    <div class="bp-ticker__track">
      <!--@REVIEWS--><!--@REVIEWS-->
    </div>
  </div>
</section>

<!-- 10. FAQ`);
rep(".bp-quotes { display: flex; flex-direction: column; gap: 16px; }", `.bp-ticker { margin-top: 72px; overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); }
  .bp-ticker__track { display: flex; gap: 16px; width: max-content; padding: 8px 0 48px; animation: bp-ticker 60s linear infinite; }
  .bp-ticker:hover .bp-ticker__track { animation-play-state: paused; }
  @keyframes bp-ticker { to { transform: translateX(calc(-50% - 8px)); } }
  .bp-review { width: 420px; flex: none; display: flex; flex-direction: column; justify-content: space-between; gap: 24px; }
  .bp-review__author { display: flex; align-items: center; gap: 14px; }
  .bp-review__author img { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; box-shadow: var(--rf-shadow-dir); }
  @media (prefers-reduced-motion: reduce) { .bp-ticker__track { animation: none; } .bp-ticker { overflow-x: auto; } }`);

// R40 : footer sans bandeau d'appel → plus besoin de place sous le formulaire
rep(".bp-final { padding-bottom: 360px; }", ".bp-final { padding-bottom: 142px; }");
rep("<!--@FOOTER-->", "<!--@FOOTER-SANS-CTA-->");
rep('action="blueprint-merci-v2.html"', 'action="blueprint-merci-v3.html"');
rep('location.href = "blueprint-merci-v2.html";', 'location.href = "blueprint-merci-v3.html";');
rep(`<!-- 12. FOOTER : composant réel du site (R21) ================================ -->`, `<!-- 12. FOOTER : composant réel du site, sans bandeau d'appel (R21, R40) ===== -->`);

// Le compteur du footer n'existe plus dans la variante sans bandeau : rien à faire, le script l'ignore.
fs.writeFileSync(f, s);
console.log("ok");
