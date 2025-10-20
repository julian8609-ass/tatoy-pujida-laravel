import React, { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [remember, setRemember] = useState(false);
  const [show, setShow] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      setError(null);
      const res = await axios.post('/api/login', { email: email.trim(), password: password });
      console.log('login response', res.data);
      if (res.data && res.data.token) {
        localStorage.setItem('auth_token', res.data.token);
        window.location.hash = '#/dashboard';
        return;
      }
      setError('Login failed: no token returned');
    } catch (err) {
      console.error('login error', err.response?.data || err.message || err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '28px' }}>
      <div style={{ width: '100%', maxWidth: 1100, position: 'relative' }}>
        {/* decorative orange shapes */}
        <div style={{ position: 'absolute', left: -60, top: -40, width: 260, height: 260, background: 'linear-gradient(135deg,#ff8a2b,#ffb86b)', borderRadius: 40, opacity: 0.14, transform: 'rotate(12deg)', filter: 'blur(14px)' }} />
        <div style={{ position: 'absolute', right: -40, bottom: -30, width: 220, height: 220, background: 'linear-gradient(135deg,#ff8a2b,#ffb86b)', borderRadius: 40, opacity: 0.12, transform: 'rotate(-6deg)', filter: 'blur(10px)' }} />

        <div style={{ background: 'white', borderRadius: 18, boxShadow: '0 10px 30px rgba(20,40,60,0.08)', overflow: 'hidden', display: 'flex', minHeight: 420 }}>
          {/* left brand column */}
          <div style={{ flex: 1, padding: 36, background: 'linear-gradient(180deg, rgba(255,138,43,0.04), rgba(155,231,255,0.02))', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 68, height: 68, borderRadius: 16, background: '#ff8a2b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 28, fontWeight: 800 }}>C</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#21343a' }}>ClassHub</div>
                <div style={{ marginTop: 4, color: '#6c757d' }}>School management simplified</div>
              </div>
            </div>
            <div style={{ marginTop: 20, color: '#71858c', maxWidth: 360 }}>Sign in to manage students, faculty and courses. Your session is secured using tokens.</div>
          </div>

          {/* right form column */}
          <div style={{ width: 520, padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <form onSubmit={submit} style={{ width: '100%', maxWidth: 420 }}>
              <h2 style={{ margin: 0, marginBottom: 8, fontSize: 20, color: '#21343a' }}>Welcome back</h2>
              <div style={{ color: '#6c757d', marginBottom: 20 }}>Sign in to continue to ClassHub</div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, color: '#6c757d', marginBottom: 8 }}>User ID</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#95a3ab' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 21v-1c0-2.761-2.239-5-5-5H9c-2.761 0-5 2.239-5 5v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <input autoFocus aria-label="User ID" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu or ID" style={{ width: '100%', padding: '12px 14px 12px 44px', borderRadius: 12, border: '1px solid #e6eef2', fontSize: 15, background: '#fff' }} />
                </div>
              </div>

              <div style={{ marginBottom: 6 }}>
                <label style={{ display: 'block', fontSize: 13, color: '#6c757d', marginBottom: 8 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#95a3ab' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 11V8a5 5 0 0110 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <input aria-label="Password" value={password} onChange={(e) => setPassword(e.target.value)} type={show ? 'text' : 'password'} placeholder="Password" style={{ width: '100%', padding: '12px 92px 12px 44px', borderRadius: 12, border: '1px solid #e6eef2', fontSize: 15, background: '#fff' }} />
                  <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: '#f3f6f8', border: 'none', padding: '6px 10px', borderRadius: 8, cursor: 'pointer', color: '#4b5563' }}>{show ? 'Hide' : 'Show'}</button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, marginBottom: 18 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6c757d', fontSize: 14 }}>
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember me
                </label>
                <a href="#/forgot" style={{ color: '#007bff', fontSize: 14 }}>Forgot?</a>
              </div>

              <div>
                <button disabled={loading} style={{ width: '100%', background: loading ? 'linear-gradient(90deg,#ffb86b,#ff8a2b)' : 'linear-gradient(90deg,#ff8a2b,#ffb86b)', color: 'white', fontWeight: 700, borderRadius: 12, padding: '12px 16px', border: 'none', cursor: loading ? 'default' : 'pointer', display: 'flex', justifyContent: 'center', gap: 10, alignItems: 'center' }}>
                  {loading && (
                    <svg style={{ animation: 'spin 1s linear infinite' }} width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 12a9 9 0 0112-8.485" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                  <span>{loading ? 'Logging in...' : 'Sign in'}</span>
                </button>
                {error && <div style={{ marginTop: 12, color: '#dc3545', fontSize: 13 }}>{error}</div>}
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
