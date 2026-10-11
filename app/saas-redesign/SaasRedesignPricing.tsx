"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import "./SaasRedesignPricing.css";
import { localizeHref } from "@/lib/i18n";
import { CtaArrowMark } from "@/components/ui/Cta";
import { SaasRedesignGuarantee } from "./SaasRedesignTrustSections";

type UpsellId = "page" | "branding" | "cro";

type Feature = {
  label: string;
  icon: string;
};

type Upsell = {
  id: UpsellId;
  title: string;
  description: string;
};

export type PrixOptimizedProps = {
  locale?: "fr" | "en";
  includeGuarantee?: boolean;
  guaranteeId?: string;
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
  croPrice?: number;
  additionalPagePrice?: number;
  className?: string;
  sectionId?: string;
};

const FEATURES: Feature[] = [
  { label: "Up to 1 page", icon: "/landing-assets/pricing/icon-layout.svg" },
  { label: "Brand refinement", icon: "/landing-assets/pricing/icon-flow.svg" },
  { label: "Delivered within 10 days", icon: "/landing-assets/pricing/icon-calendar.svg" },
  { label: "Framer development", icon: "/landing-assets/pricing/icon-flash.svg" },
  { label: "3 rounds of unlimited revisions", icon: "/landing-assets/pricing/icon-infinity.svg" },
  { label: "Page animation", icon: "/landing-assets/pricing/icon-bounce.svg" },
  { label: "Responsive development", icon: "/landing-assets/pricing/icon-laptop.svg" },
  { label: "A dedicated project manager", icon: "/landing-assets/pricing/icon-user.svg" },
  { label: "24/7 customer support", icon: "/landing-assets/pricing/icon-support.svg" },
  { label: "Framer or React / Next.js development", icon: "/landing-assets/pricing/icon-code.svg" },
  { label: "Optimized copywriting", icon: "/landing-assets/pricing/icon-copy.svg" },
  { label: "Conversion strategy", icon: "/landing-assets/pricing/icon-chart.svg" },
];

const UPSELLS: Upsell[] = [
  {
    id: "page",
    title: "Additional page",
    description: "",
  },
  {
    id: "branding",
    title: "Full Brand Identity",
    description: "Une identité de marque complète, du logo à la direction visuelle.",
  },
  {
    id: "cro",
    title: "Post-launch CRO Sprint",
    description: "Optimisation des conversions après la mise en ligne.",
  },
];
const EN_FEATURE_LABELS = [
  "Up to 1 page",
  "Brand refinement",
  "Delivered within 10 days",
  "Framer development",
  "3 rounds of unlimited revisions",
  "Page animation",
  "Responsive development",
  "A dedicated project manager",
  "24/7 customer support",
  "Framer or React / Next.js development",
  "Optimized copywriting",
  "Conversion strategy",
];
const FR_FEATURE_LABELS = [
  "Jusqu’à 1 page",
  "Affinement de la marque",
  "Livraison sous 10 jours",
  "Développement Framer",
  "3 séries de révisions illimitées",
  "Animation de page",
  "Développement responsive",
  "Un chef de projet dédié",
  "Assistance client 24 h/24, 7 j/7",
  "Développement Framer ou React / Next.js",
  "Copywriting optimisé",
  "Stratégie de conversion",
];
const EN_UPSELL_COPY: Record<UpsellId, [string, string]> = {
  page: ["Additional page", "Add one more page to your website."],
  branding: ["Full Brand Identity", "A complete brand identity, from logo to visual direction."],
  cro: ["Post-launch CRO Sprint", "Conversion improvements after launch."],
};

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
  return (
    <div className="sr-prx-featureItem">
      <img className="sr-prx-featureIcon" src={feature.icon} alt="" aria-hidden="true" />
      <span className="sr-prx-featureText">{feature.label}</span>
    </div>
  );
}

export default function PrixOptimized({
  basePrice,
  extraPrice,
  maxPages = 10,
  sliderInfoText,
  bookingLabel = "Réserver un appel",
  bookingHref = "/30-min",
  brandingPrice,
  croPrice,
  additionalPagePrice,
  className = "",
  sectionId = "pricing",
  locale = "fr",
  includeGuarantee = false,
  guaranteeId,
}: PrixOptimizedProps) {
  const english = locale === "en";
  const prices = english
    ? { base: 2000, page: 400, additionalPage: 450, branding: 700, cro: 800 }
    : { base: 1765, page: 400, additionalPage: 450, branding: 620, cro: 700 };
  const resolvedBasePrice = basePrice ?? prices.base;
  const resolvedExtraPrice = extraPrice ?? prices.page;
  bookingHref = localizeHref(bookingHref, locale) || "#";
  bookingLabel = bookingLabel || (english ? "Start now" : "Réserver un appel");
  const formatPrice = (amount: number) =>
    english ? `$${amount.toLocaleString("en-US")}` : `${amount.toLocaleString("fr-FR")} €`;
  const localizedSliderInfo = sliderInfoText ??
    (english
      ? `(+${formatPrice(resolvedExtraPrice)} per additional page)`
      : `(+${formatPrice(resolvedExtraPrice)} par page supplémentaire)`);
  const safeMaxPages = Math.max(2, Math.round(maxPages));
  const initialPages = 1;
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
      page: additionalPagePrice ?? prices.additionalPage,
      branding: brandingPrice ?? prices.branding,
      cro: croPrice ?? prices.cro,
    }),
    [additionalPagePrice, brandingPrice, croPrice, prices.additionalPage, prices.branding, prices.cro],
  );

  const totalPrice = useMemo(() => {
    let total = resolvedBasePrice + (pages - 1) * resolvedExtraPrice;
    activeUpsells.forEach((id) => {
      total += upsellPrices[id];
    });
    return total;
  }, [activeUpsells, resolvedBasePrice, resolvedExtraPrice, pages, upsellPrices]);

  const displayedPrice = useAnimatedNumber(totalPrice);
  const pageTitle = pages === 1
    ? english ? "One Page Site" : "Site one-page"
    : english ? "Website" : "Site Internet";
  const fillPercentage = ((rawValue - 1) / (safeMaxPages - 1)) * 100;
  const badgeLeft = thumbPosition(rawValue, 1, safeMaxPages, trackWidth);
  const ticks = useMemo(
    () => Array.from({ length: safeMaxPages }),
    [safeMaxPages],
  );
  const localizedFeatures = FEATURES.map((feature, index) => ({
    ...feature,
    label: index === 0
      ? english ? `Up to ${pages} ${pages === 1 ? "page" : "pages"}` : `Jusqu’à ${pages} ${pages === 1 ? "page" : "pages"}`
      : index === 2
        ? english ? `Delivered within ${pages === 1 ? 10 : 14} days` : `Livraison sous ${pages === 1 ? 10 : 14} jours`
        : english ? EN_FEATURE_LABELS[index] : FR_FEATURE_LABELS[index],
  }));
  const localizedUpsells = english
    ? UPSELLS.map((upsell) => ({
        ...upsell,
        title: EN_UPSELL_COPY[upsell.id][0],
        description: EN_UPSELL_COPY[upsell.id][1],
      }))
    : UPSELLS;
  const leftFeatures = localizedFeatures.slice(0, 6);
  const rightFeatures = localizedFeatures.slice(6);

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
    <section id={sectionId} className={`sr-prx-section ${className}`.trim()}>
      <div className="sr-prx-backgroundShapes" aria-hidden="true">
        <img className="sr-prx-shape" src="/landing-assets/saas-redesign/pricing-comparison-shapes.svg" alt="" />
      </div>
      <div className="sr-prx-sectionInner">
        <header className="sr-prx-heading">
          <h2 className="sr-prx-sectionTitle">
            {english ? "Make your site looks like it belongs to a real company" : "Un site à la hauteur d’une vraie entreprise"}
          </h2>
          <p className="sr-prx-headingDescription">
            {english
              ? <>You’ve already done the hard part: building the product, getting users and <strong>proving people are willing to pay for it.</strong></>
              : <>Vous avez déjà fait le plus difficile : créer votre produit, trouver vos utilisateurs et <strong>prouver que votre offre mérite d’être achetée.</strong></>}
          </p>
          <div className="sr-prx-headingRule" aria-hidden="true" />
        </header>

        <div className="sr-prx-pricingLayout">
          <article className="sr-prx-mainCard">
            <div className="sr-prx-baseTop">
              <div className="sr-prx-baseSummary">
                <h3>{pageTitle}</h3>
                <div className="sr-prx-priceLine">
                  <div className="sr-prx-total">{formatPrice(displayedPrice)}</div>
                </div>
              </div>

              <div className="sr-prx-sliderModule">
                <div className="sr-prx-sliderInfo">{localizedSliderInfo}</div>
                <div className="sr-prx-sliderControl">
                  <div className="sr-prx-pageBadge" style={{ left: badgeLeft }}>
                    {pages} {english ? (pages === 1 ? "page" : "pages") : (pages === 1 ? "page" : "pages")}
                  </div>
                  <div className="sr-prx-trackBackground" aria-hidden="true">
                    <div className="sr-prx-ticks">{ticks.map((_, index) => <span key={index} />)}</div>
                    <div className="sr-prx-trackFill" style={{ width: `${fillPercentage}%` }} />
                  </div>
                  <input
                    ref={sliderRef}
                    className="sr-prx-range"
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
            </div>

            <div className="sr-prx-included">
              <h3>{english ? "INCLUDED :" : "INCLUS :"}</h3>
              <div className="sr-prx-featureGrid">
                <div className="sr-prx-featureColumn">{leftFeatures.map((feature) => <FeatureItem key={feature.label} feature={feature} />)}</div>
                <div className="sr-prx-featureColumn">{rightFeatures.map((feature) => <FeatureItem key={feature.label} feature={feature} />)}</div>
              </div>
              <div className="sr-prx-priceArea">
                <div className="sr-prx-ctaStack">
                  <div className="sr-prx-primaryFrame">
                    <a className="sr-prx-primaryButton sr-prx-primaryButton--with-arrow" href={bookingHref}>
                      <span>{bookingLabel}</span>
                      <CtaArrowMark className="sr-prx-cta-arrow" />
                    </a>
                  </div>
                  <div className="sr-prx-reassurance">
                    <span><img src="/landing-assets/saas-redesign/social-proof/no-sales-call.svg" alt="" />{english ? "No sales call required" : "Sans appel commercial"}</span>
                    <i aria-hidden="true" />
                    <span><img src="/landing-assets/saas-redesign/social-proof/no-commitment.svg" alt="" />{english ? "No commitment" : "Sans engagement"}</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <div className="sr-prx-upsellGrid" role="group" aria-label={english ? "Additional options" : "Options supplémentaires"}>
            {localizedUpsells.map((upsell) => {
              const isActive = activeUpsells.has(upsell.id);
              return (
                <button
                  key={upsell.id}
                  type="button"
                  className={`sr-prx-upsellCard${isActive ? " sr-prx-upsellActive" : ""}`}
                  aria-pressed={isActive}
                  onClick={() => toggleUpsell(upsell.id)}
                >
                  <span className="sr-prx-upsellName">{upsell.title}</span>
                  <span className="sr-prx-upsellPrice">+{formatPrice(upsellPrices[upsell.id])}{upsell.id === "page" ? (english ? "/ page" : "/ page") : ""}</span>
                  <span className="sr-prx-upsellCheck" aria-hidden="true">{isActive ? <CheckIcon /> : null}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
      {includeGuarantee && <SaasRedesignGuarantee id={guaranteeId} />}
    </section>
  );
}
