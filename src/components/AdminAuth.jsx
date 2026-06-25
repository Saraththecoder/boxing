import React, { useState } from 'react';
import { Lock, User, ShieldAlert, Award, ChevronRight, Zap } from 'lucide-react';

export default function AdminAuth({ onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate authenticating against local credential mapping
    setTimeout(() => {
      if (username.trim().toLowerCase() === 'admin' && password === 'admin') {
        onLoginSuccess({
          username: 'admin',
          role: 'Academy Director',
          name: 'Coach Mick Dunn'
        });
      } else {
        setError('Security handshake failed. Invalid admin credentials.');
      }
      setLoading(false);
    }, 800);
  };

  // Quick autofill demo login helper
  const handleQuickDemoLogin = () => {
    setUsername('admin');
    setPassword('admin');
    setLoading(true);
    
    setTimeout(() => {
      onLoginSuccess({
        username: 'admin',
        role: 'Academy Director',
        name: 'Coach Mick Dunn'
      });
      setLoading(false);
    }, 500);
  };

  return (
    <div className="auth-split-container">
      {/* Left Column: Cinematic Promo Banner */}
      <div className="auth-banner-side">
        <div className="auth-banner-logo">
          <div className="logo-icon">
            <Award size={20} />
          </div>
          <div className="logo-text">
            APEX <span>BOXING</span>
          </div>
        </div>

        <div className="auth-banner-content">
          <h2>BECOME THE<br /><span>CHAMPION</span> OF<br />YOUR OPERATIONS.</h2>
          <p>
            The unified control console built specifically for boxing academy owners and ringside coordinators to track fighters, log attendance rosters, collect fees, and dispatch reminders.
          </p>
          
          <ul className="auth-feature-list">
            <li className="auth-feature-item">
              <Zap size={16} style={{ color: 'var(--accent-gold)' }} />
              <span>10+ Regional Champion</span> fighter files preloaded
            </li>
            <li className="auth-feature-item">
              <Zap size={16} style={{ color: 'var(--accent-blue)' }} />
              <span>3 Active Training Batches</span> fully structured
            </li>
            <li className="auth-feature-item">
              <Zap size={16} style={{ color: 'var(--accent-green)' }} />
              <span>Automated Reminders</span> WhatsApp, SMS & Email dispatchers
            </li>
          </ul>
        </div>

        <div className="auth-banner-footer">
          <span>Apex Arena Console v1.2</span>
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span>GATEWAY SECURE</span>
          </div>
        </div>
      </div>

      {/* Right Column: Glassmorphic Access Portal Form */}
      <div className="auth-form-side">
        <div className="auth-giant-bg-text">APEX</div>
        
        <div className="auth-glass-panel">
          <h3>Admin Gate</h3>
          <p>Authorized ringside coordinators only. Enter security credentials or tap below to auto-fill the demo profile.</p>

          <div style={{ textAlign: 'left', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              Quick Credentials
            </span>
          </div>
          <div className="demo-badge-row">
            <button 
              type="button" 
              className="demo-pill" 
              onClick={handleQuickDemoLogin}
              title="One-click log in with pre-filled admin credentials"
            >
              <Zap size={10} style={{ color: 'var(--accent-gold)' }} />
              Demo Admin Account
            </button>
          </div>

          {error && (
            <div className="alert-box" style={{ borderRadius: 'var(--radius-sm)' }}>
              <ShieldAlert size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label htmlFor="username">Username</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }} />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin ID"
                  style={{ paddingLeft: '38px', borderRadius: 'var(--radius-sm)' }}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ textAlign: 'left', marginBottom: '24px' }}>
              <label htmlFor="password">Security Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secret key"
                  style={{ paddingLeft: '38px', borderRadius: 'var(--radius-sm)' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)' }}
              disabled={loading}
            >
              {loading ? 'Handshaking Credentials...' : 'Authenticate Access'}
              {!loading && <ChevronRight size={14} style={{ marginLeft: '4px' }} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
