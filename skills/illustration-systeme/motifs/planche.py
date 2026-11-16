"""Planche de démonstration de tous les motifs -> motifs/planche/planche.{svg,apercu.svg,json} + planche.png.
    python motifs/planche.py
"""
import os
import sys

ICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ICI)
sys.path.insert(0, os.path.join(ICI, '..', 'outils'))
from motifs import *  # noqa

W, H = 1440, 2300
s = Scene(W, H, FOND)
# 1. Section claire avec ombre de store et carte d'avis sur halo
s.ajoute([Calque('carte-zone', f'<rect x="80" y="60" width="620" height="520" rx="0" fill="{SABLE}"/>')])
s.ajoute(store('store', 60, 60, 760, 420, angle=14))
s.ajoute(halo('halo', 1060, 320, .9))
s.ajoute([Calque('carte-avis', '<rect x="900" y="170" width="353" height="300" rx="20" fill="#FFFFFF"/>', effets='ombre-carte-avis')])
# 2. Grille pixel + croix (appel final)
s.ajoute([Calque('cta-fond', f'<rect x="80" y="660" width="1280" height="520" rx="0" fill="{SABLE}"/>')])
s.ajoute(grille_pixel('grille', 80, 660, 20, 18, 28.45, fondu='bas'))
s.ajoute(grille_pixel('grille-d', 791, 660, 20, 18, 28.45, fondu='bas', seed=4))
s.ajoute(forme_pixel('croix-a', 300, 900, CROIX_LARGE, 28, '#FFFFFF', fusion='OVERLAY'))
s.ajoute(forme_pixel('croix-b', 1040, 820, CROIX, 28, '#FFFFFF', opacite=.8, flou=12))
s.ajoute(rubans('rubans-cta', 520, 1020, 3, 168, 31, 10, 40, '#FFFFFF', .2, flou=10))
# 3. Bannière indigo à rubans + barre pixel
s.ajoute([Calque('banniere', f'<rect x="80" y="1240" width="1280" height="260" rx="0" fill="#303CE2"/>')])
s.ajoute(rubans('rubans-banniere', 700, 1270, 4, 608, 52, 10, 70))
s.ajoute(barre_pixel('barre', 80, 1500, 1280, 15))
# 4. Formulaire + escalier de tuiles + épingle
s.ajoute(escalier_tuiles('escalier', 80, 1580, 4, 64))
f, hf = formulaire('form', 420, 1570, 520)
s.ajoute(f)
s.ajoute(epingle('epingle', 1120, 1640))
# 5. Section sombre : chute de lumière + logotype géant
s.ajoute([Calque('nuit', f'<rect x="0" y="1990" width="{W}" height="310" fill="{NUIT}"/>')])
s.ajoute(chute_sombre('chute', W, 1990))
s.ajoute(logotype_geant('logotype', W / 2, 2290, 'Marque'))

base = s.ecrire(os.path.join(ICI, 'planche', 'planche'))
# FAQ à part (elle a sa propre hauteur)
s2 = Scene(1140, 640, FOND)
q, h = faq('faq', 97, 20, ['Combien de temps pour démarrer ?', 'Mes données restent-elles chez moi ?', 'Puis-je annuler à tout moment ?', 'Quels outils sont reliés ?'],
           0, 'Une demi-journée : on relie vos outils, on importe l\'historique et votre équipe reçoit un accès le soir même, sans formation.')
s2.ajoute(q)
s2.ecrire(os.path.join(ICI, 'planche', 'faq'))

if '--png' in sys.argv:
    from rendu import rendu
    for n, (w, hh) in {'planche': (W, H), 'faq': (1140, 640)}.items():
        p = os.path.join(ICI, 'planche', n + '.apercu.svg')
        html = os.path.join(ICI, 'planche', n + '.html')
        open(html, 'w', encoding='utf-8').write(f'<html><body style="margin:0">{open(p, encoding="utf-8").read()}</body></html>')
        rendu(html, os.path.join(ICI, 'planche', n + '.png'), w, hh, 1, trim=False)
print('ok')
