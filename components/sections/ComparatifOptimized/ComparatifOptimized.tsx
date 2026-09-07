"use client";

import React, {
  CSSProperties,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocale } from "@/components/LocaleProvider";
import { localizeHref } from "@/lib/i18n";
import "./ComparatifOptimized.css";

export type ComparatifOptimizedProps = {
  bookingHref?: string;
  avatarSrc?: string;
  className?: string;
  style?: CSSProperties;
  locale?: "fr" | "en";
};

type ColumnData = {
  title: string;
  positive: boolean;
  items: string[];
};

const COLUMNS: ColumnData[] = [
  {
    title: "Ruff agency",
    positive: true,
    items: [
      "Commence à 1 490€",
      "Design conversion-first",
      "Optimisé conversion",
      "14 jours de livraison",
      "Site facile à prendre en main, vous pouvez le gérez seul",
    ],
  },
  {
    title: "Agence traditionelle",
    positive: false,
    items: [
      "Commence à +5 000€",
      "Design esthétique seul",
      "Résultats variables",
      "2-3 mois de livraison en moyenne",
      "Site complexe : vous êtes dépendant de l'agence",
    ],
  },
  {
    title: "Faire soi-même",
    positive: false,
    items: [
      "+70h de travail",
      "Design générique",
      "Non optimisé",
      "Dépend de vous",
      "Nécessite de vous former au logiciel",
    ],
  },
];

const ENGLISH_COLUMNS: ColumnData[] = [
  {
    title: "Ruff agency",
    positive: true,
    items: [
      "Starting at €1,490",
      "Conversion-first design",
      "Conversion-optimized",
      "Delivered in 14 days",
      "An easy-to-manage site you can run yourself",
    ],
  },
  {
    title: "Traditional agency",
    positive: false,
    items: [
      "Starting at €5,000+",
      "Aesthetic design only",
      "Variable results",
      "2–3 months on average",
      "A complex site: you depend on the agency",
    ],
  },
  {
    title: "Do it yourself",
    positive: false,
    items: [
      "70+ hours of work",
      "Generic design",
      "Not optimized",
      "It all depends on you",
      "You need to learn the software",
    ],
  },
];

const DEFAULT_AVATAR =
  "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?scale-down-to=64&width=693&height=693";

function useInViewOnce<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function Reveal({
  children,
  className = "",
  delay = 0,
  kind = "rise",
  disableOnPhone = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  kind?: "rise" | "title" | "subtitle";
  disableOnPhone?: boolean;
}) {
  const { ref, visible } = useInViewOnce<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`cmp-reveal cmp-reveal--${kind} ${visible ? "is-visible" : ""} ${
        disableOnPhone ? "cmp-reveal--phone-off" : ""
      } ${className}`}
      style={{ "--cmp-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}

function RuffIcon() {
  return (
    <svg
      className="cmp-row-icon"
      viewBox="0 0 34 34"
      fill="none"
      aria-hidden="true"
    >
      <rect width="34" height="34" rx="17" fill="#0147FF" />
      <path
        d="M11 17.3356V24.4692L13.294 24.7769L15.0361 25.0106V22.2415V20.0889H15.9935C16.5355 20.0537 16.7344 20.0889 17.1725 20.527C17.5319 20.8834 17.4614 21.0432 17.9151 22.2415L18.6498 25.4964L21.1127 25.827L24 26.2148L22.7798 22.9205L21.5627 20.2767L21.1122 19.4006L21.6628 18.8249C22.7141 17.7486 23.1646 16.1217 22.9018 14.3946C22.5764 12.1669 21.309 9.47533 19.1188 8.99976L14.7076 9.59194L11 10.0891V17.3356ZM17.8051 13.8627C18.2118 14.2694 18.168 15.5209 17.8051 15.9715C17.5923 16.2343 17.2262 16.3219 16.3502 16.3595H15.0361V15.2832V13.4403H16.3502C17.0886 13.4403 17.5704 13.628 17.8051 13.8627Z"
        fill="white"
      />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      className="cmp-row-icon"
      viewBox="0 0 34 34"
      fill="none"
      aria-hidden="true"
    >
      <rect width="34" height="34" rx="17" fill="black" fillOpacity="0.12" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.7127 11.7167C11.8266 11.603 11.9809 11.5391 12.1418 11.5391C12.3027 11.5391 12.457 11.603 12.5708 11.7167L16.9989 16.1448L21.427 11.7167C21.4826 11.657 21.5496 11.6092 21.6241 11.576C21.6986 11.5428 21.779 11.525 21.8605 11.5235C21.942 11.5221 22.023 11.5371 22.0986 11.5676C22.1742 11.5982 22.2429 11.6436 22.3005 11.7013C22.3582 11.7589 22.4036 11.8276 22.4341 11.9032C22.4647 11.9788 22.4797 12.0598 22.4782 12.1413C22.4768 12.2228 22.459 12.3032 22.4258 12.3777C22.3926 12.4522 22.3448 12.5192 22.2851 12.5748L17.857 17.0029L22.2851 21.431C22.3448 21.4865 22.3926 21.5536 22.4258 21.6281C22.459 21.7025 22.4768 21.7829 22.4782 21.8644C22.4797 21.946 22.4647 22.0269 22.4341 22.1025C22.4036 22.1781 22.3582 22.2468 22.3005 22.3045C22.2429 22.3621 22.1742 22.4076 22.0986 22.4381C22.023 22.4686 21.942 22.4836 21.8605 22.4822C21.779 22.4808 21.6986 22.4629 21.6241 22.4297C21.5496 22.3966 21.4826 22.3487 21.427 22.2891L16.9989 17.861L12.5708 22.2891C12.4557 22.3963 12.3035 22.4547 12.1462 22.4519C11.9889 22.4491 11.8388 22.3854 11.7276 22.2742C11.6164 22.1629 11.5526 22.0129 11.5499 21.8556C11.5471 21.6983 11.6055 21.5461 11.7127 21.431L16.1408 17.0029L11.7127 12.5748C11.599 12.4609 11.5352 12.3066 11.5352 12.1457C11.5352 11.9848 11.599 11.8305 11.7127 11.7167Z"
        fill="black"
      />
    </svg>
  );
}

function BookingButton({
  href,
  avatarSrc,
  english,
}: {
  href: string;
  avatarSrc: string;
  english: boolean;
}) {
  return (
    <a className="cmp-cta-shell" href={href}>
      <span className="cmp-cta-inner">
        <span className="cmp-cta-label">
          {english ? "Book a call" : "Réserver un appel"}
        </span>
        <img
          className="cmp-cta-avatar"
          src={avatarSrc}
          alt={
            english
              ? "Profile photo of Louis Staub"
              : "Photo de profil de Louis Staub"
          }
        />
      </span>
    </a>
  );
}

function CompareColumn({ data }: { data: ColumnData }) {
  return (
    <article className="cmp-column">
      <h3>{data.title}</h3>
      {data.items.map((item) => (
        <React.Fragment key={item}>
          <div className="cmp-separator" />
          <div className="cmp-row">
            {data.positive ? <RuffIcon /> : <CrossIcon />}
            <p>{item}</p>
          </div>
        </React.Fragment>
      ))}
      <div className="cmp-separator" />
    </article>
  );
}

export default function ComparatifOptimized({
  bookingHref = "#",
  avatarSrc = DEFAULT_AVATAR,
  className = "",
  style,
  locale,
}: ComparatifOptimizedProps) {
  const english = (locale ?? useLocale()) === "en";
  bookingHref = localizeHref(bookingHref, english ? "en" : "fr") || "#";
  return (
    <section className={`cmp-section ${className}`} style={style}>
      <div className="cmp-heading">
        <Reveal kind="title" delay={0.1} className="cmp-title-reveal">
          <h2>{english ? "Why choose us?" : "Pourquoi nous choisir ?"}</h2>
        </Reveal>

        <Reveal kind="subtitle" delay={0.75} className="cmp-subtitle-reveal">
          <p>
            {english
              ? "Less guesswork, more clarity: price, timing and results at the centre."
              : "Moins de flou, plus de clarté : prix, délai et résultat au centre."}
          </p>
        </Reveal>

        <Reveal delay={1} className="cmp-cta-reveal">
          <BookingButton
            href={bookingHref}
            avatarSrc={avatarSrc}
            english={english}
          />
        </Reveal>
      </div>

      <div className="cmp-content-wrap">
        <div className="cmp-columns">
          <Reveal
            delay={0.8}
            disableOnPhone
            className="cmp-column-reveal cmp-column-reveal--1"
          >
            <CompareColumn data={(english ? ENGLISH_COLUMNS : COLUMNS)[0]} />
          </Reveal>
          <Reveal
            delay={1}
            disableOnPhone
            className="cmp-column-reveal cmp-column-reveal--2"
          >
            <CompareColumn data={(english ? ENGLISH_COLUMNS : COLUMNS)[1]} />
          </Reveal>
          <Reveal
            delay={1.2}
            disableOnPhone
            className="cmp-column-reveal cmp-column-reveal--3"
          >
            <CompareColumn data={(english ? ENGLISH_COLUMNS : COLUMNS)[2]} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
