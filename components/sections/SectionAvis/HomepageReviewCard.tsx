import "./HomepageReviewCard.css";

export type HomepageReviewCardProps = {
  avatar: string;
  name: string;
  role: string;
  quote: string;
  className?: string;
};

/** White testimonial card extracted from the homepage SectionAvis component. */
export function HomepageReviewCard({
  avatar,
  name,
  role,
  quote,
  className = "",
}: HomepageReviewCardProps) {
  return (
    <article className={`homepage-review-card ${className}`.trim()}>
      <div className="homepage-review-card__content">
        <div className="homepage-review-card__author">
          <img src={avatar} alt="" />
          <div>
            <strong>{name}</strong>
            <span>{role}</span>
          </div>
        </div>
        <p>{quote}</p>
      </div>
    </article>
  );
}

export default HomepageReviewCard;
