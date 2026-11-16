"""Pont Python -> les deux outils HTML de Louis (motifs/outils-louis/), exécutés avec Chrome sans interface.
Les originaux ne sont JAMAIS modifiés : on en extrait le cœur JavaScript (jusqu'à window.PatternEditor / window.ShadowOverlay).

    from outils_louis import ombre_svg, ombre_png, motif_svg
    ombre_png({'width':1140,'height':843,'opacity':.3}, 'ombre.png', echelle=.25)   # calque d'ombre fidèle, léger, prêt pour import_image
    motif_svg({'repeat':True,'width':1140,'height':600,'grain':False})               # motif d'origine (répétition imparfaite : préférer motifs.tuiles_repetables)

Recette ombre : {mode:'bands'|'figma', width, height, opacity, image:{offsetX,offsetY,scale}, bands:{count 0-4, angle, spacing, thickness, blur, strength, wideShadow}}
(valeurs par défaut = celles du Figma de Louis, ombre de store à 4 lames + dalle large).
"""
import json
import os
import re
import subprocess
import tempfile

ICI = os.path.dirname(os.path.abspath(__file__))
DOSSIER = os.path.join(ICI, 'outils-louis')
CHROMES = [r'C:\Program Files\Google\Chrome\Application\chrome.exe', r'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
           r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', 'google-chrome']


def _chrome():
    return next(c for c in CHROMES if os.path.exists(c) or c == 'google-chrome')


def _coeur(fichier, fin):
    s = open(os.path.join(DOSSIER, fichier), encoding='utf-8').read()
    a = s.find('<script>') + 8
    b = s.find(fin)
    b = s.find('\n', b)
    return s[a:b]


def _executer(html, sortie='dom', png=None, taille=(1200, 900), transparent=False):
    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, 'p.html')
        open(p, 'w', encoding='utf-8').write(html)
        cmd = [_chrome(), '--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=8000', f'--window-size={taille[0]},{taille[1]}']
        if transparent:
            cmd.append('--default-background-color=00000000')
        if png:
            cmd.append('--screenshot=' + os.path.abspath(png))
        else:
            cmd.append('--dump-dom')
        cmd.append('file:///' + p.replace(chr(92), '/'))
        r = subprocess.run(cmd, capture_output=True, timeout=120)
        return r.stdout.decode('utf-8', 'replace')


def _svg(fichier, fin, objet, recette):
    code = _coeur(fichier, fin)
    html = ('<html><head><meta charset=utf-8></head><body><pre id="o"></pre><script>' + code +
            f'\ndocument.getElementById("o").textContent=btoa(unescape(encodeURIComponent({objet}.svg({json.dumps(recette)}))));</script></body></html>')
    out = _executer(html)
    m = re.search(r'<pre id="o">([^<]+)</pre>', out)
    import base64
    return base64.b64decode(m.group(1)).decode('utf-8')


def motif_svg(recette=None):
    return _svg('motif-figma.html', 'window.PatternEditor = Object.freeze', 'PatternEditor', recette or {})


def ombre_svg(recette=None):
    return _svg('shadow-overlay.html', 'window.ShadowOverlay = Object.freeze', 'ShadowOverlay', recette or {})


def ombre_png(recette, sortie, echelle=1.0):
    """Calque d'ombre seul (fond transparent), à la taille w×h × échelle. Les ombres sont floues : échelle .25 suffit."""
    from PIL import Image
    r = dict(recette)
    w, h = int(r.get('width', 1140)), int(r.get('height', 843))
    svg = ombre_svg(r)
    html = f'<html><body style="margin:0;background:transparent">{svg}</body></html>'
    tmp = sortie + '.tmp.png'
    _executer(html, png=tmp, taille=(w, h), transparent=True)
    im = Image.open(tmp).convert('RGBA').crop((0, 0, w, h))
    if echelle != 1:
        im = im.resize((max(1, round(w * echelle)), max(1, round(h * echelle))), Image.LANCZOS)
    im.save(sortie, optimize=True)
    os.remove(tmp)
    return sortie
