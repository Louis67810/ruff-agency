# CTA audit réalisations slug — React optimisé

## Utilisation
```jsx
import CtaAuditRealisationsSlug from "./CtaAuditRealisationsSlug";
import "./CtaAuditRealisationsSlug.css";

export default function Page() {
  return <CtaAuditRealisationsSlug />;
}
```

### Props
- `webhookUrl`: URL appelée à la dernière étape. Par défaut, l'URL réelle de l'export Framer est conservée. Passez une chaîne vide pour désactiver l'envoi.
- `redirectUrl`: redirection facultative après succès.
- `onComplete`: callback facultatif avec les données du formulaire.

Le composant est indépendant du runtime Framer et ne nécessite pas `framer-motion`.
