import React from "react";

const trackers = Array.from({ length: 25 }, (_, index) => index + 1);

const Card = ({
  prompt = "Spotlight",
  title = "Crafted for Impact",
  subtitle = "Visual storytelling that people remember",
  hoverMessage = "Welcome to our creative studio",
}) => {
  return (
    <div className="hero-hover-card noselect">
      <div className="hero-hover-card__canvas">
        {trackers.map((tracker) => (
          <div key={tracker} className={`hero-hover-card__tracker hero-hover-card__tracker--${tracker}`} />
        ))}

        <article className="hero-hover-card__body">
          <img
            src="/images/cardoverlay.png"
            alt=""
            className="hero-hover-card__image hero-hover-card__image--overlay"
            aria-hidden="true"
          />
          <div className="hero-hover-card__overlay" />
          <p className="hero-hover-card__prompt">{prompt}</p>

          <div className="hero-hover-card__content">
            <h2 className="hero-hover-card__title">{title}</h2>
            <p className="hero-hover-card__subtitle">{subtitle}</p>
            <p className="hero-hover-card__welcome">{hoverMessage}</p>
          </div>
        </article>
      </div>
    </div>
  );
};

export default Card;
