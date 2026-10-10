"use client";

import "./Cta.css";

const PROFILE_IMAGE =
  "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?scale-down-to=64&width=693&height=693";

export default function Cta({
  kind = "primary",
  href = "#",
  children = undefined,
  label = undefined,
  avatarSrc = PROFILE_IMAGE,
  showAvatar = true,
  showArrow = false,
  className = "",
  onClick = undefined,
}) {
  return (
    <a className={`cta ${kind === "primary" ? "cta-primary" : "cta-secondary"} ${className}`.trim()} href={href} onClick={onClick} data-analytics-cta={label || (typeof children === "string" ? children : "cta")} data-analytics-cta-type={kind}>
      <span className={`cta-inner${showArrow ? " cta-has-arrow" : ""}`}>
        <span className="cta-label">{children ?? label}</span>
        {kind === "primary" && showAvatar ? (
          <img className="cta-avatar" src={avatarSrc} alt="Photo de profil" width={28} height={28} />
        ) : null}
        {kind === "primary" && showArrow ? <CtaArrowMark /> : null}
      </span>
    </a>
  );
}

export function CtaArrowMark({ className = "" }) {
  return (
    <span className={`cta-arrow-mark ${className}`.trim()} aria-hidden="true">
      <img src="/landing-assets/saas-redesign/2567-1176.svg" width="34" height="34" alt="" />
    </span>
  );
}
