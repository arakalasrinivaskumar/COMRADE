function Features() {
  const features = [
    {
      number: "01",
      title: "Discover Places",
      description: "Find destinations and hidden gems.",
      icon: "⌖",
      color: "discover-card",
    },
    {
      number: "02",
      title: "Stays & Places",
      description: "Find stays and nearby essentials.",
      icon: "⌂",
      color: "stays-card",
    },
    {
      number: "03",
      title: "Food & Specialties",
      description: "Taste local food and favourites.",
      icon: "✳",
      color: "food-card",
    },
    {
      number: "04",
      title: "Transport",
      description: "Explore ways to get around.",
      icon: "↗",
      color: "transport-card",
    },
    {
      number: "05",
      title: "Comrade Community",
      description: "Meet travellers and share stories.",
      icon: "♡",
      color: "community-card",
    },
    {
      number: "06",
      title: "Emergency SOS",
      description: "Keep emergency help within reach.",
      icon: "!",
      color: "sos-card",
    },
  ];

  return (
    <section className="features-section" id="features">
      {/* LEFT: Travel image */}
      <div className="features-image">
        <div className="features-image-overlay">
          <p className="features-image-label">THE COMRADE EXPERIENCE</p>

          <h2>
            Go beyond
            <br />
            <em>the ordinary.</em>
          </h2>

          <p className="features-image-caption">
            Meet. Explore. Belong.
          </p>
        </div>
      </div>

      {/* RIGHT: Heading and feature boxes */}
      <div className="features-content">
        <div className="features-heading">
          <p className="features-label">MADE FOR YOUR JOURNEY</p>

          <h2>
            Everything you need,
            <br />
            <em>wherever you go.</em>
          </h2>

          <p className="features-intro">
            Discover new places, taste local food, find convenient
            transport and connect with fellow travellers.
            Everything you need for a better journey, in one place.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <article
              className={`feature-card ${feature.color}`}
              key={feature.number}
            >
              <div className="feature-card-top">
                <span className="feature-number">{feature.number}</span>
                <span className="feature-icon" aria-hidden="true">
                  {feature.icon}
                </span>
              </div>

              <div className="feature-card-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="features-note">
          <span className="features-note-line"></span>
          <p>Less planning stress. More meaningful journeys.</p>
        </div>
      </div>
    </section>
  );
}

export default Features;