function NestedItems({ items, standalone = false }) {
  if (!items?.length) return null;

  return <ul className={`ra-article-list__nested${standalone ? " ra-article-list__nested--standalone" : ""}`}>
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
    {items.map((item, index) => (
      <li key={item.label || item.children?.join("-") || index}>
        {item.label ? <span className="ra-article-list__marker" aria-hidden="true" /> : null}
        <div>
          {item.label ? <span>{item.label}</span> : null}
          <NestedItems items={item.children} standalone={!item.label} />
        </div>
      </li>
    ))}
  </ul>;
}

export function ArticleDivider() {
  return <hr className="ra-article-divider" aria-hidden="true" />;
}
