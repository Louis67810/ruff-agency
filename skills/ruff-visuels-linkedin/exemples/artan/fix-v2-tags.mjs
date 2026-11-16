// Tags de la slide structure : « Nom » en gras + rôle dessous, largeur bornée à la zone utile (avant la bandelette).
import { fw, close } from '../../outils/fw.mjs';
import { info } from '../../outils/kit.mjs';

const SEC = process.argv[2];
const frames = (await fw('get_design_context', { nodeId: SEC, detail: 'minimal', depth: 1 })).nodes[0].children;
const S = frames.find((f) => f.name.includes('Structure de la page')).id;
const kids = (await fw('get_design_context', { nodeId: S, detail: 'minimal', depth: 2 })).nodes[0].children;
const LIMIT = 532;
for (const t of kids.filter((k) => k.name.startsWith('Tag '))) {
  const n = await info(t.id);
  if (n.x + n.width <= LIMIT) continue;
  const txt = t.children[0].id;
  const nodeTxt = (await fw('get_nodes_info', { nodeIds: [txt] })).nodes[0].characters;
  const [nom, role] = nodeTxt.split(' : ');
  await fw('set_text', { nodeId: txt, characters: `${nom} :\n${role}` });
  const cy = n.y + n.height / 2;
  const m = await info(t.id);
  await fw('set_position', { nodeId: t.id, x: n.x, y: cy - m.height / 2 });
  await fw('set_corner_radius', { nodeId: t.id, radius: 14 });
  console.log('replié', nom, m.width);
}
close();
