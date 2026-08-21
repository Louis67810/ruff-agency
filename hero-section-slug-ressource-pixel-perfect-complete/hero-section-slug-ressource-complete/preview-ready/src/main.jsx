import React from "react";
import { createRoot } from "react-dom/client";
import HeroSectionSlugRessource from "../HeroSectionSlugRessource.jsx";

function App(){return <HeroSectionSlugRessource breadcrumbTitle="Nouveau logo Bonduelle" profilePhoto={{src:"/profile-placeholder.svg"}} mainImage={{src:"/main-placeholder.svg"}} />;}

createRoot(document.getElementById("root")).render(<App/>);
