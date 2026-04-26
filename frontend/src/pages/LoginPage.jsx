import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const showMsg = (text, type) => setMsg({ text, type });

  /* ── Login ── */
  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!supabase) {
      showMsg('⚠️ Supabase not configured. Add VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY to .env', 'error');
      setLoading(false); return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      showMsg(`❌ ${error.message}`, 'error');
    } else {
      showMsg('✅ Welcome back! Redirecting…', 'success');
      setTimeout(() => navigate('/'), 1400);
    }
    setLoading(false);
  }

  /* ── Register ── */
  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });
    const name     = e.target.name.value.trim();
    const email    = e.target.email.value.trim();
    const password = e.target.password.value;
    const phone    = e.target.phone.value.trim();

    if (password.length < 6) {
      showMsg('❌ Password must be at least 6 characters.', 'error');
      setLoading(false);
      return;
    }

    if (!supabase) {
      showMsg('⚠️ Supabase not configured. Add your env vars to .env', 'error');
      setLoading(false); return;
    }

    // Step 1 — Create Supabase account
    const { error: signUpError } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name, phone } },
    });

    if (signUpError) {
      showMsg(`❌ ${signUpError.message}`, 'error');
      setLoading(false);
      return;
    }

    // Step 2 — Save user details to Supabase registered_users table
    try {
      await supabase
        .from('registered_users')
        .insert({ name, email: email.toLowerCase(), phone: phone || '' });
    } catch (err) {
      console.warn('Registered users save failed:', err);
    }

    // Step 3 — Ping backend for owner email notification (fire & forget)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      fetch(`${apiUrl}/api/register-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      });
    } catch {
      // Non-blocking
    }

    // Step 4 — Auto sign-in and redirect to Home
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) {
      showMsg('✅ Account created! Please login.', 'success');
      setTimeout(() => setTab('login'), 1800);
    } else {
      showMsg('✅ Welcome! Redirecting to portfolio…', 'success');
      setTimeout(() => navigate('/'), 1200);
    }
    setLoading(false);
  }


  return (
    <div className="login-page">
      <video autoPlay muted loop playsInline className="login-video">
        <source src="/Login background video 1.mp4" type="video/mp4" />
      </video>
      <div className="login-overlay" />

      <nav className="login-mini-nav">
        <a href="/" className="login-brand">BV</a>
        <a href="/" className="login-back">← Back to Portfolio</a>
      </nav>

      <div className="auth-wrapper">
        <div className="auth-card">

          {/* Logo */}
          <div className="auth-logo">
            <span>🙏</span>
            <h1>Welcome</h1>
            <p>Login or create an account to continue</p>
          </div>

          {/* Tabs */}
          <div className="tab-row">
            <button
              className={`tab-btn${tab === 'login' ? ' active' : ''}`}
              onClick={() => { setTab('login'); setMsg({ text: '', type: '' }); }}
            >Login</button>
            <button
              className={`tab-btn${tab === 'register' ? ' active' : ''}`}
              onClick={() => { setTab('register'); setMsg({ text: '', type: '' }); }}
            >Register</button>
          </div>

          {/* Message */}
          {msg.text && (
            <div className={`auth-msg ${msg.type}`}>{msg.text}</div>
          )}

          {/* Login form */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="field">
                <label>Email Address</label>
                <input name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
              </div>
              <div className="field">
                <label>Password</label>
                <input name="password" type="password" placeholder="Enter your password" required autoComplete="current-password" />
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Please wait…' : 'Login to Portfolio'}
              </button>
              <p className="auth-footer-text">
                No account?{' '}
                <button type="button" className="link-btn" onClick={() => setTab('register')}>
                  Register here
                </button>
              </p>
            </form>
          )}

          {/* Register form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="auth-form">
              <div className="field">
                <label>Full Name</label>
                <input name="name" type="text" placeholder="Your full name" required autoComplete="name" />
              </div>
              <div className="field">
                <label>Email Address</label>
                <input name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
              </div>
              <div className="field">
                <label>Phone Number</label>
                <input name="phone" type="tel" placeholder="+91 9876543210" required autoComplete="tel" />
              </div>
              <div className="field">
                <label>Password</label>
                <input name="password" type="password" placeholder="Min. 6 characters" minLength={6} required autoComplete="new-password" />
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Please wait…' : 'Create Account'}
              </button>
              <p className="auth-footer-text">
                Already registered?{' '}
                <button type="button" className="link-btn" onClick={() => setTab('login')}>
                  Login here
                </button>
              </p>
            </form>
          )}

          <p className="auth-copyright">© 2026 <span>Bhaala Vishvanathan</span></p>
        </div>
      </div>
    </div>
  );
}
