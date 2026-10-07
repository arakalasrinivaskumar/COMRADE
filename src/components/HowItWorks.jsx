// src/components/HowItWorks.jsx
// TODO (Pravallika): Style this into a visual step-by-step flow

const STEPS = [
  { num: '01', title: 'Discover',   desc: 'Search your destination. Get the full Local Lens overview.' },
  { num: '02', title: 'Experience', desc: 'Explore places, food, and hidden gems recommended by real travellers.' },
  { num: '03', title: 'Connect',    desc: 'Find other travellers, join groups, and experience it together.' },
  { num: '04', title: 'Travel',     desc: 'Navigate safely with transport guides, alerts, and one-tap SOS.' },
  { num: '05', title: 'Remember',   desc: 'Comrade Memory saves your journey automatically.' },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="section" style={{ background: 'var(--color-surface)' }}>
      <div className="container">
        <h2 className="section-title">How <span className="highlight">COMRADE</span> Works</h2>
        <p className="section-subtitle">Five simple steps. One complete travel experience.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '700px', margin: '0 auto' }}>
          {STEPS.map(({ num, title, desc }) => (
            <div key={num} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              <div style={{
                minWidth: '48px', height: '48px',
                borderRadius: '50%',
                background: 'var(--color-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '0.85rem', flexShrink: 0,
              }}>
                {num}
              </div>
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: '4px' }}>{title}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
