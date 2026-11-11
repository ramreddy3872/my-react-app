import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiArrowRight, 
  FiCheckCircle, 
  FiZap, 
  FiShield, 
  FiBarChart2, 
  FiUsers, 
  FiLayers, 
  FiStar, 
  FiCheck,
  FiCode,
  FiCompass,
  FiCpu
} from 'react-icons/fi';
import '../styles/home.css';

const HomePage = () => {
  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section container">
        <div className="hero-badge">
          <FiZap /> <span>NovaTask Pro 2.0 • Intelligent Workflow Suite</span>
        </div>

        <h1 className="hero-title">
          Orchestrate Complex Projects with <span className="gradient-text">Speed & Precision</span>
        </h1>

        <p className="hero-subtitle">
          The all-in-one agile workspace designed for modern product engineering teams. 
          Manage tasks, organize sprints, monitor real-time KPIs, and ship high-impact software faster.
        </p>

        <div className="hero-cta-group">
          <Link to="/dashboard" className="btn btn-primary btn-lg">
            <span>Explore Live Dashboard</span> <FiArrowRight />
          </Link>
          <Link to="/register" className="btn btn-secondary btn-lg">
            Create Free Account
          </Link>
        </div>

        {/* Live Metrics Counter Strip */}
        <div className="metrics-strip">
          <div className="metric-item">
            <div className="metric-number">99.98%</div>
            <div className="metric-label">High Availability SLA</div>
          </div>
          <div className="metric-item">
            <div className="metric-number">24,000+</div>
            <div className="metric-label">Active Global Teams</div>
          </div>
          <div className="metric-item">
            <div className="metric-number">1.4M+</div>
            <div className="metric-label">Deliverables Shipped</div>
          </div>
          <div className="metric-item">
            <div className="metric-number">4.9 / 5</div>
            <div className="metric-label">Average User Rating</div>
          </div>
        </div>

        {/* App Showcase Preview Window */}
        <div className="hero-preview-container">
          <div className="hero-preview-card">
            <div className="preview-top-bar">
              <div className="window-dots">
                <span className="window-dot dot-red"></span>
                <span className="window-dot dot-yellow"></span>
                <span className="window-dot dot-green"></span>
              </div>
              <span className="preview-tab-title">novatask.dev/dashboard • Live Workspace Preview</span>
              <span className="badge badge-completed">● Online Sync</span>
            </div>

            <div className="preview-content" style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Sprint Q4 Delivery Pipeline</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>6 high-priority tasks in progress across Engineering & Design</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span className="badge badge-in-progress">In Progress</span>
                  <span className="badge badge-urgent">Urgent</span>
                </div>
              </div>

              {/* Sample simulated item rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <FiCheckCircle style={{ color: 'var(--success)' }} />
                    <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>Implement OAuth 2.0 & Multi-Factor Auth</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span className="badge badge-urgent">Urgent</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>75%</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <FiCheckCircle style={{ color: 'var(--warning)' }} />
                    <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>Revamp Design System & Dark Mode Micro-Interactions</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span className="badge badge-high">High</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--warning)' }}>90%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="section-header">
          <span className="section-tag">Key Capabilities</span>
          <h2 className="section-title">Engineered for High-Velocity Execution</h2>
          <p className="section-subtitle">
            Eliminate communication silos and empower your organization with robust project tooling.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FiLayers />
            </div>
            <h3 className="feature-title">Table & Card Views</h3>
            <p className="feature-desc">
              Toggle seamlessly between a dense tabular spreadsheet view for bulk oversight and an interactive card layout for focused sprint planning.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FiBarChart2 />
            </div>
            <h3 className="feature-title">Real-Time KPI Analytics</h3>
            <p className="feature-desc">
              Instant visibility into completion percentages, high-priority bottlenecks, category breakdowns, and team workload distributions.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FiZap />
            </div>
            <h3 className="feature-title">Instant Search & Multi-Filters</h3>
            <p className="feature-desc">
              Search by title, description, or team member name with millisecond latency. Filter dynamically across status, priority, and categories.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FiCheckCircle />
            </div>
            <h3 className="feature-title">Full CRUD Operations</h3>
            <p className="feature-desc">
              Add new tasks with rich subtask checklists, update parameters seamlessly, inspect full specification modals, and remove completed work with confirmation.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FiShield />
            </div>
            <h3 className="feature-title">Zero-Friction Authentication</h3>
            <p className="feature-desc">
              Pre-built authentication context featuring 1-click Demo accounts for instant developer evaluation alongside secure user registration.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FiCpu />
            </div>
            <h3 className="feature-title">Hybrid Express + Local Sync</h3>
            <p className="feature-desc">
              Works independently with client-side localStorage fallback or connects directly to the Node.js Express REST API backend when active.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container" style={{ padding: '2rem 1.5rem 5rem 1.5rem' }}>
        <div className="section-header">
          <span className="section-tag">Social Proof</span>
          <h2 className="section-title">Loved by Engineering Leaders</h2>
          <p className="section-subtitle">
            See how forward-thinking product teams accelerate their shipping velocity.
          </p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-rating">
              <FiStar /><FiStar /><FiStar /><FiStar /><FiStar />
            </div>
            <p className="testimonial-quote">
              "NovaTask Pro replaced three disjointed tools for our engineering department. The ability to toggle between table sorting and interactive cards is incredible."
            </p>
            <div className="testimonial-author">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" 
                alt="Elena" 
                className="author-avatar" 
              />
              <div>
                <div className="author-name">Elena Rostova</div>
                <div className="author-role">VP of Product at HyperCloud</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-rating">
              <FiStar /><FiStar /><FiStar /><FiStar /><FiStar />
            </div>
            <p className="testimonial-quote">
              "The validation feedback, subtask checklists, and responsive dark mode make this one of the cleanest React interfaces our team has ever experienced."
            </p>
            <div className="testimonial-author">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80" 
                alt="Marcus" 
                className="author-avatar" 
              />
              <div>
                <div className="author-name">Marcus Brody</div>
                <div className="author-role">Staff Infrastructure Engineer</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-rating">
              <FiStar /><FiStar /><FiStar /><FiStar /><FiStar />
            </div>
            <p className="testimonial-quote">
              "Setup took under 60 seconds. The hybrid API fallback and zero-configuration demo login allowed our executive stakeholders to evaluate the app immediately."
            </p>
            <div className="testimonial-author">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80" 
                alt="Sarah" 
                className="author-avatar" 
              />
              <div>
                <div className="author-name">Sarah Jenkins</div>
                <div className="author-role">Founder & Chief Architect</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container">
        <div className="cta-banner">
          <h2 className="cta-title">Ready to Elevate Your Team's Productivity?</h2>
          <p className="cta-desc">
            Join thousands of professionals building the future. Launch your workspace in seconds with zero configuration required.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/dashboard" className="btn btn-secondary btn-lg" style={{ background: '#ffffff', color: '#4f46e5', border: 'none' }}>
              Launch Live Dashboard <FiArrowRight />
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg" style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)' }}>
              Sign Up For Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
