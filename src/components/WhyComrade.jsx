// src/components/WhyComrade.jsx
// TODO (Pravallika): Style into a comparison layout or bold statement section

function WhyComrade() {
  return (
    <section id="why-comrade" className="section">
      <div className="container">
        <h2 className="section-title">Why <span className="highlight">COMRADE?</span></h2>
        <p className="section-subtitle">
          Traditional travel apps ask "Where should I go?" — COMRADE asks
          "What is this place really like, who can I experience it with, and how do I travel safely?"
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius)', padding: '32px' }}>
            <h3 style={{ color: 'var(--color-text-muted)', marginBottom: '16px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Traditional Travel Apps</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--color-text-muted)' }}>
              <li>- "Where to go?"</li>
              <li>- Generic reviews</li>
              <li>- Basic maps</li>
              <li>- No community</li>
              <li>- No safety layer</li>
            </ul>
          </div>
          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-primary)', borderRadius: 'var(--border-radius)', padding: '32px' }}>
            <h3 style={{ color: 'var(--color-primary)', marginBottom: '16px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>COMRADE</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>+ Local Lens — real context</li>
              <li>+ Perspective Reviews</li>
              <li>+ Live Pulse — real time</li>
              <li>+ Travel community</li>
              <li>+ Always-on SOS</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyComrade
