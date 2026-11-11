import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  FiLayers, 
  FiSun, 
  FiMoon, 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiCheckSquare,
  FiPlus,
  FiUser
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/navbar.css';

const Navbar = ({ onOpenCreateModal }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <FiCheckSquare />
          </div>
          <span>NovaTask<span className="brand-badge">PRO</span></span>
        </Link>

        {/* Navigation Links */}
        <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </NavLink>
          </li>
        </ul>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Quick Create Button (visible when logged in) */}
          {isAuthenticated && onOpenCreateModal && (
            <button 
              className="btn btn-primary btn-sm"
              onClick={onOpenCreateModal}
              title="Add New Task"
            >
              <FiPlus /> <span>New Task</span>
            </button>
          )}

          {/* Theme Switcher Button */}
          <button 
            className="btn-icon" 
            onClick={toggleTheme} 
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDark ? <FiSun /> : <FiMoon />}
          </button>

          {/* User Profile or Auth Buttons */}
          {isAuthenticated ? (
            <div className="user-profile-menu">
              <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"} 
                alt={user?.name || "User"} 
                className="user-avatar" 
              />
              <span className="user-name">{user?.name}</span>
              <button 
                onClick={handleLogout} 
                className="btn-icon" 
                style={{ width: '28px', height: '28px', border: 'none', background: 'transparent' }} 
                title="Log out"
              >
                <FiLogOut />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Menu Toggle */}
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
