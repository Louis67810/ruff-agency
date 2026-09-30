"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, ChevronLeft, Info, Search, X } from "lucide-react";
import Cta from "@/components/ui/Cta";
import ResourceShare from "@/components/sections/RessourceArticle/ResourceShare";
import { QUALIFICATION, estimateConversion, rankDomains, type Domain, type Qualification } from "@/lib/conversion-estimator";
import "./RedesignRoiTool.css";

const money = (value: number, locale: string) => new Intl.NumberFormat(locale, { style: "currency", currency: locale === "en-US" ? "USD" : "EUR", maximumFractionDigits: 0 }).format(Math.round(value));
const number = (value: number, locale: string) => new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value);

function useAnimatedNumber(target: number, active: boolean) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!active) { setDisplay(0); return; }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setDisplay(target); return; }
    let frame = 0;
    const start = performance.now();
    const animate = (time: number) => {
      const progress = Math.min(1, Math.max(0, (time - start) / 680));
      setDisplay(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target, active]);
  return display;
}

export default function RedesignRoiTool({ locale = "fr" }: { locale?: "fr" | "en" }) {
  const english = locale === "en";
  const formatLocale = english ? "en-US" : "fr-FR";
  const redesignServicePrice = english ? 2000 : 1765;
  const [sales, setSales] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [domain, setDomain] = useState<Domain | null>(null);
  const [qualification, setQualification] = useState<Qualification>("medium");
  const [rate, setRate] = useState<number | "">("");
  const [rateEdited, setRateEdited] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchStep, setSearchStep] = useState<"domain" | "qualification">("domain");
  const [pendingDomain, setPendingDomain] = useState<Domain | null>(null);
  const [barHover, setBarHover] = useState<{ position: number; value: number; direction: "up" | "down" } | null>(null);
  const hoverValueRef = useRef<number | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [pageUrl, setPageUrl] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  useEffect(() => setPageUrl(window.location.href), []);

  useEffect(() => {
    if (!searchOpen) return;
    const outside = (event: PointerEvent) => { if (!searchRef.current?.contains(event.target as Node)) setSearchOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setSearchOpen(false); };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [searchOpen]);

  function selectQualification(value: Qualification) {
    if (!pendingDomain) return;
    setDomain(pendingDomain);
    setQualification(value);
    if (!rateEdited || !domain) setRate(Number((pendingDomain.baseRate * QUALIFICATION[value].factor).toFixed(2)));
    setSearchOpen(false);
    setQuery("");
  }

  const suggestions = useMemo(() => rankDomains(query), [query]);
  const ready = !!domain && rate !== "" && Number(rate) > 0 && sales !== "" && price !== "";
  const result = useMemo(() => ready && domain ? estimateConversion({ domain, qualification, sales: Number(sales), price: Number(price), currentRate: Number(rate), investment: redesignServicePrice }) : null, [ready, domain, qualification, sales, price, rate, redesignServicePrice]);
  const currentRate = result?.currentRate ?? 0;
  const afterRate = result?.afterRate ?? 0;
  const animatedCurrent = useAnimatedNumber(currentRate, ready);
  const animatedAfter = useAnimatedNumber(afterRate, ready);
  const scaleMax = result ? Math.max(afterRate / .72, currentRate / .36, .2) : 1;
  const currentPosition = result ? Math.min(94, currentRate / scaleMax * 100) : 0;
  const afterPosition = result ? Math.min(94, afterRate / scaleMax * 100) : 0;
  const shown = (value: number, suffix = "") => result ? `${number(value, formatLocale)}${suffix}` : "—";
  const shownMoney = (value: number) => result ? money(value, formatLocale) : "—";

  function moveOnBar(event: React.PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const position = Math.min(100, Math.max(0, (event.clientX - bounds.left) / bounds.width * 100));
    const value = result ? position / 100 * scaleMax : 0;
    const direction = hoverValueRef.current === null || value >= hoverValueRef.current ? "up" : "down";
    hoverValueRef.current = value;
    setBarHover({ position, value, direction });
  }

  return <>
    <div className="rrt-card">
      <div className="rrt-inputs">
        <span className="rrt-kicker">{english ? "Interactive tool" : "Outil interactif"}</span>
        <h2>{english ? "What could your website earn?" : "Quel potentiel pour votre site ?"}</h2>
        <p className="rrt-subtitle">{english ? "Adjust your numbers to explore a realistic redesign scenario." : "Ajustez vos chiffres pour explorer un scénario de refonte réaliste."}</p>
        <div className="rrt-divider" />
        <label>{english ? "Sales per month from your website" : "Combien de ventes par mois via votre site ?"}<input type="number" min="0" step="1" placeholder="0" value={sales} onChange={(event) => setSales(event.target.value === "" ? "" : Math.max(0, Number(event.target.value)))} /></label>
        <label>{english ? "Average sale value" : "Prix moyen d’une vente"}<span className="rrt-number"><input type="number" min="0" step="50" placeholder="0" value={price} onChange={(event) => setPrice(event.target.value === "" ? "" : Math.max(0, Number(event.target.value)))} /><span>{english ? "$" : "€"}</span></span></label>
        <label>{english ? "Current conversion rate" : "Votre taux de conversion actuel"}<span className="rrt-number"><input type="number" min="0.1" max="100" step="0.1" placeholder="0" value={rate} onChange={(event) => { setRate(event.target.value === "" ? "" : Math.min(100, Math.max(0, Number(event.target.value)))); setRateEdited(true); }} /><span>%</span></span></label>
        <div className="rrt-field" ref={searchRef}>
          <span>{english ? "Business sector" : "Domaine d’activité"}</span>
          <button className={`rrt-domain${domain ? "" : " is-placeholder"}`} type="button" aria-expanded={searchOpen} aria-haspopup="dialog" onClick={() => { setSearchOpen((value) => !value); setSearchStep("domain"); setPendingDomain(domain); setQuery(""); }}>{domain?.label ?? (english ? "Describe your activity precisely" : "Précisez votre activité")}<ChevronDown size={19} /></button>
          {!domain && <small className="rrt-domain-hint">{english ? "Be specific about what you sell, e.g. B2B SaaS." : "Précisez ce que vous vendez, par exemple « logiciel SaaS B2B »."}</small>}
          {searchOpen && <div className="rrt-suggestions" role="dialog" aria-label={english ? "Choose a sector and visitor quality" : "Choisir un domaine et une qualification"}>
            <div className="rrt-search">
              {searchStep === "domain" ? <Search size={21} aria-hidden="true" /> : <button type="button" className="rrt-back" aria-label={english ? "Back to sectors" : "Retour aux domaines"} onClick={() => setSearchStep("domain")}><ChevronLeft size={23} /></button>}
              {searchStep === "domain" ? <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={english ? "Describe your business" : "Décrivez précisément votre activité"} aria-label={english ? "Search sectors" : "Rechercher un domaine"} /> : <strong>{pendingDomain?.label}</strong>}
            </div>
            <div className="rrt-suggestion-list" key={searchStep}>
              {searchStep === "domain" ? (suggestions.length ? suggestions.map((item) => <button type="button" key={item.id} onClick={() => { setPendingDomain(item); setSearchStep("qualification"); }}>{item.label}</button>) : <p>{english ? "No matching sector" : "Aucun domaine trouvé"}</p>) : <><p className="rrt-step-label">{english ? "How qualified are your visitors?" : "Vos visiteurs sont-ils qualifiés ?"}</p>{(Object.keys(QUALIFICATION) as Qualification[]).map((value) => <button type="button" key={value} onClick={() => selectQualification(value)}>{english ? ({ low: "Low qualified", medium: "Moderately qualified", high: "Highly qualified" }[value]) : QUALIFICATION[value].label}<span>{qualification === value && pendingDomain?.id === domain?.id ? <Check size={18} /> : null}</span></button>)}</>}
            </div>
          </div>}
        </div>
      </div>
      <div className="rrt-results">
        <div className="rrt-result-scroll">
          <h3>{english ? "Estimated conversion after redesign" : "Taux de conversion estimé après refonte"}</h3>
          <div className={`rrt-bar${result ? "" : " is-empty"}`} aria-label={result ? `${number(currentRate, formatLocale)} % ${english ? "currently" : "actuellement"}, ${number(afterRate, formatLocale)} % ${english ? "estimated" : "estimé"}` : (english ? "Enter your details to see the estimate" : "Renseignez vos données pour voir l’estimation")} onPointerMove={moveOnBar} onPointerLeave={() => { hoverValueRef.current = null; setBarHover(null); }}>
            {Array.from({ length: 9 }, (_, index) => <i className="rrt-tick" style={{ left: `${index * 12.5}%` }} key={index} />)}
            {result && <><button type="button" className="rrt-marker rrt-marker--current" style={{ left: `${currentPosition}%` }} onFocus={() => { hoverValueRef.current = currentRate; setBarHover({ position: currentPosition, value: currentRate, direction: "up" }); }} onBlur={() => { hoverValueRef.current = null; setBarHover(null); }} aria-label={`${english ? "Current conversion" : "Conversion actuelle"} : ${number(currentRate, formatLocale)} %`} /><button type="button" className="rrt-marker rrt-marker--after" style={{ left: `${afterPosition}%` }} onFocus={() => { hoverValueRef.current = afterRate; setBarHover({ position: afterPosition, value: afterRate, direction: "up" }); }} onBlur={() => { hoverValueRef.current = null; setBarHover(null); }} aria-label={`${english ? "Estimated conversion" : "Conversion estimée"} : ${number(afterRate, formatLocale)} %`} /></>}
            {barHover && <div className="rrt-bar-tip" style={{ left: `${barHover.position}%` }}><span className={`rrt-bar-tip-value rrt-bar-tip-value--${barHover.direction}`} key={barHover.direction}>{number(barHover.value, formatLocale)} %</span></div>}
          </div>
          <div className="rrt-bar-labels"><span>0 %</span>{result && <><span className="rrt-bar-current" style={{ left: `${currentPosition}%` }}>{english ? "Your site currently" : "Votre site actuellement"}<strong>{number(animatedCurrent, formatLocale)} %</strong></span><span className="rrt-bar-after" style={{ left: `${afterPosition}%` }}>{english ? "Our estimate" : "Notre estimation"}<strong>{number(animatedAfter, formatLocale)} %</strong></span></>}</div>
          <div className="rrt-divider" />
          <div className="rrt-result-cards">
            <div className="rrt-before"><h4>{english ? "Current situation" : "Votre situation actuelle"}</h4><dl><div><dt>{english ? "Sales/month" : "Ventes/mois"}</dt><dd>{result ? number(Number(sales), formatLocale) : "—"}</dd></div><div><dt>{english ? "Conversion rate" : "Taux de conversion"}</dt><dd>{shown(animatedCurrent, " %")}</dd></div><div><dt>{english ? "Revenue/month" : "CA/mois"}</dt><dd>{shownMoney(Number(sales) * Number(price))}</dd></div></dl></div>
            <div className="rrt-after"><h4>{english ? "After redesign" : "Après refonte"}</h4><dl><div><dt>{english ? "Sales/month" : "Ventes/mois"}</dt><dd>{shown(result?.afterSales ?? 0)}</dd></div><div><dt>{english ? "Conversion rate" : "Taux de conversion"}</dt><dd>{shown(animatedAfter, " %")}</dd></div><div><dt>{english ? "Revenue/month" : "CA/mois"}</dt><dd>{shownMoney((result?.afterSales ?? 0) * Number(price))}</dd></div></dl><div className="rrt-extra"><span>{english ? "Additional revenue/month" : "CA supplémentaire/mois"}</span><strong>{result ? `+${money(result.extraRevenue, formatLocale)}` : "—"}</strong></div><div className="rrt-extra rrt-extra--second"><span>{english ? "Additional revenue/year" : "CA supplémentaire/an"}</span><strong>{result ? `+${money(result.extraRevenue * 12, formatLocale)}` : "—"}</strong></div></div>
          </div>
          <div className="rrt-stats">
            <div className="rrt-stat-card"><div className="rrt-stat-heading"><span>{english ? "ROI over 12 months" : "ROI sur 12 mois"}</span><button type="button" className="rrt-info" aria-label={english ? "How is the ROI calculated?" : "Comment le ROI est-il calculé ?"}><Info size={14} /><span className="rrt-info-tip">{english ? "Based on a $2,000 redesign service." : "Calculé avec une prestation de refonte facturée 1 765 €."}</span></button></div><strong>{result?.roiTwelveMonths == null ? "—" : `${result.roiTwelveMonths >= 0 ? "+" : ""}${number(result.roiTwelveMonths, formatLocale)} %`}</strong></div>
            <div className="rrt-stat-card"><span>{english ? "Additional revenue/year" : "CA supplémentaire/an"}</span><strong>{result ? `+${money(result.extraRevenue * 12, formatLocale)}` : "—"}</strong></div>
            <div className="rrt-stat-card"><span>{english ? "Additional sales/month" : "Ventes en plus/mois"}</span><strong>{result ? `+${number(result.extraSales, formatLocale)}` : "—"}</strong></div>
            <div className="rrt-stat-card"><span>{english ? "Additional sales/year" : "Ventes en plus/an"}</span><strong>{result ? `+${number(result.extraSales * 12, formatLocale)}` : "—"}</strong></div>
            <div className="rrt-stat-card"><span>{english ? "Conversion improvement" : "Progression du taux"}</span><strong>{result ? `+${number((result.afterRate / result.currentRate - 1) * 100, formatLocale)} %` : "—"}</strong></div>
            <div className="rrt-stat-card"><div className="rrt-stat-heading"><span>{english ? "Estimated payback" : "Délai de retour estimé"}</span><button type="button" className="rrt-info" aria-label={english ? "How is payback calculated?" : "Comment le délai de retour est-il calculé ?"}><Info size={14} /><span className="rrt-info-tip">{english ? "Estimated from the $2,000 service cost and additional monthly revenue." : "Estimé à partir du coût de prestation de 1 765 € et du CA supplémentaire mensuel."}</span></button></div><strong>{result?.paybackMonths == null ? "—" : `${number(result.paybackMonths, formatLocale)} ${english ? "months" : "mois"}`}</strong></div>
          </div>
          {result?.alreadyHigh && <div className="rrt-high" role="status"><strong>{english ? "Your conversion rate is already very high" : "Votre taux de conversion est déjà très élevé"}</strong></div>}
        </div>
        <div className="rrt-cta-wrap"><Cta href="#" className="rrt-site-cta" onClick={(event: React.MouseEvent<HTMLAnchorElement>) => { event.preventDefault(); if (result) setBookingOpen(true); else { setSearchOpen(true); setSearchStep("domain"); } }}>{result?.alreadyHigh ? (english ? "Discuss my website" : "Échanger sur mon site") : result ? (english ? `Claim ${money(result.extraRevenue, formatLocale)}/month` : `Récupérer mes ${money(result.extraRevenue, formatLocale)} / mois`) : (english ? "Estimate my potential" : "Estimer mon potentiel")}</Cta></div>
      </div>
    </div>
    <p className="rrt-disclaimer">{english ? "Illustrative scenario, not a guarantee of conversions or revenue. ROI assumes a $2,000 redesign service. Sector and visitor quality rates are modelling assumptions." : "Cette simulation est une estimation, sans garantie de conversions ni de chiffre d’affaires. Le ROI suppose une prestation de refonte à 1 765 €. Les taux par domaine et qualification sont des hypothèses de calcul."}</p>
    <div className="rrt-share"><ResourceShare url={pageUrl} title={english ? "Website redesign ROI estimator" : "Simulateur ROI de refonte de site"} locale={locale} /></div>
    {bookingOpen && <div className="rrt-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setBookingOpen(false); }}><div role="dialog" aria-modal="true" aria-label={english ? "Book a call" : "Réserver un appel"}><button className="rrt-modal-close" type="button" aria-label={english ? "Close" : "Fermer"} onClick={() => setBookingOpen(false)}><X /></button><iframe title={english ? "Cal.com booking" : "Réservation Cal.com"} src={`https://cal.com/ruffagency/discovery-call?embed=true&layout=month_view&theme=light&lang=${locale}`} allow="camera; microphone; fullscreen" /></div></div>}
  </>;
}
