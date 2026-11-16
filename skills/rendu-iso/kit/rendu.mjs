// rendu.mjs: the "web render" layer on top of the Anatomy iso kit.
// Light theme tokens, blue energy lines, light pools, LEDs, glass, step timeline,
// and the builders that turn a scene into an embeddable fragment or a standalone page.
import * as k from "./iso-kit.mjs";
import { fillet } from "./lathe.mjs";

// ---------------------------------------------------------------------------
// Palette. Every colour of a render lives here, as CSS custom properties on
// `.rendu`. Change `accent` to re-brand a render (default: electric blue).
// ---------------------------------------------------------------------------
export const PALETTES = {
  bleu: { a900: "#0a2f8f", a700: "#1546d6", a500: "#2f6bff", a400: "#5a8cff", a200: "#a9c4ff", a100: "#d7e4ff", a50: "#eef4ff" },
  cyan: { a900: "#063f5c", a700: "#0b6fa4", a500: "#1aa3e8", a400: "#4dbdf2", a200: "#a6def9", a100: "#d4effc", a50: "#edf8fe" },
  vert: { a900: "#0b4a2e", a700: "#11804c", a500: "#19b46a", a400: "#47cb8a", a200: "#a5e6c5", a100: "#d3f3e2", a50: "#edfaf3" },
  ambre: { a900: "#6b3a05", a700: "#b8650a", a500: "#f08c12", a400: "#f6a845", a200: "#fbd39e", a100: "#fde9cf", a50: "#fef6ec" },
};

export function paletteCss(name = "bleu") {
  const p = typeof name === "string" ? PALETTES[name] ?? PALETTES.bleu : name;
  return `--r-a900:${p.a900};--r-a700:${p.a700};--r-a500:${p.a500};--r-a400:${p.a400};--r-a200:${p.a200};--r-a100:${p.a100};--r-a50:${p.a50};`;
}

// ---------------------------------------------------------------------------
// CSS. Scoped under `.rendu`, so a fragment can be pasted into any site.
// ---------------------------------------------------------------------------
export const RENDU_CSS = `
.rendu{
  --anatomy-page:transparent;--anatomy-card:#fdfdfe;--anatomy-paper:#fdfdfe;--anatomy-face:#ffffff;--anatomy-top:#ffffff;
  --anatomy-shade-0:#d3d9e3;--anatomy-shade-1:#e0e5ec;--anatomy-shade-2:#eaedf2;--anatomy-shade-3:#f3f5f8;
  --anatomy-lit-top:#ffffff;--anatomy-lit-shade:#eef2f8;
  --anatomy-hi:#283040;--anatomy-mid:#7e8899;--anatomy-lo:#adb5c2;--anatomy-faint:#d2d8e0;--anatomy-lit:#0d1220;
  --anatomy-halo:#4a5a78;--anatomy-halo-opacity:.24;--anatomy-dot:#3a4352;
  --anatomy-blue:var(--r-a500);
  --r-bg-0:#ffffff;--r-bg-1:#eef1f6;--r-ink:#151a24;--r-muted:#7a8494;--r-rule:#dde2ea;
  --r-glass-0:#f4f8ff;--r-glass-1:#dfe8f6;--r-room:#eef1f6;
  position:relative;color:var(--r-ink);font-family:inherit;
}
.rendu *{box-sizing:border-box}
.rendu[data-bg="card"]{background:radial-gradient(120% 90% at 50% 38%,var(--r-bg-0) 0%,var(--r-bg-0) 38%,var(--r-bg-1) 100%);border-radius:22px;box-shadow:0 0 0 1px #0f172a0d,0 1px 2px #0f172a0a,0 12px 40px -12px #0f172a1f}
.rendu-stage{position:relative}
.rendu-stage .iso-svg{overflow:visible}
.rendu .iso-halo{filter:blur(12px)}
/* energy lines */
.rendu .nrg path,.rendu .r-own path{vector-effect:none}
.rendu .nrg path{fill:none;stroke-linecap:round;stroke-linejoin:round}
.rendu .nrg-bed-o{stroke:#c3ccd9}
.rendu .nrg-bed-i{stroke:#f6f8fb}
.rendu .nrg-aura{stroke:var(--r-a400);opacity:.2}
.rendu .nrg-halo{stroke:var(--r-a500);opacity:.7}
.rendu .nrg-body{stroke:var(--r-a500)}
.rendu .nrg-core{stroke:var(--r-a100)}
.rendu .nrg-pulse{stroke:#ffffff;opacity:0;transition:opacity .6s ease}
.rendu .nrg-on path{stroke-dasharray:calc(var(--len) * 1px) calc(var(--len) * 1px + 40px);stroke-dashoffset:calc(var(--len) * 1px);transition:stroke-dashoffset 0s linear .9s}
.rendu .nrg-on{opacity:0;transition:opacity .9s ease}
.rendu .nrg[data-on] .nrg-on{opacity:1;transition:opacity .25s ease var(--nrg-delay,0s)}
.rendu .nrg[data-on] .nrg-on path{stroke-dashoffset:0;transition:stroke-dashoffset var(--nrg-dur,1.4s) cubic-bezier(.5,0,.2,1) var(--nrg-delay,0s)}
.rendu .nrg[data-on] .nrg-pulse{opacity:.95;transition:opacity .8s ease calc(var(--nrg-delay,0s) + var(--nrg-dur,1.4s))}
.rendu .nrg-pulse{animation:r-run var(--nrg-speed,1.1s) linear infinite}
@keyframes r-run{to{stroke-dashoffset:calc(var(--per) * -1px)}}
.rendu .nrg-end{fill:#f6f8fb;stroke:#c3ccd9;transition:fill .5s ease,stroke .5s ease}
.rendu .nrg[data-on] .nrg-end{fill:var(--r-a100);stroke:var(--r-a500);transition-delay:calc(var(--nrg-delay,0s) + var(--nrg-dur,1.4s) * .8)}
/* things that light up */
.rendu .r-lit{opacity:0;transition:opacity .9s ease}
.rendu .r-lit[data-on]{opacity:1;transition:opacity 1.1s ease var(--r-delay,0s)}
.rendu .r-dim{opacity:1;transition:opacity .9s ease}
.rendu .r-dim[data-on]{opacity:0;transition:opacity 1.1s ease var(--r-delay,0s)}
.rendu .r-led{fill:#c8d0dc;transition:fill .5s ease}
.rendu .r-led[data-on]{fill:var(--r-a500);transition:fill .4s ease var(--r-delay,0s)}
.rendu .r-led-w[data-on]{fill:var(--r-a400)}
.rendu .r-tint{transition:fill .9s ease}
.rendu .r-glass{fill:url(#__ID__-glass)}
.rendu .r-reveal{fill:var(--anatomy-shade-1)}
.rendu .r-reveal-top{fill:var(--anatomy-shade-0)}
.rendu .r-room{fill:var(--r-room)}
.rendu .r-panel{fill:#d5e0f2;transition:fill 1.2s ease}
.rendu .r-panel[data-on]{fill:#b8cdf6;transition-delay:var(--r-delay,0s)}
.rendu .r-panel-cells{stroke:#9fb3d6;stroke-width:.35;fill:none;transition:stroke 1.2s ease}
.rendu .r-panel-cells[data-on]{stroke:var(--r-a400)}
.rendu .r-sweep{opacity:0}
.rendu .r-sweep[data-on]{animation:r-sweep 3.2s ease-in-out infinite;animation-delay:var(--r-delay,0s)}
@keyframes r-sweep{0%{opacity:0;transform:translate(var(--sx0),var(--sy0))}20%{opacity:.55}70%{opacity:.55}100%{opacity:0;transform:translate(var(--sx1),var(--sy1))}}
.rendu .r-move{transition:transform .5s cubic-bezier(.3,1.3,.5,1)}
.rendu .r-move[data-on]{transform:translate(var(--mx),var(--my));transition-delay:var(--r-delay,0s)}
.rendu .r-bar{fill:#d9dfe8;transition:fill .35s ease}
.rendu .r-bar[data-on]{fill:var(--r-a500)}
.rendu[data-paused] *{animation-play-state:paused!important}
/* steps bar */
.rendu-caption{display:flex;flex-direction:column;gap:18px;padding:0 6% 6%}
.rendu-title{margin:0;font-size:clamp(18px,2.2vw,24px);font-weight:600;letter-spacing:-.01em;color:var(--r-ink)}
.rendu-steps{display:grid;grid-template-columns:repeat(var(--n),1fr);gap:clamp(10px,2.4vw,28px);margin:0;padding:0;list-style:none}
.rendu-step{all:unset;cursor:pointer;display:flex;flex-direction:column;gap:10px;color:var(--r-muted);font-size:14px;font-weight:500;line-height:1.35;transition:color .4s ease}
.rendu-step:focus-visible{outline:2px solid var(--r-a400);outline-offset:6px;border-radius:2px}
.rendu-step-bar{position:relative;display:block;height:2px;border-radius:2px;background:var(--r-rule);overflow:hidden}
.rendu-step-bar::after{content:"";position:absolute;inset:0;transform-origin:left;transform:scaleX(0);background:var(--r-a500)}
.rendu-step[data-done] .rendu-step-bar::after{transform:scaleX(1)}
.rendu-step[data-active]{color:var(--r-ink)}
.rendu-step[data-active] .rendu-step-bar::after{animation:r-fill var(--hold,3s) linear forwards}
.rendu[data-hold] .rendu-step[data-active] .rendu-step-bar::after{animation:none;transform:scaleX(1)}
.rendu-step small{display:block;font-size:12.5px;font-weight:400;color:var(--r-muted)}
@keyframes r-fill{to{transform:scaleX(1)}}
@media (max-width:560px){.rendu-caption{padding:0 4% 6%}.rendu-step small{display:none}}
@media (prefers-reduced-motion:reduce){.rendu .nrg-pulse,.rendu .r-sweep[data-on]{animation:none}.rendu *{transition-duration:0s!important;transition-delay:0s!important}}
`;

// ---------------------------------------------------------------------------
// Scope. A page may hold several renders, so every SVG id is prefixed.
// ---------------------------------------------------------------------------
let SCOPE = "r";
let COUNT = 0;
export function scope(id) {
  SCOPE = id;
  COUNT = 0;
}
export const uid = (name) => `${SCOPE}-${name}-${++COUNT}`;
export const scopeId = () => SCOPE;

// Shared <defs>: glow filters, glass, light pools. Put it first in the SVG body.
export function defsSvg() {
  const id = SCOPE;
  return `<defs>
<filter id="${id}-glow" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="2.6"/></filter>
<filter id="${id}-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
<linearGradient id="${id}-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--r-glass-0);"/><stop offset=".55" style="stop-color:var(--r-glass-1);"/><stop offset="1" style="stop-color:var(--r-glass-0);"/></linearGradient>
<radialGradient id="${id}-pool"><stop offset="0" style="stop-color:var(--r-a400);stop-opacity:.55"/><stop offset=".45" style="stop-color:var(--r-a400);stop-opacity:.2"/><stop offset="1" style="stop-color:var(--r-a400);stop-opacity:0"/></radialGradient>
<radialGradient id="${id}-warm"><stop offset="0" stop-color="#ffffff" stop-opacity="1"/><stop offset=".3" style="stop-color:var(--r-a100);stop-opacity:.8"/><stop offset="1" style="stop-color:var(--r-a100);stop-opacity:0"/></radialGradient>
<radialGradient id="${id}-dot"><stop offset="0" style="stop-color:var(--r-a500);stop-opacity:.9"/><stop offset="1" style="stop-color:var(--r-a500);stop-opacity:0"/></radialGradient>
<linearGradient id="${id}-sheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".85"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
</defs>`;
}

const tenth = (v) => (Math.round(v * 10) / 10).toString();
const screenLength = (pts) => pts.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

// ---------------------------------------------------------------------------
// Energy line: a white conduit that a blue current runs through.
// points3: 3D polyline in world units (legs along the structure, as in craft.md).
// step: the timeline step that powers it. delay/dur in seconds inside that step.
// width: line weight in screen units (1 = a cable, 1.6 = a feeder, 2.2 = a busbar).
// radius: corner fillet in world units (0 for sharp corners).
// ends: "both" | "from" | "to" | "none" terminal dots.
// ---------------------------------------------------------------------------
export function energySvg(points3, P, { step = 0, delay = 0, dur = 1.4, width = 1.3, radius = 5, ends = "both", speed = 1.1, bed = true, only = false } = {}) {
  const route = radius ? fillet(points3, radius, 8) : points3;
  const flat = route.map((p) => k.iso(p, P));
  const d = k.pathOf(flat);
  const len = screenLength(flat);
  const dash = Math.max(3, width * 4);
  const per = dash + Math.max(26, width * 26);
  const w = (m) => tenth(width * m);
  const end = ([x, y]) => `<circle class="nrg-end" cx="${tenth(x)}" cy="${tenth(y)}" r="${w(1.25)}" stroke-width="${w(0.45)}"/>`;
  const dots = [];
  if (ends === "both" || ends === "from") dots.push(end(flat[0]));
  if (ends === "both" || ends === "to") dots.push(end(flat[flat.length - 1]));
  return `<g class="nrg" data-step="${step}"${only ? " data-only" : ""} style="--len:${len.toFixed(1)};--per:${per.toFixed(1)};--nrg-delay:${delay}s;--nrg-dur:${dur}s;--nrg-speed:${speed}s">`
    + (bed ? `<path class="nrg-bed-o" d="${d}" stroke-width="${w(2.5)}"/><path class="nrg-bed-i" d="${d}" stroke-width="${w(1.5)}"/>` : "")
    + `<g class="nrg-on"><path class="nrg-aura" d="${d}" stroke-width="${w(12)}" filter="url(#${SCOPE}-soft)"/><path class="nrg-halo" d="${d}" stroke-width="${w(5.5)}" filter="url(#${SCOPE}-glow)"/><path class="nrg-body" d="${d}" stroke-width="${w(1.9)}"/><path class="nrg-core" d="${d}" stroke-width="${w(0.7)}"/></g>`
    + `<path class="nrg-pulse" d="${d}" stroke-width="${w(0.9)}" stroke-dasharray="${dash.toFixed(1)} ${(per - dash).toFixed(1)}"/>`
    + dots.join("")
    + `</g>`;
}

// Wrap any markup so it fades in (r-lit) or out (r-dim) at a step.
export const litSvg = (markup, step, { delay = 0, only = false, dim = false } = {}) =>
  `<g class="${dim ? "r-dim" : "r-lit"}" data-step="${step}"${only ? " data-only" : ""}${delay ? ` style="--r-delay:${delay}s"` : ""}>${markup}</g>`;

// Markup that slides by a world vector when its step comes on (a breaker lever, a door, a plug).
export function moveSvg(markup, step, by, P, { delay = 0, only = false } = {}) {
  const [mx, my] = k.axisVector(P, by);
  return `<g class="r-move" data-step="${step}"${only ? " data-only" : ""} style="--mx:${tenth(mx)}px;--my:${tenth(my)}px;--r-delay:${delay}s">${markup}</g>`;
}

// A pool of light on the floor (z plane), an axis-aligned ellipse on screen.
export function poolSvg([x, y, z], radius, P, { step = 0, delay = 0, gradient = "pool", squash = 1 } = {}) {
  const [cx, cy] = k.iso([x, y, z], P);
  const { k: s, sinE } = k.cameraOf(P);
  return litSvg(`<ellipse cx="${tenth(cx)}" cy="${tenth(cy)}" rx="${tenth(radius * s)}" ry="${tenth(radius * s * sinE * squash)}" fill="url(#${SCOPE}-${gradient})"/>`, step, { delay });
}

// A glow on a wall. face "x": the wall x = at (points [at, a, z]); face "y": the wall y = at.
export function wallGlowSvg(face, at, a, z, radius, P, { step = 0, delay = 0, gradient = "pool" } = {}) {
  const m = face === "x" ? k.sideMatrix([at, a], z, P, "right") : k.sideMatrix([a, at], z, P, "left");
  return litSvg(`<g transform="${m}"><circle r="${radius}" fill="url(#${SCOPE}-${gradient})"/></g>`, step, { delay });
}

// A status LED: a dot that turns accent blue with a small halo.
export function ledSvg(point, P, { step = 0, delay = 0, size = 0.9, halo = 4 } = {}) {
  const [cx, cy] = k.iso(point, P);
  const s = k.cameraOf(P).k;
  const style = delay ? ` style="--r-delay:${delay}s"` : "";
  return `${litSvg(`<circle cx="${tenth(cx)}" cy="${tenth(cy)}" r="${tenth(size * halo * s)}" fill="url(#${SCOPE}-dot)"/>`, step, { delay })}<circle class="r-led" data-step="${step}"${style} cx="${tenth(cx)}" cy="${tenth(cy)}" r="${tenth(size * s * 0.62)}"/>`;
}

// ---------------------------------------------------------------------------
// Faces. Walls are named by the axis they are perpendicular to.
// With the default camera (azimuth 45) the walls you see are x = max (lower right)
// and y = max (lower left). `wallPt` turns (along, z) on a wall into a world point.
// ---------------------------------------------------------------------------
export const wallPt = (face, at, a, z) => (face === "x" ? [at, a, z] : [a, at, z]);
export const quad = (face, at, a0, a1, z0, z1) => [wallPt(face, at, a0, z0), wallPt(face, at, a1, z0), wallPt(face, at, a1, z1), wallPt(face, at, a0, z1)];
export const poly3 = (points, P, closed = true) => k.pathOf(points.map((p) => k.iso(p, P)), closed);

// A window or glazed opening set into a wall, with its reveal, glass, frame, mullions
// and whatever is behind it (`inside`, markup drawn in world space and clipped to the opening).
// sign: +1 when the wall faces +x/+y (the visible walls), so "inward" is -sign.
export function windowSvg(face, at, a0, a1, z0, z1, P, { depth = 3, frame = 1.2, mullions = [], transoms = [], inside = "", sign = 1, sill = true, glass = true, tone = "mid" } = {}) {
  const inner = at - sign * depth;
  const O = poly3(quad(face, at, a0, a1, z0, z1), P);
  const I = poly3(quad(face, inner, a0, a1, z0, z1), P);
  const clip = uid("win");
  const lines = [];
  const glassAt = inner + sign * 0.2;
  for (const m of mullions) lines.push(poly3([wallPt(face, glassAt, m, z0), wallPt(face, glassAt, m, z1)], P, false));
  for (const t of transoms) lines.push(poly3([wallPt(face, glassAt, a0, t), wallPt(face, glassAt, a1, t)], P, false));
  // top reveal: the soffit you see when looking up under the lintel (never visible from above), so we shade the head jamb instead
  const head = poly3([wallPt(face, at, a0, z1), wallPt(face, at, a1, z1), wallPt(face, inner, a1, z1), wallPt(face, inner, a0, z1)], P);
  const side = face === "x"
    ? poly3([wallPt(face, at, a0, z0), wallPt(face, at, a0, z1), wallPt(face, inner, a0, z1), wallPt(face, inner, a0, z0)], P)
    : poly3([wallPt(face, at, a0, z0), wallPt(face, at, a0, z1), wallPt(face, inner, a0, z1), wallPt(face, inner, a0, z0)], P);
  const sheen = poly3([wallPt(face, glassAt, a0 + (a1 - a0) * 0.12, z1), wallPt(face, glassAt, a0 + (a1 - a0) * 0.3, z1), wallPt(face, glassAt, a0 + (a1 - a0) * 0.05, z0 + (z1 - z0) * 0.25), wallPt(face, glassAt, a0 - (a1 - a0) * 0.13, z0 + (z1 - z0) * 0.25)], P);
  const out = [];
  out.push(`<clipPath id="${clip}"><path d="${O}"/></clipPath>`);
  out.push(`<g clip-path="url(#${clip})">`);
  out.push(`<path class="r-room" d="${O}"/>`);
  out.push(inside);
  if (glass) out.push(`<path class="r-glass" d="${I}" opacity=".38"/><path d="${sheen}" fill="#ffffff" opacity=".4"/>`);
  out.push(`<path class="r-reveal" d="${side}"/><path class="r-reveal-top" d="${head}"/>`);
  if (lines.length) out.push(k.lineSvg(lines.join(""), { tone }));
  out.push(k.lineSvg(I, { tone: "lo" }));
  out.push(`</g>`);
  out.push(k.lineSvg(O, { tone }));
  if (frame) out.push(k.lineSvg(poly3(quad(face, at, a0 + frame, a1 - frame, z0 + frame, z1 - frame).map((p) => p), P), { tone: "faint" }));
  if (sill) {
    const plan = face === "x" ? { x: at - 0.5, y: a0 - 1.5, w: 3, d: a1 - a0 + 3, r: 0.4 } : { x: a0 - 1.5, y: at - 0.5, w: a1 - a0 + 3, d: 3, r: 0.4 };
    out.push(k.solidSvg(k.slabOf(plan, z0 - 1.4, 1.4, P, 2), { tone }));
  }
  return out.join("");
}

// ---------------------------------------------------------------------------
// Timeline runtime, inlined into the page. Elements carry data-step="n":
// they are on from step n onwards (or only during n with data-only).
// The loop: step 0 → 1 → … → last (held) → rest (all off) → again.
// ---------------------------------------------------------------------------
export const RUNTIME = `
(function(root,cfg){
  if(!root)return;
  var steps=cfg.steps,els=[].slice.call(root.querySelectorAll('[data-step]')),tabs=[].slice.call(root.querySelectorAll('[data-tab]'));
  var still=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cur=-2,timer=0,visible=false,auto=true,idle=0;
  function set(n){cur=n;root.setAttribute('data-stage',String(n));
    els.forEach(function(e){var s=+e.getAttribute('data-step'),only=e.hasAttribute('data-only');var on=n>=0&&(only?s===n:s<=n);if(on)e.setAttribute('data-on','');else e.removeAttribute('data-on');});
    tabs.forEach(function(t,i){t.toggleAttribute('data-active',i===n);t.toggleAttribute('data-done',i<n);t.setAttribute('aria-pressed',i===n?'true':'false');t.style.setProperty('--hold',(steps[i].hold||3000)+'ms');});}
  function next(){clearTimeout(timer);if(!visible||!auto)return;var n=cur+1;
    if(n>=steps.length){set(-1);timer=setTimeout(next,cfg.rest||1300);return;}
    set(n);timer=setTimeout(next,steps[n].hold||3000);}
  function go(n){clearTimeout(timer);clearTimeout(idle);auto=false;root.setAttribute('data-hold','');set(n);
    idle=setTimeout(function(){auto=true;root.removeAttribute('data-hold');timer=setTimeout(next,steps[n].hold||3000);},cfg.resume||9000);}
  tabs.forEach(function(t,i){t.addEventListener('click',function(){go(i);});});
  if(still){set(steps.length-1);root.setAttribute('data-hold','');return;}
  if(!('IntersectionObserver' in window)){visible=true;set(-1);timer=setTimeout(next,500);return;}
  new IntersectionObserver(function(es){var v=es[es.length-1].isIntersecting;
    if(v===visible)return;visible=v;
    if(v){root.removeAttribute('data-paused');if(cur<-1){set(-1);}if(auto)timer=setTimeout(next,cur<0?500:(steps[cur]&&steps[cur].hold)||2000);}
    else{root.setAttribute('data-paused','');clearTimeout(timer);}},{threshold:.25}).observe(root);
})(document.getElementById(__ROOT__),__CFG__);
`;

// ---------------------------------------------------------------------------
// Builders
// ---------------------------------------------------------------------------
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// The render as one self-contained block: <div class="rendu"> + <style> + <script>.
// Paste it into any HTML embed (Webflow, Framer embed, WordPress, Shopify...).
export function renderHtml({ id, svg, steps = [], title = "", caption = true, bg = "card", palette = "bleu", rest = 1300, resume = 9000 }) {
  const tabs = steps.length && caption
    ? `<div class="rendu-caption">${title ? `<p class="rendu-title">${esc(title)}</p>` : ""}<div class="rendu-steps" style="--n:${steps.length}" role="group" aria-label="Étapes">${steps
        .map((s, i) => `<button type="button" class="rendu-step" data-tab="${i}" aria-pressed="false"><span class="rendu-step-bar"></span><span>${esc(s.label)}${s.text ? `<small>${esc(s.text)}</small>` : ""}</span></button>`)
        .join("")}</div></div>`
    : "";
  const css = (k.ISO_CSS + RENDU_CSS).replace(/__ID__/g, id).replace(/\s*\n\s*/g, "");
  const cfg = JSON.stringify({ steps: steps.map((s) => ({ hold: s.hold ?? 3200 })), rest, resume });
  const script = RUNTIME.replace("__ROOT__", JSON.stringify(id)).replace("__CFG__", cfg);
  return `<div class="iso rendu" id="${id}" data-theme="light" data-bg="${bg}" style="${paletteCss(palette)}"><style>${css}</style><div class="rendu-stage">${svg}</div>${tabs}<script>${script}</script></div>`;
}

// A standalone page around one render, for previews, iframes and screenshots.
export function pageHtml({ title, render, width = 1100, background = "#f7f8fa" }) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title>`
    + `<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&display=swap" rel="stylesheet">`
    + `<style>html,body{margin:0;background:${background}}body{font-family:Jost,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}main{width:min(${width}px,100% - 32px);margin:48px auto 72px}</style></head>`
    + `<body><main>${render}</main></body></html>`;
}
