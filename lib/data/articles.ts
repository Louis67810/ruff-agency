export type ArticleTag = { id: string; label: string };

export type ArticleInlineInfo = { term: string; explanation: string };
export type ArticleInlineLink = { text: string; href: string };
export type ArticleTableCell = string | {
  text?: string;
  tag?: { label: string; category?: "Agence" | "SaaS" | "PME" | "Indépendant" };
};

export type ArticleChartData = {
  series?: Array<{ label: string; value: number; secondary?: number; date?: string }>;
  nodes?: Array<{ name: string; category?: "source" | "landing" | "outcome" }>;
  links?: Array<{ source: number; target: number; value: number }>;
  cells?: Array<{ date: string; value: number }>;
  regions?: Record<string, number>;
};

export type ArticleBlock =
  | { type: "heading"; text: string; level?: 2 | 3 }
  | { type: "paragraph"; text: string; inlineInfo?: ArticleInlineInfo[]; links?: ArticleInlineLink[] }
  | { type: "image"; src: string; alt?: string }
  | { type: "before-after"; before: { src: string; alt?: string }; after: { src: string; alt?: string }; beforeLabel?: string; afterLabel?: string }
  | { type: "video"; src: string; poster?: string; title?: string }
  | { type: "table"; columns: string[]; rows: ArticleTableCell[][]; highlightFirstColumn?: boolean }
  | { type: "inline-info"; text: string; explanation: string }
  | { type: "article-link"; slug: string; label?: string }
  | { type: "chart"; variant: "bar" | "area" | "sankey" | "heatmap" | "funnel" | "choropleth"; title: string; description?: string; data?: ArticleChartData; valueLabel?: string; unit?: string; source?: string }
  | { type: "callout"; variant: "info" | "education" | "warning"; title: string; text: string; icon?: "info" | "education" | "warning" | "academic" }
  | { type: "quote"; text: string }
  | { type: "point-cards"; items: Array<{ title: string; text: string; icon?: "info" | "education" | "warning" | "academic" }> }
  | { type: "content-list"; variant: "summary" | "sources"; title: string; items: Array<{ label: string; href?: string }> }
  | { type: "faq"; title?: string; items: Array<{ question: string; answer: string }> }
  | { type: "cta"; variant: "audit" | "quiz"; eyebrow?: string; title?: string; description?: string; label?: string; href?: string; availability?: string }
  | { type: "highlight-list" | "bullet-list"; items: Array<{ label: string; children?: string[] }> }
  | { type: "divider" };

export type ArticleQuizCta = {
  variant?: "recommendation" | "audit";
  badge?: string;
  title?: string;
  description?: string;
  label?: string;
  href?: string;
  availability?: string;
  images?: string[];
};

export type ArticleQuizResult = {
  eyebrow: string;
  title: string;
  description: string;
  cta?: ArticleQuizCta | false;
};

export type ArticleQuiz = {
  eyebrow: string;
  title: string;
  description: string;
  questions: Array<{ question: string; answers: Array<string | { label: string; resultId?: string }> }>;
  result: ArticleQuizResult;
  results?: Record<string, ArticleQuizResult>;
  tieBreakResultId?: string;
  cta?: ArticleQuizCta | false;
};

export type Article = {
  id: string;
  slug: string;
  tagId: string;
  tag: string;
  title: string;
  image: { src: string; srcSet?: string; alt?: string };
  author: string;
  authorPhoto: { src: string };
  href: string;
  breadcrumbTitle: string;
  updatedAt: string;
  metaDescription?: string;
  publishedAt?: string;
  modifiedAt?: string;
  noIndex?: boolean;
  hiddenFromListing?: boolean;
  quizInHero?: boolean;
  mainImage?: { src: string; alt?: string };
  mainVideo?: { src: string; poster?: string; title?: string };
  profilePhoto: { src: string };
  about: string;
  authorRole: string;
  authorBio: string;
  sources?: Array<{ label: string; href: string }>;
  content: ArticleBlock[];
  quiz?: ArticleQuiz;
  hiddenContentTypes?: ArticleBlock["type"][];
};

const LOUIS = "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693";
const LOUIS_PROFILE = "https://framerusercontent.com/images/BifUCVJ8SFvwIJhc7EDr43Gc.jpg?width=693&height=693";

export type RuffArticleInput = Omit<Article, "href" | "author" | "authorPhoto" | "profilePhoto" | "about" | "authorRole" | "authorBio"> &
  Partial<Pick<Article, "href" | "author" | "authorPhoto" | "profilePhoto" | "about" | "authorRole" | "authorBio">>;

/**
 * Converts legacy plain-text markers into the editorial blocks rendered by the
 * article template. New article content must be authored with these blocks
 * directly; this migration keeps existing entries clean without losing copy.
 */
function normalizeArticleContent(content: ArticleBlock[]): ArticleBlock[] {
  const normalized: ArticleBlock[] = [];

  for (let index = 0; index < content.length; index += 1) {
    const block = content[index];

    if (block.type === "paragraph" && block.text.startsWith("🔹 ")) {
      normalized.push({ type: "heading", level: 3, text: block.text.slice(3) });
      continue;
    }

    if (block.type !== "paragraph" || !block.text.startsWith("• ")) {
      normalized.push(block);
      continue;
    }

    const items: Array<{ label: string }> = [];
    while (index < content.length) {
      const candidate = content[index];
      if (candidate.type !== "paragraph" || !candidate.text.startsWith("• ")) break;
      items.push({ label: candidate.text.slice(2) });
      index += 1;
    }
    normalized.push({ type: "bullet-list", items });
    index -= 1;
  }

  return normalized;
}

/** Fabrique un article avec les valeurs Ruff communes, sans recopier le profil auteur ni l'URL. */
export function createRuffArticle(input: RuffArticleInput): Article {
  return {
    author: "Louis Staub",
    authorPhoto: { src: LOUIS },
    href: `/ressources/${input.slug}`,
    profilePhoto: { src: LOUIS_PROFILE },
    about: "",
    authorRole: "Expert web designer",
    authorBio: "J’aide les entreprises à transformer leur site en un outil clair, crédible et pensé pour convertir grâce au web design, à la stratégie et à l’expérience utilisateur.",
    ...input,
  };
}

export const articleTags: ArticleTag[] = [
  { id: "acquisition", label: "Acquisition" },
  { id: "outils", label: "Outils" },
  { id: "conseils", label: "Conseils" },
  { id: "guide", label: "Guide" },
  { id: "actualites", label: "Actualités" },
];

// Articles importés depuis le site de référence (CMS).
const legacyArticles: Article[] = [
  {
    id: "1",
    slug: "nouveau-logo-bonduelle",
    tagId: "actualites",
    tag: "Actualités",
    title: "Nouveau logo Bonduelle : analyse du rebranding et de ses risques en rayon",
    image: { src: "https://framerusercontent.com/images/rNSpJqDhR94j7O7OpTQKCbdp7cg.jpg?width=1280&height=715", alt: "Nouveau logo de Bonduelle" },
    author: "Louis Staub",
    authorPhoto: { src: LOUIS },
    href: "/ressources/nouveau-logo-bonduelle",
    breadcrumbTitle: "Actualités",
    updatedAt: "Dernière mise à jour le 15 juin 2026",
    metaDescription: "Analyse du nouveau logo Bonduelle : signes supprimés, cohérence avec la promesse végétale et risques de reconnaissance en rayon.",
    mainImage: { src: "https://framerusercontent.com/images/rNSpJqDhR94j7O7OpTQKCbdp7cg.jpg?width=1280&height=715" },
    profilePhoto: { src: LOUIS_PROFILE },
    about: "",
    authorRole: "",
    authorBio: "",
    sources: [
      { label: "Bonduelle — Que le Bon l’emporte", href: "https://www.bonduelle.com/fr/campagne-que-le-bon-lemporte-bonduelle/" },
      { label: "Bonduelle — Dossier de presse : une nouvelle identité visuelle assumée", href: "https://www.bonduelle.com/app/uploads/2026/04/1.-DP-RELANCEMENT-BONDUELLE-FRANCE-1.pdf" },
      { label: "Bonduelle — Découvrez le nouveau visage du Groupe", href: "https://www.bonduelle.com/fr/decouvrez-le-nouveau-visage-du-groupe-bonduelle/" },
    ],
    hiddenContentTypes: ["table", "callout", "quote", "point-cards", "content-list"],
    content: [
      { type: "paragraph", text: "Le nouveau logo Bonduelle simplifie les signes historiques de la marque. Cette analyse examine ce que ce rebranding peut apporter au numérique — et ce qu’il risque de coûter en reconnaissance visuelle, notamment en rayon." },
      { type: "heading", text: "Une histoire graphique ancrée dans le végétal" },
      { type: "paragraph", text: "Depuis sa création, l'identité visuelle de Bonduelle a toujours cherché à refléter son héritage agricole et sa proximité avec la nature. Dès les années 1950, la marque introduit des symboles forts : la feuille et l'arc de cercle, évoquant l'univers végétal et la croissance continue. Au fil des décennies, cette feuille s'est stylisée pour devenir la clé de voûte de la reconnaissance de la marque en rayon. Elle a su instaurer un véritable code couleur et une symbolique indissociable des produits de la terre." },
      { type: "heading", text: "La stratégie de l'hyper-simplification" },
      { type: "paragraph", text: "La marque a dévoilé un nouveau logo Bonduelle qui marque une rupture radicale avec son prestigieux passé. Le parti pris est celui d'une extrême simplification : Une typographie repensée : L'utilisation d'une police sans serif très arrondie, apportant une douceur presque inattendue pour une marque de cette maturité. Un symbole abstrait : L'emblématique feuille végétale disparaît au profit d'un simple cercle vert, une forme géométrique beaucoup plus générique. Cette approche, souvent plébiscitée dans le webdesign pour faciliter l'adaptation aux environnements numériques, soulève néanmoins de véritables questions sur l'efficacité du message renvoyé aux consommateurs en magasin." },
      { type: "heading", text: "Les dangers d'une identité visuelle trop générique" },
      { type: "paragraph", text: "Lorsqu'une marque jouit d'une telle notoriété, modifier son archétype visuel est un exercice périlleux. Le nouveau design présente plusieurs limites qui menacent la force de frappe de son image de marque." },
      { type: "heading", text: "L'incohérence avec la stratégie végétale" },
      { type: "paragraph", text: "C'est ici que l'analyse révèle sa plus grande faille. Alors que le discours stratégique s'appuie massivement sur la promesse de vivre mieux par l'alimentation végétale, sa ligne esthétique subit une véritable dé-végétalisation. L'abandon de la feuille crée une dissonance cognitive profonde entre la promesse marketing et l'identité visuelle." },
      { type: "image", src: "https://framerusercontent.com/images/CaabuVzbGgS0vKvPgHjPZ4gRUMs.jpg?width=1079&height=597", alt: "Evolution du logo de Bonduelle" },
      { type: "paragraph", text: "Le nouveau packaging Bonduelle mis en situation en grande surface" },
      { type: "paragraph", text: "Il ne faut pas oublier que le logo constitue le point de repère numéro un sur un packaging alimentaire. Transposé sur des boîtes de conserve ou des sachets de salade fraîche, ce nouveau design noyé sous des couleurs uniformes risque de générer une moins bonne identification visuelle de la part des clients pressés. La visibilité et la reconnaissance immédiate sont indispensables dans des supermarchés saturés de déclinaisons. Simplifier une marque pour la moderniser ne devrait jamais se faire au détriment de son pouvoir d'évocation premier." },
      { type: "heading", text: "En conclusion" },
      { type: "paragraph", text: "Si la démarche de modernisation était compréhensible face à la digitalisation des supports, le nouveau logo Bonduelle frôle aujourd'hui une uniformisation excessive. En coupant le lien iconographique avec son héritage, l'entreprise devra redoubler d'efforts sur ses autres supports médiatiques pour prouver que, derrière cette identité lissée, bat toujours le cœur d'un géant du légume." },
      { type: "heading", text: "Exemples de blocs pour les contenus SEO" },
      { type: "paragraph", text: "Les éléments suivants sont volontairement fictifs : ils servent à visualiser les nouveaux formats disponibles dans les contenus d’articles." },
      { type: "table", columns: ["Critère", "Avant", "Après", "Impact", "Priorité"], rows: [["Reconnaissance", "Élevée", "À confirmer", "Fort", "Haute"], ["Différenciation", "Marquée", "Plus faible", "Moyen", "Moyenne"], ["Déclinaison digitale", "Limitée", "Simplifiée", "Positif", "Haute"], ["Cohérence de marque", "Historique", "À consolider", "Fort", "Haute"], ["Lisibilité en rayon", "Établie", "À mesurer", "Fort", "Haute"]] },
      { type: "callout", variant: "info", icon: "info", title: "Point pédagogique", text: "Un tableau aide à comparer des critères précis sans interrompre la lecture. Ce contenu est un exemple de mise en forme éditoriale." },
      { type: "callout", variant: "education", icon: "education", title: "À retenir", text: "Les encadrés peuvent prendre une couleur, une icône et un niveau de priorité différents selon l’intention du contenu." },
      { type: "callout", variant: "warning", icon: "warning", title: "Point de vigilance", text: "Cet encadré est réservé aux risques, limites ou informations nécessitant une attention particulière." },
      { type: "quote", text: "Une identité efficace ne se contente pas d’être moderne : elle doit aussi préserver les repères qui permettent à une marque d’être reconnue immédiatement." },
      { type: "point-cards", items: [{ icon: "academic", title: "Clarté de lecture", text: "Présenter une idée clé dans une carte isole l’information et facilite son repérage." }, { icon: "academic", title: "Hiérarchisation", text: "Les cartes peuvent mettre en avant deux points complémentaires, sans alourdir le corps de l’article." }] },
      { type: "content-list", variant: "summary", title: "Sommaire", items: [{ label: "Une histoire graphique ancrée dans le végétal" }, { label: "La stratégie de l’hyper-simplification" }, { label: "Les dangers d’une identité visuelle trop générique" }, { label: "L’incohérence avec la stratégie végétale" }, { label: "En conclusion" }] },
      { type: "content-list", variant: "sources", title: "Sources", items: [{ label: "Site officiel de Bonduelle", href: "https://www.bonduelle.com/" }, { label: "Étude de cas et éléments de marque", href: "https://www.bonduelle.com/" }, { label: "Références visuelles de l’article" }] },
    ],
  },
  {
    id: "2",
    slug: "nouveau-logo-kfc-rebranding-bucketverse-jkr",
    tagId: "actualites",
    tag: "Actualités",
    title: "Nouveau logo KFC et Bucketverse : analyse du rebranding signé JKR",
    image: { src: "https://framerusercontent.com/images/mvu7DCcIcjQf5xbUlCvf3YNscNg.jpg?width=2880&height=1620", alt: "Nouveau logo KFC : analyse du rebranding « Bucketverse » signé JKR" },
    author: "Louis Staub",
    authorPhoto: { src: "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693" },
    href: "/ressources/nouveau-logo-kfc-rebranding-bucketverse-jkr",
    breadcrumbTitle: "Actualités",
    updatedAt: "Dernière mise à jour le 15 juin 2026",
    metaDescription: "Analyse du nouveau logo KFC et du Bucketverse conçu par JKR : bucket, typographies, packaging et système de marque mondial.",
    mainImage: { src: "https://framerusercontent.com/images/mvu7DCcIcjQf5xbUlCvf3YNscNg.jpg?width=2880&height=1620" },
    profilePhoto: { src: "https://framerusercontent.com/images/BifUCVJ8SFvwIJhc7EDr43Gc.jpg?width=693&height=693" },
    about: "",
    authorRole: "",
    authorBio: "",
    content: [
      { type: "paragraph", text: "Le nouveau logo KFC transforme le bucket en signature de marque, système graphique et repère spatial. Conçu par JKR, le Bucketverse étend les codes historiques de l’enseigne du packaging aux interfaces et aux restaurants." },
      { type: "heading", text: "Avant/après : le bucket devient officiellement le logo" },
      { type: "image", src: "https://framerusercontent.com/images/mvu7DCcIcjQf5xbUlCvf3YNscNg.jpg", alt: "Avant après du nouveau logo KFC conçu par JKR en 2026" },
      { type: "paragraph", text: "L’ancien logo plaçait le Colonel dans une forme plate, encadrée de deux bandes rouges, avec le nom KFC disposé horizontalement sous le portrait. Cette composition restait identifiable, mais elle utilisait mal l’espace et manquait d’impact lorsqu’elle était observée rapidement ou à distance." },
      { type: "paragraph", text: "La nouvelle version reprend directement la silhouette trapézoïdale du bucket. Le volume est suggéré par les bords incurvés, tandis que les lettres KFC remontent verticalement sur les deux côtés. Le logo ne représente donc plus simplement la marque : il prend la forme de son contenant le plus emblématique. C’est un changement stratégique majeur, car un objet physique difficile à imiter devient le principal raccourci visuel de l’enseigne." },
      { type: "heading", text: "Un Colonel Sanders mieux construit et plus chaleureux" },
      { type: "image", src: "https://framerusercontent.com/images/NCDe5qKtw4Z3ombrteLna6WrRE.gif", alt: "Animation du nouveau logo KFC avec le Colonel Sanders redessiné" },
      { type: "paragraph", text: "JKR conserve le visage du fondateur, mais corrige plusieurs faiblesses de l’illustration précédente. Le Colonel possède désormais des épaules, un col plus net et une expression légèrement plus chaleureuse. Ce détail règle notamment l’illusion d’optique qui faisait parfois passer son nœud papillon pour un minuscule corps avec des bras et des jambes." },
      { type: "paragraph", text: "Cette évolution est volontairement mesurée. Trop simplifier le personnage aurait affaibli la dimension historique de KFC ; trop le moderniser aurait risqué de créer une rupture. La nouvelle construction améliore sa présence sans le rendre méconnaissable." },
      { type: "heading", text: "Visibilité contre lisibilité : un choix assumé" },
      { type: "image", src: "https://framerusercontent.com/images/e719cZmPXQBELlWmNxouep3fmc.jpg", alt: "Nouvelle identité KFC appliquée aux buckets, gobelets et emballages" },
      { type: "paragraph", text: "Le passage d’un acronyme horizontal à des lettres verticales réduit légèrement la facilité de lecture immédiate. Pourtant, pour une marque présente dans plus de 150 pays, l’enjeu n’est plus d’expliquer ce que signifie KFC. Il consiste à émerger dans un environnement saturé de logos plats et de messages publicitaires." },
      { type: "paragraph", text: "La silhouette du seau offre précisément cette visibilité. Même sans lire les lettres ni distinguer le visage du Colonel, sa forme peut être reconnue depuis une route, sur un petit écran ou au milieu d’un rayon très chargé. KFC privilégie ainsi une signature qui « surgit » dans l’espace plutôt qu’un simple mot parfaitement lisible." },
      { type: "heading", text: "Deux typographies sur mesure pour rendre la marque plus gourmande" },
      { type: "image", src: "https://framerusercontent.com/images/7fbHcFBS5ITa6C6Cu9yXQ3JQ2yY.gif", alt: "Nouvelle typographie serif de l’identité visuelle KFC" },
      { type: "paragraph", text: "Le système s’appuie sur deux caractères développés avec Studio Drama : Kentucky Fried Serif et Kentucky Fried Sans. La serif principale adopte des courbes épaisses, des angles adoucis et une présence presque rétro. Elle apporte davantage de chaleur et de gourmandise que la typographie précédente, plus rigide." },
      { type: "paragraph", text: "À côté de ces polices, la signature manuscrite « Finger Lickin’ Good » devient un véritable élément graphique, réalisé avec l’illustrateur et designer Tobias Hall. L’ensemble permet à KFC de varier les tons : impact publicitaire, information fonctionnelle, expression plus humaine ou message très gourmand." },
      { type: "heading", text: "Le Stripe Generator transforme les rayures en outil de communication" },
      { type: "image", src: "https://framerusercontent.com/images/0QTeTChzgZhBzD76Q6XEqMKSKGg.gif", alt: "Interface du Stripe Generator créé pour la nouvelle identité KFC" },
      { type: "paragraph", text: "Les bandes rouges et blanches ne servent plus uniquement d’arrière-plan. JKR les transforme en rubans typographiques capables de porter un slogan, de se déformer ou de s’animer. Pour garantir la cohérence internationale du système, l’agence a conçu un Stripe Generator destiné aux équipes de la marque." },
      { type: "paragraph", text: "Cet outil permet de saisir un texte, choisir une orientation, ajuster le nombre de bandes, leur échelle, leur ratio et leur mouvement, puis exporter un asset conforme à la charte. C’est une réponse pragmatique à un problème fréquent des identités mondiales : donner de la liberté à des centaines d’équipes locales sans perdre la cohérence du branding." },
      { type: "heading", text: "Le bucket devient un cadre créatif mondial" },
      { type: "image", src: "https://framerusercontent.com/images/ePammVN2CKkaWvSD05aoxHHqNVE.jpeg", alt: "Illustration internationale intégrée dans la forme du bucket KFC" },
      { type: "paragraph", text: "La forme du seau fonctionne également comme un contenant éditorial. Elle peut accueillir une photographie, une illustration, un message ou une collaboration artistique tout en restant identifiable. KFC dispose ainsi d’un cadre stable dans lequel des univers très différents peuvent cohabiter." },
      { type: "paragraph", text: "Le système d’illustration a été développé avec des artistes installés dans plusieurs villes, notamment Buenos Aires, Amsterdam, Xiamen, Lima et Mumbai. Cette logique donne aux campagnes locales une vraie personnalité sans diluer la marque mondiale : le style change, mais le bucket reste le point d’ancrage." },
      { type: "heading", text: "Une photographie plus proche, plus ronde et plus sensorielle" },
      { type: "image", src: "https://framerusercontent.com/images/9RsDdPzjKmRy9XhTS27CvTWhevo.jpg", alt: "Nouvelle photographie KFC montrant un sac de commande remis à une voiture" },
      { type: "paragraph", text: "La direction photographique adopte ce que KFC appelle une « bucket lens ». Les cadrages sont proches, dynamiques et parfois déformés par des objectifs grand-angle. Cette perspective amplifie les volumes, place le produit au centre de l’action et prolonge les courbes du nouveau symbole." },
      { type: "paragraph", text: "Le résultat évite l’esthétique trop propre des banques d’images. Les mains, les emballages, les sauces et les scènes de partage donnent une sensation plus immédiate. L’identité ne se contente donc pas d’être visible : elle cherche à rendre la nourriture et l’expérience plus tangibles." },
      { type: "heading", text: "De la signalétique à l’architecture : passer du QSR au QXR" },
      { type: "image", src: "https://framerusercontent.com/images/843sklpARzKtdHJ7OoULVzfuE.jpeg", alt: "Nouvelle façade KFC inspirée par la forme géante du bucket" },
      { type: "paragraph", text: "À l’extérieur, la forme du bucket devient une enseigne en volume et un motif architectural. Une façade peut être découpée par sa silhouette ou recevoir un seau monumental visible sous plusieurs angles. Cette approche renforce la reconnaissance depuis la rue, là où un logo plat se perd facilement parmi les autres enseignes." },
      { type: "image", src: "https://framerusercontent.com/images/MmWsZDuuoocV1Nxe9Es1FkpuVs.jpeg", alt: "Nouvel intérieur de restaurant KFC intégrant la typographie et les rayures" },
      { type: "paragraph", text: "À l’intérieur, les lettres surdimensionnées, les rayures animées, les écrans et le mobilier prolongent le système. JKR parle de QXR, pour Quick Experience Restaurant, afin de dépasser la seule logique fonctionnelle du fast-food. L’objectif est de rendre le passage en restaurant plus distinctif, du comptoir jusqu’aux espaces de consommation." },
      { type: "heading", text: "Une identité pensée pour bouger sur les écrans" },
      { type: "image", src: "https://framerusercontent.com/images/kLAGtCw3OnO2LZxZokKRqj03Pbc.gif", alt: "Animation de suivi de commande dans la nouvelle application KFC" },
      { type: "paragraph", text: "Le nouveau langage graphique a été conçu pour les applications, les bornes, les menus numériques et les réseaux sociaux. Le bucket peut se construire pendant un écran de chargement, les lettres peuvent se déplacer sur ses parois et les rayures peuvent guider l’utilisateur dans une interface." },
      { type: "paragraph", text: "Cette cohérence entre le physique et le numérique est l’un des points forts du projet. Le même symbole fonctionne comme logo, masque d’image, animation, bouton ou structure de mise en page. KFC évite ainsi de posséder une identité forte en restaurant mais générique sur mobile." },
      { type: "heading", text: "Un rebranding très cohérent, mais réservé aux budgets considérables" },
      { type: "image", src: "https://framerusercontent.com/images/imImGA2ty3YLA9e60EE5FP8q0.jpeg", alt: "Illustration 3D du Bucketverse dans le nouveau système visuel KFC" },
      { type: "paragraph", text: "Le travail de JKR impressionne par son ampleur : logo, caractères sur mesure, photographie, illustration, outils internes, architecture, packaging, motion design et ton éditorial sont développés comme les différentes parties d’un même système. Peu de refontes récentes atteignent ce niveau de continuité." },
      { type: "paragraph", text: "Cette réussite souligne toutefois une limite du secteur. Les identités les plus ambitieuses sont souvent financées par des multinationales capables d’investir massivement dans des caractères propriétaires, des logiciels internes et des déploiements mondiaux. La créativité est remarquable, même si elle reste mise au service d’un modèle industriel de restauration rapide." },
      { type: "heading", text: "En conclusion" },
      { type: "image", src: "https://framerusercontent.com/images/5XYyuEyQAYodh4OQD5zjFHbnc.gif", alt: "Déclinaison internationale du Bucketverse KFC dans une campagne illustrée" },
      { type: "paragraph", text: "Le nouveau logo KFC réussit parce qu’il ne traite pas le rebranding comme un exercice cosmétique. JKR part d’un objet que le public connaît déjà et lui attribue plusieurs fonctions : emblème, volume architectural, cadre d’image, support typographique et élément d’interface. Le bucket devient ainsi un véritable système de marque." },
      { type: "paragraph", text: "Le choix de sacrifier une petite partie de la lisibilité au profit d’une visibilité maximale est cohérent avec la notoriété de KFC. Comme dans notre analyse du nouveau logo Bonduelle, la question décisive reste la même : la simplification ou la transformation renforce-t-elle les signes les plus distinctifs de la marque ? Ici, la réponse est clairement positive." },
      { type: "paragraph", text: "Crédits visuels : JKR et KFC, via It’s Nice That. Informations complémentaires : JKR, KFC et la presse design spécialisée." },
    ],
  },
  {
    id: "3",
    slug: "developper-site-efficacement",
    tagId: "conseils",
    tag: "Conseils",
    title: "Créer un site internet efficacement : méthode Figma, Framer et priorités",
    image: { src: "https://framerusercontent.com/images/JKjlHJDb7urmEsf6oppCkNwca1c.jpg?width=6009&height=4278", alt: "Comment développer son site efficacement sans perdre en qualité" },
    author: "Louis Staub",
    authorPhoto: { src: "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693" },
    href: "/ressources/developper-site-efficacement",
    breadcrumbTitle: "Conseils",
    updatedAt: "Dernière mise à jour le 15 juin 2026",
    metaDescription: "Comment créer un site internet efficacement : méthode Figma et Framer pour cadrer, concevoir, publier et faire évoluer un site performant.",
    mainImage: { src: "https://framerusercontent.com/images/JKjlHJDb7urmEsf6oppCkNwca1c.jpg?width=6009&height=4278" },
    profilePhoto: { src: "https://framerusercontent.com/images/BifUCVJ8SFvwIJhc7EDr43Gc.jpg?width=693&height=693" },
    about: "",
    authorRole: "",
    authorBio: "",
    content: [
      { type: "paragraph", text: "Pour créer un site internet efficacement, commencez par cadrer le message et l’expérience, concevez-les dans Figma, puis produisez et améliorez le site par itérations. Cette méthode limite les retours coûteux sans sacrifier la qualité." },
      { type: "heading", text: "Étape 1 : Toujours commencer par Figma" },
      { type: "paragraph", text: "Avant de toucher à un outil de développement, la meilleure décision est de passer par Figma." },
      { type: "paragraph", text: "Pourquoi ? Parce que Figma permet de travailler sans contraintes techniques sur :" },
      { type: "paragraph", text: "• Le design" },
      { type: "paragraph", text: "• Le copywriting" },
      { type: "paragraph", text: "• La structure des pages" },
      { type: "paragraph", text: "• La hiérarchie visuelle" },
      { type: "paragraph", text: "• Les parcours utilisateurs" },
      { type: "paragraph", text: "C’est l’étape où tout est encore flexible. Modifier un titre, déplacer une section, tester une autre structure prend quelques secondes, alors que ces mêmes changements, une fois le site développé, coûtent du temps et de l’argent." },
      { type: "paragraph", text: "👉 Figma = la fondation. On valide l’UX, le message et la logique du site avant de le développer." },
      { type: "heading", text: "Étape 2 : Choisir la bonne solution pour développer son site" },
      { type: "paragraph", text: "Une fois le design et le contenu validés, plusieurs options existent pour transformer ce travail en site réel." },
      { type: "paragraph", text: "🔹 Option 1 : Développer son site en code (HTML / CSS / JS)" },
      { type: "paragraph", text: "C’est la solution la plus flexible techniquement, mais aussi :" },
      { type: "paragraph", text: "• La plus longue" },
      { type: "paragraph", text: "• La plus coûteuse" },
      { type: "paragraph", text: "• La moins accessible pour itérer rapidement" },
      { type: "paragraph", text: "Elle est pertinente pour des projets très spécifiques ou des équipes techniques avancées, mais peu adaptée pour la majorité des sites marketing ou business." },
      { type: "paragraph", text: "🔹 Option 2 : Webflow" },
      { type: "paragraph", text: "Webflow est une bonne alternative no-code, très puissante, mais :" },
      { type: "paragraph", text: "• Complexe à prendre en main" },
      { type: "paragraph", text: "• Parfois lourde pour des landing pages simples" },
      { type: "paragraph", text: "• Moins rapide pour itérer sur le design et le contenu" },
      { type: "paragraph", text: "C’est un outil solide, mais qui demande un vrai temps d’apprentissage." },
      { type: "paragraph", text: "🔹 Option 3 : Framer (la solution la plus efficace aujourd’hui)" },
      { type: "paragraph", text: "Framer est aujourd’hui la solution la plus simple, rapide et performante pour développer un site moderne, surtout après un design Figma." },
      { type: "paragraph", text: "Pourquoi Framer se démarque :" },
      { type: "paragraph", text: "• Pensé pour les designers" },
      { type: "paragraph", text: "• Ultra fluide pour passer de Figma au site" },
      { type: "paragraph", text: "• Animations natives sans complexité" },
      { type: "paragraph", text: "• Excellentes performances" },
      { type: "paragraph", text: "• Parfait pour les landing pages, SaaS, portfolios, sites marketing" },
      { type: "heading", text: "Pourquoi Framer est le meilleur choix dans 90% des cas" },
      { type: "paragraph", text: "Framer permet de garder exactement ce qui fait la force d’un bon site :" },
      { type: "paragraph", text: "• Une structure claire" },
      { type: "paragraph", text: "• Un design propre et épuré" },
      { type: "paragraph", text: "• Un message lisible" },
      { type: "paragraph", text: "• Un CTA toujours visible et prioritaire" },
      { type: "paragraph", text: "• Mettre des A/B tests" },
      { type: "paragraph", text: "Sans ajouter de complexité inutile." },
      { type: "paragraph", text: "C’est l’outil idéal quand :" },
      { type: "paragraph", text: "• Le design est déjà bien pensé" },
      { type: "paragraph", text: "• Le site doit évoluer rapidement" },
      { type: "paragraph", text: "• La performance et la conversion sont prioritaires" },
      { type: "heading", text: "La méthode recommandée" },
      { type: "paragraph", text: "👉 Figma → Framer" },
      { type: "paragraph", text: "• Concevoir le site sur Figma (design + copywriting + structure)" },
      { type: "paragraph", text: "• Valider le message et l’expérience" },
      { type: "paragraph", text: "• Développer sur Framer rapidement" },
      { type: "paragraph", text: "• Publier, tester, itérer" },
      { type: "paragraph", text: "Cette méthode permet de :" },
      { type: "paragraph", text: "• Gagner du temps" },
      { type: "paragraph", text: "• Réduire les coûts" },
      { type: "paragraph", text: "• Créer des sites plus clairs et plus performants" },
      { type: "paragraph", text: "Pour approfondir ce sujet, consultez également capter et diriger l’attention du visiteur et découvrez comment travailler le copywriting de votre page." },
    ],
  },
  {
    id: "4",
    slug: "sous-cta-booster-conversions",
    tagId: "conseils",
    tag: "Conseils",
    title: "Sous-CTA : 7 micro-réassurances pour augmenter les conversions",
    image: { src: "https://framerusercontent.com/images/8PdWCxSP3vfwJJsSMzonZVh0vsA.jpg?width=6009&height=4278", alt: "Sous-CTA : comment booster vos conversions" },
    author: "Louis Staub",
    authorPhoto: { src: "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693" },
    href: "/ressources/sous-cta-booster-conversions",
    breadcrumbTitle: "Conseils",
    updatedAt: "Dernière mise à jour le 15 juin 2026",
    metaDescription: "Sept sous-CTA et micro-réassurances pour réduire les freins sur une landing page, un pricing ou une inscription à un essai gratuit.",
    mainImage: { src: "https://framerusercontent.com/images/8PdWCxSP3vfwJJsSMzonZVh0vsA.jpg?width=6009&height=4278" },
    profilePhoto: { src: "https://framerusercontent.com/images/BifUCVJ8SFvwIJhc7EDr43Gc.jpg?width=693&height=693" },
    about: "",
    authorRole: "",
    authorBio: "",
    content: [
      { type: "heading", text: "Annuler à tout moment" },
      { type: "paragraph", text: "Pourquoi ça marche : Réduit immédiatement la peur de l’engagement. L’utilisateur se dit : “Je peux tester sans être coincé”." },
      { type: "paragraph", text: "Quand l’utiliser : Idéal pour les SaaS avec abonnement, essais gratuits ou offres renouvelables." },
      { type: "heading", text: "Paiement sécurisé" },
      { type: "paragraph", text: "Pourquoi ça marche : Rassure au moment critique où le visiteur hésite à sortir sa carte. Diminue la peur de la fraude et augmente la confiance." },
      { type: "paragraph", text: "Quand l’utiliser : Sur les pages de paiement, pricing, ou toute action impliquant une transaction." },
      { type: "heading", text: "Tu peux améliorer plus tard" },
      { type: "paragraph", text: "Pourquoi ça marche : Supprime la pression psychologique du “choix définitif”. Donne la sensation de commencer petit et d’upgrader plus tard." },
      { type: "paragraph", text: "Quand l’utiliser : Parfait sur le plan le moins cher dans une section pricing. Aide beaucoup à convertir les visiteurs hésitants." },
      { type: "heading", text: "Assistance 24/7" },
      { type: "paragraph", text: "Pourquoi ça marche : Rassure les utilisateurs non techniques. Ils comprennent qu’ils ne seront jamais bloqués seuls." },
      { type: "paragraph", text: "Quand l’utiliser : Pour les SaaS, produits complexes ou toute solution nécessitant un support client." },
      { type: "heading", text: "100 % de résultats garantis" },
      { type: "paragraph", text: "Pourquoi ça marche : Réduit le risque perçu et renforce la promesse. Très efficace pour les conversions à forte valeur ajoutée." },
      { type: "paragraph", text: "Quand l’utiliser : Uniquement si vous pouvez vraiment tenir cette promesse (coaching, outils très précis, services maîtrisés)." },
      { type: "heading", text: "Utilisé par les meilleurs investisseurs" },
      { type: "paragraph", text: "Pourquoi ça marche : Crée une preuve sociale ciblée. Le visiteur se reconnaît dans le groupe cité et se dit : “Des gens comme moi s’en servent”." },
      { type: "paragraph", text: "Quand l’utiliser : À adapter selon la niche : → investisseurs, freelances, designers, agents immobiliers, etc. Toujours utiliser un groupe identique à votre audience." },
      { type: "heading", text: "Pas de carte de crédit demandée" },
      { type: "paragraph", text: "Pourquoi ça marche : Enlève l’un des plus gros freins des essais gratuits : devoir entrer sa carte. Le taux d’inscription monte instantanément." },
      { type: "paragraph", text: "Quand l’utiliser : Sur les SaaS ou outils proposant un essai gratuit. Excellent pour du trafic froid ou tiède." },
      { type: "paragraph", text: "Pour approfondir ce sujet, consultez également concevoir des CTA plus performants et découvrez comment structurer chaque section de votre landing page." },
    ],
  },
  {
    id: "5",
    slug: "questions-sections-landing-page",
    tagId: "conseils",
    tag: "Conseils",
    title: "Structure de landing page : les questions auxquelles chaque section doit répondre",
    image: { src: "https://framerusercontent.com/images/d2Og5Iav1jT2lAb60F50FoBURqQ.jpg?width=6009&height=4278", alt: "Les questions auxquelles chaque section de landing page doit répondre" },
    author: "Louis Staub",
    authorPhoto: { src: "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693" },
    href: "/ressources/questions-sections-landing-page",
    breadcrumbTitle: "Conseils",
    updatedAt: "Dernière mise à jour le 15 juin 2026",
    metaDescription: "Structurez une landing page qui convertit : les questions à traiter dans le hero, les bénéfices, les preuves, l’offre et le CTA.",
    mainImage: { src: "https://framerusercontent.com/images/d2Og5Iav1jT2lAb60F50FoBURqQ.jpg?width=6009&height=4278" },
    profilePhoto: { src: "https://framerusercontent.com/images/BifUCVJ8SFvwIJhc7EDr43Gc.jpg?width=693&height=693" },
    about: "",
    authorRole: "",
    authorBio: "",
    quiz: {
      eyebrow: "Quiz express",
      title: "Quelle section optimiser en priorité ?",
      description: "Répondez à quelques questions pour identifier le point le plus important à travailler sur votre landing page.",
      questions: [
        { question: "Quel est aujourd’hui votre principal objectif ?", answers: ["Obtenir plus de demandes", "Vendre une offre", "Présenter mon activité"] },
        { question: "Que comprennent le moins vos visiteurs ?", answers: ["Ce que je propose", "Pourquoi ils devraient me choisir", "Comment passer à l’action"] },
        { question: "Quelle partie de votre page vous semble la moins convaincante ?", answers: ["Le haut de page", "Les bénéfices et preuves", "L’offre ou le formulaire"] },
      ],
      result: { eyebrow: "Votre piste prioritaire", title: "Clarifier votre proposition de valeur", description: "Commencez par rendre votre promesse, votre audience et le bénéfice principal immédiatement compréhensibles dans le hero de votre landing page." },
      cta: {
        badge: "Recommandé pour vous",
        title: "Faites une refonte de votre landing page maintenant",
        description: "Une refonte claire et orientée conversion peut transformer vos visiteurs en demandes qualifiées.",
        label: "Réserver un appel",
        href: "/30-min",
      },
    },
    content: [
      { type: "paragraph", text: "Une landing page efficace répond aux questions que le visiteur se pose avant même de cliquer. Du hero au CTA, chaque section doit lever un doute précis : comprendre l’offre, croire à la promesse et savoir quoi faire ensuite." },
      { type: "heading", text: "Hero section" },
      { type: "paragraph", text: "**Question à résoudre :** qu’est-ce que vous proposez, pour qui, et pourquoi est-ce utile maintenant ?" },
      { type: "image", src: "https://framerusercontent.com/images/F34W82YeZYoBqjCTLkxVy7nmNvk.png?lossless=1&width=960&height=712", alt: "Exemple de hero section de landing page" },
      { type: "paragraph", text: "Dès les premières secondes, le visiteur doit comprendre **ce que vous faites**, **à qui vous vous adressez** et **le bénéfice principal** qu’il peut obtenir. Un titre trop vague force à chercher l’information ; une promesse claire donne immédiatement une raison de continuer." },
      { type: "heading", text: "À propos" },
      { type: "paragraph", text: "**Question à résoudre :** qui êtes-vous et pourquoi devrais-je vous faire confiance ?" },
      { type: "image", src: "/images/resource-article/landing-page-a-propos.png", alt: "Exemple de section à propos" },
      { type: "paragraph", text: "Cette partie donne un visage à votre entreprise. Elle doit expliquer votre **expertise**, votre manière de travailler et les raisons concrètes qui vous rendent crédible. Une photo, un point de vue clair et des preuves tangibles rendent la promesse plus humaine." },
      { type: "heading", text: "Fonctionnalités" },
      { type: "paragraph", text: "**Question à résoudre :** que permet réellement votre produit ou votre service ?" },
      { type: "image", src: "https://framerusercontent.com/images/R4LWb6dE5ErAebka0CNaIoZjo.png?lossless=1&width=1171&height=789", alt: "Exemple de présentation de fonctionnalités" },
      { type: "paragraph", text: "On entre ici dans le concret. Montrez ce que la personne va utiliser, voir ou recevoir, avec des exemples simples. Le visiteur doit pouvoir relier chaque fonctionnalité à un **usage réel**, sans devoir interpréter un jargon technique." },
      { type: "heading", text: "Bénéfices" },
      { type: "paragraph", text: "**Question à résoudre :** qu’est-ce que cela change concrètement pour moi ?" },
      { type: "image", src: "/images/resource-article/landing-page-benefices.png", alt: "Exemple de section bénéfices : pourquoi Rentala change la donne" },
      { type: "paragraph", text: "Ne répétez pas les fonctionnalités : traduisez-les en résultats. Cette section doit projeter le visiteur dans un avant/après clair, avec les **gains de temps**, de sérénité, de chiffre d’affaires ou de simplicité qu’il peut attendre." },
      { type: "heading", text: "Comment ça marche" },
      { type: "paragraph", text: "**Question à résoudre :** que se passe-t-il après le clic et est-ce vraiment simple ?" },
      { type: "image", src: "https://framerusercontent.com/images/mZi5uW5TqqOtcd6GTIpxOqG5YV0.png?lossless=1&width=1453&height=844", alt: "Exemple de section comment ça marche" },
      { type: "paragraph", text: "Décrivez les étapes de manière rassurante : ce que la personne fait, ce qu’elle reçoit et le temps nécessaire. En rendant le parcours **prévisible et concret**, vous réduisez la peur de la complexité et du temps perdu." },
      { type: "heading", text: "Services / Offre" },
      { type: "paragraph", text: "**Question à résoudre :** qu’est-ce qui est inclus, pour quel niveau d’accompagnement et à quelles conditions ?" },
      { type: "image", src: "/images/resource-article/landing-page-offre.png", alt: "Exemple de présentation d’offre et de tarifs" },
      { type: "paragraph", text: "Une offre lisible évite les interprétations. Faites apparaître les livrables, le périmètre, le rythme et ce qui distingue chaque option. Le visiteur doit savoir **exactement ce qu’il obtient** avant d’envisager le passage à l’action." },
      { type: "heading", text: "Témoignages" },
      { type: "paragraph", text: "**Question à résoudre :** est-ce que des personnes comme moi ont déjà obtenu un résultat ?" },
      { type: "image", src: "/images/resource-article/landing-page-temoignages.png", alt: "Exemple de section témoignages" },
      { type: "paragraph", text: "La preuve sociale rassure lorsqu’elle est précise. Préférez un témoignage qui décrit le contexte, la décision prise et le résultat observé. Des exemples proches de votre audience rendent la promesse **plus crédible et plus concrète**." },
      { type: "heading", text: "Études de cas" },
      { type: "paragraph", text: "**Question à résoudre :** pouvez-vous me montrer une réussite comparable à mon besoin ?" },
      { type: "image", src: "/images/resource-article/landing-page-etude-de-cas.png", alt: "Exemple d’étude de cas" },
      { type: "paragraph", text: "Une étude de cas transforme une affirmation en démonstration. Présentez le problème initial, les choix faits et les résultats, avec des éléments visuels ou chiffrés. Le visiteur doit se dire : **cette méthode peut aussi fonctionner pour moi**." },
      { type: "heading", text: "Footer" },
      { type: "paragraph", text: "**Question à résoudre :** où trouver les informations importantes si je veux vérifier, comparer ou revenir plus tard ?" },
      { type: "image", src: "/images/resource-article/landing-page-footer.png", alt: "Exemple de footer et d’appel à l’action" },
      { type: "paragraph", text: "Le footer clôt le parcours sans le casser. Il rassemble les accès essentiels — contact, pages légales, ressources et réseaux — et prouve que l’entreprise est structurée. C’est le dernier repère de **sérieux et de confiance** avant le départ." },
      { type: "paragraph", text: "Pour approfondir ce sujet, consultez également préparer votre landing page avec neuf questions essentielles et découvrez comment mieux diriger le visiteur dans la page." },
    ],
  },
  {
    id: "6",
    slug: "sourcils-de-texte-conversions",
    tagId: "conseils",
    tag: "Conseils",
    title: "Sourcil de texte : comment clarifier une landing page et augmenter les conversions",
    image: { src: "https://framerusercontent.com/images/5Iq89plOmzymOprhJkXd8dzbTw.jpg?width=6009&height=4278", alt: "Sourcils de texte : comment augmenter les conversions" },
    author: "Louis Staub",
    authorPhoto: { src: "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693" },
    href: "/ressources/sourcils-de-texte-conversions",
    breadcrumbTitle: "Conseils",
    updatedAt: "Dernière mise à jour le 15 juin 2026",
    metaDescription: "Découvrez comment utiliser un sourcil de texte pour donner du contexte, renforcer une preuve et clarifier le message d’une landing page.",
    mainImage: { src: "https://framerusercontent.com/images/5Iq89plOmzymOprhJkXd8dzbTw.jpg?width=6009&height=4278" },
    profilePhoto: { src: "https://framerusercontent.com/images/BifUCVJ8SFvwIJhc7EDr43Gc.jpg?width=693&height=693" },
    about: "",
    authorRole: "",
    authorBio: "",
    content: [
      { type: "paragraph", text: "Un sourcil de texte est une courte ligne au-dessus d’un titre : il donne immédiatement une catégorie, un contexte ou une preuve. Bien utilisé, il clarifie une landing page sans alourdir le message principal." },
      { type: "heading", text: "Annuler à tout moment :" },
      { type: "paragraph", text: "Réduit la peur de l’engagement et rassure les visiteurs hésitants. Idéal pour abonnements ou essais." },
      { type: "heading", text: "Paiement sécurisé :" },
      { type: "paragraph", text: "Renforce la crédibilité au moment clé : parfait pour lever les doutes avant un achat." },
      { type: "heading", text: "Vous pouvez améliorer plus tard :" },
      { type: "paragraph", text: "Écarte l’idée de “choix définitif”. Encourage l’entrée par une offre simple, sans pression." },
      { type: "heading", text: "Assistance 24/7" },
      { type: "paragraph", text: "Montre que l’utilisateur ne sera jamais seul. Très efficace pour les produits techniques." },
      { type: "heading", text: "100% de résultats garantis" },
      { type: "paragraph", text: "Crée une promesse forte tout en diminuant le risque perçu. Convient aux offres très maîtrisées." },
      { type: "heading", text: "Utilisé par les meilleurs investisseurs" },
      { type: "paragraph", text: "Ajoute une preuve sociale premium. Positionnement fort pour les outils pro ou orientés finance." },
      { type: "heading", text: "Pas de carte de crédit demandée" },
      { type: "paragraph", text: "Supprime une énorme friction psychologique. Parfait pour augmenter les inscriptions aux essais gratuits." },
      { type: "heading", text: "Rejoignez +50 000 utilisateurs" },
      { type: "paragraph", text: "Effet de preuve sociale énorme. Montre que votre solution est éprouvée et populaire." },
      { type: "paragraph", text: "Pour approfondir ce sujet, consultez également approfondir le copywriting d’une page qui convertit et découvrez comment améliorer vos appels à l’action." },
    ],
  },
  {
    id: "7",
    slug: "illustrations-hero-section-business",
    tagId: "conseils",
    tag: "Conseils",
    title: "Visuel de hero : quelles images choisir selon votre activité ?",
    image: { src: "https://framerusercontent.com/images/aKOBm22k82Pia4WUiZihroyRQ8.jpg?width=6009&height=4278", alt: "Quelles illustrations choisir pour le hero de son site ?" },
    author: "Louis Staub",
    authorPhoto: { src: "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693" },
    href: "/ressources/illustrations-hero-section-business",
    breadcrumbTitle: "Conseils",
    updatedAt: "Dernière mise à jour le 15 juin 2026",
    metaDescription: "Choisissez le bon visuel de hero pour un SaaS, une agence, un commerce, une application ou un e-commerce afin de rendre votre offre claire.",
    mainImage: { src: "https://framerusercontent.com/images/aKOBm22k82Pia4WUiZihroyRQ8.jpg?width=6009&height=4278" },
    profilePhoto: { src: "https://framerusercontent.com/images/BifUCVJ8SFvwIJhc7EDr43Gc.jpg?width=693&height=693" },
    about: "",
    authorRole: "",
    authorBio: "",
    content: [
      { type: "paragraph", text: "Le visuel de hero doit confirmer en quelques secondes que le visiteur est au bon endroit, qu’il comprend l’offre et qu’il peut lui faire confiance. Le bon choix dépend de votre activité : un SaaS, une agence ou un commerce local ne doit pas montrer les mêmes preuves." },
      { type: "heading", text: "1. SaaS (Software-as-a-Service)" },
      { type: "paragraph", text: "• Vidéo ou illustration d’une fonctionnalité clé" },
      { type: "paragraph", text: "• Zooms de features importantes" },
      { type: "paragraph", text: "• Illustration des problèmes que vous résolvez" },
      { type: "heading", text: "2. Agence (design, marketing, dev)" },
      { type: "paragraph", text: "• Mockups de projets réalisés" },
      { type: "paragraph", text: "• Montages avant/après" },
      { type: "paragraph", text: "• Logos clients + extraits de résultats" },
      { type: "heading", text: "3. Commerces locaux (restaurants, salles de sport, cafés…)" },
      { type: "paragraph", text: "• Photos réelles (pas de stock) du lieu, produits, ambiance" },
      { type: "paragraph", text: "• Personnes en situation d’usage (manger, s’entraîner…)" },
      { type: "paragraph", text: "• Photo de la façade ou intérieur identifiable" },
      { type: "heading", text: "4. Applications mobiles (B2B ou B2C)" },
      { type: "paragraph", text: "• Mockups réalistes de l’app dans un téléphone" },
      { type: "paragraph", text: "• Screens des pages importantes (home, feature clé)" },
      { type: "paragraph", text: "• Mini-animation montrant un flow utilisateur" },
      { type: "heading", text: "5. Startups (pré-lancement, croissance)" },
      { type: "paragraph", text: "• Illustration du problème → solution" },
      { type: "paragraph", text: "• Schéma simple de fonctionnement (3 étapes max)" },
      { type: "paragraph", text: "• Mockup du futur produit si pas encore finalisé" },
      { type: "heading", text: "6. E-commerce / DTC Brands" },
      { type: "paragraph", text: "• Photo produit premium en très haute qualité" },
      { type: "paragraph", text: "• Mise en situation lifestyle (selon la marque)" },
      { type: "paragraph", text: "• Packshot + texture, détails, close-ups" },
      { type: "heading", text: "7. Online Courses & Education" },
      { type: "paragraph", text: "• Photo ou vidéo de l’instructeur" },
      { type: "paragraph", text: "• Photos de l’intérieur du programme (modules, interface)" },
      { type: "paragraph", text: "• Résultats visuels : captures d’avis, témoignages, métriques" },
      { type: "heading", text: "8. Y a-t-il des mots-clés, expressions ou sujets à éviter ou à privilégier ?" },
      { type: "paragraph", text: "Indispensable pour : – rester cohérent avec la marque, – éviter les erreurs de ton, – optimiser le SEO, – ou éviter des termes déclencheurs négatifs pour l’audience." },
      { type: "paragraph", text: "Pour approfondir ce sujet, consultez également guider l’attention dès le hero et découvrez comment associer ce visuel à un CTA efficace." },
    ],
  },
  {
    id: "8",
    slug: "guide-copywriting-page-qui-convertit",
    tagId: "guide",
    tag: "Guide",
    title: "Copywriting de landing page : structurer une page qui convertit",
    image: { src: "https://framerusercontent.com/images/v5hwE4GBukVAfUYJYgoFRgl3us.jpg?width=6009&height=4278", alt: "Guide de copywriting : écrire une page qui fait passer à l’action" },
    author: "Louis Staub",
    authorPhoto: { src: "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693" },
    href: "/ressources/guide-copywriting-page-qui-convertit",
    breadcrumbTitle: "Guide",
    updatedAt: "Dernière mise à jour le 15 juin 2026",
    metaDescription: "Guide de copywriting pour landing page : structurez le message, les preuves, les objections et les appels à l’action sans promesses artificielles.",
    mainImage: { src: "https://framerusercontent.com/images/v5hwE4GBukVAfUYJYgoFRgl3us.jpg?width=6009&height=4278" },
    profilePhoto: { src: "https://framerusercontent.com/images/BifUCVJ8SFvwIJhc7EDr43Gc.jpg?width=693&height=693" },
    about: "",
    authorRole: "",
    authorBio: "",
    content: [
      { type: "paragraph", text: "Le copywriting d’une landing page sert d’abord à rendre l’offre claire, crédible et facile à choisir. Ce guide présente les leviers de message à utiliser avec discernement : promesse, preuve, objection et passage à l’action." },
      { type: "heading", text: "Le choix binaire : agir ou subir" },
      { type: "paragraph", text: "À ce stade, le visiteur a compris le problème et la solution. Il faut maintenant lui montrer qu’il n’existe que deux options :" },
      { type: "paragraph", text: "• Continuer comme avant" },
      { type: "paragraph", text: "• Ou passer à l’action maintenant" },
      { type: "paragraph", text: "Exemple : “Soit vous quittez cette page et rien ne change, soit vous cliquez et votre situation évolue.”" },
      { type: "paragraph", text: "👉 Ce levier crée responsabilité et urgence, sans pression agressive." },
      { type: "heading", text: "L’indifférence bienveillante" },
      { type: "paragraph", text: "Paradoxalement, plus tu montres que tu n’as pas besoin de vendre, plus tu deviens crédible." },
      { type: "paragraph", text: "Exemple : “Si vous ne prenez pas cette offre, quelqu’un d’autre le fera. Je suis là pour aider, pas pour forcer.”" },
      { type: "paragraph", text: "👉 Ce positionnement désactive les mécanismes de défense du visiteur. Inspiré du principe de frame control." },
      { type: "heading", text: "La liberté désarmante" },
      { type: "paragraph", text: "Rappeler explicitement au prospect qu’il est libre de partir crée un effet psychologique puissant." },
      { type: "paragraph", text: "Exemple : “Vous êtes libre de quitter cette page. Mais si vous restez, c’est que vous êtes prêt à changer.”" },
      { type: "paragraph", text: "👉 La liberté redonne du contrôle… et augmente paradoxalement l’engagement." },
      { type: "heading", text: "La polarité : nous vs eux" },
      { type: "paragraph", text: "Diviser le monde en deux camps permet au visiteur de se positionner." },
      { type: "paragraph", text: "Exemple : “Il y a ceux qui parlent. Et ceux qui agissent. De quel côté voulez-vous être ?”" },
      { type: "paragraph", text: "👉 Ce levier joue sur :" },
      { type: "paragraph", text: "• l’appartenance" },
      { type: "paragraph", text: "• l’identité" },
      { type: "paragraph", text: "• le sentiment d’élite" },
      { type: "heading", text: "L’accompagnement mental (guidage)" },
      { type: "paragraph", text: "Plus un achat paraît flou, plus il fait peur. Décrire le processus étape par étape réduit drastiquement la friction." },
      { type: "paragraph", text: "Exemple : “Cliquez sur le bouton → Remplissez vos informations → Accédez immédiatement à votre espace.”" },
      { type: "paragraph", text: "👉 Préfère toujours des termes rassurants comme “commande” plutôt que “paiement”." },
      { type: "heading", text: "L’adieu aux problèmes" },
      { type: "paragraph", text: "Symboliser une rupture nette avec la situation actuelle crée un impact émotionnel fort." },
      { type: "paragraph", text: "Exemple : “Dites adieu aux frustrations, aux blocages et aux échecs répétés.”" },
      { type: "paragraph", text: "👉 Cette étape marque le passage entre l’ancien et le nouveau." },
      { type: "heading", text: "La projection dans le futur (transformation)" },
      { type: "paragraph", text: "Le cerveau humain achète des scénarios, pas des produits." },
      { type: "paragraph", text: "Exemple : “Dans 6 mois, vous pourriez être serein, confiant et libre financièrement.”" },
      { type: "paragraph", text: "Ou plus confrontant :" },
      { type: "paragraph", text: "“Où en seriez-vous aujourd’hui si vous aviez agi il y a 6 mois ?”" },
      { type: "paragraph", text: "👉 La projection rend la décision urgente et personnelle." },
      { type: "heading", text: "Le héros malgré lui" },
      { type: "paragraph", text: "Créer de la proximité passe par la vulnérabilité." },
      { type: "paragraph", text: "Exemple : “Moi aussi, j’étais à votre place. Si j’ai réussi, vous le pouvez aussi.”" },
      { type: "paragraph", text: "👉 Ce levier combine crédibilité + inspiration, sans domination." },
      { type: "heading", text: "Comprendre et utiliser les niveaux d’awareness" },
      { type: "paragraph", text: "Une erreur classique en copywriting : 👉 parler du produit à quelqu’un qui n’est pas encore prêt à l’entendre." },
      { type: "paragraph", text: "Voici les niveaux de conscience à connaître absolument :" },
      { type: "heading", text: "Unaware (inconscient du problème)" },
      { type: "paragraph", text: "On parle d’un bénéfice de vie, jamais du produit." },
      { type: "paragraph", text: "“Comment cette app m’a permis de quitter mon patron.”" },
      { type: "heading", text: "Problem Aware (conscient du problème)" },
      { type: "paragraph", text: "On amplifie la douleur et l’urgence." },
      { type: "paragraph", text: "“80 % des Français n’ont aucune épargne.”" },
      { type: "heading", text: "Solution Aware (conscient qu’une solution existe)" },
      { type: "paragraph", text: "On rend la solution désirable." },
      { type: "paragraph", text: "“Comment certains utilisent une faille légale pour battre les bookmakers.”" },
      { type: "heading", text: "Product Aware (conscient du produit)" },
      { type: "paragraph", text: "On explique comment l’utiliser." },
      { type: "paragraph", text: "“Voici comment accéder gratuitement à cet algorithme.”" },
      { type: "heading", text: "Most Aware (prêt à acheter)" },
      { type: "paragraph", text: "On joue sur l’urgence et la rareté." },
      { type: "paragraph", text: "“32 places rouvertes aujourd’hui uniquement.”" },
      { type: "paragraph", text: "Pour approfondir ce sujet, consultez également les meilleures pratiques pour créer des CTA et découvrez comment définir précisément votre avatar client." },
    ],
  },
  {
    id: "9",
    slug: "capter-attention-visiteur-landing-page",
    tagId: "guide",
    tag: "Guide",
    title: "Capter l’attention sur une landing page : 6 principes de design et de conversion",
    image: { src: "https://framerusercontent.com/images/ZIGOnBSBx1rmv0U9MtaO0Q2nc.jpg?width=6009&height=4278", alt: "Comment capter l’attention d’un visiteur sur une landing page" },
    author: "Louis Staub",
    authorPhoto: { src: "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693" },
    href: "/ressources/capter-attention-visiteur-landing-page",
    breadcrumbTitle: "Guide",
    updatedAt: "Dernière mise à jour le 15 juin 2026",
    metaDescription: "Six principes de design et de conversion pour capter l’attention sur une landing page, clarifier l’offre et guider le visiteur vers le CTA.",
    mainImage: { src: "https://framerusercontent.com/images/ZIGOnBSBx1rmv0U9MtaO0Q2nc.jpg?width=6009&height=4278" },
    profilePhoto: { src: "https://framerusercontent.com/images/BifUCVJ8SFvwIJhc7EDr43Gc.jpg?width=693&height=693" },
    about: "",
    authorRole: "",
    authorBio: "",
    content: [
      { type: "paragraph", text: "Pour capter l’attention sur une landing page, rendez l’offre, la hiérarchie et le CTA compréhensibles dès le scan. Les visiteurs ne lisent pas tout : ils repèrent des signaux qui les aident à décider s’ils continuent." },
      { type: "image", src: "https://framerusercontent.com/images/27DQ3W9Lc2QOcQAv9scQsvbYA.png", alt: "Comment capter l’attention d’un visiteur sur une landing page — illustration 1" },
      { type: "heading", text: "1. Un design épuré pour capter l’attention immédiatement" },
      { type: "paragraph", text: "Quand on parle de “bon design”, on ne parle pas de quelque chose de spectaculaire. On parle d’un design clair, lisible et compréhensible instantanément." },
      { type: "paragraph", text: "Un design épuré, c’est :" },
      { type: "paragraph", text: "• Pas de textes longs" },
      { type: "paragraph", text: "• Pas d’images inutiles" },
      { type: "paragraph", text: "• Pas 15 couleurs différentes" },
      { type: "paragraph", text: "• Pas de dégradés partout sans logique" },
      { type: "paragraph", text: "Le visiteur doit comprendre en quelques secondes :" },
      { type: "paragraph", text: "• ce que fait le business" },
      { type: "paragraph", text: "• où il est" },
      { type: "paragraph", text: "• quoi faire ensuite" },
      { type: "paragraph", text: "Certains designs vus sur Dribbble sont très beaux… mais ne convertissent pas." },
      { type: "paragraph", text: "Le but n’est pas d’impressionner. Le but est de faire cliquer." },
      { type: "paragraph", text: "👉 On commence donc toujours par :" },
      { type: "paragraph", text: "• un titre clair" },
      { type: "paragraph", text: "• un sous-titre court" },
      { type: "paragraph", text: "• un CTA visible" },
      { type: "heading", text: "2. Une structure pensée pour des visiteurs qui ne lisent pas" },
      { type: "paragraph", text: "Les visiteurs ne lisent pas les paragraphes. Ils lisent surtout :" },
      { type: "paragraph", text: "• les titres" },
      { type: "paragraph", text: "• quelques mots clés" },
      { type: "paragraph", text: "• la structure globale" },
      { type: "paragraph", text: "C’est pour ça qu’une bonne page doit créer de vraies lignes directrices visuelles." },
      { type: "image", src: "https://framerusercontent.com/images/4IssliZBSs0mkuIOaw1vz5IS1U.png", alt: "Comment capter l’attention d’un visiteur sur une landing page — illustration 2" },
      { type: "heading", text: "3. Créer des lignes directrices vers le CTA" },
      { type: "paragraph", text: "L’objectif est simple : amener naturellement l’œil vers le CTA." },
      { type: "paragraph", text: "Une technique très efficace consiste à jouer sur la longueur des textes :" },
      { type: "paragraph", text: "• un texte un peu plus long" },
      { type: "paragraph", text: "• puis plus court" },
      { type: "paragraph", text: "• puis encore plus court" },
      { type: "paragraph", text: "Visuellement, cela crée une forme d’entonnoir. Et tout en bas de cet entonnoir : le CTA." },
      { type: "paragraph", text: "Même de loin, l’œil comprend le chemin. Et le regard est automatiquement guidé vers le bouton." },
      { type: "paragraph", text: "⚠️ Ce principe ne fonctionne pas uniquement en layout centré. Il fonctionne aussi :" },
      { type: "paragraph", text: "• en alignement à gauche" },
      { type: "paragraph", text: "• dans des layouts plus complexes" },
      { type: "paragraph", text: "On le retrouve sur la majorité des grands sites." },
      { type: "paragraph", text: "Résultat : 👉 plus de clics sur le CTA." },
      { type: "image", src: "https://framerusercontent.com/images/B2Igv64ZNocaM60RB2kQ2Jv2IhY.png", alt: "Comment capter l’attention d’un visiteur sur une landing page — illustration 3" },
      { type: "heading", text: "4. Utiliser le regard humain pour guider l’attention" },
      { type: "paragraph", text: "Il y a un comportement naturel très puissant : on regarde toujours ce que regarde un humain." },
      { type: "paragraph", text: "Sur beaucoup de sites, on affiche des visages… mais ces visages regardent droit devant." },
      { type: "paragraph", text: "C’est une erreur." },
      { type: "paragraph", text: "Si un humain regarde :" },
      { type: "paragraph", text: "• le titre" },
      { type: "paragraph", text: "• ou le CTA" },
      { type: "paragraph", text: "Alors le visiteur regardera exactement au même endroit." },
      { type: "paragraph", text: "Le parcours devient :" },
      { type: "paragraph", text: "• on voit l’humain" },
      { type: "paragraph", text: "• on regarde ses yeux" },
      { type: "paragraph", text: "• on suit son regard" },
      { type: "paragraph", text: "• on tombe sur le CTA" },
      { type: "paragraph", text: "C’est une technique très simple et très efficace pour augmenter la conversion." },
      { type: "image", src: "https://framerusercontent.com/images/M6waxY3fm9VwVpyb3RoJorktg4.png", alt: "Comment capter l’attention d’un visiteur sur une landing page — illustration 4" },
      { type: "heading", text: "5. La correspondance de couleurs (color matching)" },
      { type: "paragraph", text: "Le color matching consiste à créer un lien visuel subtil entre les éléments." },
      { type: "paragraph", text: "Exemple :" },
      { type: "paragraph", text: "• le CTA est bleu" },
      { type: "paragraph", text: "• le t-shirt de l’humain est très légèrement bleuté" },
      { type: "paragraph", text: "Ce n’est presque pas visible consciemment, mais l’œil fait automatiquement le lien." },
      { type: "paragraph", text: "Résultat :" },
      { type: "paragraph", text: "• le CTA ressort davantage" },
      { type: "paragraph", text: "• le regard est naturellement attiré vers le bouton" },
      { type: "paragraph", text: "Ce n’est pas une question d’ajouter des couleurs, mais de les faire correspondre intelligemment." },
      { type: "image", src: "https://framerusercontent.com/images/OVfCDhMUEww8O5ZIxogVtPljViM.png", alt: "Comment capter l’attention d’un visiteur sur une landing page — illustration 5" },
      { type: "heading", text: "6. Utiliser le mouvement pour renforcer l’attention" },
      { type: "paragraph", text: "L’œil humain est naturellement attiré par le mouvement." },
      { type: "paragraph", text: "On peut l’utiliser de plusieurs façons :" },
      { type: "paragraph", text: "• une petite animation" },
      { type: "paragraph", text: "• un élément qui défile" },
      { type: "paragraph", text: "• un curseur qui clique sur un CTA" },
      { type: "paragraph", text: "Même une animation très légère suffit." },
      { type: "paragraph", text: "Le mouvement fait ressortir le CTA, et attire immédiatement le regard dessus." },
      { type: "paragraph", text: "Autre possibilité :" },
      { type: "paragraph", text: "• des images qui défilent légèrement en diagonale" },
      { type: "paragraph", text: "Cela renforce encore les lignes directrices visuelles et guide l’œil dans une direction précise." },
      { type: "paragraph", text: "Si le mouvement est bien orienté, il conduit directement vers le CTA." },
      { type: "paragraph", text: "Pour approfondir ce sujet, consultez également optimiser vos CTA et découvrez comment utiliser les sourcils de texte." },
    ],
  },
  {
    id: "10",
    slug: "trouver-avatar-client-guide",
    tagId: "guide",
    tag: "Guide",
    title: "Comment définir son avatar client pour écrire une landing page plus convaincante",
    image: { src: "https://framerusercontent.com/images/jmaC3nMJCrF0OvoTJL9X8VH3QyQ.jpg?width=6009&height=4278", alt: "Comment trouver son avatar client : le guide ultime" },
    author: "Louis Staub",
    authorPhoto: { src: "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693" },
    href: "/ressources/trouver-avatar-client-guide",
    breadcrumbTitle: "Guide",
    updatedAt: "Dernière mise à jour le 15 juin 2026",
    metaDescription: "Définissez un avatar client exploitable pour votre landing page : besoins, objections, vocabulaire, données disponibles et questions à poser.",
    mainImage: { src: "https://framerusercontent.com/images/jmaC3nMJCrF0OvoTJL9X8VH3QyQ.jpg?width=6009&height=4278" },
    profilePhoto: { src: "https://framerusercontent.com/images/BifUCVJ8SFvwIJhc7EDr43Gc.jpg?width=693&height=693" },
    about: "",
    authorRole: "",
    authorBio: "",
    content: [
      { type: "paragraph", text: "Un avatar client utile ne se limite pas à un âge ou à un poste. Il rassemble les besoins, objections, mots et situations qui vous permettent d’écrire une landing page réellement convaincante." },
      { type: "heading", text: "1) Comprendre profondément son client" },
      { type: "paragraph", text: "La pire erreur : observer les concurrents… et les copier. La bonne démarche : comprendre pourquoi leur message fonctionne et surtout à qui il s’adresse." },
      { type: "paragraph", text: "Avant d’écrire une seule ligne, on doit savoir précisément :" },
      { type: "paragraph", text: "• Qui est ton client (âge, job, lieu, niveau de vie)." },
      { type: "paragraph", text: "• Ses croyances (valeurs, éducation, influences)." },
      { type: "paragraph", text: "• Ses peurs, frustrations, désirs et rêves." },
      { type: "paragraph", text: "• Ses échecs, ses tentatives et ses victoires passées." },
      { type: "paragraph", text: "C’est ce socle qui donne un texte qui sonne juste." },
      { type: "heading", text: "2) Découvrir son “logiciel interne”" },
      { type: "paragraph", text: "Les croyances façonnent la manière dont ton prospect perçoit les mots. Elles ne s’écrivent pas, mais elles influencent le ton, l’angle, l’émotion." },
      { type: "paragraph", text: "Un même message peut être perçu comme inspirant par quelqu’un… et inutile par un autre. Comprendre ce logiciel interne, c’est parler exactement dans la fréquenc e du prospect." },
      { type: "heading", text: "3) Identifier les systèmes qu’il accuse" },
      { type: "paragraph", text: "Les humains ne s’accusent jamais eux-mêmes : ils blâment une force extérieure (industrie, société, méthodes inefficaces…)." },
      { type: "paragraph", text: "Pointer ces “responsables” crée immédiatement une connexion émotionnelle forte : « Ce n’est pas votre faute… »" },
      { type: "heading", text: "4) Comprendre le rôle social qu’il veut jouer" },
      { type: "paragraph", text: "Chaque personne a un rôle qu’elle rêve d’incarner : être admiré, compétent, désiré, respecté, libre…" },
      { type: "paragraph", text: "Quand ton texte décrit précisément ce rôle, le prospect pense : « Enfin quelqu’un qui me comprend »." },
      { type: "heading", text: "5) Construire un avatar complet et vivant" },
      { type: "paragraph", text: "Un bon avatar n’est pas un profil vague : c’est un personnage concret, incarné, identifiable." },
      { type: "paragraph", text: "Donne-lui :" },
      { type: "paragraph", text: "• un prénom, un âge, un métier, une ville" },
      { type: "paragraph", text: "• une photo" },
      { type: "paragraph", text: "• ses habitudes" },
      { type: "paragraph", text: "• ses traits de personnalité" },
      { type: "paragraph", text: "• sa situation familiale" },
      { type: "paragraph", text: "Ensuite, écris comme si tu parlais juste avec lui." },
      { type: "heading", text: "6) Parler dans le langage exact du marché" },
      { type: "paragraph", text: "Ton langage ≠ celui de ton client. Reprends ses mots, ses insultes, ses peurs, ses exagérations, ses expressions." },
      { type: "paragraph", text: "Le texte doit ressembler à sa pensée interne, pas à un article de blog poli." },
      { type: "paragraph", text: "Pour approfondir ce sujet, consultez également répondre aux questions indispensables avant de créer votre landing page et découvrez comment adapter votre copywriting à cet avatar." },
    ],
  },

  {
    id: "component-library",
    slug: "bibliotheque-composants-article",
    tagId: "outils",
    tag: "Outils",
    title: "Bibliothèque des composants éditoriaux",
    image: { src: "https://framerusercontent.com/images/OVfCDhMUEww8O5ZIxogVtPljViM.png", alt: "Bibliothèque des composants éditoriaux" },
    author: "Louis Staub",
    authorPhoto: { src: LOUIS },
    href: "/ressources/bibliotheque-composants-article",
    breadcrumbTitle: "Bibliothèque de composants",
    updatedAt: "Dernière mise à jour le 25 août 2026",
    modifiedAt: "2026-08-25",
    noIndex: true,
    hiddenFromListing: true,
    metaDescription: "Bibliothèque interne des composants éditoriaux disponibles pour construire et vérifier les articles Ruff Agency.",
    mainVideo: { src: "/videos/landing-page-hero.mp4", poster: "https://framerusercontent.com/images/OVfCDhMUEww8O5ZIxogVtPljViM.png", title: "Exemple de vidéo principale d’un article" },
    profilePhoto: { src: LOUIS_PROFILE },
    about: "",
    authorRole: "Expert web designer",
    authorBio: "J’aide les entreprises à transformer leur site en un outil clair, crédible et pensé pour convertir grâce au web design, à la stratégie et à l’expérience utilisateur.",
    quiz: {
      eyebrow: "Quiz intégré au contenu",
      title: "Quel format éditorial convient le mieux ?",
      description: "Un exemple complet pour vérifier le quiz sous le média principal.",
      questions: [
        { question: "Vous voulez comparer plusieurs catégories.", answers: ["Graphique en barres", "Citation", "Avertissement"] },
        { question: "Vous voulez montrer une progression dans le temps.", answers: ["Area chart", "Tableau", "Carte"] },
      ],
      result: { eyebrow: "Résultat", title: "Le format doit servir l’idée", description: "Choisissez le composant qui réduit le plus vite l’effort de compréhension." },
      cta: { variant: "audit", badge: "Réponse en moins de 48h", title: "Recevez un audit personnalisé de votre site par des experts", availability: "3 places disponibles pour Juin" },
    },
    content: [
      { type: "paragraph", text: "Cette page rassemble **tous les composants éditoriaux disponibles**. Chaque bloc est nommé pour faciliter la revue puis la création de nouveaux articles." },
      { type: "heading", text: "Texte et information contextuelle" },
      { type: "paragraph", text: "Le paragraphe est le format par défaut. Le gras sert à mettre en avant une idée sans créer un nouveau bloc." },
      { type: "inline-info", text: "Taux de conversion", explanation: "Part des visiteurs qui réalisent l’action attendue, par exemple envoyer un formulaire ou réserver un appel." },
      { type: "heading", text: "Image et vidéo dans le contenu" },
      { type: "image", src: "https://framerusercontent.com/images/OVfCDhMUEww8O5ZIxogVtPljViM.png", alt: "Exemple d’image éditoriale" },
      { type: "before-after", before: { src: "/images/resource-article/landing-page-a-propos.png", alt: "Version avant de la section" }, after: { src: "/images/resource-article/landing-page-benefices.png", alt: "Version après de la section" }, beforeLabel: "Avant", afterLabel: "Après" },
      { type: "video", src: "/videos/landing-page-hero.mp4", title: "Exemple de vidéo éditoriale" },
      { type: "heading", text: "Listes éditoriales" },
      { type: "highlight-list", items: [{ label: "Idée prioritaire mise en évidence", children: ["Le détail reste lisible sans prendre le dessus."] }, { label: "Deuxième idée forte" }] },
      { type: "bullet-list", items: [{ label: "Point de lecture classique", children: ["Sous-point optionnel"] }, { label: "Autre point utile" }] },
      { type: "heading", text: "Tableaux comparatifs" },
      { type: "table", columns: ["Format", "Objectif", "Densité"], rows: [["Paragraphe", "Expliquer", "Moyenne"], ["Encadré", "Faire retenir", "Faible"], ["Graphique", "Montrer une relation", "Variable"]] },
      { type: "table", highlightFirstColumn: true, columns: ["Canal", "Découverte", "Évaluation", "Décision"], rows: [["SEO", "Fort", "Moyen", "Faible"], ["Email", "Moyen", "Fort", "Fort"], ["Social", "Fort", "Moyen", "Moyen"]] },
      { type: "heading", text: "Encadrés et citation" },
      { type: "callout", variant: "info", title: "Information importante", text: "À utiliser lorsqu’un contexte mérite d’être isolé du fil principal." },
      { type: "callout", variant: "education", title: "À retenir", text: "À utiliser pour synthétiser une règle ou une méthode actionnable." },
      { type: "callout", variant: "warning", title: "Point de vigilance", text: "À réserver aux risques, limites et erreurs coûteuses." },
      { type: "quote", text: "Un composant éditorial est utile quand il rend une relation plus évidente que le texte seul." },
      { type: "point-cards", items: [{ title: "Clarté", text: "Un point complémentaire avec une hiérarchie forte.", icon: "academic" }, { title: "Action", text: "Une seconde idée directement liée à la première.", icon: "education" }] },
      { type: "heading", text: "Listes de contenu et liens internes" },
      { type: "content-list", variant: "summary", title: "Résumé du chapitre", items: [{ label: "Une idée essentielle" }, { label: "Une décision à prendre" }] },
      { type: "content-list", variant: "sources", title: "Références", items: [{ label: "Documentation Bklit", href: "https://bklit.com/docs/installation" }] },
      { type: "article-link", slug: "questions-sections-landing-page", label: "Lire aussi : les questions à traiter dans chaque section" },
      { type: "heading", text: "Graphique en barres — Bar chart" },
      { type: "chart", variant: "bar", title: "Comparer des catégories", description: "Pour comparer clairement des valeurs distinctes." },
      { type: "heading", text: "Graphique de surface — Area chart" },
      { type: "chart", variant: "area", title: "Montrer une évolution", description: "Pour visualiser une tendance ou un volume dans le temps." },
      { type: "heading", text: "Flux — Sankey chart" },
      { type: "chart", variant: "sankey", title: "Comprendre les flux", description: "Pour montrer comment un volume se répartit entre plusieurs destinations." },
      { type: "heading", text: "Intensité — Heatmap chart" },
      { type: "chart", variant: "heatmap", title: "Repérer les zones d’intensité", description: "Pour faire apparaître des rythmes et concentrations dans une matrice." },
      { type: "heading", text: "Étapes — Funnel chart" },
      { type: "chart", variant: "funnel", title: "Visualiser une conversion", description: "Pour suivre la perte de volume entre plusieurs étapes." },
      { type: "heading", text: "Géographie — Choropleth chart" },
      { type: "chart", variant: "choropleth", title: "Comparer des zones géographiques", description: "Pour comparer un indicateur par territoire, avec zoom et infobulle." },
      { type: "heading", text: "CTA audit dans le contenu" },
      { type: "cta", variant: "audit", eyebrow: "Réponse en moins de 48h", title: "Recevez un audit personnalisé de votre site par des experts", availability: "3 places disponibles pour Juin" },
      { type: "heading", text: "CTA de recommandation du quiz" },
      { type: "cta", variant: "quiz", eyebrow: "Recommandé pour vous", title: "Votre landing page mérite une refonte pensée pour convertir.", description: "Réservez un appel pour identifier les opportunités les plus importantes sur votre site.", label: "Réserver un appel", href: "/30-min" },
      { type: "faq", title: "FAQ liée à l’article", items: [
        { question: "La FAQ est-elle obligatoire dans un article ?", answer: "Non. Ce bloc est entièrement optionnel : ajoutez-le seulement lorsqu’il permet de répondre à des questions utiles qui prolongent vraiment la lecture de l’article." },
        { question: "Comment ajouter une nouvelle question ?", answer: "Dans le CMS, ajoutez simplement une entrée avec une question et sa réponse dans la liste du bloc FAQ. L’accordéon et les séparateurs sont générés automatiquement." },
      ] },
    ],
  },
  createRuffArticle({
    id: "prix-creation-site-internet",
    slug: "combien-coute-creation-site-internet",
    tagId: "guide",
    tag: "Guide",
    title: "Combien coûte la création d’un site internet ?",
    breadcrumbTitle: "Prix d’un site internet",
    updatedAt: "Dernière mise à jour le 28 septembre 2026",
    publishedAt: "2026-09-28",
    modifiedAt: "2026-09-28",
    metaDescription: "Prix d’un site vitrine, d’une landing page ou d’un e-commerce : fourchettes 2026, coûts à prévoir et critères pour comparer un devis.",
    image: {
      src: "/images/ressources/prix-creation-site-internet.webp",
      alt: "Combien coûte la création d’un site internet ? — Ruff Agency",
    },
    mainImage: {
      src: "/images/ressources/prix-creation-site-internet.webp",
      alt: "Combien coûte la création d’un site internet ? — Ruff Agency",
    },
    quiz: {
      eyebrow: "Estimateur de budget",
      title: "Quel budget prévoir pour votre site internet ?",
      description: "Répondez à trois questions pour obtenir une première fourchette indicative selon votre projet.",
      questions: [
        { question: "Quel type de site souhaitez-vous créer ?", answers: [{ label: "Une landing page", resultId: "landing" }, { label: "Un site vitrine de 5 à 7 pages", resultId: "vitrine" }, { label: "Un site vitrine plus complet, de 8 à 15 pages", resultId: "vitrinePremium" }] },
        { question: "Quel périmètre de pages envisagez-vous ?", answers: [{ label: "Une page dédiée à une offre", resultId: "landing" }, { label: "Environ 5 à 7 pages", resultId: "vitrine" }, { label: "Environ 8 à 15 pages", resultId: "vitrinePremium" }] },
        { question: "De quel niveau de fonctionnalités avez-vous besoin ?", answers: [{ label: "Un formulaire et une page orientée conversion", resultId: "landing" }, { label: "Un CMS et quelques intégrations", resultId: "vitrine" }, { label: "Plusieurs parcours, contenus ou intégrations spécifiques", resultId: "vitrinePremium" }] },
      ],
      result: { eyebrow: "Fourchette indicative", title: "Votre estimation est prête", description: "Cette estimation donne un premier repère. Le prix réel dépend du périmètre, des contenus, du design et des fonctionnalités détaillés dans le devis." },
      results: {
        landing: { eyebrow: "Budget repère · Landing page", title: "Jusqu’à 4 000 €", description: "C’est la borne haute de la fourchette publiée pour une landing page. Elle correspond à un périmètre plus poussé en stratégie, rédaction, design et intégration ; ce montant reste une estimation, pas un devis." },
        vitrine: { eyebrow: "Budget repère · Site vitrine", title: "Jusqu’à 8 000 €", description: "C’est la borne haute de la fourchette publiée pour un site vitrine de 5 à 7 pages. Le niveau de personnalisation, les contenus et l’autonomie de mise à jour font varier le budget ; ce montant reste indicatif." },
        vitrinePremium: { eyebrow: "Budget repère · Site vitrine complet", title: "Jusqu’à 10 000 €", description: "C’est la borne haute de la fourchette publiée pour un site vitrine plus complet. La direction artistique, la stratégie, les contenus et les pages spécifiques déterminent le budget final ; ce montant reste indicatif." },
      },
      tieBreakResultId: "vitrine",
      cta: {
        variant: "recommendation",
        badge: "Une offre claire, sans compromis sur la qualité",
        title: "Une landing page conçue pour convertir, pas juste pour être en ligne.",
        description: "On conçoit des landing pages avec stratégie, design sur mesure et développement soigné. Notre offre démarre à 1 450 € : le périmètre exact est confirmé avec vous avant le projet.",
        label: "On fait des landing pages pour 1 450 €",
        href: "/services/landing-page",
      },
    },
    about: "Des repères pour comprendre le prix de création d’un site internet, comparer les périmètres et prévoir les coûts après la mise en ligne.",
    sources: [
      { label: "Baromètre des prix publics de création de site web en France (relevé du 11 juin 2026) — Les Créavores, data.gouv.fr", href: "https://www.data.gouv.fr/datasets/barometre-des-prix-de-creation-de-site-web-en-france-2026" },
      { label: "Prix d’un site internet en 2026 : fourchettes publiées par type de projet — Codecircle", href: "https://codecircle.fr/prix-site-internet/" },
      { label: "Tarif de création d’un site internet : repères et prestations détaillées — ClicStudio", href: "https://clicstudio.fr/blog/tarif-creation-site-internet/" },
      { label: "Offres de création, refonte et accompagnement — Gemeos", href: "https://www.gemeosagency.com/fr/offres" },
    ],
    content: [
      { type: "paragraph", text: "Le prix de création d’un site internet peut aller de quelques centaines d’euros à plusieurs dizaines de milliers. Un site vitrine, une landing page et un e-commerce ne demandent ni le même travail ni les mêmes fonctionnalités. Pour un premier repère, le guide tarifaire 2026 de Codecircle situe un site vitrine de 5 à 7 pages entre **1 500 € et 8 000 €** selon le prestataire, un e-commerce entre **3 000 € et 20 000 €**, et un site sur mesure entre **8 000 € et 50 000 € ou plus**. Ce sont des fourchettes publiées, pas un tarif officiel ni une moyenne représentative de toutes les agences.", links: [{ text: "Codecircle", href: "https://codecircle.fr/prix-site-internet/" }] },
      { type: "image", src: "/images/ressources/prix-creation-site-internet.webp", alt: "Visuel de l’article : Combien coûte la création d’un site internet ?" },
      { type: "callout", variant: "info", icon: "info", title: "Un chiffre n’a de sens qu’avec son périmètre", text: "Avant de comparer deux prix, vérifiez le nombre de pages, les fonctionnalités, les contenus, le niveau de design, le SEO, la maintenance et la propriété du site. Les sources publiques ne précisent pas toujours si leurs tarifs sont HT ou TTC : vérifiez ce point sur chaque devis." },
      { type: "heading", text: "Quel est le prix d’un site selon son type ?" },
      { type: "paragraph", text: "Le tableau reprend des fourchettes publiées pour le marché français en 2026. Les catégories et les périmètres diffèrent selon les prestataires : utilisez-les pour préparer votre budget, puis comparez des devis portant sur le même besoin." },
      { type: "table", columns: ["Type de projet", "Repères de prix publiés", "Ce qui pèse dans le budget"], rows: [["Landing page", "500 € à 4 000 €", "Structure, rédaction, design et objectif de conversion"], ["Site vitrine (5 à 7 pages)", "1 500 € à 8 000 €", "Nombre de modèles, contenus, design et autonomie de mise à jour"], ["Site vitrine premium (8 à 15 pages)", "2 500 € à 10 000 €", "Direction artistique, stratégie, contenus et pages spécifiques"], ["Site e-commerce", "3 000 € à 20 000 €", "Catalogue, paiement, livraison, variantes et migration"], ["Site sur mesure ou espace membre", "8 000 € à 50 000 € et plus", "Règles métier, comptes, intégrations et développement spécifique"]] },
      { type: "paragraph", text: "Ces repères reprennent notamment les fourchettes détaillées par Codecircle, qui distingue freelance ou petite agence et agence classique. D’autres grilles, comme celle de ClicStudio, retiennent leurs propres prix et périmètres. Le jeu de données des Créavores publié sur data.gouv.fr rassemble 103 tarifs publics relevés en juin 2026 ; il s’agit d’un inventaire de prix affichés, pas d’une étude statistique représentative.", links: [{ text: "Codecircle", href: "https://codecircle.fr/prix-site-internet/" }, { text: "ClicStudio", href: "https://clicstudio.fr/blog/tarif-creation-site-internet/" }, { text: "data.gouv.fr", href: "https://www.data.gouv.fr/datasets/barometre-des-prix-de-creation-de-site-web-en-france-2026" }] },
      { type: "article-link", slug: "combien-coute-landing-page", label: "Voir combien coûte une landing page" },
      { type: "heading", text: "Pourquoi deux devis peuvent-ils autant varier ?" },
      { type: "paragraph", text: "Le nombre de pages ne suffit pas à expliquer le prix. Ce qui compte, c’est le travail nécessaire pour rendre le site utile, cohérent avec l’activité et prêt à évoluer." },
      { type: "bullet-list", items: [{ label: "", children: ["Cadrage et stratégie : ateliers, recherche utilisateur, positionnement et architecture des pages."] }, { label: "", children: ["Design : adaptation d’un modèle existant ou création d’une direction artistique sur mesure."] }, { label: "", children: ["Contenus : textes, photos, illustrations, traductions et intégration des contenus fournis."] }, { label: "", children: ["Fonctionnalités : CMS, formulaires avancés, réservation, paiement, espace membre ou connexion à un CRM."] }, { label: "", children: ["Qualité de livraison : responsive, accessibilité, performances, SEO technique, tests, formation et documentation."] }] },
      { type: "article-link", slug: "developper-site-efficacement", label: "Voir la méthode pour créer un site efficacement" },
      { type: "heading", text: "Freelance, agence ou plateforme : que paie-t-on ?" },
      { type: "table", columns: ["Option", "Ce que vous payez", "À vérifier"], rows: [["Créer le site soi-même", "Abonnement éventuel et temps passé à concevoir, intégrer et maintenir le site", "Limites du forfait, personnalisation et portabilité"], ["Faire appel à un freelance", "Les compétences et le temps d’une personne ou d’un petit collectif", "Disponibilité, compétences couvertes et continuité du projet"], ["Faire appel à une agence", "Cadrage et coordination de plusieurs expertises selon la mission", "Équipe mobilisée, livrables et interlocuteur après livraison"]] },
      { type: "paragraph", text: "Le mot « agence » ne garantit pas à lui seul un périmètre plus complet, et un freelance ne signifie pas automatiquement une prestation moins sérieuse. Demandez qui prend en charge chaque partie du projet et ce qui vous est remis à la fin." },
      { type: "heading", text: "Quels frais prévoir après la mise en ligne ?" },
      { type: "paragraph", text: "Le devis de création ne représente pas toujours le coût total. Selon la solution choisie, certains frais reviennent chaque mois ou chaque année ; d’autres apparaissent lorsque vous faites évoluer le site." },
      { type: "bullet-list", items: [{ label: "Nom de domaine et hébergement ou abonnement de plateforme" }, { label: "Licences, thèmes, extensions et services connectés" }, { label: "Maintenance, sauvegardes, sécurité et mises à jour" }, { label: "Création de nouvelles pages et évolution des fonctionnalités" }, { label: "Rédaction, référencement et production de visuels" }, { label: "Frais de paiement ou commissions pour une boutique en ligne" }] },
      { type: "callout", variant: "education", icon: "education", title: "Calculez le coût sur plusieurs années", text: "Coût de la première année = création + domaine et hébergement ou abonnement + licences + maintenance + contenus et évolutions prévues. Recommencez pour les années suivantes : certains frais disparaissent, d’autres se répètent." },
      { type: "heading", text: "Comment comparer deux devis de création de site ?" },
      { type: "bullet-list", items: [{ label: "", children: ["Même périmètre : objectif, pages, langues, contenus, fonctionnalités et contraintes techniques."] }, { label: "", children: ["Étapes détaillées : cadrage, conception, développement, intégration, tests et mise en ligne."] }, { label: "", children: ["Inclusions et exclusions : SEO, rédaction, hébergement, licences, formation et maintenance."] }, { label: "", children: ["Propriété et accès : domaine, fichiers, CMS, comptes et conditions de reprise par un autre prestataire."] }, { label: "", children: ["Coût après livraison : abonnements, support, modifications et éventuels frais de sortie."] }] },
      { type: "article-link", slug: "questions-sections-landing-page", label: "Découvrir les questions à traiter sur chaque page" },
      { type: "cta", variant: "quiz", eyebrow: "Votre projet de site", title: "Un budget fiable commence par un périmètre clair", description: "Présentez vos objectifs, vos contenus et vos contraintes pour identifier le bon format de site et les prochaines étapes.", label: "Découvrir notre service de création de site", href: "/services/website" },
      { type: "faq", title: "Questions fréquentes sur le prix d’un site internet", items: [{ question: "Quel budget prévoir pour un site vitrine professionnel ?", answer: "Les guides tarifaires consultés en 2026 publient des fourchettes différentes selon le prestataire et le périmètre. Pour un site vitrine de 5 à 7 pages, l’un d’eux indique 1 500 € à 8 000 €. Le design, les contenus, le SEO et les fonctionnalités peuvent faire évoluer le montant." }, { question: "Combien coûte une landing page ?", answer: "Le prix varie selon qu’il s’agit d’un modèle adapté ou d’une page conçue sur mesure, et selon que la stratégie, le copywriting, l’intégration et les tests sont inclus. Un guide de tarifs 2026 consulté pour cet article indique 500 € à 4 000 € selon le prestataire." }, { question: "Le prix d’un site internet inclut-il l’hébergement ?", answer: "Pas toujours. L’hébergement peut être inclus, facturé à part ou remplacé par un abonnement de plateforme. Vérifiez aussi le renouvellement du domaine, les licences, les sauvegardes et la maintenance." }, { question: "Pourquoi les tarifs d’agence sont-ils différents ?", answer: "Les agences ne proposent pas toutes le même niveau de cadrage, de design, de développement ou d’accompagnement. Comparez les livrables, les compétences mobilisées, les frais récurrents et les responsabilités après mise en ligne." }, { question: "Comment obtenir des devis comparables ?", answer: "Envoyez aux prestataires le même brief : objectif, type de site, pages, fonctionnalités, contenus, délais et contraintes. Demandez un devis détaillé qui distingue la création, les coûts récurrents et les options." }] },
    ],
  }),
  createRuffArticle({
    id: "prix-landing-page",
    slug: "combien-coute-landing-page",
    tagId: "guide",
    tag: "Guide",
    title: "Combien coûte une landing page ?",
    breadcrumbTitle: "Prix d’une landing page",
    updatedAt: "Dernière mise à jour le 28 septembre 2026",
    publishedAt: "2026-09-28",
    modifiedAt: "2026-09-28",
    metaDescription: "Prix d’une landing page en 2026 : offre Ruff Agency à partir de 1 450 €, repères de marché, facteurs de coût et points à vérifier dans un devis.",
    image: {
      src: "/images/ressources/prix-landing-page.webp",
      alt: "Combien coûte une landing page ? — Ruff Agency",
    },
    mainImage: {
      src: "/images/ressources/prix-landing-page.webp",
      alt: "Combien coûte une landing page ? — Ruff Agency",
    },
    quizInHero: true,
    quiz: {
      eyebrow: "Estimateur de budget",
      title: "Quel budget prévoir pour votre landing page ?",
      description: "Répondez à trois questions pour obtenir un repère selon le niveau de stratégie, de design et de fonctionnalités souhaité.",
      questions: [
        { question: "Quel niveau de stratégie vous faut-il ?", answers: [{ label: "Mon offre et mon message sont déjà définis", resultId: "simple" }, { label: "J’ai besoin d’aide pour clarifier mon positionnement", resultId: "personnalisee" }, { label: "Je veux cadrer l’offre, l’audience et le parcours de conversion", resultId: "complexe" }] },
        { question: "Quel niveau de design envisagez-vous ?", answers: [{ label: "Un design sobre avec peu de sections", resultId: "simple" }, { label: "Un design personnalisé pour ma marque", resultId: "personnalisee" }, { label: "Une direction artistique et des interactions sur mesure", resultId: "complexe" }] },
        { question: "De quoi votre page a-t-elle besoin ?", answers: [{ label: "Un formulaire et un appel à l’action", resultId: "simple" }, { label: "Du copywriting et quelques intégrations", resultId: "personnalisee" }, { label: "Plusieurs langues, intégrations ou besoins spécifiques", resultId: "complexe" }] },
      ],
      result: { eyebrow: "Repère budgétaire", title: "Votre estimation est prête", description: "Le montant final dépend du périmètre, des contenus disponibles et des fonctionnalités prévues." },
      results: {
        simple: { eyebrow: "Repère publié · Landing page simple", title: "Environ 800 € à 1 500 €", description: "Cette tranche publiée concerne une page simple avec un périmètre limité. Chez Ruff Agency, l’offre commence à 1 450 € et inclut un travail cadré selon les livrables définis avec vous." },
        personnalisee: { eyebrow: "Repère publié · Landing page personnalisée", title: "Environ 1 500 € à 3 500 €", description: "Cette tranche publiée correspond à un niveau plus poussé de stratégie, de rédaction et de design. Le coût dépend surtout des livrables réellement inclus." },
        complexe: { eyebrow: "Repère publié · Landing page complexe", title: "Environ 3 500 € à 6 000 €", description: "Cette tranche publiée concerne des pages plus complexes, par exemple avec plusieurs langues ou des intégrations avancées. Ce résultat reste un repère, pas un devis." },
      },
      tieBreakResultId: "personnalisee",
      cta: { variant: "recommendation", badge: "Stratégie, design et développement", title: "Une landing page conçue pour transformer le trafic en demandes.", description: "Notre offre démarre à 1 450 €. Le périmètre et les livrables sont clarifiés avant le début du projet.", label: "Découvrir l’offre à 1 450 €", href: "/services/landing-page" },
    },
    about: "Des repères pour comprendre le prix d’une landing page, les facteurs qui font varier son budget et les livrables à vérifier avant de comparer des devis.",
    sources: [
      { label: "Combien coûte la création d’une landing page ? — landingpage.fr, 9 avril 2026", href: "https://www.landingpage.fr/cout-landing-page" },
      { label: "Prix d’un site internet en 2026 : fourchettes publiées par type de projet — Codecircle", href: "https://codecircle.fr/prix-site-internet/" },
      { label: "Offre de création de landing page — Ruff Agency", href: "https://ruff.agency/services/landing-page" },
    ],
    content: [
      { type: "paragraph", text: "En 2026, les tarifs d’agence publiés pour une landing page vont d’environ **800 € à 6 000 €**, selon la complexité et les livrables. Chez Ruff Agency, l’offre démarre à **1 450 €**. Ce prix d’entrée et les fourchettes du marché ne sont comparables que si le périmètre l’est aussi : stratégie, textes, design, intégration et suivi ne sont pas toujours inclus de la même manière." },
      { type: "image", src: "/images/ressources/prix-landing-page.webp", alt: "Visuel de l’article : Combien coûte une landing page ?" },
      { type: "callout", variant: "info", icon: "info", title: "Un prix isolé ne décrit pas une prestation", text: "Pour savoir si un devis est cohérent, vérifiez ce qui est conçu, écrit, développé et testé. Une page à prix bas peut demander beaucoup de travail de votre côté ; une offre plus complète peut inclure plusieurs expertises." },
      { type: "article-link", slug: "questions-sections-landing-page", label: "Voir les questions à traiter dans chaque section d’une landing page" },
      { type: "heading", text: "Quels tarifs sont publiés pour une landing page ?" },
      { type: "paragraph", text: "Une grille publiée en avril 2026 répartit les offres d’agence en trois niveaux. Elle indique des prix d’environ 800 € à 1 500 € pour une page simple, de 1 500 € à 3 500 € pour une page personnalisée et de 3 500 € à 6 000 € pour un projet plus complexe. Ce sont les prix d’un guide professionnel, pas une moyenne statistique ni un tarif officiel." },
      { type: "table", columns: ["Niveau de prestation", "Repère publié", "Exemples de périmètre"], rows: [["Page simple", "800 € à 1 500 €", "Besoin cadré, contenu fourni ou peu remanié, formulaire standard"], ["Page personnalisée", "1 500 € à 3 500 €", "Travail éditorial, design adapté à la marque et parcours de conversion défini"], ["Page complexe", "3 500 € à 6 000 €", "Plusieurs langues, intégrations avancées ou besoins spécifiques"], ["Offre Ruff Agency", "À partir de 1 450 €", "Projet cadré avec stratégie, design et développement ; livrables confirmés selon le brief"]] },
      { type: "paragraph", text: "Les bornes se chevauchent parce que chaque prestataire classe différemment la complexité et n’inclut pas les mêmes tâches. La fourchette sert donc à préparer une discussion. Pour un chiffrage, demandez à l’agence de décrire précisément le résultat livré et les éléments qui restent à votre charge." },
      { type: "article-link", slug: "combien-coute-creation-site-internet", label: "Comparer avec les prix d’un site internet complet" },
      { type: "heading", text: "Que couvre le prix d’une landing page ?" },
      { type: "paragraph", text: "Une landing page concentre le message d’une offre et guide le visiteur vers une action principale. Selon la mission, le travail peut commencer par le cadrage de l’offre et de son audience, puis passer par la structure, les textes, le design, l’intégration et les vérifications avant publication. Le devis doit dire clairement lesquelles de ces étapes sont comprises." },
      { type: "paragraph", text: "Une prestation à 1 450 € n’implique pas automatiquement que tous les contenus, outils ou variantes soient inclus. Chez Ruff Agency, ce montant est le prix de départ communiqué pour l’offre ; le brief permet de confirmer le périmètre, les livrables et les éventuels besoins supplémentaires avant de commencer." },
      { type: "table", columns: ["Étape", "Questions à poser"], rows: [["Cadrage", "Qui définit l’objectif, l’audience et le message principal ?"], ["Structure et rédaction", "Le plan de page et les textes sont-ils écrits, relus ou fournis par vos soins ?"], ["Design", "Le design reprend-il un modèle ou prévoit-il une direction artistique adaptée à votre marque ?"], ["Intégration", "La page est-elle intégrée sur votre plateforme et adaptée aux mobiles ?"], ["Mise en ligne", "Qui connecte le formulaire, vérifie les liens et teste les événements de mesure ?"]] },
      { type: "heading", text: "Quels éléments font monter le budget ?" },
      { type: "paragraph", text: "Le budget progresse lorsque la mission demande plus de recherche, de création ou de coordination. Le nombre de sections ne suffit pas à expliquer le prix : deux pages de longueur comparable peuvent demander des travaux très différents." },
      { type: "bullet-list", items: [{ label: "Une offre encore à clarifier : recherche d’audience, positionnement et formulation de la promesse." }, { label: "Des textes à produire : interviews, copywriting, preuves, questions fréquentes ou variantes d’appels à l’action." }, { label: "Une identité à décliner : direction artistique, illustrations ou visuels conçus spécifiquement." }, { label: "Des interactions à intégrer : formulaires conditionnels, réservation ou connexion à un CRM." }, { label: "Des versions supplémentaires : traduction, déclinaison par audience ou campagne." }, { label: "Des contraintes de mesure : événements analytiques, tests et instrumentation des conversions." }] },
      { type: "callout", variant: "education", icon: "education", title: "Le meilleur levier pour garder le budget sous contrôle", text: "Arrivez avec un objectif précis, les éléments de marque disponibles et une personne qui peut valider les contenus. Cela aide l’équipe à chiffrer le travail réel et limite les retours provoqués par un brief incomplet." },
      { type: "heading", text: "Quels frais prévoir après la livraison ?" },
      { type: "paragraph", text: "Le prix de création n’est pas toujours le coût total. Selon la solution choisie, la page peut entraîner un abonnement de plateforme, un hébergement, un nom de domaine, des licences ou de la maintenance. Les outils de mesure ou de prise de rendez-vous peuvent également avoir leur propre tarif." },
      { type: "paragraph", text: "Distinguez les frais récurrents des évolutions ponctuelles. Le devis doit préciser qui gère les mises à jour, corrige un problème après la mise en ligne et modifie la page si l’offre change. Si vous prévoyez de tester plusieurs variantes, demandez aussi si la conception et le suivi de ces tests sont inclus." },
      { type: "heading", text: "Comment comparer deux devis de landing page ?" },
      { type: "paragraph", text: "Mettez les offres sur un même périmètre : même objectif, même contenu de départ, mêmes intégrations et même niveau d’accompagnement. Comparez les livrables ligne par ligne et notez ce qui n’est pas compris. Un devis détaillé rend visibles les différences qu’un prix global masque." },
      { type: "bullet-list", items: [{ label: "La stratégie et la structure de page sont-elles incluses ?" }, { label: "Qui rédige les textes et fournit les photos ou illustrations ?" }, { label: "Le design est-il personnalisé et combien de cycles de retours sont prévus ?" }, { label: "La page est-elle intégrée, responsive et testée avant publication ?" }, { label: "Les formulaires, outils connectés et événements analytiques sont-ils compris ?" }, { label: "Quels frais ou interventions seront facturés après la livraison ?" }] },
      { type: "content-list", variant: "summary", title: "À vérifier avant de signer", items: [{ label: "Le périmètre et les livrables exacts" }, { label: "La répartition des tâches entre l’agence et vous" }, { label: "Le nombre de retours, tests et variantes compris" }, { label: "Les frais récurrents, la propriété et les accès" }] },
      { type: "paragraph", text: "Si votre besoin dépasse une page dédiée — par exemple s’il faut créer plusieurs pages, une navigation complète ou un espace de contenu — le budget ne relève plus du même périmètre. L’article sur le prix d’un site internet détaille ces autres formats et les postes qui s’y ajoutent." },
      { type: "faq", title: "Questions fréquentes sur le prix d’une landing page", items: [
        { question: "Quel est le prix d’une landing page chez Ruff Agency ?", answer: "Notre offre de landing page démarre à 1 450 €. Le prix final dépend du périmètre convenu et des livrables nécessaires. Il ne constitue pas une garantie de résultat commercial." },
        { question: "Combien coûte une landing page réalisée par une agence ?", answer: "Une grille publiée en 2026 indique des tarifs d’agence entre 800 € et 6 000 €, selon qu’il s’agit d’une page simple, personnalisée ou complexe. Les prestations et tarifs varient d’une agence à l’autre." },
        { question: "Que comprend une landing page à 1 450 € ?", answer: "Le périmètre exact est confirmé avant le début du projet. Faites préciser la stratégie, les contenus, le design, le développement, les intégrations et les révisions comprises dans le devis." },
        { question: "Combien de temps faut-il pour créer une landing page ?", answer: "Le délai dépend de la disponibilité des contenus, du nombre de validations et des intégrations. Demandez un calendrier par étape et vérifiez ce qui peut retarder la livraison." },
        { question: "Le prix garantit-il un taux de conversion ?", answer: "Non. Le prix couvre une prestation et des livrables définis ; il ne garantit ni un volume de trafic ni un résultat commercial. Les conversions dépendent aussi de l’offre, de l’audience et de la qualité du trafic." },
      ] },
    ],
  }),
];

/** Public CMS entries, normalized to semantic article components. */
export const articles: Article[] = legacyArticles.map((article) => ({
  ...article,
  content: normalizeArticleContent(article.content),
}));

const FRENCH_MONTHS: Record<string, string> = {
  janvier: "01", fevrier: "02", février: "02", mars: "03", avril: "04", mai: "05", juin: "06",
  juillet: "07", aout: "08", août: "08", septembre: "09", octobre: "10", novembre: "11", decembre: "12", décembre: "12",
};

export function stripArticleFormatting(value: string) {
  return value.replace(/\*\*([^*]+)\*\*/gu, "$1").replace(/\s+/gu, " ").trim();
}

export function getArticleDescription(article: Pick<Article, "author" | "title" | "metaDescription" | "content">) {
  const firstParagraph = article.content.find(
    (block): block is Extract<ArticleBlock, { type: "paragraph" }> => block.type === "paragraph" && Boolean(block.text)
  )?.text ?? "";
  const description = stripArticleFormatting(article.metaDescription || firstParagraph || `Article de ${article.author} sur ${article.title}.`);
  if (description.length <= 155) return description;
  const shortened = description.slice(0, 156);
  const lastSpace = shortened.lastIndexOf(" ");
  return shortened.slice(0, lastSpace > 120 ? lastSpace : 155).replace(/[\s,;:]+$/u, "");
}

export function getArticleModifiedDate(article: Pick<Article, "modifiedAt" | "updatedAt">) {
  if (article.modifiedAt) return article.modifiedAt;
  const normalized = article.updatedAt.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").toLowerCase();
  const match = normalized.match(/(\d{1,2})\s+([a-z]+)\s+(\d{4})/u);
  if (!match) return undefined;
  const month = FRENCH_MONTHS[match[2]];
  return month ? `${match[3]}-${month}-${match[1].padStart(2, "0")}` : undefined;
}

/** Bloque au build les erreurs de contenu qui produiraient une page incohérente. */
export function validateArticles(list: Article[] = articles) {
  const errors: string[] = [];
  const slugs = new Set<string>();
  const ids = new Set<string>();

  list.forEach((article) => {
    if (slugs.has(article.slug)) errors.push(`slug dupliqué : ${article.slug}`);
    if (ids.has(article.id)) errors.push(`id dupliqué : ${article.id}`);
    slugs.add(article.slug);
    ids.add(article.id);
    if (article.href !== `/ressources/${article.slug}`) errors.push(`${article.slug} : href incohérent`);

    article.content.forEach((block, blockIndex) => {
      if (block.type === "paragraph" && /^(?:•|🔹)\s/u.test(block.text)) {
        errors.push(`${article.slug} : le paragraphe ${blockIndex + 1} utilise un marqueur de liste ; utilisez bullet-list ou heading`);
      }
      if (block.type === "table") {
        block.rows.forEach((row, rowIndex) => {
          if (row.length !== block.columns.length) errors.push(`${article.slug} : tableau ${blockIndex + 1}, ligne ${rowIndex + 1} (${row.length}/${block.columns.length} cellules)`);
        });
      }
      if (block.type === "paragraph" && block.inlineInfo) {
        block.inlineInfo.forEach(({ term }) => {
          if (!block.text.includes(term)) errors.push(`${article.slug} : le terme inline-info « ${term} » est absent du paragraphe ${blockIndex + 1}`);
        });
      }
      if (block.type === "faq") {
        if (!block.items.length) errors.push(`${article.slug} : la FAQ ${blockIndex + 1} doit contenir au moins une question`);
        block.items.forEach((item, itemIndex) => {
          if (!item.question.trim() || !item.answer.trim()) errors.push(`${article.slug} : FAQ ${blockIndex + 1}, question ${itemIndex + 1} incomplète`);
        });
      }
      if (block.type === "cta" && block.variant === "quiz" && (!block.title?.trim() || !block.description?.trim() || !block.label?.trim() || !block.href?.trim())) {
        errors.push(`${article.slug} : CTA quiz ${blockIndex + 1} incomplet`);
      }
      if (block.type === "chart" && block.data?.series && block.variant === "area") {
        block.data.series.forEach((point) => {
          if (!point.date || Number.isNaN(Date.parse(point.date))) errors.push(`${article.slug} : l’area chart « ${block.title} » exige une date ISO par point`);
        });
      }
      if (block.type === "chart" && !article.noIndex && !block.data) errors.push(`${article.slug} : le graphique « ${block.title} » ne peut pas utiliser les données de démonstration sur un article public`);
      if (block.type === "chart" && block.variant === "sankey" && block.data && (!block.data.nodes?.length || !block.data.links?.length)) errors.push(`${article.slug} : le Sankey « ${block.title} » exige nodes et links`);
      if (block.type === "chart" && block.data?.cells) block.data.cells.forEach((cell) => {
        if (Number.isNaN(Date.parse(cell.date))) errors.push(`${article.slug} : date de heatmap invalide « ${cell.date} »`);
      });
    });

    if (article.quiz?.results) {
      const resultIds = new Set(Object.keys(article.quiz.results));
      if (!resultIds.size) errors.push(`${article.slug} : quiz.results est vide`);
      article.quiz.questions.flatMap((question) => question.answers).forEach((answer) => {
        if (typeof answer !== "string" && answer.resultId && !resultIds.has(answer.resultId)) errors.push(`${article.slug} : résultat de quiz inconnu « ${answer.resultId} »`);
      });
    }
  });

  list.forEach((article) => article.content.forEach((block) => {
    if (block.type === "article-link" && !slugs.has(block.slug)) errors.push(`${article.slug} : lien interne inconnu « ${block.slug} »`);
  }));

  if (errors.length) throw new Error(`Articles invalides :\n- ${errors.join("\n- ")}`);
  return true;
}

validateArticles();

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

/** Registre dérivé des articles : il reste à jour dès qu’un article est ajouté. */
export const listedArticles = articles.filter((article) => !article.hiddenFromListing);

export const articleLinks = listedArticles.map(({ slug, title, tag }) => ({
  slug,
  title,
  tag,
  href: `/ressources/${slug}`,
}));

/** Calcule automatiquement le temps de lecture depuis le contenu du CMS. */
export function getArticleReadingMinutes(article: Pick<Article, "title" | "content" | "hiddenContentTypes">) {
  const text = [
    article.title,
    ...article.content.filter((block) => !article.hiddenContentTypes?.includes(block.type)).flatMap((block) => {
      if (block.type === "image") return [];
      if (block.type === "table") return [...block.columns, ...block.rows.flat()];
      if (block.type === "point-cards") return block.items.flatMap((item) => [item.title, item.text]);
      if (block.type === "content-list") return [block.title, ...block.items.map((item) => item.label)];
      if (block.type === "faq") return [block.title || "Questions fréquentes", ...block.items.flatMap((item) => [item.question, item.answer])];
      if (block.type === "cta") return [block.eyebrow || "", block.title || "", block.description || "", block.label || ""];
      if (block.type === "highlight-list" || block.type === "bullet-list") return block.items.flatMap((item) => [item.label, ...(item.children || [])]);
      if (block.type === "divider") return [];
      return "text" in block ? [block.text] : [];
    }),
  ].join(" ");
  const wordCount = text.trim().split(/\s+/u).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}
