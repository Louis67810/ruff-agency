"""Prépare les opérations Figwright à appliquer après import_svg d'une scène convertie (vers_figma.py).

    python ops_figma.py scene.json carte.json effets|polices
carte.json = {nom_du_calque: id_figma} (tiré de get_design_context minimal sur le cadre importé).
Sort un tableau JSON d'ops pour l'outil batch : set_effects (ombres, flous) ou set_text_properties (polices).
"""
import json
import sys

STYLE = {'400': 'Regular', '500': 'Medium', '600': 'Semi Bold', '700': 'Bold'}
# Polices absentes du Figma de Louis (testé le 07/11/2026) : remplacées par Inter (à changer si elles sont installées)
FAMILLE = {'Switzer': 'Inter', 'Inter Tight': 'Inter'}


def ops(scene, carte, kind):
    d = json.load(open(scene, encoding='utf-8'))
    m = json.load(open(carte, encoding='utf-8'))
    out = []
    if kind == 'effets':
        for nom, fx in d['effets'].items():
            if nom in m:
                eff = []
                for e in fx:
                    e = dict(e)
                    # anneau (ombre 0 0 0 Npx) : en Figma, c'est un contour extérieur ; spread non géré sur les vecteurs
                    if e.get('type') == 'DROP_SHADOW' and not e['offset']['x'] and not e['offset']['y'] and not e.get('radius') and e.get('spread', 0) > 0:
                        if e['color']['a'] >= .3:
                            c = e['color']
                            out.append({'tool': 'set_strokes', 'params': {'nodeId': m[nom], 'strokes': [{'type': 'SOLID', 'color': {k: round(c[k], 3) for k in 'rgb'}, 'opacity': round(c['a'], 2)}], 'strokeWeight': e['spread'], 'strokeAlign': 'OUTSIDE'}})
                        continue
                    e['spread'] = 0
                    for k in ('radius', 'spread'):
                        if k in e:
                            e[k] = round(e[k], 2)
                    if 'color' in e:
                        e['color'] = {k: round(v, 3) for k, v in e['color'].items()}
                    if 'offset' in e:
                        e['offset'] = {k: round(v, 2) for k, v in e['offset'].items()}
                    eff.append(e)
                out.append({'tool': 'set_effects', 'params': {'nodeId': m[nom], 'effects': eff}})
    else:
        for nom, t in d['textes'].items():
            if nom in m:
                fam = FAMILLE.get(t['famille'], t['famille'])
                p = {'nodeId': m[nom], 'fontName': {'family': fam, 'style': STYLE.get(str(t['poids']), 'Regular')}}
                if t['interlettre']:
                    p['letterSpacing'] = {'unit': 'PIXELS', 'value': t['interlettre']}
                out.append({'tool': 'set_text_properties', 'params': p})
    return out


if __name__ == '__main__':
    print(json.dumps(ops(*sys.argv[1:4]), ensure_ascii=False, separators=(',', ':')))
