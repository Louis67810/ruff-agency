// Retours de Louis sur la v2 : « Attends une seconde », nouvelle problématique en slide 4,
// slides Sommaire et « Merci d'avoir lu » retirées, section resserrée et slides renumérotées.
import { fw, close } from '../../outils/fw.mjs';
import { info, hug } from '../../outils/kit.mjs';

const SEC = '5495:1803';
const cart = '5495:1901', slide4Text = '5495:2069', retirees = ['5495:2070', '5496:2290'];

const inner = (await fw('get_design_context', { nodeId: cart, detail: 'minimal', depth: 1 })).nodes[0].children.find((c) => c.type === 'TEXT');
await fw('set_text', { nodeId: inner.id, characters: 'Attends une seconde' });
await hug(cart, { px: 18, py: 12 });
await fw('rename_node', { nodeId: '5495:1883', name: '02 Attends une seconde' });

await fw('set_text', { nodeId: slide4Text, characters: 'Tout le monde utilise Claude.\n\nMais très peu l’utilisent pour augmenter la conversion de leur site.' });

await fw('delete_nodes', { nodeIds: retirees });

const kids = (await fw('get_design_context', { nodeId: SEC, detail: 'minimal', depth: 1 })).nodes[0].children;
const placed = [];
for (const k of kids) placed.push({ id: k.id, name: k.name, x: (await info(k.id)).x });
placed.sort((a, b) => a.x - b.x);
for (const [i, s] of placed.entries()) {
  const n = await info(s.id);
  await fw('set_position', { nodeId: s.id, x: 100 + i * 625, y: n.y });
  await fw('rename_node', { nodeId: s.id, name: String(i + 1).padStart(2, '0') + ' ' + s.name.replace(/^\d+ /, '') });
}
await fw('resize_nodes', { nodeIds: [SEC], width: placed.length * 625 + 150, height: 1000 });
console.log(placed.length, 'slides');
close();
