// src/components/Features.jsx
// TODO (Pravallika): Build feature cards for all 10 features

const FEATURES = [
  { icon: '🔭', title: 'Local Lens',         desc: 'Know Before You Go — culture, customs, safety tips, and weather.' },
  { icon: '🤝', title: 'Comrade Mode',        desc: 'Find travellers, ask questions, chat and meet people with similar interests.' },
  { icon: '⭐', title: 'Perspective Reviews', desc: 'Reviews based on who you are — backpacker, family, or couple.' },
  { icon: '⚡', title: 'Live Pulse',          desc: 'See what people are doing right now. Crowds, events, festivals.' },
  { icon: '🗺️', title: 'Hidden Comrade',      desc: 'Find hidden cafés, viewpoints and experiences discovered by real travellers.' },
  { icon: '🚨', title: 'Comrade Alert',       desc: 'Real-time crowd-sourced alerts — rain, road closures, metro delays.' },
  { icon: '🍛', title: 'Food & Dish Tracker', desc: 'Discover local dishes, see ingredients, and mark what you have tried.' },
  { icon: '🚌', title: 'Transport Guide',     desc: 'Local transport, routes, fares, travel time and offline maps.' },
  { icon: '🧬', title: 'Travel DNA',          desc: 'COMRADE learns your travel style and improves recommendations over time.' },
  { icon: '📸', title: 'Comrade Memory',      desc: 'Automatically saves your places, food, photos and experiences.' },
]

function Features() {
  return (
    <section id="features" className="section">
      <div className="container">
        <h2 className="section-title">Everything You Need to <span className="highlight">Travel Better</span></h2>
        <p className="section-subtitle">
          10 features built for real travellers — not just tourists.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--border-radius)',
              padding: '28px',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{icon}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>{title}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
