function NestedItems({ items }) {
  if (!items?.length) return null;

  return <ul className="ra-article-list__nested">
    {items.map((item) => <li key={item}>{item}</li>)}
  </ul>;
}

export function ArticleHighlightList({ items }) {
  return <ul className="ra-article-list ra-article-list--highlight" aria-label="Points importants">
    {items.map((item) => (
      <li key={item.label}>
        <span className="ra-article-list__marker" aria-hidden="true" />
        <div>
          <span className="ra-article-list__highlight">{item.label}</span>
          <NestedItems items={item.children} />
        </div>
      </li>
    ))}
  </ul>;
}

export function ArticleBulletList({ items }) {
  return <ul className="ra-article-list ra-article-list--plain" aria-label="Liste">
    {items.map((item) => (
      <li key={item.label}>
        <span className="ra-article-list__marker" aria-hidden="true" />
        <div>
          <span>{item.label}</span>
          <NestedItems items={item.children} />
        </div>
      </li>
    ))}
  </ul>;
}

export function ArticleDivider() {
  return <hr className="ra-article-divider" aria-hidden="true" />;
}
