import { fw, close } from './fw.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const OUT = fileURLToPath(new URL('../banque/corpus', import.meta.url));
const groups = ['5406:10802','5406:8011','5406:7201','5406:6521','5406:5992','5406:5353','5406:5994','5406:5995','5406:3563','5406:3564'];
const singles = ['5294:1354','5406:3565','5402:1406','5406:7202','5406:7245','5406:7261','5406:7369','5406:7456','5406:7516','5406:8012'];
const cat = { groups: [], singles: [] };
for (const g of groups) {
  const r = await fw('get_design_context', { nodeId: g, detail: 'compact', depth: 1 });
  const n = r.nodes[0];
  const slides = (n.children || []).filter(c => Math.abs(c.width - 575) < 2 && c.height >= 680).sort((a, b) => a.x - b.x);
  const others = (n.children || []).filter(c => !slides.includes(c)).map(c => ({ id: c.id, name: c.name, type: c.type }));
  const saved = await fw('save_screenshots', { nodeIds: slides.map(s => s.id), outDir: OUT, format: 'JPG', scale: 0.5 });
  cat.groups.push({ id: g, name: n.name, slides: slides.map((s, i) => ({ order: i + 1, id: s.id, name: s.name, h: Math.round(s.height), file: saved.saved[i].path ? 'corpus/' + path.basename(saved.saved[i].path) : null })), horsSlides: others });
  console.log(g, slides.length);
}
const saved = await fw('save_screenshots', { nodeIds: singles, outDir: OUT, format: 'JPG', scale: 0.5 });
const info = await fw('get_nodes_info', { nodeIds: singles });
cat.singles = singles.map((id, i) => ({ id, w: Math.round(info.nodes[i].width), h: Math.round(info.nodes[i].height), file: 'corpus/' + path.basename(saved.saved[i].path) }));
fs.writeFileSync(new URL('../banque/catalogue-brut.json', import.meta.url), JSON.stringify(cat, null, 1));
const comps = ['5406:1590','5406:1588','5406:1584','5406:2480','5406:2484','5406:5426','5406:6144','5406:6124','5406:3163','5406:3165','5406:4099','5406:3320','5406:2441','5406:6679','5406:2504','5406:2510','5406:2509','5406:1613','5406:2487','5406:2493','5406:2466','5406:5424','5406:7900','5406:6552','5406:5433','5406:6146','5406:6548'];
await fw('save_screenshots', { nodeIds: comps, outDir: fileURLToPath(new URL('../banque/composants', import.meta.url)), format: 'PNG', scale: 2 });
close();
