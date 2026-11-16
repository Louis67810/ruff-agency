"""Motifs récurrents du style (lumières, ombres, formes pixel, formulaires, FAQ) -> calques Figma NATIFS.

Chaque fonction renvoie une liste de Calque. On les pose dans une Scene, puis :
    scene.ecrire('dossier/nom')  ->  nom.svg        (géométrie, calques nommés, à importer avec import_svg)
                                     nom.apercu.svg (même chose avec flous / fusions, pour vérifier à l'œil)
                                     nom.json       (ce que l'import SVG perd : effets, fusion, opacité, polices)
Après import_svg :
    python motifs.py carte  contexte.json > carte.json      (nom de calque -> id, depuis get_design_context ou search_nodes)
    python motifs.py ops    nom.json carte.json              (tableau d'ops pour l'outil batch de Figwright)
    set_blend_mode n'est pas toujours accepté dans batch : si refus, appeler les ops « set_blend_mode » une par une.

Rien n'est figé : chaque motif prend couleur, taille, densité, direction, graine. Les valeurs par défaut sont
celles relevées dans le Figma de Louis (voir README.md). On peut aussi n'utiliser QUE les effets
(effets.json) sur des formes dessinées à la main.
"""
import json
import math
import os
import random
import sys

ICI = os.path.dirname(os.path.abspath(__file__))
EFFETS = json.load(open(os.path.join(ICI, 'effets.json'), encoding='utf-8'))
POIDS = {400: 'Regular', 500: 'Medium', 600: 'Semi Bold', 700: 'Bold'}

# Couleurs du style (nouveau-style). À remplacer si un autre style est utilisé.
SABLE, FOND, TRAIT, FIL = '#EFEBE6', '#F7F5F3', '#D6D0C8', '#DEDAD3'
ENCRE, GRIS, ACCENT, NUIT = '#1A1A1A', '#595959', '#3745F1', '#1A1A1A'


def r2(v):
    return round(v, 2)


class Calque:
    """Un calque nommé : `svg` = élément(s) SVG, `meta` = ce que Figma doit recevoir après import."""

    def __init__(self, nom, svg, effets=None, fusion=None, opacite=None, texte=None, defs=''):
        self.nom, self.svg, self.defs = nom, svg, defs
        self.meta = {}
        if effets:
            self.meta['effets'] = effets  # nom de préréglage (effets.json) ou liste d'effets Figma
        if fusion:
            self.meta['fusion'] = fusion  # MULTIPLY, OVERLAY, SCREEN…
        if opacite is not None:
            self.meta['opacite'] = opacite
        if texte:
            self.meta['texte'] = texte  # {famille, poids, interlettre_px}


# --------------------------------------------------------------------------- LUMIÈRES
def lueur(nom, cx, cy, rx, ry, couleur=ACCENT, flou=200, opacite=1.0):
    """Tache de lumière : ellipse pleine + flou de calque. Mettre DERRIÈRE les cartes."""
    return [Calque(nom, f'<ellipse cx="{r2(cx)}" cy="{r2(cy)}" rx="{r2(rx)}" ry="{r2(ry)}" fill="{couleur}"/>',
                   effets=[{'type': 'LAYER_BLUR', 'radius': flou}], opacite=opacite if opacite < 1 else None)]


def halo(nom, cx, cy, echelle=1.0, couleur=ACCENT, coeur='#FFFFFF'):
    """Halo des témoignages : deux ellipses de couleur floutées 200 + cœur blanc flouté 120 (valeurs exactes)."""
    e = echelle
    return (lueur(nom + '-large', cx, cy, 238.5 * e, 125.5 * e, couleur, 200)
            + lueur(nom + '-moyen', cx - 40 * e, cy, 163 * e, 85.5 * e, couleur, 200)
            + lueur(nom + '-coeur', cx - 137 * e, cy, 101.5 * e, 125.5 * e, coeur, 120))


def store(nom, x, y, largeur=1100, hauteur=520, lames=4, angle=16, couleur='#2E2A26', force=.30,
          flou=9, epaisseur_lame=.045, dalle=.30, fuite=.55, seed=3, inverse=False):
    """Ombre de store vénitien (lumière qui entre par une fenêtre) : `lames` fines bandes + une dalle épaisse,
    en perspective (elles se resserrent et s'effacent vers la droite), tournées de `angle` degrés.
    Fusion MULTIPLY, flou léger. À poser par-dessus un fond clair, souvent en débord de section.
    inverse=True : le côté foncé passe à l'autre bout (à utiliser quand le store est retourné / la fenêtre est à droite)."""
    rnd = random.Random(seed)
    gx1, gx2 = (1, 0) if inverse else (0, 1)
    defs = (f'<linearGradient id="{nom}-g" x1="{gx1}" y1="0" x2="{gx2}" y2="0">'
            f'<stop offset="0" stop-color="{couleur}" stop-opacity="{force}"/>'
            f'<stop offset=".55" stop-color="{couleur}" stop-opacity="{force * .7:.3f}"/>'
            f'<stop offset="1" stop-color="{couleur}" stop-opacity="0"/></linearGradient>')
    a = math.radians(angle)
    ca, sa = math.cos(a), math.sin(a)

    def pt(u, v):  # repère local (u vers la droite, v vers le bas) -> page, rotation autour de (x, y)
        return f'{r2(x + u * ca - v * sa)},{r2(y + u * sa + v * ca)}'

    bandes = []
    pas = hauteur * (1 - dalle) / (lames + .5)
    for i in range(lames + 1):
        dal = i == lames
        h0 = hauteur * (dalle if dal else epaisseur_lame)
        v0 = i * pas if not dal else hauteur * (1 - dalle)
        long = largeur * (rnd.uniform(.78, .95) if not dal else .82)
        h1 = h0 * (1 - fuite)  # la bande s'amincit au loin
        u0 = -i * largeur * .012  # léger décalage vers la gauche en descendant
        d = f'M{pt(u0, v0)} L{pt(u0 + long, v0 + h0 * .5 - h1 * .5 - i * 2)} L{pt(u0 + long, v0 + h0 * .5 + h1 * .5 - i * 2)} L{pt(u0, v0 + h0)} Z'
        bandes.append(d)
    return [Calque(nom, f'<path d="{" ".join(bandes)}" fill="url(#{nom}-g)"/>', defs=defs,
                   effets=[{'type': 'LAYER_BLUR', 'radius': flou}], fusion='MULTIPLY')]


def chute_sombre(nom, largeur=1440, y=0, couleur='#1B1B1B'):
    """Section sombre : bande de 15 px en haut, son ombre noire géante (préréglage « chute-sombre ») assombrit
    le haut de la section ; le bas reste au gris #1A1A1A -> impression de lumière qui monte du bas."""
    return [Calque(nom, f'<rect x="0" y="{y}" width="{largeur}" height="15" fill="{couleur}"/>', effets='chute-sombre')]


def grain_png(chemin, taille=200, seed=7, densite=.5):
    """Fabrique une tuile de grain (noir/blanc, alpha aléatoire) pour import_image en TILE,
    puis set_blend_mode OVERLAY + set_opacity .3 (comme le bruit du pied de page et de la bannière)."""
    from PIL import Image
    rnd = random.Random(seed)
    im = Image.new('RGBA', (taille, taille))
    px = im.load()
    for j in range(taille):
        for i in range(taille):
            if rnd.random() < densite:
                v = 255 if rnd.random() < .5 else 0
                px[i, j] = (v, v, v, rnd.randint(30, 140))
    im.save(chemin)
    return chemin


# --------------------------------------------------------------------------- FORMES PIXEL
def _fondu(sens, u, v):
    """Opacité 0..1 selon la position normalisée (u, v) dans la zone. sens : bas, haut, gauche, droite,
    centre (plein au centre), bords (plein aux bords), None."""
    if not sens:
        return 1
    return max(0, min(1, {'bas': 1 - v, 'haut': v, 'gauche': u, 'droite': 1 - u,
                          'centre': 1 - math.hypot(u - .5, v - .5) * 1.9,
                          'bords': math.hypot(u - .5, v - .5) * 1.9 - .15}[sens]))


def grille_pixel(nom, x, y, colonnes=20, rangees=20, taille=28.45, fond='#F4F3F0', clair='#FFFFFF',
                 part_clair=.22, fondu='bas', paliers=6, seed=11, ecart=0):
    """Grille de carrés pleins (appel final : 20 × 20 de 28,45 px, 78 % #F4F3F0 / 22 % blanc) qui s'efface
    dans un sens. Regroupée en un chemin par couleur et par palier d'opacité (peu de calques, éditable)."""
    rnd = random.Random(seed)
    groupes = {}
    for j in range(rangees):
        for i in range(colonnes):
            a = _fondu(fondu, (i + .5) / colonnes, (j + .5) / rangees)
            if a <= .02:
                continue
            p = math.ceil(a * paliers) / paliers
            c = clair if rnd.random() < part_clair else fond
            px, py = x + i * (taille + ecart), y + j * (taille + ecart)
            groupes.setdefault((c, p), []).append(f'M{r2(px)} {r2(py)}h{taille}v{taille}h-{taille}Z')
    out = []
    for k, ((c, p), ds) in enumerate(sorted(groupes.items(), key=lambda t: t[0][1])):
        out.append(Calque(f'{nom}-{k:02d}', f'<path d="{"".join(ds)}" fill="{c}" fill-opacity="{r2(p)}"/>'))
    return out


def forme_pixel(nom, x, y, motif, taille=28, couleur='#FFFFFF', opacite=None, fusion=None, flou=None, rayon=0):
    """Forme dessinée en pixels à partir d'un motif texte ('X' = plein), ex. croix, flèche, lettre :
        ['.X.', 'XXX', '.X.']
    Union en un seul chemin (un calque). Appel final : croix blanches, fusion OVERLAY, parfois floutées 39,7."""
    ds = []
    for j, ligne in enumerate(motif):
        i = 0
        while i < len(ligne):
            if ligne[i] == 'X':
                k = i
                while k < len(ligne) and ligne[k] == 'X':
                    k += 1
                ds.append(f'M{r2(x + i * taille)} {r2(y + j * taille)}h{r2((k - i) * taille)}v{taille}h-{r2((k - i) * taille)}Z')
                i = k
            else:
                i += 1
    eff = [{'type': 'LAYER_BLUR', 'radius': flou}] if flou else None
    return [Calque(nom, f'<path d="{"".join(ds)}" fill="{couleur}"/>', effets=eff, fusion=fusion, opacite=opacite)]


CROIX = ['.X.', 'XXX', '.X.']
CROIX_LARGE = ['..X..', 'XXXXX', '..X..']
MARCHE = ['X..', 'XX.', 'XXX']
FLECHE = ['..X.', 'XXXX', '..X.']


def rubans(nom, x, y, nombre=5, largeur=608, hauteur=52, ecart=12, decalage=76, couleur='#FFFFFF',
           opacite=.09, flou=None, sens=1):
    """Barres décalées en escalier (bannière indigo : blanc 9 %, 608 × 52 ; appel final : blanc 20 %, 168 × 31,
    floutées). sens = 1 vers la droite en descendant, -1 vers la gauche."""
    ds = []
    for i in range(nombre):
        ds.append(f'M{r2(x + sens * i * decalage)} {r2(y + i * (hauteur + ecart))}h{largeur}v{hauteur}h-{largeur}Z')
    eff = [{'type': 'LAYER_BLUR', 'radius': flou}] if flou else None
    return [Calque(nom, f'<path d="{"".join(ds)}" fill="{couleur}" fill-opacity="{opacite}"/>', effets=eff)]


def barre_pixel(nom, x, y, largeur=1140, hauteur=15, case=5, couleur=ACCENT, densite_debut=.9, densite_fin=.1, seed=5):
    """Bande de pixels indigo qui se raréfie (séparateur ou bord de hero). case = taille d'un pixel."""
    rnd = random.Random(seed)
    ds = []
    cols, rows = int(largeur // case), int(hauteur // case)
    for i in range(cols):
        dens = densite_debut + (densite_fin - densite_debut) * i / max(1, cols - 1)
        for j in range(rows):
            if rnd.random() < dens:
                ds.append(f'M{r2(x + i * case)} {r2(y + j * case)}h{case}v{case}h-{case}Z')
    return [Calque(nom, f'<path d="{"".join(ds)}" fill="{couleur}"/>')]


def escalier_tuiles(nom, x, y, marches=4, taille=64, sens='droite', teinte='#4F5CF2', trait='#DAD5CD', fond=FOND):
    """Panneau en tuiles biseautées qui montent en escalier (côtés du hero contact) : tuiles teintées
    indigo 10 % + contour indigo 20 %, joints #DAD5CD, voile de fond qui efface le haut."""
    out, ds_t, ds_j = [], [], []
    for m in range(marches):
        for k in range(m + 1):
            col = m if sens == 'droite' else marches - 1 - m
            tx, ty = x + col * taille, y + (marches - 1 - k) * taille
            ds_t.append(f'M{tx + 4} {ty + 4}h{taille - 8}v{taille - 8}h-{taille - 8}Z')
            ds_j.append(f'M{tx + .5} {ty + .5}h{taille - 1}v{taille - 1}h-{taille - 1}Z')
    w, h = marches * taille, marches * taille
    out.append(Calque(nom + '-joints', f'<path d="{"".join(ds_j)}" fill="none" stroke="{trait}"/>'))
    out.append(Calque(nom + '-tuiles', f'<path d="{"".join(ds_t)}" fill="{teinte}" fill-opacity=".1" stroke="{teinte}" stroke-opacity=".2"/>'))
    defs = (f'<linearGradient id="{nom}-v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{fond}"/>'
            f'<stop offset=".9" stop-color="{fond}" stop-opacity="0"/></linearGradient>')
    out.append(Calque(nom + '-voile', f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="url(#{nom}-v)"/>', defs=defs))
    return out


def tuiles_repetables(nom, x, y, largeur, hauteur, pas=110, h=42, periode=6, zigzag=2, phase=0, alterne=True,
                      couleur=ACCENT, trait=TRAIT, fond=FOND, fondu='droite', longueur=.8, intensite=1.0, rayon=6):
    """Motif des tuiles à escalier indigo du Figma de Louis, version PARFAITEMENT RÉPÉTABLE (remplace le mode
    « répéter » de motif-figma.html, dont les rangées avaient des périodes différentes et des raccords visibles).
    Tout est calé sur une seule grille : tuiles `pas` × `h`, jointes de 2 px ; période horizontale = 2 pas ;
    période verticale = `periode` rangées (par défaut 4 rangées grises + une paire de rangées en zigzag).
    Les tuiles indigo (fond 10 %, contour 20 %, anneau 10 % décalé de 4 px) alternent haut/bas d'une colonne à l'autre.
    alterne=True : la phase du zigzag s'inverse à chaque période verticale (comme le haut / bas de l'original).
    fondu : 'droite' | 'gauche' | 'haut' | 'bas' | None — voile de la couleur du fond, en 3 couches comme l'original.
    Le motif est découpé aux bords (x, y, largeur, hauteur) : poser plusieurs blocs côte à côte avec le même pas
    se raccorde exactement."""
    cols = int(largeur // pas) + 3
    rows = int(hauteur // h) + 2
    g, halos, fills, traits = [], [], [], []
    ind = set()
    for j in range(rows):
        k = j % periode
        per = j // periode
        if zigzag and k in (2, 3):
            ph = (phase + (per if alterne else 0)) % 2
            for i in range(cols):
                haut = (i + ph) % 2 == 0
                if (k == 2) == haut:
                    ind.add((i, j))
    def rr(x0, y0, w0, h0, rad):
        iw, ih = w0 - 2 * rad, h0 - 2 * rad
        return (f'M{r2(x0 + rad)} {r2(y0)}h{r2(iw)}a{rad} {rad} 0 0 1 {rad} {rad}v{r2(ih)}a{rad} {rad} 0 0 1 -{rad} {rad}'
                f'h-{r2(iw)}a{rad} {rad} 0 0 1 -{rad} -{rad}v-{r2(ih)}a{rad} {rad} 0 0 1 {rad} -{rad}Z')
    for j in range(rows):
        for i in range(cols):
            tx, ty = i * pas, j * h
            if (i, j) in ind:
                # tuile indigo gonflée de 3 px : deux tuiles voisines se chevauchent et forment un escalier continu
                fills.append(rr(tx - 2, ty - 2, pas + 4, h + 4, rayon))
                halos.append(rr(tx - 6, ty - 6, pas + 12, h + 12, rayon + 4))
            else:
                g.append(rr(tx + 1, ty + 1, pas - 2, h - 2, rayon))
    cid = f'{nom}-clip'
    defs = f'<clipPath id="{cid}"><rect width="{largeur}" height="{hauteur}"/></clipPath>'
    out = []
    F = "".join(fills)
    corps = (f'<rect width="{largeur}" height="{hauteur}" fill="{fond}"/>'
             f'<path d="{"".join(g)}" fill="none" stroke="{trait}"/>'
             f'<path d="{"".join(halos)}" fill="none" stroke="{couleur}" stroke-opacity=".1"/>'
             f'<path d="{F}" fill="none" stroke="{couleur}" stroke-opacity=".25" stroke-width="2"/>'
             f'<path d="{F}" fill="{fond}"/>'
             f'<path d="{F}" fill="{couleur}" fill-opacity=".1"/>')
    if fondu:
        sens = {'droite': (1, 0, 0, 0), 'gauche': (0, 0, 1, 0), 'haut': (0, 1, 0, 0), 'bas': (0, 0, 0, 1)}[fondu]
        starts = [.0, .1, .1]
        for n, st in enumerate(starts):
            gid = f'{nom}-f{n}'
            a = intensite
            defs += (f'<linearGradient id="{gid}" x1="{sens[0]}" y1="{sens[1]}" x2="{sens[2]}" y2="{sens[3]}">'
                     f'<stop offset="{st}" stop-color="{fond}" stop-opacity="{a}"/><stop offset="{r2(st + longueur * (1 - st))}" stop-color="{fond}" stop-opacity="0"/></linearGradient>')
            corps += f'<rect width="{largeur}" height="{hauteur}" fill="url(#{gid})"/>'
    # décalage du motif pour que le bloc commence sur une jointure (x, y) de la page
    out.append(Calque(nom, f'<g transform="translate({x} {y})"><g clip-path="url(#{cid})">{corps}</g></g>', defs=defs))
    return out


def epingle(nom, cx, cy, r=34):
    """Punaise de coin (photos épinglées, cartes) : socle clair dégradé, ombre noire floutée décalée, tête blanche."""
    defs = (f'<radialGradient id="{nom}-s"><stop offset="0" stop-color="#FDFDFD"/><stop offset="1" stop-color="#EFEFEF"/></radialGradient>'
            f'<radialGradient id="{nom}-t" cx=".35" cy=".3"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E4E1DD"/></radialGradient>')
    return [Calque(nom + '-ombre', f'<circle cx="{cx - r * .35}" cy="{cy + r * .45}" r="{r * .8}" fill="#000" fill-opacity=".5"/>',
                   effets=[{'type': 'LAYER_BLUR', 'radius': 32 * r / 34}]),
            Calque(nom + '-socle', f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#{nom}-s)"/>', defs=defs, effets='metal-bosse'),
            Calque(nom + '-tete', f'<circle cx="{cx}" cy="{cy}" r="{r * .38}" fill="url(#{nom}-t)"/>', effets='ombre-flottante')]


# --------------------------------------------------------------------------- INTERFACE : FORMULAIRES, FAQ
def _texte(nom, x, y, txt, taille=16, poids=500, couleur=ENCRE, ancre='start', interlettre=-2):
    esc = txt.replace('&', '&amp;').replace('<', '&lt;')
    ls = r2(taille * interlettre / 100)
    return Calque(nom, f'<text x="{r2(x)}" y="{r2(y)}" font-family="Inter" font-size="{taille}" font-weight="{poids}" '
                       f'letter-spacing="{ls}" fill="{couleur}" text-anchor="{ancre}">{esc}</text>',
                  texte={'famille': 'Inter', 'poids': poids, 'interlettre': ls})


def champ(nom, x, y, largeur, libelle, indication, hauteur=48, rayon=100, fond='#FFFFFF'):
    """Champ de formulaire : libellé 16 Medium #262626, 8 px, pilule h48 contour 1 px #EBE5E0, indication #707070."""
    return [_texte(nom + '-libelle', x, y + 17, libelle, 16, 500, '#262626'),
            Calque(nom + '-champ', f'<rect x="{x + .5}" y="{y + 32.5}" width="{largeur - 1}" height="{hauteur - 1}" rx="{min(rayon, hauteur / 2)}" fill="{fond}" stroke="#EBE5E0"/>'),
            _texte(nom + '-indication', x + 20, y + 32 + hauteur / 2 + 5.5, indication, 15, 500, '#707070')]


def zone_texte(nom, x, y, largeur, libelle, indication, hauteur=109):
    """Zone de message : même chose, rayon 12, hauteur 109."""
    return [_texte(nom + '-libelle', x, y + 17, libelle, 16, 500, '#262626'),
            Calque(nom + '-champ', f'<rect x="{x + .5}" y="{y + 32.5}" width="{largeur - 1}" height="{hauteur - 1}" rx="12" fill="#FFFFFF" stroke="#EBE5E0"/>'),
            _texte(nom + '-indication', x + 20, y + 32 + 30, indication, 15, 500, '#707070')]


def bouton(nom, x, y, texte, principal=True, largeur=None, hauteur=47):
    """Bouton pilule : principal #1A1A1A texte blanc (lumière intérieure), secondaire #EFEBE7 contour #EBE5E0."""
    w = largeur or round(len(texte) * 8.2 + 34)
    fond, coul = (ENCRE, '#FFFFFF') if principal else ('#EFEBE7', '#262626')
    contour = '' if principal else ' stroke="#EBE5E0"'
    return [Calque(nom + '-fond', f'<rect x="{x}" y="{y}" width="{w}" height="{hauteur}" rx="{hauteur / 2}" fill="{fond}"{contour}/>',
                   effets='bouton-noir' if principal else None),
            _texte(nom + '-texte', x + w / 2, y + hauteur / 2 + 5.5, texte, 15, 500, coul, 'middle')]


def formulaire(nom, x, y, largeur=570, champs=None, message='Message', envoi='Envoyer', gap=24):
    """Formulaire de contact : champs par paires (deux colonnes) ou seuls, zone de message, bouton noir pleine
    largeur h51. champs = [('Prénom', 'Jeanne'), ('Nom', 'Martin')], [('E-mail', 'jeanne@…')] (une liste par ligne)."""
    champs = champs or [[('Prénom', 'Jeanne'), ('Nom', 'Martin')], [('E-mail professionnel', 'jeanne@entreprise.fr')]]
    out, cy = [], y
    for li, ligne in enumerate(champs):
        n = len(ligne)
        w = (largeur - gap * (n - 1)) / n
        for ci, (lib, ind) in enumerate(ligne):
            out += champ(f'{nom}-l{li}c{ci}', x + ci * (w + gap), cy, w, lib, ind)
        cy += 32 + 48 + gap
    if message:
        out += zone_texte(f'{nom}-message', x, cy, largeur, message, 'Dites-nous en quelques mots…')
        cy += 32 + 109 + gap + 8
    out += bouton(f'{nom}-envoi', x, cy, envoi, True, largeur, 51)
    return out, cy + 51 - y


def faq(nom, x, y, questions, ouverte=0, reponse='', largeur=946, numeros=False):
    """Liste FAQ exacte : colonne 946 entre traits verticaux #D6D0C8 ; question ouverte sur fond blanc
    (24 px de marge, trait interne #EBE5E0, réponse 16 #595959) ; questions fermées h75, 18 Semi Bold #1A1A1A,
    chevron indigo 1,5 px ; traits #D6D0C8 entre les questions. Renvoie (calques, hauteur)."""
    out, cy = [], y
    for k, q in enumerate(questions):
        t = (f'{k + 1:02d}  ' if numeros else '') + q
        if k == ouverte:
            lignes = _coupe(reponse, 100)
            h = 24 + 27 + 20 + 1 + 20 + 24 * len(lignes) + 24
            out.append(Calque(f'{nom}-q{k}-fond', f'<rect x="{x}" y="{cy}" width="{largeur}" height="{h}" fill="#FFFFFF"/>'))
            out.append(_texte(f'{nom}-q{k}-titre', x + 24, cy + 24 + 20, t, 18, 600))
            out.append(Calque(f'{nom}-q{k}-chevron', f'<path d="M{x + largeur - 37} {cy + 43}l5 -5 5 5" fill="none" stroke="{ACCENT}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'))
            out.append(Calque(f'{nom}-q{k}-filet', f'<path d="M{x} {cy + 71.5}h{largeur}" fill="none" stroke="#EBE5E0"/>'))
            for i, l in enumerate(lignes):
                out.append(_texte(f'{nom}-q{k}-r{i}', x + 24, cy + 91 + 18 + i * 24, l, 16, 500, GRIS))
        else:
            h = 75
            out.append(_texte(f'{nom}-q{k}-titre', x + 24, cy + 24 + 20, t, 18, 600))
            out.append(Calque(f'{nom}-q{k}-chevron', f'<path d="M{x + largeur - 37} {cy + 35}l5 5 5 -5" fill="none" stroke="{ACCENT}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'))
        cy += h
        out.append(Calque(f'{nom}-q{k}-trait', f'<path d="M{x} {cy - .5}h{largeur}" fill="none" stroke="{TRAIT}"/>'))
    out.insert(0, Calque(f'{nom}-bords', f'<path d="M{x + .5} {y}V{cy}M{x + largeur - .5} {y}V{cy}M{x - 97} {y + .5}H{x + largeur + 97}" fill="none" stroke="{TRAIT}"/>'))
    return out, cy - y


def _coupe(txt, n):
    mots, lignes, cur = txt.split(), [], ''
    for m in mots:
        if len(cur) + len(m) + 1 > n:
            lignes.append(cur)
            cur = m
        else:
            cur = (cur + ' ' + m).strip()
    return lignes + ([cur] if cur else [])


def logotype_geant(nom, x, y, texte, taille=265, couleur_contour='#333333', remplissage='#000000', opacite_fond=.01):
    """Logotype géant coupé en bas du pied de page sombre : quasi transparent, contour fin, liseré de lumière
    blanche en haut (préréglage « reflet-haut »)."""
    c = _texte(nom, x, y, texte, taille, 600, remplissage, 'middle')
    c.svg = c.svg.replace(f'fill="{remplissage}"', f'fill="{remplissage}" fill-opacity="{opacite_fond}" stroke="{couleur_contour}" stroke-width="1.5"')
    c.meta['effets'] = 'reflet-haut'
    return [c]


# --------------------------------------------------------------------------- SCÈNE ET EXPORT
class Scene:
    def __init__(self, largeur, hauteur, fond=None):
        self.w, self.h, self.fond, self.calques = largeur, hauteur, fond, []

    def ajoute(self, calques):
        if isinstance(calques, tuple):
            calques = calques[0]
        self.calques += calques
        return self

    def _svg(self, apercu):
        defs, corps = [], []
        if self.fond:
            corps.append(f'<rect id="fond" width="{self.w}" height="{self.h}" fill="{self.fond}"/>')
        for c in self.calques:
            if c.defs:
                defs.append(c.defs)
            style = ''
            if apercu:
                eff = c.meta.get('effets')
                eff = EFFETS[eff]['effets'] if isinstance(eff, str) else (eff or [])
                flou = [e['radius'] for e in eff if e['type'] == 'LAYER_BLUR']
                ombres = [e for e in eff if e['type'] == 'DROP_SHADOW']
                f = []
                if flou:
                    f.append(f'blur({flou[0] / 2}px)')
                for e in ombres[:4]:
                    f.append(f'drop-shadow({e["offset"]["x"]}px {e["offset"]["y"]}px {e["radius"] / 2}px {e["color"]})')
                if f:
                    style += 'filter:' + ' '.join(f) + ';'
                if c.meta.get('fusion'):
                    style += 'mix-blend-mode:' + c.meta['fusion'].lower().replace('_', '-') + ';'
                if c.meta.get('opacite') is not None:
                    style += f'opacity:{c.meta["opacite"]};'
            st = f' style="{style}"' if style else ''
            corps.append(f'<g id="{c.nom}"{st}>{c.svg}</g>')
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}">'
                f'<defs>{"".join(defs)}</defs>{"".join(corps)}</svg>')

    def ecrire(self, base):
        os.makedirs(os.path.dirname(base) or '.', exist_ok=True)
        open(base + '.svg', 'w', encoding='utf-8').write(self._svg(False))
        open(base + '.apercu.svg', 'w', encoding='utf-8').write(self._svg(True))
        meta = {c.nom: c.meta for c in self.calques if c.meta}
        json.dump(meta, open(base + '.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        return base


# --------------------------------------------------------------------------- OPS FIGWRIGHT
def couleur(hexa):
    h = hexa.lstrip('#')
    a = int(h[6:8], 16) / 255 if len(h) == 8 else 1
    return {'r': round(int(h[0:2], 16) / 255, 4), 'g': round(int(h[2:4], 16) / 255, 4), 'b': round(int(h[4:6], 16) / 255, 4), 'a': round(a, 4)}


def effets_figma(spec, vecteur=False):
    """Préréglage (nom) ou liste -> effets au format set_effects. vecteur=True retire le spread (non géré)."""
    lst = EFFETS[spec]['effets'] if isinstance(spec, str) else spec
    out = []
    for e in lst:
        e = dict(e)
        e.setdefault('visible', True)
        if 'color' in e and isinstance(e['color'], str):
            e['color'] = couleur(e['color'])
        if e['type'] in ('DROP_SHADOW', 'INNER_SHADOW'):
            e.setdefault('spread', 0)
            e.setdefault('blendMode', 'NORMAL')
            if vecteur:
                e['spread'] = 0
        out.append(e)
    return out


def ops(meta, carte):
    out = []
    for nom, m in meta.items():
        nid = carte.get(nom)
        if not nid:
            continue
        if m.get('effets'):
            out.append({'tool': 'set_effects', 'params': {'nodeId': nid, 'effects': effets_figma(m['effets'], vecteur=True)}})
        if m.get('fusion'):
            out.append({'tool': 'set_blend_mode', 'params': {'nodeId': nid, 'blendMode': m['fusion']}})
        if m.get('opacite') is not None:
            out.append({'tool': 'set_opacity', 'params': {'nodeId': nid, 'opacity': m['opacite']}})
        if m.get('texte'):
            t = m['texte']
            out.append({'tool': 'set_text_properties', 'params': {'nodeId': nid, 'fontName': {'family': t['famille'], 'style': POIDS.get(t['poids'], 'Medium')},
                                                                  'letterSpacing': {'unit': 'PIXELS', 'value': t['interlettre']}}})
    return out


def carte_depuis(fichier):
    """get_design_context (ou search_nodes) sauvegardé -> {nom: id}. Le calque importé porte l'id SVG du groupe."""
    raw = open(fichier, encoding='utf-8').read()
    if raw.lstrip().startswith('['):
        raw = json.loads(raw)[0]['text']
    d = json.loads(raw)
    m = {}

    def walk(n):
        m.setdefault(n['name'], n['id'])
        for c in n.get('children', []):
            walk(c)
    for n in d.get('nodes', []):
        walk(n)
    return m


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    if cmd == 'ops':
        print(json.dumps(ops(json.load(open(sys.argv[2], encoding='utf-8')), json.load(open(sys.argv[3], encoding='utf-8'))),
                         ensure_ascii=False, separators=(',', ':')))
    elif cmd == 'carte':
        print(json.dumps(carte_depuis(sys.argv[2]), ensure_ascii=False))
    elif cmd == 'effets':
        print(json.dumps(effets_figma(sys.argv[2]), ensure_ascii=False))
    else:
        print(__doc__)
