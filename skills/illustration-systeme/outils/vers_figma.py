"""Convertit une scène HTML du moteur en SVG « natif Figma » + réglages à reposer après import.

    python vers_figma.py page.html sortie_prefixe [selecteur=.il-scene]
Produit : <prefixe>.svg   (à importer avec Figwright import_svg : calques nommés, textes éditables, groupes)
          <prefixe>.json  ({"effets": {nom: [effets Figma]}, "textes": {nom: {famille, poids, taille, interlettre}}})
Après l'import : retrouver les nœuds par nom, puis set_effects (ombres, flous) et set_text_properties (polices),
car l'import SVG de Figma supprime les ombres et remplace les polices.
"""
import html
import json
import os
import re
import subprocess
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from rendu import chrome  # noqa: E402

JS = r'''
(function(){
const SEL = "__SEL__";
const root = document.querySelector(SEL);
const R = root.getBoundingClientRect();
const out = []; const defs = []; const effets = {}; const textes = {}; let n = 0, gid = 0;
const f1 = v => Math.round(v * 10) / 10;
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function rgba(c){ const m = c && c.match(/rgba?\(([^)]+)\)/); if(!m) return null;
  const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number); const a = p.length > 3 ? p[3] : 1;
  return {hex: '#' + p.slice(0,3).map(x => Math.round(x).toString(16).padStart(2,'0')).join(''), a: a, r: p[0]/255, g: p[1]/255, b: p[2]/255}; }
function paint(c, k){ const v = rgba(c); if(!v || v.a === 0) return null; return `${k}="${v.hex}"` + (v.a < 1 ? ` ${k}-opacity="${f1(v.a*100)/100}"` : ''); }
function splitList(s){ return s.split(/,(?![^(]*\))/).map(x => x.trim()).filter(Boolean); }
function shadows(s, isFilter){ const res = []; if(!s || s === 'none') return res;
  const items = isFilter ? (s.match(/drop-shadow\((?:[^()]|\([^)]*\))*\)/g) || []).map(x => x.slice(12, -1)) : splitList(s);
  for(const it of items){ const c = rgba(it); if(!c) continue; const nums = (it.replace(/rgba?\([^)]*\)/,'').match(/-?[\d.]+px/g) || []).map(parseFloat);
    const inset = /inset/.test(it); if(c.a === 0) continue;
    res.push({type: inset ? 'INNER_SHADOW' : 'DROP_SHADOW', visible: true, color: {r: c.r, g: c.g, b: c.b, a: c.a}, offset: {x: nums[0]||0, y: nums[1]||0}, radius: isFilter ? (nums[2]||0) : (nums[2]||0), spread: isFilter ? 0 : (nums[3]||0)}); }
  return res; }
function label(el){ const c = (el.className && el.className.baseVal !== undefined) ? el.className.baseVal : (el.className || '');
  const map = [['il-frame','Cadre double'],['il-card','Carte'],['n-chip','Étiquette'],['il-mark','Marque'],['n-tile','Tuile appli'],['n-bar','Barre'],['n-tab','Onglet'],
    ['il-tray','Plateau'],['n-ava','Avatar'],['n-dots','Points fenêtre'],['il-cursor','Curseur'],['n-h','Poignée'],['il-backdrop','App floutée'],['il-svg','Décor'],['n-win','Fenêtre'],['n-pillbtn','Bouton'],['il-label','Étiquette']];
  for(const [k,v] of map) if((' '+c+' ').includes(' '+k+' ')) return v;
  if(el.tagName.toLowerCase() === 'svg') return 'Icône';
  return 'Bloc'; }
function rad(cs, w, h){ let r = cs.borderTopLeftRadius; if(!r) return 0; if(r.endsWith('%')) return Math.min(w,h) * parseFloat(r) / 100; return Math.min(parseFloat(r) || 0, Math.min(w,h)/2); }
function gradient(bgi, x, y, w, h){
  const m = bgi.match(/linear-gradient\((.*)\)$/); if(!m) return null; const parts = splitList(m[1]); let ang = 180;
  if(/deg/.test(parts[0])) { ang = parseFloat(parts.shift()); } else if(/^to /.test(parts[0])) { const t = parts.shift(); ang = t.includes('right') ? 90 : t.includes('left') ? 270 : t.includes('top') ? 0 : 180; }
  const id = 'g' + (++gid); const rr = (ang - 90) * Math.PI / 180;
  const x1 = 0.5 - Math.cos(rr)/2, y1 = 0.5 - Math.sin(rr)/2, x2 = 0.5 + Math.cos(rr)/2, y2 = 0.5 + Math.sin(rr)/2;
  const stops = parts.map((p, i) => { const c = rgba(p); const pos = (p.match(/([\d.]+)%/) || [])[1]; const o = pos !== undefined ? pos/100 : (parts.length > 1 ? i/(parts.length-1) : 0);
    return c ? `<stop offset="${f1(o*100)/100}" stop-color="${c.hex}"${c.a < 1 ? ` stop-opacity="${f1(c.a*100)/100}"` : ''}/>` : ''; }).join('');
  defs.push(`<linearGradient id="${id}" x1="${f1(x1*100)/100}" y1="${f1(y1*100)/100}" x2="${f1(x2*100)/100}" y2="${f1(y2*100)/100}">${stops}</linearGradient>`);
  return `fill="url(#${id})"`; }
function inlineSvg(svg, x, y, w, h, name){
  const cl = svg.cloneNode(true);
  const src = svg.querySelectorAll('*'), dst = cl.querySelectorAll('*');
  const props = ['fill','stroke','stroke-width','stroke-opacity','fill-opacity','opacity','stroke-dasharray','stroke-linecap','stroke-linejoin','stop-color','stop-opacity'];
  const outer = getComputedStyle(svg);
  for(let i = 0; i < src.length; i++){ const s = src[i], d = dst[i]; const tag = s.tagName.toLowerCase();
    if(['defs','symbol','lineargradient','radialgradient','pattern','clippath','mask','filter','title'].includes(tag)) { if(tag==='filter') d.remove(); continue; }
    const cs = getComputedStyle(s);
    for(const p of props){ let v = cs.getPropertyValue(p); if(!v) continue;
      if(p.startsWith('stop')) { const c = rgba(v); if(p==='stop-color' && c){ d.setAttribute('stop-color', c.hex); if(c.a<1) d.setAttribute('stop-opacity', c.a);} else if(p==='stop-opacity') {} continue; }
      if(p === 'fill' || p === 'stroke'){ if(v.startsWith('url')) { const u = v.match(/#([^"')]+)/); if(u) d.setAttribute(p, `url(#${u[1]})`); continue; } if(v === 'none'){ d.setAttribute(p,'none'); continue; }
        const c = rgba(v); if(c){ d.setAttribute(p, c.hex); if(c.a < 1) d.setAttribute(p + '-opacity', c.a); } continue; }
      if(p === 'opacity' && v === '1') continue; if(p === 'stroke-dasharray' && v === 'none') continue;
      d.setAttribute(p, v.replace(/px/g,'')); }
    d.removeAttribute('style'); d.removeAttribute('class'); d.removeAttribute('filter');
    if(tag === 'use'){ const ref = s.getAttribute('href') || s.getAttribute('xlink:href'); const sym = document.querySelector(ref);
      if(sym){ const vb = sym.getAttribute('viewBox'); const uw = s.getAttribute('width') || w, uh = s.getAttribute('height') || h;
        const ucs = getComputedStyle(svg); let inner = sym.innerHTML.replace(/currentColor/g, rgba(ucs.color) ? rgba(ucs.color).hex : '#000');
        const g = document.createElementNS('http://www.w3.org/2000/svg','svg'); g.setAttribute('x', s.getAttribute('x')||0); g.setAttribute('y', s.getAttribute('y')||0);
        g.setAttribute('width', uw); g.setAttribute('height', uh); if(vb) g.setAttribute('viewBox', vb); g.setAttribute('overflow','visible');
        const fc = rgba(ucs.fill), sc = rgba(ucs.stroke);
        g.innerHTML = `<g fill="${ucs.fill === 'none' ? 'none' : (fc ? fc.hex : '#000')}"${fc && fc.a<1 ? ` fill-opacity="${fc.a}"`:''} stroke="${ucs.stroke === 'none' || !sc ? 'none' : sc.hex}" stroke-width="${parseFloat(ucs.strokeWidth)||0}" stroke-linejoin="${ucs.strokeLinejoin}" stroke-linecap="${ucs.strokeLinecap}">${inner}</g>`;
        d.replaceWith(g); } } }
  cl.removeAttribute('style'); cl.removeAttribute('class');
  const vb = svg.getAttribute('viewBox') || `0 0 ${w} ${h}`;
  let t = '';
  const m = outer.transform; if(m && m !== 'none'){ const v = m.match(/matrix\(([^)]+)\)/); if(v){ const k = v[1].split(',').map(Number); if(k[0] < 0 || k[3] < 0) t = ` transform="translate(${f1(x + w/2)} ${f1(y + h/2)}) scale(${k[0]<0?-1:1} ${k[3]<0?-1:1}) translate(${f1(-x - w/2)} ${f1(-y - h/2)})"`; } }
  return `<g id="${esc(name)}"${t}><svg x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" viewBox="${vb}" overflow="visible">${cl.innerHTML}</svg></g>`; }

// rotations : on les enlève pour mesurer, on les remet en groupe
const rots = new Map();
for(const el of root.querySelectorAll('*')){ if(el instanceof SVGElement && el.tagName.toLowerCase() !== 'svg') continue;
  const t = getComputedStyle(el).transform; const v = t && t.match(/matrix\(([^)]+)\)/);
  if(v){ const k = v[1].split(',').map(Number); const a = Math.atan2(k[1], k[0]) * 180 / Math.PI; if(Math.abs(a) > .5 && Math.abs(a) < 179){ rots.set(el, a); el.style.transform = 'none'; } } }

function walk(el){
  const cs = getComputedStyle(el); if(cs.display === 'none' || cs.visibility === 'hidden') return;
  const b = el.getBoundingClientRect(); const x = b.left - R.left, y = b.top - R.top, w = b.width, h = b.height;
  const tag = el.tagName.toLowerCase(); const op = parseFloat(cs.opacity);
  const name = label(el) + ' ' + (++n);
  const fxs = shadows(cs.filter, true); const blur = (cs.filter.match(/blur\(([\d.]+)px\)/) || [])[1];
  let open = `<g id="${esc(name)}"`; if(op < 1) open += ` opacity="${f1(op*100)/100}"`;
  if(rots.has(el)) open += ` transform="rotate(${f1(rots.get(el))} ${f1(x + w/2)} ${f1(y + h/2)})"`;
  out.push(open + '>');
  const gfx = fxs.slice(); if(blur) gfx.push({type: 'LAYER_BLUR', visible: true, radius: parseFloat(blur)});
  if(gfx.length) effets[name] = gfx;
  if(tag === 'svg'){ out.push(inlineSvg(el, x, y, w, h, 'Dessin ' + n)); out.push('</g>'); return; }
  if(tag === 'img'){ const s = el.getAttribute('src') || '';
    if(s.startsWith('data:image/svg+xml;base64,')){ let t = atob(s.split(',')[1]); t = t.replace(/<\?xml[^>]*>/,'');
      t = t.replace(/<svg([^>]*)>/, (m0, a) => `<svg${a.replace(/\s(width|height|x|y)="[^"]*"/g,'')} x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}">`); out.push(t); }
    else out.push(`<image x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" href="${s}"/>`);
    out.push('</g>'); return; }
  // boîte
  const bg = rgba(cs.backgroundColor); const bgi = cs.backgroundImage; const bw = parseFloat(cs.borderTopWidth) || 0; const bc = rgba(cs.borderTopColor);
  const sh = shadows(cs.boxShadow, false);
  const inline = cs.display === 'inline';
  const rects = inline ? Array.from(el.getClientRects()) : [b];
  const rx = rad(cs, w, h);
  let fill = null;
  if(bgi && bgi !== 'none'){
    if(/radial-gradient/.test(bgi) && /px/.test(cs.backgroundSize)){ // trame de points
      const sz = parseFloat(cs.backgroundSize); const c = rgba(bgi); const pid = 'p' + (++gid);
      defs.push(`<pattern id="${pid}" width="${sz}" height="${sz}" patternUnits="userSpaceOnUse"><circle cx="${sz/2}" cy="${sz/2}" r="1.3" fill="${c.hex}" fill-opacity="${c.a}"/></pattern>`);
      fill = `fill="url(#${pid})"`;
    } else if(/linear-gradient/.test(bgi)) fill = gradient(bgi, x, y, w, h);
    else if(/radial-gradient/.test(bgi)) { const c = rgba(bgi); const rid = 'r' + (++gid);
      defs.push(`<radialGradient id="${rid}"><stop offset="0" stop-color="${c.hex}" stop-opacity="${c.a}"/><stop offset="1" stop-color="${c.hex}" stop-opacity="0"/></radialGradient>`); fill = `fill="url(#${rid})"`; }
  }
  if(!fill && bg && bg.a > 0) fill = paint(cs.backgroundColor, 'fill');
  const stroke = bw > 0 && bc && bc.a > 0 ? `${paint(cs.borderTopColor,'stroke')} stroke-width="${bw}"${cs.borderTopStyle === 'dashed' ? ' stroke-dasharray="4 4"' : ''}` : '';
  if(fill || stroke || sh.length){
    rects.forEach((q, i) => { const qx = q.left - R.left, qy = q.top - R.top; const fid = name + (rects.length > 1 ? '·' + i : '') + ' fond';
      out.push(`<rect id="${esc(fid)}" x="${f1(qx + bw/2)}" y="${f1(qy + bw/2)}" width="${f1(q.width - bw)}" height="${f1(q.height - bw)}"${rx ? ` rx="${f1(rx)}"` : ''} ${fill || 'fill="#ffffff" fill-opacity="0"'} ${stroke}/>`);
      if(sh.length) effets[fid] = sh; });
    // masque radial (trame) : voile du fond du décor vers les bords
    if(/radial-gradient/.test(cs.maskImage || cs.webkitMaskImage || '') && fill && fill.includes('url(#p')){
      const bgc = rgba(getComputedStyle(root).backgroundColor) || {hex:'#f7f5f3'}; const vid = 'v' + (++gid);
      defs.push(`<radialGradient id="${vid}" cx=".5" cy=".5" r=".62"><stop offset=".45" stop-color="${bgc.hex}" stop-opacity="0"/><stop offset="1" stop-color="${bgc.hex}" stop-opacity="1"/></radialGradient>`);
      out.push(`<rect id="Voile trame" x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="url(#${vid})"/>`); }
  }
  if(tag === 'li' && cs.listStyleType === 'disc'){ const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.4; const c = rgba(cs.color) || {hex:'#333', a:1};
    out.push(`<circle id="Puce ${n}" cx="${f1(x - 9)}" cy="${f1(y + lh/2)}" r="2" fill="${c.hex}"${c.a<1?` fill-opacity="${c.a}"`:''}/>`); }
  // enfants (ordre d'empilement : z-index puis ordre du document)
  const kids = Array.from(el.childNodes).map((k, i) => ({k, i, z: k.nodeType === 1 ? (parseInt(getComputedStyle(k).zIndex) || 0) : 0})).sort((a, b) => a.z - b.z || a.i - b.i);
  for(const {k} of kids){
    if(k.nodeType === 3){ const txt = k.textContent.replace(/\s+/g, ' '); if(!txt.trim()) continue;
      const pcs = getComputedStyle(el); const words = []; const rg = document.createRange(); const raw = k.textContent; let re = /\S+/g, m;
      while((m = re.exec(raw))){ rg.setStart(k, m.index); rg.setEnd(k, m.index + m[0].length); const q = rg.getBoundingClientRect(); if(q.width) words.push({t: m[0], x: q.left - R.left, y: q.top - R.top, h: q.height, r: q.right - R.left}); }
      if(!words.length) continue; const lines = [];
      for(const wd of words){ const L = lines[lines.length-1]; if(L && Math.abs(L.y - wd.y) < 3) { L.t += ' ' + wd.t; L.r = wd.r; } else lines.push({...wd}); }
      const tname = txt.trim().slice(0, 40); const fs = parseFloat(pcs.fontSize); const c = rgba(pcs.color) || {hex:'#000', a:1};
      let s = `<text id="${esc(tname)} ${++n}" font-family="${pcs.fontFamily.split(',')[0].replace(/["']/g,'').trim()}" font-size="${fs}" font-weight="${pcs.fontWeight}" fill="${c.hex}"${c.a<1?` fill-opacity="${c.a}"`:''}${pcs.letterSpacing !== 'normal' ? ` letter-spacing="${parseFloat(pcs.letterSpacing)}"` : ''}>`;
      for(const L of lines){ let t = L.t; if(pcs.textTransform === 'uppercase') t = t.toUpperCase(); s += `<tspan x="${f1(L.x)}" y="${f1(L.y + L.h * 0.78)}">${esc(t)}</tspan>`; }
      out.push(s + '</text>');
      textes[`${tname} ${n}`] = {famille: pcs.fontFamily.split(',')[0].replace(/["']/g,'').trim(), poids: pcs.fontWeight, taille: fs, interlettre: pcs.letterSpacing === 'normal' ? 0 : parseFloat(pcs.letterSpacing)};
    } else if(k.nodeType === 1) walk(k);
  }
  out.push('</g>');
}
const bgc = rgba(getComputedStyle(root).backgroundColor);
for(const k of root.children) walk(k);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${f1(R.width)}" height="${f1(R.height)}" viewBox="0 0 ${f1(R.width)} ${f1(R.height)}"><defs>${defs.join('')}</defs>` +
  (bgc ? `<rect id="Fond" width="${f1(R.width)}" height="${f1(R.height)}" fill="${bgc.hex}"/>` : '') + out.join('') + '</svg>';
const pre = document.createElement('pre'); pre.id = '__out'; pre.textContent = JSON.stringify({svg, effets, textes}); document.body.appendChild(pre);
})();
'''


def allege(svg):
    """Arbre de calques propre : retire les valeurs par défaut, dissout les groupes « Bloc »/« Dessin » sans rôle."""
    import xml.etree.ElementTree as ET
    NS = 'http://www.w3.org/2000/svg'
    ET.register_namespace('', NS)
    root = ET.fromstring(svg)
    defaults = {'stroke-opacity': '1', 'fill-opacity': '1', 'stroke-linejoin': 'miter', 'stroke-linecap': 'butt', 'opacity': '1'}
    for el in root.iter():
        tag = el.tag.split('}')[-1]
        for k, v in list(el.attrib.items()):
            if defaults.get(k) == v or (k == 'stop-color' and tag != 'stop') or (k == 'stop-opacity' and tag != 'stop'):
                del el.attrib[k]
        if el.get('stroke') == 'none':
            for k in ('stroke-width', 'stroke-linejoin', 'stroke-linecap', 'stroke-opacity'):
                el.attrib.pop(k, None)

    def unwrap(parent):
        i = 0
        while i < len(parent):
            ch = parent[i]
            unwrap(ch)
            tag = ch.tag.split('}')[-1]
            gid = ch.get('id', '')
            if tag == 'g' and len(ch) == 0:
                parent.remove(ch)
                continue
            if tag == 'g' and set(ch.attrib) <= {'id'} and (gid.startswith('Bloc ') or gid.startswith('Dessin ') or len(ch) == 1):
                kids = list(ch)
                if len(kids) == 1 and kids[0].tag.split('}')[-1] in ('g', 'svg') and not gid.startswith(('Bloc ', 'Dessin ')):
                    kids[0].set('id', gid) if kids[0].tag.split('}')[-1] == 'g' else None
                parent.remove(ch)
                for j, k in enumerate(kids):
                    parent.insert(i + j, k)
                continue
            i += 1
    unwrap(root)
    return ET.tostring(root, encoding='unicode')


def convertit(page, prefixe, sel='.il-scene'):
    src = open(page, encoding='utf-8').read()
    tmp = os.path.join(os.path.dirname(os.path.abspath(page)), '_vf.html')
    open(tmp, 'w', encoding='utf-8').write(src.replace('</body>', f'<script>window.addEventListener("load",()=>setTimeout(()=>{{{JS.replace("__SEL__", sel)}}},600));</script></body>'))
    r = subprocess.run([chrome(), '--headless=new', '--disable-gpu', '--no-sandbox', '--allow-file-access-from-files', f'--user-data-dir={tempfile.mkdtemp()}',
                        '--window-size=1400,1200', '--virtual-time-budget=9000', '--dump-dom', 'file:///' + tmp.replace(os.sep, '/')], capture_output=True, timeout=180)
    os.remove(tmp)
    dom = r.stdout.decode('utf-8', 'ignore')
    m = re.search(r'<pre id="__out">(.*?)</pre>', dom, re.S)
    data = json.loads(html.unescape(m.group(1)))
    data['svg'] = allege(data['svg'])
    open(prefixe + '.svg', 'w', encoding='utf-8').write(data['svg'])
    json.dump({'effets': data['effets'], 'textes': data['textes']}, open(prefixe + '.json', 'w', encoding='utf-8'), ensure_ascii=False)
    return len(data['svg']), len(data['effets']), len(data['textes'])


if __name__ == '__main__':
    print(convertit(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else '.il-scene'))
