// Système sur mesure v3 (27/10/2026) : v2 + R54 et R55.
// R54 : l'appel final n'a pas forcément le dégradé bleu.
// R55 : quand l'appel est « réserver un appel », la dernière section intègre
// directement l'agenda Cal.com du site (ruffagency/discovery-call) à la place du bouton ;
// les boutons plus haut dans la page descendent jusqu'à cet agenda.
// Usage : node make-ssm-v3.mjs <v2.src.html> <v3.src.html>
import fs from "node:fs";
const [inp, out] = process.argv.slice(2);
let s = fs.readFileSync(inp, "utf8");
const rep = (a, b) => { if (!s.includes(a)) throw new Error("introuvable : " + a.slice(0, 90)); s = s.replace(a, b); };

rep("<title>Système sur mesure — v2</title>", "<title>Système sur mesure — v3</title>");

// Appel final : fond blanc, titre à gauche, agenda Cal.com intégré (R54, R55). Pas de formes :
// l'agenda occupe la largeur, elles passeraient derrière (R48).
s = s.replace(/<!-- 11\. APPEL FINAL[\s\S]*?<\/section>/, `<!-- 11. APPEL FINAL : fond blanc (R54), agenda Cal.com intégré à la place du bouton (R55). Footer sans bandeau (R40). -->
<section class="bp-sec bp-sec--white bp-book" id="reserver" aria-labelledby="bp-h2-final">
  <div class="bp-wrap bp-center">
    <h2 class="bp-h2" id="bp-h2-final">Donne à ton IA une base que personne d'autre n'a.</h2>
    <p class="bp-intro">Choisis un créneau de 30 minutes. On regarde ta marque ensemble, on te présente l'audit de ton site, et on te dit ce qu'on construirait pour toi.</p>
    <div class="bp-reassure bp-reassure--center"><span><svg class="ico"><use href="#hi-outline-phone"/></svg>Appel de 30 minutes</span><i aria-hidden="true"></i><span><svg class="ico"><use href="#hi-outline-magnifying-glass"/></svg>Audit de ton site offert</span></div>
  </div>
  <div class="bp-cal" aria-label="Choisir un créneau pour ton appel"><div id="my-cal-inline-discovery-call"></div></div>
</section>`);

// Les autres boutons « Réserver un appel » descendent jusqu'à l'agenda.
s = s.split('href="https://ruff.agency/30-min"').join('href="#reserver"');

// Styles v3
rep("</style>", `  /* ---------- v3 (R54, R55) ---------- */
  html { scroll-behavior: smooth; }
  .bp-book { padding-bottom: 96px; }
  .bp-book .bp-h2 { max-width: 900px; margin-inline: auto; }
  .bp-book .bp-intro { max-width: 720px; margin-inline: auto; }
  .bp-reassure--center { justify-content: center; margin-top: 28px; }
  /* Même réglage que components/sections/CallBooking/CallBooking.css */
  .bp-cal { max-width: 1054px; min-height: 665px; margin: 48px auto 0; padding: 0 24px; }
  .bp-cal > div { height: 665px; overflow: visible; width: 100%; }
  .bp-cal > div > cal-inline { height: 760px !important; margin-top: -95px; }
  @media (max-width: 809px) {
    .bp-book { padding-bottom: 64px; }
    .bp-cal { min-height: 680px; padding: 0; }
    .bp-cal > div, .bp-cal > div > cal-inline { height: 680px !important; }
  }
</style>`);

// Script d'intégration Cal.com, identique à CallBooking.tsx (sans le suivi analytique du site).
rep("</body>", `<script>
(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return api; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", "discovery-call", { origin: "https://app.cal.com" });
Cal.ns["discovery-call"]("inline", { elementOrSelector: "#my-cal-inline-discovery-call", config: { layout: "month_view", locale: "fr", useSlotsViewOnSmallScreen: "true" }, calLink: "ruffagency/discovery-call" });
Cal.ns["discovery-call"]("ui", { hideEventTypeDetails: false, layout: "month_view" });
</script>
</body>`);

fs.writeFileSync(out, s);
console.log("ok", out);
