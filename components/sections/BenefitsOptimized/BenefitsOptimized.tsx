"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { localizeHref } from "@/lib/i18n";

export interface BenefitsOptimizedProps {
  bookingHref?: string;
  className?: string;
  locale?: "fr" | "en";
}

type CaseVariant =
  | "b0Pu6QCvO"
  | "V5Wh7855Z"
  | "N4z3YzW4M"
  | "lxULhvTaN"
  | "lScI4MQ5L"
  | "E_Q5KywxY";

const CASE_CLASS: Record<CaseVariant, string> = {
  b0Pu6QCvO: "framer-v-gh94k5",
  V5Wh7855Z: "framer-v-hn0usg",
  N4z3YzW4M: "framer-v-119ers5",
  lxULhvTaN: "framer-v-kw2k40",
  lScI4MQ5L: "framer-v-m18k6j",
  E_Q5KywxY: "framer-v-yfqlqr",
};

const CASE_SVGS: Record<string, string> = {
  "framer-imzg4g":
    '<svg width="463" height="335" viewBox="0 0 463 335" fill="none" xmlns="http://www.w3.org/2000/svg">\n<rect x="1.31142" y="1.16787" width="13.9223" height="14.6088" fill="white" stroke="#0147FF" stroke-width="2.33574"/>\n<rect x="1.31142" y="318.598" width="13.9223" height="14.6088" fill="white" stroke="#0147FF" stroke-width="2.33574"/>\n<rect x="447.865" y="317.468" width="13.9223" height="14.6088" fill="white" stroke="#0147FF" stroke-width="2.33574"/>\n<rect x="447.865" y="3.14492" width="13.9223" height="14.6088" fill="white" stroke="#0147FF" stroke-width="2.33574"/>\n<line x1="455.952" y1="18.0742" x2="455.952" y2="316.3" stroke="#0147FF" stroke-width="1.16787"/>\n<line x1="8.3144" y1="16.9448" x2="8.31442" y2="317.43" stroke="#0147FF" stroke-width="1.16787"/>\n<line x1="446.697" y1="325.923" x2="16.4015" y2="325.923" stroke="#0147FF" stroke-width="1.16787"/>\n<line x1="446.697" y1="9.62104" x2="16.4015" y2="9.62104" stroke="#0147FF" stroke-width="1.16787"/>\n</svg>\n',
  "framer-1nt377z":
    '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\n<path d="M5.17627 7.04651C14.1426 7.04651 19.1697 7.04651 28.1361 7.04651" stroke="black" stroke-width="1.91332"/>\n<path d="M5.17627 14.6998C9.65945 14.6998 12.173 14.6998 16.6562 14.6998" stroke="black" stroke-width="1.91332"/>\n<path d="M5.17627 22.353C9.65945 22.353 12.173 22.353 16.6562 22.353" stroke="black" stroke-width="1.91332"/>\n</svg>\n',
  "framer-97g3ku":
    '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\n<path d="M6 8C13.472 8 17.6612 8 25.1332 8" stroke="black" stroke-width="1.91332"/>\n<path d="M10.7837 15.6533C14.5197 15.6533 16.6143 15.6533 20.3503 15.6533" stroke="black" stroke-width="1.91332"/>\n<path d="M10.7837 23.3065C14.5197 23.3065 16.6143 23.3065 20.3503 23.3065" stroke="black" stroke-width="1.91332"/>\n</svg>\n',
  "framer-c1pbid":
    '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\n<path d="M6 8C13.472 8 17.6612 8 25.1332 8" stroke="black" stroke-width="1.91332"/>\n<path d="M15.5664 15.6532C19.3024 15.6532 21.397 15.6532 25.133 15.6532" stroke="black" stroke-width="1.91332"/>\n<path d="M15.5664 23.3065C19.3024 23.3065 21.397 23.3065 25.133 23.3065" stroke="black" stroke-width="1.91332"/>\n</svg>\n',
};

function SvgSlot({ className }: { className: string }) {
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: CASE_SVGS[className] ?? "" }}
    />
  );
}

function useInView<T extends HTMLElement>(threshold: number, once: boolean) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, threshold]);

  return { ref, visible };
}

function AnimatedHeading() {
  const english = useLocale() === "en";
  const muted = english
    ? ["Everything", "you", "need", "to"]
    : ["Tout", "ce", "dont", "vous", "avez", "besoin", "pour"];
  const strong = english
    ? ["grow", "your", "business"]
    : ["faire", "croître", "votre", "business"];

  return (
    <h2>
      {muted.map((word, index) => (
        <React.Fragment key={`muted-${word}-${index}`}>
          <span className="headingWord">{word}</span>{" "}
        </React.Fragment>
      ))}
      <span className="headingStrong">
        {strong.map((word, index) => (
          <React.Fragment key={`strong-${word}-${index}`}>
            <span className="headingWord">{word}</span>
            {index < strong.length - 1 ? " " : ""}
          </React.Fragment>
        ))}
      </span>
    </h2>
  );
}

function CaseInteractive() {
  const english = useLocale() === "en";
  const [variant, setVariant] = useState<CaseVariant>("b0Pu6QCvO");
  const isPhoneVariant =
    variant === "lxULhvTaN" ||
    variant === "lScI4MQ5L" ||
    variant === "E_Q5KywxY";

  useEffect(() => {
    const query = window.matchMedia("(max-width: 809px)");
    const sync = () =>
      setVariant((current) => {
        const phone =
          current === "lxULhvTaN" ||
          current === "lScI4MQ5L" ||
          current === "E_Q5KywxY";
        if (query.matches && !phone) return "lxULhvTaN";
        if (!query.matches && phone) return "b0Pu6QCvO";
        return current;
      });
    sync();
    query.addEventListener?.("change", sync);
    return () => query.removeEventListener?.("change", sync);
  }, []);

  const selectCase = (side: "left" | "center" | "right") => {
    if (isPhoneVariant) {
      setVariant(
        side === "left"
          ? "lScI4MQ5L"
          : side === "right"
            ? "E_Q5KywxY"
            : "lxULhvTaN",
      );
    } else {
      setVariant(
        side === "left"
          ? "V5Wh7855Z"
          : side === "right"
            ? "N4z3YzW4M"
            : "b0Pu6QCvO",
      );
    }
  };

  return (
    <div
      className={`framer-zCdZt framer-gh94k5 ${CASE_CLASS[variant]}`}
      style={{ width: "100%", height: isPhoneVariant ? "auto" : "100%" }}
    >
      <div className="framer-xzorfx">
        <div className="framer-qa9ace">
          <div className="framer-1r1j7vb"></div>
          <div className="framer-1erit0t"></div>
          <div className="framer-abc72n">
            <div className="framer-1cuhozw"></div>
            <div className="framer-1cry4b3"></div>
          </div>
          <div className="framer-1x8rcrt"></div>
          <div className="framer-1g04b7p"></div>
          <div className="framer-1r0d6px"></div>
          <div className="framer-rggxt6"></div>
          <div className="framer-iyfsru"></div>
        </div>
        <SvgSlot className="framer-imzg4g" />
        <div className="framer-1osqz2v">
          <div className="framer-wl761k"></div>
          <div className="framer-ork5s4"></div>
          <div className="framer-1sgzsvs">
            <div className="framer-1lv7u9z"></div>
            <div className="framer-1jvb0e2"></div>
            <div className="framer-4klb85"></div>
            <div className="framer-17utdcr"></div>
            <div className="framer-1wyzc2f"></div>
            <div className="framer-1w36gka"></div>
          </div>
          <div className="framer-yffa6f"></div>
        </div>
        <div className="framer-7o008v">
          <div className="framer-kf6trh"></div>
          <div className="framer-5hor3v"></div>
          <div className="framer-18hcq52">
            <div className="framer-51bo3o"></div>
            <div className="framer-1vlmtbd"></div>
            <div className="framer-1bt4i3a"></div>
            <div className="framer-1aasu2t"></div>
            <div className="framer-uu5uqy"></div>
            <div className="framer-qx9vs7"></div>
          </div>
          <div className="framer-6ip1yx"></div>
        </div>
        <div className="framer-nlx5ap">
          <div className="framer-1lhgpn2">
            <p>
              A<span>a</span>
            </p>
          </div>
        </div>
        <div className="framer-1q12s5m">
          <div className="framer-43mmgm">
            <div className="framer-1h07ia5"></div>
          </div>
          <div className="framer-4590v"></div>
          <div className="framer-bng336"></div>
          <div className="framer-1coywbo"></div>
          <div className="framer-1emza3g"></div>
        </div>
        <div className="framer-2dovbc">
          <button
            type="button"
            aria-label="Style gauche"
            className="framer-1rhbe3q"
            onClick={() => selectCase("left")}
          >
            <SvgSlot className="framer-1nt377z" />
          </button>
          <button
            type="button"
            aria-label="Style centré"
            className="framer-ewztt2"
            onClick={() => selectCase("center")}
          >
            <SvgSlot className="framer-97g3ku" />
          </button>
          <button
            type="button"
            aria-label="Style droite"
            className="framer-1rtzczk"
            onClick={() => selectCase("right")}
          >
            <SvgSlot className="framer-c1pbid" />
          </button>
          <div className="framer-fyldxt"></div>
          <div className="framer-rb6dh8"></div>
        </div>
      </div>
      <div className="framer-8gvlqf">
        <div className="framer-6rlgom">
          <p>
            {english
              ? "Stand out from the competition"
              : "Démarquez vous de la concurrence"}
          </p>
        </div>
        <div className="framer-xob6zl">
          <p>
            {english
              ? "With premium design that truly reflects your positioning."
              : "Avec un design premium qui reflète réellement votre positionnement."}
          </p>
        </div>
      </div>
    </div>
  );
}

function BookingCta({ href, english }: { href: string; english: boolean }) {
  return (
    <a className="benefitsCta" href={href}>
      <span className="benefitsCtaInner">
        <span className="benefitsCtaText">
          {english ? "Book a call" : "Réserver un appel"}
        </span>
        <span className="benefitsCtaAvatarWrap">
          <img
            className="benefitsCtaAvatar"
            src="https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693"
            alt={
              english
                ? "Profile photo of Louis Staub"
                : "Photo de profil de Louis Staub"
            }
          />
        </span>
      </span>
    </a>
  );
}

export default function BenefitsOptimized({
  bookingHref = "#",
  className = "",
  locale,
}: BenefitsOptimizedProps) {
  const english = (locale ?? useLocale()) === "en";
  bookingHref = localizeHref(bookingHref, english ? "en" : "fr") || "#";
  const headingReveal = useInView<HTMLDivElement>(0, true);
  const ctaReveal = useInView<HTMLDivElement>(0.5, false);
  return (
    <section className={`framer-3frdU framer-wit1zi ${className}`}>
      <div className="framer-16lf1bg">
        <div className="framer-99078z">
          <div className="framer-yh70c">
            <div className="framer-190ikna">
              <div
                ref={headingReveal.ref}
                className={`framer-u844pr ${headingReveal.visible ? "visible" : ""}`}
              >
                <AnimatedHeading />
              </div>
              <div
                ref={ctaReveal.ref}
                className={`framer-1w52cg2-container ${ctaReveal.visible ? "visible" : ""}`}
              >
                <BookingCta href={bookingHref} english={english} />
              </div>
            </div>
          </div>
        </div>

        <div className="framer-3t8agc">
          <div className="framer-br6sth">
            <article className="framer-jp9aoj">
              <div className="framer-1cl97ws">
                <div
                  className="framer-1db1csp"
                  role="img"
                  aria-label={
                    english
                      ? "Illustration of turning a visitor into a customer"
                      : "Illustration d'une transformation de visiteur en client"
                  }
                />
              </div>
              <div className="framer-19uj0c1">
                <div className="framer-4xlrff">
                  <p className="cardTitle">
                    {" "}
                    {english
                      ? "Turn visitors into customers"
                      : "Transformez vos visiteurs en clients"}
                  </p>
                </div>
                <div className="framer-1twlf68">
                  <p className="cardBody" style={{ color: "rgba(0,0,0,.6)" }}>
                    {english
                      ? "Every section of your landing page guides attention towards action, without friction."
                      : "Chaque section de votre landing page est pensée pour guider le regard vers l’action, sans friction."}
                  </p>
                </div>
              </div>
              <div className="framer-lylatx" />
            </article>

            <article className="framer-ppc8su">
              <div className="framer-1obr3he">
                <div className="framer-16sem8i">
                  <p className="cardTitle" style={{ color: "white" }}>
                    {english ? "Build trust" : "Inspirez confiance"}
                  </p>
                </div>
                <div className="framer-c01k9r">
                  <p
                    className="cardBody"
                    style={{ color: "rgba(255,255,255,.6)" }}
                  >
                    {english
                      ? "A polished, consistent result that builds confidence from the moment visitors land on the page."
                      : "Un rendu net et cohérent qui rassure dès l’arrivée sur la page."}
                  </p>
                </div>
              </div>
              <div className="framer-ws1lo6" />
            </article>
          </div>

          <div className="framer-1l694m3">
            <div className="framer-1d4gv6m">
              <div className="framer-o0wzvt-container">
                <CaseInteractive />
              </div>
              <article className="framer-3iqtzm">
                <div className="framer-1n7abvt">
                  <div className="framer-jzz6ry">
                    <p className="cardTitle" style={{ color: "white" }}>
                      {english
                        ? "Reach the top of search results"
                        : "Devenez le résultat numéro 1 dans les recherches"}
                    </p>
                  </div>
                  <div className="framer-okvcxv">
                    <p
                      className="cardBody"
                      style={{ color: "rgba(255,255,255,.8)" }}
                    >
                      {english
                        ? "The page structure, headings and content are designed to make your offer easier for search engines to understand."
                        : "La structure de la page, les titres et les contenus sont pensés pour améliorer la lisibilité de votre offre par les moteurs de recherche."}
                    </p>
                  </div>
                </div>
                <div className="framer-1agfffn" />
              </article>
            </div>

            <div className="framer-k6a6w5">
              <article className="framer-kbhskc">
                <div
                  className="framer-5ev6jp"
                  role="img"
                  aria-label={
                    english
                      ? "Page structure illustration"
                      : "Illustration de structure de page"
                  }
                />
                <div className="framer-1sihc94" />
                <div className="framer-nf4h8p">
                  <div className="framer-1dhw1yd">
                    <p className="cardTitle">
                      {english
                        ? "Structure your offer"
                        : "Structurer votre offre"}
                    </p>
                  </div>
                  <div className="framer-57kvaq">
                    <p
                      className="cardBody structureBody"
                      style={{ color: "rgba(0,0,0,.8)" }}
                    >
                      {english
                        ? "Your offer becomes clear, structured and easy to choose."
                        : "Votre proposition devient lisible, hiérarchisée et facile à choisir."}
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
