import { useEffect, useState } from "react";

interface HeroHoverCardProps {
  prompt: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
}

const trackerCells = Array.from({ length: 25 }, (_, index) => index + 1);

export default function HeroHoverCard({ prompt, title, subtitle, imageUrl }: HeroHoverCardProps) {
  const [imageVisible, setImageVisible] = useState(Boolean(imageUrl));

  useEffect(() => {
    setImageVisible(Boolean(imageUrl));
  }, [imageUrl]);

  return (
    <div className="hero-hover-card noselect">
      <div className="hero-hover-card__canvas">
        {trackerCells.map((cell) => (
          <div key={cell} className={`hero-hover-card__tracker hero-hover-card__tracker--${cell}`} />
        ))}

        <article className="hero-hover-card__body">
          {imageUrl && imageVisible ? (
            <img
              src={imageUrl}
              alt={title || "Hero card image"}
              className="hero-hover-card__image"
              onError={() => setImageVisible(false)}
            />
          ) : null}

          <div className="hero-hover-card__overlay" />

          <p className="hero-hover-card__prompt">{prompt}</p>

          <div className="hero-hover-card__content">
            <h2 className="hero-hover-card__title">{title}</h2>
            <p className="hero-hover-card__subtitle">{subtitle}</p>
          </div>
        </article>
      </div>
    </div>
  );
}