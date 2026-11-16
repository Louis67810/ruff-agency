// node export.mjs <sectionId> <dossier> : exporte les frames de la section dans l'ordre x, PNG @2x
import { fw, close } from './fw.mjs';
import fs from 'node:fs';
const [sec, out] = process.argv.slice(2);
const r = await fw('get_design_context', { nodeId: sec, detail: 'compact', depth: 1 });
const frames = r.nodes[0].children.filter(c => c.type === 'FRAME').sort((a, b) => a.x - b.x);
fs.mkdirSync(out + '/png', { recursive: true });
const s = await fw('save_screenshots', { nodeIds: frames.map(f => f.id), outDir: out + '/png', scale: 2 });
s.saved.forEach((f, i) => fs.renameSync(f.path, `${out}/png/slide-${String(i + 1).padStart(2, '0')}.png`));
console.log(frames.map(f => f.name).join(' | '));
close();
