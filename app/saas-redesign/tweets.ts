export type SaasTweet = {
  id: string;
  name: string;
  handle: string;
  copy: string;
  href: string;
  accent: string;
  position: number;
  published: boolean;
};

// Curated English-language posts for the SaaS redesign ticker. The first two
// are intentionally pinned by the brief; the rest are ordered by audience.
export const defaultTweets: SaasTweet[] = [
  {
    id: "levelsio-ai-sameness",
    name: "Pieter Levels",
    handle: "@levelsio",
    copy: "AI is making websites and products look increasingly similar.",
    href: "https://x.com/levelsio/status/2079306453676851548",
    accent: "#d9f0ff",
    position: 0,
    published: true,
  },
  {
    id: "mickeyhardy-ai-creativity",
    name: "Mickey from Arcadia",
    handle: "@mickeyhardy",
    copy: "A perspective on AI, creativity and building companies.",
    href: "https://x.com/mickeyhardy/status/2076692214609035285",
    accent: "#ffe7ad",
    position: 1,
    published: true,
  },
  {
    id: "dr-cintas-ai",
    name: "Alvaro Cintas",
    handle: "@dr_cintas",
    copy: "A post about AI and technology from Alvaro Cintas.",
    href: "https://x.com/dr_cintas/status/2108660755578925102",
    accent: "#e8ddff",
    position: 2,
    published: true,
  },
  {
    id: "screenfluent-ai",
    name: "Screenfluent",
    handle: "@screenfluent",
    copy: "A post about AI-generated websites and distinctiveness.",
    href: "https://x.com/screenfluent/status/2105758533795147909",
    accent: "#dff6d5",
    position: 3,
    published: true,
  },
  {
    id: "vikktorrrre-ai",
    name: "Veee",
    handle: "@vikktorrrre",
    copy: "A post about AI and building online.",
    href: "https://x.com/vikktorrrre/status/2092618580902728176",
    accent: "#d9f0ff",
    position: 4,
    published: true,
  },
  {
    id: "ashikartistry-ai",
    name: "Ashik Artistry",
    handle: "@AshikArtistry",
    copy: "A post about AI, websites and design.",
    href: "https://x.com/AshikArtistry/status/2107063262491914663",
    accent: "#ffe7ad",
    position: 5,
    published: true,
  },
  {
    id: "jessie-healy-dtc",
    name: "Jessie Healy",
    handle: "@Jessie_HealyDTC",
    copy: "A post about building and growing online businesses.",
    href: "https://x.com/Jessie_HealyDTC/status/2107744744184991824",
    accent: "#e8ddff",
    position: 6,
    published: true,
  },
  {
    id: "david-hindsmith-ai",
    name: "David Hindsmith",
    handle: "@davidhindsmith",
    copy: "A post about AI and product building.",
    href: "https://x.com/davidhindsmith/status/2107457767032443047",
    accent: "#dff6d5",
    position: 7,
    published: true,
  },
  {
    id: "donemakerapp-ai",
    name: "Zivko",
    handle: "@donemakerapp",
    copy: "A post about making products with AI.",
    href: "https://x.com/donemakerapp/status/2107123190367432739",
    accent: "#d9f0ff",
    position: 8,
    published: true,
  },
];
