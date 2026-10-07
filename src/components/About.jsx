// src/components/About.jsx
// TODO (Pravallika): Build this section
// - What is COMRADE? The problem. The solution.

function About() {
  return (
    <section id="about" className="section" style={{ background: 'var(--color-surface)' }}>
      <div className="container">
        <h2 className="section-title">About <span className="highlight">COMRADE</span></h2>
        <p className="section-subtitle">
          Most travel apps tell you where to go. COMRADE tells you what a place is really like,
          who is experiencing it right now, and how to travel it safely — like a local.
        </p>
      </div>
    </section>
  )
}

export default About
