import { useState } from 'react';
import './Contact.css';
import { supabase } from '../lib/supabaseClient';

const LINKS = [
  { icon: '📧', label: 'Email Me', href: 'mailto:bhaalavishvanathan17@gmail.com', type: 'email' },
  { icon: '💼', label: 'LinkedIn', href: 'https://www.linkedin.com/in/bhaalavishvanathan-c-59576a312/', type: 'social' },
  { icon: '🐙', label: 'GitHub', href: 'https://github.com/bhaalavishvanathan17-glitch', type: 'social' },
  { icon: '📞', label: 'Call', href: 'tel:+919361000742', type: 'phone' },
  { icon: '💬', label: 'WhatsApp', href: 'https://wa.me/919361000742', type: 'chat' },
  { icon: '📸', label: 'Instagram', href: 'https://www.instagram.com/_bhaala_/', type: 'social' },
];

export default function Contact() {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    setStatus('sending');

    let saved = false;

    // ── Step 1: Save to Supabase directly (primary storage) ──
    if (supabase) {
      try {
        const { error } = await supabase
          .from('contacts')
          .insert({ name: data.name, email: data.email, message: data.message });
        if (!error) {
          saved = true;
          console.log('✅ Contact saved to Supabase');
        } else {
          console.warn('Supabase insert error:', error.message);
        }
      } catch (err) {
        console.warn('Supabase insert failed:', err);
      }
    }

    // ── Step 2: Ping backend to send email notification ──
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) saved = true; // count as success even if Supabase was slow
    } catch {
      console.warn('Backend email notification failed — data already in Supabase.');
    }

    if (saved) {
      setStatus('sent');
      e.target.reset();
    } else {
      setStatus('error');
    }

    setTimeout(() => setStatus('idle'), 4000);
  }

  const btnLabel = {
    idle:    '🚀 Send Message',
    sending: 'Sending…',
    sent:    '✅ Sent!',
    error:   '❌ Failed — try again',
  }[status];

  return (
    <section className="contact-section section-pad" id="contact">
      <div className="contact-overlay" />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        <div className="text-center animate-fade-up">
          <p className="section-label">Get In Touch</p>
          <h2 className="section-title" style={{ color: '#fff' }}>Let's Connect</h2>
          <p className="section-subtitle" style={{ color: 'rgba(255,255,255,.6)' }}>
            Feel free to reach out — I'm always open to opportunities, collaboration, and conversation.
          </p>
          <div className="divider-bar" />
        </div>

        {/* Social / contact quicklinks */}
        <div className="contact-links animate-fade-up delay-1">
          {LINKS.map(l => (
            <a
              key={l.label}
              href={l.href}
              className="contact-link"
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
            >
              {l.icon} {l.label}
            </a>
          ))}
        </div>

        {/* Contact form */}
        <div className="contact-form-wrap animate-fade-up delay-2">
          <h3>Send a Message</h3>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="cf-name">Full Name</label>
                <input id="cf-name" name="name" type="text" placeholder="Your name" required />
              </div>
              <div className="form-field">
                <label htmlFor="cf-email">Email</label>
                <input id="cf-email" name="email" type="email" placeholder="you@example.com" required />
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="cf-message">Message</label>
              <textarea id="cf-message" name="message" rows={5} placeholder="Write your message here…" required />
            </div>
            <button
              type="submit"
              className="btn-primary submit-btn"
              disabled={status === 'sending'}
            >
              {btnLabel}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
