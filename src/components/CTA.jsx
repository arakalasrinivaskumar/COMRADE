function CTA() {
  return (
    <section className="cta-section" id="join">

      <div className="cta-content">
        <p className="cta-label">
          YOUR NEXT ADVENTURE STARTS HERE
        </p>

        <h2>
          Don't just visit
          <br />
          a place.
          <br />
          <span>Experience it.</span>
        </h2>

        <p className="cta-text">
          Discover places differently, meet people along
          the way, and make every journey feel like your own.
        </p>

        <div className="cta-buttons">
          <button
            type="button"
            className="cta-primary"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
          >
            Back to Top ↑
          </button>

          <button
            type="button"
            className="cta-secondary"
            onClick={() =>
              document.getElementById("features")?.scrollIntoView({
                behavior: "smooth"
              })
            }
          >
            Explore Features →
          </button>
        </div>
      </div>

      <div className="cta-mark">
        <span>✦</span>
        COMRADE
      </div>

    </section>
  );
}

export default CTA;