export type RealisationCategory = "Agence" | "SaaS" | "PME" | "Indépendant";

export type ProjectImage = { src: string; srcSet?: string; alt?: string };

export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  category: RealisationCategory;
  href: string;
  heroTitle?: string;
  heroVideoSrc?: string;
  photoDuSite?: ProjectImage;
  logo?: ProjectImage;
  siteHref?: string;
  about?: string;
  review?: string;
  profilePhoto?: ProjectImage;
  personName?: string;
  personRole?: string;
  challengeSubtitle?: string;
  challenge1?: string;
  challenge2?: string;
  challenge3?: string;
  challenge4?: string;
  solutionSubtitle?: string;
  solution1?: string;
  solution2?: string;
  solution3?: string;
  solution4?: string;
  resultsSubtitle?: string;
  result1?: string;
  result2?: string;
  result3?: string;
  result4?: string;
  photos?: ProjectImage[];
  visibiliteAvantApres?: boolean;
};

function card(
  slug: string,
  title: string,
  description: string,
  image: string,
  imageAlt: string,
  category: RealisationCategory,
): Project {
  return {
    id: slug,
    slug,
    title,
    description,
    image,
    imageAlt,
    category,
    href: `/realisations/${slug}`,
    heroTitle: title,
    photoDuSite: { src: image },
  };
}

// Données issues du site de référence (formal-start-554617.framer.app).
// Chaque page slug est pilotée par cet unique fichier : pour modifier le
// contenu d'une réalisation (texte, avis, photos avant/après), il suffit
// d'éditer l'entrée correspondante ici.
export const projects: Project[] = [
  {
    ...card(
      "spreak",
      "Spreak",
      "Spreak est un SaaS qui centralise avis et enquêtes, aide à bâtir des plans d’action concrets et clarifie ce que vos clients pensent vraiment, pour décider plus vite et mieux.",
      "https://framerusercontent.com/images/k9hqKDSdmfT6DjeoPRo5cmQHLFM.png?width=1202&height=672",
      "Hero section du site de Spreak",
      "SaaS",
    ),
    heroTitle: "Refonte d’une Landing Page pour un aspect haut de gamme",
    heroVideoSrc: "/videos/site-internet-landing.mp4",
    photoDuSite: { src: "https://framerusercontent.com/images/k9hqKDSdmfT6DjeoPRo5cmQHLFM.png?width=1202&height=672" },
    siteHref: "",
    about: "Spreak est un SaaS qui centralise avis et enquêtes, aide à bâtir des plans d’action concrets et clarifie ce que vos clients pensent vraiment, pour décider plus vite et mieux.",
    review:
      "Je recommande vivement Louis pour son travail remarquable sur Spreak. Toute entreprise souhaitant collaborer avec un designer à la fois rigoureux, créatif et fiable fera un excellent choix en travaillant avec lui. Je le recommande sans réserve.",
    profilePhoto: { src: "https://framerusercontent.com/images/DqobaWrM96jw0NYRqTutldOZM.jpg?width=200&height=200" },
    personName: "Sacha Tassart",
    personRole: "Fondateur de Spreak",
    challengeSubtitle: "Faire grandir l’image au rythme du produit",
    challenge1: "Produit en évolution, besoin d’une image à la hauteur",
    challenge2: "Promesse à clarifier pour des décideurs pressés",
    challenge3: "Bénéfices puissants, à rendre visibles en un instant",
    challenge4: "Marché dense, différenciation à rendre évidente",
    solutionSubtitle: "Une présentation premium, structurée, différenciante",
    solution1: "Design repensé pour une perception haut de gamme",
    solution2: "Fonctionnalités mises en avant avec clarté et ordre",
    solution3: "Parcours plus simple, message plus tranchant",
    solution4: "Différenciation assumée face au marché",
    resultsSubtitle: "Un lancement V2 aligné image, produit et marché",
    result1: "Lancement réussi de la version deux du produit",
    result2: "Taux de conversion nettement en hausse",
    result3: "Image perçue comme plus professionnelle et sérieuse",
    result4: "Produit ressenti comme plus solide et crédible",
    visibiliteAvantApres: true,
    photos: [
      { src: "https://framerusercontent.com/images/p1j87UumC9C4phwVfXYqJY4xq7s.png?width=996&height=852" },
      { src: "https://framerusercontent.com/images/wzzK7S3OH5lzKKqVgd94fpJofuk.png?width=996&height=686" },
      { src: "https://framerusercontent.com/images/OhDhjpEXVR8SzxO4G6HXiIWReM.png?width=998&height=1004" },
      { src: "https://framerusercontent.com/images/dDvC2HcPfhl55H07nOzF1ln4Ho.png?width=995&height=771" },
      { src: "https://framerusercontent.com/images/G7WDD4DJcmlg06JKI1NgvpfQOIk.png?width=1122&height=1120" },
      { src: "https://framerusercontent.com/images/4EQjED1ZxzldsPJhAYONLjCuLuE.png?width=1224&height=875" },
    ],
  },
  {
    ...card(
      "keyframe-agency",
      "Keyframe agency",
      "Keyframe agency est une agence de création de vidéos en motion design.",
      "https://framerusercontent.com/images/w638PEZGXN6zoVTeEp4ZJ5zC7Y.png?width=2081&height=1211",
      "Hero section du site de Keyframe agency",
      "Agence",
    ),
    heroTitle: "Création d’un site web sur-mesure pour montrer leur motion design",
    photoDuSite: { src: "https://framerusercontent.com/images/w638PEZGXN6zoVTeEp4ZJ5zC7Y.png?width=2081&height=1211" },
    about: "Keyframe agency est une agence de création de vidéos en motion design.",
    review:
      "10/10 Ruff agency m’a délivré mon site très rapidement et ont été très réactifs. Les assets et les animations sont magnifiques.",
    profilePhoto: { src: "https://framerusercontent.com/images/V58PO9cFrXoX2nvvXl1unLY5Zps.png?width=512&height=512" },
    personName: "Antoine Troovy",
    personRole: "CEO de Keyframe agency",
    challengeSubtitle:
      "Key Frame Agency, spécialiste du motion design, n’avait pas encore de site web. Leur objectif était de créer une vitrine digitale capable de refléter leur univers créatif et de montrer la valeur concrète que leurs vidéos apportent à leurs clients.",
    challenge1: "Refléter la qualité de leurs réalisations",
    challenge2: "Mettre en avant une direction artistique unique",
    challenge3: "Intégrer des animations en motion design",
    challenge4: "Faire comprendre la valeur du motion design",
    solutionSubtitle:
      "Nous avons conçu un site sur-mesure qui met en valeur l’identité colorée et audacieuse de Key Frame Agency, tout en optimisant la lisibilité et la compréhension de leur offre.",
    solution1: "Une vitrine alignée avec leur identité",
    solution2: "Une mise en avant des bénéfices",
    solution3: "Des animations intégrées avec subtilité",
    solution4: "Une expérience immersive et mémorable",
    resultsSubtitle:
      "Grâce à ce nouveau site, Key Frame Agency a pu passer à un autre niveau en matière de communication et de performance commerciale.",
    result1: "Plus de visibilité et de crédibilité",
    result2: "Hausse du taux de conversion",
    result3: "De nombreuses prises de rendez-vous",
    result4: "Une image de marque renforcée",
    visibiliteAvantApres: true,
    photos: [
      { src: "https://framerusercontent.com/images/0RVxg4YeSOrQbifjl6ukSY8xHU.png?width=1671&height=1102" },
      { src: "https://framerusercontent.com/images/bwhCoa5lUm9T0xbnkae7ETCnP8.png?width=1653&height=1001" },
      { src: "https://framerusercontent.com/images/TJxJqoG8i2cP8Io5RSiwC9oG000.png?width=1312&height=970" },
      { src: "https://framerusercontent.com/images/O5A0L3tcF8eBQqJrtqGMW5tRfE.png?width=1106&height=840" },
      { src: "https://framerusercontent.com/images/kLORCg2L76jfgsTe9arJ2EFeF7g.png?width=1311&height=915" },
      { src: "https://framerusercontent.com/images/oTY8sTrSONMqN9HN83qSHAtXI.png?width=1674&height=894" },
      { src: "https://framerusercontent.com/images/dG7pGb9yPOYHj5JlCafyr4XX4.png?width=1305&height=998" },
      { src: "https://framerusercontent.com/images/52hTTMh1UP1scFODI3b0wkfll7o.png?width=1670&height=1003" },
    ],
  },
  {
    ...card(
      "rentala",
      "Rentala",
      "Rentala est un SaaS qui permet de gérer ses biens locatifs simplement, depuis une seule interface claire et intuitive.",
      "https://framerusercontent.com/images/k2fFX7w22E4ad4xjzAICuBvwo68.png?width=1346&height=716",
      "Hero section du site de Rentala",
      "SaaS",
    ),
    heroTitle: "Refonte du design d’un SaaS pour maximiser la crédibilité et la conversion",
    heroVideoSrc: "/videos/landing-page-hero.mp4",
    photoDuSite: { src: "https://framerusercontent.com/images/k2fFX7w22E4ad4xjzAICuBvwo68.png?width=1346&height=716" },
    logo: { src: "https://framerusercontent.com/images/zUMzwc5AG9FujzVhCrU1x8QuRg.png?width=536&height=152" },
    siteHref: "https://rentala.com",
    about: "Rentala est un SaaS qui permet de gérer ses biens locatifs simplement, depuis une seule interface claire et intuitive.",
    review:
      "J’ai fait appel à Ruff Agency pour le redesign de Rentala et je suis ravi du résultat. Le design est moderne et clair. Mention spéciale pour le copywriting : les textes sont percutants et mettent parfaitement en valeur notre proposition. On sent qu’il y a eu un vrai travail de fond pour comprendre notre audience et trouver les bons messages. La collaboration a été simple, fluide et agréable du début à la fin. Des délais tenus, des échanges efficaces, et un rendu final qui dépasse largement mes attentes.",
    profilePhoto: { src: "https://framerusercontent.com/images/Y2epPM936MnqidxOsF9NKzSvE7k.png?width=240&height=240" },
    personName: "Martin Riedweg",
    personRole: "Fondateur de rentala",
    challengeSubtitle:
      "Rentala disposait déjà d’un site, mais celui-ci ne reflétait ni le sérieux du produit ni sa valeur réelle. La première impression manquait de crédibilité et ne donnait pas envie d’aller plus loin.",
    challenge1: "Une valeur perçue trop faible",
    challenge2: "Un copywriting non orienté conversion",
    challenge3: "Une structure de page inefficace",
    challenge4: "Une direction artistique inexistante",
    solutionSubtitle:
      "Nous avons repensé entièrement le design du site pour positionner Rentala comme un SaaS crédible, premium et désirable.",
    solution1: "Une identité visuelle premium",
    solution2: "Un design au niveau du marché",
    solution3: "Un copywriting orienté résultats",
    solution4: "Une structure pensée pour convertir",
    resultsSubtitle: "Cette refonte a transformé la perception de Rentala",
    result1: "Une crédibilité immédiate",
    result2: "Un taux de conversion en forte hausse",
    result3: "Une image de marque mémorable",
    result4: "",
    photos: [
      { src: "https://framerusercontent.com/images/nNCs0aYQNlA46DqZ3zEZzz0R4Gs.png?width=1884&height=924" },
      { src: "https://framerusercontent.com/images/jOIu9FpdzJzyL2wlwdroEVkn1wI.png?width=929&height=647" },
      { src: "https://framerusercontent.com/images/iFLHMRn8iUEUe9EkMIPbddsWdPU.png?width=909&height=784" },
      { src: "https://framerusercontent.com/images/sSe62TkOrGU0sCMc0vYPKlaQMwo.png?width=961&height=742" },
      { src: "https://framerusercontent.com/images/cbT5odjC5n0vaFeOzZcH9cW2gk.png?width=1065&height=629" },
      { src: "https://framerusercontent.com/images/a3ezrzrstyMQiatdePwX2KgN3g.png?width=940&height=787" },
    ],
  },
  {
    ...card(
      "zorgniotti",
      "Cabinet Zorgniotti",
      "Le cabinet Zorgniotti est un cabinet d’expertise comptable qui accompagne entreprises et entrepreneurs dans la gestion et le développement de leur activité.",
      "https://framerusercontent.com/images/V407ZbzjU6Fh0wdazSh60SGJBf0.png?width=1650&height=922",
      "Hero section du site du cabinet Zorgniotti",
      "PME",
    ),
    heroTitle: "Refonte d’un site d’un cabinet comptable pour une image moderne et différenciante",
    heroVideoSrc: "/videos/development-react.mp4",
    photoDuSite: { src: "https://framerusercontent.com/images/V407ZbzjU6Fh0wdazSh60SGJBf0.png?width=1650&height=922" },
    about: "Le cabinet Zorgniotti est un cabinet d’expertise comptable qui accompagne entreprises et entrepreneurs dans la gestion et le développement de leur activité.",
    review:
      "Nous avons commandé un site multi-page et l’expérience a été excellente du début à la fin. Le site a été livré rapidement, avec un design clair et professionnel. Depuis sa mise en ligne, il a vraiment renforcé notre crédibilité et augmenté notre valeur perçue auprès de nos clients. Une collaboration efficace et un résultat au-delà de nos attentes.",
    profilePhoto: { src: "https://framerusercontent.com/images/rwXMkrntjvzRABwKvbu5AchMsTE.png?width=184&height=184" },
    personName: "Dominique Zenglein",
    personRole: "Expert-comptable et associé",
    challengeSubtitle:
      "Le site du cabinet Zorgniotti ne reflétait plus l’évolution du cabinet ni ses méthodes actuelles. Il fallait moderniser l’image tout en clarifiant immédiatement leur positionnement.",
    challenge1: "Un site visuellement dépassé",
    challenge2: "Une proposition de valeur peu claire",
    challenge3: "Des services difficiles à comprendre",
    challenge4: "Une forte concurrence",
    solutionSubtitle: "Nous avons conçu une refonte complète, à la fois moderne, claire et orientée conversion.",
    solution1: "Une identité visuelle premium et actuelle",
    solution2: "Un site mémorable et différenciant",
    solution3: "Un copywriting clair et optimisé",
    solution4: "Une structure multi-page efficace",
    resultsSubtitle: "Cette refonte a permis au cabinet Zorgniotti de repartir sur des bases solides.",
    result1: "Un taux de conversion amélioré",
    result2: "Une compréhension immédiate des services",
    result3: "Une image de marque modernisée",
    result4: "",
    photos: [
      { src: "https://framerusercontent.com/images/2xaSAo8SZCskQlWyEoI1xJMWMY.png?width=1892&height=941" },
      { src: "https://framerusercontent.com/images/KTzSuJPSS0FmNPlgUhiSLqnMWS0.png?width=1808&height=885" },
      { src: "https://framerusercontent.com/images/LQt099Z8WOcF4Tv0M97sFOywrI.png?width=1618&height=788" },
      { src: "https://framerusercontent.com/images/THVy1wqO6xMJf0NHr2o8lbmwRjo.png?width=1520&height=736" },
      { src: "https://framerusercontent.com/images/sRotWbKXYnQqmqDQZuRXFx3SUaU.png?width=1320&height=830" },
      { src: "https://framerusercontent.com/images/OVaNIr38KLogGfrRlXgXeNSSfc.png?width=1575&height=806" },
      { src: "https://framerusercontent.com/images/LuV2waccedO3JRPRCkQkRKxtx0.png?width=1427&height=643" },
    ],
  },
  {
    ...card(
      "clovarex",
      "Clovarex",
      "Julie Zagula est une experte-comptable qui accompagne entreprises et indépendants dans la gestion de leur comptabilité, avec une approche moderne et digitale.",
      "https://framerusercontent.com/images/Z77UsyqCEP3JAR2zIZzN1EGucIk.png?width=2206&height=1223",
      "Hero section du site : Clovarex",
      "Indépendant",
    ),
    heroTitle: "Refonte d’un site comptable pour une image premium et connectée",
    photoDuSite: { src: "https://framerusercontent.com/images/Z77UsyqCEP3JAR2zIZzN1EGucIk.png?width=2206&height=1223" },
    logo: { src: "https://framerusercontent.com/images/uUnfWGnlkZkgst7sSY4vjb7TWJw.png?width=230&height=94" },
    about: "Julie Zagula est une experte-comptable qui accompagne entreprises et indépendants dans la gestion de leur comptabilité, avec une approche moderne et digitale.",
    review:
      "Un vrai professionnel, malgré son jeune âge. Louis m’a livré un site soigné, fluide et parfaitement conforme à mes attentes. Il écoute, il ajuste, il vise juste. Une très belle rigueur, et surtout une vraie volonté de bien faire.",
    profilePhoto: { src: "https://framerusercontent.com/images/snO7zP2bgZdNnB93FGVqaaZgKJc.png?width=305&height=305" },
    personName: "Julie Zagula",
    personRole: "Experte-comptable",
    challengeSubtitle:
      "L’ancien site de Julie Zagula ne reflétait pas son expertise ni la qualité de ses services. Pour se démarquer et renforcer sa crédibilité, il fallait concevoir une refonte complète, capable de combiner simplicité, professionnalisme et modernité.",
    challenge1: "Refléter la qualité des services",
    challenge2: "Se démarquer des concurrents",
    challenge3: "Montrer l’aspect numérique et connecté",
    challenge4: "Simplifier la compréhension des services",
    solutionSubtitle:
      "Nous avons conçu un site multi-page, premium et moderne, qui reflète l’identité de Julie Zagula et valorise son approche numérique.",
    solution1: "Une identité visuelle premium",
    solution2: "Une expérience connectée",
    solution3: "Une architecture multi-page",
    solution4: "Des services expliqués avec clarté",
    resultsSubtitle:
      "La refonte du site a permis à Julie Zagula de renforcer sa visibilité et son image auprès de ses clients et prospects.",
    result1: "Une meilleure visibilité et crédibilité",
    result2: "Un taux de conversion amélioré",
    result3: "Une image de marque renforcée",
    result4: "",
    photos: [
      { src: "https://framerusercontent.com/images/hB8AX3CoQaqufoCvowEAnIHvOI.png?width=873&height=490" },
      { src: "https://framerusercontent.com/images/BP1ObOhNZLbPe8Dbju1Vfjo0wA.png?width=1649&height=939" },
      { src: "https://framerusercontent.com/images/0voCuchdc8udWatlfLeEVqFhis.png?width=922&height=691" },
      { src: "https://framerusercontent.com/images/iiFd8zs5s3znmCqwr6sdpcIruP4.png?width=1358&height=556" },
      { src: "https://framerusercontent.com/images/qmpsqQOWZFIbFQ7TllPCmsPEAOI.png?width=1548&height=567" },
      { src: "https://framerusercontent.com/images/6wS57DwUhWxHIlxBAcXaGxMTyQ.png?width=1120&height=670" },
      { src: "https://framerusercontent.com/images/FjLmDxti7MedCMByKCXuZawTEA.png?width=1035&height=587" },
      { src: "https://framerusercontent.com/images/3Fvmmtp7q7Qh0cZB5O9trg861E.png?width=1029&height=801" },
    ],
  },
  {
    ...card(
      "scall",
      "Scall",
      "Le projet consiste à créer une landing page pour un artiste. L’objectif est de mettre ses réalisations en avant grâce à des animations premium qui les font réellement ressortir.",
      "https://framerusercontent.com/images/kFcIznKt72MEBs9ZSJvb4GvzrF4.png?width=1184&height=749",
      "Hero section de la landing page de Scall",
      "Indépendant",
    ),
    heroTitle: "Création d’un site artistique pour valoriser ses projets et son univers",
    photoDuSite: { src: "https://framerusercontent.com/images/kFcIznKt72MEBs9ZSJvb4GvzrF4.png?width=1184&height=749" },
    review: "",
    about: "Le projet consiste à créer une landing page pour un artiste. L’objectif est de mettre ses réalisations en avant grâce à des animations premium qui les font réellement ressortir.",
    challengeSubtitle:
      "Avant ce projet, Scall présentait son travail sur Behance, une plateforme peu adaptée pour construire une image professionnelle et différenciante. Il fallait créer un site à la hauteur de son univers artistique.",
    challenge1: "Mettre en valeur ses réalisations",
    challenge2: "Se démarquer dans un univers très concurrentiel",
    challenge3: "Renforcer la crédibilité professionnelle",
    challenge4: "Clarifier ses services",
    solutionSubtitle: "Nous avons conçu un site premium, pensé comme une vitrine artistique et professionnelle.",
    solution1: "Une page dédiée à la valorisation des projets",
    solution2: "Une présentation claire des services",
    solution3: "Un design artistique et premium",
    solution4: "Une expérience fluide et cohérente",
    resultsSubtitle: "Ce nouveau site a permis à Scall de franchir un cap dans sa communication.",
    result1: "Une image de marque professionnalisée",
    result2: "Une meilleure visibilité",
    result3: "Une hausse des demandes de contact",
    result4: "",
    visibiliteAvantApres: true,
    photos: [
      { src: "https://framerusercontent.com/images/uJTpnOSidLLxpjo2KQeF0XG4i0.png?width=1823&height=875" },
      { src: "https://framerusercontent.com/images/vj5TdgnuMYQhN8Yu2tZPIcStQvo.png?width=1787&height=850" },
      { src: "https://framerusercontent.com/images/Jo526nn3fp0ZiB23SDgowSSWms.png?width=1293&height=789" },
      { src: "https://framerusercontent.com/images/CY9LBphRk7d6MuWQV8kzaihES08.png?width=1687&height=827" },
      { src: "https://framerusercontent.com/images/SDAUJv07GTyXks1FbeM3mWP2atQ.png?width=1829&height=878" },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
