// v2 : retours de Louis du 2026-10-20 appliqués à la copie de la section (5411:11358).
import { fw, close } from '../../outils/fw.mjs';
import { C, SHADOW_CARD, rect, frame, text, info, sourceCTA, tag, badge, arrow } from '../../outils/kit.mjs';

const card = (p, o) => frame(p, { r: 16, stroke: { color: { r: 0, g: 0, b: 0 }, a: 0.1 }, effects: SHADOW_CARD, ...o });
const label = (p, s, x, y, size = 12) => text(p, s, { x, y, size, family: 'Inter', style: 'Semi Bold', color: C.greyText, ls: 0 });
const field = async (p, x, y, w, h, value, filled = false) => {
  await rect(p, { x, y, w, h, r: 8, fill: { r: 0.97, g: 0.97, b: 0.97 }, stroke: { color: C.greyLine } });
  await text(p, value, { x: x + 12, y: y + (h - 17) / 2, size: 13, family: 'Inter', style: 'Medium', color: filled ? C.ink : { r: 0.68, g: 0.68, b: 0.68 }, ls: 0 });
};
const option = async (p, x, y, w, s, sel) => {
  await rect(p, { x, y, w, h: 36, r: 10, fill: sel ? C.blueSoft : C.white, stroke: { color: sel ? C.blue : C.greyLine }, strokeW: sel ? 1.8 : 1 });
  await text(p, s, { x: x + 14, y: y + 9.5, size: 14, family: 'Inter', style: 'Medium', color: sel ? C.blue : C.ink, ls: 0 });
};
const bar = async (p, x, y, w, ratio, h = 7) => {
  await rect(p, { x, y, w, h, r: h / 2, fill: C.grey });
  await rect(p, { x, y, w: w * ratio, h, r: h / 2, fill: C.blue });
};
const kids = async (id) => (await fw('get_design_context', { nodeId: id, detail: 'minimal', depth: 1 })).nodes[0].children;

// ---------- 01 Couverture : trois cartes serrées, la première couvre davantage ; main visible et plus centrale.
{
  const S = '5411:11359';
  await fw('delete_nodes', { nodeIds: ['5411:11360', '5411:11372'] });
  const c3 = await card(S, { x: 92, y: 350, w: 270, h: 300, name: 'Carte 3 — arrière' });
  await rect(c3, { x: 18, y: 18, w: 90, h: 9, r: 4.5, fill: C.grey });
  for (let i = 0; i < 4; i++) await rect(c3, { x: 18, y: 46 + i * 40, w: 234, h: 28, r: 8, fill: { r: 0.97, g: 0.97, b: 0.97 }, stroke: { color: C.greyLine } });
  await fw('rotate_nodes', { nodeIds: [c3], rotation: 10 });
  const c2 = await card(S, { x: 128, y: 330, w: 280, h: 300, name: 'Carte 2 — coordonnées' });
  await label(c2, 'Étape 2 sur 2', 18, 16, 11);
  await bar(c2, 18, 36, 244, 1);
  for (const [i, l] of ['Prénom', 'E-mail', 'Téléphone', 'Entreprise'].entries()) await field(c2, 18, 58 + i * 42, 244, 32, l);
  await fw('rotate_nodes', { nodeIds: [c2], rotation: 5 });
  const c1 = await card(S, { x: 168, y: 300, w: 300, h: 330, r: 18, name: 'Carte 1 — question' });
  await label(c1, 'Étape 1 sur 2', 20, 18, 11);
  await bar(c1, 20, 38, 260, 0.5);
  await text(c1, 'Quel est ton objectif ?', { x: 20, y: 60, size: 19 });
  await option(c1, 20, 100, 260, 'Plus de demandes', true);
  await option(c1, 20, 146, 260, 'Vendre en ligne', false);
  await option(c1, 20, 192, 260, 'Lancer mon site', false);
  await sourceCTA(c1, 'Continuer', { x: 20, y: 248, s: 0.48 });
  await fw('reorder_nodes', { nodeIds: [c3], index: 0 });
  await fw('reorder_nodes', { nodeIds: [c2], index: 1 });
  await fw('reorder_nodes', { nodeIds: [c1], index: 2 });
  await fw('reorder_nodes', { nodeIds: ['5411:11385'], index: 3 });
  // main : pointe sur la fin du libellé choisi, silhouette visible aux 4/5
  await fw('set_position', { nodeId: '5411:11413', x: 290, y: 334 });
  // pilule noire ajustée à son texte et centrée
  const pk = await kids('5411:11405');
  await fw('set_auto_layout', { nodeId: '5411:11405', layoutMode: 'HORIZONTAL', paddingLeft: 26, paddingRight: 10.6, paddingTop: 10.6, paddingBottom: 10.6, itemSpacing: 28, primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER' });
  await fw('set_layout_props', { nodeId: '5411:11405', layoutSizingHorizontal: 'HUG', layoutSizingVertical: 'HUG' });
  const p = await info('5411:11405');
  await fw('set_position', { nodeId: '5411:11405', x: (575 - p.width) / 2, y: 593 });
  console.log('pilule', p.width, pk.map((k) => k.name));
}

// ---------- 04 Point 1 : badges proportionnés, flèche courbée dans l'autre sens.
{
  const S = '5411:11482';
  await fw('delete_nodes', { nodeIds: ['5411:11523', '5411:11537', '5411:11542'] });
  await badge(S, 'cross', { x: 251, y: 266, rot: -11.5, size: 30 });
  await badge(S, 'check', { x: 495, y: 322, rot: -25, size: 30 });
  await arrow(S, { x: 150, y: 470 }, { x: 282, y: 500 }, { bend: 0.35, name: 'Flèche avant → après' });
}

// ---------- 05 Point 2 : plus de cadre de sélection ni de pastille bleue ; tag blanc ; vrai CTA.
{
  const S = '5411:11644';
  await fw('delete_nodes', { nodeIds: ['5411:11678', '5411:11688', '5411:11689', '5411:11690', '5411:11691', '5411:11692', '5411:11693'] });
  const K = await card(S, { x: 80, y: 300, w: 415, h: 262, r: 18, name: 'Étape 2 — formulaire' });
  await label(K, 'Étape 2 sur 2', 24, 22, 13);
  await bar(K, 24, 46, 367, 1, 9);
  await field(K, 24, 92, 367, 40, 'Prénom');
  await field(K, 24, 142, 367, 40, 'E-mail');
  await sourceCTA(K, 'Envoyer', { x: 24, y: 196, s: 0.52 });
  const t = await tag(S, 'Presque fini', { x: 0, y: 0, s: 1.45 });
  const ti = await info(t);
  await fw('set_position', { nodeId: t, x: 80 + 24 + 367 - ti.width + 6, y: 300 + 46 + 9 + 4 });
}

// ---------- 06 Point 3 : vrai CTA, check proportionné.
{
  const S = '5411:11695';
  const F = '5411:11738';
  const old = (await kids(F)).filter((k) => k.name === 'CTA bleu source').map((k) => k.id);
  await fw('delete_nodes', { nodeIds: [...old, '5411:11751'] });
  await sourceCTA(F, 'Réserver mon appel', { x: 20, y: 204, s: 0.52 });
  await badge(S, 'check', { x: 486, y: 274, rot: -25, size: 30 });
}

// ---------- 07 Pourquoi ça marche : le carré bleu devient le vrai CTA.
{
  const S = '5411:11756';
  await fw('delete_nodes', { nodeIds: ['5411:11792'] });
  const b = await card(S, { x: 300, y: 440, w: 215, h: 64, r: 14, name: 'Oui plus grand' });
  await field(b, 12, 14, 96, 36, 'Prénom');
  await sourceCTA(b, 'Envoyer', { x: 116, y: 13.5, s: 0.4 });
}
close();
