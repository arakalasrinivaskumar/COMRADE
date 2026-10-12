// src/components/Contact.jsx
// Anusri: Connect this form to Supabase
// Instructions are in the comments below

import { useState } from 'react'
// import { supabase } from '../lib/supabase'  // ← Anusri: uncomment this when Supabase is ready

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    // ── Anusri: Replace this block with real Supabase insert ──
    // const { error } = await supabase
    //   .from('contact_submissions')
    //   .insert([{ name: form.name, email: form.email, message: form.message }])
    //
    // if (error) { setStatus('error'); return }
    // ──────────────────────────────────────────────────────────

    // Simulated success for now
    await new Promise((res) => setTimeout(res, 800))
    setStatus('success')
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <section id="contact" className="section">
      <div className="container" style={{ maxWidth: '600px' }}>
        <h2 className="section-title">Get in <span className="highlight">Touch</span></h2>
        <p className="section-subtitle">Have a question or want to join the COMRADE journey?</p>

        {status === 'success' && (
          <div style={{
            background: '#1a3a2a', border: '1px solid #2d6a4f',
            borderRadius: 'var(--border-radius)', padding: '16px 20px',
            marginBottom: '24px', color: '#52b788',
          }}>
            Message sent! We will get back to you soon.
          </div>
        )}

        {status === 'error' && (
          <div style={{
            background: '#3a1a1a', border: '1px solid #6a2d2d',
            borderRadius: 'var(--border-radius)', padding: '16px 20px',
            marginBottom: '24px', color: '#ff6b6b',
          }}>
            Something went wrong. Please try again.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your name"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              Message *
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Tell us what you are thinking..."
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={status === 'loading'}
            style={{ alignSelf: 'flex-start' }}
          >
            {status === 'loading' ? 'Sending...' : 'Send Message →'}
          </button>
        </form>
      </div>
    </section>
  )
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  background: 'var(--color-card)',
  border: '1px solid var(--color-border)',
  borderRadius: '8px',
  color: 'var(--color-text)',
  fontSize: '0.95rem',
  outline: 'none',
  fontFamily: 'inherit',
}

export default Contact
