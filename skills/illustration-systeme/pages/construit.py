"""Construit une section de page en VRAIES FRAMES Figma (retour du 14/11 : pas de rectangles derrière le contenu).

Principe (testé le 14/11/2026 avec Figwright) :
- import_svg transforme chaque <svg> imbriqué en FRAME (nom = id), chaque <text> en TEXT éditable ;
  font-family au nom PostScript (« Inter-SemiBold ») donne le bon style ; text-anchor="middle" donne un texte centré.
- L'import perd : fond/rayon/contour/ombres des frames, interlettrage, interlignage, largeur de retour à la ligne.
  On les repose ensuite avec un batch d'ops calculé à partir de l'arbre réel (design_diff écrit l'arbre sur disque).

Usage :
    from construit import F, T, V, Section
    s = Section('03 · Preuve', 1440, 200, fond='#F7F5F3')
    s.ajoute(F('Case', 150, 0, 570, 200, contour=('#D6D0C8', 1), enfants=[T('Titre', 32, 40, 'Bonjour', 'h3', w=400)]))
    s.ecrire('sortie/preuve')            -> preuve.svg + preuve.post.json
    # import_svg(preuve.svg) -> design_diff(nodeId, rootDir) -> python construit.py ops preuve.post.json <baseline.json>
"""
import json
import os
import re
import sys
from xml.sax.saxutils import escape

ICI = os.path.dirname(os.path.abspath(__file__))
EFFETS = json.load(open(os.path.join(ICI, '..', 'motifs', 'effets.json'), encoding='utf-8'))
EFFETS.update({
    'jointure': {'effets': [
        {'type': 'DROP_SHADOW', 'color': '#8F8F8F1A', 'offset': {'x': 0, 'y': 0}, 'radius': 1},
        {'type': 'DROP_SHADOW', 'color': '#8F8F8F17', 'offset': {'x': 0, 'y': 1}, 'radius': 1},
        {'type': 'DROP_SHADOW', 'color': '#8F8F8F0D', 'offset': {'x': 0, 'y': 3}, 'radius': 2}]},
    'badge': {'effets': [
        {'type': 'DROP_SHADOW', 'color': '#00000026', 'offset': {'x': 0, 'y': 1}, 'radius': 1},
        {'type': 'DROP_SHADOW', 'color': '#0000000D', 'offset': {'x': 0, 'y': 3}, 'radius': 3}]},
})

# Rôles typographiques = pages/grille.md §3 (ne jamais inventer une taille)
ROLES = {
    'hero':   ('Inter', 'Semi Bold', 48, 110, -4, '#1A1A1A'),
    'h2':     ('Inter', 'Semi Bold', 48, 110, -3, '#1A1A1A'),
    'h3':     ('Inter', 'Semi Bold', 28, 120, -3, '#1A1A1A'),
    'num':    ('Inter', 'Semi Bold', 34, 110, -3, '#1A1A1A'),
    'titre':  ('Inter', 'Semi Bold', 20, 130, -2, '#1A1A1A'),   # titre de carte / case (18-20 dans le site)
    'over':   ('DM Mono', 'Medium', 14, 150, 1, '#3745F1'),
    'intro':  ('Inter', 'Medium', 17, 150, -2, '#595959'),
    'body':   ('Inter', 'Medium', 16, 150, -2, '#595959'),
    'label':  ('Inter', 'Medium', 16, 150, -2, '#262626'),
    'small':  ('Inter', 'Medium', 15, 150, -2, '#707070'),
    'badge':  ('Inter', 'Regular', 16, 150, -2, '#707070'),
    # textes d'interface DANS les illustrations (petits, comme les UI des références)
    'ui':     ('Inter', 'Medium', 14, 140, -2, '#262626'),
    'uifort': ('Inter', 'Semi Bold', 14, 140, -2, '#1A1A1A'),
    'uipetit': ('Inter', 'Medium', 12, 140, -1, '#707070'),
    'uimono': ('DM Mono', 'Medium', 11, 140, 2, '#707070'),
}
PS = {('Inter', 'Semi Bold'): 'Inter-SemiBold', ('Inter', 'Medium'): 'Inter-Medium', ('Inter', 'Regular'): 'Inter-Regular',
      ('DM Mono', 'Medium'): 'DMMono-Medium', ('DM Mono', 'Regular'): 'DMMono-Regular'}


def rgb(h):
    h = h.lstrip('#')
    return {'r': round(int(h[0:2], 16) / 255, 3), 'g': round(int(h[2:4], 16) / 255, 3), 'b': round(int(h[4:6], 16) / 255, 3)}


def effets_figma(nom_ou_liste):
    src = EFFETS[nom_ou_liste]['effets'] if isinstance(nom_ou_liste, str) else nom_ou_liste
    out = []
    for e in src:
        e = dict(e)
        if 'color' in e:
            h = e['color'].lstrip('#')
            c = rgb(h[:6])
            c['a'] = round(int(h[6:8], 16) / 255, 3) if len(h) == 8 else 1
            e['color'] = c
        e['visible'] = True
        out.append(e)
    return out


class Noeud:
    pass


class T(Noeud):
    """Texte. x, y = coin haut gauche (ou centre haut si align='center'). w = largeur de retour à la ligne."""
    def __init__(s, nom, x, y, texte, role='body', w=None, align='start', couleur=None, maj=False):
        s.nom, s.x, s.y, s.texte, s.role, s.w, s.align, s.couleur, s.maj = nom, x, y, texte, role, w, align, couleur, maj

    def svg(s):
        fam, sty, taille, lh, ls, coul = ROLES[s.role]
        coul = s.couleur or coul
        txt = s.texte.upper() if s.maj else s.texte
        anchor = {'start': 'start', 'center': 'middle', 'end': 'end'}[s.align]
        return (f'<text id="{escape(s.nom)}" x="{s.x}" y="{s.y + taille}" font-family="{PS[(fam, sty)]}" font-size="{taille}" '
                f'fill="{coul}" text-anchor="{anchor}">{escape(txt)}</text>')

    def post(s):
        fam, sty, taille, lh, ls, coul = ROLES[s.role]
        return {'kind': 'text', 'font': [fam, sty], 'size': taille, 'lh': lh, 'ls': ls, 'w': s.w, 'align': s.align, 'x': s.x, 'y': s.y}


class V(Noeud):
    """Vecteurs bruts (traits, icônes, câbles). inner = SVG dans un repère local (x, y)."""
    def __init__(s, nom, inner, x=0, y=0, w=None, h=None, effets=None, opacite=None, fusion=None):
        s.nom, s.inner, s.x, s.y, s.w, s.h, s.effets, s.opacite, s.fusion = nom, inner, x, y, w, h, effets, opacite, fusion

    def svg(s):
        if s.w:   # dans sa propre frame (sans fond) pour garder un calque nommé
            return f'<svg id="{escape(s.nom)}" x="{s.x}" y="{s.y}" width="{s.w}" height="{s.h}" overflow="visible">{s.inner}</svg>'
        return f'<g id="{escape(s.nom)}" transform="translate({s.x} {s.y})">{s.inner}</g>'

    def post(s):
        d = {'kind': 'vec'}
        if s.effets:
            d['effets'] = s.effets
        if s.opacite is not None:
            d['opacite'] = s.opacite
        if s.fusion:
            d['fusion'] = s.fusion
        return d


class F(Noeud):
    """Frame (conteneur). fond = '#hex' ou ('#hex', opacité) ; contour = ('#hex', épaisseur[, opacité]) ;
    effets = nom de préréglage (effets.json) ou liste ; layout = dict pour set_auto_layout (optionnel)."""
    def __init__(s, nom, x, y, w, h, fond=None, rayon=0, contour=None, effets=None, enfants=None, opacite=None, layout=None, rayons=None):
        s.nom, s.x, s.y, s.w, s.h, s.fond, s.rayon, s.contour, s.effets = nom, x, y, w, h, fond, rayon, contour, effets
        s.enfants, s.opacite, s.layout, s.rayons = list(enfants or []), opacite, layout, rayons

    def ajoute(s, *n):
        for x in n:
            if isinstance(x, (list, tuple)):
                s.enfants.extend(x)
            else:
                s.enfants.append(x)
        return s

    def svg(s):
        inner = ''.join(e.svg() for e in s.enfants)
        return f'<svg id="{escape(s.nom)}" x="{s.x}" y="{s.y}" width="{s.w}" height="{s.h}" overflow="visible">{inner}</svg>'

    def post(s):
        d = {'kind': 'frame', 'w': s.w, 'h': s.h}
        if s.fond:
            d['fond'] = s.fond if isinstance(s.fond, (list, tuple)) else (s.fond, 1)
        if s.rayon or s.rayons:
            d['rayon'] = s.rayon
            if s.rayons:
                d['rayons'] = s.rayons
        if s.contour:
            d['contour'] = s.contour
        if s.effets:
            d['effets'] = s.effets
        if s.opacite is not None:
            d['opacite'] = s.opacite
        if s.layout:
            d['layout'] = s.layout
        return d


def chemins(n, prefixe=()):
    """(chemin de noms, noeud) pour tout l'arbre."""
    ch = prefixe + (n.nom,)
    yield ch, n
    for e in getattr(n, 'enfants', []):
        yield from chemins(e, ch)


class Section(F):
    def ecrire(s, base):
        os.makedirs(os.path.dirname(base) or '.', exist_ok=True)
        noms = {}
        for ch, n in chemins(s):
            k = ' / '.join(ch)
            if k in noms:
                raise ValueError('nom en double : ' + k)
            noms[k] = n.post()
        svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{s.w}" height="{s.h}">' + ''.join(e.svg() for e in s.enfants) + '</svg>'
        open(base + '.svg', 'w', encoding='utf-8').write(svg)
        racine = s.post()
        racine['nom'] = s.nom
        json.dump({'racine': racine, 'noeuds': noms}, open(base + '.post.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
        return base + '.svg'


# ---------- ops après import ----------
def arbre_baseline(chemin):
    d = json.load(open(chemin, encoding='utf-8'))
    for k in ('nodes', 'context', 'snapshot', 'baseline'):
        if isinstance(d, dict) and k in d:
            d = d[k]
            if isinstance(d, dict) and 'nodes' in d:
                d = d['nodes']
            break
    return d[0] if isinstance(d, list) else d


def index_figma(noeud, prefixe=()):
    """Chemin de noms -> noeud Figma. Les groupes créés par l'import (<g>) gardent leur nom."""
    ch = prefixe + (noeud.get('name', ''),)
    yield ch, noeud
    for e in noeud.get('children', []) or []:
        yield from index_figma(e, ch)


def ops(post_path, baseline_path, nom_racine=None, leger=False):
    """leger=True : ne repose pas interlettrage/interlignage (fil de fer)."""
    post = json.load(open(post_path, encoding='utf-8'))
    racine = arbre_baseline(baseline_path)
    nom_racine = nom_racine or racine.get('name')
    figma = {}
    for ch, n in index_figma(racine):
        figma[' / '.join((post['racine']['nom'],) + ch[1:])] = n
    out, manque = [], []
    frames = [(post['racine']['nom'], post['racine'])] + list(post['noeuds'].items())
    for k, d in frames:
        n = figma.get(k)
        if n is None:
            manque.append(k)
            continue
        i = n['id']
        if d['kind'] == 'frame':
            if d.get('fond'):
                c, a = d['fond'][0], d['fond'][1]
                f = {'type': 'SOLID', 'color': rgb(c)}
                if a != 1:
                    f['opacity'] = a
                out.append({'tool': 'set_fills', 'params': {'nodeId': i, 'fills': [f]}})
            if d.get('rayon') or d.get('rayons'):
                p = {'nodeId': i, 'radius': d.get('rayon') or 0}
                if d.get('rayons'):
                    p.update(dict(zip(['topLeftRadius', 'topRightRadius', 'bottomRightRadius', 'bottomLeftRadius'], d['rayons'])))
                out.append({'tool': 'set_corner_radius', 'params': p})
            if d.get('contour'):
                c = d['contour']
                out.append({'tool': 'set_strokes', 'params': {'nodeId': i, 'strokes': [{'type': 'SOLID', 'color': rgb(c[0]), 'opacity': c[2] if len(c) > 2 else 1}],
                                                               'strokeWeight': c[1], 'strokeAlign': 'INSIDE'}})
            if d.get('effets'):
                out.append({'tool': 'set_effects', 'params': {'nodeId': i, 'effects': effets_figma(d['effets'])}})
            if d.get('opacite') is not None:
                out.append({'tool': 'set_opacity', 'params': {'nodeId': i, 'opacity': d['opacite']}})
            if d.get('layout'):
                p = {'nodeId': i}
                p.update(d['layout'])
                out.append({'tool': 'set_auto_layout', 'params': p})
        elif d['kind'] == 'vec':
            if d.get('effets'):
                out.append({'tool': 'set_effects', 'params': {'nodeId': i, 'effects': effets_figma(d['effets'])}})
            if d.get('opacite') is not None:
                out.append({'tool': 'set_opacity', 'params': {'nodeId': i, 'opacity': d['opacite']}})
        elif d['kind'] == 'text':
            p = {'nodeId': i, 'fontName': {'family': d['font'][0], 'style': d['font'][1]}, 'fontSize': d['size'],
                 'lineHeight': {'unit': 'PERCENT', 'value': d['lh']}, 'letterSpacing': {'unit': 'PERCENT', 'value': d['ls']}}
            if not leger:
                out.append({'tool': 'set_text_properties', 'params': p})
            if d.get('w'):
                out.append({'tool': 'resize_nodes', 'params': {'nodeIds': [i], 'width': d['w'], 'height': 20}})
                out.append({'tool': 'set_text_properties', 'params': {'nodeId': i, 'fontName': {'family': d['font'][0], 'style': d['font'][1]}, 'textAutoResize': 'HEIGHT'}})
                cible = d['x'] - d['w'] / 2 if d['align'] == 'center' else (d['x'] - d['w'] if d['align'] == 'end' else d['x'])
                dx = round(cible - n.get('x', 0), 2)
                dy = round(d['y'] - n.get('y', 0), 2)
                if dx or dy:
                    out.append({'tool': 'move_nodes', 'params': {'nodeIds': [i], 'dx': dx, 'dy': dy}})
            else:
                dy = round(d['y'] - n.get('y', 0), 2)
                if abs(dy) > .5:
                    out.append({'tool': 'move_nodes', 'params': {'nodeIds': [i], 'dy': dy}})
    return out, manque


if __name__ == '__main__':
    if sys.argv[1] == 'ops':
        o, m = ops(sys.argv[2], sys.argv[3], leger='--leger' in sys.argv)
        if m:
            print('MANQUE:', m, file=sys.stderr)
        n = int(next((a.split('=')[1] for a in sys.argv if a.startswith('--lot=')), 0)) or len(o)
        for k in range(0, len(o), n):
            print(json.dumps(o[k:k + n], ensure_ascii=False, separators=(',', ':')))
            print()
