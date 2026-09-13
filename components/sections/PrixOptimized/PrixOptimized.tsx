"use client";

import {
  Calendar,
  Code2,
  Edit3,
  FileText,
  Headphones,
  Infinity as InfinityIcon,
  Layout,
  Maximize,
  MessageCircle,
  Monitor,
  PenTool,
  Search,
  Share2,
  User,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./PrixOptimized.css";
import { localizeHref } from "@/lib/i18n";

type UpsellId = "branding" | "cms" | "motion";

type Feature = {
  label: string;
  Icon: LucideIcon;
};

type Upsell = {
  id: UpsellId;
  title: string;
  description: string;
  Icon: LucideIcon;
  full?: boolean;
};

export type PrixOptimizedProps = {
  locale?: "fr" | "en";
  basePrice?: number;
  extraPrice?: number;
  maxPages?: number;
  landingTitle?: string;
  landingDescription?: string;
  siteTitle?: string;
  siteDescription?: string;
  sliderInfoText?: string;
  bookingLabel?: string;
  bookingHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  avatarSrc?: string;
  tickerImages?: string[];
  brandingPrice?: number;
  cmsPrice?: number;
  motionPrice?: number;
  className?: string;
};

const FEATURES: Feature[] = [
  { label: "Livraison en 14 jours", Icon: Calendar },
  { label: "Adaptation: Desktop & Mobile", Icon: Monitor },
  { label: "Développement Framer", Icon: Zap },
  { label: "Copywriting optimisé", Icon: Edit3 },
  { label: "Illustrations sur-mesure", Icon: Layout },
  { label: "Optimisations SEO", Icon: Search },
  { label: "Modifications illimitées", Icon: InfinityIcon },
  { label: "1 Page", Icon: FileText },
  { label: "Analyse stratégique", Icon: Users },
  { label: "Animation de la Page", Icon: Share2 },
  { label: "Un responsable de projet", Icon: User },
  { label: "Suivi projet temps réel", Icon: MessageCircle },
  { label: "Support client 24h/7j", Icon: Headphones },
];

const UPSELLS: Upsell[] = [
  {
    id: "branding",
    title: "Branding",
    description: "Création complète de votre identité visuelle",
    Icon: PenTool,
  },
  {
    id: "cms",
    title: "Intégration CMS",
    description: "Gérez votre contenu de manière autonome",
    Icon: Code2,
  },
  {
    id: "motion",
    title: "Animation motion-design",
    description: "Animations complexes",
    Icon: Maximize,
    full: true,
  },
];
const EN_FEATURE_LABELS = [
  "Delivery in 14 days",
  "Desktop & mobile adaptation",
  "Framer development",
  "Optimized copywriting",
  "Custom illustrations",
  "SEO optimizations",
  "Unlimited revisions",
  "1 Page",
  "Strategic analysis",
  "Page animation",
  "A dedicated project manager",
  "Real-time project tracking",
  "24/7 customer support",
];
const EN_UPSELL_COPY: Record<UpsellId, [string, string]> = {
  branding: ["Branding", "Complete visual identity creation"],
  cms: ["CMS integration", "Manage your content independently"],
  motion: ["Motion design animation", "Complex animations"],
};

const DEFAULT_AVATAR =
  "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?scale-down-to=64&width=693&height=693";

const DEFAULT_TICKER_IMAGES = [
  "https://framerusercontent.com/images/uuaFUZpL3fVhRaGlSV5bBUBCapU.png?scale-down-to=1024&width=2206&height=1223",
  "https://framerusercontent.com/images/RyWM4bax5mzqIS95PvmCIH54M.png?scale-down-to=1024&width=1071&height=854",
  "https://framerusercontent.com/images/aONP6DTlxxTAGxNKuzFV84mvpA.png?scale-down-to=1024&width=1331&height=884",
  "https://framerusercontent.com/images/sQTv5J42VPuoBjGNWLqLWTNAT6k.png?scale-down-to=512&width=1252&height=862",
  "https://framerusercontent.com/images/5VTG0ey1sYXgrBXyTylalHaGtU.jpg?scale-down-to=1024&width=6064&height=4060",
  "https://framerusercontent.com/images/uuaFUZpL3fVhRaGlSV5bBUBCapU.png?scale-down-to=1024&width=2206&height=1223",
  "https://framerusercontent.com/images/wOfEwcZxQ4z81VQslBCNK1V9Q2s.png?scale-down-to=1024&width=1346&height=716",
];

function useAnimatedNumber(target: number) {
  const [displayed, setDisplayed] = useState(target);
  const previous = useRef(target);
  const animationFrame = useRef(0);

  useEffect(() => {
    const start = previous.current;
    const duration = 400;
    const startedAt = performance.now();

    cancelAnimationFrame(animationFrame.current);

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

      setDisplayed(Math.floor(start + (target - start) * eased));

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(tick);
      } else {
        previous.current = target;
      }
    };

    animationFrame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame.current);
  }, [target]);

  return displayed;
}

function thumbPosition(
  value: number,
  min: number,
  max: number,
  trackWidth: number,
) {
  const thumbWidth = 28;
  if (max <= min) return thumbWidth / 2;
  return (
    ((value - min) / (max - min)) * (trackWidth - thumbWidth) + thumbWidth / 2
  );
}

function FeatureItem({ feature }: { feature: Feature }) {
  const { Icon } = feature;
  return (
    <div className="prx-featureItem">
      <span className="prx-iconCircle" aria-hidden="true">
        <Icon size={16} strokeWidth={2.2} />
      </span>
      <span className="prx-featureText">{feature.label}</span>
    </div>
  );
}

export default function PrixOptimized({
  basePrice = 1450,
  extraPrice = 350,
  maxPages = 10,
  landingTitle = "Landing Page",
  landingDescription = "Idéal pour un produit, un service ou un objectif unique, une page optimisée pour convertir.",
  siteTitle = "Site Internet",
  siteDescription = "Idéale pour ceux qui veulent scaler et ont une audience plus large.",
  sliderInfoText = "(+350€ pages supplémentaires)",
  bookingLabel = "Réserver un appel",
  bookingHref = "/30-min",
  secondaryLabel = "Voir nos réalisations",
  secondaryHref = "/realisations",
  avatarSrc = DEFAULT_AVATAR,
  tickerImages = DEFAULT_TICKER_IMAGES,
  brandingPrice = 745,
  cmsPrice = 245,
  motionPrice = 395,
  className = "",
  locale = "fr",
}: PrixOptimizedProps) {
  const english = locale === "en";
  bookingHref = localizeHref(bookingHref, locale) || "#";
  secondaryHref = localizeHref(secondaryHref, locale) || "#";
  bookingLabel = english ? "Book a call" : bookingLabel;
  secondaryLabel = english ? "View our work" : secondaryLabel;
  const localizedLandingDescription = english
    ? "Ideal for a product, service or single goal: a page optimized to convert."
    : landingDescription;
  const localizedSiteDescription = english
    ? "Ideal for businesses ready to scale with a broader audience."
    : siteDescription;
  const localizedSliderInfo = english
    ? "(+€350 per additional page)"
    : sliderInfoText;
  const safeMaxPages = Math.max(2, Math.round(maxPages));
  const initialPages = Math.min(3, safeMaxPages);
  const [pages, setPages] = useState(initialPages);
  const [rawValue, setRawValue] = useState(initialPages);
  const [activeUpsells, setActiveUpsells] = useState<Set<UpsellId>>(
    () => new Set(),
  );
  const [trackWidth, setTrackWidth] = useState(300);
  const sliderRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const updateWidth = () => setTrackWidth(slider.offsetWidth);
    const observer = new ResizeObserver(updateWidth);
    observer.observe(slider);
    updateWidth();

    return () => observer.disconnect();
  }, []);

  const upsellPrices = useMemo(
    () => ({
      branding: brandingPrice,
      cms: cmsPrice,
      motion: motionPrice,
    }),
    [brandingPrice, cmsPrice, motionPrice],
  );

  const totalPrice = useMemo(() => {
    let total = basePrice + (pages - 1) * extraPrice;
    activeUpsells.forEach((id) => {
      total += upsellPrices[id];
    });
    return total;
  }, [activeUpsells, basePrice, extraPrice, pages, upsellPrices]);

  const displayedPrice = useAnimatedNumber(totalPrice);
  const pageTitle = pages === 1 ? landingTitle : siteTitle;
  const pageDescription =
    pages === 1 ? localizedLandingDescription : localizedSiteDescription;
  const fillPercentage = ((rawValue - 1) / (safeMaxPages - 1)) * 100;
  const badgeLeft = thumbPosition(rawValue, 1, safeMaxPages, trackWidth);
  const ticks = useMemo(
    () => Array.from({ length: safeMaxPages }),
    [safeMaxPages],
  );
  const localizedFeatures = english
    ? FEATURES.map((feature, index) => ({
        ...feature,
        label: EN_FEATURE_LABELS[index],
      }))
    : FEATURES;
  const localizedUpsells = english
    ? UPSELLS.map((upsell) => ({
        ...upsell,
        title: EN_UPSELL_COPY[upsell.id][0],
        description: EN_UPSELL_COPY[upsell.id][1],
      }))
    : UPSELLS;
  const leftFeatures = localizedFeatures.filter((_, index) => index % 2 === 0);
  const rightFeatures = localizedFeatures.filter((_, index) => index % 2 !== 0);
  const ticker =
    tickerImages.length > 0 ? tickerImages : Array<string | null>(8).fill(null);

  const onSliderChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      const snapped = Math.round(value);
      setRawValue(value);
      setPages(snapped);
    },
    [],
  );

  const snapSlider = useCallback(() => {
    const snapped = Math.round(rawValue);
    setRawValue(snapped);
    setPages(snapped);
  }, [rawValue]);

  const toggleUpsell = useCallback((id: UpsellId) => {
    setActiveUpsells((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <section id="pricing" className={`prx-section ${className}`.trim()}>
      <div className="prx-sectionInner">
        <h2 className="prx-sectionTitle">
          {english
            ? "Clear pricing, no surprises"
            : "Des tarifs clairs, sans surprise"}
        </h2>

        <div className="prx-cardShell">
          <div className="prx-card">
            <div className="prx-leftPanel">
              <header>
                <h3 className="prx-cardTitle">{pageTitle}</h3>
                <p className="prx-cardDescription">{pageDescription}</p>
              </header>

              <div className="prx-optionsLabel">
                {english ? "Additional options:" : "Options supplémentaires :"}
              </div>

              <div className="prx-upsellGrid">
                {localizedUpsells.map((upsell) => {
                  const isActive = activeUpsells.has(upsell.id);
                  return (
                    <button
                      key={upsell.id}
                      type="button"
                      className={`prx-upsellCard${upsell.full ? " prx-upsellFull" : ""}${
                        isActive ? " prx-upsellActive" : ""
                      }`}
                      aria-pressed={isActive}
                      onClick={() => toggleUpsell(upsell.id)}
                    >
                      <h4>{upsell.title}</h4>
                      <p>{upsell.description}</p>
                      <div className="prx-upsellPrice">
                        +{upsellPrices[upsell.id]}€
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="prx-sliderModule">
                <div className="prx-sliderInfo">{localizedSliderInfo}</div>
                <div className="prx-sliderControl">
                  <div className="prx-pageBadge" style={{ left: badgeLeft }}>
                    {pages} {english ? "page" : "Page"}{pages > 1 ? "s" : ""}
                  </div>

                  <div className="prx-trackBackground" aria-hidden="true">
                    <div className="prx-ticks">
                      {ticks.map((_, index) => (
                        <span key={index} />
                      ))}
                    </div>
                    <div
                      className="prx-trackFill"
                      style={{ width: `${fillPercentage}%` }}
                    />
                  </div>

                  <input
                    ref={sliderRef}
                    className="prx-range"
                    aria-label={english ? "Number of pages" : "Nombre de pages"}
                    type="range"
                    min={1}
                    max={safeMaxPages}
                    step="any"
                    value={rawValue}
                    onChange={onSliderChange}
                    onMouseUp={snapSlider}
                    onTouchEnd={snapSlider}
                    onKeyUp={snapSlider}
                  />
                </div>
              </div>

              <div className="prx-priceArea">
                <div className="prx-total">
                  {displayedPrice.toLocaleString("fr-FR")}€
                </div>

                <div className="prx-ctaStack">
                  <div className="prx-primaryFrame">
                    <a className="prx-primaryButton" href={bookingHref}>
                      <span>{bookingLabel}</span>
                      <span className="prx-avatarBox">
                        <img src={avatarSrc} alt="Photo de profil" />
                      </span>
                    </a>
                  </div>

                  <a className="prx-secondaryButton" href={secondaryHref}>
                    {secondaryLabel}
                  </a>
                </div>
              </div>
            </div>

            <div className="prx-rightPanel">
              <h3 className="prx-cardTitle">
                {english ? "What's included:" : "Ce qui est inclus :"}
              </h3>

              <div className="prx-featureGrid">
                <div className="prx-featureColumn">
                  {leftFeatures.map((feature) => (
                    <FeatureItem key={feature.label} feature={feature} />
                  ))}
                </div>
                <div className="prx-featureColumn">
                  {rightFeatures.map((feature) => (
                    <FeatureItem key={feature.label} feature={feature} />
                  ))}
                </div>

                <div className="prx-pillsRow">
                  {Array.from(activeUpsells).map((id) => {
                    const upsell = localizedUpsells.find(
                      (item) => item.id === id,
                    );
                    if (!upsell) return null;
                    const Icon = upsell.Icon;
                    return (
                      <div className="prx-pill" key={id}>
                        <span className="prx-iconCircle" aria-hidden="true">
                          <Icon size={14} strokeWidth={2.2} />
                        </span>
                        <span>{upsell.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="prx-ticker" aria-hidden="true">
                <div className="prx-tickerTrack">
                  {[0, 1].flatMap((setIndex) =>
                    ticker.map((src, index) => (
                      <div
                        className="prx-tickerCard"
                        key={`${setIndex}-${index}`}
                        style={
                          src
                            ? {
                                backgroundImage: `url("${src}")`,
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                              }
                            : undefined
                        }
                      />
                    )),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="prx-guarantee">
          <p className="prx-guaranteeTitle">
            {english
              ? "100% satisfaction guaranteed"
              : "Satisfait ou 100% Garantit"}
          </p>
          <p className="prx-guaranteeDescription">
            {english ? (
              "We refine your website until it fully meets your needs, or we refund you in full."
            ) : (
              <>
                Nous perfectionnons votre site jusqu’à ce qu’il vous convienne
                entièrement, ou nous vous remboursons intégralement.
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
