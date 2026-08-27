import { headers } from "next/headers";
import SectionAvis from "./SectionAvis";
import "./SectionAvisLocalized.css";

const testimonials = [
  {
    name: "Sacha Tassart",
    role: "Founder of Spreak",
    quote:
      "I highly recommend Louis for his remarkable work on Spreak. Any company looking to work with a rigorous, creative and reliable designer will make an excellent choice.",
  },
  {
    name: "Antoine Troovy",
    role: "Founder of Keyframe Agency",
    quote:
      "Ruff agency delivered my website quickly and was incredibly responsive. The assets and animations are beautiful.",
  },
];

function EnglishSectionAvis() {
  return (
    <section
      className="localized-reviews"
      aria-labelledby="localized-reviews-title"
    >
      <div className="localized-reviews__stats" aria-label="Client results">
        <span>+30 satisfied founders</span>
        <span>Average rating 5/5</span>
      </div>
      <h2 id="localized-reviews-title">What our clients say</h2>
      <div className="localized-reviews__grid">
        {testimonials.map((testimonial) => (
          <article className="localized-reviews__card" key={testimonial.name}>
            <div>
              <strong>{testimonial.name}</strong>
              <span>{testimonial.role}</span>
            </div>
            <p>“{testimonial.quote}”</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function SectionAvisLocalized() {
  const locale = headers().get("x-site-locale") === "en" ? "en" : "fr";
  return locale === "en" ? <EnglishSectionAvis /> : <SectionAvis />;
}
