import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiHome, FiCompass } from 'react-icons/fi';

const NotFoundPage = () => {
  return (
    <div className="container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 1.5rem' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-xl)', background: 'var(--danger-bg)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '1.5rem' }}>
        <FiAlertTriangle />
      </div>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', maxWidth: '440px', marginBottom: '2rem', fontSize: '1rem' }}>
        The page you are looking for doesn't exist, has been removed, or is temporarily inaccessible.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-secondary">
          <FiHome /> Back to Home
        </Link>
        <Link to="/dashboard" className="btn btn-primary">
          <FiCompass /> Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
