"use client";

import { useEffect, useRef, useState } from "react";
import { LinkIcon as HeroLinkIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import "./RessourceArticle.css";

function SocialButton({ href, label, children, onClick }) {
  const Tag = href ? "a" : "button";
  return <Tag className="ra-share-button ra-fill-hover" href={href} target={href ? "_blank" : undefined} rel={href ? "noreferrer" : undefined} onClick={onClick} aria-label={label}>{children}</Tag>;
}

function XIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" /></svg>; }
function LinkedInIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V8.98h3.42v1.57h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.28 2.38 4.28 5.47v6.28ZM5.32 7.41a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.04H3.54V8.98H7.1v11.47Z" /></svg>; }
function FacebookIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-3.49h3.047V9.414c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971h-1.513c-1.49 0-1.956.931-1.956 1.887v2.262h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" /></svg>; }

export default function ResourceShare({ url, title, locale = "fr" }) {
  const [copied, setCopied] = useState(false);
  const copiedTimeoutRef = useRef(null);
  useEffect(() => () => window.clearTimeout(copiedTimeoutRef.current), []);
  const encodedUrl = encodeURIComponent(url || "");
  const xShare = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(title || "")}`;
  const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(url); }
    catch { window.prompt("Copiez le lien de cette ressource :", url); }
    window.clearTimeout(copiedTimeoutRef.current);
    setCopied(true);
    copiedTimeoutRef.current = window.setTimeout(() => setCopied(false), 1800);
  };
  return <section className="ra-share" aria-labelledby="ra-share-title">
    <h2 id="ra-share-title">{locale === "en" ? "Share this resource with:" : "Partagez cette ressource avec :"}</h2>
    <div className="ra-share-grid">
      <SocialButton href={xShare} label="Partager sur X"><XIcon /></SocialButton>
      <SocialButton href={linkedinShare} label="Partager sur LinkedIn"><LinkedInIcon /></SocialButton>
      <SocialButton href={facebookShare} label="Partager sur Facebook"><FacebookIcon /></SocialButton>
      <SocialButton label={copied ? "Lien copié" : "Copier le lien"} onClick={copyLink}>
        <span className={`ra-copy-icon${copied ? " is-copied" : ""}`} aria-hidden="true"><HeroLinkIcon className="ra-copy-icon__link" /><CheckIcon className="ra-copy-icon__check" /></span>
        <span className="ra-sr-only" aria-live="polite">{copied ? "Lien copié" : ""}</span>
      </SocialButton>
    </div>
  </section>;
}
