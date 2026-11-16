// Slide 1 — couverture : formulaire en deux temps (étape 1 au premier plan, étape 2 derrière), main qui choisit.
import { fw, close } from '../../outils/fw.mjs';
import { C, SHADOW_CARD, rect, frame, text, hug, info } from '../../outils/kit.mjs';

const S = '5406:10808';
const ids = { pour: '5406:10828', pourT: '5406:10829', blue: '5406:10841', blueT: '5406:10842', row2: '5406:10839', row2T: '5406:10840', ctaT: '5406:10836', fade: '5406:10834', hand: '5406:10864' };

// Titre : deux rangées, chaque cartouche sur une ligne.
await fw('set_text', { nodeId: ids.pourT, characters: 'La stratégie' });
await fw('set_text', { nodeId: ids.blueT, characters: 'secrète' });
await fw('set_text', { nodeId: ids.row2T, characters: 'qui booste ta conversion' });
await fw('set_text', { nodeId: ids.ctaT, characters: 'Je te la montre' });
await hug(ids.pour, { px: 24, py: 23 });
await hug(ids.blue, { px: 24, py: 23 });
await hug(ids.row2, { px: 21, py: 19.5 });
const a = await info(ids.pour), b = await info(ids.blue), c = await info(ids.row2);
const gap = 8, row1 = a.width + gap + b.width, x1 = (575 - row1) / 2;
await fw('set_position', { nodeId: ids.pour, x: x1, y: 86 });
await fw('set_position', { nodeId: ids.blue, x: x1 + a.width + gap, y: 86 + (a.height - b.height) / 2 });
await fw('set_position', { nodeId: ids.row2, x: (575 - c.width) / 2, y: 86 + a.height + 10 });
console.log('rangées', a.width, b.width, c.width, a.height, b.height, c.height);

// Carte arrière : étape 2 (coordonnées), légèrement tournée.
const back = await frame(S, { x: 62, y: 318, w: 250, h: 230, r: 16, stroke: { color: { r: 0, g: 0, b: 0 }, a: 0.1 }, effects: SHADOW_CARD, name: 'Étape 2 — coordonnées' });
await text(back, 'Étape 2 sur 2', { x: 18, y: 16, size: 11, family: 'Inter', style: 'Semi Bold', color: C.greyText, ls: 0 });
await rect(back, { x: 18, y: 36, w: 214, h: 7, r: 3.5, fill: C.grey });
await rect(back, { x: 18, y: 36, w: 214, h: 7, r: 3.5, fill: C.blue });
for (const [i, l] of ['Prénom', 'E-mail', 'Téléphone'].entries()) {
  await rect(back, { x: 18, y: 58 + i * 40, w: 214, h: 30, r: 8, fill: { r: 0.965, g: 0.965, b: 0.965 }, stroke: { color: C.greyLine }, strokeW: 1 });
  await text(back, l, { x: 30, y: 66 + i * 40, size: 11.5, family: 'Inter', style: 'Medium', color: C.greyText, ls: 0 });
}
await fw('rotate_nodes', { nodeIds: [back], rotation: 7 });

// Carte avant : étape 1 (une seule question à choix).
const front = await frame(S, { x: 222, y: 296, w: 290, h: 238, r: 18, stroke: { color: { r: 0, g: 0, b: 0 }, a: 0.1 }, effects: SHADOW_CARD, name: 'Étape 1 — question' });
await text(front, 'Étape 1 sur 2', { x: 20, y: 18, size: 11, family: 'Inter', style: 'Semi Bold', color: C.greyText, ls: 0 });
await rect(front, { x: 20, y: 38, w: 250, h: 7, r: 3.5, fill: C.grey });
await rect(front, { x: 20, y: 38, w: 125, h: 7, r: 3.5, fill: C.blue });
await text(front, 'Quel est ton objectif ?', { x: 20, y: 60, size: 19 });
const opts = ['Avoir plus de demandes', 'Vendre en ligne', 'Lancer mon site'];
for (const [i, l] of opts.entries()) {
  const sel = i === 0;
  await rect(front, { x: 20, y: 98 + i * 44, w: 250, h: 36, r: 10, fill: sel ? C.blueSoft : C.white, stroke: { color: sel ? C.blue : C.greyLine }, strokeW: sel ? 1.8 : 1 });
  await text(front, l, { x: 34, y: 107 + i * 44, size: 14, family: 'Inter', style: 'Medium', color: sel ? C.blue : C.ink, ls: 0 });
}

// Couches : cartes < fondu < bandelettes < titres / main.
await fw('reorder_nodes', { nodeIds: [back, front], index: 0 });
await fw('reorder_nodes', { nodeIds: [ids.fade], index: 2 });
console.log('back', back, 'front', front);
close();
