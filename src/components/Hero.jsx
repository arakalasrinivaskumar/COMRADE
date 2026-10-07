// src/components/Hero.jsx
// TODO (Pravallika): Build this section
// - COMRADE heading, tagline, short intro, CTA button, visual

function Hero() {
  return (
    <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px' }}>
      <div>
        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontFamily: 'Poppins, sans-serif', fontWeight: 900, color: '#ff6b35' }}>
          COMRADE
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#8892a4', marginTop: '16px' }}>
          Travel the place. Experience the place. Connect with the people experiencing it.
        </p>
        <a href="#contact" className="btn-primary" style={{ marginTop: '40px', display: 'inline-flex' }}>
          Join COMRADE →
        </a>
      </div>
    </section>
  )
}

export default Hero
