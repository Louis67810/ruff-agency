// Corrections après contrôle du rendu v1 : bloc d'étape trop large, intertitre qui déborde, capture du résultat.
import fs from 'node:fs';
import path from 'node:path';
import { fw, close } from '../../outils/fw.mjs';
import { frame, info, SHADOW_CARD } from '../../outils/kit.mjs';

const CAP = process.argv[2];
// Bloc bleu qui passe sur deux lignes plutôt que de sortir de la slide (comme « Noter tous les problèmes du site précédent »).
async function wrapBlock(block, txt, width) {
  await fw('set_text_properties', { nodeId: txt, textAutoResize: 'HEIGHT' });
  await fw('resize_nodes', { nodeIds: [txt], width, height: 40 });
  await fw('set_text_properties', { nodeId: txt, textAutoResize: 'HEIGHT' });
}
// 13 Étape 3
await wrapBlock('5432:7296', '5432:7297', 398);
const b = await info('5432:7296');
await fw('set_position', { nodeId: '5432:7307', x: 62, y: b.y + b.height + 22 });
// 15 Intertitre : bloc en auto-layout vertical (texte puis capsule flèche), centré
await wrapBlock('5432:7378', '5432:7379', 398);
await fw('set_auto_layout', { nodeId: '5432:7378', layoutMode: 'VERTICAL', paddingLeft: 24, paddingRight: 24, paddingTop: 27, paddingBottom: 26, itemSpacing: 18, primaryAxisAlignItems: 'MIN', counterAxisAlignItems: 'MIN' });
await fw('set_layout_props', { nodeId: '5432:7378', layoutSizingHorizontal: 'HUG', layoutSizingVertical: 'HUG' });
const p = await info('5432:7378');
await fw('set_position', { nodeId: '5432:7378', x: (575 - p.width) / 2, y: (600 - p.height) / 2 + 20 });
// 17 Résultat : capture recadrée sur le titre et le CTA final
await fw('delete_nodes', { nodeIds: ['5432:7471'] });
const buf = fs.readFileSync(path.join(CAP, 'final-haut.jpg'));
const w = 452, h = w * 600 / 1440;
const card = await frame('5432:7437', { x: 62, y: 310, w, h, r: 10, fill: { r: 0.04, g: 0.06, b: 0.13 }, stroke: { color: { r: 0, g: 0, b: 0 }, a: 0.12 }, effects: SHADOW_CARD, name: 'Capture CTA final' });
await fw('import_image', { parentId: card, data: buf.toString('base64'), x: 0, y: 0, width: w, height: h, name: 'Capture', scaleMode: 'FILL' });
close();
