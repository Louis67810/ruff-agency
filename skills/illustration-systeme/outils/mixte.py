"""Assemble une scène « mixte » : le SVG vectoriel exporté de Figma SANS les pièces à effets
(marque à halo, rayons masqués…) + un calque d'effets tiré du rendu exact de Figma, posé au même endroit.

Préparation dans Figma (via Figwright) :
  1. exporter la scène complète en PNG 2x                          -> complet.png
  2. masquer (set_visible false) les pièces qui cassent en SVG
  3. exporter la scène en SVG et en PNG 2x                          -> sans.svg, sans.png
  4. réafficher les pièces (set_visible true)
Puis :
    python mixte.py complet.png sans.png sans.svg sortie.svg
Le calque = pixels de complet.png là où ils diffèrent de sans.png, avec une transparence douce
(aucun bord dur). Le résultat est UN seul fichier SVG, à la taille de la scène.
"""
import base64
import io
import re
import sys

from PIL import Image, ImageChops, ImageFilter


def calque(complet, sans, gain=10, flou=2):
    b = Image.open(complet).convert('RGBA')
    a = Image.open(sans).convert('RGBA').resize(b.size)
    d = ImageChops.difference(b, a)
    m = ImageChops.lighter(ImageChops.lighter(d.getchannel('R'), d.getchannel('G')), ImageChops.lighter(d.getchannel('B'), d.getchannel('A')))
    m = m.point(lambda v: 255 if v > 18 else 0).filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(flou))
    alpha = ImageChops.multiply(b.getchannel('A'), m)
    out = b.copy()
    out.putalpha(alpha)
    box = m.getbbox()
    return out, box, m


def _b64(im):
    buf = io.BytesIO()
    im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()


def mixte(complet, sans, svg, sortie):
    """Dans les zones du calque, le SVG est MASQUÉ (pas seulement recouvert) : le résultat y vaut
    exactement le rendu Figma, même pour les zones semi-transparentes et sur n'importe quel fond."""
    lay, box, m = calque(complet, sans)
    s = open(svg, encoding='utf-8').read()
    W = float(re.search(r'width="([\d.]+)"', s[:600]).group(1))
    H = float(re.search(r'height="([\d.]+)"', s[:600]).group(1))
    sc = lay.size[0] / W
    if box:
        x, y, w, h = box[0] / sc, box[1] / sc, (box[2] - box[0]) / sc, (box[3] - box[1]) / sc
        inv = ImageChops.invert(m.crop(box)).convert('RGB')
        mask = (f'<mask id="il-masque-calque" maskUnits="userSpaceOnUse" x="0" y="0" width="{W}" height="{H}">'
                f'<rect width="{W}" height="{H}" fill="white"/><image x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" preserveAspectRatio="none" href="data:image/png;base64,{_b64(inv)}"/></mask>')
        head = re.search(r'<svg[^>]*>', s).group(0)
        body = s[len(s[:s.index(head)]) + len(head):s.rindex('</svg>')]
        img = f'<image data-il="calque-effets" x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" preserveAspectRatio="none" href="data:image/png;base64,{_b64(lay.crop(box))}"/>'
        s = s[:s.index(head)] + head + f'<defs>{mask}</defs><g mask="url(#il-masque-calque)">{body}</g>{img}</svg>'
    open(sortie, 'w', encoding='utf-8').write(s)
    return box


if __name__ == '__main__':
    print(mixte(*sys.argv[1:5]))
