"""Étape 2 : structure (fil de fer) de la landing Pointé, posée sur la grille, AVANT les illustrations.
    python structure.py  -> sortie/structure.svg + .post.json
Chaque case dit : le layout de la banque d'inspiration qu'elle reprend, la copie, et l'idée d'illustration (une info clé).
"""
import os
import sys

ICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(ICI, '..', '..'))
from construit import F, T, V, Section  # noqa: E402

W = 1440
L, R = 150, 1290
GRIS = '#EFEBE7'
TRAIT = '#D6D0C8'

# (nom, y, h, sombre)
SECTIONS = [
    ('01 · Navigation', 0, 87, False),
    ('02 · Hero', 87, 1121, False),
    ('03 · Preuve', 1208, 200, False),
    ('04 · Les agents', 1408, 1000, False),
    ('05 · La clôture', 2408, 1020, False),
    ('06 · Sécurité', 3428, 920, True),
    ('07 · Avis', 4348, 500, False),
    ('08 · FAQ', 4848, 1057, False),
    ('09 · Appel final', 5905, 860, False),
    ('10 · Pied de page', 6765, 1040, True),
]
H = SECTIONS[-1][1] + SECTIONS[-1][2]


def boite(nom, x, y, w, h, titre, detail='', sombre=False):
    """Case de fil de fer : frame grise + intitulé + détail (copie ou idée d'illustration)."""
    f = F(nom, x, y, w, h, fond=('#262626' if sombre else GRIS), rayon=14, contour=(('#404040' if sombre else TRAIT), 1))
    f.ajoute(T(nom + ' · intitulé', 20, 16, titre, 'uimono', couleur='#3745F1' if not sombre else '#4F5CF2'))
    if detail:
        f.ajoute(T(nom + ' · détail', 20, 40, detail, 'ui', w=w - 40, couleur='#E5E1DC' if sombre else '#595959'))
    return f


def entete(prefixe, y, over, titre, intro, sombre=False, ref=''):
    c = '#FBFAF9' if sombre else None
    out = [T(prefixe + ' · sur-titre', 720, y, over, 'over', align='center'),
           T(prefixe + ' · titre', 720, y + 30, titre, 'h2', w=640, align='center', couleur=c),
           T(prefixe + ' · intro', 720, y + 176, intro, 'intro', w=560, align='center', couleur='#A3A3A3' if sombre else None)]
    if ref:
        out.append(T(prefixe + ' · réf', R - 16, y - 70, ref, 'uimono', align='end', couleur='#3745F1'))
    return out


def construit():
    s = Section('2 · Structure (fil de fer)', 0, 0, W, H)
    s.fond = '#F7F5F3'
    for nom, y, h, sombre in SECTIONS:
        f = F(nom, 0, y, W, h, fond='#1A1A1A' if sombre else None)
        # rails + trait de fin + jointures rondes
        coul = '#333333' if sombre else TRAIT
        f.ajoute(V(nom + ' · rails', f'<rect x="{L}" y="0" width="1" height="{h}" fill="{coul}"/><rect x="{R - 1}" y="0" width="1" height="{h}" fill="{coul}"/>'
                   f'<rect x="0" y="{h - 1}" width="{W}" height="1" fill="{coul}"/>'))
        f.ajoute(V(nom + ' · jointures', ''.join(f'<circle cx="{x}" cy="{h - .5}" r="4" fill="#FFFFFF"/>' for x in (L + .5, R - .5)), effets='jointure'))
        s.ajoute(f)
        S = lambda *n: f.ajoute(*n)  # noqa: E731
        if nom.startswith('01'):
            S(T('Nav · texte', 182, 32, 'Pointé    Produit · Agents · Sécurité · Tarifs · Cabinets        [Se connecter] [Essayer gratuitement]', 'label'))
        elif nom.startswith('02'):
            S(T('Hero · réf', R - 16, 20, 'RÉF. HERO CENTRÉ 6072:8 (CLONÉ)', 'uimono', align='end', couleur='#3745F1'))
            S(boite('Hero · badge', 545, 80, 350, 40, 'BADGE', ''))
            S(T('Hero · titre', 720, 150, 'Votre mois se clôture tout seul, ligne par ligne.', 'hero', w=640, align='center'))
            S(T('Hero · texte', 720, 280, "Pointé lit vos relevés, retrouve chaque facture dans vos mails et relance celles qui manquent. Votre comptable reçoit un mois propre, sans rien vous demander.", 'intro', w=480, align='center'))
            S(boite('Hero · boutons', 520, 374, 400, 47, 'VOIR UNE DÉMO · CONNECTER MA BANQUE'))
            S(boite('Hero · motif gauche', L + 1, 0, 285, 700, 'MOTIF DE TUILES + LUMIÈRE (MIROIR)'))
            S(boite('Hero · motif droit', R - 286, 0, 285, 700, 'MOTIF DE TUILES + LUMIÈRE'))
            S(boite('Hero · fenêtre', 343, 463, 754, 612, 'FENÊTRE DE SITE 6075:389 · ILLUSTRATION DE DÉMO',
                    "Le relevé de novembre. Une ligne « Orange Pro · 59,90 € » reçoit sa facture. Curseur « Agent Pointé » dépose la facture, curseur « Julie, comptable » regarde. INFO CLÉ : la ligne passe à « Pointée »."))
        elif nom.startswith('03'):
            S(T('Preuve · réf', R - 16, 12, 'RÉF. BANDEAU « TRUSTED BY » 6086:208 · GRILLE DE 2', 'uimono', align='end', couleur='#3745F1'))
            S(boite('Preuve · case gauche', L + 16, 40, 538, 130, 'CASE 1 · CHIFFRE', 'ILS CLÔTURENT AVEC POINTÉ · 1 200 entreprises · 4,8/5'))
            S(boite('Preuve · case droite', 736, 40, 538, 130, 'CASE 2 · NOMS DE CLIENTS (TEXTE, FICTIFS)', 'Atelier Nord · Maison Lune · Ardent · Bâtir & Co · Studio Ferro · Les Bureaux Verts'))
        elif nom.startswith('04'):
            S(*entete('Agents', 100, 'LES AGENTS', "Deux agents font le travail que personne n'aime faire",
                      "Ils travaillent la nuit, sur vos vrais comptes, et ne vous écrivent que quand il faut décider.", ref='RÉF. BENTO 6086:190 · GRILLE DE 2 + MOTIF + LUMIÈRE'))
            for i, (x, t, il) in enumerate([(L + 16, 'Le rapprochement · Chaque paiement retrouve sa facture, dans vos mails, votre Drive ou vos espaces fournisseurs.',
                                             'ILLUSTRATION : une ligne de banque reliée par un câble à sa facture. INFO CLÉ : « Facture trouvée ».'),
                                            (736, "La relance · Un justificatif manque ? L'agent écrit à la bonne personne, au bon moment, et range la réponse.",
                                             "ILLUSTRATION : un message parti vers Marc (commercial). INFO CLÉ : « Relance envoyée ».")]):
                c = F(f'Agents · carte {i + 1}', x, 380, 538, 580, fond='#FFFFFF', rayon=20, contour=(TRAIT, 1))
                c.ajoute(boite(f'Agents · illustration {i + 1}', 12, 12, 514, 380, 'ZONE ILLUSTRATION', il))
                c.ajoute(T(f'Agents · texte {i + 1}', 28, 420, t, 'body', w=470))
                S(c)
        elif nom.startswith('05'):
            S(*entete('Clôture', 100, 'LA CLÔTURE', 'Le 5 du mois, tout est déjà chez votre comptable',
                      "Pointé prépare l'export au format de votre cabinet et l'envoie dès que la dernière ligne est pointée.", ref='RÉF. ONGLETS + GRANDE CARTE 6086:199'))
            S(boite('Clôture · onglets', 400, 370, 640, 52, 'ONGLETS · RAPPROCHEMENT · RELANCES · TVA · [EXPORT COMPTABLE]'))
            S(boite('Clôture · case texte', L + 16, 460, 538, 500, 'CASE 1 · TEXTE + 2 CHIFFRES',
                    "Un export que votre cabinet accepte tel quel. FEC, Pennylane, Tiime ou Excel. [Voir les formats]. 3 h gagnées chaque mois · 5 jours de clôture en moins."))
            S(boite('Clôture · case illustration', 736, 460, 538, 500, 'CASE 2 · ILLUSTRATION',
                    "Le dossier « Novembre 2026 · 214 lignes » relié par un câble au cabinet. INFO CLÉ : « Envoyé au cabinet »."))
        elif nom.startswith('06'):
            S(*entete('Sécurité', 100, 'SÉCURITÉ', 'Les agents lisent vos comptes. Ils ne paient jamais.',
                      "Pointé se connecte à votre banque en lecture seule, par un agrégateur agréé. Aucun virement ne peut partir d'ici.", sombre=True, ref='RÉF. BLOC SOMBRE 6086:166 · 4 CASES'))
            S(boite('Sécurité · illustration', 343, 340, 754, 300, 'ILLUSTRATION (CHUTE SOMBRE + HALO SOUS LE VERROU)',
                    "Banque à gauche, agents à droite, entre les deux un verrou en verre. INFO CLÉ : « Lecture seule ».", sombre=True))
            for i, t in enumerate(['Lecture seule', 'Agrégateur agréé', 'Hébergé en France', 'Coupé en un clic']):
                S(boite(f'Sécurité · case {i + 1}', L + 16 + i * 285, 700, 253, 160, f'CASE {i + 1}', t, sombre=True))
        elif nom.startswith('07'):
            S(T('Avis · réf', R - 16, 12, 'GRILLE DE 2 · GUILLEMETS 6070:7', 'uimono', align='end', couleur='#3745F1'))
            S(boite('Avis · citation', L + 16, 60, 538, 380, 'CASE 1 · CITATION (GUILLEMETS OFFICIELS)',
                    "« Avant, je passais le premier week-end du mois à chercher des tickets. Maintenant, je reçois un message quand il en manque un, et c'est tout. » Sarah Benali, gérante de Maison Lune"))
            S(boite('Avis · chiffres', 736, 60, 538, 380, 'CASE 2 · DEUX CHIFFRES', '98 % des lignes pointées sans vous · 3 h rendues chaque mois'))
        elif nom.startswith('08'):
            S(T('FAQ · réf', R - 16, 12, 'FAQ 6058:1391 (CLONÉE, TEXTES REMPLACÉS)', 'uimono', align='end', couleur='#3745F1'))
            S(boite('FAQ · bloc', 247, 100, 946, 860, 'FAQ', "Ce qu'on nous demande avant de connecter sa banque. Ouverte : Pointé peut-il faire un virement ? Non, lecture seule."))
        elif nom.startswith('09'):
            S(T('Appel · réf', R - 16, 12, 'RÉF. « ANY APP. ANYWHERE. » 6086:205', 'uimono', align='end', couleur='#3745F1'))
            S(T('Appel · titre', 720, 120, 'Votre banque. Vos factures. Un mois propre.', 'h2', w=600, align='center'))
            S(boite('Appel · tuiles', L + 120, 300, 900, 300, 'TUILES DES OUTILS RELIÉS EN PERSPECTIVE (NOMS EN TEXTE)', 'Qonto · Shine · BNP · Gmail · Outlook · Drive · Pennylane · Tiime'))
            S(boite('Appel · barre', 360, 640, 720, 64, 'BARRE SOMBRE + BOUTON', 'Connectez votre banque en deux minutes · Essayer gratuitement'))
            S(T('Appel · garanties', 720, 730, 'Gratuit 30 jours · Lecture seule · Données en France', 'small', align='center'))
        elif nom.startswith('10'):
            S(boite('Pied · bloc', L + 16, 80, 1108, 860, 'PIED DE PAGE 6058:1493 (CLONÉ, SANS LES PIXELS)',
                    "Le mois prochain se clôture sans vous. Lettre du dirigeant. Colonnes Produit / Ressources / Entreprise. Logotype géant « Pointé ».", sombre=True))
    return s


if __name__ == '__main__':
    print(construit().ecrire(os.path.join(ICI, 'sortie', 'structure')))
