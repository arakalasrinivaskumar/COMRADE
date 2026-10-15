function SOS() {
  const safetyItems = [
    {
      number: "01",
      icon: "🏥",
      title: "Medical Assistance",
      text: "Find nearby hospitals and medical support when you need it.",
      tag: "HEALTH"
    },
    {
      number: "02",
      icon: "🚔",
      title: "Police Assistance",
      text: "Know how to reach local police and emergency services.",
      tag: "SECURITY"
    },
    {
      number: "03",
      icon: "📍",
      title: "Location Sharing",
      text: "Be ready to share your whereabouts with someone you trust.",
      tag: "STAY CONNECTED"
    },
    {
      number: "04",
      icon: "🤝",
      title: "Trusted Contacts",
      text: "Keep the people you trust close, even when you're far away.",
      tag: "YOUR PEOPLE"
    }
  ];

  return (
    <section className="sos-section" id="sos">
      <div className="sos-new-container">

        <div className="sos-new-heading">
          <div className="sos-new-eyebrow">
            <span className="sos-live-dot" />
            COMRADE TRAVEL SAFETY
          </div>

          <h2>
            Adventure without fear.
            <br />
            <em>We've got your back.</em>
          </h2>

          <p>
            New places, new experiences, and the confidence to explore.
            Keep essential safety information close wherever your journey
            takes you.
          </p>
        </div>

        <div className="sos-emergency-panel">
          <div className="sos-panel-decoration sos-decoration-one" />
          <div className="sos-panel-decoration sos-decoration-two" />

          <div className="sos-panel-content">
            <span className="sos-panel-label">
              YOUR SAFETY COMPANION
            </span>

            <h3>
              In an unfamiliar place?
              <br />
              <span>Stay calm. Stay connected.</span>
            </h3>

            <p>
              Keep local emergency numbers and trusted contacts ready
              before you begin your adventure.
            </p>

            <button
              type="button"
              className="sos-main-button"
              onClick={() =>
                document
                  .getElementById("sos-safety-resources")
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                  })
              }
            >
              <span className="sos-button-icon">↗</span>
              Explore safety resources
            </button>

            <span className="sos-panel-note">
              ✳ PREPARE BEFORE YOU DEPART
            </span>
          </div>

          <div className="sos-emergency-visual">
            <div className="sos-orbit sos-orbit-one" />
            <div className="sos-orbit sos-orbit-two" />

            <div className="sos-shield">
              <span>✦</span>
            </div>

            <div className="sos-floating-card sos-floating-top">
              <span>🛡️</span>
              <div>
                <strong>Travel smart</strong>
                <small>Stay prepared</small>
              </div>
            </div>

            <div className="sos-floating-card sos-floating-bottom">
              <span>💚</span>
              <div>
                <strong>Your people</strong>
                <small>Stay connected</small>
              </div>
            </div>
          </div>
        </div>

        <div
          className="sos-resources-heading"
          id="sos-safety-resources"
        >
          <div>
            <span className="sos-section-kicker">
              THE ESSENTIALS
            </span>

            <h3>Your safety toolkit.</h3>
          </div>

          <p>
            A little preparation can make a big difference.
          </p>
        </div>

        <div className="sos-new-grid">
          {safetyItems.map((item) => (
            <article className="sos-new-card" key={item.number}>
              <div className="sos-card-top">
                <span className="sos-card-number">
                  {item.number}
                </span>

                <span className="sos-card-icon">
                  {item.icon}
                </span>
              </div>

              <span className="sos-card-tag">
                {item.tag}
              </span>

              <h4>{item.title}</h4>

              <p>{item.text}</p>

              <span className="sos-card-bottom">
                STAY PREPARED <span>↗</span>
              </span>
            </article>
          ))}
        </div>

        <div className="sos-travel-reminder">
          <div className="sos-reminder-icon">✳</div>

          <div>
            <strong>A small reminder before you go.</strong>
            <p>
              Save your destination's emergency number, tell someone
              your plans, and keep your phone charged.
            </p>
          </div>

          <button
            type="button"
            className="sos-reminder-button"
            onClick={() =>
              document.getElementById("join")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
          >
            Ready for adventure? Join COMRADE ↓
          </button>
        </div>

        <div className="sos-new-footer">
          <span>COMRADE / SAFETY FIRST</span>
          <span>EXPLORE FREELY. RETURN SAFELY.</span>
        </div>

      </div>
    </section>
  );
}

export default SOS;