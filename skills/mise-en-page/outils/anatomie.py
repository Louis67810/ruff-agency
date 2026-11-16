"""Découpe chaque section du template (snapshot Figwright pleine précision) en items.
Sortie : un JSON par section + un markdown lisible (arbre des blocs, items rangés par rôle).
python anatomie.py <dossier_snapshots> <dossier_sortie>
"""
import json, os, sys, collections

SNAP, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)

SECTIONS = [
 ('navigation', '6001-21'), ('hero-produit', '6001-63'), ('hero-produit-demo', '6001-345'),
 ('hero-corrige-louis', '6058-801'),
 ('fonctionnalites-video-chiffres', '6001-13775'), ('temoignage-client', '6001-572'),
 ('probleme-solution', '6001-671'), ('plateforme-liste', '6001-896'), ('etapes-onglets', '6001-1072'),
 ('trois-ecrans', '6001-1227'), ('bento-2x2', '6001-6161'), ('comparatif', '6001-5652'),
 ('integrations', '6001-1587'), ('croissance', '6001-10497'), ('tarifs', '6001-10682'),
 ('international', '6027-2625'), ('blog-grille', '6027-608'), ('temoignages', '6027-2444'),
 ('faq', '6027-1120'), ('cta-final-fond', '6027-8953'), ('cta-final-contenu', '6027-10187'),
 ('pied-de-page', '6027-2763'), ('hero-contact', '4001-15087'), ('banniere-cta', '4001-23965'),
 ('hero-blog', '4001-30233'), ('blog-liste', '4001-30377'), ('equipe', '6029-13168'),
 ('article', '4001-33395'), ('hero-liste-attente', '4001-44873'), ('hero-a-propos', '4001-49008'),
 ('histoire-frise', '4001-50134'), ('culture', '4001-50364'), ('presence-mondiale', '4001-50324'),
 ('texte-legal', '4001-37167'), ('page-404', '4001-51299'),
]

def count(n, t):
    c = 1 if n.get('type') in t else 0
    for ch in n.get('children', []) or []:
        c += count(ch, t)
    return c

def texts(n):
    out = []
    if n.get('type') == 'TEXT':
        out.append(n)
    for ch in n.get('children', []) or []:
        out += texts(ch)
    return out

def fills_of(n, st):
    f = n.get('fills')
    if isinstance(f, str):
        f = st.get(f)
    if isinstance(n.get('fill'), str):
        f = st.get(n['fill'])
    return f or []

def color(n, st, key='fill'):
    ref = n.get(key) or n.get(key + 's')
    v = st.get(ref) if isinstance(ref, str) else ref
    if isinstance(v, list) and v:
        p = v[0]
        if isinstance(p, dict):
            if p.get('type') == 'IMAGE':
                return 'image'
            if p.get('type', '').startswith('GRADIENT'):
                return 'dégradé'
            return p.get('color', '?')
        return str(p)
    return None

def text_role(n, st):
    s = st.get(n.get('textStyle'), {}) if isinstance(n.get('textStyle'), str) else (n.get('style') or {})
    fam, size, w = s.get('fontFamily', '?'), s.get('fontSize', 0), s.get('fontStyle', '')
    if 'Mono' in fam:
        r = 'surtitre / étiquette mono'
    elif size >= 60:
        r = 'titre géant'
    elif size >= 40:
        r = 'titre de section'
    elif size >= 24:
        r = 'titre de carte'
    elif size >= 19 and 'Semi' in w or size >= 19 and 'Bold' in w:
        r = 'titre de bloc'
    elif size >= 17:
        r = 'texte d’intro'
    elif size >= 15:
        r = 'texte / libellé'
    else:
        r = 'petit texte'
    return r, f"{fam} {w} {size}", s

ST = {}
def big_text(n):
    if n.get('type') != 'TEXT':
        return False
    s = ST.get(n.get('textStyle'), {}) if isinstance(n.get('textStyle'), str) else (n.get('style') or {})
    return (s.get('fontSize') or 0) >= 15 or 'Mono' in (s.get('fontFamily') or '')

def text_block(ch):
    """enfant direct qui porte du contenu de section (titre, texte) hors illustration"""
    if big_text(ch):
        return True
    if ch.get('type') in ('FRAME', 'GROUP', 'INSTANCE', 'COMPONENT'):
        bt = [t for t in texts(ch) if big_text(t)]
        vec = count(ch, ('VECTOR', 'BOOLEAN_OPERATION', 'ELLIPSE'))
        return len(bt) >= 1 and (vec < 40 or len(bt) >= 2 and any(text_block(c) for c in ch.get('children', []) or []))
    return False

def sty(t):
    return ST.get(t.get('textStyle'), {}) if isinstance(t.get('textStyle'), str) else (t.get('style') or {})

def section_text(t):
    s = sty(t)
    return 'Switzer' in (s.get('fontFamily') or '') or (s.get('fontSize') or 0) >= 20

def is_illustration(n):
    if n.get('type') not in ('FRAME', 'GROUP', 'INSTANCE', 'COMPONENT'):
        return False
    w, h = n.get('width', 0), n.get('height', 0)
    if w < 140 or h < 120:
        return False
    tt = texts(n)
    if any(section_text(t) for t in tt):
        return False
    vec = count(n, ('VECTOR', 'BOOLEAN_OPERATION', 'ELLIPSE', 'STAR', 'POLYGON'))
    long_txt = [t for t in tt if (sty(t).get('fontSize') or 0) >= 16 and not any(ch.isdigit() for ch in (t.get('characters') or '')[:3])]
    if long_txt:
        return False
    if vec >= 40:
        return True
    small = [t for t in tt if (sty(t).get('fontSize') or 0) < 16]
    return (vec >= 15 and len(tt) <= 6) or len(small) >= 6

def is_illustration_loose(n):
    tt = texts(n)
    if any((sty(t).get('fontSize') or 0) >= 16 and not any(c.isdigit() for c in (t.get('characters') or '')[:3]) for t in tt):
        return False
    def nodes(x):
        return 1 + sum(nodes(c) for c in x.get('children', []) or [])
    return nodes(n) >= 15

def is_decor(n):
    if n.get('type') not in ('FRAME', 'GROUP', 'INSTANCE'):
        return False
    return count(n, ('TEXT',)) == 0 and count(n, ('VECTOR', 'BOOLEAN_OPERATION', 'ELLIPSE', 'RECTANGLE', 'LINE')) <= 12 and n.get('width', 0) >= 150 and (n.get('x', 0) < 0 or n.get('y', 0) < 0)

def is_button(n, st):
    if n.get('type') not in ('FRAME', 'INSTANCE', 'COMPONENT'):
        return False
    h = n.get('height', 0)
    r = n.get('cornerRadius', 0) or 0
    t = texts(n)
    return 30 <= h <= 60 and (isinstance(r, (int, float)) and r >= 15) and 1 <= len(t) <= 2 and n.get('width', 0) < 420

def is_joint(n):
    return n.get('type') in ('ELLIPSE', 'FRAME', 'RECTANGLE', 'INSTANCE') and 6 <= n.get('width', 0) <= 12 and 6 <= n.get('height', 0) <= 12

def is_line(n):
    if n.get('type') == 'LINE':
        return True
    if n.get('type') in ('RECTANGLE', 'FRAME') and (n.get('height', 9) <= 2 or n.get('width', 9) <= 2) and max(n.get('width', 0), n.get('height', 0)) >= 40:
        return True
    return False

def is_icon(n):
    return n.get('type') in ('FRAME', 'INSTANCE', 'GROUP', 'VECTOR', 'COMPONENT') and 10 <= n.get('width', 0) <= 40 and 10 <= n.get('height', 0) <= 40 and count(n, ('TEXT',)) == 0

def layout_str(n):
    L = n.get('layout') or {}
    if not L or L.get('mode') in (None, 'NONE'):
        return ''
    p = [L.get('paddingTop', 0), L.get('paddingRight', 0), L.get('paddingBottom', 0), L.get('paddingLeft', 0)]
    pad = '' if not any(p) else ' pad ' + '/'.join(str(round(x)) for x in p)
    wrap = ' wrap' if L.get('layoutWrap') == 'WRAP' else ''
    return f"auto-layout {'↓' if L['mode']=='VERTICAL' else '→'} écart {round(L.get('itemSpacing',0))}{pad}{wrap} align {L.get('primaryAxisAlignItems','')}/{L.get('counterAxisAlignItems','')}"

def strokes_str(n, st):
    if not (n.get('stroke') or n.get('strokes')):
        return ''
    c = color(n, st, 'stroke')
    sw = n.get('strokeWeights') or n.get('strokeWeight')
    if isinstance(sw, dict):
        sides = [k for k, v in sw.items() if v]
        return f"trait {c} {'/'.join(sides)}"
    return f"contour {c} {sw}"

def walk(n, st, depth, ox, oy, lines, items, path, slot=False):
    x = round(n.get('x', 0)); y = round(n.get('y', 0))
    w = round(n.get('width', 0)); h = round(n.get('height', 0))
    ind = '  ' * depth
    name = n.get('name', '')
    nid = n.get('id')
    typ = n.get('type')
    if typ == 'TEXT':
        role, font, s = text_role(n, st)
        txt = (n.get('characters') or '').replace('\n', ' / ')
        al = n.get('textAlignHorizontal', 'LEFT')
        lines.append(f"{ind}- **{role}** « {txt[:90]} » — {font}, {color(n, st) or ''}, {al.lower()}, {w}×{h} @({x},{y}) `{nid}`")
        items['textes'].append({'id': nid, 'role': role, 'police': font, 'texte': txt, 'couleur': color(n, st), 'align': al, 'w': w, 'h': h, 'x': x, 'y': y, 'nb_car': len(txt)})
        return
    if depth > 0 and is_decor(n):
        lines.append(f"{ind}- ✦ décor / motif « {name} » {w}×{h} @({x},{y}) `{nid}` (déborde de la section : motif pixel, lumière ou forme)")
        items['decors'].append({'id': nid, 'w': w, 'h': h, 'x': x, 'y': y})
        return
    if depth > 0 and (is_illustration(n) or slot):
        vec = count(n, ('VECTOR', 'BOOLEAN_OPERATION', 'ELLIPSE'))
        lines.append(f"{ind}- 🖼 **EMPLACEMENT D’ILLUSTRATION** « {name} » {w}×{h} @({x},{y}) `{nid}` ({vec} vecteurs) → à faire séparément (brief-illustration → illustrateur)")
        items['illustrations'].append({'id': nid, 'nom': name, 'w': w, 'h': h, 'x': x, 'y': y})
        return
    if depth > 0 and is_button(n, st):
        t = ' '.join((tt.get('characters') or '') for tt in texts(n))
        bg = color(n, st)
        lines.append(f"{ind}- 🔘 **bouton** « {t} » fond {bg} {w}×{h} rayon {n.get('cornerRadius')} @({x},{y}) `{nid}`")
        items['boutons'].append({'id': nid, 'texte': t, 'fond': bg, 'w': w, 'h': h, 'rayon': n.get('cornerRadius')})
        return
    if depth > 0 and is_joint(n):
        lines.append(f"{ind}- ● jointure {w}×{h} @({x},{y}) `{nid}`")
        items['jointures'].append({'id': nid, 'x': x, 'y': y})
        return
    if depth > 0 and is_line(n):
        lines.append(f"{ind}- ─ trait {w}×{h} @({x},{y}) {color(n, st, 'stroke') or color(n, st) or ''} `{nid}`")
        items['traits'].append({'id': nid, 'w': w, 'h': h, 'x': x, 'y': y})
        return
    if depth > 0 and is_icon(n):
        lines.append(f"{ind}- ◆ icône/logo « {name} » {w}×{h} @({x},{y}) `{nid}`")
        items['icones'].append({'id': nid, 'nom': name, 'w': w, 'h': h})
        return
    if typ in ('VECTOR', 'BOOLEAN_OPERATION', 'ELLIPSE'):
        return
    if typ == 'RECTANGLE':
        c = color(n, st)
        if c == 'image':
            lines.append(f"{ind}- 🖼 image/photo « {name} » {w}×{h} @({x},{y}) `{nid}`")
            items['images'].append({'id': nid, 'nom': name, 'w': w, 'h': h})
        elif w >= 60 and h >= 60:
            lines.append(f"{ind}- ▭ fond/forme « {name} » {w}×{h} {c or ''} rayon {n.get('cornerRadius','')} `{nid}`")
        return
    kids = n.get('children', []) or []
    if not kids:
        return
    deco = ' · '.join(x for x in [layout_str(n), strokes_str(n, st), ('fond ' + str(color(n, st))) if color(n, st) else '', ('rayon ' + str(n.get('cornerRadius'))) if n.get('cornerRadius') else '', 'grille de colonnes' if n.get('layoutGrids') else ''] if x)
    lines.append(f"{ind}- ▣ **{name}** ({typ.lower()}) {w}×{h} @({x},{y}) `{nid}`" + (f" — {deco}" if deco else ''))
    items['blocs'].append({'id': nid, 'nom': name, 'w': w, 'h': h, 'x': x, 'y': y, 'layout': layout_str(n), 'traits': strokes_str(n, st)})
    if depth >= 7:
        lines.append(f"{ind}  - … (plus profond : voir le snapshot)")
        return
    def has_sw(c):
        return any(section_text(t) for t in texts(c))
    for ch in kids:
        sib_title = any(has_sw(o) for o in kids if o is not ch)
        big = ch.get('width', 0) >= 300 and ch.get('height', 0) >= 220 and ch.get('type') in ('FRAME', 'GROUP', 'INSTANCE')
        sl = sib_title and big and not has_sw(ch) and is_illustration_loose(ch)
        walk(ch, st, depth + 1, ox, oy, lines, items, path + [name], sl)

index = []
for typ, fid in SECTIONS:
    p = os.path.join(SNAP, fid + '.json')
    if not os.path.exists(p):
        print('manque', fid); continue
    d = json.load(open(p, encoding='utf-8'))['context']
    st = d.get('globalVars', {}).get('styles', {})
    ST.clear(); ST.update(st)
    root = d['nodes'][0]
    lines = [f"# {typ} · `{root['id']}` · {round(root.get('width',0))} × {round(root.get('height',0))}", '']
    items = collections.defaultdict(list)
    walk(root, st, 0, 0, 0, lines, items, [])
    roles = collections.Counter(t['role'] for t in items['textes'])
    resume = {k: len(v) for k, v in items.items()}
    head = [f"Résumé : {resume}", f"Textes par rôle : {dict(roles)}", '']
    md = lines[:2] + head + ['## Arbre (blocs, puis items)', ''] + lines[2:]
    open(os.path.join(OUT, typ + '.md'), 'w', encoding='utf-8').write('\n'.join(md) + '\n')
    json.dump({'type': typ, 'noeud': root['id'], 'w': root.get('width'), 'h': root.get('height'), 'items': items}, open(os.path.join(OUT, typ + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    index.append((typ, root['id'], round(root.get('width', 0)), round(root.get('height', 0)), resume, len(lines)))
for r in index:
    print(r)
