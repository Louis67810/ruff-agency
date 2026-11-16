"""Rendu d'une page HTML en PNG avec Chrome sans interface (2x par défaut), puis rognage du fond vide.

    python rendu.py page.html sortie.png [largeur=1300] [hauteur=1600] [echelle=2]
Puis comparer : python compare.py reference.png rendu.png paire.png
"""
import os
import subprocess
import sys
import tempfile
import time

CHROMES = [r'C:\Program Files\Google\Chrome\Application\chrome.exe', r'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
           r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', 'google-chrome']


def chrome():
    for c in CHROMES:
        if os.path.exists(c) or c == 'google-chrome':
            return c


def rendu(html, out, w=1300, h=1600, scale=2, trim=True):
    out = os.path.abspath(out)
    if os.path.exists(out):
        os.remove(out)
    url = 'file:///' + os.path.abspath(html).replace(os.sep, '/')
    subprocess.run([chrome(), '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', '--allow-file-access-from-files',
                    f'--user-data-dir={tempfile.mkdtemp()}', f'--window-size={w},{h}', f'--force-device-scale-factor={scale}',
                    '--virtual-time-budget=8000', f'--screenshot={out}', url], capture_output=True, timeout=180)
    for _ in range(30):
        if os.path.exists(out):
            break
        time.sleep(1)
    if trim:
        from PIL import Image, ImageChops
        im = Image.open(out).convert('RGB')
        bg = Image.new('RGB', im.size, im.getpixel((im.size[0] - 2, im.size[1] - 2)))
        box = ImageChops.difference(im, bg).getbbox()
        if box:
            im.crop((0, 0, im.size[0], min(im.size[1], box[3] + 40 * scale))).save(out)
    return out


if __name__ == '__main__':
    a = sys.argv
    print(rendu(a[1], a[2], *(int(x) for x in a[3:6])))
