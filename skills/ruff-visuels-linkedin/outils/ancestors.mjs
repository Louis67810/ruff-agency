import { fw, close } from './fw.mjs';
for (const id of process.argv.slice(2)) {
  let cur = id; const chain = [];
  while (cur) { const n = (await fw('get_nodes_info', { nodeIds: [cur] })).nodes[0]; if (!n) break; chain.push(`${n.id} ${n.type} "${(n.name||'').slice(0,40)}" ${Math.round(n.width)}x${Math.round(n.height)}`); cur = n.parentId; if (n.type==='PAGE'||cur==='0:1') break; }
  console.log(chain.join('\n  <- ')); console.log('---');
}
close();
