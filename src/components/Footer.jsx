function Footer() {
  const year = new Date().getFullYear();

  const scrollTo = (event, href) => {
    event.preventDefault();

    const element = document.querySelector(href);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <a
            href="#home"
            className="footer-logo"
            onClick={(event) => scrollTo(event, "#home")}
          >
            COMRADE<span>®</span>
          </a>

          <p>
            Travel the place.
            <br />
            Experience the place.
            <br />
            Connect with the people.
          </p>
        </div>

        <div className="footer-column">
          <h4>Explore</h4>
          <a href="#about" onClick={(event) => scrollTo(event, "#about")}>
            About
          </a>
          <a href="#features" onClick={(event) => scrollTo(event, "#features")}>
            Features
          </a>
          <a href="#discover" onClick={(event) => scrollTo(event, "#discover")}>
            Discover
          </a>
          <a
            href="#how-it-works"
            onClick={(event) => scrollTo(event, "#how-it-works")}
          >
            How It Works
          </a>
        </div>

        <div className="footer-column">
          <h4>COMRADE</h4>
          <a href="#features" onClick={(event) => scrollTo(event, "#features")}>
            Local Lens
          </a>
          <a href="#features" onClick={(event) => scrollTo(event, "#features")}>
            Comrade Mode
          </a>
          <a href="#sos" onClick={(event) => scrollTo(event, "#sos")}>
            Safety &amp; SOS
          </a>
          <a href="#join" onClick={(event) => scrollTo(event, "#join")}>
            Join Us
          </a>
        </div>

        <div className="footer-column">
          <h4>Connect</h4>
          <a href="#join" onClick={(event) => scrollTo(event, "#join")}>
            Join COMRADE
          </a>
          <a href="#features" onClick={(event) => scrollTo(event, "#features")}>
            Explore Features
          </a>
          <a href="#about" onClick={(event) => scrollTo(event, "#about")}>
            About COMRADE
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} COMRADE. All rights reserved.</span>
        <span>Made for travellers, by travellers.</span>
      </div>
    </footer>
  );
}

export default Footer;