"""Refait les paires « référence | rendu du moteur » de oeil/paires/.
À relancer après toute modification du moteur : si une paire se dégrade, la modification est mauvaise.
    python oeil/build_paires.py [style=nouveau-style]
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(ROOT, 'moteur'))
sys.path.insert(0, os.path.join(ROOT, 'outils'))
import illus as il  # noqa: E402
from rendu import rendu  # noqa: E402
from compare import compare  # noqa: E402

style = sys.argv[1] if len(sys.argv) > 1 else 'nouveau-style'
os.makedirs(os.path.join(HERE, 'paires'), exist_ok=True)
tmp = os.path.join(HERE, '_tmp')
os.makedirs(tmp, exist_ok=True)
for name, (fn, w, h, ref) in il.CATALOGUE.items():
    if not ref:
        continue
    page = os.path.join(tmp, f'{name}.html')
    open(page, 'w', encoding='utf-8').write(il.page(style, il.scene(fn(), w, h, name), extra_css='body{width:%dpx}' % w))
    png = rendu(page, os.path.join(tmp, f'{name}.png'), w, h, 2, trim=False)
    out = compare(os.path.join(HERE, 'references', f'{ref}.png'), png, os.path.join(HERE, 'paires', f'{name}.png'))
    print(out)
