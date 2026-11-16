// Retouches après relecture du rendu v2 (mêmes valeurs que build-v2.mjs), sans reconstruire la section.
import fs from 'node:fs';
import { fw, close } from '../../outils/fw.mjs';
import { info, hug } from '../../outils/kit.mjs';
const { slides } = JSON.parse(fs.readFileSync(new URL('./slides-v2.json', import.meta.url), 'utf8'));
const top = async (id) => (await fw('get_design_context', { nodeId: id, detail: 'minimal', depth: 1 })).nodes[0].children;
const firstText = async (id) => { const r = (await fw('get_design_context', { nodeId: id, detail: 'minimal', depth: 3 })).nodes[0]; const f = (n) => n.type === 'TEXT' ? n : (n.children || []).map(f).find(Boolean); return f(r); };
const at = (id, x, y) => fw('set_position', { nodeId: id, x, y });
// 03 : cartouches plus grands, main sur le dernier
{
  const k = await top(slides[2]);
  let y = 170, i = 0;
  for (const c of k.filter((n) => n.name === 'Frame 4260')) {
    const t = await firstText(c.id);
    await fw('set_text_properties', { nodeId: t.id, fontSize: 27 });
    await hug(c.id, { px: 18, py: 13 });
    await at(c.id, 62 + i * 16, y);
    y += (await info(c.id)).height + 16; i++;
  }
  await at(k.find((n) => n.name === 'Vector 658').id, 352, 395);
}
// 04 : formulation
{
  const k = await top(slides[3]);
  const t = k.find((n) => n.type === 'TEXT' && n.name.startsWith('Créer'));
  await fw('set_text', { nodeId: t.id, characters: 'Créer ton site avec Claude, tu sais déjà faire.\n\nMaintenant, voici comment il aide tes visiteurs à décider.' });
}
// 05 : lignes réparties
{
  const k = await top(slides[4]);
  const keys = k.filter((n) => n.name === 'Frame 4422'), bl = k.filter((n) => n.name === 'Frame 4650'), tg = k.find((n) => n.name === 'Tag');
  let y = (await info(keys[0].id)).y;
  for (let i = 0; i < 3; i++) {
    await at(keys[i].id, 79, y); await at(bl[i].id, 154, y);
    const b = await info(bl[i].id);
    if (i === 2) { const ti = await info(tg.id); await at(tg.id, ti.x, y - ti.height / 2 + 2); }
    y += b.height + 62;
  }
}
// 09 : pas de « fin. » orpheline
{
  const k = await top(slides[8]);
  const t = k.find((n) => n.type === 'TEXT' && n.name.startsWith('Merci'));
  await fw('set_text', { nodeId: t.id, characters: 'Merci d’avoir lu\njusqu’à la fin.\n\nLaquelle tu ajouterais en premier sur ton site\u00A0?' });
}
close();
