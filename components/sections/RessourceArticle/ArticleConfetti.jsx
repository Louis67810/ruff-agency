"use client";

import React, { useEffect, useRef } from "react";
import { Confetti } from "../../magicui/confetti";

const COLORS = ["#0057ff", "#00d66b", "#ffd000", "#ff3d71", "#a855f7", "#14d9ff"];

export default function ArticleConfetti({ triggerRef }) {
  const confettiRef = useRef(null);

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let hasFired = false;
    let timer;
    const fireSideCannons = () => {
      const fire = () => {
        const shared = { colors: COLORS, gravity: .86, particleCount: 10, scalar: 1.05, spread: 58, startVelocity: 54, ticks: 180 };
        confettiRef.current?.fire({ ...shared, angle: 58, origin: { x: 0, y: .72 } });
        confettiRef.current?.fire({ ...shared, angle: 122, origin: { x: 1, y: .72 } });
      };
      fire();
      timer = window.setInterval(fire, 180);
      window.setTimeout(() => window.clearInterval(timer), 1800);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || hasFired) return;
      hasFired = true;
      fireSideCannons();
    }, { threshold: .1, rootMargin: "0px 0px -20% 0px" });
    observer.observe(trigger);
    return () => { observer.disconnect(); window.clearInterval(timer); };
  }, [triggerRef]);

  return <Confetti ref={confettiRef} manualstart className="ra-confetti" globalOptions={{ resize: true, useWorker: true }} />;
}
