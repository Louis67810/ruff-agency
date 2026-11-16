// Illustrations des points 1-3 et de « Pourquoi ça marche ? ».
import { fw, close } from '../../outils/fw.mjs';
import { C, SHADOW_CARD, SHADOW_BLUE, BLUE_GRAD, rect, frame, text, hug, info, blueCTA, badge, arrow, selection } from '../../outils/kit.mjs';

const card = (p, o) => frame(p, { r: 16, stroke: { color: { r: 0, g: 0, b: 0 }, a: 0.1 }, effects: SHADOW_CARD, ...o });
const label = (p, s, x, y, size = 12) => text(p, s, { x, y, size, family: 'Inter', style: 'Semi Bold', color: C.greyText, ls: 0 });
const field = async (p, x, y, w, h, value, filled = false) => {
  await rect(p, { x, y, w, h, r: 8, fill: { r: 0.97, g: 0.97, b: 0.97 }, stroke: { color: C.greyLine } });
  await text(p, value, { x: x + 12, y: y + (h - 17) / 2, size: 13, family: 'Inter', style: 'Medium', color: filled ? C.ink : { r: 0.68, g: 0.68, b: 0.68 }, ls: 0 });
};
const option = async (p, x, y, w, s, sel) => {
  await rect(p, { x, y, w, h: 34, r: 10, fill: sel ? C.blueSoft : C.white, stroke: { color: sel ? C.blue : C.greyLine }, strokeW: sel ? 1.8 : 1 });
  await text(p, s, { x: x + 13, y: y + 8.5, size: 13.5, family: 'Inter', style: 'Medium', color: sel ? C.blue : C.ink, ls: 0 });
};
const bar = async (p, x, y, w, ratio, h = 7) => {
  await rect(p, { x, y, w, h, r: h / 2, fill: C.grey });
  await rect(p, { x, y, w: w * ratio, h, r: h / 2, fill: C.blue });
};

// ---------- Point 1 : avant (champs obligatoires) → après (une question à choix)
{
  const S = '5406:10932';
  const L = await card(S, { x: 70, y: 292, w: 196, h: 160, name: 'Avant — champs obligatoires' });
  await label(L, 'Ton e-mail *', 16, 16);
  await field(L, 16, 36, 164, 34, 'nom@entreprise.fr');
  await label(L, 'Ton téléphone *', 16, 84);
  await field(L, 16, 104, 164, 34, '06 00 00 00 00');
  await fw('rotate_nodes', { nodeIds: [L], rotation: 4 });
  await badge(S, 'cross', { x: 238, y: 270, rot: -11.5 });

  const R = await card(S, { x: 296, y: 336, w: 214, h: 196, name: 'Après — une question à choix' });
  await text(R, 'Quel est ton objectif ?', { x: 16, y: 18, size: 15.5 });
  await option(R, 16, 54, 182, 'Avoir plus de demandes', true);
  await option(R, 16, 96, 182, 'Vendre en ligne', false);
  await option(R, 16, 138, 182, 'Lancer mon site', false);
  await badge(S, 'check', { x: 478, y: 308, rot: -25 });

  await arrow(S, { x: 150, y: 470 }, { x: 282, y: 500 }, { bend: -0.35, name: 'Flèche avant → après' });
}

// ---------- Point 2 : la barre de progression, mise en évidence par la sélection
{
  const S = '5406:11080';
  const K = await card(S, { x: 80, y: 300, w: 415, h: 250, r: 18, name: 'Étape 2 — formulaire' });
  await label(K, 'Étape 2 sur 2', 24, 22, 13);
  await bar(K, 24, 46, 367, 1, 9);
  await field(K, 24, 80, 367, 40, 'Prénom');
  await field(K, 24, 130, 367, 40, 'E-mail');
  await rect(K, { x: 24, y: 186, w: 367, h: 42, r: 10, fill: C.blue, name: 'faux CTA' });
  await text(K, 'Envoyer', { x: 179, y: 197, size: 15, family: 'Inter', style: 'Semi Bold', color: C.white, ls: 0 });
  await selection(S, { x: 104, y: 318, w: 367, h: 37 });
  // pastille secondaire au coin supérieur droit, même rotation que la carte (0°)
  const tag = await frame(S, { x: 380, y: 262, w: 100, h: 34, r: 11, fill: BLUE_GRAD, effects: SHADOW_BLUE, name: 'Pastille' });
  await text(tag, 'Presque fini', { x: 0, y: 0, size: 15, color: C.white });
  await hug(tag, { px: 13, py: 8 });
  const t = await info(tag);
  await fw('set_position', { nodeId: tag, x: 495 - t.width + 14, y: 266 });
}

// ---------- Point 3 : empilement — l'étape 1 répondue derrière, les coordonnées devant
{
  const S = '5406:11129';
  const B = await card(S, { x: 64, y: 312, w: 250, h: 190, name: 'Étape 1 — répondue' });
  await label(B, 'Étape 1 sur 2', 16, 16);
  await bar(B, 16, 36, 218, 0.5);
  await text(B, 'Quel est ton objectif ?', { x: 16, y: 56, size: 14 });
  await option(B, 16, 86, 218, 'Avoir plus de demandes', true);
  await option(B, 16, 128, 218, 'Vendre en ligne', false);
  await fw('rotate_nodes', { nodeIds: [B], rotation: 7 });

  const F = await card(S, { x: 196, y: 288, w: 306, h: 290, r: 18, name: 'Étape 2 — coordonnées' });
  await label(F, 'Étape 2 sur 2', 20, 18);
  await bar(F, 20, 38, 266, 1);
  await label(F, 'Prénom', 20, 62, 11.5);
  await field(F, 20, 80, 266, 36, 'Camille', true);
  await label(F, 'E-mail', 20, 128, 11.5);
  await field(F, 20, 146, 266, 36, 'camille@agence.fr', true);
  await blueCTA(F, 'Réserver mon appel', { x: 20, y: 206, s: 0.5 });
  await badge(S, 'check', { x: 474, y: 262, rot: -25 });
}

// ---------- 07 Pourquoi ça marche : petit oui → oui plus grand
{
  const S = '5406:11178';
  await text(S, 'Petit oui', { x: 70, y: 414, size: 15 });
  const a = await card(S, { x: 62, y: 440, w: 180, h: 64, r: 14, name: 'Petit oui' });
  await option(a, 14, 15, 152, 'Avoir plus de demandes', true);
  await text(S, 'Puis un oui plus grand', { x: 300, y: 414, size: 15 });
  const b = await card(S, { x: 300, y: 440, w: 205, h: 64, r: 14, name: 'Oui plus grand' });
  await field(b, 14, 14, 112, 36, 'Prénom');
  await rect(b, { x: 134, y: 14, w: 57, h: 36, r: 9, fill: C.blue, name: 'faux CTA' });
  await arrow(S, { x: 252, y: 472 }, { x: 290, y: 472 }, { bend: 0, width: 5, head: 10 });
}
close();
