// Disposition de Louis (slide « Les couleurs » retouchée, 5481:4287) appliquée aux slides CTA, texte, emojis :
// panneaux collés (écart 6, départ y 173), tag au bas droit de chaque panneau, texte d'explication dessous
// (Plus Jakarta Sans Bold 19, interligne 130 %, 21 px sous le dernier tag).
import { fw, close } from '../../outils/fw.mjs';
import { C, text, info } from '../../outils/kit.mjs';

const TEXTES = {
  '5481:4287': 'Ce sont les couleurs par défaut de l’IA. Une marque garde une palette courte et s’y tient.',
  '5478:3723': 'Un style par bouton, ce n’est pas un design. Garde un seul style de CTA, sans effets gadgets.',
  '5478:3821': 'Le texte doit porter le message, pas les effets de mise en forme.',
  '5478:3902': 'Ils remplissent l’espace sans rien expliquer. Peu d’icônes, et d’une seule couleur.',
};
const Y0 = 173, GAP = 6, TEXT_BOTTOM = 590;
const kids = async (id) => (await fw('get_design_context', { nodeId: id, detail: 'compact', depth: 1 })).nodes[0].children;

for (const [S, body] of Object.entries(TEXTES)) {
  const k = await kids(S);
  // texte d'explication : celui de Louis sur la slide couleurs, créé ailleurs
  let t = k.find((c) => c.type === 'TEXT' && !['Louis Staub', 'J’optimise le taux de conversion de ta landing page'].includes(c.name));
  if (t) await fw('set_text', { nodeId: t.id, characters: body });
  else {
    const id = await text(S, body, { x: 61, y: 0, size: 19, w: 452, lh: 130, color: C.ink });
    t = { id };
  }
  const th = (await info(t.id)).height;
  const textY = Math.min(512, TEXT_BOTTOM - th);
  if (S === '5481:4287') { await fw('set_position', { nodeId: t.id, x: 61, y: textY }); console.log(S, 'texte seul'); continue; }
  // panneaux + tags + badges, dans l'ordre de construction (panneau, tag, badge)
  const panels = k.filter((c) => c.name.startsWith('Exemple : '));
  const tags = k.filter((c) => c.name === 'Tag');
  const badges = k.filter((c) => c.type === 'GROUP' && c.name === 'Group 1021');
  const h = (textY - 29 - Y0 - GAP * (panels.length - 1)) / panels.length;
  for (const [i, p] of panels.entries()) {
    const y = Y0 + i * (h + GAP);
    // recentrer le contenu verticalement dans la nouvelle hauteur
    const dy = (h - p.height) / 2;
    const inner = await kids(p.id);
    if (inner.length && Math.abs(dy) > 0.5) await fw('move_nodes', { nodeIds: inner.map((c) => c.id), dy });
    await fw('resize_nodes', { nodeIds: [p.id], width: 452, height: h });
    await fw('set_position', { nodeId: p.id, x: 62, y });
    const tg = tags[i], tgi = await info(tg.id);
    const tx = 62 + 452 + 8 - tgi.width, ty = y + h - 26;
    await fw('set_position', { nodeId: tg.id, x: tx, y: ty });
    if (badges[i]) await fw('set_position', { nodeId: badges[i].id, x: tx + tgi.width - 10, y: ty - 8 });
  }
  await fw('set_position', { nodeId: t.id, x: 61, y: textY });
  console.log(S, panels.length, 'panneaux de', Math.round(h));
}
close();
