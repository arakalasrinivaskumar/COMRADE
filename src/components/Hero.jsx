import { useEffect, useState } from "react";

const travelImages = [
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=2000&q=85",
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2000&q=85",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=85",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2000&q=85",
];

function Hero() {
  const [imageIndex, setImageIndex] = useState(() =>
    Math.floor(Math.random() * travelImages.length)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex(
        (current) => (current + 1) % travelImages.length
      );
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="hero" id="home">
      <div
        className="hero-image"
        style={{
          backgroundImage: `url("${travelImages[imageIndex]}")`,
        }}
      />

      <div className="hero-overlay" />

      <div className="hero-content">
        <p className="hero-label">
          YOUR WORLD. YOUR STORY. YOUR ADVENTURE.
        </p>

        <h1>
          When you want something in life,
          <br />
          you just gotta reach out
          <br />
          <span>and grab it.</span>
        </h1>

        <p className="hero-description">
          Discover hidden gems in your own city, explore beautiful
          destinations around the world, and find places waiting
          to be experienced.
        </p>

        <p className="hero-description hero-description-secondary">
          Save the places you love, plan your next adventure, and
          preserve the memories of every journey with COMRADE.
        </p>

        <div className="hero-buttons">
          <button
            type="button"
            className="hero-primary"
            onClick={() => scrollToSection("features")}
          >
            Explore COMRADE <span>↓</span>
          </button>

          <button
            type="button"
            className="hero-secondary"
            onClick={() => scrollToSection("discover")}
          >
            Discover Places ↗
          </button>

          <button
            type="button"
            className="hero-secondary"
            onClick={() => scrollToSection("memories")}
          >
            My Travel Memories 📸
          </button>
        </div>

        <div className="hero-caption">
          <span className="hero-caption-dot" />
          From local discoveries to unforgettable journeys.
        </div>
      </div>
    </section>
  );
}

export default Hero;