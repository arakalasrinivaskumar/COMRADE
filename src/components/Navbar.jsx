// src/components/Navbar.jsx
import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'

const NAV_LINKS = [
  { label: 'Home',       href: '#hero' },
  { label: 'About',      href: '#about' },
  { label: 'Features',   href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Contact',    href: '#contact' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Change navbar background on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Smooth scroll to section
  const scrollTo = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-inner">
          {/* Logo */}
          <a className="navbar-logo" href="#hero" onClick={(e) => scrollTo(e, '#hero')}>
            COMRADE
          </a>

          {/* Desktop links */}
          <ul className="navbar-links">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a href={href} onClick={(e) => scrollTo(e, href)}>
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a
            href="#contact"
            className="btn-primary navbar-cta"
            onClick={(e) => scrollTo(e, '#contact')}
          >
            Join COMRADE
          </a>

          {/* Hamburger — mobile */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* Mobile menu */}
        <ul className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a href={href} onClick={(e) => scrollTo(e, href)}>
                {label}
              </a>
            </li>
          ))}
          <li>
            <a href="#contact" className="btn-primary" onClick={(e) => scrollTo(e, '#contact')}>
              Join COMRADE
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
