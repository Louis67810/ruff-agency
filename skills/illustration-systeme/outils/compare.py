"""Met une référence et un rendu côte à côte, à la même hauteur, avec une légende.
C'est l'étape obligatoire avant de livrer : on regarde la paire, pas le rendu seul.

    python compare.py reference.png rendu.png paire.png
"""
import sys
from PIL import Image, ImageDraw


def compare(ref, ren, out, h=900):
    a, b = Image.open(ref).convert('RGB'), Image.open(ren).convert('RGB')
    a = a.resize((int(a.size[0] * h / a.size[1]), h))
    b = b.resize((int(b.size[0] * h / b.size[1]), h))
    s = Image.new('RGB', (a.size[0] + b.size[0] + 24, h + 40), 'white')
    s.paste(a, (0, 40))
    s.paste(b, (a.size[0] + 24, 40))
    d = ImageDraw.Draw(s)
    d.text((8, 12), 'REFERENCE', fill=(120, 120, 120))
    d.text((a.size[0] + 32, 12), 'RENDU', fill=(120, 120, 120))
    s.save(out)
    return out


if __name__ == '__main__':
    print(compare(*sys.argv[1:4]))
