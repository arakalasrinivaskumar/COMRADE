import { useState } from "react";

function Navbar({ currentPage, navigateTo }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [travelMenuOpen, setTravelMenuOpen] = useState(false);

  function handleNavigation(page) {
    navigateTo(page);
    setMenuOpen(false);
    setTravelMenuOpen(false);
  }

  function scrollToSection(sectionId) {
    if (currentPage !== "home") {
      navigateTo("home");

      window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setMenuOpen(false);
    setTravelMenuOpen(false);
  }

  return (
    <nav className="navbar">
      <button
        type="button"
        className="logo"
        onClick={() => scrollToSection("home")}
      >
        COMRADE<span>®</span>
      </button>

      <div className={`nav-links ${menuOpen ? "mobile-open" : ""}`}>
        <button type="button" onClick={() => scrollToSection("home")}>
          Home
        </button>

        <button
          type="button"
          onClick={() => scrollToSection("features")}
        >
          Features
        </button>

        <button
          type="button"
          onClick={() => scrollToSection("how-it-works")}
        >
          How It Works
        </button>

        <button
          type="button"
          onClick={() => scrollToSection("discover")}
        >
          Discover
        </button>

        <button
          type="button"
          onClick={() => scrollToSection("destinations")}
        >
          Destinations
        </button>

        <button
          type="button"
          onClick={() => scrollToSection("memories")}
        >
          Memories
        </button>

        <button
          type="button"
          onClick={() => scrollToSection("community")}
        >
          Community
        </button>

        <div className="travel-nav-dropdown">
          <button
            type="button"
            className="travel-nav-trigger"
            aria-expanded={travelMenuOpen}
            onClick={() => setTravelMenuOpen((open) => !open)}
          >
            My Travel ▾
          </button>

          {travelMenuOpen && (
            <div className="travel-nav-menu">
              <button
                type="button"
                onClick={() => handleNavigation("journey")}
              >
                🌍 My Journey
              </button>

              <button
                type="button"
                onClick={() => handleNavigation("trips")}
              >
                ✈️ Trips
              </button>

              <button
                type="button"
                onClick={() => handleNavigation("bucketlist")}
              >
                ⭐ Bucket List
              </button>

              <button
                type="button"
                onClick={() => handleNavigation("insights")}
              >
                📊 Insights
              </button>
            </div>
          )}
        </div>

        {/* Mobile-only CTA buttons so mobile menu flows top-to-down completely */}
        <div className="mobile-nav-ctas">
          <button
            type="button"
            className="nav-sos"
            onClick={() => scrollToSection("sos")}
          >
            SOS <span>🚨</span>
          </button>

          <button
            type="button"
            className="nav-join"
            onClick={() => scrollToSection("join")}
          >
            Join COMRADE →
          </button>
        </div>
      </div>

      <div className="nav-desktop-actions">
        <button
          type="button"
          className="nav-sos"
          onClick={() => scrollToSection("sos")}
        >
          SOS <span>🚨</span>
        </button>

        <button
          type="button"
          className="nav-join"
          onClick={() => scrollToSection("join")}
        >
          Join COMRADE →
        </button>
      </div>

      <button
        type="button"
        className="menu-button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? "✕" : "☰"}
      </button>
    </nav>
  );
}

export default Navbar;
