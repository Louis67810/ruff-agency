// Après le déplacement du tag : remonter les champs et le CTA de la carte du point 2.
import { fw, close } from '../../outils/fw.mjs';
import { info } from '../../outils/kit.mjs';

const S = '5411:11644';
const kids = (await fw('get_design_context', { nodeId: S, detail: 'minimal', depth: 1 })).nodes[0].children;
const card = kids.find((k) => k.name === 'Étape 2 — formulaire').id;
const inner = (await fw('get_design_context', { nodeId: card, detail: 'compact', depth: 1 })).nodes[0].children;
await fw('move_nodes', { nodeIds: inner.filter((c) => c.y >= 80).map((c) => c.id), dy: -22 });
const c = await info(card);
await fw('resize_nodes', { nodeIds: [card], width: c.width, height: c.height - 22 });
close();
