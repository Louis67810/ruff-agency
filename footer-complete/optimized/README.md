# Footer optimisé

Composant React indépendant du runtime Framer.

```jsx
import Footer from "./Footer.jsx";
import "./Footer.css";

export default function Page() {
  return <Footer bookingHref="/contact" links={{ home: "/" }} />;
}
```

`bookingHref` et `links` sont optionnels. Les liens internes non fournis restent volontairement inactifs, car l'export Framer ne donne que leurs IDs internes et non leurs URLs publiques.

Voir `DEPENDENCIES_AND_AUDIT.md` pour les mesures et limites vérifiées.
