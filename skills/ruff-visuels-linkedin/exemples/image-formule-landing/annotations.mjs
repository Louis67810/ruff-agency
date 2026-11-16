// Annotations de la référence : encadrés blancs + check vert source, reliés à la zone de la page.
// Usage : node annotations.mjs <frameId> (supprime et reconstruit les annotations existantes).
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { fw, close } from '../../outils/fw.mjs';
import { C, frame, text, info, badge } from '../../outils/kit.mjs';

const D = JSON.parse(fs.readFileSync(new URL('./contenu.json', import.meta.url), 'utf8'));
const W = 1150, m = 0.84;
const X = (x) => 80 + (x - 50) * m;
const Y = (y) => 392 + (y - 177) * m;
const INK = C.ink, GREY = C.greyText;
const hex = (c) => '#' + [c.r, c.g, c.b].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
const FS = 9.4;
const LIM = { L: 52, R: W - 52 }; // bord extérieur autorisé (à l'intérieur des bandelettes)
const PAGE = { L: X(457) - 14, R: X(838) + 14 }; // une annotation ne déborde pas sur la page
const SHADOW_TAG = [0.05, 0.04, 0.03, 0.01].map((a, i) => ({ type: 'DROP_SHADOW', visible: true, color: { r: 0.36, g: 0.36, b: 0.36, a }, offset: { x: 0, y: [0.8, 2.4, 5.5, 9.5][i] }, radius: [1.6, 2.4, 3.2, 4][i], spread: 0 }));

export async function annotations(F) {
  const old = (await fw('get_design_context', { nodeId: F, detail: 'minimal', depth: 1 })).nodes[0].children
    .filter((k) => ['Annotation', 'Encadré', 'Liaison', 'Flèche'].includes(k.name)).map((k) => k.id);
  if (old.length) await fw('delete_nodes', { nodeIds: old });

  const check = await badge(F, 'check', { x: -100, y: -100, rot: -25, size: 13 });
  const addCheck = async (parent) => { const { nodeId } = await fw('clone_node', { nodeId: check }); await fw('reparent_nodes', { nodeIds: [nodeId], newParentId: parent }); };
  const box = (name) => frame(F, { x: 0, y: 0, w: 100, h: 30, r: 8, fill: C.white, stroke: { color: { r: 0, g: 0, b: 0 }, a: 0.14 }, strokeW: 0.8, effects: SHADOW_TAG, name });
  const layout = async (id, mode, o = {}) => {
    await fw('set_auto_layout', { nodeId: id, layoutMode: mode, paddingLeft: o.pl ?? 8, paddingRight: o.pr ?? 10, paddingTop: o.pt ?? 5.5, paddingBottom: o.pb ?? 5.5, itemSpacing: o.gap ?? 6, primaryAxisAlignItems: 'MIN', counterAxisAlignItems: o.ca || 'MIN' });
    await fw('set_layout_props', { nodeId: id, layoutSizingHorizontal: 'HUG', layoutSizingVertical: 'HUG' });
  };
  // Texte sur une ligne si la place le permet, sinon largeur maximale disponible.
  const fitText = async (parent, s, maxW, size = FS) => {
    const id = await text(parent, s, { x: 0, y: 0, size, family: 'Plus Jakarta Sans', style: 'Bold', lh: 128, ls: -1 });
    const n = await info(id);
    if (n.width > maxW) {
      await fw('resize_nodes', { nodeIds: [id], width: maxW, height: n.height });
      await fw('set_text_properties', { nodeId: id, textAutoResize: 'HEIGHT' });
    }
    return id;
  };
  const room = (side, x1, x2) => (side === 'R' ? LIM.R - Math.max(X(x1), PAGE.R) : Math.min(X(x2), PAGE.L) - LIM.L);

  const items = [];
  for (const [side, x1, y1, x2, y2, s, route] of D.annotations) {
    const b = await box('Annotation');
    await addCheck(b);
    await fitText(b, s, Math.min(room(side, x1, x2), 330) - 34);
    await layout(b, 'HORIZONTAL');
    items.push({ id: b, side, x1, y1, x2, y2, route });
  }
  for (const [side, x1, y1, x2, y2, title, kind, list, route, foot, arrowFrom] of D.encadres) {
    const b = await box('Encadré');
    const bw = Math.min(room(side, x1, x2), 330) - 24;
    await fitText(b, title, bw, FS + 0.4);
    for (const [h, d] of list) {
      const row = await frame(b, { x: 0, y: 0, w: 10, h: 10, fill: null, name: 'Ligne' });
      if (kind === 'check') await addCheck(row);
      else await text(row, '↳', { x: 0, y: 0, size: FS, family: 'Inter', style: 'Medium', color: GREY, ls: 0 });
      await fitText(row, d ? `${h} → ${d}` : h, bw - 20, FS - 0.6);
      await layout(row, 'HORIZONTAL', { pl: 0, pr: 0, pt: 0, pb: 0, gap: 5 });
    }
    if (foot) await fitText(b, foot, bw, FS - 0.4);
    await layout(b, 'VERTICAL', { pl: 11, pr: 11, pt: 9, pb: 9, gap: 6 });
    items.push({ id: b, side, x1, y1, x2, y2, route, arrowFrom });
  }

  // Placement : centré sur la hauteur de la référence, puis écarté si deux annotations d'un même côté se touchent.
  for (const it of items) Object.assign(it, await info(it.id), { cy: Y((it.y1 + it.y2) / 2) });
  for (const side of ['L', 'R']) {
    const col = items.filter((i) => i.side === side).sort((a, b) => a.cy - b.cy);
    let bottom = -Infinity;
    for (const it of col) {
      it.top = Math.max(it.cy - it.height / 2, bottom + 4);
      bottom = it.top + it.height;
      it.left = side === 'R' ? Math.max(X(it.x1), PAGE.R) : Math.min(X(it.x2), PAGE.L) - it.width;
      await fw('set_position', { nodeId: it.id, x: it.left, y: it.top });
    }
  }
  const elbowCount = {};
  for (const it of items) {
    const cy = it.top + Math.min(it.height / 2, 14);
    if (it.route?.length) {
      const start = it.side === 'R' ? [it.left, cy] : [it.left + it.width, cy];
      const pts = [start, ...it.route.map(([rx, ry]) => [X(rx), Y(ry)])];
      if (it.route.length === 1) {
        // liaison simple : coudée hors de la page si l'annotation a été décalée par rapport à sa cible
        const [tx, ty] = pts[1];
        if (Math.abs(ty - cy) <= 6) pts[1][1] = cy; // écart minime : ligne droite
        else {
          // coudes décalés pour que deux liaisons voisines ne partagent pas la même verticale
          const n = (elbowCount[it.side] = (elbowCount[it.side] || 0) + 1);
          const off = 6 + ((n - 1) % 3) * 7;
          const elbow = it.side === 'R' ? PAGE.R + off : PAGE.L - off;
          pts.splice(1, 1, [elbow, cy], [elbow, ty], [tx, ty]);
        }
      } else if (Math.abs(Y(it.route[0][1]) - Y((it.y1 + it.y2) / 2)) < 6) pts[1][1] = cy;
      await connector(F, pts);
    }
    if (it.arrowFrom) {
      const above = items.filter((o) => o.side === it.side && o.top < it.top).sort((a, b) => b.top - a.top)[0];
      const x = X(it.arrowFrom[0]), y0 = above.top + above.height + 2, y1 = it.top - 2, h = y1 - y0;
      if (h > 6) await fw('import_svg', { parentId: F, x: x - 5, y: y0, name: 'Flèche', svg: `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="${h.toFixed(1)}" viewBox="0 0 10 ${h.toFixed(1)}"><path d="M5 0 L5 ${(h - 1).toFixed(1)} M1.5 ${(h - 4.5).toFixed(1)} L5 ${(h - 1).toFixed(1)} L8.5 ${(h - 4.5).toFixed(1)}" fill="none" stroke="${hex(INK)}" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>` });
    }
  }
  await fw('delete_nodes', { nodeIds: [check] });
  // Les annotations passent au-dessus des liaisons.
  const kids = (await fw('get_design_context', { nodeId: F, detail: 'minimal', depth: 1 })).nodes[0].children;
  await fw('reorder_nodes', { nodeIds: items.map((i) => i.id), index: kids.length - 1 });
}

async function connector(F, pts) {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs) - 4, y0 = Math.min(...ys) - 4, w = Math.max(...xs) - x0 + 4, h = Math.max(...ys) - y0 + 4;
  const d = pts.map((p, i) => `${i ? 'L' : 'M'} ${(p[0] - x0).toFixed(1)} ${(p[1] - y0).toFixed(1)}`).join(' ');
  const e = pts[pts.length - 1];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w.toFixed(1)}" height="${h.toFixed(1)}" viewBox="0 0 ${w.toFixed(1)} ${h.toFixed(1)}"><path d="${d}" fill="none" stroke="${hex(INK)}" stroke-width="1"/><circle cx="${(e[0] - x0).toFixed(1)}" cy="${(e[1] - y0).toFixed(1)}" r="2.6" fill="${hex(INK)}"/></svg>`;
  await fw('import_svg', { parentId: F, svg, x: x0, y: y0, name: 'Liaison' });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await annotations(process.argv[2]);
  close();
}
