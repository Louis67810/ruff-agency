"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import "../ContentPageRealisationsSlug/ContentPageRealisationsSlug.css";
import "./RessourceArticle.css";

const CTA_DECORATION_1 = {
  src: "https://framerusercontent.com/images/aONP6DTlxxTAGxNKuzFV84mvpA.png?width=1331&height=884",
  srcSet: "https://framerusercontent.com/images/aONP6DTlxxTAGxNKuzFV84mvpA.png?scale-down-to=512&width=1331&height=884 512w,https://framerusercontent.com/images/aONP6DTlxxTAGxNKuzFV84mvpA.png?scale-down-to=1024&width=1331&height=884 1024w,https://framerusercontent.com/images/aONP6DTlxxTAGxNKuzFV84mvpA.png?width=1331&height=884 1331w"
};
const CTA_DECORATION_2 = {
  src: "https://framerusercontent.com/images/RyWM4bax5mzqIS95PvmCIH54M.png?width=1071&height=854",
  srcSet: "https://framerusercontent.com/images/RyWM4bax5mzqIS95PvmCIH54M.png?scale-down-to=512&width=1071&height=854 512w,https://framerusercontent.com/images/RyWM4bax5mzqIS95PvmCIH54M.png?scale-down-to=1024&width=1071&height=854 1024w,https://framerusercontent.com/images/RyWM4bax5mzqIS95PvmCIH54M.png?width=1071&height=854 1071w"
};
const LOTTIE_URL = "https://framerusercontent.com/assets/7Us0KKzHO2n8Jsf36VlImXFCQQ.json";

function sourceImage(value) {
  if (!value) return null;
  if (typeof value === "string") return { src: value };
  if (typeof value === "object" && value.src) return value;
  return null;
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

function CallButton({ href = "#" }) {
  return <a className="cprs-call-shell" href={href}><span className="cprs-call-inner">Réserver un appel</span></a>;
}

export default function RessourceArticle({
  about = "",
  authorPhoto,
  authorName = "",
  authorRole = "",
  authorBio = "",
  contentBlocks = [],
  callHref = "#",
  realisationsHref = "/realisations",
  projects = [],
  className = ""
}) {
  const profile = sourceImage(authorPhoto);
  return (
    <section className={`cprs-root cprs-root-article ${className}`}>
      <div className="cprs-layout">
        <aside className="cprs-sidebar">
          {about ? (
            <div className="cprs-about">
              <AnimatedLines className="cprs-about-copy">{about}</AnimatedLines>
            </div>
          ) : null}

          {projects.length ? (
            <a className="cprs-projects-card" href={realisationsHref}>
              <div className="cprs-projects-thumbs">
                {projects.slice(0, 3).map((project) => {
                  const src = typeof project.image === "string" ? project.image : project.image?.src;
                  return <img key={project.id ?? project.slug} className="cprs-projects-thumb" src={src} alt={project.imageAlt || project.title || ""} loading="lazy" />;
                })}
              </div>
              <span className="cprs-projects-label">Voir nos réalisations</span>
            </a>
          ) : null}

          <div className="cprs-blue-card">
            <svg className="cprs-vector-675" viewBox="-75 -75 1578 2104" fill="none" aria-hidden="true"><path d="M316.78 185.701L656.237 396.965L892.48 551.955C1001.92 623.751 1034.41 769.562 965.806 881.029L602.489 1471.38C577.068 1512.69 525.851 1530.06 480.544 1512.74C459.264 1504.61 441.363 1489.51 429.755 1469.91L407.16 1431.75C385.74 1395.58 378.804 1352.64 387.745 1311.57C414.801 1187.28 565.639 1138.07 660.787 1222.49L669.256 1230C677.849 1237.62 685.661 1246.08 692.577 1255.26L749.182 1330.32C774.841 1364.35 791.056 1404.56 796.184 1446.87L810.223 1562.7C816.142 1611.53 807.032 1661.02 784.106 1704.54L670.387 1920.46" stroke="url(#ra-g1)" strokeOpacity="0.07" strokeWidth="148.009"/><defs><linearGradient id="ra-g1" x1="1036.45" y1="909.756" x2="573.586" y2="524.554" gradientUnits="userSpaceOnUse"><stop offset="0.0398851" stopColor="white"/><stop offset="1" stopColor="white" stopOpacity="0"/></linearGradient></defs></svg>
            <div className="cprs-blue-copy">
              <Availability/>
              <div className="cprs-blue-title">On créé des World-class Landings pages et Sites</div>
            </div>
            <svg className="cprs-vector-674" viewBox="-75 -75 1905 1053" fill="none" aria-hidden="true"><path d="M1755 335.216L1444.33 586.907L1220.6 759.466C1116.96 839.401 968.541 822.415 885.641 721.131L446.585 184.713C415.864 147.18 416.198 93.0975 447.381 55.947C462.028 38.4976 482.149 26.5188 504.47 21.9603L547.917 13.0873C589.105 4.67565 631.951 12.1645 667.844 34.0489C776.448 100.266 773.62 258.904 662.725 321.209L652.854 326.755C642.839 332.382 632.289 336.997 621.359 340.533L531.906 369.472C491.356 382.591 448.06 384.764 406.399 375.772L292.35 351.156C244.262 340.777 200.481 315.983 166.846 280.083L0 102" stroke="url(#ra-g2)" strokeOpacity="0.05" strokeWidth="148.009"/><defs><linearGradient id="ra-g2" x1="835.39" y1="778.492" x2="1350.79" y2="467.072" gradientUnits="userSpaceOnUse"><stop offset="0.0398851" stopColor="white"/><stop offset="1" stopColor="white" stopOpacity="0"/></linearGradient></defs></svg>
            <CallButton href={callHref}/>
            <div className="cprs-blue-decorations">
              <img className="cprs-decor-1" src={CTA_DECORATION_1.src} srcSet={CTA_DECORATION_1.srcSet} sizes="293px" alt=""/>
              <img className="cprs-decor-2" src={CTA_DECORATION_2.src} srcSet={CTA_DECORATION_2.srcSet} sizes="206px" alt=""/>
            </div>
          </div>
        </aside>

        <div className="cprs-main">
          <div className="ra-article">
            {contentBlocks.map((block, i) => {
              if (block.type === "heading") return <h2 key={i}>{block.text}</h2>;
              if (block.type === "image") return <img key={i} className="ra-image" src={block.src} alt={block.alt || ""} loading="lazy" />;
              return <p key={i}>{block.text}</p>;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
