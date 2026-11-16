// États intermédiaires v2 (retour de Louis) : chaque étape ne change QUE ce qu'elle annonce.
//  - étape 1 : nouvelle structure + éléments qui convertissent, avec le design de la version IA
//    (Barlow Condensed en capitales pour le titre et les boutons, DM Sans pour les textes, fond noir, orange) ;
//  - étape 2 : exactement l'étape 1, passée en light mode ;
//  - étape 3 : version finale de Louis (serif, rouge, textures, halos).
// Usage : node etats-v2.mjs <dossier export>
import { fw, close } from '../../outils/fw.mjs';

const OUT = process.argv[2];
const { nodeId: SEC } = await fw('create_section', { name: 'Claude — États site agence v2 (travail)', x: 101236, y: -83200, width: 4000, height: 1400 });
async function cloneState(name, x) {
  const { nodeId } = await fw('clone_node', { nodeId: '5447:2182' });
  await fw('reparent_nodes', { nodeIds: [nodeId], newParentId: SEC });
  await fw('set_position', { nodeId, x, y: 100 });
  await fw('rename_node', { nodeId, name });
  return nodeId;
}
async function mapper(cloneId) {
  const a = (await fw('get_design_context', { nodeId: '5447:2182', detail: 'minimal', depth: 0 })).nodes[0];
  const b = (await fw('get_design_context', { nodeId: cloneId, detail: 'minimal', depth: 0 })).nodes[0];
  const m = {};
  const walk = (x, y) => { m[x.id] = y.id; (x.children || []).forEach((c, i) => y.children?.[i] && walk(c, y.children[i])); };
  walk(a, b);
  return (id) => m[id];
}
const solid = (hex, a = 1) => { const n = parseInt(hex.slice(1), 16); return { type: 'SOLID', color: { r: (n >> 16 & 255) / 255, g: (n >> 8 & 255) / 255, b: (n & 255) / 255 }, opacity: a }; };
const ORANGE = '#FF694F';
const T = (M, id, o) => fw('set_text_properties', { nodeId: M(id), ...o });
const fill = (M, id, f) => fw('set_fills', { nodeId: M(id), fills: f });

async function iaDesign(M, dark) {
  const ink = dark ? '#FFFFFF' : '#0B0B0D', soft = dark ? 0.6 : 0.65;
  // pas encore de direction artistique : ni halos, ni texture, ni imagerie de fond
  for (const id of ['5447:2186', '5447:2189', '5447:2192', '5447:2195', '5447:2198', '5447:2203']) await fw('set_visible', { nodeId: M(id), visible: false });
  for (const id of ['5447:2227', '5447:2228']) await fill(M, id, []);
  for (const id of ['5447:2183', '5447:2185']) await fill(M, id, [solid(dark ? '#08080B' : '#FFFFFF')]);
  // titre : typo de la version IA
  await T(M, '5447:2211', { fontName: { family: 'Barlow Condensed', style: 'Black' }, fontSize: 92, textCase: 'UPPER', letterSpacing: { unit: 'PERCENT', value: 0 }, lineHeight: { unit: 'PERCENT', value: 92 } });
  await fill(M, '5447:2211', [solid(ink)]);
  // textes : DM Sans
  await T(M, '5447:2213', { fontName: { family: 'DM Sans', style: 'Regular' }, fontSize: 20 });
  await fill(M, '5447:2213', [solid(ink, soft)]);
  for (const id of ['5447:2226', '5447:2236', '5447:2237', '5447:2244', '5447:2245', '5447:2246']) { await T(M, id, { fontName: { family: 'DM Sans', style: 'Regular' }, fontSize: 14 }); await fill(M, id, [solid(ink, 0.55)]); }
  // sur-titre : DM Sans ExtraBold en capitales, orange, comme l'eyebrow IA
  await T(M, '5447:2209', { fontName: { family: 'DM Sans', style: 'ExtraBold' }, fontSize: 13, textCase: 'UPPER', letterSpacing: { unit: 'PERCENT', value: 8 } });
  await fill(M, '5447:2209', [solid(ORANGE)]);
  await fill(M, '5447:2208', [solid(dark ? '#16161A' : '#FFF1EE')]);
  // navigation : DM Sans en capitales espacées
  for (const id of ['5447:2252', '5447:2256', '5447:2257', '5447:2258', '5447:2259', '5447:2260', '5447:2261']) { await T(M, id, { fontName: { family: 'DM Sans', style: 'Regular' }, fontSize: 12, textCase: 'UPPER', letterSpacing: { unit: 'PERCENT', value: 10 } }); await fill(M, id, [solid(ink, 0.7)]); }
  await fill(M, '5447:2254', [solid(ink, 0.7)]);
  for (const id of ['5447:2234', '5447:2235']) await fill(M, id, [solid(ink, 0.8)]);
  await fill(M, '5447:2249', [solid(dark ? '#2A2A30' : '#CFCFCF')]);
  // boutons : angles droits, Barlow Condensed ExtraBold en capitales ; principal orange, secondaire contour
  for (const [frame, txt, primary] of [['5447:2219', '5447:2222', true], ['5447:2265', '5447:2268', true], ['5447:2216', '5447:2217', false], ['5447:2263', '5447:2264', false]]) {
    await fw('set_corner_radius', { nodeId: M(frame), radius: 2 });
    await fw('set_effects', { nodeId: M(frame), effects: [] });
    await fill(M, frame, [solid(primary ? ORANGE : (dark ? '#08080B' : '#FFFFFF'))]);
    if (!primary) await fw('set_strokes', { nodeId: M(frame), strokes: [solid(ink, 0.35)], strokeWeight: 1, strokeAlign: 'INSIDE' });
    await T(M, txt, { fontName: { family: 'Barlow Condensed', style: 'ExtraBold' }, fontSize: 17, textCase: 'UPPER', letterSpacing: { unit: 'PERCENT', value: 4 } });
    await fill(M, txt, [solid(primary ? '#0B0B0D' : ink)]);
  }
  for (const id of ['5447:2220', '5447:2221', '5447:2266', '5447:2267']) await fw('set_visible', { nodeId: M(id), visible: false });
  for (const id of ['5447:2223', '5447:2225', '5447:2269', '5447:2271']) { try { await fill(M, id, [solid('#0B0B0D')]); await fw('set_strokes', { nodeId: M(id), strokes: [solid('#0B0B0D')] }); } catch {} }
  await fill(M, '5447:2272', [solid(dark ? '#16161A' : '#EDEDED')]);
  await fill(M, '5447:2273', [solid(dark ? '#0F0F12' : '#FFFFFF')]);
  try { await fw('set_strokes', { nodeId: M('5447:2229'), strokes: [solid(ink, 0.15)] }); } catch {}
}

const E1 = await cloneState('Étape 1 — structure, design IA (dark)', 0);
await iaDesign(await mapper(E1), true);
const E2 = await cloneState('Étape 2 — light mode, design IA', 1900);
await iaDesign(await mapper(E2), false);
const s = await fw('save_screenshots', { nodeIds: [E1, E2], outDir: OUT, scale: 1, format: 'PNG' });
console.log(JSON.stringify(s.saved.map((x) => x.path)), 'section', SEC, E1, E2);
close();
