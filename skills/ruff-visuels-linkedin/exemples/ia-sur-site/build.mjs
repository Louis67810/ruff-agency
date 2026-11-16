// Carrousel « Comment intégrer l'IA à ton site » : 4 façons d'utiliser l'IA pour aider le visiteur à décider.
// Points donnés par Louis (FAQ auto, agent, boutons « Résumer avec », CTA « est-ce fait pour moi ? »).
// Couverture : site devant le cerveau en verre (5406:2995) avec le logo Claude (5480:1575) dedans.
// Angle positif : cartouches bleus. Chaque point = un panneau gris d'illustration + texte d'explication dessous (R22).
import fs from 'node:fs';
import { fw, close } from '../../outils/fw.mjs';
import { C, SHADOW_CARD, rect, frame, text, info, hug, tag, sourceCTA, cloneScaled } from '../../outils/kit.mjs';

const W = 575, N = 7;
const { nodeId: SEC } = await fw('create_section', { name: 'Claude — Carrousel IA sur ton site (v1)', x: 59000, y: -82800, width: N * 625 + 150, height: 1000 });
const slides = [];
async function slide(src, name) {
  const { nodeId } = await fw('clone_node', { nodeId: src });
  await fw('reparent_nodes', { nodeIds: [nodeId], newParentId: SEC });
  await fw('set_position', { nodeId, x: 100 + slides.length * 625, y: 150 });
  await fw('rename_node', { nodeId, name: String(slides.length + 1).padStart(2, '0') + ' ' + name });
  slides.push(nodeId);
  return nodeId;
}
async function tree(id, depth = 6, detail = 'minimal') {
  const r = await fw('get_design_context', { nodeId: id, detail, depth });
  const out = [];
  const walk = (n, d) => { out.push({ ...n, d }); (n.children || []).forEach((c) => walk(c, d + 1)); };
  r.nodes[0].children.forEach((c) => walk(c, 1));
  return out;
}
const top = async (id) => (await tree(id, 1)).filter((n) => n.d === 1);
const firstText = async (id) => (await tree(id)).find((n) => n.type === 'TEXT');
async function setCart(frameId, label, px, py) {
  const t = await firstText(frameId);
  await fw('set_text', { nodeId: t.id, characters: label });
  await fw('set_text_properties', { nodeId: t.id, textAutoResize: 'WIDTH_AND_HEIGHT' });
  await hug(frameId, { px, py });
  return info(frameId);
}
async function pill(frameId, label) {
  const t = await firstText(frameId);
  await fw('set_text', { nodeId: t.id, characters: label });
  await fw('set_auto_layout', { nodeId: frameId, layoutMode: 'HORIZONTAL', paddingLeft: 25, paddingRight: 10, paddingTop: 9, paddingBottom: 9, itemSpacing: 26, primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER' });
  await fw('set_layout_props', { nodeId: frameId, layoutSizingHorizontal: 'HUG', layoutSizingVertical: 'HUG' });
  const p = await info(frameId);
  await fw('set_position', { nodeId: frameId, x: (W - p.width) / 2, y: p.y });
}
const hex = (h, a = 1) => { const n = parseInt(h.slice(1), 16); return { r: (n >> 16 & 255) / 255, g: (n >> 8 & 255) / 255, b: (n & 255) / 255, a }; };
const rgb = (h) => { const c = hex(h); delete c.a; return c; };
async function at(id, x, y) { await fw('set_position', { nodeId: id, x, y }); return id; }
async function centerIn(id, w, y) { const n = await info(id); await at(id, (w - n.width) / 2, y); return n; }
const T = (p, s, o) => text(p, s, { x: 0, y: 0, family: 'Inter', style: 'Semi Bold', ls: 0, color: rgb('#0D1E26'), ...o });
// Template de site de Louis (5424:3826) : titres #0D1E26, texte en barres grises, pilules sombres, blocs image.
const bar = (p, x, y, w, h = 7) => rect(p, { x, y, w, h, r: h / 2, fill: rgb('#E8E8E8') });
const darkPill = (p, x, y, w = 62, h = 14) => rect(p, { x, y, w, h, r: h / 2, fill: rgb('#383838') });
const img = (p, x, y, w, h) => rect(p, { x, y, w, h, r: 8, fill: rgb('#F3F3F3') });
const siteCard = (p, o) => frame(p, { r: 14, fill: C.white, stroke: { color: rgb('#000000'), a: 0.08 }, effects: SHADOW_CARD, ...o });

// Clone mis à l'échelle d'un bouton « Demander à … » du corpus (5406:8047) ; les cadres en auto-layout s'ajustent au nouveau libellé.
async function aiButton(p, src, label, k) {
  const id = await cloneScaled(src, p, k, { x: 0, y: 0 });
  const c = await tree(id, 4, 'full');
  for (const n of [{ id, layout: (await fw('get_node', { nodeId: id })).node.layout }, ...c]) if (n.layout?.mode && n.layout.mode !== 'NONE') await fw('set_layout_props', { nodeId: n.id, layoutSizingHorizontal: 'HUG', layoutSizingVertical: 'HUG' });
  await fw('set_text', { nodeId: c.find((n) => n.type === 'TEXT').id, characters: label });
  return id;
}

// ---------- 01 Couverture (dernière couverture de Louis, 5478:3559)
{
  const S = await slide('5478:3559', 'Couverture');
  const k = await top(S);
  const by = (n) => k.find((c) => c.name === n)?.id;
  await fw('delete_nodes', { nodeIds: k.filter((c) => ['Hero slop', 'Vector 658', 'Group 1021', 'Frame 2147261301'].includes(c.name)).map((c) => c.id) });
  const BLUE = (await fw('get_nodes_info', { nodeIds: ['5406:2484'] })).nodes[0];
  const a = await setCart(by('Frame 4415'), 'Comment intégrer l’IA', 22, 24);
  await fw('set_fills', { nodeId: by('Frame 4214'), fills: BLUE.fills });
  await fw('set_effects', { nodeId: by('Frame 4214'), effects: BLUE.effects });
  const b = await setCart(by('Frame 4214'), 'à ton site', 28, 20);
  await at(by('Frame 4415'), (W - a.width) / 2, 98);
  await at(by('Frame 4214'), (W - b.width) / 2, 98 + a.height + 8);
  await pill(by('Frame 4417'), 'Voici 4 façons de le faire');
  // cerveau (image de Louis) derrière, logo Claude dedans, site devant
  const { nodeId: brain } = await fw('clone_node', { nodeId: '5406:2995' });
  await fw('reparent_nodes', { nodeIds: [brain], newParentId: S });
  await fw('resize_nodes', { nodeIds: [brain], width: 470, height: 470 });
  await at(brain, (W - 470) / 2, 232);
  const logo = await cloneScaled('5480:1575', S, 1.4, { x: 0, y: 0 });
  const site = await siteCard(S, { x: 118, y: 455, w: 340, h: 200, name: 'Site' });
  await rect(site, { x: 16, y: 16, w: 26, h: 8, r: 4, fill: rgb('#383838') });
  for (const [i, w] of [34, 30, 38].entries()) await bar(site, 150 + i * 46, 16, w, 6);
  await darkPill(site, 280, 12, 44, 14);
  const h1 = await text(site, 'Le site qui aide tes visiteurs à choisir', { x: 0, y: 0, size: 15, color: rgb('#0D1E26') });
  await centerIn(h1, 340, 44);
  await bar(site, 105, 74, 130); await bar(site, 125, 85, 90);
  await darkPill(site, 139, 102);
  await img(site, 28, 128, 284, 60);
  const li = await info(logo);
  await at(logo, (W - li.width) / 2, 330);
  // ordre : cerveau, logo, site juste au-dessus des bandelettes / logo Ruff ; fondu, cartouches et pilule au-dessus
  for (const id of [brain, logo, site].reverse()) await fw('reorder_nodes', { nodeIds: [id], index: 5 });
}

// ---------- Slides de points : touche numérotée + cartouche bleu, panneau gris, texte d'explication dessous
async function point(num, titre, explication, draw) {
  const S = await slide('5406:2461', titre);
  const all = await tree(S);
  const k = all.filter((n) => n.d === 1);
  await fw('set_text', { nodeId: all.find((n) => n.type === 'TEXT' && /^\d+$/.test(n.name)).id, characters: String(num) });
  await setCart(k.find((n) => n.name === 'Frame 4650').id, titre, 18, 17.5);
  await fw('delete_nodes', { nodeIds: k.filter((n) => ['Frame 4266', 'Frame 14', 'Frame 2147224256', 'Group 733', 'Vector 729'].includes(n.name) || (n.type === 'TEXT' && n.name.startsWith('Pour pousser'))).map((n) => n.id) });
  const t = await text(S, explication, { x: 61, y: 0, size: 19, w: 452, lh: 130, color: C.ink });
  const ty = Math.min(512, 590 - (await info(t)).height);
  await at(t, 61, ty);
  const h = ty - 29 - 173;
  const P = await frame(S, { x: 62, y: 173, w: 452, h, r: 16, fill: rgb('#EDEDED'), name: 'Illustration : ' + titre });
  await draw(P, 452, h, S);
}

// 1. FAQ qui se génère toute seule
await point(1, 'Une FAQ automatique',
  'Les questions de tes visiteurs deviennent une FAQ, sans que tu l’écrives. Leurs doutes trouvent une réponse avant qu’ils partent.',
  async (P, w, h, S) => {
    const cw = 380, ch = h - 44, cx = (w - cw) / 2, cy = 24;
    const card = await siteCard(P, { x: cx, y: cy, w: cw, h: ch, name: 'Section FAQ' });
    await text(card, 'Questions fréquentes', { x: 20, y: 18, size: 18, color: rgb('#0D1E26') });
    const qs = ['Combien de temps pour avoir mon site ?', 'Je peux le modifier moi-même ?', 'Que se passe-t-il après la mise en ligne ?', 'Vous travaillez avec quels outils ?'];
    let y = 56;
    for (const [i, q] of qs.entries()) {
      await rect(card, { x: 20, y, w: cw - 40, h: 1, fill: rgb('#ECECEC') });
      await T(card, q, { size: 13 }).then((id) => at(id, 20, y + 13));
      await T(card, i === 0 ? '−' : '+', { size: 16, style: 'Medium', color: rgb('#6B7280') }).then((id) => at(id, cw - 34, y + 9));
      y += 42;
      if (i === 0) { await bar(card, 20, y - 6, 290); await bar(card, 20, y + 5, 210); y += 22; }
    }
    const tg = await tag(S, 'Générée à partir de leurs questions', { x: 0, y: 0, s: 1.15 });
    const ti = await info(tg);
    await at(tg, 62 + cx + cw - ti.width + 10, 173 + cy - ti.height / 2);
  });

// 2. Un agent qui aide les visiteurs
await point(2, 'Un agent qui répond',
  'Un agent répond aux questions du visiteur directement sur ta page. Il l’aide à choisir au lieu de le laisser chercher.',
  async (P, w, h) => {
    const site = await siteCard(P, { x: 24, y: 24, w: 260, h: h - 24, name: 'Site' });
    const h1 = await text(site, 'Un site pensé pour ton activité', { x: 20, y: 22, size: 14, color: rgb('#0D1E26'), w: 150, lh: 120 });
    await bar(site, 20, 70, 180); await bar(site, 20, 81, 130); await darkPill(site, 20, 98);
    await img(site, 20, 128, 220, 120);
    const chat = await frame(P, { x: 196, y: 40, w: 236, h: 258, r: 16, fill: C.white, stroke: { color: rgb('#000000'), a: 0.08 }, effects: SHADOW_CARD, name: 'Agent' });
    await rect(chat, { x: 0, y: 0, w: 236, h: 48, fill: rgb('#FAFAFA') });
    await rect(chat, { x: 0, y: 48, w: 236, h: 1, fill: rgb('#EEEEEE') });
    await cloneScaled('5458:4899', chat, 0.55, { x: 14, y: 14 });
    await T(chat, 'Assistant', { size: 13 }).then((id) => at(id, 42, 10));
    await T(chat, 'Répond en direct', { size: 10.5, style: 'Medium', color: rgb('#6B7280') }).then((id) => at(id, 42, 27));
    const bubble = async (label, me, y) => {
      const b = await frame(chat, { x: 0, y, w: 40, h: 20, r: 12, fill: me ? C.blue : rgb('#F1F1F1'), name: me ? 'Visiteur' : 'Agent' });
      const t = await T(b, label, { size: 11.5, style: 'Medium', color: me ? C.white : rgb('#0D1E26'), w: 158, lh: 135 });
      await fw('set_auto_layout', { nodeId: b, layoutMode: 'HORIZONTAL', paddingLeft: 11, paddingRight: 11, paddingTop: 8, paddingBottom: 8 });
      await fw('set_layout_props', { nodeId: b, layoutSizingHorizontal: 'HUG', layoutSizingVertical: 'HUG' });
      const bi = await info(b);
      await at(b, me ? 236 - 12 - bi.width : 12, y);
      return bi.height;
    };
    let y = 62;
    y += await bubble('Vous faites aussi les sites pour les restaurants ?', true, y) + 8;
    y += await bubble('Oui. Je te montre deux exemples proches de ton projet ?', false, y) + 8;
    const inp = await frame(chat, { x: 12, y: 258 - 46, w: 212, h: 34, r: 17, fill: rgb('#F6F6F6'), stroke: { color: rgb('#E5E5E5') }, name: 'Champ' });
    await T(inp, 'Pose ta question…', { size: 11.5, style: 'Medium', color: rgb('#9CA3AF') }).then((id) => at(id, 14, 10));
    const send = await frame(inp, { x: 212 - 30, y: 4, w: 26, h: 26, r: 13, fill: C.blue, name: 'Envoyer' });
    await fw('import_svg', { parentId: send, x: 6, y: 6, svg: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>' });
  });

// 3. Boutons « Résumer ce contenu avec »
await point(3, 'Résumer avec une IA',
  'Un bouton envoie ta page à Claude ou ChatGPT, qui la résume. Le visiteur comprend ton offre en quelques secondes.',
  async (P, w, h) => {
    const cw = 404, cx = (w - cw) / 2;
    const card = await siteCard(P, { x: cx, y: 24, w: cw, h: h - 48, name: 'Page' });
    await text(card, 'Comment se passe la création de ton site', { x: 20, y: 20, size: 17, color: rgb('#0D1E26'), w: 300, lh: 120 });
    for (const [i, ww] of [360, 330, 350, 240].entries()) await bar(card, 20, 72 + i * 12, ww);
    await rect(card, { x: 20, y: 132, w: cw - 40, h: 1, fill: rgb('#ECECEC') });
    await T(card, 'Résumer ce contenu avec :', { size: 12.5, style: 'Medium', color: rgb('#6B7280') }).then((id) => at(id, 20, 146));
    const ids = [];
    for (const [src, l] of [['5406:8072', 'Claude'], ['5406:8060', 'ChatGPT'], ['5406:8054', 'Perplexity']]) ids.push(await aiButton(card, src, l, 0.72));
    let x = 20, y = 172;
    for (const id of ids) { const n = await info(id); if (x + n.width > cw - 12) { x = 20; y += n.height + 8; } await at(id, x, y); x += n.width + 8; }
  });

// 4. CTA « Est-ce fait pour moi ? »
await point(4, 'Est-ce fait pour moi ?',
  'Le visiteur demande à une personne ou à une IA si ton service lui correspond. Il décide avec une réponse, pas avec un doute.',
  async (P, w, h) => {
    const cw = 404, cx = (w - cw) / 2;
    const card = await siteCard(P, { x: cx, y: 24, w: cw, h: h - 48, name: 'Offre' });
    await text(card, 'Création de site', { x: 20, y: 20, size: 18, color: rgb('#0D1E26') });
    await bar(card, 20, 52, 300); await bar(card, 20, 63, 220);
    const cta = await sourceCTA(card, 'Est-ce fait pour moi ?', { x: 20, y: 84, s: 0.58 });
    const ci = await info(cta);
    const menu = await frame(card, { x: 20, y: 84 + ci.height + 10, w: 280, h: 104, r: 12, fill: C.white, stroke: { color: rgb('#000000'), a: 0.08 }, effects: SHADOW_CARD, name: 'Choix' });
    // photo de Louis (signature) pour la personne, logo Claude pour l'IA
    const { nodeId: ph } = await fw('clone_node', { nodeId: '5406:3026' });
    await fw('reparent_nodes', { nodeIds: [ph], newParentId: menu });
    await fw('resize_nodes', { nodeIds: [ph], width: 32, height: 32 });
    await fw('set_corner_radius', { nodeId: ph, radius: 16 });
    await at(ph, 14, 10);
    await T(menu, 'Demander à l’équipe', { size: 14 }).then((id) => at(id, 56, 17));
    await rect(menu, { x: 14, y: 52, w: 252, h: 1, fill: rgb('#EEEEEE') });
    await cloneScaled('5480:1575', menu, 0.48, { x: 14, y: 61 });
    await T(menu, 'Demander à l’IA', { size: 14 }).then((id) => at(id, 56, 69));
    for (const yy of [17, 69]) await T(menu, '›', { size: 18, style: 'Medium', color: rgb('#9CA3AF') }).then((id) => at(id, 254, yy - 4));
  });

// ---------- Conclusion (dernière slide texte de Louis, 5478:4139)
{
  const S = await slide('5478:4139', 'Conclusion');
  const k = await top(S);
  const b = k.find((c) => c.type === 'TEXT' && c.name.startsWith('Un seul')).id;
  await fw('set_text', { nodeId: b, characters: 'Utiliser l’IA sur ton site, ce n’est pas faire un site généré par IA.\n\nC’est donner au visiteur une raison de rester.\n\nLaquelle tu ajouterais en premier ?' });
  await fw('set_position', { nodeId: b, x: 71, y: 96 });
  const pl = k.find((c) => c.name === 'Frame 4417').id;
  await pill(pl, 'Dis-le-moi en commentaire');
  const pi = await info(pl); await at(pl, pi.x, 532);
}

await slide('5478:4245', 'Merci');
fs.writeFileSync(new URL('./slides.json', import.meta.url), JSON.stringify({ section: SEC, slides }, null, 1));
console.log('section', SEC, slides.length);
close();
