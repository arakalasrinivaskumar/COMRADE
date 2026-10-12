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
        onClick={() => handleNavigation("home")}
      >
        COMRADE<span>┬«</span>
      </button>

      <div className={`nav-links ${menuOpen ? "mobile-open" : ""}`}>
        <button type="button" onClick={() => handleNavigation("home")}>
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
          onClick={() => scrollToSection("discover")}
        >
          Discover
        </button>

        <div className="travel-nav-dropdown">
          <button
            type="button"
            className="travel-nav-trigger"
            aria-expanded={travelMenuOpen}
            onClick={() => setTravelMenuOpen((open) => !open)}
          >
            My Travel Γû╛
          </button>

          {travelMenuOpen && (
            <div className="travel-nav-menu">
              <button
                type="button"
                onClick={() => handleNavigation("journey")}
              >
                ≡ƒîì My Journey
              </button>

              <button
                type="button"
                onClick={() => handleNavigation("trips")}
              >
                Γ£ê∩╕Å Trips
              </button>

              <button
                type="button"
                onClick={() => handleNavigation("bucketlist")}
              >
                Γ¡É Bucket List
              </button>

              <button
                type="button"
                onClick={() => handleNavigation("insights")}
              >
                ≡ƒôè Insights
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => scrollToSection("community")}
        >
          Community
        </button>
      </div>

      <button
        type="button"
        className="nav-sos"
        onClick={() => scrollToSection("sos")}
      >
        SOS <span>≡ƒöö</span>
      </button>

      <button
        type="button"
        className="nav-join"
        onClick={() => scrollToSection("join")}
      >
        Join COMRADE ΓåÆ
      </button>

      <button
        type="button"
        className="menu-button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? "Γ£ò" : "Γÿ░"}
      </button>
    </nav>
  );
}

export default Navbar;
