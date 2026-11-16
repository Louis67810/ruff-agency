import { fw, close } from './fw.mjs';
const r = await fw('get_design_context', { nodeId: process.argv[2], detail: 'compact', depth: Number(process.argv[3] || 2) });
const walk = (n, d) => { console.log(' '.repeat(d) + n.id, n.type, JSON.stringify(n.name).slice(0, 50), Math.round(n.x), Math.round(n.y), Math.round(n.width), Math.round(n.height)); (n.children || []).forEach(c => walk(c, d + 1)); };
walk(r.nodes[0], 0); close();
