# Articles — page Ressources, version optimisée

Cette version a été réécrite à partir du React Framer exporté, sans dépendre du runtime Framer.

## Dépendances applicatives

```bash
npm install react react-dom framer-motion lottie-web
```

## Usage

```jsx
import ArticlesRessource from "./ArticlesRessource";
import "./ArticlesRessource.css";

<ArticlesRessource
  tags={tags}
  articles={articles}
  callHref="/contact"
  getArticleHref={(article) => `/ressources/${article.slug}`}
/>
```

## Format des données

```js
const tags = [
  { id: "actualites", label: "Actualités" },
  { id: "guide", label: "Guide" },
];

const articles = [
  {
    id: "1",
    slug: "mon-article",
    tagId: "actualites",
    tag: "Actualités",
    title: "Titre de l’article",
    image: { src: "/article.webp", srcSet: "...", alt: "..." },
    author: "Louis Staub",
    authorPhoto: { src: "/louis.webp" },
  },
];
```

## CMS Framer

Le ZIP source contient explicitement un `__FRAMER_CMS_DATA__` vide. Les vraies entrées CMS (titres, images, slugs, tags) ne sont donc pas présentes dans l’archive. Le composant final expose ces données via `tags` et `articles` au lieu d’inventer du contenu.
