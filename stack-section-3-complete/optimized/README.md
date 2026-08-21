# Stack Section 3 — optimized React / Next.js

This version was rewritten from the supplied Framer export while preserving the exported layout/style values and interactive FAQ behavior. It does not import Framer or framer-motion.

## Next.js

Copy `StackSection3.jsx`, `StackSection3.css`, and optionally `StackSection3.d.ts` into your project.

```jsx
import StackSection3 from "./StackSection3";

export default function Page() {
  return <StackSection3 ctaHref="/your-real-booking-page" />;
}
```

`StackSection3.jsx` already imports its CSS.

## Important CTA note

The supplied Framer export does **not** contain a usable URL for the "Réserver un appel" button. It only contains the Framer internal page id `XvvJHap2q`. Therefore this optimized component exposes `ctaHref`. The default is `#` so no destination is invented.

## External assets still used

To preserve the exact exported assets/typography, this component still requests:
- the original profile image from `framerusercontent.com`;
- the original Inter 500 font file from `framerusercontent.com`;
- the original Plus Jakarta Sans 600 font file from Framer/Fontshare;
- the original Plus Jakarta Sans 700 Google-font file used by the heading;
- WhatsApp only when the WhatsApp link is clicked.

No Framer JavaScript runtime is loaded.
