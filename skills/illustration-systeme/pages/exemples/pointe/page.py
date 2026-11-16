"""Étape 3 : sections neuves de la landing Pointé (les autres sont clonées de la landing Escale corrigée par Louis).
    python page.py <section>   -> sortie/<section>.svg + .post.json      (sections : demo, preuve, agents, cloture, securite, avis, appel)
Coordonnées locales à chaque section (largeur 1440). Grille : pages/grille.md (12 col., marge 150, cases de 570 / 285).
"""
import os
import sys

ICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(ICI, '..', '..'))
from construit import F, T, V, Section  # noqa: E402

W, L, R, M = 1440, 150, 1290, 720
TRAIT, TRAIT_SOMBRE = '#D6D0C8', '#333333'
CHECK = '<path d="M4.5 8.2l2.3 2.3 4.7-4.9" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'
CADENAS = ('<rect x="5" y="10" width="14" height="11" rx="3" fill="none" stroke="{c}" stroke-width="1.8"/>'
           '<path d="M8 10V7.5a4 4 0 0 1 8 0V10" fill="none" stroke="{c}" stroke-width="1.8" stroke-linecap="round"/>')


# ---------- briques ----------
def jointure(nom, x, y):
    """Rond blanc 8 x 8 centré sur un croisement (même rendu que 6077:11)."""
    return F(nom, x - 4, y - 4, 8, 8, fond='#FFFFFF', rayon=100, effets='jointure')


def trait(nom, x1, y1, x2, y2, c=TRAIT):
    w, h = max(1, x2 - x1), max(1, y2 - y1)
    return V(nom, f'<rect x="{x1}" y="{y1}" width="{w}" height="{h}" fill="{c}"/>')


def fin_section(nom, h, sombre=False, extra=()):
    c = TRAIT_SOMBRE if sombre else TRAIT
    out = [trait(nom + ' · trait de fin', 0, h - 1, W, h, c)]
    for x in (L, R) + tuple(extra):
        out.append(jointure(f'{nom} · jointure {x}', x, h - .5))
    return out


def entete(p, y, over, titre, intro, sombre=False, w_titre=760):
    """En-tête centré : sur-titre, titre de section (2 lignes max), intro. Renvoie (noeuds, y_fin)."""
    return [T(p + ' · sur-titre', M, y, over, 'over', align='center', couleur='#4F5CF2' if sombre else None),
            T(p + ' · titre', M, y + 32, titre, 'h2', w=w_titre, align='center', couleur='#FBFAF9' if sombre else None),
            T(p + ' · intro', M, y + 160, intro, 'intro', w=560, align='center', couleur='#D6D0C8' if sombre else None)]


def pilule_sombre(nom, x, y, w, texte):
    """L'info clé d'une illustration : pilule noire + coche indigo (comme « Follow-up scheduled » des références)."""
    return F(nom, x, y, w, 34, fond='#1A1A1A', rayon=100, effets='bouton-noir', enfants=[
        F(nom + ' · coche', 6, 6, 22, 22, fond='#3745F1', rayon=100, enfants=[V(nom + ' · coche · tracé', CHECK, 3, 3)]),
        T(nom + ' · texte', 36, 7, texte, 'ui', couleur='#FFFFFF')])


def carte(nom, x, y, w, h, enfants=(), rayon=14):
    return F(nom, x, y, w, h, fond='#FFFFFF', rayon=rayon, contour=('#EBE5E0', 1), effets='ombre-ligne', enfants=list(enfants))


def cable(nom, d):
    """Connecteur en relief (skill : gris 1 px #CECBCA 80 % + reflet blanc 1,5 px décalé de 1 px)."""
    return V(nom, f'<path d="{d}" fill="none" stroke="#FFFFFF" stroke-width="1.5" transform="translate(0 1)"/>'
                  f'<path d="{d}" fill="none" stroke="#CECBCA" stroke-opacity=".8" stroke-width="1"/>')


def prise(nom, x, y):
    return F(nom, x - 5, y - 5, 10, 10, fond='#FFFFFF', rayon=100, contour=('#D6D0C8', 1), enfants=[F(nom + ' · cœur', 3, 3, 4, 4, fond='#3745F1', rayon=100)])


# ---------- sections ----------
def demo():
    """Illustration de démo du hero, posée dans la fenêtre de site 6075:389 (zone 732 x 535)."""
    s = Section('Démo · relevé de novembre', 0, 0, 732, 535)
    s.ajoute(T('Démo · titre', 32, 26, 'Relevé de novembre', 'uifort'),
             T('Démo · compte', 700, 27, 'Compte pro', 'uipetit', align='end'),
             trait('Démo · séparateur', 0, 62, 732, 63, '#EFEBE7'),
             T('Démo · col date', 40, 82, 'DATE', 'uimono'), T('Démo · col libellé', 124, 82, 'LIBELLÉ', 'uimono'),
             T('Démo · col montant', 520, 82, 'MONTANT', 'uimono', align='end'), T('Démo · col statut', 572, 82, 'STATUT', 'uimono'))
    # lignes estompées (pas d'info : des barres)
    for i, y in enumerate((116, 172, 344, 400, 456)):
        op = .9 if i in (1, 2) else .5
        s.ajoute(F(f'Démo · ligne estompée {i + 1}', 24, y, 684, 44, opacite=op, enfants=[
            F(f'Démo · ligne {i + 1} · date', 16, 17, 40, 10, fond='#EFEBE7', rayon=100),
            F(f'Démo · ligne {i + 1} · libellé', 100, 17, 150 + (i * 37) % 90, 10, fond='#EFEBE7', rayon=100),
            F(f'Démo · ligne {i + 1} · montant', 436, 17, 60, 10, fond='#EFEBE7', rayon=100),
            F(f'Démo · ligne {i + 1} · statut', 548, 12, 84, 20, fond='#F3F0ED', rayon=100)]))
    # la ligne qui reçoit sa facture
    s.ajoute(carte('Démo · ligne Orange Pro', 12, 226, 708, 68, rayon=16, enfants=[
        T('Démo · ligne · date', 28, 24, '07 nov.', 'uipetit'),
        T('Démo · ligne · nom', 112, 14, 'Orange Pro', 'uifort'),
        T('Démo · ligne · détail', 112, 35, 'Abonnement fibre', 'uipetit'),
        T('Démo · ligne · montant', 508, 24, '−59,90 €', 'uifort', align='end'),
        pilule_sombre('Démo · Pointée', 556, 17, 112, 'Pointée')]))
    # la facture que l'agent vient de poser
    s.ajoute(cable('Démo · câble', 'M612 312 C612 340 600 352 600 372'),
             prise('Démo · prise haut', 612, 308),
             carte('Démo · facture', 470, 372, 232, 64, enfants=[
                 F('Démo · facture · icône', 12, 12, 40, 40, fond='#F3F0ED', rayon=10, enfants=[T('Démo · facture · PDF', 20, 13, 'PDF', 'uimono', align='center', couleur='#3745F1')]),
                 T('Démo · facture · nom', 64, 13, 'facture-orange.pdf', 'uifort'),
                 T('Démo · facture · source', 64, 33, 'Trouvée dans Gmail', 'uipetit')]))
    return s


def preuve():
    h = 200
    s = Section('03 · Preuve', 0, 0, W, h)
    s.ajoute(trait('Preuve · trait milieu', M, 0, M + 1, h),
             trait('Preuve · trait clients', M, 100, R, 101),
             T('Preuve · sur-titre', 182, 44, 'ILS CLÔTURENT AVEC POINTÉ', 'over', couleur='#767676'),
             T('Preuve · chiffre', 182, 76, '1 200 entreprises', 'num'),
             T('Preuve · note', 182, 124, '4,8/5 de note moyenne des dirigeants', 'small'))
    noms = ['Atelier Nord', 'Maison Lune', 'Ardent', 'Bâtir & Co', 'Studio Ferro', 'Les Bureaux Verts']
    for i, n in enumerate(noms):
        cx = M + 95 + (i % 3) * 190
        s.ajoute(T(f'Preuve · client {i + 1}', cx, 37 + (i // 3) * 100, n, 'titre', align='center', couleur='#707070'))
    s.ajoute(trait('Preuve · séparateur 1', M + 190, 0, M + 191, h), trait('Preuve · séparateur 2', M + 380, 0, M + 381, h))
    s.ajoute(jointure('Preuve · jointure clients', M, 100), jointure('Preuve · jointure clients droite', R, 100),
             jointure('Preuve · jointure s1', M + 190, 100), jointure('Preuve · jointure s2', M + 380, 100))
    s.ajoute(*fin_section('Preuve', h, extra=(M, M + 190, M + 380)))
    return s


def agents():
    h = 1000
    s = Section('04 · Les agents', 0, 0, W, h)
    s.ajoute(*entete('Agents', 100, 'LES AGENTS', "Deux agents font le travail que personne n'aime faire",
                     "Ils travaillent la nuit, sur vos vrais comptes, et ne vous écrivent que quand il faut décider."))
    s.ajoute(trait('Agents · trait haut', 0, 380, W, 381), trait('Agents · trait milieu', M, 380, M + 1, h))
    s.ajoute(jointure('Agents · jointure g', L, 380), jointure('Agents · jointure m', M, 380), jointure('Agents · jointure d', R, 380))
    # case 1 : le rapprochement
    p1 = F('Rapprochement · illustration', L + 16, 396, 538, 380, fond='#FBFAF9', rayon=16, contour=('#EBE5E0', 1))
    p1.ajoute(carte('Rapprochement · ligne de banque', 40, 64, 300, 64, enfants=[
        T('Rapprochement · ligne · nom', 20, 13, 'Leroy Merlin', 'uifort'),
        T('Rapprochement · ligne · détail', 20, 34, 'Carte pro · 03 nov.', 'uipetit'),
        T('Rapprochement · ligne · montant', 280, 22, '−84,20 €', 'uifort', align='end')]),
        cable('Rapprochement · câble', 'M190 134 C190 190 360 180 360 236'),
        prise('Rapprochement · prise haut', 190, 132), prise('Rapprochement · prise bas', 360, 238),
        carte('Rapprochement · facture', 198, 244, 300, 72, enfants=[
            F('Rapprochement · facture · icône', 14, 14, 44, 44, fond='#F3F0ED', rayon=10, enfants=[T('Rapprochement · facture · PDF', 22, 15, 'PDF', 'uimono', align='center', couleur='#3745F1')]),
            T('Rapprochement · facture · nom', 72, 16, 'Facture n° 4471', 'uifort'),
            T('Rapprochement · facture · détail', 72, 37, 'Leroy Merlin · 84,20 €', 'uipetit')]),
        pilule_sombre('Rapprochement · Facture trouvée', 196, 166, 154, 'Facture trouvée'))
    s.ajoute(p1,
             T('Rapprochement · titre', 182, 804, 'Le rapprochement', 'titre'),
             T('Rapprochement · texte', 182, 840, 'Chaque paiement retrouve sa facture, dans vos mails, votre Drive ou vos espaces fournisseurs.', 'body', w=480))
    # case 2 : la relance
    p2 = F('Relance · illustration', M + 16, 396, 538, 380, fond='#FBFAF9', rayon=16, contour=('#EBE5E0', 1))
    msg = carte('Relance · message', 69, 72, 400, 156, rayon=16, enfants=[
        F('Relance · message · agent', 20, 18, 32, 32, fond='#3745F1', rayon=100, enfants=[V('Relance · message · agent · coche', CHECK, 8, 8)]),
        T('Relance · message · de', 64, 17, 'Agent Pointé à Marc', 'uifort'),
        T('Relance · message · canal', 64, 37, 'Slack · 18 h 02', 'uipetit'),
        trait('Relance · message · trait', 20, 66, 380, 67, '#EFEBE7'),
        T('Relance · message · texte', 20, 82, "Il manque le ticket du déjeuner du 12 nov. (46,50 €). Tu peux me l'envoyer en photo ?", 'ui', w=360)])
    p2.ajoute(msg, pilule_sombre('Relance · Relance envoyée', 184, 252, 170, 'Relance envoyée'))
    s.ajoute(p2,
             T('Relance · titre', M + 32, 804, 'La relance', 'titre'),
             T('Relance · texte', M + 32, 840, "Un justificatif manque ? L'agent écrit à la bonne personne, au bon moment, et range la réponse.", 'body', w=480))
    s.ajoute(*fin_section('Agents', h, extra=(M,)))
    return s


def cloture():
    h = 1020
    s = Section('05 · La clôture', 0, 0, W, h)
    s.ajoute(*entete('Clôture', 100, 'LA CLÔTURE', 'Le 5 du mois, tout est déjà chez votre comptable',
                     "Pointé prépare l'export au format de votre cabinet et l'envoie dès que la dernière ligne est pointée."))
    ong = F('Clôture · onglets', 455, 364, 530, 52, fond='#EFEBE7', rayon=100)
    for i, (x, w, t) in enumerate([(6, 152, 'Rapprochement'), (166, 106, 'Relances'), (280, 70, 'TVA'), (358, 166, 'Export comptable')]):
        actif = i == 3
        o = F(f'Clôture · onglet {t}', x, 6, w, 40, fond='#FFFFFF' if actif else None, rayon=100, effets='badge' if actif else None)
        o.ajoute(T(f'Clôture · onglet {t} · texte', w / 2, 9, t, 'small', align='center', couleur='#262626' if actif else '#707070'))
        ong.ajoute(o)
    s.ajoute(ong)
    c = F('Clôture · carte', L + 16, 452, 1108, 500, fond='#FFFFFF', rayon=20, contour=('#EBE5E0', 1), effets='ombre-carte-avis')
    c.ajoute(F('Clôture · icône', 40, 44, 32, 32, fond='#3745F1', rayon=10, enfants=[V('Clôture · icône · coche', CHECK, 8, 8)]),
             T('Clôture · carte · titre', 40, 96, 'Un export que votre cabinet accepte tel quel', 'h3', w=440),
             T('Clôture · carte · texte', 40, 178, "FEC, Pennylane, Tiime ou fichier Excel : on s'aligne sur ce qu'il utilise déjà.", 'body', w=430),
             F('Clôture · bouton', 40, 254, 170, 47, fond='#EFEBE7', rayon=100, enfants=[T('Clôture · bouton · texte', 85, 12, 'Voir les formats', 'small', align='center', couleur='#262626')]),
             trait('Clôture · carte · trait', 0, 340, 554, 341, '#EBE5E0'),
             trait('Clôture · carte · trait chiffres', 277, 340, 278, 500, '#EBE5E0'),
             T('Clôture · chiffre 1', 40, 376, '3 h', 'num'), T('Clôture · chiffre 1 · légende', 40, 424, 'gagnées chaque mois', 'small'),
             T('Clôture · chiffre 2', 317, 376, '5 jours', 'num'), T('Clôture · chiffre 2 · légende', 317, 424, 'de clôture en moins', 'small'))
    il = F('Clôture · illustration', 562, 8, 538, 484, fond='#F3F0ED', rayon=14)
    il.ajoute(carte('Clôture · dossier', 56, 104, 264, 128, rayon=16, enfants=[
        T('Clôture · dossier · mois', 20, 20, 'NOVEMBRE 2026', 'uimono'),
        T('Clôture · dossier · lignes', 20, 42, '214 lignes', 'titre'),
        F('Clôture · dossier · barre', 20, 90, 224, 6, fond='#EFEBE7', rayon=100, enfants=[F('Clôture · dossier · barre pleine', 0, 0, 224, 6, fond='#3745F1', rayon=100)])]),
        cable('Clôture · câble', 'M320 168 C400 168 404 220 404 312'),
        prise('Clôture · prise départ', 320, 168), prise('Clôture · prise arrivée', 404, 314),
        carte('Clôture · cabinet', 300, 320, 208, 68, enfants=[
            F('Clôture · cabinet · avatar', 16, 18, 32, 32, fond='#1A1A1A', rayon=100, enfants=[T('Clôture · cabinet · R', 16, 7, 'R', 'uifort', align='center', couleur='#FFFFFF')]),
            T('Clôture · cabinet · nom', 60, 15, 'Cabinet Ravel', 'uifort'),
            T('Clôture · cabinet · rôle', 60, 36, 'Expert-comptable', 'uipetit')]),
        pilule_sombre('Clôture · Envoyé au cabinet', 300, 232, 182, 'Envoyé au cabinet'))
    c.ajoute(il)
    s.ajoute(c)
    s.ajoute(*fin_section('Clôture', h))
    return s


def securite():
    h = 920
    s = Section('06 · Sécurité', 0, 0, W, h)
    s.fond = '#1A1A1A'
    s.ajoute(trait('Sécurité · rail g', L, 0, L + 1, h, TRAIT_SOMBRE), trait('Sécurité · rail d', R - 1, 0, R, h, TRAIT_SOMBRE))
    s.ajoute(*entete('Sécurité', 100, 'SÉCURITÉ', 'Les agents lisent vos comptes. Ils ne paient jamais.',
                     "Pointé se connecte à votre banque en lecture seule, par un agrégateur agréé. Aucun virement ne peut partir d'ici.", sombre=True))
    il = F('Sécurité · illustration', 343, 360, 754, 280)
    for nom, x, t1, t2 in (('Banque', 40, 'Votre banque', 'Compte pro'), ('Agents', 524, 'Agents Pointé', 'Lecture des opérations')):
        il.ajoute(F(f'Sécurité · {nom}', x, 100, 190, 80, fond='#262626', rayon=16, contour=('#404040', 1), effets='ombre-flottante', enfants=[
            F(f'Sécurité · {nom} · icône', 16, 20, 40, 40, fond='#333333', rayon=10, enfants=[
                V(f'Sécurité · {nom} · glyphe', '<rect x="0" y="0" width="16" height="12" rx="2" fill="none" stroke="#D6D0C8" stroke-width="1.6"/><path d="M0 4h16" stroke="#D6D0C8" stroke-width="1.6"/>' if nom == 'Banque'
                  else CHECK.replace('#FFFFFF', '#D6D0C8'), 12 if nom == 'Banque' else 12, 14 if nom == 'Banque' else 12)]),
            T(f'Sécurité · {nom} · titre', 68, 20, t1, 'uifort', couleur='#FBFAF9'),
            T(f'Sécurité · {nom} · détail', 68, 41, t2, 'uipetit', couleur='#707070')]))
    il.ajoute(V('Sécurité · liaisons', '<path d="M230 140H330M424 140H524" stroke="#404040" stroke-width="2"/><path d="M424 140H524" stroke="#4F5CF2" stroke-width="2" stroke-dasharray="0"/>'),
              F('Sécurité · verrou', 330, 94, 94, 94, fond=('#FFFFFF', .06), rayon=100, contour=('#FFFFFF', 1, .14), effets='ombre-flottante', enfants=[
                  V('Sécurité · verrou · cadenas', CADENAS.format(c='#FBFAF9'), 35, 33)]),
              F('Sécurité · Lecture seule', 309, 208, 136, 34, fond='#FBFAF9', rayon=100, enfants=[
                  V('Sécurité · Lecture seule · cadenas', CADENAS.format(c='#1A1A1A').replace('<rect', '<rect transform="scale(.7)"').replace('<path', '<path transform="scale(.7)"'), 12, 9),
                  T('Sécurité · Lecture seule · texte', 34, 7, 'Lecture seule', 'uifort')]))
    s.ajoute(il)
    s.ajoute(trait('Sécurité · trait cases', L, 680, R, 681, TRAIT_SOMBRE))
    cases = [('Lecture seule', 'Voir les opérations, jamais les modifier.'), ('Agrégateur agréé', 'Connexion DSP2, sans partager vos codes.'),
             ('Hébergé en France', 'Données chiffrées, serveurs à Paris.'), ('Coupé en un clic', "Vous retirez l'accès quand vous voulez.")]
    for i, (t, d) in enumerate(cases):
        x = L + i * 285
        if i:
            s.ajoute(trait(f'Sécurité · séparateur {i}', x, 680, x + 1, h, TRAIT_SOMBRE), jointure(f'Sécurité · jointure {i}', x, 680))
        s.ajoute(T(f'Sécurité · case {i + 1} · titre', x + 32, 716, t, 'titre', couleur='#FBFAF9'),
                 T(f'Sécurité · case {i + 1} · texte', x + 32, 750, d, 'small', w=221, couleur='#D6D0C8'))
    s.ajoute(jointure('Sécurité · jointure g', L, 680), jointure('Sécurité · jointure d', R, 680))
    s.ajoute(*fin_section('Sécurité', h, sombre=True, extra=(L + 285, M, L + 855)))
    return s


def avis():
    h = 500
    s = Section('07 · Avis', 0, 0, W, h)
    s.ajoute(trait('Avis · trait milieu', M, 0, M + 1, h), trait('Avis · trait chiffres', M, 250, R, 251))
    s.ajoute(T('Avis · citation', 182, 112, "Avant, je passais le premier week-end du mois à chercher des tickets. Maintenant, je reçois un message quand il en manque un, et c'est tout.", 'h3', w=490),
             F('Avis · avatar', 182, 372, 44, 44, fond='#DAD5CD', rayon=100, enfants=[T('Avis · avatar · initiales', 22, 13, 'SB', 'uifort', align='center', couleur='#595959')]),
             T('Avis · nom', 238, 370, 'Sarah Benali', 'label'),
             T('Avis · rôle', 238, 394, 'Gérante de Maison Lune (8 salariés)', 'small'))
    s.ajoute(T('Avis · chiffre 1', 752, 84, '98 %', 'num'), T('Avis · chiffre 1 · légende', 752, 132, 'des lignes pointées sans vous', 'small'),
             T('Avis · chiffre 2', 752, 334, '3 h', 'num'), T('Avis · chiffre 2 · légende', 752, 382, 'rendues chaque mois', 'small'))
    s.ajoute(jointure('Avis · jointure m', M, 250), jointure('Avis · jointure d', R, 250))
    s.ajoute(*fin_section('Avis', h, extra=(M,)))
    return s


def appel():
    h = 860
    s = Section('09 · Appel final', 0, 0, W, h)
    s.ajoute(F('Appel · cadre', 440, 110, 560, 220, contour=(TRAIT, 1), enfants=[
        T('Appel · titre', 280, 32, 'Votre banque. Vos factures. Un mois propre.', 'h2', w=480, align='center')]))
    for i, (x, y) in enumerate([(440, 110), (1000, 110), (440, 330), (1000, 330)]):
        s.ajoute(jointure(f'Appel · jointure cadre {i + 1}', x, y))
    noms = [['', 'Qonto', 'Gmail', '', 'Pennylane', ''], ['Shine', '', 'BNP', 'Drive', '', 'Outlook'], ['', 'Tiime', '', '', 'Excel', '']]
    for r, ligne in enumerate(noms):
        for c, n in enumerate(ligne):
            x, y = 310 + c * 140, 372 + r * 76
            bord = c in (0, 5)
            op = (.45 if bord else 1) * (1 - r * .22)
            if n:
                s.ajoute(carte(f'Appel · outil {n}', x, y, 120, 56, enfants=[T(f'Appel · outil {n} · nom', 60, 18, n, 'uifort', align='center')]))
                if op < .99:
                    s.noeuds_opacite = getattr(s, 'noeuds_opacite', {})
                s.enfants[-1].opacite = round(op, 2) if op < .99 else None
            else:
                s.ajoute(F(f'Appel · case vide {r}-{c}', x, y, 120, 56, fond='#EFEBE7', rayon=14, opacite=round(op * .8, 2)))
    s.ajoute(F('Appel · barre', 360, 648, 720, 64, fond='#1A1A1A', rayon=100, effets='ombre-panneau', enfants=[
        T('Appel · barre · texte', 32, 20, 'Connectez votre banque en deux minutes', 'label', couleur='#FFFFFF'),
        F('Appel · barre · bouton', 516, 8, 196, 48, fond='#FFFFFF', rayon=100, enfants=[T('Appel · barre · bouton · texte', 98, 13, 'Essayer gratuitement', 'small', align='center', couleur='#1A1A1A')])]))
    for i, (x, t) in enumerate([(560, 'Gratuit 30 jours'), (720, 'Lecture seule'), (880, 'Données en France')]):
        s.ajoute(T(f'Appel · garantie {i + 1}', x, 748, t, 'small', align='center'))
    s.ajoute(trait('Appel · séparateur 1', 638, 750, 639, 770), trait('Appel · séparateur 2', 800, 750, 801, 770))
    s.ajoute(*fin_section('Appel', h))
    return s


SECTIONS = {'demo': demo, 'preuve': preuve, 'agents': agents, 'cloture': cloture, 'securite': securite, 'avis': avis, 'appel': appel}

if __name__ == '__main__':
    for n in sys.argv[1:] or SECTIONS:
        print(SECTIONS[n]().ecrire(os.path.join(ICI, 'sortie', n)))
