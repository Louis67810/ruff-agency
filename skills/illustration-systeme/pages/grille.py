"""Grille de Louis : 12 colonnes, marge 150, gouttière 20, contenu 1140 (pages/grille.md).
    python pages/grille.py            -> colonnes et structures
    from grille import colonnes, cases, jointures
"""
PAGE, MARGE, GOUT, N = 1440, 150, 20, 12
CONTENU = PAGE - 2 * MARGE
COL = (CONTENU - GOUT * (N - 1)) / N


def colonnes():
    """[(x_debut, x_fin)] des 12 colonnes."""
    return [(round(MARGE + i * (COL + GOUT), 2), round(MARGE + i * (COL + GOUT) + COL, 2)) for i in range(N)]


def span(debut, nb):
    """x et largeur d'un bloc qui couvre `nb` colonnes à partir de la colonne `debut` (0-11)."""
    x = MARGE + debut * (COL + GOUT)
    return round(x, 2), round(nb * COL + (nb - 1) * GOUT, 2)


def cases(n):
    """Grille de cases à traits (pas de gouttière) : n = 2 (570), 3 (380) ou 4 (285). Renvoie les x des traits."""
    w = CONTENU / n
    return [round(MARGE + i * w, 2) for i in range(n + 1)]


def jointures(n, ys):
    """Centres des ronds 8 × 8 (nœud 6077:11) aux croisements des traits verticaux et des lignes ys."""
    return [(x - 4, y - 4) for y in ys for x in cases(n)]


if __name__ == '__main__':
    print('colonne', round(COL, 2), 'px')
    for i, c in enumerate(colonnes()):
        print(i + 1, c)
    for n in (2, 3, 4):
        print(f'{n} cases : traits x =', cases(n))
