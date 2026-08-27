"use client";

import Image from "next/image";
import { useState } from "react";

export default function ArticleBeforeAfter({ before, after, beforeLabel = "Avant", afterLabel = "Après" }) {
  const [position, setPosition] = useState(50);

  return (
    <figure className="ra-before-after" style={{ "--ra-before-after-position": `${position}%` }}>
      <div className="ra-before-after__stage">
        <Image className="ra-before-after__image" src={before.src} alt={before.alt || beforeLabel} fill sizes="(max-width: 809px) calc(100vw - 48px), 1054px" />
        <div className="ra-before-after__after">
          <Image className="ra-before-after__image" src={after.src} alt={after.alt || afterLabel} fill sizes="(max-width: 809px) calc(100vw - 48px), 1054px" />
        </div>
        <span className="ra-before-after__label ra-before-after__label--before">{beforeLabel}</span>
        <span className="ra-before-after__label ra-before-after__label--after">{afterLabel}</span>
        <span className="ra-before-after__line" aria-hidden="true"><span><img src="/assets/before-after-frame.svg" alt="Cadre de comparaison avant après" /></span></span>
        <input aria-label="Comparer l’image avant et après" max="100" min="0" onChange={(event) => setPosition(Number(event.target.value))} type="range" value={position} />
      </div>
    </figure>
  );
}
