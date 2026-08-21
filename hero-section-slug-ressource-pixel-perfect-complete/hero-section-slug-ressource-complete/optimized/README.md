# Hero Section Slug Ressource — React optimisé

## Utilisation

```jsx
import HeroSectionSlugRessource from "./HeroSectionSlugRessource";
import "./HeroSectionSlugRessource.css";

<HeroSectionSlugRessource
  breadcrumbTitle="Nouveau logo Bonduelle"
  title="Nouveau logo Bonduelle : analyse d'une refonte d'identité visuelle risquée"
  profilePhoto={{ src: "/auteur.webp" }}
  mainImage={{ src: "/article.webp" }}
  homeHref="/"
  resourcesHref="/ressources"
  articleHref="/ressources/nouveau-logo-bonduelle"
/>
```

Le composant est indépendant du runtime Framer. Les deux images d'instance ne sont pas présentes dans l'export source, donc elles sont volontairement fournies en props.
