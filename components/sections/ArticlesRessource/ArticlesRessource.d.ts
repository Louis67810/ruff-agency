import * as React from "react";

export type ArticlesRessourceImage = string | { src?: string; srcSet?: string; alt?: string };

export type ArticlesRessourceItem = {
  id?: string;
  slug?: string;
  tagId?: string;
  tag?: string;
  title?: string;
  image?: ArticlesRessourceImage;
  author?: string;
  authorPhoto?: string | { src?: string; srcSet?: string };
  href?: string;
};

export type ArticlesRessourceProps = {
  tags?: Array<{ id?: string; label?: string; value?: string; title?: string }>;
  articles?: ArticlesRessourceItem[];
  initialTag?: string;
  callHref?: string;
  getArticleHref?: (article: ArticlesRessourceItem) => string;
  className?: string;
  showFilters?: boolean;
  showSidebar?: boolean;
};

declare const ArticlesRessource: React.FC<ArticlesRessourceProps>;
export default ArticlesRessource;
