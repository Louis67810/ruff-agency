"""Range les exports vérifiés dans la bibliothèque et construit sa page d'index.
    python bibliotheque/range.py
Entrées : _brut/propre (scènes nettoyées/mixtes), _brut/png (vérité Figma 2x),
          _brut/el_propre + _brut/el_png (éléments), _brut/el_png3 (éléments gardés en PNG 3x).
Sorties : scenes/<nom>.svg + .png, elements/<nom>.svg|.png, index.json, index.html.
"""
import json
import os
import shutil
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
B = os.path.join(HERE, '_brut')
sys.path.insert(0, os.path.join(os.path.dirname(HERE), 'outils'))

SOURCE = 'Figma « Botwise — AI-First SaaS Template (Copy) », page Design, section 6002:4'

SCENES = {  # nœud Figma -> (nom, description, méthode)
    '6002-4968': ('connecter-outils', 'Pile de lignes d’intégration, marque lumineuse, orbites, curseur', 'mixte (marque en calque Figma) + curseur réparé'),
    '6002-360': ('trier-messages', 'Carte de messages dans un cadre double, sur sa patte, app floutée derrière', 'SVG nettoyé'),
    '6002-669': ('bouclier', 'Bouclier métal, marque gravée, câbles, plateau d’avatars', 'SVG nettoyé'),
    '4001-51967': ('etape-capter', 'Logos ronds reliés à la marque, téléphone avec notification', 'mixte (marque en calque Figma)'),
    '4001-52144': ('etape-repondre', 'Conversation dans un téléphone, analyse par la marque', 'SVG nettoyé'),
    '4001-52274': ('etape-passer-la-main', 'Pilule de transfert sur orbites, grille d’assistance humaine', 'SVG nettoyé'),
    '6002-721': ('bento-courbe', 'Courbe de tendance avec info-bulle blanche', 'SVG nettoyé'),
    '6002-786': ('bento-fraude', 'Carte du monde en points, alerte fraude, curseur', 'SVG nettoyé + curseur réparé'),
    '6002-1110': ('bento-langues', 'Carte en points avec bulles de langues à drapeaux', 'SVG nettoyé'),
    '6002-4417': ('bento-canaux', 'Agent relié aux canaux, interrupteurs, curseur', 'SVG nettoyé + curseurs réparés'),
    '6002-4543': ('probleme-solution', 'Deux courbes opposées, marque au centre, rayons rouges et bleus', 'mixte (rayons, marque, hachures en calque Figma)'),
    '6019-6': ('resume-notes-valide', 'VALIDÉE par Louis : fenêtre de notes, marque, étiquettes, câbles fins dessous (sans trame)', 'SVG nettoyé'),
    '6018-98': ('hub-messages', 'Marque Gmail sur socle en verre, connexion verte lumineuse, liste de catégories', 'SVG nettoyé'),
    '6018-218': ('messages-multicanal', 'Pile de messages décalés avec logos (WhatsApp, Instagram, Shopify, X)', 'SVG nettoyé (écart = anticrénelage du texte)'),
    '6018-264': ('reponse-rapide', 'Pile de notifications, pilule « génération », chrono 00:03 sur cadran', 'SVG nettoyé (écart = anticrénelage du texte)'),
    '6018-354': ('nuage-outils', 'Nuage en relief contenant les logos, câbles fins vers la marque', 'SVG nettoyé'),
    '6002-4770': ('croissance', 'Courbe de croissance avec logos posés, zone hachurée', 'SVG nettoyé'),
}
ELEMENTS = {
    '6002-690': ('bouclier-seul', 'svg'), '6002-709': ('plateau-avatars', 'svg'), '6002-787': ('carte-fraude', 'svg'),
    '6002-1111': ('carte-points-langues', 'svg'), '6002-5054': ('curseur', 'svg'),
    '4001-51997': ('pastille-shopify', 'svg'), '4001-51999': ('pastille-slack', 'svg'), '4001-52002': ('pastille-x', 'svg'),
    '4001-52005': ('pastille-whatsapp', 'svg'), '4001-52011': ('pastille-instagram', 'svg'), '4001-52013': ('pastille-facebook', 'svg'),
    '6002-4998': ('logo-slack', 'svg'), '6002-5021': ('logo-linkedin', 'svg'),
    '6019-460': ('cables-eventail', 'svg'), '6018-172': ('pastille-verre-facebook', 'svg'),
    '6018-152': ('connecteur-actif-vert', 'png3'), '6018-96': ('curseur-hugo', 'png3'),
    '6002-4973': ('marque-lumineuse', 'png3'), '4001-52015': ('marque-lumineuse-grande', 'png3'), '6002-4751': ('marque-lumineuse-centre', 'png3'),
}


def main():
    from verifie_export import verifie
    for d in ('scenes', 'elements'):
        os.makedirs(os.path.join(HERE, d), exist_ok=True)
    idx = {'source': SOURCE, 'scenes': [], 'elements': []}
    tmp = os.path.join(B, '_v')
    for node, (nom, desc, meth) in SCENES.items():
        shutil.copy(os.path.join(B, 'propre', f'{node}.svg'), os.path.join(HERE, 'scenes', f'{nom}.svg'))
        shutil.copy(os.path.join(B, 'png', f'{node}.png'), os.path.join(HERE, 'scenes', f'{nom}.png'))
        score = verifie(os.path.join(HERE, 'scenes', f'{nom}.svg'), os.path.join(HERE, 'scenes', f'{nom}.png'), tmp)
        idx['scenes'].append({'nom': nom, 'noeud': node.replace('-', ':'), 'description': desc, 'methode': meth, 'ecart_pct': round(score, 2)})
    for node, (nom, kind) in ELEMENTS.items():
        if kind == 'svg':
            shutil.copy(os.path.join(B, 'el_propre', f'{node}.svg'), os.path.join(HERE, 'elements', f'{nom}.svg'))
            f = f'{nom}.svg'
        else:
            shutil.copy(os.path.join(B, 'el_png3', f'{node}.png'), os.path.join(HERE, 'elements', f'{nom}.png'))
            f = f'{nom}.png'
        idx['elements'].append({'nom': nom, 'noeud': node.replace('-', ':'), 'fichier': f,
                                'format': 'SVG vectoriel' if kind == 'svg' else 'PNG 3x (effets que le SVG rend mal)'})
    shutil.rmtree(tmp, ignore_errors=True)
    json.dump(idx, open(os.path.join(HERE, 'index.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

    cards = ''.join(f'''<figure><img src="scenes/{s["nom"]}.svg" loading="lazy" alt=""><figcaption><b>{s["nom"]}</b><span>{s["description"]}</span>
      <small>nœud {s["noeud"]} · {s["methode"]} · écart avec Figma {s["ecart_pct"]} %</small></figcaption></figure>''' for s in idx['scenes'])
    els = ''.join(f'<figure class="el"><img src="elements/{e["fichier"]}" loading="lazy" alt=""><figcaption><b>{e["nom"]}</b><small>{e["format"]}</small></figcaption></figure>' for e in idx['elements'])
    html = f'''<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Bibliothèque d'illustrations</title>
<style>body{{margin:0;background:#ecebe8;font-family:system-ui,sans-serif;color:#1a1a1a}}main{{max-width:1300px;margin:0 auto;padding:48px 24px}}
h1{{font-size:40px;letter-spacing:-.03em;margin:0}}main>p{{color:#777;margin:8px 0 0}}h2{{margin:48px 0 16px}}
.g{{display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:18px}}.e{{grid-template-columns:repeat(auto-fill,minmax(200px,1fr))}}
figure{{margin:0;background:#f7f5f3;border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:10px}}figure img{{width:100%;height:auto;border-radius:8px;background:#f7f5f3}}
.el img{{max-height:150px;object-fit:contain}}figcaption{{display:flex;flex-direction:column;gap:4px;font-size:13px}}figcaption span{{color:#444}}figcaption small{{color:#888}}</style></head>
<body><main><h1>Bibliothèque d'illustrations</h1><p>Exports exacts de Figma, nettoyés et vérifiés au pixel. Source : {SOURCE}.</p>
<h2>Scènes ({len(idx["scenes"])})</h2><div class="g">{cards}</div><h2>Éléments ({len(idx["elements"])})</h2><div class="g e">{els}</div></main></body></html>'''
    open(os.path.join(HERE, 'index.html'), 'w', encoding='utf-8').write(html)
    for s in idx['scenes']:
        print(f'{s["nom"]:22s} {s["ecart_pct"]:5.2f} %')


if __name__ == '__main__':
    main()
