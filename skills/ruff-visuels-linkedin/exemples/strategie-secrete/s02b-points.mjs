// Textes des slides 2, 3, 7 et des trois points ; nettoyage des illustrations héritées du gabarit.
import { fw, close } from '../../outils/fw.mjs';
import { C, text, hug, info } from '../../outils/kit.mjs';

async function kids(id) {
  const r = await fw('get_design_context', { nodeId: id, detail: 'minimal', depth: 6 });
  const out = [];
  const walk = (n, d) => { out.push({ ...n, d }); (n.children || []).forEach((c) => walk(c, d + 1)); };
  r.nodes[0].children.forEach((c) => walk(c, 1));
  return out;
}

async function pill(frameId, textId, label) {
  await fw('set_text', { nodeId: textId, characters: label });
  await fw('set_auto_layout', { nodeId: frameId, layoutMode: 'HORIZONTAL', paddingLeft: 25, paddingRight: 10, paddingTop: 9, paddingBottom: 9, itemSpacing: 26, primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER' });
  await fw('set_layout_props', { nodeId: frameId, layoutSizingHorizontal: 'HUG', layoutSizingVertical: 'HUG' });
  const p = await info(frameId);
  await fw('set_position', { nodeId: frameId, x: (575 - p.width) / 2, y: p.y });
}

// 04-06 Points numérotés
const points = [
  ['5406:10932', '1', 'Une question facile', 'Commence par une question à choix. Un clic, aucun champ à remplir.'],
  ['5406:11080', '2', 'Une barre de progression', 'Montre-lui où il en est. « Étape 2 sur 2 » lui dit que c’est presque fini.'],
  ['5406:11129', '3', 'Les coordonnées à la fin', 'Prénom et e-mail arrivent une fois qu’il s’est engagé. Garde seulement les champs utiles.'],
];
for (const [id, num, title, desc] of points) {
  const k = await kids(id);
  const top = k.filter((n) => n.d === 1);
  const numFrame = top.find((n) => n.name === 'Frame 4422');
  const numText = k.find((n) => n.type === 'TEXT' && /^\d+$/.test(n.name));
  const titleFrame = top.find((n) => n.name === 'Frame 4650');
  const titleText = k.find((n) => n.type === 'TEXT' && n.d === 2 && n.name === 'Mettez un Verbe');
  const desc0 = top.find((n) => n.type === 'TEXT' && n.name.startsWith('Pour pousser'));
  await fw('set_text', { nodeId: numText.id, characters: num });
  await fw('set_text', { nodeId: titleText.id, characters: title });
  await fw('set_text_properties', { nodeId: titleText.id, textAutoResize: 'WIDTH_AND_HEIGHT' });
  await hug(titleFrame.id, { px: 18, py: 17.5 });
  await fw('set_text', { nodeId: desc0.id, characters: desc });
  await fw('resize_nodes', { nodeIds: [desc0.id], width: 420, height: 60 });
  await fw('set_text_properties', { nodeId: desc0.id, textAutoResize: 'HEIGHT', lineHeight: { unit: 'PERCENT', value: 140 } });
  const junk = top.filter((n) => ['Frame 4266', 'Frame 14', 'Frame 2147224256', 'Group 733', 'Vector 729'].includes(n.name)).map((n) => n.id);
  await fw('delete_nodes', { nodeIds: junk });
  console.log(id, 'ok', junk.length);
}
close();
