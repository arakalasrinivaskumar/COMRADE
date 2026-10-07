// src/components/Footer.jsx
import './Footer.css'

function Footer() {
  const year = new Date().getFullYear()

  const scrollTo = (e, href) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <h3>COMRADE</h3>
            <p>
              Travel the place. Experience the place. Connect with the people
              experiencing it.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              <li><a href="#about" onClick={(e) => scrollTo(e, '#about')}>About</a></li>
              <li><a href="#features" onClick={(e) => scrollTo(e, '#features')}>Features</a></li>
              <li><a href="#how-it-works" onClick={(e) => scrollTo(e, '#how-it-works')}>How It Works</a></li>
              <li><a href="#contact" onClick={(e) => scrollTo(e, '#contact')}>Contact</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#sanchari" onClick={(e) => scrollTo(e, '#sanchari')}>Sanchari</a></li>
              <li><a href="#contact" onClick={(e) => scrollTo(e, '#contact')}>Join Us</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p>© {year} COMRADE · Built by Sanchari. All rights reserved.</p>
          <div className="footer-socials">
            <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
