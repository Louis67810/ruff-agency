// Carrousel IA sur ton site, v2 : structure de rétention reprise du tuto envoyé par Louis (R23).
// Hook → interruption → enjeu → deuxième hook + teasing → sommaire → 1 idée par slide avec exemple → merci → offre.
// 3 stratégies (résumé IA retiré), l'agent en dernier. Part des slides de la v1, retouches de Louis comprises.
import fs from 'node:fs';
import { fw, close } from '../../outils/fw.mjs';
import { C, SHADOW_CARD, rect, frame, text, info, hug, tag, badge, cloneScaled } from '../../outils/kit.mjs';

const W = 575, N = 10;
const NB = ' ';
const COVER = '5486:6188', FAQ = '5485:5814', CTA = '5485:6037', AGENT = '5485:5883', OFFRE = '5485:6138';
const TXT = '5406:3302', FIN = '5478:4139', HAND = '5480:1574';
const { nodeId: SEC } = await fw('create_section', { name: 'Claude — Carrousel IA sur ton site (v2)', x: 59000, y: -81650, width: N * 625 + 150, height: 1000 });
const slides = [];
async function slide(src, name) {
  const { nodeId } = await fw('clone_node', { nodeId: src });
  await fw('reparent_nodes', { nodeIds: [nodeId], newParentId: SEC });
  await fw('set_position', { nodeId, x: 100 + slides.length * 625, y: 150 });
  await fw('rename_node', { nodeId, name: String(slides.length + 1).padStart(2, '0') + ' ' + name });
  slides.push(nodeId);
  return nodeId;
}
async function tree(id, depth = 6) {
  const r = await fw('get_design_context', { nodeId: id, detail: 'minimal', depth });
  const out = [];
  const walk = (n, d) => { out.push({ ...n, d }); (n.children || []).forEach((c) => walk(c, d + 1)); };
  r.nodes[0].children.forEach((c) => walk(c, 1));
  return out;
}
const top = async (id) => (await tree(id, 1)).filter((n) => n.d === 1);
const firstText = async (id) => (await tree(id)).find((n) => n.type === 'TEXT');
async function at(id, x, y) { await fw('set_position', { nodeId: id, x, y }); return id; }
const rgb = (h) => { const n = parseInt(h.slice(1), 16); return { r: (n >> 16 & 255) / 255, g: (n >> 8 & 255) / 255, b: (n & 255) / 255 }; };
async function setCart(frameId, label, px, py) {
  const t = await firstText(frameId);
  await fw('set_text', { nodeId: t.id, characters: label });
  await fw('set_text_properties', { nodeId: t.id, textAutoResize: 'WIDTH_AND_HEIGHT' });
  await hug(frameId, { px, py });
  return info(frameId);
}
async function pill(frameId, label, y) {
  const t = await firstText(frameId);
  await fw('set_text', { nodeId: t.id, characters: label });
  await fw('set_auto_layout', { nodeId: frameId, layoutMode: 'HORIZONTAL', paddingLeft: 25, paddingRight: 10, paddingTop: 9, paddingBottom: 9, itemSpacing: 26, primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER' });
  await fw('set_layout_props', { nodeId: frameId, layoutSizingHorizontal: 'HUG', layoutSizingVertical: 'HUG' });
  const p = await info(frameId);
  await at(frameId, (W - p.width) / 2, y ?? p.y);
}
// Grand texte éditorial, mêmes réglages que le corps des slides texte de Louis (5478:4168).
const big = (p, s, y, size = 34.5) => text(p, s, { x: 71, y, size, w: 451, lh: 126, color: C.ink });
const bar = (p, x, y, w, h = 6) => rect(p, { x, y, w, h, r: h / 2, fill: rgb('#E8E8E8') });
async function miniSite(p, x, y) {
  const s = await frame(p, { x, y, w: 216, h: 196, r: 14, fill: C.white, stroke: { color: rgb('#000000'), a: 0.08 }, effects: SHADOW_CARD, name: 'Site' });
  await rect(s, { x: 12, y: 12, w: 20, h: 6, r: 3, fill: rgb('#383838') });
  await bar(s, 118, 13, 22, 4); await bar(s, 146, 13, 22, 4);
  await rect(s, { x: 174, y: 10, w: 30, h: 10, r: 5, fill: rgb('#383838') });
  await rect(s, { x: 38, y: 36, w: 140, h: 10, r: 5, fill: rgb('#0D1E26') });
  await rect(s, { x: 56, y: 51, w: 104, h: 10, r: 5, fill: rgb('#0D1E26') });
  await bar(s, 58, 70, 100, 5); await bar(s, 72, 79, 72, 5);
  await rect(s, { x: 84, y: 92, w: 48, h: 12, r: 6, fill: rgb('#383838') });
  await rect(s, { x: 16, y: 116, w: 184, h: 66, r: 8, fill: rgb('#F3F3F3') });
  return s;
}

// ---------- 01 Hook : la couverture de Louis, seule la pilule change de nombre
{
  const S = await slide(COVER, 'Hook');
  const k = await top(S);
  await pill(k.find((c) => c.name === 'Frame 4417').id, 'Voici les 3 stratégies');
}

// ---------- 02 Interruption + ce que le lecteur croit savoir
{
  const S = await slide(TXT, 'Minute papillon');
  const k = await top(S);
  const c = await setCart(k.find((x) => x.name === 'Frame 4260').id, 'Minute papillon', 18, 12);
  await at(k.find((x) => x.name === 'Frame 4260').id, 62, 84);
  await fw('delete_nodes', { nodeIds: [k.find((x) => x.type === 'TEXT' && x.name.startsWith('La plupart')).id, k.find((x) => x.name === 'Frame 4417').id] });
  const ty = 84 + c.height + 14;
  const t = await big(S, 'Claude ne sert pas qu’à créer ton site.', ty);
  const y0 = ty + (await info(t)).height + 22;
  const a = await miniSite(S, 62, y0), b = await miniSite(S, 298, y0);
  await badge(S, 'check', { x: 490, y: y0 - 11, size: 32 });
  await cloneScaled('5480:1575', b, 0.62, { x: 150, y: 128 });
  await text(S, 'Beaucoup s’en servent pour créer plus vite', { x: 62, y: y0 + 208, size: 17, w: 216, lh: 125, color: C.ink });
  await text(S, 'Très peu pour aider le visiteur à décider', { x: 298, y: y0 + 208, size: 17, w: 216, lh: 125, color: C.blue });
  void a;
}

// ---------- 03 L'enjeu : ce que veut le visiteur, une ligne par cartouche
{
  const S = await slide(FIN, 'Ce que veut le visiteur');
  const k = await top(S);
  const b = k.find((c) => c.type === 'TEXT' && c.name.startsWith('Un seul')).id;
  await fw('set_text', { nodeId: b, characters: `Et ton visiteur, lui, veut${NB}:` });
  await at(b, 71, 96);
  await fw('delete_nodes', { nodeIds: [k.find((c) => c.name === 'Frame 4417').id] });
  let y = 170;
  for (const [i, l] of ['Savoir si c’est fait pour lui', 'Une réponse à ses questions', 'Décider sans chercher partout'].entries()) {
    const { nodeId } = await fw('clone_node', { nodeId: '5406:3320' });
    await fw('reparent_nodes', { nodeIds: [nodeId], newParentId: S });
    const t = await firstText(nodeId);
    await fw('set_text_properties', { nodeId: t.id, fontSize: 27 });
    const ci = await setCart(nodeId, l, 18, 13);
    await at(nodeId, 62 + i * 16, y);
    y += ci.height + 16;
  }
  const { nodeId: h } = await fw('clone_node', { nodeId: HAND });
  await fw('reparent_nodes', { nodeIds: [h], newParentId: S });
  await at(h, 352, 395);
}

// ---------- 04 Deuxième hook + teasing (décor de la couverture : cerveau et sites)
{
  const S = await slide(COVER, 'Deuxième hook');
  const k = await top(S);
  await fw('delete_nodes', { nodeIds: k.filter((c) => ['Frame 4415', 'Frame 2147261302', 'Frame 4214'].includes(c.name) || (c.type === 'TEXT' && c.name.startsWith('de ton site'))).map((c) => c.id) });
  await big(S, 'Créer ton site avec Claude, tu sais déjà faire.\n\nMaintenant, voici comment il aide tes visiteurs à décider.', 84, 30);
  await pill(k.find((c) => c.name === 'Frame 4417').id, 'La dernière est la meilleure');
  for (const c of k.filter((c) => c.name === 'Site' || c.name.startsWith('image 1800'))) { const n = await info(c.id); await at(c.id, n.x, n.y + 42); }
}

// ---------- 05 Sommaire : touches numérotées + cartouches bleus, tag de teasing sur la dernière
{
  const S = await slide(TXT, 'Sommaire');
  const k = await top(S);
  const cf = k.find((x) => x.name === 'Frame 4260').id;
  const c = await setCart(cf, 'Les 3 stratégies', 18, 12);
  await at(cf, 62, 84);
  await fw('delete_nodes', { nodeIds: [k.find((x) => x.type === 'TEXT' && x.name.startsWith('La plupart')).id, k.find((x) => x.name === 'Frame 4417').id] });
  const rows = ['Une FAQ automatique', `Est-ce fait pour moi${NB}?`, 'Un agent qui répond'];
  let y = 84 + c.height + 42;
  for (const [i, l] of rows.entries()) {
    const { nodeId: key } = await fw('clone_node', { nodeId: '5485:5902' });
    const { nodeId: bl } = await fw('clone_node', { nodeId: '5485:5906' });
    await fw('reparent_nodes', { nodeIds: [key, bl], newParentId: S });
    await fw('set_text', { nodeId: (await firstText(key)).id, characters: String(i + 1) });
    const b = await setCart(bl, l, 18, 17.5);
    await at(key, 79, y); await at(bl, 154, y);
    if (i === 2) {
      const tg = await tag(S, 'La meilleure', { x: 0, y: 0, s: 1.25 });
      const ti = await info(tg);
      await at(tg, 154 + b.width - ti.width + 12, y - ti.height / 2 + 2);
    }
    y += b.height + 62;
  }
}

// ---------- 06-08 Une idée par slide, l'exemple d'abord : texte réduit à l'essentiel, numéros repris
async function strategie(src, num, nom, startText, phrase) {
  const S = await slide(src, nom);
  const all = await tree(S);
  const k = all.filter((n) => n.d === 1);
  await fw('set_text', { nodeId: (await firstText(k.find((n) => n.name === 'Frame 4422').id)).id, characters: String(num) });
  await fw('set_text', { nodeId: k.find((n) => n.type === 'TEXT' && n.name.startsWith(startText)).id, characters: phrase });
  return { S, all, k };
}
await strategie(FAQ, 1, 'Une FAQ automatique', 'Les questions', 'Les questions de tes visiteurs deviennent une FAQ, sans que tu l’écrives.');
await strategie(CTA, 2, 'Est-ce fait pour moi', 'Le visiteur', 'Le visiteur demande à une personne ou à une IA si ton service lui correspond.');
{
  const { S, k } = await strategie(AGENT, 3, 'Un agent qui répond', 'Un agent', 'Le visiteur pose sa question sur ta page, et l’agent l’aide à choisir.');
  const il = await info(k.find((n) => n.name.startsWith('Illustration')).id);
  const tg = await tag(S, 'La meilleure', { x: 0, y: 0, s: 1.25 });
  const ti = await info(tg);
  await at(tg, il.x + il.width - ti.width + 8, il.y - ti.height / 2 + 2);
}

// ---------- 09 Merci + question en commentaire
{
  const S = await slide(FIN, 'Merci d’avoir lu');
  const k = await top(S);
  await fw('set_text', { nodeId: k.find((c) => c.type === 'TEXT' && c.name.startsWith('Un seul')).id, characters: `Merci d’avoir lu\njusqu’à la fin.\n\nLaquelle tu ajouterais en premier sur ton site${NB}?` });
  await pill(k.find((c) => c.name === 'Frame 4417').id, 'Dis-le-moi en commentaire', 470);
}

// ---------- 10 Offre
await slide(OFFRE, 'Merci');

fs.writeFileSync(new URL('./slides-v2.json', import.meta.url), JSON.stringify({ section: SEC, slides }, null, 1));
console.log('section', SEC, slides.length);
close();
