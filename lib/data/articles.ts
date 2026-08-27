export type ArticleTag = { id: string; label: string };

export type ArticleInlineInfo = { term: string; explanation: string };

export type ArticleChartData = {
  series?: Array<{ label: string; value: number; secondary?: number; date?: string }>;
  nodes?: Array<{ name: string; category?: "source" | "landing" | "outcome" }>;
  links?: Array<{ source: number; target: number; value: number }>;
  cells?: Array<{ date: string; value: number }>;
  regions?: Record<string, number>;
};

export type ArticleBlock =
  | { type: "heading"; text: string; level?: 2 | 3 }
  | { type: "paragraph"; text: string; inlineInfo?: ArticleInlineInfo[] }
  | { type: "image"; src: string; alt?: string }
  | { type: "before-after"; before: { src: string; alt?: string }; after: { src: string; alt?: string }; beforeLabel?: string; afterLabel?: string }
  | { type: "video"; src: string; poster?: string; title?: string }
  | { type: "table"; columns: string[]; rows: string[][]; highlightFirstColumn?: boolean }
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
  cta?: ArticleQuizCta;
};

export type ArticleQuiz = {
  eyebrow: string;
  title: string;
  description: string;
  questions: Array<{ question: string; answers: Array<string | { label: string; resultId?: string }> }>;
  result: ArticleQuizResult;
  results?: Record<string, ArticleQuizResult>;
  cta?: ArticleQuizCta;
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
export const articles: Article[] = [
  {
    id: "1",
    slug: "nouveau-logo-bonduelle",
    tagId: "actualites",
    tag: "Actualités",
    title: "Nouveau logo Bonduelle : analyse d'une refonte d'identité visuelle risquée",
    image: { src: "https://framerusercontent.com/images/rNSpJqDhR94j7O7OpTQKCbdp7cg.jpg?width=1280&height=715", alt: "Nouveau logo de Bonduelle" },
    author: "Louis Staub",
    authorPhoto: { src: LOUIS },
    href: "/ressources/nouveau-logo-bonduelle",
    breadcrumbTitle: "Actualités",
    updatedAt: "Dernière mise à jour le 15 juin 2026",
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
    title: "Nouveau logo KFC : analyse du rebranding « Bucketverse » signé JKR",
    image: { src: "https://framerusercontent.com/images/mvu7DCcIcjQf5xbUlCvf3YNscNg.jpg?width=2880&height=1620", alt: "Nouveau logo KFC : analyse du rebranding « Bucketverse » signé JKR" },
    author: "Louis Staub",
    authorPhoto: { src: "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693" },
    href: "/ressources/nouveau-logo-kfc-rebranding-bucketverse-jkr",
    breadcrumbTitle: "Actualités",
    updatedAt: "Dernière mise à jour le 15 juin 2026",
    mainImage: { src: "https://framerusercontent.com/images/mvu7DCcIcjQf5xbUlCvf3YNscNg.jpg?width=2880&height=1620" },
    profilePhoto: { src: "https://framerusercontent.com/images/BifUCVJ8SFvwIJhc7EDr43Gc.jpg?width=693&height=693" },
    about: "",
    authorRole: "",
    authorBio: "",
    content: [
      { type: "paragraph", text: "Pendant des décennies, KFC s’est appuyé sur trois signes immédiatement reconnaissables : le rouge et le blanc, le portrait du Colonel Sanders et son fameux seau de poulet. La nouvelle identité conçue par JKR ne cherche pas à effacer cet héritage. Elle le transforme en un langage beaucoup plus vaste, capable de fonctionner sur une façade, un emballage, une application ou une campagne culturelle." },
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
    title: "Comment développer son site efficacement sans perdre en qualité",
    image: { src: "https://framerusercontent.com/images/JKjlHJDb7urmEsf6oppCkNwca1c.jpg?width=6009&height=4278", alt: "Comment développer son site efficacement sans perdre en qualité" },
    author: "Louis Staub",
    authorPhoto: { src: "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693" },
    href: "/ressources/developper-site-efficacement",
    breadcrumbTitle: "Conseils",
    updatedAt: "Dernière mise à jour le 15 juin 2026",
    mainImage: { src: "https://framerusercontent.com/images/JKjlHJDb7urmEsf6oppCkNwca1c.jpg?width=6009&height=4278" },
    profilePhoto: { src: "https://framerusercontent.com/images/BifUCVJ8SFvwIJhc7EDr43Gc.jpg?width=693&height=693" },
    about: "",
    authorRole: "",
    authorBio: "",
    content: [
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
    title: "Sous-CTA : comment booster vos conversions",
    image: { src: "https://framerusercontent.com/images/8PdWCxSP3vfwJJsSMzonZVh0vsA.jpg?width=6009&height=4278", alt: "Sous-CTA : comment booster vos conversions" },
    author: "Louis Staub",
    authorPhoto: { src: "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693" },
    href: "/ressources/sous-cta-booster-conversions",
    breadcrumbTitle: "Conseils",
    updatedAt: "Dernière mise à jour le 15 juin 2026",
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
    title: "Les questions auxquelles chaque section de landing page doit répondre",
    image: { src: "https://framerusercontent.com/images/d2Og5Iav1jT2lAb60F50FoBURqQ.jpg?width=6009&height=4278", alt: "Les questions auxquelles chaque section de landing page doit répondre" },
    author: "Louis Staub",
    authorPhoto: { src: "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693" },
    href: "/ressources/questions-sections-landing-page",
    breadcrumbTitle: "Conseils",
    updatedAt: "Dernière mise à jour le 15 juin 2026",
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
        href: "/contact",
      },
    },
    content: [
      { type: "paragraph", text: "Une landing page qui convertit ne répond pas au hasard. Chaque section a un rôle précis : **répondre à une question précise dans l’esprit du visiteur**. Si cette question reste sans réponse, le doute s’installe et la conversion chute. Voici les points à traiter, section par section." },
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
    title: "Sourcils de texte : comment augmenter les conversions",
    image: { src: "https://framerusercontent.com/images/5Iq89plOmzymOprhJkXd8dzbTw.jpg?width=6009&height=4278", alt: "Sourcils de texte : comment augmenter les conversions" },
    author: "Louis Staub",
    authorPhoto: { src: "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693" },
    href: "/ressources/sourcils-de-texte-conversions",
    breadcrumbTitle: "Conseils",
    updatedAt: "Dernière mise à jour le 15 juin 2026",
    mainImage: { src: "https://framerusercontent.com/images/5Iq89plOmzymOprhJkXd8dzbTw.jpg?width=6009&height=4278" },
    profilePhoto: { src: "https://framerusercontent.com/images/BifUCVJ8SFvwIJhc7EDr43Gc.jpg?width=693&height=693" },
    about: "",
    authorRole: "",
    authorBio: "",
    content: [
      { type: "paragraph", text: "Une simple ligne placée au-dessus d’un titre peut transformer vos résultats. Ces micro-messages créent preuve sociale, confiance, urgence, ou mettent en avant un bénéfice clair, en quelques mots seulement. Ils vous permettent aussi de mieux cibler vos clients, sans alourdir votre page. Résultat : une phrase, et vos conversions peuvent grimper." },
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
    title: "Quelles illustrations choisir pour le hero de son site ?",
    image: { src: "https://framerusercontent.com/images/aKOBm22k82Pia4WUiZihroyRQ8.jpg?width=6009&height=4278", alt: "Quelles illustrations choisir pour le hero de son site ?" },
    author: "Louis Staub",
    authorPhoto: { src: "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693" },
    href: "/ressources/illustrations-hero-section-business",
    breadcrumbTitle: "Conseils",
    updatedAt: "Dernière mise à jour le 15 juin 2026",
    mainImage: { src: "https://framerusercontent.com/images/aKOBm22k82Pia4WUiZihroyRQ8.jpg?width=6009&height=4278" },
    profilePhoto: { src: "https://framerusercontent.com/images/BifUCVJ8SFvwIJhc7EDr43Gc.jpg?width=693&height=693" },
    about: "",
    authorRole: "",
    authorBio: "",
    content: [
      { type: "paragraph", text: "Le Hero est la première impression visuelle. Avant même de lire ton titre, l’utilisateur perçoit une chose : ton visuel. Et ce visuel doit immédiatement valider ces 3 points : “Je suis au bon endroit” “Je comprends ce que cette entreprise fait” “Je fais confiance à ce que je vois” Problème : beaucoup de business utilisent des images totalement génériques, abstraites ou non adaptées à leur secteur — ce qui affaiblit la crédibilité et la clarté du message." },
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
    title: "Guide de copywriting : écrire une page qui fait passer à l’action",
    image: { src: "https://framerusercontent.com/images/v5hwE4GBukVAfUYJYgoFRgl3us.jpg?width=6009&height=4278", alt: "Guide de copywriting : écrire une page qui fait passer à l’action" },
    author: "Louis Staub",
    authorPhoto: { src: "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693" },
    href: "/ressources/guide-copywriting-page-qui-convertit",
    breadcrumbTitle: "Guide",
    updatedAt: "Dernière mise à jour le 15 juin 2026",
    mainImage: { src: "https://framerusercontent.com/images/v5hwE4GBukVAfUYJYgoFRgl3us.jpg?width=6009&height=4278" },
    profilePhoto: { src: "https://framerusercontent.com/images/BifUCVJ8SFvwIJhc7EDr43Gc.jpg?width=693&height=693" },
    about: "",
    authorRole: "",
    authorBio: "",
    content: [
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
    title: "Comment capter l’attention d’un visiteur sur une landing page",
    image: { src: "https://framerusercontent.com/images/ZIGOnBSBx1rmv0U9MtaO0Q2nc.jpg?width=6009&height=4278", alt: "Comment capter l’attention d’un visiteur sur une landing page" },
    author: "Louis Staub",
    authorPhoto: { src: "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693" },
    href: "/ressources/capter-attention-visiteur-landing-page",
    breadcrumbTitle: "Guide",
    updatedAt: "Dernière mise à jour le 15 juin 2026",
    mainImage: { src: "https://framerusercontent.com/images/ZIGOnBSBx1rmv0U9MtaO0Q2nc.jpg?width=6009&height=4278" },
    profilePhoto: { src: "https://framerusercontent.com/images/BifUCVJ8SFvwIJhc7EDr43Gc.jpg?width=693&height=693" },
    about: "",
    authorRole: "",
    authorBio: "",
    content: [
      { type: "paragraph", text: "Les visiteurs ne lisent pas tout. Ils scannent. Ils repèrent quelques mots clés. Et prennent une décision très vite. Ton rôle n’est donc pas de tout expliquer, mais de diriger leur regard." },
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
    title: "Comment trouver son avatar client : le guide ultime",
    image: { src: "https://framerusercontent.com/images/jmaC3nMJCrF0OvoTJL9X8VH3QyQ.jpg?width=6009&height=4278", alt: "Comment trouver son avatar client : le guide ultime" },
    author: "Louis Staub",
    authorPhoto: { src: "https://framerusercontent.com/images/2MtWvpxSPxrD8xwJa7XBZm2R8PE.jpg?lossless=1&width=693&height=693" },
    href: "/ressources/trouver-avatar-client-guide",
    breadcrumbTitle: "Guide",
    updatedAt: "Dernière mise à jour le 15 juin 2026",
    mainImage: { src: "https://framerusercontent.com/images/jmaC3nMJCrF0OvoTJL9X8VH3QyQ.jpg?width=6009&height=4278" },
    profilePhoto: { src: "https://framerusercontent.com/images/BifUCVJ8SFvwIJhc7EDr43Gc.jpg?width=693&height=693" },
    about: "",
    authorRole: "",
    authorBio: "",
    content: [
      { type: "paragraph", text: "Pas de design magique. Pas de “phrases copywriting” copiées sur les autres. Juste la vérité : celui qui comprend le mieux son audience gagne. Ce guide rassemble toutes les étapes, toutes les questions et toutes les méthodes pour créer un avatar clair, exploitable et prêt à transformer ton copywriting." },
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
      { type: "cta", variant: "quiz", eyebrow: "Recommandé pour vous", title: "Votre landing page mérite une refonte pensée pour convertir.", description: "Réservez un appel pour identifier les opportunités les plus importantes sur votre site.", label: "Réserver un appel", href: "/contact" },
      { type: "faq", title: "FAQ liée à l’article", items: [
        { question: "La FAQ est-elle obligatoire dans un article ?", answer: "Non. Ce bloc est entièrement optionnel : ajoutez-le seulement lorsqu’il permet de répondre à des questions utiles qui prolongent vraiment la lecture de l’article." },
        { question: "Comment ajouter une nouvelle question ?", answer: "Dans le CMS, ajoutez simplement une entrée avec une question et sa réponse dans la liste du bloc FAQ. L’accordéon et les séparateurs sont générés automatiquement." },
      ] },
    ],
  },

];

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
