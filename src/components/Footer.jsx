import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckSquare, FiMail, FiArrowRight, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

const Footer = ({ onShowToast }) => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      if (onShowToast) onShowToast('Please enter a valid email address.', 'error');
      return;
    }
    if (onShowToast) onShowToast('Thank you for subscribing to NovaTask product updates!', 'success');
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <div className="navbar-brand">
              <div className="brand-icon">
                <FiCheckSquare />
              </div>
              <span>NovaTask<span className="brand-badge">PRO</span></span>
            </div>
            <p className="footer-brand-desc">
              The next-generation project and agile workflow management platform built for modern engineering and product teams.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="btn-icon">
                <FiGithub />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="btn-icon">
                <FiTwitter />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="btn-icon">
                <FiLinkedin />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="footer-title">Product</h4>
            <ul className="footer-links">
              <li><Link to="/dashboard" className="footer-link">Dashboard</Link></li>
              <li><Link to="/" className="footer-link">Features</Link></li>
              <li><a href="#pricing" className="footer-link">Pricing Plans</a></li>
              <li><a href="#integrations" className="footer-link">Integrations</a></li>
              <li><a href="#changelog" className="footer-link">Release Notes</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="footer-title">Resources</h4>
            <ul className="footer-links">
              <li><a href="#docs" className="footer-link">Documentation</a></li>
              <li><a href="#api" className="footer-link">REST API</a></li>
              <li><a href="#guides" className="footer-link">Workflow Guides</a></li>
              <li><a href="#security" className="footer-link">Security & Privacy</a></li>
              <li><a href="#status" className="footer-link">System Status</a></li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div>
            <h4 className="footer-title">Stay Updated</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Subscribe to get feature releases, engineering teardowns, and productivity insights.
            </p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter work email..." 
                className="newsletter-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm" aria-label="Subscribe">
                <FiArrowRight />
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} NovaTask Pro. Engineered with ReactJS & Node.js. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#terms" className="footer-link">Terms of Service</a>
            <a href="#privacy" className="footer-link">Privacy Policy</a>
            <a href="#cookies" className="footer-link">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
