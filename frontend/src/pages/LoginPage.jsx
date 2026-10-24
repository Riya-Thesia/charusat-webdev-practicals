import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Mail, User, LogIn, UserPlus } from 'lucide-react';

function LoginPage() {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/tasks');
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="page-container auth-page">
        <div className="card-section text-center">
          <h2>✅ You are currently logged in</h2>
          <p className="lead">Logged in as: <strong>{user.email}</strong></p>
          <button className="btn btn-primary" onClick={() => navigate('/tasks')} style={{ marginTop: '1rem' }}>
            Go to Task Manager
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container auth-page">
      <div className="auth-card-wrapper animate-pop">
        <div className="auth-header">
          <div className="auth-icon-circle">
            <KeyRound size={28} />
          </div>
          <h1 className="auth-title">Account & Authentication</h1>
          <p className="auth-subtitle">
            Sign in to access your personalized task manager.
          </p>

          <div className="auth-tabs">
            <button
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(true); setErrorMsg(''); }}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(false); setErrorMsg(''); }}
            >
              Register
            </button>
          </div>
        </div>

        {errorMsg && <div className="error-alert">⚠️ {errorMsg}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label className="form-label" htmlFor="user-name">Full Name:</label>
              <div className="input-icon-group">
                <User size={18} className="input-icon" />
                <input
                  id="user-name"
                  type="text"
                  className="form-input icon-input"
                  placeholder="e.g. Riya Thesia"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="user-email">Email Address:</label>
            <div className="input-icon-group">
              <Mail size={18} className="input-icon" />
              <input
                id="user-email"
                type="email"
                className="form-input icon-input"
                placeholder="riya@charusat.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="user-password">Password:</label>
            <div className="input-icon-group">
              <KeyRound size={18} className="input-icon" />
              <input
                id="user-password"
                type="password"
                className="form-input icon-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Processing...' : isLogin ? <><LogIn size={16} /> Sign In</> : <><UserPlus size={16} /> Create Account</>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
