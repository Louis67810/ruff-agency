"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import "./ContentPageRealisationsSlug.css";

const CTA_DECORATION_1 = {
  src: "https://framerusercontent.com/images/aONP6DTlxxTAGxNKuzFV84mvpA.png?width=1331&height=884",
  srcSet: "https://framerusercontent.com/images/aONP6DTlxxTAGxNKuzFV84mvpA.png?scale-down-to=512&width=1331&height=884 512w,https://framerusercontent.com/images/aONP6DTlxxTAGxNKuzFV84mvpA.png?scale-down-to=1024&width=1331&height=884 1024w,https://framerusercontent.com/images/aONP6DTlxxTAGxNKuzFV84mvpA.png?width=1331&height=884 1331w"
};
const CTA_DECORATION_2 = {
  src: "https://framerusercontent.com/images/RyWM4bax5mzqIS95PvmCIH54M.png?width=1071&height=854",
  srcSet: "https://framerusercontent.com/images/RyWM4bax5mzqIS95PvmCIH54M.png?scale-down-to=512&width=1071&height=854 512w,https://framerusercontent.com/images/RyWM4bax5mzqIS95PvmCIH54M.png?scale-down-to=1024&width=1071&height=854 1024w,https://framerusercontent.com/images/RyWM4bax5mzqIS95PvmCIH54M.png?width=1071&height=854 1071w"
};
const LOTTIE_URL = "https://framerusercontent.com/assets/7Us0KKzHO2n8Jsf36VlImXFCQQ.json";

const DEFAULT_COPY = {
  about: "Transformez vos visiteurs en clients et renforcez votre crédibilité grâce à une landing page premium, optimisée pour la conversion.",
  review: "Lorem ipsum dolor sit amet. Nam voluptas alias vel tenetur rerum aut adipisci eaque. Non assumenda voluptas sed maiores voluptate ut facere error. Qui quidem officia est reprehenderit necessitatibus aut quod molestias qui ullam quaerat.",
  personName: "Louis",
  personRole: "Lorem ipsum",
  challengeSubtitle: "Avant ce projet, Scall présentait son travail sur Behance, une plateforme peu adaptée pour construire une image professionnelle et différenciante. Il fallait créer un site à la hauteur de son univers artistique.",
  challenge1: "Mettre en valeur ses réalisations",
  challenge2: "Se démarquer dans un univers très concurrentiel",
  challenge3: "Renforcer la crédibilité professionnelle",
  challenge4: "Clarifier ses services",
  solutionSubtitle: "Nous avons conçu un site premium, pensé comme une vitrine artistique et professionnelle.",
  solution1: "Une page dédiée à la valorisation des projets",
  solution2: "Une présentation claire des services",
  solution3: "Un design artistique et premium",
  solution4: "Une expérience fluide et cohérente",
  resultsSubtitle: "Ce nouveau site a permis à Scall de franchir un cap dans sa communication.",
  result1: "Une image de marque professionnalisée",
  result2: "Une meilleure visibilité",
  result3: "Une hausse des demandes de contact",
  result4: ""
};

function sourceImage(value) {
  if (!value) return null;
  if (typeof value === "string") return { src: value };
  if (typeof value === "object" && value.src) return value;
  return null;
}

function usePhone() {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 809px)");
    const update = () => setPhone(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return phone;
}

function AnimatedLines({ children, className = "" }) {
  const measureRef = useRef(null);
  const [lines, setLines] = useState([String(children)]);
  useLayoutEffect(() => {
    const node = measureRef.current;
    if (!node) return;
    const measure = () => {
      const spans = [...node.querySelectorAll("[data-word]")];
      if (!spans.length) return;
      const grouped = [];
      for (const span of spans) {
        const top = Math.round(span.offsetTop);
        let row = grouped.find((x) => x.top === top);
        if (!row) grouped.push((row = { top, words: [] }));
        row.words.push(span.textContent);
      }
      const next = grouped.sort((a,b)=>a.top-b.top).map((x)=>x.words.join(" "));
      if (next.length) setLines(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => ro.disconnect();
  }, [children]);
  const words = String(children).split(/\s+/);
  return (
    <div className={`cprs-animated-lines ${className}`}>
      <div className="cprs-line-measure" ref={measureRef} aria-hidden="true">
        {words.map((w,i)=><React.Fragment key={i}><span data-word>{w}</span>{i<words.length-1?" ":null}</React.Fragment>)}
      </div>
      <div className="cprs-line-visible">
        {lines.map((line,i)=>(
          <motion.span key={`${line}-${i}`} className="cprs-line"
            initial={{ filter:"blur(10px)", opacity:0.001, y:10 }}
            animate={{ filter:"blur(0px)", opacity:1, y:0 }}
            transition={{ type:"spring", bounce:0, duration:0.5, delay:0.6 + i * 0.15 }}>
            {line}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function Availability() {
  const ref = useRef(null);
  const dateData = useMemo(() => {
    const now = new Date();
    const month = now.toLocaleDateString("fr-FR", { month: "long" });
    const totalDays = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
    const number = Math.ceil(6 - ((now.getDate()-1) / totalDays) * 5);
    return { month, number };
  }, []);
  useEffect(() => {
    if (!ref.current) return;
    let destroyed = false;
    let animation;
    import("lottie-web").then((module) => {
      if (destroyed || !ref.current) return;
      const lottie = module.default || module;
      animation = lottie.loadAnimation({ container: ref.current, renderer:"svg", loop:true, autoplay:true, path:LOTTIE_URL });
      animation.setSpeed(1);
    }).catch(() => {});
    return () => { destroyed = true; animation?.destroy?.(); };
  }, []);
  return (
    <motion.div className="cprs-availability" initial={{opacity:0.001,y:35}} animate={{opacity:1,y:0}} transition={{type:"spring",bounce:0.2,duration:0.4}}>
      <div className="cprs-lottie-crop"><div className="cprs-lottie" ref={ref}/></div>
      <div className="cprs-availability-text"><span className="cprs-number">{dateData.number}</span><span>places restantes pour {dateData.month}</span></div>
    </motion.div>
  );
}

function ChevronRight() {
  return <svg className="cprs-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M 0 12 L 6 6 L 0 0" transform="translate(9 6)" fill="transparent" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function SiteButton({ href }) {
  if (!href) return null;
  return <a className="cprs-site-cta" href={href}><span>Voir le site en direct</span><ChevronRight/></a>;
}
function CallButton({ href="#" }) {
  return <a className="cprs-call-shell" href={href}><span className="cprs-call-inner">Réserver un appel</span></a>;
}

function XIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M 12 0 L 0 12" transform="translate(6 6)" fill="transparent" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M 0 0 L 12 12" transform="translate(6 6)" fill="transparent" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function CheckIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M 16 0 L 5 11 L 0 6" transform="translate(4 6)" fill="transparent" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function RIcon() {
  return <svg viewBox="0 0 34 34" aria-hidden="true"><rect width="34" height="34" rx="17" fill="#0147FF"/><path d="M11 17.3356V24.4692L13.294 24.1614L15.0361 23.9299V19.8082H16.3502C17.4765 19.7581 18.1773 19.633 18.8156 19.3326L21.1122 19.4006L21.6628 18.8249C22.7141 17.7486 23.1646 16.1217 22.9018 14.3946C22.5764 12.1669 21.309 9.47533 19.1188 8.99976L14.7076 9.59194L11 10.0891V17.3356ZM17.8051 13.8627C18.2118 14.2694 18.168 15.5209 17.8051 15.9715C17.5923 16.2343 17.2262 16.3219 16.3502 16.3595H15.0361V15.2832V13.4403H16.3502C17.0886 13.4403 17.5704 13.628 17.8051 13.8627Z" fill="white"/></svg>;
}

function InfoRow({ type, children }) {
  return <div className={`cprs-info-row cprs-${type}`}><div className="cprs-info-icon">{type==="challenge"?<XIcon/>:type==="solution"?<RIcon/>:<CheckIcon/>}</div><div className="cprs-info-title">{children}</div></div>;
}

function GalleryImage({ value, label }) {
  const image = sourceImage(value);
  if (!image) return null;
  return (
    <div className="cprs-gallery-image">
      <img src={image.src} srcSet={image.srcSet} sizes={image.sizes} alt={image.alt||""}/>
      {label ? <div className="cprs-before-after">{label}</div> : null}
    </div>
  );
}

export default function ContentPageRealisationsSlug({
  logo,
  about = DEFAULT_COPY.about,
  siteHref,
  review = DEFAULT_COPY.review,
  profilePhoto,
  personName = DEFAULT_COPY.personName,
  personRole = DEFAULT_COPY.personRole,
  challengeSubtitle = DEFAULT_COPY.challengeSubtitle,
  challenge1 = DEFAULT_COPY.challenge1,
  challenge2 = DEFAULT_COPY.challenge2,
  challenge3 = DEFAULT_COPY.challenge3,
  challenge4 = DEFAULT_COPY.challenge4,
  solutionSubtitle = DEFAULT_COPY.solutionSubtitle,
  solution1 = DEFAULT_COPY.solution1,
  solution2 = DEFAULT_COPY.solution2,
  solution3 = DEFAULT_COPY.solution3,
  solution4 = DEFAULT_COPY.solution4,
  resultsSubtitle = DEFAULT_COPY.resultsSubtitle,
  result1 = DEFAULT_COPY.result1,
  result2 = DEFAULT_COPY.result2,
  result3 = DEFAULT_COPY.result3,
  result4 = DEFAULT_COPY.result4,
  photos = [],
  visibiliteAvantApres = false,
  callHref = "#",
  className = ""
}) {
  const isPhone = usePhone();
  const logoImage = sourceImage(logo);
  const profile = sourceImage(profilePhoto);
  const challengeItems = [challenge1,challenge2,challenge3,challenge4];
  const solutionItems = [solution1,solution2,solution3,solution4];
  const resultItems = [result1,result2,result3,result4].filter((x,i)=>i<3 || Boolean(x));
  const showBeforeAfter = !visibiliteAvantApres;
  return (
    <section className={`cprs-root ${className}`}>
      <div className="cprs-layout">
        <aside className="cprs-sidebar">
          <div className="cprs-about">
            {logoImage ? <img className="cprs-logo" src={logoImage.src} srcSet={logoImage.srcSet} sizes="81px" alt={logoImage.alt||""}/> : null}
            <AnimatedLines className="cprs-about-copy">{about}</AnimatedLines>
            <SiteButton href={siteHref}/>
          </div>

          {review ? <div className="cprs-review-card">
            <motion.div className="cprs-review-person" initial={{opacity:0.001,y:36}} animate={{opacity:1,y:0}} transition={{type:"spring",bounce:0.2,delay:1.4,duration:0.4}}>
              {profile ? <img className="cprs-profile" src={profile.src} srcSet={profile.srcSet} sizes="63px" alt={profile.alt||""}/> : <div className="cprs-profile cprs-profile-empty"/>}
              <div className="cprs-person-copy"><div className="cprs-person-name">{personName}</div><div className="cprs-person-role">{personRole}</div></div>
            </motion.div>
            <div className="cprs-review-copy">{review}</div>
          </div> : null}

          <div className="cprs-blue-card">
            <svg className="cprs-vector-675" viewBox="-75 -75 1578 2104" fill="none" aria-hidden="true"><path d="M316.78 185.701L656.237 396.965L892.48 551.955C1001.92 623.751 1034.41 769.562 965.806 881.029L602.489 1471.38C577.068 1512.69 525.851 1530.06 480.544 1512.74C459.264 1504.61 441.363 1489.51 429.755 1469.91L407.16 1431.75C385.74 1395.58 378.804 1352.64 387.745 1311.57C414.801 1187.28 565.639 1138.07 660.787 1222.49L669.256 1230C677.849 1237.62 685.661 1246.08 692.577 1255.26L749.182 1330.32C774.841 1364.35 791.056 1404.56 796.184 1446.87L810.223 1562.7C816.142 1611.53 807.032 1661.02 784.106 1704.54L670.387 1920.46" stroke="url(#cprs-g1)" strokeOpacity="0.07" strokeWidth="148.009"/><defs><linearGradient id="cprs-g1" x1="1036.45" y1="909.756" x2="573.586" y2="524.554" gradientUnits="userSpaceOnUse"><stop offset="0.0398851" stopColor="white"/><stop offset="1" stopColor="white" stopOpacity="0"/></linearGradient></defs></svg>
            <div className="cprs-blue-copy">
              <Availability/>
              <div className="cprs-blue-title">On créé des World-class Landings pages et Sites</div>
            </div>
            <svg className="cprs-vector-674" viewBox="-75 -75 1905 1053" fill="none" aria-hidden="true"><path d="M1755 335.216L1444.33 586.907L1220.6 759.466C1116.96 839.401 968.541 822.415 885.641 721.131L446.585 184.713C415.864 147.18 416.198 93.0975 447.381 55.947C462.028 38.4976 482.149 26.5188 504.47 21.9603L547.917 13.0873C589.105 4.67565 631.951 12.1645 667.844 34.0489C776.448 100.266 773.62 258.904 662.725 321.209L652.854 326.755C642.839 332.382 632.289 336.997 621.359 340.533L531.906 369.472C491.356 382.591 448.06 384.764 406.399 375.772L292.35 351.156C244.262 340.777 200.481 315.983 166.846 280.083L0 102" stroke="url(#cprs-g2)" strokeOpacity="0.05" strokeWidth="148.009"/><defs><linearGradient id="cprs-g2" x1="835.39" y1="778.492" x2="1350.79" y2="467.072" gradientUnits="userSpaceOnUse"><stop offset="0.0398851" stopColor="white"/><stop offset="1" stopColor="white" stopOpacity="0"/></linearGradient></defs></svg>
            <CallButton href={callHref}/>
            <div className="cprs-blue-decorations">
              <img className="cprs-decor-1" src={CTA_DECORATION_1.src} srcSet={CTA_DECORATION_1.srcSet} sizes="293px" alt=""/>
              <img className="cprs-decor-2" src={CTA_DECORATION_2.src} srcSet={CTA_DECORATION_2.srcSet} sizes="206px" alt=""/>
            </div>
          </div>
        </aside>

        <div className="cprs-main">
          <div className="cprs-content">
            <section className="cprs-copy-section">
              <div className="cprs-section-intro"><h2>Le challenge</h2><p>{challengeSubtitle}</p></div>
              <div className="cprs-list cprs-challenge-list">
                {challengeItems.map((item,i)=>( (!isPhone || i>1 || Boolean(item)) ? <InfoRow type="challenge" key={i}>{item}</InfoRow> : null))}
              </div>
            </section>

            <section className="cprs-copy-section">
              <div className="cprs-section-intro"><h2>La solution</h2><p>{solutionSubtitle}</p></div>
              <div className="cprs-list cprs-solution-list">{solutionItems.map((item,i)=><InfoRow type="solution" key={i}>{item}</InfoRow>)}</div>
            </section>

            <section className="cprs-copy-section">
              <div className="cprs-section-intro"><h2>Les résultats</h2><p>{resultsSubtitle}</p></div>
              <div className="cprs-list cprs-results-list">{resultItems.map((item,i)=><InfoRow type="result" key={i}>{item}</InfoRow>)}</div>
            </section>
          </div>

          <div className="cprs-gallery">
            {photos.map((photo,i)=><GalleryImage key={i} value={photo} label={(i===0&&showBeforeAfter)?"Avant":(i===1&&showBeforeAfter)?"Après":null}/>) }
          </div>
        </div>
      </div>
    </section>
  );
}
