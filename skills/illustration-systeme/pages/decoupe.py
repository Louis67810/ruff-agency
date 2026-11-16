"""Découpe chaque TYPE de section (une seule fois, sans doublon) depuis les pages exportées de Figma à 1x.
    python pages/decoupe.py   -> pages/sections/<type>.png + pages/sections/_planche.png
Source : Figma « Botwise — AI-First SaaS Template (Copy) », page Design. Pages à 1440 px de large.
"""
import os
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '_brut', 'pages1x')
OUT = os.path.join(HERE, 'sections')

PAGES = {'accueil': '6001-3', 'contact': '4001-15086', 'tarifs': '4001-19514', 'blog': '4001-26550',
         'article': '4001-30575', 'attente': '4001-41941', 'apropos': '4001-46158', 'legal': '4001-34443', '404': '4001-51296'}

# type -> (page, y0, y1, nœud Figma)
SECTIONS = {
    'navigation': ('accueil', 0, 87, '6001:21'),
    'hero-produit': ('accueil', 87, 940, '6001:63'),
    'fonctionnalites-video-chiffres': ('accueil', 1030, 2420, '6001:13775'),
    'temoignage-client': ('accueil', 2530, 2980, '6001:572'),
    'probleme-solution': ('accueil', 3090, 3850, '6001:671'),
    'plateforme-liste': ('accueil', 3960, 4745, '6001:896'),
    'etapes-onglets': ('accueil', 5480, 6285, '6001:1072'),
    'trois-ecrans': ('accueil', 6390, 7175, '6001:1227'),
    'bento-2x2': ('accueil', 7280, 8630, '6001:6161'),
    'comparatif': ('accueil', 8735, 9700, '6001:5652'),
    'integrations': ('accueil', 10370, 10925, '6001:1587'),
    'croissance': ('accueil', 11030, 11760, '6001:10497'),
    'tarifs': ('accueil', 11865, 14335, '6001:10682'),
    'international': ('accueil', 14495, 15200, '6027:2625'),
    'blog-grille': ('accueil', 15305, 16200, '6027:608'),
    'temoignages': ('accueil', 16310, 16860, '6027:2444'),
    'faq': ('accueil', 16965, 17930, '6027:1120'),
    'cta-final': ('accueil', 17930, 18636, '6027:8953'),
    'pied-de-page': ('accueil', 18636, 19523, '6027:2763'),
    'hero-contact': ('contact', 87, 1380, '4001:15087'),
    'banniere-cta': ('tarifs', 2700, 3060, '4001:23965'),
    'hero-blog': ('blog', 150, 1230, '4001:30233'),
    'blog-liste': ('blog', 1340, 2630, '4001:30377'),
    'equipe': ('blog', 2725, 3455, '6029:13168'),
    'article': ('article', 87, 2690, '4001:33395'),
    'hero-liste-attente': ('attente', 87, 930, '4001:44873'),
    'hero-a-propos': ('apropos', 87, 1303, '4001:49008'),
    'histoire-frise': ('apropos', 1383, 3045, '4001:50134'),
    'culture': ('apropos', 3240, 4035, '4001:50364'),
    'presence-mondiale': ('apropos', 5540, 6245, '4001:50324'),
    'texte-legal': ('legal', 87, 2810, '4001:37167'),
    'page-404': ('404', 0, 825, '4001:51299'),
}


def main():
    os.makedirs(OUT, exist_ok=True)
    cache = {}
    thumbs = []
    for name, (page, y0, y1, node) in SECTIONS.items():
        if page not in cache:
            cache[page] = Image.open(os.path.join(SRC, PAGES[page] + '.png')).convert('RGB')
        im = cache[page]
        crop = im.crop((0, y0, im.size[0], min(y1, im.size[1])))
        crop.save(os.path.join(OUT, name + '.png'), optimize=True)
        t = crop.copy()
        t.thumbnail((360, 420))
        thumbs.append((name, t))
    cols = 6
    w, h = 370, 450
    rows = (len(thumbs) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * w, rows * h), 'white')
    d = ImageDraw.Draw(sheet)
    for i, (n, t) in enumerate(thumbs):
        x, y = (i % cols) * w, (i // cols) * h
        sheet.paste(t, (x + 5, y + 5))
        d.text((x + 5, y + 430), n, fill=(0, 0, 0))
    sheet.save(os.path.join(OUT, '_planche.png'))
    print(len(thumbs), 'sections')


if __name__ == '__main__':
    main()
