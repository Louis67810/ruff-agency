// Correction de Louis : les gens n'utilisent pas Claude pour créer leur site, ils l'utilisent dans le chat.
// Slide 2 : fenêtre de chat à gauche, site à droite. Slide 4 : problématique chat / visiteur.
import { fw, close } from '../../outils/fw.mjs';
import { C, rect, frame, text, info, cloneScaled } from '../../outils/kit.mjs';

const S2 = '5495:1883', S4TEXT = '5495:2069';
const rgb = (h) => { const n = parseInt(h.slice(1), 16); return { r: (n >> 16 & 255) / 255, g: (n >> 8 & 255) / 255, b: (n & 255) / 255 }; };
const k = (await fw('get_design_context', { nodeId: S2, detail: 'minimal', depth: 1 })).nodes[0].children;
const byStart = (s) => k.find((c) => c.type === 'TEXT' && c.name.startsWith(s)).id;

await fw('set_text', { nodeId: byStart('Claude ne sert'), characters: 'Claude ne sert pas qu’à discuter dans un chat.' });
await fw('set_text', { nodeId: byStart('Beaucoup'), characters: 'Beaucoup l’utilisent ici, dans le chat' });
await fw('set_text', { nodeId: byStart('Très peu'), characters: 'Très peu ici, pour aider leurs visiteurs' });

// la carte de gauche devient une fenêtre de chat
const sites = [];
for (const c of k.filter((c) => c.name === 'Site')) sites.push({ id: c.id, x: (await info(c.id)).x });
sites.sort((a, b) => a.x - b.x);
const L = sites[0].id;
const kids = (await fw('get_design_context', { nodeId: L, detail: 'minimal', depth: 1 })).nodes[0].children;
await fw('delete_nodes', { nodeIds: kids.map((c) => c.id) });
await fw('rename_node', { nodeId: L, name: 'Chat' });
await cloneScaled('5458:4899', L, 0.4, { x: 12, y: 10 });
await text(L, 'Claude', { x: 34, y: 12, size: 12, family: 'Inter', style: 'Semi Bold', ls: 0, color: rgb('#0D1E26') });
await rect(L, { x: 0, y: 36, w: 216, h: 1, fill: rgb('#EEEEEE') });
const q = await frame(L, { x: 92, y: 48, w: 112, h: 30, r: 10, fill: rgb('#F1F1F1'), name: 'Message' });
await rect(q, { x: 10, y: 9, w: 92, h: 5, r: 2.5, fill: rgb('#C9C9C9') });
await rect(q, { x: 10, y: 18, w: 60, h: 5, r: 2.5, fill: rgb('#C9C9C9') });
for (const [i, w] of [180, 168, 184, 120].entries()) await rect(L, { x: 14, y: 90 + i * 12, w, h: 5, r: 2.5, fill: rgb('#E8E8E8') });
const inp = await frame(L, { x: 12, y: 152, w: 192, h: 32, r: 16, fill: rgb('#F6F6F6'), stroke: { color: rgb('#E5E5E5') }, name: 'Champ' });
await rect(inp, { x: 14, y: 13, w: 84, h: 5, r: 2.5, fill: rgb('#D4D4D4') });
await rect(inp, { x: 164, y: 5, w: 22, h: 22, r: 11, fill: rgb('#D87756') });

await fw('set_text', { nodeId: S4TEXT, characters: 'Beaucoup de gens utilisent Claude dans le chat.\n\nMais très peu l’utilisent pour aider leurs visiteurs à décider.' });
close();
