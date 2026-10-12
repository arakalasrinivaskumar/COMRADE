function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Discover",
      color: "discover",
      description: "Find destinations and hidden gems.",
    },
    {
      number: "02",
      title: "Experience",
      color: "experience",
      description: "Explore local food, culture and activities.",
    },
    {
      number: "03",
      title: "Connect",
      color: "connect",
      description: "Meet travellers and share experiences.",
    },
    {
      number: "04",
      title: "Travel",
      color: "travel",
      description: "Plan your journey and explore confidently.",
    },
    {
      number: "05",
      title: "Remember",
      color: "remember",
      description: "Keep the memories that make every journey special.",
    },
  ];

  return (
    <section className="how-it-works" id="how-it-works">
      {/* Left side: Heading and journey steps */}
      <div className="how-content">
        <div className="how-heading">
          <p className="how-label">YOUR COMRADE JOURNEY</p>

          <h2>
            Every journey
            <br />
            <em>has a story.</em>
          </h2>

          <p className="how-intro">
            Discover somewhere new, experience something different,
            connect with people, travel with confidence and create
            memories worth keeping.
          </p>
        </div>

        {/* Journey path */}
        <div className="journey-path">
          <svg
            className="journey-connector"
            viewBox="0 0 700 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M 45 25 C 105 25, 105 75, 175 75 S 245 25, 315 25 S 385 75, 455 75 S 525 25, 595 25 S 645 50, 675 50"
              fill="none"
              stroke="#AA8DC1"
              strokeWidth="2.5"
              strokeDasharray="6 7"
              strokeLinecap="round"
            />
          </svg>

          {steps.map((step) => (
            <article
              className={`journey-step journey-${step.color}`}
              key={step.number}
            >
              <div className="journey-circle">
                <span className="journey-number">{step.number}</span>

                <h3>{step.title}</h3>
              </div>

              <p className="journey-description">
                {step.description}
              </p>
            </article>
          ))}
        </div>

        <div className="journey-footer">
          <span className="journey-footer-line"></span>
          <p>Discover more. Experience more. Remember forever.</p>
        </div>
      </div>

      {/* Right side: Inclined travel image */}
      <div className="how-image">
  <div className="how-image-overlay"></div>

  <div className="how-image-caption">
    <span>YOUR NEXT ADVENTURE</span>

    <h3>
      Go beyond
      <br />
      <em>the ordinary.</em>
    </h3>

    <p>Meet. Explore. Belong.</p>
  </div>

  <div className="travel-stamp" aria-hidden="true">
    <span>GO</span>
    <span>EXPLORE</span>
    <span>REPEAT</span>
  </div>
</div>
    </section>
  );
}

export default HowItWorks;