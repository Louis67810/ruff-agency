---
name: ruff-seo-content
description: Analyse les données GA4 et Search Console de Ruff Agency pour prioriser, concevoir et optimiser les landing pages et contenus SEO du site.
---

# Ruff SEO Content

Utiliser cette skill pour les demandes de stratégie SEO, de landing pages, de contenu ou d'analyse de performance concernant ruff.agency.

## Données de départ

1. Exécuter npm run seo:pull depuis la racine du projet.
2. Lire .data/seo/google-report.json pour les calculs et .data/seo/google-report.md pour la synthèse.
3. Si l'accès Google échoue, expliquer précisément quelle source est indisponible. Ne jamais afficher, copier ou intégrer le contenu de .secrets/ruff-seo-reader.json.

Les identifiants stables sont :

- Search Console : sc-domain:ruff.agency
- GA4 : propriété 523661734

## Priorisation

Prioriser dans cet ordre :

1. pages de site et landing pages transactionnelles ;
2. optimisation des pages recevant déjà des impressions ou des sessions ;
3. nouveaux contenus répondant aux requêtes à potentiel ;
4. contenus de notoriété.

Croiser les signaux suivants :

- impressions élevées avec position moyenne entre 4 et 20 ;
- CTR faible par rapport à la position ;
- landing pages avec trafic mais engagement faible ;
- requêtes proches d'une offre Ruff ;
- avis clients et preuves disponibles dans app/saas-redesign/content.json ;
- cohérence avec les offres, réalisations et ressources déjà présentes.

## Concurrence et production

Pour une nouvelle cible, vérifier les résultats Google actuels et analyser les pages concurrentes les mieux classées avant de proposer une structure. Distinguer les faits observés des hypothèses.

Produire d'abord un brief comprenant : intention, mot-clé principal, variantes, angle différenciant, structure H1-H3, preuves, CTA, maillage interne et métadonnées.

N'implémenter ou publier une page que si l'utilisateur le demande. Toute page implémentée doit conserver le bilingue existant, les métadonnées, les données structurées, le sitemap et les conventions visuelles du projet.
