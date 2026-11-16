// Retour R16 : tag « Presque fini » plus petit, accroché au coin supérieur droit de la carte.
import { fw, close } from '../../outils/fw.mjs';
import { tag, info } from '../../outils/kit.mjs';

const S = '5411:11644';
const kids = (await fw('get_design_context', { nodeId: S, detail: 'minimal', depth: 1 })).nodes[0].children;
await fw('delete_nodes', { nodeIds: kids.filter((k) => k.name === 'Tag').map((k) => k.id) });
const card = await info(kids.find((k) => k.name === 'Étape 2 — formulaire').id);
const t = await tag(S, 'Presque fini', { x: 0, y: 0, s: 1.05 });
const ti = await info(t);
// léger débordement sur les deux bords du coin, comme les badges
await fw('set_position', { nodeId: t, x: card.x + card.width - ti.width + 10, y: card.y - ti.height / 2 });
console.log(ti.width, ti.height);
close();
