import { fw, close } from './fw.mjs';
for (const id of process.argv.slice(2)) {
  const r = await fw('get_design_context', { nodeId: id, detail: 'compact', depth: 1 });
  const n = r.nodes[0];
  console.log('##', id, n.name, n.width, n.height);
  for (const c of n.children || []) console.log(' ', c.id, c.type, JSON.stringify(c.name).slice(0,60), Math.round(c.x), Math.round(c.y), Math.round(c.width), Math.round(c.height));
}
close();
