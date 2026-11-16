import { fw, close } from '../../outils/fw.mjs';
import { info, badge } from '../../outils/kit.mjs';
const kids = async (id) => (await fw('get_design_context', { nodeId: id, detail: 'minimal', depth: 1 })).nodes[0].children;
for (const S of ['5411:11482','5411:11695']) {
  const g = (await kids(S)).filter(k => k.name === 'Group 733' || k.name === 'Group 1021').map(k => k.id);
  await fw('delete_nodes', { nodeIds: g });
}
await badge('5411:11482', 'cross', { x: 251, y: 266, rot: -11.5, size: 30 });
await badge('5411:11482', 'check', { x: 495, y: 322, rot: -25, size: 30 });
await badge('5411:11695', 'check', { x: 486, y: 274, rot: -25, size: 30 });
const t = (await kids('5411:11644')).find(k => k.name === 'Tag').id;
const ti = await info(t);
await fw('set_position', { nodeId: t, x: 80 + 24 + 367 - ti.width, y: 300 + 12 });
await fw('move_nodes', { nodeIds: [(await kids('5411:11644')).find(k=>k.name==='Étape 2 — formulaire').id], dx: 0, dy: 0 });
close();
