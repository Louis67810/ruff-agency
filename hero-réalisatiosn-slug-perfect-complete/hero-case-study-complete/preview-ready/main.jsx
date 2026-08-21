import React from "react";
import { createRoot } from "react-dom/client";
import HeroCaseStudy from "./HeroCaseStudy.jsx";

const SOURCE_AVATAR = "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693";

createRoot(document.getElementById("root")).render(
  <HeroCaseStudy
    slug="Projet"
    photoDeProfil={SOURCE_AVATAR}
    nomDeLaPersonne="Louis"
    fonctionDeLaPersonne="Lorem ipsum dolor"
  />
);
