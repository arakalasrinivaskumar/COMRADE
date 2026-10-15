function ComradeMode() {
  return (
    <section className="comrade-community" id="community">
      {/* LEFT SIDE: COMMUNITY CONTENT */}
      <div className="comrade-community-content">
        <p className="comrade-community-label">
          COMRADE COMMUNITY
        </p>

        <h2>
          Travel alone,
          <br />
          <em>connect together.</em>
        </h2>

        <p className="comrade-community-description">
          Travel doesn't have to mean travelling alone. Connect with
          fellow travellers, discover people exploring the same
          destinations, and share experiences along the way.
        </p>

        <div className="comrade-community-features">
          <div className="community-feature">
            <span className="community-feature-number">01</span>

            <div>
              <h3>Find fellow travellers</h3>
              <p>Meet people heading to the same destination.</p>
            </div>
          </div>

          <div className="community-feature">
            <span className="community-feature-number">02</span>

            <div>
              <h3>Join travel communities</h3>
              <p>
                Discover communities built around places and experiences.
              </p>
            </div>
          </div>

          <div className="community-feature">
            <span className="community-feature-number">03</span>

            <div>
              <h3>Share your journey</h3>
              <p>Exchange stories, tips and moments from your travels.</p>
            </div>
          </div>
        </div>

        <div className="comrade-community-actions">
          <button
            type="button"
            className="comrade-community-button"
            onClick={() =>
              document.getElementById("sos")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
          >
            Travel Safety &amp; Emergency SOS ↓
          </button>

          <button
            type="button"
            className="comrade-community-secondary-button"
            onClick={() =>
              document.getElementById("join")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
          >
            Join COMRADE →
          </button>
        </div>
      </div>

      {/* RIGHT SIDE: TRAVEL IMAGE */}
      <div className="comrade-community-image">
        <img
          src="https://wallpaperbat.com/img/867427-wallpaper-the-sky-clouds-mountains-reflection-india-india-ladakh-nubra-valley-image-for-desktop-section-piejzazi.jpg"
          alt="Scenic mountain landscape reflected in a lake"
        />

        {/* TEXT OVERLAY */}
        <div className="comrade-image-text">
          <h3>
            TRAVEL FAR.
            <br />
            <em>CONNECT DEEPER.</em>
          </h3>

          <p>Meet. Explore. Belong.</p>
        </div>
      </div>
    </section>
  );
}

export default ComradeMode;