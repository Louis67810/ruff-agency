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

export const defaultTweets: SaasTweet[] = [
  {
    id: "damien-ai-generated",
    name: "damien",
    handle: "@damienghader",
    copy: 'Never build a website that looks "AI generated" again.',
    href: "https://x.com/damienghader/status/2062156647246475290",
    accent: "#d9f0ff",
    position: 0,
    published: true,
  },
  {
    id: "andrew-marketing-slop",
    name: "andrew pignanelli",
    handle: "@ndrewpignanelli",
    copy: "When your first impression is marketing slop, customers remember it.",
    href: "https://x.com/ndrewpignanelli/status/2033926820605698262",
    accent: "#ffe7ad",
    position: 1,
    published: true,
  },
  {
    id: "aakash-code-quality",
    name: "Aakash Gupta",
    handle: "@aakashgupta",
    copy: "AI-generated products trade speed for code quality — and sometimes trust.",
    href: "https://x.com/aakashgupta/status/2015298307690783021",
    accent: "#e8ddff",
    position: 2,
    published: true,
  },
  {
    id: "apoorva-business-trust",
    name: "Apoorva Govind",
    handle: "@Appyg99",
    copy: "Businesses buy software from vendors they can trust and rely on.",
    href: "https://x.com/Appyg99/status/2025979690360635587",
    accent: "#dff6d5",
    position: 3,
    published: true,
  },
];
