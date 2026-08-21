# Stack Section 3 — factual dependency & optimization audit

## Measured local code sizes

| File / runtime | Supplied Framer export | Optimized version | Status |
|---|---:|---:|---|
| Main component JS/JSX | `StackSection3.js` — 79,458 bytes | `StackSection3.jsx` — 6,568 bytes | Rewritten from supplied code |
| Framer runtime | `_framer-runtime.js` — 1,976,925 bytes | 0 | Removed |
| Responsive JS runtime | `_responsive-runtime.js` — 4,298 bytes | 0 | Removed |
| Component CSS | embedded/runtime-generated in export | `StackSection3.css` — 10,482 bytes | Explicit CSS |
| Supplied local JS total (component + two runtimes) | 2,060,681 bytes | 6,568 bytes | ~99.681% less local JS source |
| New component source total (JSX + CSS) | — | 17,050 bytes | ~99.173% less than supplied local JS files |

The original package also declared `framer-motion >=10.0.0` as a peer dependency. Its package/bundle is not included in the 2,060,681-byte local-file total above, so the runtime saving in a real bundle is larger than the local-file comparison alone.

## Runtime package dependencies

| Dependency | Original export | Optimized component | Reality |
|---|---|---|---|
| `react` | Required | Required | **Kept** |
| `react-dom` | Required | Required by the host React app | **Kept** |
| `framer-motion` | Required | Not imported | **Removed** |
| `_framer-runtime.js` | Imported repeatedly | Not imported | **Removed** |
| `_responsive-runtime.js` | Supplied for responsive wrapping | Not imported | **Removed** |
| Next.js | Not required | Not required | Component is compatible with Next.js but does not depend on it |
| Vite | Not part of component runtime | Preview only | Used only by the standalone preview pack |
| `@vitejs/plugin-react` | — | Not used | Deliberately absent from preview |

## Framer-only APIs removed

The optimized `StackSection3.jsx` / `.css` contains no references to:

- `framer-motion`
- `_framer-runtime.js`
- `_responsive-runtime.js`
- `RichText`
- `useVariantState`
- `data-framer-*`
- `__FramerMetadata__`

## External network dependencies still present

These are assets/links, not JavaScript framework runtimes:

| External resource | Why it remains | Can it be self-hosted later? |
|---|---|---|
| `framerusercontent.com` profile image | Exact exported CTA avatar | Yes |
| `framerusercontent.com` Inter 500 font | Exact exported body/button font asset | Yes |
| `framerusercontent.com` Plus Jakarta Sans 600 font | Exact exported FAQ font asset | Yes |
| `fonts.gstatic.com` Plus Jakarta Sans 700 font | Exact heading font URL referenced by the export | Yes |
| `api.whatsapp.com` | Intentional WhatsApp link in supplied section | Only if you change that interaction |

Therefore the component is **independent from the Framer JavaScript runtime**, but it is **not network-offline/self-hosted** because the original exported image/fonts are still remote.

## CTA destination limitation found in the supplied export

The "Réserver un appel" CTA does not contain a public URL in the supplied files. It contains the Framer internal page id:

`XvvJHap2q`

That id cannot be safely converted to a real standalone URL from this export alone. The optimized component therefore exposes `ctaHref`. Its default is `#`, and the standalone preview prevents that placeholder from navigating. This avoids inventing a destination that was not present in the files.

## Responsive behavior preserved from the export

The optimized component automatically applies the breakpoint ranges that are explicitly present in the supplied typography CSS:

- Phone: `0–809px`
- Tablet: `810–1399px`
- Desktop: `1400px+`

The supplied main component always instantiates its FAQ list with the FAQ desktop variant, including in the Phone main variant. The optimized component intentionally preserves that behavior rather than switching to the otherwise-unused `FAQMobile` variant.

## Animation note

The exported entrance values are preserved for the visible CSS animations (title `y:18`, copy/CTA `y:26`, FAQ `y:-40`, corresponding delays for title/copy/CTA). Framer Motion's physical spring solver itself is removed; FAQ expansion/chevron movement is recreated with lightweight CSS transitions. This preserves the interaction and visual intent without claiming that the mathematical spring trajectory is byte-for-byte identical to Framer Motion.
