"""Nettoie un export SVG de Figma pour qu'il se rende comme dans Figma (et reste utilisable par le moteur).

Défauts connus des exports Figma, et ce que fait ce script :
 1. Ombres de curseur : Figma exporte jusqu'à 8 ombres empilées décalées jusqu'à 155 px, qu'il n'affiche pas
    lui-même -> grosse tache noire. On remplace le filtre (et le filtre imbriqué) des petits objets à ombres
    très longues par l'ombre de curseur relevée dans Figma.
 2. Zones de filtre trop justes : les halos (flou 100 px) sont coupés en rectangle -> on élargit chaque filtre.
 3. Motifs d'image en mosaïque (pattern + <image>) avec mode de fusion : Figma ne les montre pas tels quels
    -> option --sans-mosaique pour les retirer (à vérifier au pixel).

    python nettoie_svg.py entree.svg sortie.svg [--sans-mosaique]
"""
import re
import sys

CURSEUR = ('<feFlood flood-opacity="0" result="BackgroundImageFix"/>'
           '<feDropShadow dx="1" dy="2" stdDeviation="1.25" flood-color="#000" flood-opacity=".29"/>'
           '<feDropShadow dx="4" dy="8" stdDeviation="2" flood-color="#000" flood-opacity=".25"/>'
           '<feDropShadow dx="8" dy="17" stdDeviation="2.75" flood-color="#000" flood-opacity=".15"/>')


def _filters(s):
    return {m.group(1): m for m in re.finditer(r'<filter id="([^"]+)"([^>]*)>(.*?)</filter>', s, re.S)}


def curseurs(s):
    """Repère les filtres d'ombre « curseur » : petite zone, beaucoup d'ombres, décalage max > 60 px.
    On ajoute un filtre neuf (id unique) et on fait pointer le groupe dessus ; l'ancien reste inutilisé."""
    fixed = 0
    for fid, m in list(_filters(s).items()):
        body = m.group(3)
        dys = [float(x) for x in re.findall(r'<feOffset[^>]*dy="([-\d.]+)"', body)]
        w = float(re.search(r'width="([\d.]+)"', m.group(2)).group(1))
        if len(dys) >= 5 and max(dys) > 60 and w < 160:
            nid = f'il_curseur_{fixed}'
            use = re.search(rf'<g filter="url\(#{re.escape(fid)}\)">\s*<g filter="url\(#([^)]+)\)">', s)
            if use:
                s = s.replace(use.group(0), f'<g filter="url(#{nid})"><g>', 1)
            else:
                s = s.replace(f'filter="url(#{fid})"', f'filter="url(#{nid})"', 1)
            s = s.replace('</defs>', f'<filter id="{nid}" x="-50%" y="-50%" width="250%" height="250%" color-interpolation-filters="sRGB">{CURSEUR}</filter></defs>', 1)
            fixed += 1
    return s, fixed


def elargit(s, marge=160):
    def f(m):
        a = m.group(0)
        if 'userSpaceOnUse' not in a or not all(re.search(rf'{k}="[-\d.]+"', a) for k in ('x', 'y', 'width', 'height')):
            return a
        g = lambda k: float(re.search(rf'\b{k}="([-\d.]+)"', a).group(1))
        x, y, w, h = g('x'), g('y'), g('width'), g('height')
        a = re.sub(r'\bx="[-\d.]+"', f'x="{x - marge:.2f}"', a, 1)
        a = re.sub(r'\by="[-\d.]+"', f'y="{y - marge:.2f}"', a, 1)
        a = re.sub(r'\bwidth="[\d.]+"', f'width="{w + 2 * marge:.2f}"', a, 1)
        a = re.sub(r'\bheight="[\d.]+"', f'height="{h + 2 * marge:.2f}"', a, 1)
        return a
    return re.sub(r'<filter id="[^"]+"[^>]*>', f, s)


def sans_mosaique(s):
    """Retire les éléments remplis par un motif qui contient une image en mosaïque."""
    pats = [m.group(1) for m in re.finditer(r'<pattern id="([^"]+)"[^>]*>(?:(?!</pattern>).)*?<use[^>]*xlink:href="#image', s, re.S)]
    n = 0
    for p in pats:
        s, k = re.subn(rf'<(rect|path|ellipse|circle)[^>]*fill="url\(#{re.escape(p)}\)"[^>]*/>', '', s)
        n += k
    return s, n


def nettoie(src, dst, mosaique=False):
    s = open(src, encoding='utf-8').read()
    s, nc = curseurs(s)
    s = elargit(s)
    nm = 0
    if mosaique:
        s, nm = sans_mosaique(s)
    open(dst, 'w', encoding='utf-8').write(s)
    return nc, nm


if __name__ == '__main__':
    print(nettoie(sys.argv[1], sys.argv[2], '--sans-mosaique' in sys.argv))
