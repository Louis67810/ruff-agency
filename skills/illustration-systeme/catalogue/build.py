"""Construit le catalogue : chaque composition du moteur, dans chaque style, + la section exemple.
    python catalogue/build.py            -> catalogue-neutre.html, catalogue-nouveau-style.html, section-exemple-*.html
Ajouter une composition = l'écrire dans moteur/illus.py, l'inscrire dans CATALOGUE, relancer ce script.
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(HERE), 'moteur'))
import illus as il  # noqa: E402

CSS = '''
.cat { max-width: 1240px; margin: 0 auto; padding: 56px 32px 96px; }
.cat h1 { margin: 0; font: 600 44px/1.1 var(--s-font-title); letter-spacing: -.03em; }
.cat > p { margin: 10px 0 0; font: 500 16px/1.5 var(--s-font-text); color: var(--s-ink-3); }
.cat__grid { margin-top: 40px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px; }
.cat__item { display: flex; flex-direction: column; gap: 10px; }
.cat__item > .il-scene { border-radius: 16px; outline: 1px solid var(--s-hairline); margin: 0 auto; }
.cat__item code { font: 400 13px/1.4 var(--s-font-mono); color: var(--s-ink-2); }
.cat__item small { font: 500 13px/1.4 var(--s-font-text); color: var(--s-ink-3); }
'''


def item(name):
    fn, w, h, ref = il.CATALOGUE[name]
    inner = fn()
    first = (fn.__doc__ or '').strip().split('\n')[0]
    ref_txt = f' · référence {ref}' if ref else ' · composition nouvelle'
    return f'<div class="cat__item">{il.scene(inner, w, h, name)}<code>il.{name}()</code><small>{first}{ref_txt}</small></div>'


def section():
    return il.section_grille('Fonctionnalités', 'Tout ce qu’il faut pour construire.',
                             'Écrire, prévisualiser, gérer les fichiers et travailler à plusieurs, dans un seul espace pensé pour aller vite.',
                             [(il.demande(), 'il-spark', 'Assistant', 'Le code écrit avec vous', 'Générez des composants, corrigez un bug ou faites expliquer une logique complexe.'),
                              (il.editeur(), 'il-users', 'Collaboration', 'Toute l’équipe dans le même fichier', 'Modifiez à plusieurs en direct et voyez chaque changement au moment où il arrive.'),
                              (il.arc_outils(), 'il-link', 'Intégrations', 'Vos outils, enfin reliés', 'Connectez votre dépôt, vos maquettes et votre messagerie. Tout se synchronise seul.'),
                              (il.securite(), 'il-lock', 'Sécurité', 'Protégé dès la première ligne', 'Stockage chiffré, connexion sécurisée et droits d’accès fins pour chaque personne.')])


if __name__ == '__main__':
    for style in ('neutre', 'nouveau-style'):
        body = f'<div class="cat"><h1>Catalogue · {style}</h1><p>Chaque composition du moteur, rendue avec le style « {style} ». Même mécanique, autre fichier de style.</p><div class="cat__grid">' + ''.join(item(n) for n in il.CATALOGUE) + '</div></div>'
        open(os.path.join(HERE, f'catalogue-{style}.html'), 'w', encoding='utf-8').write(il.page(style, body, f'Catalogue {style}', CSS))
        open(os.path.join(HERE, f'section-exemple-{style}.html'), 'w', encoding='utf-8').write(il.page(style, section(), f'Section exemple {style}'))
    print('ok')
