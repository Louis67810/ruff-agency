"""Vérifie qu'un export SVG de Figma est propre : on le rend dans Chrome à 2x et on le compare
au PNG 2x exporté par Figma (la vérité). Sort un score et une planche « Figma | SVG rendu | écarts ».

    python verifie_export.py dossier_png dossier_svg dossier_sortie
Score = part des pixels qui diffèrent de plus de 24 niveaux (0 % = identique).
Seuil : <= 1,5 % propre ; au-delà, regarder la planche pour trouver la couche fautive.
"""
import os
import re
import sys
from PIL import Image, ImageChops

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from rendu import rendu  # noqa: E402

SEUIL = 1.5


def svg_size(path):
    head = open(path, encoding='utf-8', errors='ignore').read(600)
    w = float(re.search(r'width="([\d.]+)"', head).group(1))
    h = float(re.search(r'height="([\d.]+)"', head).group(1))
    return w, h


def _flat(path):
    im = Image.open(path).convert('RGBA')
    bg = Image.new('RGBA', im.size, (255, 255, 255, 255))
    return Image.alpha_composite(bg, im).convert('RGB')


def score(png, rendered):
    a = _flat(png)
    b = _flat(rendered).resize(a.size)
    d = ImageChops.difference(a, b).convert('L')
    bad = d.point(lambda v: 255 if v > 24 else 0)
    pct = 100 * bad.histogram()[255] / (a.size[0] * a.size[1])
    heat = Image.composite(Image.new('RGB', a.size, (230, 30, 60)), a.point(lambda v: v // 2 + 120), bad)
    return pct, a, b, heat


def verifie(svg, png, outdir):
    os.makedirs(outdir, exist_ok=True)
    name = os.path.splitext(os.path.basename(svg))[0]
    w, h = svg_size(svg)
    page = os.path.join(outdir, f'_{name}.html')
    open(page, 'w', encoding='utf-8').write(f'<!doctype html><html><body style="margin:0;background:transparent"><img src="file:///{os.path.abspath(svg).replace(os.sep, "/")}" width="{w}" height="{h}" style="display:block"></body></html>')
    out = rendu(page, os.path.join(outdir, f'_{name}.png'), int(w), int(h), 2, trim=False)
    os.remove(page)
    pct, a, b, heat = score(png, out)
    W, H = a.size
    sheet = Image.new('RGB', (W * 3 + 40, H), 'white')
    for i, im in enumerate((a, b, heat)):
        sheet.paste(im, (i * (W + 20), 0))
    sheet.save(os.path.join(outdir, f'{name}.png'))
    os.remove(out)
    return pct


if __name__ == '__main__':
    pngd, svgd, outd = sys.argv[1:4]
    for f in sorted(os.listdir(svgd)):
        if f.endswith('.svg'):
            p = verifie(os.path.join(svgd, f), os.path.join(pngd, f[:-4] + '.png'), outd)
            print(f'{f[:-4]:12s} {p:6.2f} %  {"propre" if p <= SEUIL else "A REPARER"}')
