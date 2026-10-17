"use client";

import { useEffect, useRef, type RefObject } from "react";

/** Pause a ticker outside its viewport without resetting its animation time. */
export function useVisibleAnimation(targetRef: RefObject<HTMLElement>) {
  const canAnimate = useRef(false);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;
    let inViewport = false;
    const syncPlayback = () => {
      canAnimate.current = inViewport && !document.hidden;
      target.getAnimations().forEach((animation) => {
        if (canAnimate.current) animation.play();
        else animation.pause();
      });
    };
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      syncPlayback();
    });
    if (observer) observer.observe(target.parentElement ?? target);
    else inViewport = true;
    syncPlayback();
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, [targetRef]);

  return canAnimate;
}
