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
  className = "",
  onClick = undefined,
}) {
  return (
    <a className={`cta ${kind === "primary" ? "cta-primary" : "cta-secondary"} ${className}`.trim()} href={href} onClick={onClick} data-analytics-cta={label || (typeof children === "string" ? children : "cta")} data-analytics-cta-type={kind}>
      <span className="cta-inner">
        <span className="cta-label">{children ?? label}</span>
        {kind === "primary" ? (
          <img className="cta-avatar" src={avatarSrc} alt="Photo de profil" width={28} height={28} />
        ) : null}
      </span>
    </a>
  );
}
