"use client";

import { useCallback, useEffect, useRef } from "react";

export default function usePauseVideoWhenHidden(videoRef, resetKey) {
  const resumeWhenVisibleRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof IntersectionObserver === "undefined") return undefined;

    resumeWhenVisibleRef.current = false;
    let isInViewport = false;

    const syncPlayback = () => {
      const isVisible = isInViewport && !document.hidden;
      if (!isVisible) {
        if (!video.paused) {
          resumeWhenVisibleRef.current = true;
          video.pause();
        }
        return;
      }

      if (resumeWhenVisibleRef.current) {
        resumeWhenVisibleRef.current = false;
        video.play().catch(() => {});
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      isInViewport = entry.isIntersecting && entry.intersectionRatio > 0;
      syncPlayback();
    }, { threshold: 0.01 });

    const handleDocumentVisibility = () => syncPlayback();
    observer.observe(video);
    document.addEventListener("visibilitychange", handleDocumentVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleDocumentVisibility);
    };
  }, [videoRef, resetKey]);

  return useCallback(() => {
    resumeWhenVisibleRef.current = false;
  }, []);
}
