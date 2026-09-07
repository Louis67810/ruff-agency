import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightIcon, ChartBarSquareIcon, CodeBracketSquareIcon, PencilIcon } from "@heroicons/react/24/solid";

const LOGO_SVG = `<svg width="69" height="44" viewBox="0 0 69 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_ii_1_860)">
<path d="M0 14.2177C0 11.8271 1.75425 9.79873 4.11982 9.45403L63.4919 0.802612C66.3962 0.379413 69 2.6313 69 5.56626V38.3844C69 41.249 66.5137 43.4797 63.6659 43.1702L4.29376 36.7167C1.85081 36.4512 0 34.3883 0 31.9309V14.2177Z" fill="#1A1A1A"/>
</g>
<g filter="url(#filter1_d_1_860)">
<path d="M51.231 23.2404L51.2739 36.9766L53.9431 37.3355L56.6182 37.6946V27.797L56.6474 25.9261H59.6192H62.6202V23.0712V21.1667L59.6631 21.1385L56.6914 21.0962L56.6474 20.0664L56.6182 12.6222C56.6182 12.6222 58.7678 12.2181 60.1499 11.9862C61.3315 11.7878 63.1806 11.5091 63.1806 11.5091L63.4986 11.47V7.00004L57.2012 7.84573L51.231 8.64762V23.2404Z" fill="white"/>
<path d="M37.6987 22.441V35.1533L40.3702 35.5115L43.0859 35.8765V26.9976L43.1152 25.1267H46.0869H49.0879V22.2717V20.3672L46.1308 20.339L43.1591 20.2967L43.1152 19.2669L43.0859 13.5606L46.6197 12.9541L49.6273 12.4066L49.9663 12.3431V8.81718L43.799 9.64568L37.6716 10.4689L37.6987 22.441Z" fill="white"/>
<path d="M22.0012 12.5743V14.8399V21.2126V28.7007C22.0012 30.9115 23.3785 33.2115 24.8002 33.4212L31.5034 34.3214C34.8727 34.774 35.913 31.2308 35.913 28.9206V28.1528V21.131V10.7054L33.5357 11.0244L30.8627 11.3832L30.9058 20.7217V28.5249C30.6374 29.754 27.7287 29.72 27.1956 28.5249C27.139 28.3885 27.1073 20.651 27.1073 20.651V11.8885L24.9761 12.1745L22.0012 12.5743Z" fill="white"/>
<path d="M6.24805 22.8726V30.9292L8.83882 31.2767L10.8064 31.5406V28.4133V25.9822H11.8876C12.4997 25.9423 12.7244 25.9822 13.2191 26.4769C13.6251 26.8795 13.5455 27.0599 14.0578 28.4133L14.8877 32.0893L17.6692 32.4627L20.9301 32.9007L19.552 29.1801L18.1774 26.1942L17.6686 25.2048L18.2905 24.5546C19.4778 23.3391 19.9866 21.5016 19.6898 19.5511C19.3223 17.0351 17.8909 13.9953 15.4174 13.4582L10.4353 14.127L6.24805 14.6885V22.8726ZM13.9336 18.9503C14.393 19.4097 14.3435 20.8231 13.9336 21.332C13.6933 21.6288 13.2799 21.7277 12.2905 21.7701H10.8064V20.5546V18.4733H12.2905C13.1244 18.4733 13.6686 18.6853 13.9336 18.9503Z" fill="white"/>
</g>
<defs>
<filter id="filter0_ii_1_860" x="0" y="-0.211448" width="69" height="45.015" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1.60465"/>
<feGaussianBlur stdDeviation="1.23558"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_1_860"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="-0.962791"/>
<feGaussianBlur stdDeviation="1.12326"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/>
<feBlend mode="normal" in2="effect1_innerShadow_1_860" result="effect2_innerShadow_1_860"/>
</filter>
<filter id="filter1_d_1_860" x="4.22619" y="5.62006" width="61.2942" height="34.7382" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.64186"/>
<feGaussianBlur stdDeviation="1.01093"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_860"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_860" result="shape"/>
</filter>
</defs>
</svg>
`;
const WHATSAPP_SVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 37.52 37.52"><g transform="translate(2.45 2.578)"><path d="M 8.454 30.399 L 0 32.36 L 2.102 24.16 C 0.764 21.805 0 19.082 0 16.18 C 0 7.244 7.244 0 16.18 0 C 25.116 0 32.36 7.244 32.36 16.18 C 32.36 25.116 25.116 32.36 16.18 32.36 C 13.382 32.36 10.75 31.649 8.454 30.399 Z M 16.18 29.871 C 23.741 29.871 29.871 23.741 29.871 16.18 C 29.871 8.619 23.741 2.489 16.18 2.489 C 8.619 2.489 2.489 8.619 2.489 16.18 C 2.489 19.099 3.403 21.805 4.96 24.027 L 3.734 28.626 L 8.413 27.456 C 10.62 28.979 13.296 29.871 16.18 29.871 Z" fill="rgb(255,255,255)"></path><path d="M 12.135 8.668 C 11.75 7.895 11.16 7.964 10.564 7.964 C 9.499 7.964 7.837 9.24 7.837 11.615 C 7.837 13.562 8.695 15.692 11.585 18.88 C 14.375 21.956 18.04 23.547 21.083 23.493 C 24.125 23.439 24.751 20.821 24.751 19.936 C 24.751 19.545 24.508 19.349 24.341 19.296 C 23.304 18.798 21.391 17.871 20.956 17.697 C 20.521 17.523 20.294 17.758 20.153 17.886 C 19.758 18.262 18.976 19.371 18.708 19.62 C 18.44 19.869 18.041 19.743 17.875 19.649 C 17.263 19.403 15.605 18.666 14.284 17.385 C 12.65 15.801 12.554 15.256 12.246 14.77 C 12 14.382 12.18 14.144 12.27 14.04 C 12.623 13.634 13.109 13.006 13.327 12.695 C 13.545 12.383 13.372 11.91 13.268 11.615 C 12.821 10.347 12.443 9.286 12.135 8.668 Z" fill="rgb(255,255,255)"></path></g></svg>`;

const DEFAULT_WHATSAPP = "https://api.whatsapp.com/send/?phone=33636465091&text=Bonjour%2C+je+vous+contacte+par+rapport+%C3%A0+vos+landing+pages.&type=phone_number&app_absent=0";

const VARIANT_CLASS = {
  ZbjNrHK9l: "framer-v-qkr4e3",
  oVuA0Rdqu: "framer-v-1d7g1fv",
  apN8iNd4y: "framer-v-1w66q8q",
  HAfh2vNm9: "framer-v-1v0dsmk",
  BG0nmz4mC: "framer-v-10wotq8",
  v1ubmAL4x: "framer-v-1s8rutu",
  Gl41wUzYE: "framer-v-1yg1emp",
  MOuhdlnSq: "framer-v-1fh0m7f",
  BYL25d5fI: "framer-v-15uyqzb",
  PR5O_TX2L: "framer-v-1u4hpz1",
  Ip59pHhO5: "framer-v-i8owv2",
  DQfcK7k4n: "framer-v-1whqf77",
  pslIWKY0N: "framer-v-1la3d98",
  Baxppfab0: "framer-v-142j3hf",
  IekeHhisv: "framer-v-1ujkxid",
  lG_gYiE5L: "framer-v-1ba2vxx",
  nXvvpRJPs: "framer-v-gptzv",
};

const NAME_TO_VARIANT = {
  "Variant 1": "ZbjNrHK9l", tablet: "Gl41wUzYE", "Variant 4": "apN8iNd4y",
  "logo unique": "HAfh2vNm9", "Mobile logo unique": "BG0nmz4mC", black: "v1ubmAL4x",
  "varaint 1 scroll": "MOuhdlnSq", scroll: "BYL25d5fI", "tablet dark mode": "DQfcK7k4n",
  "tablet blanc hover": "IekeHhisv", "mobile scroll": "nXvvpRJPs"
};

const DARK = new Set(["v1ubmAL4x", "Gl41wUzYE", "BYL25d5fI", "DQfcK7k4n", "pslIWKY0N", "Baxppfab0"]);
const MOBILE_IDS = new Set(["apN8iNd4y", "PR5O_TX2L", "Ip59pHhO5", "pslIWKY0N", "Baxppfab0", "lG_gYiE5L", "nXvvpRJPs"]);
const LOGO_ONLY = new Set(["HAfh2vNm9", "BG0nmz4mC"]);
const DESKTOP_LINKS_HIDDEN = new Set(["oVuA0Rdqu", "apN8iNd4y", "HAfh2vNm9", "BG0nmz4mC", "Gl41wUzYE", "PR5O_TX2L", "Ip59pHhO5", "DQfcK7k4n", "pslIWKY0N", "Baxppfab0", "IekeHhisv", "lG_gYiE5L", "nXvvpRJPs"]);
const RIGHT_HIDDEN = new Set(["apN8iNd4y", "HAfh2vNm9", "BG0nmz4mC", "PR5O_TX2L", "Ip59pHhO5", "pslIWKY0N", "Baxppfab0", "lG_gYiE5L", "nXvvpRJPs"]);

const SERVICES = [
  { title: "Site Internet", key: "websiteHref", images: [
    ["https://framerusercontent.com/images/mpQ44rc3qJiFju5rGQ9shYBxuVw.png?width=1337&height=903", "https://framerusercontent.com/images/mpQ44rc3qJiFju5rGQ9shYBxuVw.png?scale-down-to=512&width=1337&height=903 512w,https://framerusercontent.com/images/mpQ44rc3qJiFju5rGQ9shYBxuVw.png?scale-down-to=1024&width=1337&height=903 1024w,https://framerusercontent.com/images/mpQ44rc3qJiFju5rGQ9shYBxuVw.png?width=1337&height=903 1337w"],
    ["https://framerusercontent.com/images/stoTVOvPyCyO8zfgBMeiZLZRiw.png?width=1462&height=1070", "https://framerusercontent.com/images/stoTVOvPyCyO8zfgBMeiZLZRiw.png?scale-down-to=512&width=1462&height=1070 512w,https://framerusercontent.com/images/stoTVOvPyCyO8zfgBMeiZLZRiw.png?scale-down-to=1024&width=1462&height=1070 1024w,https://framerusercontent.com/images/stoTVOvPyCyO8zfgBMeiZLZRiw.png?width=1462&height=1070 1462w"],
    ["https://framerusercontent.com/images/EY8yveyk6zTzdL4ISDvAOQOLlAI.jpg?width=3057&height=2208", "https://framerusercontent.com/images/EY8yveyk6zTzdL4ISDvAOQOLlAI.jpg?scale-down-to=512&width=3057&height=2208 512w,https://framerusercontent.com/images/EY8yveyk6zTzdL4ISDvAOQOLlAI.jpg?scale-down-to=1024&width=3057&height=2208 1024w,https://framerusercontent.com/images/EY8yveyk6zTzdL4ISDvAOQOLlAI.jpg?scale-down-to=2048&width=3057&height=2208 2048w,https://framerusercontent.com/images/EY8yveyk6zTzdL4ISDvAOQOLlAI.jpg?width=3057&height=2208 3057w"]
  ]},
  { title: "Landing Page", key: "landingHref", images: [
    ["https://framerusercontent.com/images/mcNAj4xsupm5WkVwgJuGCmazms.png?width=922&height=538", "https://framerusercontent.com/images/mcNAj4xsupm5WkVwgJuGCmazms.png?scale-down-to=512&width=922&height=538 512w,https://framerusercontent.com/images/mcNAj4xsupm5WkVwgJuGCmazms.png?width=922&height=538 922w"],
    ["https://framerusercontent.com/images/Ge7YTuPTGRj9UaDRuggmTgK0U50.png?width=1024&height=1024", "https://framerusercontent.com/images/Ge7YTuPTGRj9UaDRuggmTgK0U50.png?scale-down-to=512&width=1024&height=1024 512w,https://framerusercontent.com/images/Ge7YTuPTGRj9UaDRuggmTgK0U50.png?width=1024&height=1024 1024w"],
    ["https://framerusercontent.com/images/cfDIjw7LKqE0n01Rcyxk4AIbRU.png?width=2010&height=1203", "https://framerusercontent.com/images/cfDIjw7LKqE0n01Rcyxk4AIbRU.png?scale-down-to=512&width=2010&height=1203 512w,https://framerusercontent.com/images/cfDIjw7LKqE0n01Rcyxk4AIbRU.png?scale-down-to=1024&width=2010&height=1203 1024w,https://framerusercontent.com/images/cfDIjw7LKqE0n01Rcyxk4AIbRU.png?width=2010&height=1203 2010w"]
  ]},
  { title: "Développement Web", key: "developmentHref", images: [
    ["https://framerusercontent.com/images/BhJmLsN05QbWvFBx9cRrj3k.png?width=2355&height=1126", "https://framerusercontent.com/images/BhJmLsN05QbWvFBx9cRrj3k.png?scale-down-to=512&width=2355&height=1126 512w,https://framerusercontent.com/images/BhJmLsN05QbWvFBx9cRrj3k.png?scale-down-to=1024&width=2355&height=1126 1024w,https://framerusercontent.com/images/BhJmLsN05QbWvFBx9cRrj3k.png?scale-down-to=2048&width=2355&height=1126 2048w,https://framerusercontent.com/images/BhJmLsN05QbWvFBx9cRrj3k.png?width=2355&height=1126 2355w"],
    ["https://framerusercontent.com/images/IC9gv5yixyZYeJLHF9h9S3RQ6Y.png?width=1071&height=854", "https://framerusercontent.com/images/IC9gv5yixyZYeJLHF9h9S3RQ6Y.png?scale-down-to=512&width=1071&height=854 512w,https://framerusercontent.com/images/IC9gv5yixyZYeJLHF9h9S3RQ6Y.png?scale-down-to=1024&width=1071&height=854 1024w,https://framerusercontent.com/images/IC9gv5yixyZYeJLHF9h9S3RQ6Y.png?width=1071&height=854 1071w"],
    ["https://framerusercontent.com/images/YOfTI0DuuqDMBCW7MDP0nvnqk4.jpg?width=1600&height=1015", "https://framerusercontent.com/images/YOfTI0DuuqDMBCW7MDP0nvnqk4.jpg?scale-down-to=512&width=1600&height=1015 512w,https://framerusercontent.com/images/YOfTI0DuuqDMBCW7MDP0nvnqk4.jpg?scale-down-to=1024&width=1600&height=1015 1024w,https://framerusercontent.com/images/YOfTI0DuuqDMBCW7MDP0nvnqk4.jpg?width=1600&height=1015 1600w"]
  ]},
];

const MOBILE_SERVICE_ITEMS = [
  ["Landing Page", "landingHref"], ["Website", "websiteHref"], ["Branding", "brandingHref"], ["Product design", "productDesignHref"],
  ["SEO / GEO", "seoGeoHref"], ["Optimisation conversion", "conversionOptimisationHref"], ["Copywriting", "copywritingHref"],
  ["Développement Framer", "framerHref"], ["Développement code (React)", "developmentHref"],
];

function SafeLink({ href = "#", className, children, ...props }) {
  return <a href={href || "#"} className={className} {...props}>{children}</a>;
}

function Chevron({ open = false, color = "currentColor" }) {
  return <svg className={`navbar-chevron ${open ? "is-open" : ""}`} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M 0 0 L 6 6 L 12 0" fill="transparent" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" transform="translate(6 9)" />
  </svg>;
}

function NavLink({ href, children, services = false, onMouseEnter, onMouseLeave, dark = false, small = false, open = false, onClick }) {
  if (services) return <button type="button" onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className="navbar-link navbar-link-services" style={{ color: dark ? "rgb(255,255,255)" : "rgb(18,26,46)" }} aria-expanded={open}><span>{children}</span><Chevron open={open} color={dark ? "#fff" : "#000"} /></button>;
  return <SafeLink href={href} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={`navbar-link ${services ? "navbar-link-services" : ""} ${small ? "navbar-link-small" : ""}`} style={{ color: dark ? "rgb(255,255,255)" : "rgb(18,26,46)" }}>
    <span>{children}</span>{services && <Chevron open={open} color={dark ? "#fff" : "#000"} />}
  </SafeLink>;
}

function CTA({ href, full = false, shell = "rgb(225, 228, 237)", title = "Commencer mon projet" }) {
  return <SafeLink href={href} className={`navbar-cta ${full ? "navbar-cta-full" : ""}`} style={{ backgroundColor: shell }}>
    <span className="navbar-cta-inner">
      <span className="navbar-cta-text">{title}</span>
      <img className="navbar-cta-avatar" alt="Photo de profil de Louis Staub" loading="lazy" sizes="28px"
        src="https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?scale-down-to=64&width=693&height=693" />
    </span>
  </SafeLink>;
}

function WhatsApp({ href }) {
  return <div className="framer-GWWgz framer-su0x7z navbar-whatsapp-wrap">
    <div className="framer-88xg4p-container">
      <a className="framer-2HfKo framer-tl1r7s framer-1mznsp4 navbar-whatsapp" href={href} target="_blank" rel="noreferrer" aria-label="Cliquer ici pour discuter sur Whatsaap">
        <span className="framer-1giho6m navbar-whatsapp-dot" />
        <span className="framer-12v5ok3 navbar-wa-svg" dangerouslySetInnerHTML={{ __html: WHATSAPP_SVG }} />
      </a>
    </div>
  </div>;
}

function Logo({ href, dark = false, mobile = false, mobileUnique = false }) {
  return <SafeLink href={href} className={`framer-1ffe4zf navbar-logo ${mobile ? "navbar-logo-mobile" : ""} ${mobileUnique ? "navbar-logo-mobile-unique" : ""}`}>
    <span className="framer-hech98 navbar-logo-svg" dangerouslySetInnerHTML={{ __html: LOGO_SVG }} />
    <span className="framer-r3bcr9 navbar-agency" style={{ color: dark ? "#fff" : "#000" }}>.agency</span>
  </SafeLink>;
}

function Burger({ open, dark, onClick }) {
  return <button className={`navbar-burger ${open ? "is-open" : ""}`} type="button" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open} onClick={onClick}>
    <span style={{ backgroundColor: dark ? "#fff" : "#000" }} />
    <span style={{ backgroundColor: dark ? "#fff" : "#000" }} />
  </button>;
}

const SERVICE_SPRING = { bounce: 0.2, delay: 0, duration: 0.4, type: "spring" };
const SERVICE_ROTATIONS = [[0, -13], [13, -7], [-6, 12]];

function ServiceCard({ service, href, compact = false }) {
  const [hovered, setHovered] = useState(false);
  const imageClassNames = ["framer-huerpv", "framer-1su8lv", "framer-1pfvp04"];

  // Le menu mobile reste volontairement sur l’implémentation légère précédente.
  // Cette correction cible uniquement le mega-menu desktop demandé.
  if (compact) return <SafeLink href={href} className="framer-GuRpl framer-1qhm5hn framer-ogey0s navbar-service-card navbar-service-card-compact">
    <span className="framer-17q3nr5 navbar-service-images">
      {service.images.map(([src, srcSet], i) => <span className={`${imageClassNames[i]} navbar-service-image`} key={src} style={{ transform: `rotate(${SERVICE_ROTATIONS[i][0]}deg)` }}><img src={src} srcSet={srcSet} sizes="26px" alt={`Illustration du service ${service.title}`} loading="lazy" /></span>)}
    </span>
    <span className="framer-zpkpa0 navbar-service-title">{service.title}</span>
  </SafeLink>;

  return <motion.a
    href={href || "#"}
    className="framer-GuRpl framer-1qhm5hn framer-ogey0s navbar-service-card"
    initial={false}
    animate={{ backgroundColor: hovered ? "rgb(245, 245, 245)" : "rgba(245, 245, 245, 0)" }}
    transition={SERVICE_SPRING}
    onHoverStart={() => setHovered(true)}
    onHoverEnd={() => setHovered(false)}
  >
    <span className="framer-17q3nr5 navbar-service-images">
      {service.images.map(([src, srcSet], i) => <motion.span
        className={`${imageClassNames[i]} navbar-service-image`}
        key={src}
        initial={false}
        animate={{ rotate: hovered ? SERVICE_ROTATIONS[i][1] : SERVICE_ROTATIONS[i][0] }}
        transition={SERVICE_SPRING}
      >
        <img src={src} srcSet={srcSet} sizes="43px" alt="Aperçu visuel du projet" loading="lazy" />
      </motion.span>)}
    </span>
    <span className="framer-zpkpa0 navbar-service-title">{service.title}</span>
  </motion.a>;
}

function DecorativeLine({ className = "" }) {
  return <div className={className} aria-hidden="true">
    <svg width="100%" height="100%" viewBox="-37 -37 912 865" fill="none" preserveAspectRatio="none">
      <path d="M621.826 477.973L488.776 449.395C369.165 423.703 335.885 268.855 434.379 196.288L452.706 182.785C473.833 167.219 500.627 161.473 526.279 167.007C616.129 186.391 624.509 311.308 538.054 342.52L301.35 427.974L0 556.417" stroke="#0147FF" strokeOpacity=".04" strokeWidth="74" />
    </svg>
  </div>;
}

const DEFAULT_OVERLAY_MOTION = { duration: 0.49, startY: -80, startHeight: 0, easing: "smooth" };
const OVERLAY_EASINGS = { smooth: [0.22, 1, 0.36, 1], snappy: [0.16, 1, 0.3, 1], linear: "linear" };
const OVERLAY_TRANSITION = { exitDuration: .15, enterDuration: .15, enterDelay: 0, panelDuration: .4, easing: "easeInOut", resourcesHeight: 600, servicesHeight: 501 };

function DesktopResources({ links, onNavigate, onPointerEnter, onPanelLeave }) {
  const cards = [
    { title: "Nos articles", subtitle: "Découvrez tous nos articles", href: links.resourcesHref, image: "/images/navigation/resources-articles.jpg" },
    { title: "Nos outils gratuits", subtitle: "Découvrez tous nos outils gratuits", href: links.freeToolsHref, image: "/images/navigation/resources-free-tools.png" },
  ];
  return <div className="navbar-resources-panel" onMouseEnter={onPointerEnter} onMouseLeave={onPanelLeave}>
    {cards.map((card) => <SafeLink className="navbar-resources-card" href={card.href} key={card.title} onClick={onNavigate}>
      <span className="navbar-resources-image"><img src={card.image} alt={`Illustration de la ressource ${card.title}`} /></span>
      <span className="navbar-resources-copy"><strong>{card.title}</strong><small>{card.subtitle}</small></span>
    </SafeLink>)}
  </div>;
}

function DesktopServices({ links, onPointerEnter, onPanelLeave, onNavigate, motionSettings, onBlurChange, contentType = "services" }) {
  const panelHeight = contentType === "resources" ? OVERLAY_TRANSITION.resourcesHeight : OVERLAY_TRANSITION.servicesHeight;
  const categories = [
    { id: "design", label: "Design", icon: PencilIcon, items: ["Landing Page", "Website", "Product design", "Branding"] },
    { id: "growth", label: "Conversion / Croissance", icon: ChartBarSquareIcon, items: ["Landing Page", "SEO / GEO", "Optimisation conversion", "Copywriting"] },
    { id: "development", label: "Développement", icon: CodeBracketSquareIcon, items: ["Développement Framer", "Développement code (React)"] },
  ];
  const serviceLinks = { "Landing Page": links.landingHref, Website: links.websiteHref, Branding: links.brandingHref, "Product design": links.productDesignHref, "SEO / GEO": links.seoGeoHref, "Optimisation conversion": links.conversionOptimisationHref, Copywriting: links.copywritingHref, "Développement Framer": links.framerHref, "Développement code (React)": links.developmentHref };
  const categoryImages = {
    design: {
      "Landing Page": "/images/services-menu/landing-page.png",
      Website: "/images/services-menu/website.png",
      // Associations visuelles : Product Design avec le tableau, Branding avec le logo Ruff.
      "Product design": "/images/services-menu/product-design.png",
      Branding: "/images/services-menu/branding.png",
    },
    growth: {
      "Landing Page": "/images/services-menu/conversion-landing-page.png",
      "SEO / GEO": "/images/services-menu/seo-geo.png",
      "Optimisation conversion": "/images/services-menu/conversion-optimisation.png",
      Copywriting: "/images/services-menu/copywriting.png",
    },
    development: {
      "Développement Framer": "/images/services-menu/website.png",
      "Développement code (React)": "/images/services-menu/development-react.png",
    },
  };
  const [activeCategory, setActiveCategory] = useState("design");
  const [activeService, setActiveService] = useState("Branding");
  const [isEntering, setIsEntering] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setIsEntering(false), 900);
    return () => window.clearTimeout(timer);
  }, []);
  const active = categories.find((category) => category.id === activeCategory) || categories[0];
  const activeImages = categoryImages[active.id] || {};
  const carouselItems = active.items.map((service) => activeImages[service] || "/images/services-menu/landing-page.png");
  const slideIndex = Math.max(0, active.items.indexOf(activeService));
  const carouselSlides = [...carouselItems, ...carouselItems, ...carouselItems];
  const carouselOffset = (carouselItems.length + slideIndex) * 299 - 58.5;
  const selectCategory = (category) => { setActiveCategory(category.id); setActiveService(category.items[0]); };
  // Le panneau maintient l'ouverture en annulant sa fermeture ; il ne doit jamais
  // déclencher lui-même une réouverture lorsque le pointeur le traverse.
  const handlePointerEnter = () => { onBlurChange(true); onPointerEnter(); };
  const handlePanelLeave = (event) => { onBlurChange(false); onPanelLeave(event); };
  return <div className="navbar-services-popover-positioner" onMouseEnter={handlePointerEnter}>
    <motion.div
      className="navbar-services-popover"
      role="dialog"
      initial={{ height: (panelHeight * motionSettings.startHeight) / 100, y: motionSettings.startY }}
      animate={{ height: panelHeight, y: 0 }}
      exit={{ height: (panelHeight * motionSettings.startHeight) / 100, y: motionSettings.startY }}
      transition={{ duration: OVERLAY_TRANSITION.panelDuration, ease: OVERLAY_TRANSITION.easing }}
      style={{ overflow: "hidden", willChange: "height, transform" }}
    >
      <AnimatePresence mode="wait">
      <motion.div key={contentType} className="navbar-overlay-content" style={{ "--navbar-overlay-height": `${panelHeight}px` }} initial={contentType === "resources" ? { opacity: 0 } : false} animate={{ opacity: 1, transition: { duration: OVERLAY_TRANSITION.enterDuration, delay: contentType === "resources" ? OVERLAY_TRANSITION.enterDelay : 0, ease: OVERLAY_TRANSITION.easing } }} exit={{ opacity: 0, transition: { duration: OVERLAY_TRANSITION.exitDuration, ease: OVERLAY_TRANSITION.easing } }}>
      {contentType === "resources" ? <DesktopResources links={links} onNavigate={onNavigate} onPointerEnter={handlePointerEnter} onPanelLeave={handlePanelLeave} /> : <><div className={`navbar-services-panel navbar-services-panel-new${isEntering ? " is-entering" : ""}`} onMouseEnter={handlePointerEnter} onMouseLeave={handlePanelLeave}>
        <div className="navbar-services-categories">{categories.map((category) => { const Icon = category.icon; return <button key={category.id} type="button" className={`navbar-services-category ${activeCategory === category.id ? "is-active" : ""}`} onMouseEnter={() => selectCategory(category)} onFocus={() => selectCategory(category)}><span><Icon aria-hidden="true" />{category.label}</span><ArrowRightIcon aria-hidden="true" /></button>; })}</div>
        <div className="navbar-services-divider" aria-hidden="true" />
        <div className="navbar-services-list">{active.items.map((service) => <SafeLink key={service} href={serviceLinks[service]} className={`navbar-services-item ${activeService === service ? "is-active" : ""}`} onMouseEnter={() => setActiveService(service)} onFocus={() => setActiveService(service)} onClick={onNavigate}><span>{service}</span><ArrowRightIcon aria-hidden="true" /></SafeLink>)}</div>
        <div className="navbar-services-carousel" aria-label={`Aperçu ${activeService}`}><div className="navbar-services-carousel-track" style={{ transform: `translateY(-${carouselOffset}px)` }}>{carouselSlides.map((src, index) => <div className="navbar-services-carousel-card" key={`${src}-${index}`}><img src={src} alt={`Aperçu visuel du service ${activeService}`} /></div>)}</div></div>
      </div>
      <div className="framer-AO6Cg framer-hkmdr2 framer-v-1fc9i16 navbar-services-panel navbar-services-panel-legacy">
        <div className="framer-1gxuoah navbar-services-left">
          <DecorativeLine className="framer-5078ai navbar-services-line navbar-services-line-top" />
          <div className="framer-k3m18l navbar-services-copy">
            <p className="framer-yofu9j navbar-services-heading">Tous nos services</p>
            <p className="framer-fu4set navbar-services-desc">Trois offres claires, pensées pour élever votre image et générer des demandes</p>
          </div>
          <div className="framer-19ukg5c navbar-services-hero-wrap">
            <img className="navbar-services-hero" alt="Aperçu visuel des services" loading="lazy"
              sizes="calc(49vw + 441px)"
              src="https://framerusercontent.com/images/BX0tBEEQuslybBvZlIhj9b9o2M.png?width=3764&height=2310"
              srcSet="https://framerusercontent.com/images/BX0tBEEQuslybBvZlIhj9b9o2M.png?scale-down-to=512&width=3764&height=2310 512w,https://framerusercontent.com/images/BX0tBEEQuslybBvZlIhj9b9o2M.png?scale-down-to=1024&width=3764&height=2310 1024w,https://framerusercontent.com/images/BX0tBEEQuslybBvZlIhj9b9o2M.png?scale-down-to=2048&width=3764&height=2310 2048w,https://framerusercontent.com/images/BX0tBEEQuslybBvZlIhj9b9o2M.png?width=3764&height=2310 3764w" />
          </div>
          <DecorativeLine className="framer-14o5le3 navbar-services-line navbar-services-line-bottom" />
          <div className="framer-1j26r9s-container navbar-services-line-extra" aria-hidden="true">
            <svg width="100%" height="100%" viewBox="0 0 411 843" fill="none" preserveAspectRatio="none">
              <path d="M382 720.784L-91.2215 165.893C-124.214 127.206 -112.075 67.8158 -66.5491 45.1774C-40.1332 32.0418 -8.57209 34.8974 15.0572 52.5609L56.4228 83.4829C114.221 126.689 136.496 202.902 111.062 270.434L17.8157 518.023C11.6395 534.422 3.06222 549.813 -7.63543 563.692L-205 819.758" stroke="#0147FF" strokeOpacity=".04" strokeWidth="74" />
            </svg>
          </div>
        </div>
        <div className="framer-1anvmqd navbar-services-right">
          <div className="framer-17skfw1">
            <div className="framer-1or1ife-container"><ServiceCard service={SERVICES[0]} href={links.websiteHref} /></div>
            <div className="framer-nlxc6z-container"><ServiceCard service={SERVICES[1]} href={links.landingHref} /></div>
            <div className="framer-u63by7-container"><ServiceCard service={SERVICES[2]} href={links.developmentHref} /></div>
          </div>
        </div>
      </div></>}
      </motion.div>
      </AnimatePresence>
    </motion.div>
  </div>;
}

function MobileMenu({ dark, links, onClose, locale = "fr", landingMode = false, landingLinks = [], ctaLabel }) {
  const t = (fr, en) => locale === "en" ? en : fr;
  const [servicesOpen, setServicesOpen] = useState(false);
  const click = () => onClose?.();
  return <div className="framer-1stnlcj navbar-mobile-menu">
    {!landingMode && <div className="framer-brs9hv navbar-mobile-links">
      <NavLink small dark={dark} href={links.homeHref} onClick={click}>{t("Accueil", "Home")}</NavLink><div className="navbar-mobile-separator" />
      <NavLink small dark={dark} href={links.projectsHref} onClick={click}>Études de cas</NavLink><div className="navbar-mobile-separator" />
      <button className="navbar-mobile-services-toggle" type="button" onClick={() => setServicesOpen(v => !v)} style={{ color: dark ? "#fff" : "rgb(18,26,46)" }}><span>Services</span><Chevron open={servicesOpen} color={dark ? "#fff" : "#000"} /></button>
      <div className={`navbar-mobile-services ${servicesOpen ? "is-open" : ""}`}>
        <div className="navbar-mobile-services-inner">
          {MOBILE_SERVICE_ITEMS.map(([label, key]) => <SafeLink key={label} href={links[key]} className="navbar-mobile-service-link" onClick={click}>{label}<ArrowRightIcon aria-hidden="true" /></SafeLink>)}
        </div>
      </div>
      <div className="navbar-mobile-separator" /><NavLink small dark={dark} href={links.resourcesHref} onClick={click}>{t("Ressources", "Resources")}</NavLink>
      <div className="navbar-mobile-separator" /><NavLink small dark={dark} href={links.aboutHref} onClick={click}>{t("Qui sommes nous ", "Who we are")}</NavLink>
    </div>}
    {landingMode && landingLinks.length > 0 && <div className="framer-brs9hv navbar-mobile-links navbar-mobile-landing-links">
      {landingLinks.map((item, index) => <React.Fragment key={`${item.href}-${item.label}`}>
        {index > 0 && <div className="navbar-mobile-separator" />}
        <NavLink small dark={dark} href={item.href} onClick={click}>{item.label}</NavLink>
      </React.Fragment>)}
    </div>}
    <div className="framer-9b3gdf-container navbar-mobile-cta"><CTA full href={links.ctaHref} title={ctaLabel || "Book a call"} shell={dark ? "rgba(225,228,237,.08)" : "rgb(225,228,237)"} /></div>
  </div>;
}

export default function NavBar({
  variant = "auto", fill = "rgb(251, 251, 251)", fill2 = "rgb(251, 251, 251)", color = "rgb(0,0,0)", theme = "light",
  homeHref = "#", projectsHref = "#", resourcesHref = "#", aboutHref = "#", ctaHref = "#",
  landingHref = "#", websiteHref = "#", brandingHref = "#", productDesignHref = "#", copywritingHref = "#", seoGeoHref = "#", conversionOptimisationHref = "#", framerHref = "#", developmentHref = "#", whatsappHref = DEFAULT_WHATSAPP,
  landingMode = false, landingLinks = [], ctaLabel,
  className = "", style,
  locale = "fr",
}) {
  const t = (fr, en) => locale === "en" ? en : fr;
  // Valeur initiale constante (identique serveur/clients) pour éviter tout mismatch d'hydratation :
  // la vraie largeur est lue après montage dans l'effet ci-dessous.
  const [viewport, setViewport] = useState(1800);
  const requested = NAME_TO_VARIANT[variant] || variant;
  const autoMobile = variant === "auto" && viewport < 810;
  const initialId = autoMobile ? "Ip59pHhO5" : (variant === "auto" ? (viewport < 1200 ? "oVuA0Rdqu" : "ZbjNrHK9l") : (VARIANT_CLASS[requested] ? requested : "ZbjNrHK9l"));
  const [menuOpen, setMenuOpen] = useState(["PR5O_TX2L", "pslIWKY0N", "lG_gYiE5L", "apN8iNd4y"].includes(initialId));
  const [servicesOpen, setServicesOpen] = useState(false);
  const [overlayType, setOverlayType] = useState("services");
  const [servicesBlurActive, setServicesBlurActive] = useState(false);
  const servicesCloseTimer = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { const fn = () => setViewport(window.innerWidth); fn(); window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn); }, []);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 8); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  useEffect(() => { if (!menuOpen) return; const previous = document.documentElement.style.overflow; const previousBody = document.body.style.overflow; document.documentElement.style.overflow = "hidden"; document.body.style.overflow = "hidden"; return () => { document.documentElement.style.overflow = previous; document.body.style.overflow = previousBody; }; }, [menuOpen]);
  useEffect(() => () => { if (servicesCloseTimer.current) clearTimeout(servicesCloseTimer.current); }, []);
  useEffect(() => { if (viewport >= 810 && variant === "auto") setMenuOpen(false); }, [viewport, variant]);

  let baseId = variant === "auto" ? (viewport < 810 ? "Ip59pHhO5" : viewport < 1200 ? "oVuA0Rdqu" : "ZbjNrHK9l") : (VARIANT_CLASS[requested] ? requested : "ZbjNrHK9l");
  if (MOBILE_IDS.has(baseId)) {
    const darkPair = ["pslIWKY0N","Baxppfab0"].includes(baseId);
    const scrollPair = ["lG_gYiE5L","nXvvpRJPs"].includes(baseId);
    baseId = menuOpen ? (darkPair ? "pslIWKY0N" : scrollPair ? "lG_gYiE5L" : "PR5O_TX2L") : (darkPair ? "Baxppfab0" : scrollPair ? "nXvvpRJPs" : "Ip59pHhO5");
  }
  const dark = DARK.has(baseId) || theme === "dark";
  const scrolledActive = scrolled && !menuOpen;
  // Certaines pages utilisent une variante desktop explicite : à petite largeur,
  // elles doivent malgré tout toujours basculer sur la navigation burger.
  const mobile = MOBILE_IDS.has(baseId) || viewport < 810;
  // Le menu mobile ouvert reprend volontairement l'apparence claire de la barre au scroll.
  const menuUsesScrollTheme = menuOpen && mobile;
  const navDark = dark && !scrolledActive && !menuUsesScrollTheme;
  const showDesktopLinks = !landingMode && !DESKTOP_LINKS_HIDDEN.has(baseId) && !mobile;
  const showRight = !RIGHT_HIDDEN.has(baseId) && !mobile;
  const logoOnly = LOGO_ONLY.has(baseId);
  const border = ["IekeHhisv","MOuhdlnSq","nXvvpRJPs"].includes(baseId);
  const bg = (scrolledActive || menuUsesScrollTheme) ? "rgb(251, 251, 251)" : (DARK.has(baseId) ? "rgb(18, 26, 46)" : (baseId === "lG_gYiE5L" || baseId === "nXvvpRJPs" ? fill2 : fill));
  const links = useMemo(() => ({homeHref, projectsHref, resourcesHref, freeToolsHref: "/outils-gratuits", aboutHref, ctaHref, landingHref, websiteHref, brandingHref, productDesignHref, copywritingHref, seoGeoHref, conversionOptimisationHref, framerHref, developmentHref}), [homeHref,projectsHref,resourcesHref,aboutHref,ctaHref,landingHref,websiteHref,brandingHref,productDesignHref,copywritingHref,seoGeoHref,conversionOptimisationHref,framerHref,developmentHref]);
  const openServices = () => { if (servicesCloseTimer.current) clearTimeout(servicesCloseTimer.current); setOverlayType("services"); setServicesBlurActive(true); setServicesOpen(true); };
  const openResources = () => { if (servicesCloseTimer.current) clearTimeout(servicesCloseTimer.current); setOverlayType("resources"); setServicesBlurActive(true); setServicesOpen(true); };
  const keepServicesOpen = () => { if (servicesCloseTimer.current) clearTimeout(servicesCloseTimer.current); setServicesBlurActive(true); };
  const closeServices = (event) => {
    const nextTarget = event?.relatedTarget;
    if (nextTarget instanceof Node && event?.currentTarget?.contains(nextTarget)) return;
    // Le panneau est en position fixed, donc il est un frère du lien dans le DOM.
    // Le reconnaître explicitement évite une fermeture entre le lien et l'overlay.
    if (nextTarget instanceof Element && nextTarget.closest(".navbar-services-popover-positioner")) return;
    if (servicesCloseTimer.current) clearTimeout(servicesCloseTimer.current);
    const movingToAnotherNavLink = nextTarget instanceof Element
      && !!nextTarget.closest(".navbar-desktop-links")
      && !nextTarget.closest(".navbar-services-anchor");
    if (movingToAnotherNavLink) { setServicesBlurActive(false); setServicesOpen(false); return; }
    servicesCloseTimer.current = setTimeout(() => {
      // La zone animée appartient au lien Services : on ne ferme que lorsque le
      // pointeur a réellement quitté le lien ET le panneau, pas pendant l'entrée.
      if (!document.querySelector(".navbar-services-anchor:hover, .navbar-services-popover-positioner:hover")) { setServicesBlurActive(false); setServicesOpen(false); }
    }, 120);
  };

  return <>
    <div className="navbar-spacer" aria-hidden="true" />
    <nav className={`framer-4kwVz framer-qkr4e3 ${VARIANT_CLASS[baseId] || ""} navbar-native ${menuOpen ? "navbar-menu-open" : ""} ${scrolledActive ? "navbar-scrolled" : ""} ${className}`} style={{ "--navbar-layer-bg": bg, backgroundColor: bg, color, borderBottom: border ? `1px solid ${baseId === "nXvvpRJPs" ? "rgb(34,34,34)" : "rgba(0,0,0,.13)"}` : `1px solid ${scrolledActive ? "rgba(0,0,0,.1)" : "rgba(0,0,0,0)"}`, ...style }}>
      {menuOpen && <MobileMenu dark={navDark} links={links} locale={locale} landingMode={landingMode} landingLinks={landingLinks} ctaLabel={ctaLabel} onClose={() => setMenuOpen(false)} />}
      {servicesOpen && <div className="navbar-services-backdrop" aria-hidden="true" />}
      <div className="framer-5yfpdr navbar-main-row">
        <Logo href={homeHref} dark={navDark} mobile={mobile} mobileUnique={baseId === "BG0nmz4mC"} />
        {showDesktopLinks && <div className="framer-1rupvmq navbar-desktop-links">
          <NavLink dark={navDark} href={homeHref}>{t("Accueil", "Home")}</NavLink>
          <NavLink dark={navDark} href={projectsHref}>{t("Réalisations", "Our work")}</NavLink>
          <div className={`framer-1egwlrv navbar-services-anchor ${servicesOpen && overlayType === "services" ? "is-open" : ""}`} onMouseLeave={closeServices}>
            <NavLink dark={navDark} services open={servicesOpen && overlayType === "services"} onMouseEnter={openServices} onClick={() => servicesOpen && overlayType === "services" ? (setServicesBlurActive(false), setServicesOpen(false)) : openServices()}>Services</NavLink>
          </div>
          <div className={`framer-1egwlrv navbar-services-anchor ${servicesOpen && overlayType === "resources" ? "is-open" : ""}`} onMouseLeave={closeServices}>
            <NavLink dark={navDark} services open={servicesOpen && overlayType === "resources"} onMouseEnter={openResources} onClick={() => servicesOpen && overlayType === "resources" ? (setServicesBlurActive(false), setServicesOpen(false)) : openResources()}>{t("Ressources", "Resources")}</NavLink>
          </div>
          <AnimatePresence>{servicesOpen && <DesktopServices key="services-popover" contentType={overlayType} links={links} motionSettings={DEFAULT_OVERLAY_MOTION} onBlurChange={setServicesBlurActive} onPointerEnter={keepServicesOpen} onPanelLeave={closeServices} onNavigate={() => { setServicesBlurActive(false); setServicesOpen(false); }} />}</AnimatePresence>
          <NavLink dark={navDark} href={aboutHref}>{t("Qui sommes nous ", "Who we are")}</NavLink>
        </div>}
        {!logoOnly && <div className="framer-ufyq2u-container navbar-burger-container"><Burger open={menuOpen} dark={navDark} onClick={() => setMenuOpen(v => !v)} /></div>}
        {showRight && <div className="framer-184c6kw navbar-right"><div className="navbar-right-actions">{!landingMode && <div className="framer-1u5ere7-container"><WhatsApp href={whatsappHref} /></div>}<div className="framer-1d2rod8-container"><CTA href={ctaHref} title={ctaLabel || t("Commencer mon projet", "Start my project")} shell={navDark ? "rgba(255,255,255,.15)" : "rgb(225,228,237)"} /></div></div></div>}
      </div>
    </nav>
  </>;
}
