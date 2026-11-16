"""Moteur d'illustration — bibliothèque Python (v1.0, 06/11/2026).

Tout ce qui fait la qualité est ici, sous forme de fonctions qui renvoient du HTML/SVG :
  - décors : orbites, câbles en éventail, bords fantômes, fondus, filtres d'ombre intérieure ;
  - compositions validées (catalogue) : pile, carte sur patte, bouclier, courbe, demande,
    éditeur partagé, arc d'outils, sécurité ;
  - sections : en-tête centré + grille 2×2 à traits fins ;
  - page() : assemble une page autonome (moteur + style intégrés dans le fichier).

Aucune couleur en dur : tout passe par var(--s-*) (styles/*.css).
Usage :
    import sys; sys.path.insert(0, r'C:/Users/louis/.claude/skills/illustration-systeme/moteur')
    import illus as il
    html = il.page('neutre', il.scene(il.pile(), 569, 442))
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
SKILL = os.path.dirname(HERE)


# =====================================================================================
# Page
# =====================================================================================
def page(style, body, title='Illustration', extra_css='', symboles='', logo=None):
    """Page HTML autonome : le style puis le moteur sont copiés dans le fichier.
    style    : nom d'un style du skill ('neutre', 'nouveau-style') OU chemin d'un fichier .css
               (le style d'une marque cliente vit dans SON projet, pas dans le skill).
    symboles : <symbol id="..."> en plus (icônes du secteur), utilisables avec <use href="#...">.
    logo     : (viewBox, contenu_svg) du vrai logo ; remplace l'emplacement #il-marque partout
               (marque lumineuse, bouclier gravé, arc). Le logo doit utiliser currentColor."""
    chemin = style if style.endswith('.css') else os.path.join(SKILL, 'styles', f'{style}.css')
    st = open(chemin, encoding='utf-8').read()
    mo = open(os.path.join(HERE, 'moteur.css'), encoding='utf-8').read()
    return f'''<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<style>{st}
{mo}
body {{ margin: 0; background: var(--s-bg); color: var(--s-ink); font-family: var(--s-font-text); }}
{extra_css}</style></head><body>
{symbols(logo)}
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>{symboles}</defs></svg>
{body}
</body></html>'''


def exact(nom, w=None, h=None, style=''):
    """Un élément EXACT de la bibliothèque (export Figma vérifié au pixel) : logo, pastille, bouclier,
    carte du monde, curseur, plateau d'avatars, marque lumineuse… Intégré dans la page (autonome).
    Liste : bibliotheque/index.json (clé « elements »). Toujours préférer exact() à une recréation."""
    import base64
    import json
    lib = os.path.join(SKILL, 'bibliotheque')
    el = next(e for e in json.load(open(os.path.join(lib, 'index.json'), encoding='utf-8'))['elements'] if e['nom'] == nom)
    path = os.path.join(lib, 'elements', el['fichier'])
    mime = 'image/svg+xml' if path.endswith('.svg') else 'image/png'
    data = base64.b64encode(open(path, 'rb').read()).decode()
    size = (f' width="{w}"' if w else '') + (f' height="{h}"' if h else '')
    return f'<img src="data:{mime};base64,{data}"{size} style="{style}" alt="">'


def scene(inner, w=569, h=597, label='', cls='', style=''):
    """Une scène : fond du style, enfants positionnés en absolu. 569×597 (haute) ou 569×442 (basse)."""
    return f'<div class="il-scene {cls}" role="img" aria-label="{label}" style="width:{w}px;height:{h}px;{style}">{inner}</div>'


# =====================================================================================
# Symboles (une fois par page)
# =====================================================================================
def symbols(logo=None):
    s = _SYMBOLS
    if logo:
        s = re.sub(r'<symbol id="il-marque".*?</symbol>', f'<symbol id="il-marque" viewBox="{logo[0]}">{logo[1]}</symbol>', s, flags=re.S)
    return s


_SYMBOLS = '''<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <symbol id="il-plus" viewBox="0 0 16 16"><path d="M8 3.5v9M3.5 8h9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></symbol>
  <symbol id="il-cursor" viewBox="0 0 30 34"><path d="M3 2.5 26.5 13.6c1.3.6 1.2 2.5-.2 2.9l-9.6 2.8-4 9.3c-.6 1.3-2.5 1.2-2.9-.2L2.6 4.3c-.3-1.1.4-1.9 1.4-1.8Z"/></symbol>
  <symbol id="il-star" viewBox="0 0 24 24"><path d="M12 3.5c.6 3.9 2.6 5.9 6.5 6.5-3.9.6-5.9 2.6-6.5 6.5-.6-3.9-2.6-5.9-6.5-6.5 3.9-.6 5.9-2.6 6.5-6.5Z" fill="currentColor"/></symbol>
  <symbol id="il-alert" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="currentColor"/><path d="M12 7.5v5.5M12 16.2v.3" stroke="#fff" stroke-width="2" stroke-linecap="round"/></symbol>
  <symbol id="il-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></symbol>
  <symbol id="il-filter" viewBox="0 0 24 24"><path d="M4 5h16l-6 7.5V19l-4-2v-4.5Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></symbol>
  <symbol id="il-chat" viewBox="0 0 24 24"><path d="M5 18.5 6 15a7 7 0 1 1 3 3Z" fill="none" stroke="#fff" stroke-width="1.9" stroke-linejoin="round"/></symbol>
  <symbol id="il-chev" viewBox="0 0 16 16"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="il-badge" viewBox="0 0 24 24"><path d="M12 2.5l2.3 1.7 2.8-.2 1 2.6 2.5 1.3-.5 2.8 1.4 2.4-1.9 2.1-.1 2.8-2.7.7-1.5 2.4-2.7-.9-2.6 1.1-1.7-2.3-2.8-.5-.3-2.8-2-2 1.3-2.5-.6-2.8 2.5-1.4.9-2.7 2.8.1Z" fill="currentColor"/><path d="m8.5 12.2 2.4 2.3 4.6-4.8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="il-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" style="fill:var(--s-ok)"/><path d="m7.5 12.3 3 2.9 6-6.2" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="il-file" viewBox="0 0 16 16"><path d="M4 1.8h5l3.2 3.2v8.2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2.8a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M9 1.8V5h3.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></symbol>
  <symbol id="il-spark" viewBox="0 0 16 16"><path d="M8 2c.4 2.7 1.3 3.6 4 4-2.7.4-3.6 1.3-4 4-.4-2.7-1.3-3.6-4-4 2.7-.4 3.6-1.3 4-4Z" fill="currentColor"/><circle cx="12.5" cy="12.5" r="1.3" fill="currentColor"/></symbol>
  <symbol id="il-users" viewBox="0 0 16 16"><circle cx="6" cy="5.5" r="2.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M1.8 13.5c.5-2.4 2.1-3.6 4.2-3.6s3.7 1.2 4.2 3.6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M10.6 3.4a2.3 2.3 0 0 1 0 4.4M12.2 10.2c1 .5 1.7 1.6 2 3.3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></symbol>
  <symbol id="il-link" viewBox="0 0 16 16"><path d="M6.6 9.4 9.4 6.6M7.2 4.6l1.1-1.1a2.8 2.8 0 0 1 4 4l-1.1 1.1M8.8 11.4l-1.1 1.1a2.8 2.8 0 0 1-4-4l1.1-1.1" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></symbol>
  <symbol id="il-lock" viewBox="0 0 16 16"><rect x="3" y="7" width="10" height="7" rx="2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M5.3 7V5.2a2.7 2.7 0 0 1 5.4 0V7" fill="none" stroke="currentColor" stroke-width="1.4"/></symbol>
  <symbol id="il-up" viewBox="0 0 16 16"><path d="M8 12.5v-9M4 7l4-4 4 4" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <!-- Emplacement de la marque : à remplacer par le vrai logo du client (jamais celui d'une référence) -->
  <symbol id="il-marque" viewBox="0 0 32 24"><rect x="2" y="2" width="28" height="20" rx="10" fill="none" stroke="currentColor" stroke-width="3.6"/><path d="M16 6v12" stroke="currentColor" stroke-width="3.6" stroke-linecap="round"/></symbol>
  <linearGradient id="il-plinth-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--s-tray)"/><stop offset="1" style="stop-color:var(--s-surface)"/></linearGradient>
  <symbol id="il-plinth" viewBox="0 0 240 44" overflow="visible"><path d="M0 .5H240C222 .5 214 6 208 16L198 34C194 41 189 44 181 44H59C51 44 46 41 42 34L32 16C26 6 18 .5 0 .5Z"/></symbol>
</defs></svg>'''


def use(sym, w, h, style='', cls=''):
    return f'<svg class="{cls}" width="{w}" height="{h}" style="{style}"><use href="#{sym}"/></svg>'


def cursor(x, y, small=False, z=6):
    """Curseur sombre à contour blanc. (x, y) = coin haut gauche ; la pointe est à +3,+2.5.
    Règle : la pointe se pose sur le coin bas droit de l'élément cliqué, jamais au milieu."""
    return f'<svg class="il-cursor{" il-cursor--s" if small else ""}" style="left:{x}px;top:{y}px;z-index:{z}"><use href="#il-cursor"/></svg>'


def marque(x=None, y=None, center=False, z=5, zoom=1):
    pos = f'left:50%;transform:translateX(-50%);top:{y}px;' if center else f'left:{x}px;top:{y}px;'
    return f'<div class="il-mark il-halo" style="{pos}z-index:{z};zoom:{zoom}"><div class="il-mark__ring"><div class="il-mark__core"><svg width="32" height="24"><use href="#il-marque"/></svg></div></div></div>'


# =====================================================================================
# Décors
# =====================================================================================
def orbits(cx, cy, rx=214, ry=100, gap=6, z=0):
    """Une paire d'ellipses doublées à `gap` px, noir à ~5 %. Les faire se croiser sur le symbole central."""
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" style="fill:none;stroke:var(--s-orbit)"/><ellipse cx="{cx}" cy="{cy + gap}" rx="{rx}" ry="{ry}" style="fill:none;stroke:var(--s-orbit)"/>'


def svg_layer(content, w, h, z=0, defs=''):
    return f'<svg class="il-svg" viewBox="0 0 {w} {h}" style="z-index:{z}" aria-hidden="true"><defs>{defs}</defs>{content}</svg>'


def wire_gradient(gid, y1, y2, end_opacity=.1):
    return (f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" x1="0" y1="{y1}" x2="0" y2="{y2}">'
            f'<stop offset="0" style="stop-color:var(--s-wire)"/><stop offset=".75" style="stop-color:var(--s-wire);stop-opacity:.8"/>'
            f'<stop offset="1" style="stop-color:var(--s-wire);stop-opacity:{end_opacity}"/></linearGradient>')


def fan_wires(cx, y0, y1, n=16, spread_top=16, spread_bottom=430, gid='il-wg'):
    """Câbles en éventail : partent groupés de (cx, y0) et s'ouvrent jusqu'aux bords en y1.
    Règle : le dégradé ne doit PAS s'effacer avant la courbe (sinon on ne voit que des traits droits)."""
    out = []
    for i in range(n):
        t = (i - (n - 1) / 2) / ((n - 1) / 2)
        x0 = cx + t * spread_top
        xe = cx + t * spread_bottom
        out.append(f'<path d="M{x0:.1f} {y0}C{x0:.1f} {y0 + (y1 - y0) * .55:.0f} {cx + t * 60:.0f} {y1 - (y1 - y0) * .3:.0f} {cx + t * 200:.0f} {y1 - 15} S{xe:.0f} {y1} {xe + t * 60:.0f} {y1 + 4}"/>')
    return f'<g style="fill:none;stroke:url(#{gid});stroke-width:1">{"".join(out)}</g>', wire_gradient(gid, y0, y1 + 10)


def drop_wires(cx, y0, y1, widths=(129, 171, 213, 269, 385, 511, 635, 803), gid='il-dw'):
    """Câbles qui descendent sous une forme pleine (bouclier) puis s'écartent vers les bords."""
    out = []
    for i, w in enumerate(widths):
        for side in (-1, 1):
            xs = cx + side * (8 + 9 * i)
            xe = cx + side * w / 2
            out.append(f'<path d="M{xs:.1f} {y0}V{y0 + 40 + i * 6}C{xs:.1f} {y0 + 150 - i * 4} {xs + (xe - xs) * .25:.1f} {y1 - 4} {xe:.1f} {y1}"/>')
    return f'<g style="fill:none;stroke:url(#{gid});stroke-width:1">{"".join(out)}</g>', wire_gradient(gid, y0, y1)


def inner_filter(fid, inset=(), drops=()):
    """Filtre SVG d'ombres portées + intérieures (valeurs Figma : flou = radius/2).
    Chaque ombre : (dx, dy, radius, couleur_css, opacité). Les couleurs peuvent être des var(--s-*)."""
    parts, merge = [], []
    for k, (dx, dy, r, col, op) in enumerate(drops):
        parts.append(f'<feGaussianBlur in="SourceAlpha" stdDeviation="{r / 2}" result="b{k}"/><feOffset in="b{k}" dx="{dx}" dy="{dy}" result="o{k}"/><feFlood style="flood-color:{col};flood-opacity:{op}"/><feComposite in2="o{k}" operator="in" result="d{k}"/>')
        merge.append(f'<feMergeNode in="d{k}"/>')
    merge.append('<feMergeNode in="SourceGraphic"/>')
    for k, (dx, dy, r, col, op) in enumerate(inset):
        parts.append(f'<feFlood style="flood-color:{col};flood-opacity:{op}"/><feComposite in2="SourceAlpha" operator="out"/><feOffset dx="{dx}" dy="{dy}"/><feGaussianBlur stdDeviation="{max(r / 2, .01)}"/><feComposite in2="SourceAlpha" operator="in" result="i{k}"/>')
        merge.append(f'<feMergeNode in="i{k}"/>')
    return f'<filter id="{fid}" x="-40%" y="-30%" width="180%" height="190%" color-interpolation-filters="sRGB">{"".join(parts)}<feMerge>{"".join(merge)}</feMerge></filter>'


def smooth(pts):
    d = f'M{pts[0][0]} {pts[0][1]}'
    for a, b in zip(pts, pts[1:]):
        mx = (a[0] + b[0]) / 2
        d += f'C{mx} {a[1]} {mx} {b[1]} {b[0]} {b[1]}'
    return d


def avatar(bg, fg='rgba(0,0,0,.35)'):
    """Avatar silhouette (à remplacer par une vraie photo quand on en a)."""
    return f'<span class="il-ava" style="background:{bg}"><svg viewBox="0 0 42 42"><circle cx="21" cy="17" r="7.5" fill="{fg}"/><path d="M6 44c1-10 7.5-15 15-15s14 5 15 15Z" fill="{fg}"/></svg></span>'


SKEL = '<span class="il-row__txt"><span class="il-bar" style="width:72%"></span><span class="il-bar il-bar--s" style="width:100%"></span><span class="il-bar il-bar--s" style="width:55%"></span></span><span class="il-plus"><svg width="16" height="16"><use href="#il-plus"/></svg></span>'


# =====================================================================================
# Catalogue de compositions (chacune validée face à une référence, voir oeil/)
# =====================================================================================
def pile(rows=None, action=1, titre='Messagerie', sous_titre='Connecter à [Marque]'):
    """« Connecter ses outils » (réf. 6002:4968), scène 569×442.
    Pile de 4 lignes décalées de 40 px en escalier (80, 40, 0, 40), espacées de 66 px ; marque au-dessus ;
    UNE seule ligne active (bouton noir + curseur sur son coin) ; orbites croisées sur la marque ;
    lignes fantômes à 80 % coupées par des fondus."""
    rows = rows or [('#4a154b', '#'), ('#25c26a', 'chat'), ('#0a66c2', 'in'), ('#95bf47', 'S')]
    offs = [80, 40, 0, 40]
    html = []
    for i, (bg, g) in enumerate(rows[:4]):
        glyph = '<svg><use href="#il-chat"/></svg>' if g == 'chat' else g
        if i == action:
            body = f'<span class="il-tile" style="background:{bg}">{glyph}</span><span class="il-row__txt"><b>{titre}</b><small>{sous_titre}</small></span><span class="il-plus il-plus--on"><svg width="16" height="16"><use href="#il-plus"/></svg></span>'
        else:
            body = f'<span class="il-tile" style="background:{bg}">{glyph}</span>{SKEL}'
        html.append(f'<div class="il-row" style="position:absolute;left:{offs[i]}px;top:{i * 66}px">{body}</div>')
    ghosts = ''.join(f'<div class="il-row il-ghost" style="left:{x}px;top:{y}px"></div>' for x, y in [(-66, 146), (-106, 212), (-146, 278), (-106, 344), (460, 146), (420, 212), (380, 278), (420, 344)])
    cur = f'<svg class="il-cursor" style="position:absolute;left:{offs[action] + 239}px;top:{action * 66 + 36}px;z-index:2"><use href="#il-cursor"/></svg>'
    return (svg_layer(orbits(285, -28) + orbits(285, 170), 569, 442) + ghosts + '<div class="il-fade-l"></div><div class="il-fade-r"></div>'
            + f'<div style="left:116px;top:146px;width:339px;height:256px;z-index:4">{"".join(html)}{cur}</div>' + marque(y=40, center=True))


def carte_patte(messages=None, pied='Classé automatiquement', bouton='Filtres'):
    """« Trier les messages » (réf. 6002:360), scène 569×597.
    Carte de 307 px dans un cadre double, posée sur une patte en trapèze ; câbles en éventail sous la patte ;
    interface de l'app floutée derrière (masque radial) ; un bouton qui DÉBORDE de la carte."""
    messages = messages or [('il-alert', 'Commande 8421', 'Où en est mon colis ?', '1 min', ('Priorité haute', 'Vérifié')),
                            ('il-alert', 'Commande 8433', 'Le colis est arrivé abîmé.', '5 min', None),
                            ('il-badge', 'Réseau · @camille', 'Votre service est top.', '1 h', None)]
    rows = []
    for ico, t, s, tm, state in messages:
        m = f'<div class="il-msg"><span class="il-msg__ico"><svg width="17" height="17"><use href="#{ico}"/></svg></span><span class="il-msg__txt"><b>{t}</b><small>{s}</small></span><small class="il-msg__time">{tm}</small></div>'
        if state:
            m = (f'<div style="border-radius:10px;overflow:hidden;border:1px solid var(--s-hairline)">{m}<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;font:500 12px/1 var(--s-font-text)">'
                 f'<span style="color:var(--s-alert)">{state[0]}</span><span style="display:flex;align-items:center;gap:6px;color:var(--s-ink-2)">{state[1]}<svg width="15" height="15"><use href="#il-check"/></svg></span></div></div>')
        else:
            m = f'<div style="border-radius:10px;overflow:hidden">{m}</div>'
        rows.append(m)
    wires, wg = fan_wires(284, 470, 600)
    backdrop = '''<div class="il-backdrop" style="left:0;top:0;width:569px;height:597px;-webkit-mask-image:radial-gradient(70% 60% at 45% 42%,#000 40%,transparent 100%);mask-image:radial-gradient(70% 60% at 45% 42%,#000 40%,transparent 100%)">
      <div style="position:absolute;left:36px;top:42px;width:32px;height:32px;border-radius:50%;background:var(--s-accent);opacity:.35"></div>
      <div style="position:absolute;left:40px;top:86px;width:24px;height:24px;border-radius:6px;background:var(--s-ink-3)"></div>
      <div style="position:absolute;left:42px;top:136px;width:18px;height:150px;background:repeating-linear-gradient(180deg,var(--s-line) 0 18px,transparent 18px 38px);border-radius:5px"></div>
      <div style="position:absolute;left:100px;top:58px;font:600 19px/1 var(--s-font-title);color:var(--s-ink-2)">Tableau de bord</div>
      <div style="position:absolute;left:100px;top:92px;width:170px;height:10px;border-radius:5px;background:var(--s-line)"></div>
      <div style="position:absolute;left:100px;top:160px;width:90px;height:2px;background:var(--s-accent);opacity:.5"></div>
      <div style="position:absolute;left:100px;top:236px;width:180px;height:170px;border-radius:12px;border:1px solid var(--s-line)"></div>
      <div style="position:absolute;left:116px;top:290px;font:600 30px/1 var(--s-font-title);color:var(--s-ink-3)">985</div>
      <div style="position:absolute;left:470px;top:290px;font:600 30px/1 var(--s-font-title);color:var(--s-ink-3)">54</div></div>'''
    return (backdrop + svg_layer(wires, 569, 597, 1, wg)
            + f'''<div style="left:131px;top:80px;width:307px;z-index:3;display:flex;flex-direction:column;align-items:center"><div class="il-frame" style="position:relative;z-index:2;width:307px"><div class="il-card" style="padding:10px 10px 16px;display:flex;flex-direction:column;gap:10px">
              <div class="il-field" style="margin-bottom:6px"><svg width="18" height="18"><use href="#il-search"/></svg>Rechercher</div>{"".join(rows)}
              <div style="display:flex;justify-content:center;align-items:center;gap:8px;margin-top:8px;font:500 14px/1 var(--s-font-text);color:var(--s-ink-2)"><span style="width:26px;height:26px;border-radius:50%;background:var(--s-accent);color:#fff;display:grid;place-items:center"><svg width="15" height="15"><use href="#il-star"/></svg></span>{pied}</div></div></div><svg class="il-plinth" style="margin-top:-6px" width="236" height="43"><use href="#il-plinth"/></svg></div>'''
            + f'<div class="il-chip" style="left:377px;top:29px;z-index:4"><svg width="16" height="16"><use href="#il-filter"/></svg>{bouton}<svg width="14" height="14" style="margin-left:14px"><use href="#il-chev"/></svg></div>')


SHIELD = 'M127 1C113 12 86 21.5 52 21C31 20.7 15 15.5 2 8.5V118C2 186 48 233 127 270C206 233 252 186 252 118V8.5C239 15.5 223 20.7 202 21C168 21.5 141 12 127 1Z'


def _shield_layer(w, h):
    return f'<path d="{SHIELD}" transform="scale({w / 254:.4f} {h / 271:.4f})"'


def bouclier(avatars=True, decor=True, uid='sh'):
    """« Bouclier » (réf. 6002:669), scène 569×597. Cinq couches exactes du calque :
    rebord (dégradés radiaux) → filet sombre 10 % → filet blanc 20 % → plaque #FAFAFA → face métal (ombres intérieures).
    Marque GRAVÉE (ombre intérieure), pas posée. Câbles sous la pointe, bords fantômes coupés à gauche/droite."""
    defs = ''.join([
        inner_filter(f'{uid}-base', [(7, 7, 15, '#fff', .47)], [(0, 4.2, 10.1, 'rgb(var(--s-tint-steel))', .16), (0, 17.7, 17.7, 'rgb(var(--s-tint-steel))', .14), (0, 40.4, 24.4, 'rgb(var(--s-tint-steel))', .08), (0, 72.4, 28.6, 'rgb(var(--s-tint-steel))', .02)]),
        inner_filter(f'{uid}-plate', [(0, -3, 0, '#000', .16), (0, 2, 2, '#fff', .8)], [(0, 3, 4, '#000', .15), (0, 2, 3, '#000', .3)]),
        inner_filter(f'{uid}-face', [(-5, -5, 10, 'var(--s-steel-shade)', .25), (5, 5, 5, '#fff', 1)], [(-4, -4, 10, '#fff', .4), (5, 5, 10, 'var(--s-steel-shade)', .4)]),
        inner_filter(f'{uid}-engrave', [(0, 1, 2, '#000', .15)], [(0, 1, 0, '#fff', .25)]),
        f'<radialGradient id="{uid}-r1" cx=".5" cy=".5" r=".72"><stop offset="0" style="stop-color:var(--s-rim-1)"/><stop offset="1" style="stop-color:var(--s-rim-2);stop-opacity:0"/></radialGradient>',
        f'<radialGradient id="{uid}-r2" cx=".05" cy=".02" r="1.1"><stop offset="0" style="stop-color:var(--s-rim-2)"/><stop offset="1" style="stop-color:#fff;stop-opacity:0"/></radialGradient>',
        f'<radialGradient id="{uid}-r3" cx=".38" cy=".28" r=".75"><stop offset="0" style="stop-color:#fff;stop-opacity:.7"/><stop offset="1" style="stop-color:#fff;stop-opacity:0"/></radialGradient>',
        f'<linearGradient id="{uid}-edge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EFEFEF"/><stop offset="1" style="stop-color:var(--s-steel-shade);stop-opacity:.45"/></linearGradient>',
        f'<linearGradient id="{uid}-gh" x1="0" y1="0" x2="0" y2="1"><stop offset=".29" style="stop-color:var(--s-wire)"/><stop offset="1" style="stop-color:var(--s-wire);stop-opacity:0"/></linearGradient>',
        f'<linearGradient id="{uid}-fx" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:var(--s-bg)"/><stop offset="1" style="stop-color:var(--s-bg);stop-opacity:0"/></linearGradient>',
    ])
    wires, wg = drop_wires(284.5, 290, 509, gid=f'{uid}-w')
    defs += wg
    ghost = ''.join(f'<path d="{SHIELD}" transform="translate({-125 + (254 - w) / 2:.1f} {68 + (271 - h) / 2:.1f}) scale({w / 254:.4f} {h / 271:.4f})"/>' for w, h in [(254, 271), (226, 241), (200, 213)])
    deco = ''
    if decor:
        deco = (wires + f'<g style="fill:none;stroke:url(#{uid}-gh)" opacity=".5">{ghost}</g><g style="fill:none;stroke:url(#{uid}-gh)" opacity=".5" transform="translate(569 0) scale(-1 1)">{ghost}</g>'
                + f'<rect x="0" y="52" width="67" height="303" fill="url(#{uid}-fx)"/><rect x="0" y="52" width="67" height="303" fill="url(#{uid}-fx)" transform="translate(569 0) scale(-1 1)"/>')
    body = f'''<g transform="translate(157 68)">
      <g filter="url(#{uid}-base)"><path d="{SHIELD}" style="fill:var(--s-rim-base)"/></g>
      <path d="{SHIELD}" fill="url(#{uid}-r1)"/><path d="{SHIELD}" fill="url(#{uid}-r2)"/><path d="{SHIELD}" fill="url(#{uid}-r3)"/>
      <path d="{SHIELD}" style="fill:none;stroke:var(--s-field);stroke-width:.84"/>
      <g transform="translate(3.1 3.6)">{_shield_layer(248, 263)} fill="none" stroke="rgba(0,0,0,.10)" vector-effect="non-scaling-stroke"/></g>
      <g transform="translate(4.1 4.6)">{_shield_layer(246, 261)} fill="none" stroke="rgba(255,255,255,.2)" vector-effect="non-scaling-stroke"/></g>
      <g transform="translate(9.1 9.6)" filter="url(#{uid}-plate)">{_shield_layer(236, 251)} fill="#FAFAFA"/></g>
      <g transform="translate(13.1 14.6)" filter="url(#{uid}-face)">{_shield_layer(228, 241)} style="fill:var(--s-steel)" stroke="url(#{uid}-edge)" vector-effect="non-scaling-stroke"/></g>
      <g transform="translate(90.8 108)" filter="url(#{uid}-engrave)"><use href="#il-marque" width="74" height="55.5" color="rgba(0,0,0,.08)"/></g></g>'''
    tray = ''
    if avatars:
        tray = '<div class="il-tray" style="left:180.5px;top:465.4px">' + ''.join(avatar(c) for c in ['#CD8BE3', '#DA7D36', '#1F8CB0', '#DAD836']) + '</div>'
    return svg_layer(deco + body, 569, 597, 0, defs) + tray


def courbe(titre='Demandes résolues sans attente', periode='7 jours', kpi='92 %', delta='+18 pts',
           pts=((0, 132), (34, 120), (68, 126), (102, 98), (136, 104), (170, 74), (204, 82), (238, 46), (272, 54), (306, 22), (340, 30)),
           hatch=(7, 9), pin=9, tip=(('Résolues', '128', '#35c6f4'), ('Réponse', '0,3 s', '#ff8a3d')),
           jours=('L', 'M', 'M', 'J', 'V', 'S', 'D'), canaux=True, uid='ch'):
    """Nouvelle composition (inspirée des réf. 6002:4539 et 6002:4764), scène 569×597.
    Carte de courbe dans le cadre double ; aire d'accent ; UNE période hachurée ; grille pointillée ;
    point épinglé + info-bulle sombre qui DÉBORDE de la carte ; curseur sur le point ; orbites ; plateau des canaux."""
    line = smooth(pts)
    area = line + 'V170H0Z'
    hs = smooth(pts[hatch[0]:hatch[1] + 1]) + f'V170H{pts[hatch[0]][0]}Z'
    px, py = pts[pin]
    tipx = 114 + px - 77
    tip_html = ''.join(f'<span style="--dot:{c}"><small>{a}</small>{b}</span>' for a, b, c in tip)
    tray = ''
    if canaux:
        tray = '<div class="il-tray" style="left:214px;top:500px;z-index:3"><span class="il-tile" style="background:#25c26a"><svg><use href="#il-chat"/></svg></span><span class="il-tile" style="background:#ea4335">@</span><span class="il-tile" style="background:#95bf47">S</span></div>'
    return (svg_layer(orbits(285, 168) + orbits(285, 470), 569, 597)
            + f'''<div class="il-frame" style="left:94px;top:146px;width:381px;z-index:3"><div class="il-card il-chart">
          <div class="il-chart__head"><b>{titre}</b><span class="il-label il-label--pill" style="font-size:10px;padding:5px 8px">{periode}</span></div>
          <div class="il-chart__kpi"><strong>{kpi}</strong><em>{delta}</em></div>
          <div class="il-chart__plot"><svg viewBox="0 0 340 170" width="340" height="170" aria-hidden="true"><defs>
            <linearGradient id="{uid}-a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--s-accent);stop-opacity:.28"/><stop offset="1" style="stop-color:var(--s-accent);stop-opacity:0"/></linearGradient>
            <pattern id="{uid}-h" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V6" style="stroke:var(--s-accent);stroke-opacity:.45"/></pattern></defs>
            <g style="stroke:var(--s-hairline)" stroke-dasharray="3 4"><path d="M0 42.5H340M0 85.5H340M0 128.5H340"/></g>
            <path d="{area}" fill="url(#{uid}-a)"/><path d="{hs}" fill="url(#{uid}-h)"/>
            <path d="{line}" style="fill:none;stroke:var(--s-accent)" stroke-width="2" stroke-linecap="round"/>
            <path d="M{px} {py}V170" style="stroke:var(--s-ink)" stroke-dasharray="2 3"/>
            <circle cx="{px}" cy="{py}" r="5" fill="#fff" style="stroke:var(--s-ink)" stroke-width="2.5"/></svg>
            <div class="il-chart__days">{"".join(f"<span>{j}</span>" for j in jours)}</div></div></div></div>'''
            + f'<div class="il-tip" style="left:{tipx}px;top:205px;z-index:5">{tip_html}</div>' + cursor(114 + px - 2, 246 + py) + tray)


# ---------------------------------------------------------------- cases de section (zone 520×300)
def demande(texte='Ajoute un filtre par date à la liste des commandes', option='Mode précis', fichiers=('commandes.tsx', 'filtres.ts'), fantome='api.ts', icone='il-file'):
    """Zone de demande (assistant) : cadre double, lueur d'accent au-dessus, UN bouton d'envoi d'accent, fichiers dessous."""
    files = ''.join(f'<span class="il-file"><svg width="13" height="13" style="color:var(--s-ink-3)"><use href="#{icone}"/></svg>{f}</span>' for f in fichiers)
    if fantome:
        files += f'<span class="il-file il-file--ghost"><svg width="13" height="13"><use href="#{icone}"/></svg>{fantome}</span>'
    return (f'<div class="il-glow" style="left:160px;top:22px;width:200px;height:60px"></div>'
            f'<div class="il-frame" style="left:90px;top:50px;width:340px;z-index:2"><div class="il-card il-prompt__card"><p class="il-prompt__txt">{texte}<span class="il-caret"></span></p>'
            f'<div class="il-prompt__bar"><span class="il-ibtn"><svg width="14" height="14"><use href="#il-plus"/></svg></span><span class="il-prompt__opt">{option}<svg width="12" height="12"><use href="#il-chev"/></svg></span>'
            f'<span class="il-send"><svg width="16" height="16"><use href="#il-up"/></svg></span></div></div></div>'
            f'<div style="left:0;right:0;top:214px;display:flex;justify-content:center;gap:8px">{files}</div>')


CODE_DEFAUT = [
    ('<span class="k">import</span> { <span class="v">useState</span> } <span class="k">from</span> <span class="s">\'react\'</span>', None),
    ('<span class="k">import</span> { <span class="v">Filtre</span>, <span class="v">Liste</span> } <span class="k">from</span> <span class="s">\'./ui\'</span>', None),
    ('', None),
    ('<span class="k">export function</span> <span class="f">Commandes</span>() {', ('#E5689E', False)),
    ('  <span class="k">const</span> [<span class="v">date</span>, <span class="v">setDate</span>] = <span class="f">useState</span>(<span class="k">null</span>)', ('var(--s-accent)', True)),
    ('  <span class="k">return</span> &lt;<span class="f">Liste</span> <span class="v">filtre</span>={<span class="v">date</span>} /&gt;', None),
]


def editeur(code=None, fichier='commandes.tsx', en_ligne='3 en ligne',
            personnes=(('Inès', '#E8833A', 56, 212), ('Hugo', '#22B45E', 418, 6), ('Camille', '#E5689E', 366, 236)), corps=None):
    """Éditeur partagé (collaboration) : cadre double, onglet, lignes surlignées de la couleur de chaque personne,
    curseurs avec prénom en pilule colorée (contour blanc 3 px).
    corps : HTML libre à la place du code (plan de salle, tableau, agenda…) : la mécanique
    (cadre double, onglet, « en ligne », personnes) reste la même. Couleurs des personnes : jamais l'accent."""
    code = code or CODE_DEFAUT
    lines = ''
    for n, (t, m) in enumerate(code, 1):
        cls, st = '', ''
        if m:
            cls = 'mark caret' if m[1] else 'mark'
            st = f' style="--c:{m[0]}"'
        lines += f'<li class="{cls}"{st}><i>{n}</i><span>{t}</span></li>'
    corps = corps if corps is not None else f'<ol class="il-code">{lines}</ol>'
    who = ''.join(f'<div class="il-who" style="left:{x}px;top:{y}px;--c:{c};z-index:3"><svg class="il-cursor il-cursor--s"><use href="#il-cursor"/></svg><span>{p}</span></div>' for p, c, x, y in personnes)
    return (f'<div class="il-frame" style="left:74px;top:46px;width:372px;z-index:1"><div class="il-card" style="overflow:hidden">'
            f'<div class="il-code__tabs"><span class="on"><svg width="12" height="12"><use href="#il-file"/></svg>{fichier}</span><em class="il-live"><i></i>{en_ligne}</em></div>'
            f'{corps}</div></div>{who}')


OUTILS_DEFAUT = [
    (78, 186, '<path d="M12 4v16M4 12h16M6.3 6.3l11.4 11.4M17.7 6.3 6.3 17.7" stroke="#E2732F" stroke-width="2" stroke-linecap="round"/>'),
    (120, 88, '<rect x="5" y="5" width="6" height="6" rx="1.5" fill="#F24E1E"/><rect x="13" y="5" width="6" height="6" rx="3" fill="#A259FF"/><rect x="5" y="13" width="6" height="6" rx="3" fill="#1ABCFE"/><circle cx="16" cy="16" r="3" fill="#0ACF83"/>'),
    (226, 42, '<circle cx="12" cy="12" r="7" fill="none" stroke="#E5383B" stroke-width="2.4"/><circle cx="12" cy="12" r="2.4" fill="#E5383B"/>'),
    (334, 88, '<path d="M12 5 19 18H5Z" fill="#1A1A1A"/>'),
    (376, 186, '<rect x="4.5" y="4.5" width="15" height="15" rx="4" fill="#22B45E"/><path d="M8.5 12.2l2.4 2.3 4.6-4.8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'),
]


def arc_outils(outils=None, etat='Synchronisé', uid='arc', origine=(260, 268)):
    """Arc d'outils (intégrations) : dôme sable, une bande hachurée, 3 arcs concentriques, liens pointillés
    de la marque vers chaque pastille ronde, marque lumineuse au centre, une étiquette d'état.
    outils : liste de (x, y, svg_24x24) ; positions sur l'arc conseillées pour 4 à 6 pastilles :
    (78,186) (120,88) (226,42) (334,88) (376,186). Zone 520×300."""
    outils = outils or OUTILS_DEFAUT
    links = ''.join(f'<path d="M{origine[0]} {origine[1]} L{x + 23} {y + 23}"/>' for x, y, _ in outils)
    badges = ''.join(f'<span class="il-badge" style="left:{x}px;top:{y}px;z-index:2"><svg viewBox="0 0 24 24" width="22" height="22">{g}</svg></span>' for x, y, g in outils)
    defs = (f'<pattern id="{uid}-h" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V7" style="stroke:var(--s-line)"/></pattern>'
            f'<radialGradient id="{uid}-d" cx=".5" cy="1" r="1"><stop offset="0" style="stop-color:var(--s-tray)"/><stop offset=".7" style="stop-color:var(--s-sand)"/><stop offset="1" style="stop-color:var(--s-bg);stop-opacity:0"/></radialGradient>'
            f'<clipPath id="{uid}-c"><path d="M60 300a200 200 0 0 1 400 0Z"/></clipPath>')
    svg = (f'<path d="M60 300a200 200 0 0 1 400 0Z" fill="url(#{uid}-d)"/><g clip-path="url(#{uid}-c)"><path d="M300 300 L460 130 L500 170 L340 340Z" fill="url(#{uid}-h)"/></g>'
           f'<g style="fill:none;stroke:var(--s-orbit)"><path d="M60 300a200 200 0 0 1 400 0"/><path d="M110 300a150 150 0 0 1 300 0"/><path d="M160 300a100 100 0 0 1 200 0"/></g>'
           f'<g style="fill:none;stroke:var(--s-wire)" stroke-dasharray="2 4">{links}</g>')
    return (svg_layer(svg, 520, 300, 0, defs) + badges + marque(y=224, center=True, z=3)
            + f'<span class="il-label il-label--pill" style="left:344px;top:252px;z-index:4"><i class="il-dot"></i>{etat}</span>')


def securite(etat='Chiffré', code=None, icone='il-lock'):
    """Sécurité : le bouclier (sans plateau) devant du code flouté, une étiquette d'état. Zone 520×300."""
    code = code or ['export function Commandes() { const [date, setDate] =', 'import { Filtre, Liste, Paiement } from "./ui"; const',
                    'session.verify(token, { scope: "lecture", exp: 3600 })', 'const chiffre = await crypt.encode(fichier, cle.privee)',
                    'acces.autoriser(utilisateur, ["projet:lire", "projet:ecrire"])', 'return <Liste filtre={date} securise />; } export default',
                    'audit.log({ action: "connexion", ip, appareil, date })']
    sh = scene(bouclier(avatars=False, decor=True, uid='sec'), cls='il-scene--transparent', style='left:38px;top:-12px;zoom:.78;position:absolute')
    sh = sh.replace('<rect x="0" y="52"', '<rect display="none" x="0" y="52"')
    return (f'<div class="il-blurcode" style="inset:20px 0 30px">{"<br>".join(code)}</div>'
            f'<div style="left:0;top:0;width:520px;height:300px;overflow:hidden">{sh}</div>'
            f'<span class="il-label il-label--pill" style="left:336px;top:200px;z-index:4"><svg width="14" height="14"><use href="#{icone}"/></svg>{etat}</span>')


def case(ill):
    """Zone d'illustration d'une case de section : 520×300, enfants en absolu."""
    return f'<div class="il-scene il-scene--transparent" style="width:520px;max-width:100%;height:300px;overflow:visible">{ill}</div>'


# =====================================================================================
# Sections
# =====================================================================================
def section_grille(etiquette, titre, texte, cellules):
    """En-tête centré (étiquette pilule mono, titre, texte) + grille 2×2 à traits fins,
    lignes pointillées qui dépassent, un point à chaque croisement.
    cellules : 4 tuples (illustration_html, icone_symbole, étiquette, titre, texte)."""
    nodes = ''.join(f'<i class="il-node" style="left:{x};top:{y}"></i>' for y in ('0', '50%', '100%') for x in ('0', '50%', '100%'))
    cells = ''.join(f'<article class="il-cell">{case(ill)}<div class="il-cell__txt"><span class="il-label il-label--accent"><svg width="14" height="14"><use href="#{ic}"/></svg>{lab}</span><h3>{t}</h3><p>{d}</p></div></article>'
                    for ill, ic, lab, t, d in cellules)
    return (f'<section class="il-section"><header class="il-head"><span class="il-label il-label--pill" style="font-size:12px;padding:8px 14px">{etiquette}</span>'
            f'<h2>{titre}</h2><p>{texte}</p></header><div class="il-grid2">{nodes}{cells}</div></section>')


CATALOGUE = {
    'pile': (pile, 569, 442, '6002-4968'),
    'carte_patte': (carte_patte, 569, 597, '6002-360'),
    'bouclier': (bouclier, 569, 597, '6002-669'),
    'courbe': (courbe, 569, 597, None),
    'demande': (demande, 520, 300, None),
    'editeur': (editeur, 520, 300, None),
    'arc_outils': (arc_outils, 520, 300, None),
    'securite': (securite, 520, 300, None),
}
