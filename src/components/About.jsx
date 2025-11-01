import React from 'react';
import './About.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const About = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="about-page-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-main-title">About ScholarPath</h1>
          <p className="about-hero-text">
            Your trusted partner in discovering scholarships and government benefits
            you're eligible for. We simplify the complex process of finding and
            applying for financial aid.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission">
        <div className="container">
          <div className="mission-content">
            <h2 className="section-title">Our Mission</h2>
            <p className="mission-text">
              At ScholarPath, we believe that financial constraints should never be
              a barrier to education. Our mission is to connect students and eligible
              individuals with the scholarships and benefits they deserve, making the
              application process as simple and transparent as possible.
            </p>
            <div className="mission-stats">
              <div className="mission-stat">
                <div className="stat-number">100+</div>
                <div className="stat-label">Scholarships Available</div>
              </div>
              <div className="mission-stat">
                <div className="stat-number">5</div>
                <div className="stat-label">Major Categories</div>
              </div>
              <div className="mission-stat">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Happy Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="about-features">
        <div className="container">
          <h2 className="section-title center">What We Offer</h2>
          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-icon">🎯</div>
              <h3>Accurate Eligibility Matching</h3>
              <p>
                Our advanced algorithm ensures you only see scholarships and benefits
                you're fully eligible for, saving you time and effort.
              </p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">📋</div>
              <h3>Step-by-Step Guidance</h3>
              <p>
                Detailed instructions, document checklists, and progress tracking
                for each scholarship application.
              </p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">📄</div>
              <h3>PDF Downloads</h3>
              <p>
                Download complete information packages and application forms in
                PDF format for offline reference.
              </p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">📍</div>
              <h3>Cyber Cafe Locator</h3>
              <p>
                Find the nearest cyber cafes to complete your application process
                with our location finder.
              </p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">💬</div>
              <h3>Form Fill Service</h3>
              <p>
                Get help filling out forms online via WhatsApp or book an offline
                service for doorstep assistance.
              </p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">✅</div>
              <h3>Progress Tracking</h3>
              <p>
                Track your application progress, set reminders, and stay organized
                throughout the process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="about-how-it-works">
        <div className="container">
          <h2 className="section-title center">How It Works</h2>
          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Create Account</h3>
                <p>Sign up for free and create your profile</p>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Select Category</h3>
                <p>Choose from Farmer, SC/ST/OBC, Merit, Women, or EWS</p>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Fill Your Details</h3>
                <p>Provide your information for accurate eligibility checking</p>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Get Results</h3>
                <p>View eligible scholarships with complete details and steps</p>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-item">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3>Apply & Track</h3>
                <p>Apply for scholarships and track your progress</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="about-categories">
        <div className="container">
          <h2 className="section-title center">Our Categories</h2>
          <div className="categories-list">
            <div className="category-item">
              <div className="category-icon">👨‍🌾</div>
              <h3>Farmer</h3>
              <p>Benefits and scholarships for farmers and their children</p>
            </div>
            <div className="category-item">
              <div className="category-icon">📜</div>
              <h3>SC/ST/OBC</h3>
              <p>Scholarships for Scheduled Castes, Scheduled Tribes, and Other Backward Classes</p>
            </div>
            <div className="category-item">
              <div className="category-icon">🎓</div>
              <h3>Merit Based</h3>
              <p>Merit-based scholarships for high-performing students</p>
            </div>
            <div className="category-item">
              <div className="category-icon">👩</div>
              <h3>Women</h3>
              <p>Scholarships specifically designed for women students</p>
            </div>
            <div className="category-item">
              <div className="category-icon">💰</div>
              <h3>EWS</h3>
              <p>Economically Weaker Section scholarships and benefits</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="about-cta">
          <div className="container">
            <div className="cta-box">
              <h2>Ready to Get Started?</h2>
              <p>Join thousands of students who found their perfect scholarship match</p>
              <Link to="/Login" className="btn-primary-large">
                Get Started Free
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="about-contact">
        <div className="container">
          <h2 className="section-title center">Get In Touch</h2>
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">📧</div>
              <h3>Email</h3>
              <p>yugpatelart@gmail.com</p>
            </div>
            <div className="contact-item">
              <div className="contact-icon">💬</div>
              <h3>Support</h3>
              <p>We're here to help 24/7</p>
            </div>
            <div className="contact-item">
              <div className="contact-icon">🌐</div>
              <h3>Social Media</h3>
              <p>Follow us on social platforms</p>
            </div>
          </div>
          <div className="contact-actions">
            <Link to="/contact" className="btn-secondary-large">
              Contact Us
            </Link>
            <Link to="/faq" className="btn-secondary-large">
              View FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
