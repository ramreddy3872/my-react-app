import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCheckSquare, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiArrowRight, FiUserCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const LoginPage = ({ onShowToast }) => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!formData.password) {
      setError('Please enter your account password.');
      return;
    }

    setSubmitting(true);
    const result = await login(formData.email, formData.password);
    setSubmitting(false);

    if (result.success) {
      if (onShowToast) onShowToast(`Welcome back, ${result.user.name}!`, 'success');
      navigate('/dashboard');
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  const handleQuickDemoLogin = (role) => {
    const user = demoLogin(role);
    if (onShowToast) onShowToast(`Logged in as Demo ${role === 'admin' ? 'Admin' : 'Member'} (${user.name})`, 'success');
    navigate('/dashboard');
  };

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <Link to="/" className="auth-brand">
            <div className="brand-icon">
              <FiCheckSquare />
            </div>
            <span>NovaTask<span className="brand-badge">PRO</span></span>
          </Link>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to orchestrate your tasks and projects</p>
        </div>

        {/* Demo Accounts Quick-Login Box */}
        <div className="demo-accounts-box">
          <div className="demo-title">
            <FiUserCheck /> Quick Demo Login (1-Click)
          </div>
          <div className="demo-buttons-row">
            <button 
              type="button" 
              className="demo-btn"
              onClick={() => handleQuickDemoLogin('admin')}
            >
              Demo Admin
            </button>
            <button 
              type="button" 
              className="demo-btn"
              onClick={() => handleQuickDemoLogin('member')}
            >
              Demo Member
            </button>
          </div>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="alert-box alert-danger">
            <FiAlertCircle /> <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Work Email Address
            </label>
            <input 
              id="login-email"
              type="email" 
              name="email"
              className="form-input" 
              placeholder="name@company.com" 
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <div className="form-label">
              <label htmlFor="login-password">Password</label>
              <a href="#forgot" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 500 }}>
                Forgot password?
              </a>
            </div>
            <div className="password-input-group">
              <input 
                id="login-password"
                type={showPassword ? 'text' : 'password'} 
                name="password"
                className="form-input" 
                placeholder="Enter password (e.g. Password123!)" 
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button 
                type="button" 
                className="password-toggle-btn" 
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '1rem 0 1.5rem 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                name="rememberMe" 
                checked={formData.rememberMe} 
                onChange={handleChange}
                style={{ accentColor: 'var(--primary)' }}
              />
              Remember me
            </label>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.85rem' }}
            disabled={submitting}
          >
            {submitting ? 'Authenticating...' : 'Sign In to Workspace'} <FiArrowRight />
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account yet? 
          <Link to="/register" className="auth-link">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
