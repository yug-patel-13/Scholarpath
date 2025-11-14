import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { categoryAPI } from '../services/api';
import './Home.css';

const Home = ({ username }) => {
  const [chat, setChat] = useState(false);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Farmer', imageUrl: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&h=600&fit=crop', description: 'Find farmer-specific scholarships and benefits' },
    { id: 2, name: 'SC/ST/OBC', imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop', description: 'Scholarships for SC, ST, and OBC categories' },
    { id: 3, name: 'Women', imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop', description: 'Exclusive scholarships for women' },
    { id: 4, name: 'EWS', imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop', description: 'Economically Weaker Section scholarships' },
    { id: 5, name: 'Merit Based', imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop', description: 'Merit-based scholarships & CMSS (Chief Minister Scholarship Scheme) for all students' },
  ]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
        // Map API categories to ensure they have required fields
        const apiCategories = response.data.map(cat => ({
          id: cat.id,
          name: cat.name,
          imageUrl: cat.imageUrl || getDefaultImage(cat.name),
          description: cat.description || getDefaultDescription(cat.name),
        }));
        setCategories(apiCategories);
      }
      // If API fails or returns empty, keep default categories (already set)
    } catch (error) {
      console.error('Error loading categories from API:', error);
      // Keep default categories (already set in useState)
    }
  };

  const getDefaultImage = (name) => {
    const images = {
      'Farmer': 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&h=600&fit=crop',
      'SC/ST/OBC': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop',
      'Women': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
      'EWS': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop',
      'Merit Based': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
    };
    return images[name] || 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&h=600&fit=crop';
  };

  const getDefaultDescription = (name) => {
    const descriptions = {
      'Farmer': 'Find farmer-specific scholarships and benefits',
      'SC/ST/OBC': 'Scholarships for SC, ST, and OBC categories',
      'Women': 'Exclusive scholarships for women',
      'EWS': 'Economically Weaker Section scholarships',
      'Merit Based': 'Merit-based scholarships & CMSS (Chief Minister Scholarship Scheme) for all students',
    };
    return descriptions[name] || `Find ${name} scholarships`;
  };

  const categoryLinks = {
    'Farmer': '/farmer',
    'SC/ST/OBC': '/sc',
    'Women': '/woman',
    'EWS': '/ews',
    'Merit Based': '/merit',
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        {/* Animated Background Elements */}
        <div className="hero-background">
          <div className="animated-circle circle-1"></div>
          <div className="animated-circle circle-2"></div>
          <div className="animated-circle circle-3"></div>
          <div className="animated-circle circle-4"></div>
          <div className="animated-square square-1"></div>
          <div className="animated-square square-2"></div>
          <div className="animated-pattern pattern-1"></div>
          <div className="animated-pattern pattern-2"></div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-title-line line-1">Find Your Perfect</span>
            <span className="hero-title-line line-2 gradient-text">Scholarship</span>
          </h1>
          <p className="hero-subtitle">
            Discover scholarships and benefits you're eligible for based on your profile
          </p>
          {!isAuthenticated && (
            <div className="hero-cta">
              <Link to="/Login" className="btn-primary">
                Get Started
              </Link>
              <Link to="/about" className="btn-secondary">
                Learn More
              </Link>
            </div>
          )}
        </div>

        <div className="hero-image">
          <div className="floating-card card-1">
            <div className="card-icon">🎓</div>
            <div className="card-content">
              <p className="card-title">Scholarships</p>
              <p className="card-subtitle">100+ Available</p>
            </div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <p className="card-title">Benefits</p>
              <p className="card-subtitle">Eligibility Match</p>
            </div>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">📍</div>
            <div className="card-content">
              <p className="card-title">Locations</p>
              <p className="card-subtitle">Find Cyber Cafes</p>
            </div>
          </div>
          <div className="floating-card card-4">
            <div className="card-icon">📋</div>
            <div className="card-content">
              <p className="card-title">Form Help</p>
              <p className="card-subtitle">Online/Offline</p>
            </div>
          </div>
          <div className="floating-card card-5">
            <div className="card-icon">✅</div>
            <div className="card-content">
              <p className="card-title">Tracking</p>
              <p className="card-subtitle">Stay Organized</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Always Visible */}
      <section className="categories-section">
        <div className="section-header">
          <h2 className="section-title">Choose Your Category</h2>
          <p className="section-description">
            {isAuthenticated 
              ? 'Select the category that best describes you to find relevant scholarships'
              : 'Login to access category forms and find your eligible scholarships'}
          </p>
          {!isAuthenticated && (
            <div className="login-prompt">
              <Link to="/Login" className="btn-primary">
                Login to Get Started
              </Link>
            </div>
          )}
        </div>

        <div className="categories-grid">
          {categories.length > 0 ? (
            categories.map((category) => {
              const categoryName = category.name;
              const categoryPath = categoryLinks[categoryName] || '/';
              const isDisabled = !isAuthenticated;

              return (
                <div
                  key={category.id}
                  className={`category-card ${isDisabled ? 'disabled' : 'active'}`}
                  onClick={isDisabled ? () => {
                    alert('Please login to access categories');
                    window.location.href = '/Login';
                  } : undefined}
                >
                  {isAuthenticated ? (
                    <Link to={categoryPath} className="category-link">
                      <div className="category-image-wrapper">
                        <img
                          src={category.imageUrl || getDefaultImage(categoryName)}
                          alt={categoryName}
                          className="category-image"
                          style={{
                            objectFit: 'cover',
                            objectPosition: categoryName === 'Farmer' ? 'center 30%' : 'center center',
                            transform: 'scale(1) rotate(0deg)',
                          }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200/667eea/ffffff?text=' + categoryName;
                          }}
                          onLoad={(e) => {
                            // Ensure image is not rotated incorrectly
                            e.target.style.transform = 'scale(1) rotate(0deg)';
                          }}
                        />
                        <div className="category-overlay">
                          <span className="category-icon">→</span>
                          <p className="overlay-text">Click to Fill Form</p>
                        </div>
                      </div>
                      <div className="category-content">
                        <h3 className="category-name">{categoryName}</h3>
                        <p className="category-description">{category.description || `Find ${categoryName} scholarships`}</p>
                        <div className="category-badge">Click to Start</div>
                      </div>
                    </Link>
                  ) : (
                    <>
                      <div className="category-image-wrapper">
                        <img
                          src={category.imageUrl || getDefaultImage(categoryName)}
                          alt={categoryName}
                          className="category-image"
                          style={{
                            objectFit: 'cover',
                            objectPosition: categoryName === 'Farmer' ? 'center 30%' : 'center center',
                            transform: 'scale(1) rotate(0deg)',
                          }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200/667eea/ffffff?text=' + categoryName;
                          }}
                          onLoad={(e) => {
                            // Ensure image is not rotated incorrectly
                            e.target.style.transform = 'scale(1) rotate(0deg)';
                          }}
                        />
                        <div className="category-overlay locked">
                          <span className="category-icon">🔒</span>
                          <p className="overlay-text">Login Required</p>
                        </div>
                      </div>
                      <div className="category-content">
                        <h3 className="category-name">{categoryName}</h3>
                        <p className="category-description">Login to access</p>
                        <div className="category-badge locked-badge">🔒 Locked</div>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          ) : (
            <div className="loading-categories">
              <p>Loading categories...</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose ScholarPath?</h2>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Accurate Eligibility</h3>
            <p>Advanced filtering ensures you only see scholarships you're fully eligible for</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>Step-by-Step Guide</h3>
            <p>Detailed instructions and document checklists for each scholarship</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Form Fill Service</h3>
            <p>Get help filling forms online via WhatsApp or book an offline service</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Find Cyber Cafes</h3>
            <p>Locate nearest cyber cafes to complete your application</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📥</div>
            <h3>Download PDFs</h3>
            <p>Download complete information and application packets</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Track Progress</h3>
            <p>Track your application progress and stay organized</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">100+</div>
            <div className="stat-label">Scholarships</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">5</div>
            <div className="stat-label">Categories</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1000+</div>
            <div className="stat-label">Users</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Find Your Scholarships?</h2>
            <p>Join thousands of students who found their perfect scholarship match</p>
            <Link to="/Login" className="btn-primary large">
              Get Started Free
            </Link>
          </div>
        </section>
      )}

      {/* Chatbot */}
      <Link to="/chatbot" className="chatbot-button" onMouseEnter={() => setChat(true)} onMouseLeave={() => setChat(false)}>
        <div className="chatbot-icon">
          <img src="/chatbot.png" alt="Chatbot" />
          {chat && <span className="chatbot-tooltip">Need help? Chat with us!</span>}
        </div>
      </Link>
    </div>
  );
};

export default Home;
