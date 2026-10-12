function Footer() {
  return (
    <footer className="footer">

      <div className="footer-top">

        <div className="footer-brand">
          <a href="#" className="footer-logo">
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
  <a href="#about">About</a>
  <a href="#features">Features</a>
  <a href="#discover">Discover</a>
  <a href="#how-it-works">How It Works</a>
</div>
       <div className="footer-column">
  <h4>COMRADE</h4>
  <a href="#features">Local Lens</a>
  <a href="#features">Comrade Mode</a>
  <a href="#sos">Safety & SOS</a>
  <a href="#join">Join Us</a>
</div>
<div className="footer-column">
  <h4>Connect</h4>
  <a href="#join">Join COMRADE</a>
  <a href="#features">Explore Features</a>
  <a href="#about">About COMRADE</a>
</div>


      </div>

      <div className="footer-bottom">

        <span>
          © 2026 COMRADE. All rights reserved.
        </span>

        <span>
          Made for travellers, by travellers.
        </span>

      </div>

    </footer>
  );
}

export default Footer;