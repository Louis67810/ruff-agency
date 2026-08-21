import React from "react";
import ContentPageRealisationsSlug from "./ContentPageRealisationsSlug.jsx";

// Le ZIP source ne contient pas les images d’instance (logo/profil/photos 1-8).
// Cette preview affiche donc la structure réelle sans inventer ces assets.
export default function App(){
  return <ContentPageRealisationsSlug callHref="#" />;
}
