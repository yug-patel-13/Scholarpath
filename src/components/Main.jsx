import React, { useState } from 'react';
import "./Main.css";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Main = ({ username }) => {
  const [Active, setActive] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation("global");

  // Update active link based on current location
  React.useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActive('home');
    else if (path === '/about') setActive('about');
    else if (path === '/contact') setActive('contact');
    else if (path === '/faq') setActive('faq');
    else if (path === '/form-fill-request') setActive('form-fill-request');
    else if (path === '/admin') setActive('admin');
    else if (path === '/Login') setActive('Login');
  }, [location]);

  const handlang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  const handleAct = (Linkname) => {
    setActive(Linkname);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setActive('home');
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-logo">
          <Link to="/" onClick={() => handleAct('home')} className="logo-link">
            <img src="scoimg.png" alt="ScholarPath Logo" className="logo-image" />
            <div className="logo-text">
              <span className="logo-title">ScholarPath</span>
              <span className="logo-tagline">Your Scholarship Partner</span>
            </div>
          </Link>
        </div>

        {/* Language Selector */}
        <div className="navbar-language">
          <select 
            name="language" 
            className="language-select" 
            onChange={(e) => handlang(e.target.value)}
            value={i18n.language || 'en'}
          >
            <option value="en">EN</option>
            <option value="guj">ગુજ</option>
            <option value="hn">HI</option>
          </select>
        </div>

        {/* Desktop Navigation Links */}
        <div className="navbar-links">
          <Link 
            to="/" 
            className={`nav-link ${Active === "home" ? "active" : ""}`}
            onClick={() => handleAct('home')}
          >
            <span>{t('nav.home')}</span>
          </Link>
          
          <Link 
            to="/about" 
            className={`nav-link ${Active === "about" ? "active" : ""}`}
            onClick={() => handleAct('about')}
          >
            <span>{t('nav.about')}</span>
          </Link>
          
          <Link 
            to="/contact" 
            className={`nav-link ${Active === "contact" ? "active" : ""}`}
            onClick={() => handleAct('contact')}
          >
            <span>{t('nav.contact')}</span>
          </Link>
          
          {user && (
            <Link 
              to="/form-fill-request" 
              className={`nav-link form-help-link ${Active === "form-fill-request" ? "active" : ""}`}
              onClick={() => handleAct('form-fill-request')}
            >
              <span className="form-help-text">📋 {t('nav.formHelp')}</span>
              <span className="form-help-badge">{t('nav.new')}</span>
            </Link>
          )}

          <Link 
            to="/faq" 
            className={`nav-link ${Active === "faq" ? "active" : ""}`}
            onClick={() => handleAct('faq')}
          >
            <span>{t('nav.faq')}</span>
          </Link>

          {isAdmin && (
            <Link 
              to="/admin" 
              className={`nav-link admin-link ${Active === "admin" ? "active" : ""}`}
              onClick={() => handleAct('admin')}
            >
              <span>{t('nav.admin')}</span>
            </Link>
          )}

          {/* User Section */}
          <div className="navbar-user">
            {user ? (
              <div className="user-menu">
                <div className="user-info">
                  <div className="user-avatar">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="user-details">
                    <span className="user-name">{username}</span>
                    <span className="user-email">{user.email}</span>
                  </div>
                </div>
                <button 
                  className="logout-btn" 
                  onClick={handleLogout}
                  title={t('nav.logout')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/Login" 
                className="login-btn"
                onClick={() => handleAct('Login')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                <span>{t('nav.login')}</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        <Link 
          to="/" 
          className={`mobile-nav-link ${Active === "home" ? "active" : ""}`}
          onClick={() => handleAct('home')}
        >
          <span>{t('nav.home')}</span>
        </Link>
        
        <Link 
          to="/about" 
          className={`mobile-nav-link ${Active === "about" ? "active" : ""}`}
          onClick={() => handleAct('about')}
        >
          <span>{t('nav.about')}</span>
        </Link>
        
        <Link 
          to="/contact" 
          className={`mobile-nav-link ${Active === "contact" ? "active" : ""}`}
          onClick={() => handleAct('contact')}
        >
          <span>{t('nav.contact')}</span>
        </Link>
        
        <Link 
          to="/faq" 
          className={`mobile-nav-link ${Active === "faq" ? "active" : ""}`}
          onClick={() => handleAct('faq')}
        >
          <span>{t('nav.faq')}</span>
        </Link>

        {user && (
          <Link 
            to="/form-fill-request" 
            className={`mobile-nav-link form-help-link ${Active === "form-fill-request" ? "active" : ""}`}
            onClick={() => handleAct('form-fill-request')}
          >
            <span className="form-help-text">📋 {t('nav.formHelp')}</span>
            <span className="form-help-badge">{t('nav.new')}</span>
          </Link>
        )}

        {isAdmin && (
          <Link 
            to="/admin" 
            className={`mobile-nav-link admin-link ${Active === "admin" ? "active" : ""}`}
            onClick={() => handleAct('admin')}
          >
            <span>{t('nav.admin')}</span>
          </Link>
        )}

        <div className="mobile-user-section">
          {user ? (
            <>
              <div className="mobile-user-info">
                <div className="user-avatar">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="user-details">
                  <span className="user-name">{username}</span>
                  <span className="user-email">{user.email}</span>
                </div>
              </div>
              <button 
                className="mobile-logout-btn" 
                onClick={handleLogout}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>{t('nav.logout')}</span>
              </button>
            </>
          ) : (
            <Link 
              to="/Login" 
              className="mobile-login-btn"
              onClick={() => handleAct('Login')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
              <span>{t('nav.login')}</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Main;
