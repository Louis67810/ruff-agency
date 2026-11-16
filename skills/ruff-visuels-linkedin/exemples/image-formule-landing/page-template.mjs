// Page centrale redessinée avec la template de site de Louis (5424:3826) :
// carte blanche r 15 + contour 19 % + ombre neutre, titres Plus Jakarta Bold #0D1E26,
// texte en barres #E8E8E8, boutons en pilules #383838 sans libellé, images #F3F3F3, bandeaux #FBFBFB.
// Mêmes positions que la première version : les annotations restent valables.
// Usage : node page-template.mjs <frameId>
import { fw, close } from '../../outils/fw.mjs';
import { C, rect, frame, text, info, tag } from '../../outils/kit.mjs';

const F = process.argv[2];
const m = 0.84;
const X = (x) => 80 + (x - 50) * m;
const Y = (y) => 392 + (y - 177) * m;
const px = (x) => (x - 457) * m, py = (y) => (y - 177) * m;
const T = {
  navy: { r: 0.051, g: 0.118, b: 0.149 }, bar: { r: 0.91, g: 0.91, b: 0.91 }, dark: { r: 0.22, g: 0.22, b: 0.22 },
  img: { r: 0.953, g: 0.953, b: 0.953 }, band: { r: 0.984, g: 0.984, b: 0.984 }, hero: { r: 0.851, g: 0.851, b: 0.851 }, mid: { r: 0.72, g: 0.72, b: 0.72 },
};
const SHADOW = [[0.05, 2.4, 5.6], [0.04, 10.4, 10.4], [0.03, 23.2, 13.6], [0.01, 40.8, 16.8]].map(([a, y, r]) => ({ type: 'DROP_SHADOW', visible: true, color: { r: 0, g: 0, b: 0, a }, offset: { x: 0, y }, radius: r, spread: 0 }));

const kids0 = (await fw('get_design_context', { nodeId: F, detail: 'minimal', depth: 1 })).nodes[0].children;
const oldIdx = kids0.findIndex((k) => k.name === 'Landing page');
if (oldIdx >= 0) await fw('delete_nodes', { nodeIds: [kids0[oldIdx].id] });

const P = await frame(F, { x: X(457), y: Y(177), w: 381 * m, h: 1591 * m, r: 15, fill: C.white, stroke: { color: { r: 0, g: 0, b: 0 }, a: 0.19 }, strokeW: 0.93, effects: SHADOW, name: 'Landing page' });
await fw('reorder_nodes', { nodeIds: [P], index: Math.max(oldIdx, 0) });

const bar = (p, x, y, w, h = 5.4, c = T.bar) => rect(p, { x, y, w, h, r: h / 2, fill: c });
const pill = (p, x, y, w = 34, h = 8.4) => rect(p, { x, y, w, h, r: h / 2, fill: T.dark, name: 'Bouton' });
const img = (p, x, y, w, h, r = 5.6, c = T.img, op) => rect(p, { x, y, w, h, r, fill: c, opacity: op, name: 'Image' });
const band = (p, x, y, w, h, name) => frame(p, { x, y, w, h, r: 5.6, fill: T.band, stroke: { color: { r: 0, g: 0, b: 0 }, a: 0.05 }, strokeW: 0.6, name });
const H = async (p, s, cx, y, size, align = 'center') => {
  const id = await text(p, s, { x: 0, y, size, color: T.navy, ls: -3, lh: 105 });
  const n = await info(id);
  await fw('set_position', { nodeId: id, x: align === 'center' ? cx - n.width / 2 : cx, y });
  return id;
};
const CX = px(652);
const cbar = (p, cx, y, w, h) => bar(p, cx - w / 2, y, w, h);
const cpill = (p, cx, y, w = 34, h = 8.4) => pill(p, cx - w / 2, y, w, h);

// navigation
await rect(P, { x: px(521), y: py(201), w: 9, h: 9, r: 2.5, fill: T.navy });
for (let i = 0; i < 3; i++) await bar(P, px(600 + i * 30), py(204), 20, 4);
await pill(P, px(752), py(201), 30, 8.4);
// hero
const eb = await frame(P, { x: CX - 40, y: py(240), w: 80, h: 11, r: 5.5, fill: T.img, name: 'Sur-titre' });
await bar(eb, 10, 3.6, 60, 3.8, T.hero);
await H(P, 'Organise tes échanges, fichiers', CX, py(262), 13.4);
await H(P, 'et outils au même endroit', CX, py(278.5), 13.4);
await cbar(P, CX, py(306), 112, 5.4);
await cpill(P, CX, py(331), 40, 9.4);
await cbar(P, CX, py(353), 56, 3.9, T.mid);
const vid = await img(P, px(547), py(376), 171 * m, 106 * m, 4, T.hero, 0.37);
const play = await frame(P, { x: CX - 8, y: py(429) - 8, w: 16, h: 16, r: 8, fill: C.white, effects: SHADOW, name: 'Lecture' });
await fw('import_svg', { parentId: play, x: 6.2, y: 4.8, svg: '<svg xmlns="http://www.w3.org/2000/svg" width="5.4" height="6.4" viewBox="0 0 7 8"><path d="M0 0 L7 4 L0 8 Z" fill="#383838"/></svg>' });
await cbar(P, CX, py(494), 90, 3.4);
for (let i = 0; i < 6; i++) { await rect(P, { x: px(520 + i * 43), y: py(506), w: 5, h: 5, r: 2.5, fill: T.hero }); await bar(P, px(526 + i * 43), py(507), 24, 3.4); }
// bénéfices
await H(P, 'Pourquoi les équipes adorent l’utiliser', CX, py(534), 9);
for (let i = 0; i < 3; i++) {
  const c = await frame(P, { x: px(502 + i * 99), y: py(567), w: 93 * m, h: 67 * m, r: 5.6, fill: T.img, name: 'Bénéfice' });
  const ic = await frame(c, { x: 39 * m - 1, y: 8 * m, w: 14, h: 14, r: 4, fill: C.white, name: 'Icône' });
  await rect(ic, { x: 4.5, y: 4.5, w: 5, h: 5, r: 1.4, fill: T.dark });
  await bar(c, 18 * m, 30 * m, 57 * m, 4.6, T.mid);
  await bar(c, 14 * m, 41 * m, 65 * m, 3.6); await bar(c, 22 * m, 47 * m, 49 * m, 3.6);
}
await H(P, '“', CX, py(646), 13);
await cbar(P, CX, py(662), 76, 4.4); await cbar(P, CX, py(670), 58, 4.4);
await cbar(P, CX, py(685), 34, 3.4, T.mid);
await cpill(P, CX, py(705), 34, 8.4);
// tarifs
await H(P, 'Des offres pour chaque étape', CX, py(764), 9);
const tg = await frame(P, { x: px(608), y: py(787), w: 82 * m, h: 13 * m, r: 6.5 * m, fill: T.img, name: 'Sélecteur mensuel / annuel' });
await bar(tg, 7, 4.4, 18, 2.8, T.mid);
await rect(tg, { x: 29, y: 2.6, w: 11, h: 6, r: 3, fill: T.dark });
await rect(tg, { x: 34.6, y: 3.4, w: 4.4, h: 4.4, r: 2.2, fill: C.white });
await bar(tg, 44, 4.4, 18, 2.8, T.navy);
await tag(P, '-10 %', { x: px(700), y: py(799), s: 0.42 });
const prices = ['12 €', '48 €', '168 €'];
for (let i = 0; i < 3; i++) {
  const c = await band(P, px(483 + i * 112), py(822), 106 * m, 156 * m, 'Offre');
  if (i === 1) await fw('set_strokes', { nodeId: c, strokes: [{ type: 'SOLID', color: T.dark }], strokeWeight: 1.1, strokeAlign: 'INSIDE' });
  await bar(c, 7 * m, 7 * m, 38 * m, 4.6, T.mid);
  await bar(c, 7 * m, 15 * m, 74 * m, 3); await bar(c, 7 * m, 19.5 * m, 54 * m, 3);
  await text(c, prices[i], { x: 7 * m, y: 31 * m, size: 10, color: T.navy, ls: -3 });
  for (let r = 0; r < 4; r++) {
    const ok = r < 2 + i;
    await rect(c, { x: 7 * m, y: (64 + r * 10) * m, w: 4.2, h: 4.2, r: 2.1, fill: ok ? T.dark : T.hero });
    await bar(c, 14 * m, (65 + r * 10) * m, (r % 2 ? 48 : 60) * m, 3);
  }
  if (i === 2) {
    const ic = await frame(c, { x: 72 * m, y: 63 * m, w: 5.6, h: 5.6, r: 2.8, fill: C.white, stroke: { color: T.dark, a: 0.6 }, strokeW: 0.6, name: 'Icône info' });
    await rect(ic, { x: 2.3, y: 1.4, w: 1, h: 2.8, fill: T.dark });
    const tip = await frame(c, { x: 33 * m, y: 76 * m, w: 74 * m, h: 34 * m, r: 3, fill: T.navy, name: 'Infobulle' });
    for (let r = 0; r < 4; r++) await bar(tip, 5 * m, (6 + r * 6.6) * m, (r === 3 ? 40 : 62) * m, 2.4, { r: 0.6, g: 0.64, b: 0.66 });
  }
  await pill(c, (53 - 22) * m, 126 * m, 44 * m, 8.4);
  await bar(c, (53 - 32) * m, 142 * m, 64 * m, 2.6);
}
const pop = await tag(P, 'Le plus populaire', { x: 0, y: 0, s: 0.4 });
const popi = await info(pop);
await fw('set_position', { nodeId: pop, x: px(701) - popi.width + 4, y: py(822) - popi.height / 2 });
await cbar(P, CX, py(1001), 110, 3.8, T.mid);
for (let i = 0; i < 4; i++) { await rect(P, { x: px(543 + i * 44), y: py(1014), w: 5, h: 5, r: 2.5, fill: T.hero }); await bar(P, px(550 + i * 44), py(1015.3), 26, 3.4); }
// témoignages
await H(P, 'Adoré par les startups du monde entier', CX, py(1066), 9);
for (let i = 0; i < 3; i++) {
  const c = await band(P, px(487 + i * 109), py(1098), 103 * m, 84 * m, 'Témoignage');
  for (let r = 0; r < 6; r++) await bar(c, 7 * m, (8 + r * 7) * m, (r === 3 ? 80 : r === 5 ? 50 : 86) * m, 3, r === 3 ? T.mid : T.bar);
  await rect(c, { x: 7 * m, y: 65 * m, w: 9, h: 9, r: 4.5, fill: T.hero, name: 'Photo' });
  await bar(c, 19 * m, 66 * m, 30 * m, 3, T.mid); await bar(c, 19 * m, 71.5 * m, 40 * m, 2.6);
  await bar(c, 78 * m, 70 * m, 18 * m, 2.6);
}
await cbar(P, CX, py(1199), 64, 3.8, T.mid);
await cpill(P, CX, py(1214), 40, 9);
// FAQ
await H(P, 'Encore des questions ? On a les réponses', CX, py(1259), 9);
const tabs = await frame(P, { x: px(584), y: py(1287), w: 130 * m, h: 14 * m, r: 7 * m, fill: T.img, name: 'Catégories' });
await rect(tabs, { x: 2, y: 2, w: 28, h: 7.8, r: 3.9, fill: C.white });
for (let i = 0; i < 4; i++) await bar(tabs, 7 + i * 27, 4.6, 14, 2.6, i ? T.bar : T.mid);
const q1 = await band(P, px(537), py(1320), 223 * m, 66 * m, 'Question ouverte');
await bar(q1, 8 * m, 8 * m, 110 * m, 4, T.mid);
await bar(q1, 8 * m, 24 * m, 150 * m, 3); await bar(q1, 8 * m, 30.5 * m, 96 * m, 3);
await bar(q1, 8 * m, 48 * m, 120 * m, 3, T.mid);
await rect(q1, { x: 209 * m, y: 8.4 * m, w: 6, h: 1.2, fill: T.dark });
for (let i = 0; i < 2; i++) {
  const c = await band(P, px(537), py(1393 + i * 25), 223 * m, 20 * m, 'Question');
  await bar(c, 8 * m, 8 * m, (i ? 120 : 100) * m, 4, T.mid);
  await rect(c, { x: 209 * m, y: 9.4 * m, w: 6, h: 1.2, fill: T.dark }); await rect(c, { x: 211.4 * m, y: 7 * m, w: 1.2, h: 6, fill: T.dark });
}
await cbar(P, CX, py(1456), 70, 3.4);
await cpill(P, CX, py(1468), 36, 8.6);
// CTA final (bandeau de la template)
const fin = await band(P, px(520), py(1505), 256 * m, 120 * m, 'CTA final');
await text(fin, 'Prêt à simplifier', { x: 13 * m, y: 11 * m, size: 8.4, color: T.navy, ls: -3, lh: 105 });
await text(fin, 'ton organisation ?', { x: 13 * m, y: 21.5 * m, size: 8.4, color: T.navy, ls: -3, lh: 105 });
await bar(fin, 13 * m, 40 * m, 92 * m, 3.8); await bar(fin, 13 * m, 47 * m, 76 * m, 3.8);
await pill(fin, 13 * m, 72 * m, 38, 8.4);
await bar(fin, 13 * m, 102 * m, 40 * m, 3, T.mid);
await img(fin, 132 * m, 12 * m, 110 * m, 96 * m);
// footer
const ft = await band(P, px(482), py(1650), 333 * m, 100 * m, 'Footer');
await rect(ft, { x: 13 * m, y: 13 * m, w: 9, h: 9, r: 2.5, fill: T.navy });
await bar(ft, 13 * m, 30 * m, 74 * m, 3); await bar(ft, 13 * m, 36 * m, 44 * m, 3);
await pill(ft, 13 * m, 54 * m, 32, 8);
for (const [x, n] of [[127, 5], [163, 4], [220, 3], [262, 3]]) {
  await bar(ft, x * m, 12 * m, 22 * m, 3.4, T.mid);
  for (let i = 0; i < n; i++) await bar(ft, x * m, (21 + i * 7) * m, (i % 2 ? 22 : 30) * m, 2.6);
}
await cbar(ft, 166.5 * m, 90 * m, 80 * m, 2.4);
console.log('page', P);
close();
