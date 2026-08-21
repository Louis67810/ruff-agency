import React from "react";
import { createRoot } from "react-dom/client";
import HeroOptimized from "./HeroOptimized";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <React.StrictMode>
    <HeroOptimized
      realisationsHref="#"
      bookingHref="#"
      reviewsHref="#"
    />
  </React.StrictMode>,
);
