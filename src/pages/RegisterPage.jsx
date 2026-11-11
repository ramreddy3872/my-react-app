import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCheckSquare, FiAlertCircle, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const RegisterPage = ({ onShowToast }) => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Engineering',
    role: 'Full-Stack Developer',
    password: '',
    confirmPassword: '',
    agreeTerms: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Full name must be at least 2 characters';
    }

    if (!formData.email || !formData.email.includes('@') || !formData.email.includes('.')) {
      errs.email = 'Please provide a valid corporate email';
    }

    if (!formData.password || formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      errs.agreeTerms = 'You must accept the terms of service';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      department: formData.department,
      role: formData.role
    });
    setSubmitting(false);

    if (result.success) {
      if (onShowToast) onShowToast(`Welcome to NovaTask Pro, ${result.user.name}! Account created.`, 'success');
      navigate('/dashboard');
    } else {
      setErrors({ general: result.error || 'Registration failed' });
    }
  };

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        {/* Header */}
        <div className="auth-header">
          <Link to="/" className="auth-brand">
            <div className="brand-icon">
              <FiCheckSquare />
            </div>
            <span>NovaTask<span className="brand-badge">PRO</span></span>
          </Link>
          <h1 className="auth-title">Create Workspace Account</h1>
          <p className="auth-subtitle">Get started with intelligent team project management</p>
        </div>

        {errors.general && (
          <div className="alert-box alert-danger">
            <FiAlertCircle /> <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full Name *</label>
            <input 
              id="reg-name"
              type="text" 
              name="name"
              className={`form-input ${errors.name ? 'is-invalid' : ''}`}
              placeholder="e.g. Jordan Hayes"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <div className="form-error"><FiAlertCircle /> {errors.name}</div>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Work Email *</label>
            <input 
              id="reg-email"
              type="email" 
              name="email"
              className={`form-input ${errors.email ? 'is-invalid' : ''}`}
              placeholder="jordan.hayes@company.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div className="form-error"><FiAlertCircle /> {errors.email}</div>}
          </div>

          {/* Department & Role Grid */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-dept">Department</label>
              <select 
                id="reg-dept"
                name="department" 
                className="form-select"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Product">Product</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-role">Role Title</label>
              <input 
                id="reg-role"
                type="text" 
                name="role"
                className="form-input" 
                placeholder="e.g. Senior Tech Lead"
                value={formData.role}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-pass">Password *</label>
              <div className="password-input-group">
                <input 
                  id="reg-pass"
                  type={showPassword ? 'text' : 'password'} 
                  name="password"
                  className={`form-input ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Min. 6 chars"
                  value={formData.password}
                  onChange={handleChange}
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
              {errors.password && <div className="form-error"><FiAlertCircle /> {errors.password}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Confirm Password *</label>
              <input 
                id="reg-confirm"
                type={showPassword ? 'text' : 'password'} 
                name="confirmPassword"
                className={`form-input ${errors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <div className="form-error"><FiAlertCircle /> {errors.confirmPassword}</div>}
            </div>
          </div>

          {/* Agree Terms Checkbox */}
          <div style={{ margin: '0.85rem 0 1.5rem 0' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                name="agreeTerms" 
                checked={formData.agreeTerms} 
                onChange={handleChange}
                style={{ accentColor: 'var(--primary)', marginTop: '0.2rem' }}
              />
              <span>I accept the <a href="#terms" style={{ color: 'var(--primary)', fontWeight: 600 }}>Terms of Service</a> and <a href="#privacy" style={{ color: 'var(--primary)', fontWeight: 600 }}>Privacy Policy</a></span>
            </label>
            {errors.agreeTerms && <div className="form-error" style={{ marginTop: '0.3rem' }}><FiAlertCircle /> {errors.agreeTerms}</div>}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.85rem' }}
            disabled={submitting}
          >
            {submitting ? 'Setting up workspace...' : 'Complete Registration'} <FiArrowRight />
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? 
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
