# Content Page Réalisations Slug — optimisé

Version React indépendante du runtime Framer.

```jsx
import ContentPageRealisationsSlug from "./ContentPageRealisationsSlug";
import "./ContentPageRealisationsSlug.css";

<ContentPageRealisationsSlug
  logo={{ src: "/logo.svg" }}
  siteHref="https://exemple.com"
  profilePhoto={{ src: "/profil.webp" }}
  callHref="/contact"
  photo1={{ src: "/avant.webp" }}
  photo2={{ src: "/apres.webp" }}
/>
```

Le ZIP Framer ne contient pas les assets d'instance passés dans `logo`, `profilePhoto` et `photo1..8`; il contient uniquement la définition du composant. Le composant optimisé ne les invente donc pas.
