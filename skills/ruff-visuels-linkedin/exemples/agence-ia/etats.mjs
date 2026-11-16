// États intermédiaires du site d'agence (avant IA 5445:1959 → après 5447:2182), dérivés de la version finale de Louis :
//  - étape 1 : nouvelle structure + éléments qui convertissent, encore en dark mode, typo et orange de la version IA ;
//  - étape 2 : même chose en light mode, sans direction artistique (pas de serif, pas de rouge, pas de halos ni texture) ;
//  - étape 3 : version finale (inchangée).
// Usage : node etats.mjs <dossier export>
import { fw, close } from '../../outils/fw.mjs';

const OUT = process.argv[2];
const { nodeId: SEC } = await fw('create_section', { name: 'Claude — États intermédiaires site agence (travail)', x: 101236, y: -84800, width: 4000, height: 1400 });
async function cloneState(name, x) {
  const { nodeId } = await fw('clone_node', { nodeId: '5447:2182' });
  await fw('reparent_nodes', { nodeIds: [nodeId], newParentId: SEC });
  await fw('set_position', { nodeId, x, y: 100 });
  await fw('rename_node', { nodeId, name });
  return nodeId;
}
// Retrouver dans le clone l'équivalent d'un id de l'original (même chemin d'enfants).
async function mapper(cloneId) {
  const a = (await fw('get_design_context', { nodeId: '5447:2182', detail: 'minimal', depth: 0 })).nodes[0];
  const b = (await fw('get_design_context', { nodeId: cloneId, detail: 'minimal', depth: 0 })).nodes[0];
  const m = {};
  const walk = (x, y) => { m[x.id] = y.id; (x.children || []).forEach((c, i) => y.children?.[i] && walk(c, y.children[i])); };
  walk(a, b);
  return (id) => m[id];
}
const solid = (hex, a = 1) => { const n = parseInt(hex.slice(1), 16); return { type: 'SOLID', color: { r: (n >> 16 & 255) / 255, g: (n >> 8 & 255) / 255, b: (n & 255) / 255 }, opacity: a }; };
const ORANGE = '#FF694F', DARK = '#08080B';

async function neutralize(M) {
  // pas de direction artistique : ni halos, ni texture, ni imagerie de fond, ni serif, ni rouge
  for (const id of ['5447:2186', '5447:2189', '5447:2192', '5447:2195', '5447:2198', '5447:2203']) await fw('set_visible', { nodeId: M(id), visible: false });
  await fw('set_text_properties', { nodeId: M('5447:2211'), fontName: { family: 'Inter', style: 'Bold' }, fontSize: 64, letterSpacing: { unit: 'PERCENT', value: -3 } });
  for (const id of ['5447:2219', '5447:2265']) await fw('set_fills', { nodeId: M(id), fills: [solid(ORANGE)] });
  for (const id of ['5447:2220', '5447:2221', '5447:2266', '5447:2267']) await fw('set_visible', { nodeId: M(id), visible: false });
}

// Étape 2 : light, sans DA
const E2 = await cloneState('Étape 2 — light mode, sans DA', 1900);
const M2 = await mapper(E2);
await neutralize(M2);
await fw('set_fills', { nodeId: M2('5447:2185'), fills: [solid('#FFFFFF')] });
await fw('set_fills', { nodeId: M2('5447:2227'), fills: [] });
await fw('set_fills', { nodeId: M2('5447:2228'), fills: [] });

// Étape 1 : dark, nouvelle structure
const E1 = await cloneState('Étape 1 — structure, encore en dark', 0);
const M1 = await mapper(E1);
await neutralize(M1);
for (const id of ['5447:2183', '5447:2185']) await fw('set_fills', { nodeId: M1(id), fills: [solid(DARK)] });
for (const id of ['5447:2227', '5447:2228']) await fw('set_fills', { nodeId: M1(id), fills: [] });
await fw('set_fills', { nodeId: M1('5447:2211'), fills: [solid('#FFFFFF')] });
for (const id of ['5447:2213', '5447:2226', '5447:2236', '5447:2237', '5447:2244', '5447:2245', '5447:2246']) await fw('set_fills', { nodeId: M1(id), fills: [solid('#FFFFFF', 0.6)] });
for (const id of ['5447:2252', '5447:2256', '5447:2257', '5447:2258', '5447:2259', '5447:2260', '5447:2261', '5447:2254', '5447:2234', '5447:2235']) await fw('set_fills', { nodeId: M1(id), fills: [solid('#FFFFFF', 0.85)] });
for (const id of ['5447:2208', '5447:2216', '5447:2263']) await fw('set_fills', { nodeId: M1(id), fills: [solid('#18181C')] });
for (const id of ['5447:2209', '5447:2217', '5447:2264']) await fw('set_fills', { nodeId: M1(id), fills: [solid('#FFFFFF')] });
await fw('set_fills', { nodeId: M1('5447:2249'), fills: [solid('#2A2A30')] });
await fw('set_fills', { nodeId: M1('5447:2272'), fills: [solid('#1A1A1F')] });
await fw('set_fills', { nodeId: M1('5447:2273'), fills: [solid('#111114')] });
try { await fw('set_strokes', { nodeId: M1('5447:2229'), strokes: [solid('#FFFFFF', 0.15)] }); } catch {}

// Exports : avant, étape 1, étape 2, après (même cadrage 1800 × 1123 pour les trois derniers)
const s = await fw('save_screenshots', { nodeIds: ['5445:1959', E1, E2, '5447:2182'], outDir: OUT, scale: 1, format: 'PNG' });
console.log(JSON.stringify(s.saved.map((x) => x.path)));
console.log('section', SEC, E1, E2);
close();
