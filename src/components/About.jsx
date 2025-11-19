import React from 'react';
import './About.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation('global');

  return (
    <div className="about-page-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-main-title">{t('about.hero.title')}</h1>
          <p className="about-hero-text">
            {t('about.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission">
        <div className="container">
          <div className="mission-content">
            <h2 className="section-title">{t('about.mission.title')}</h2>
            <p className="mission-text">
              {t('about.mission.description')}
            </p>
            <div className="mission-stats">
              <div className="mission-stat">
                <div className="stat-number">100+</div>
                <div className="stat-label">{t('about.mission.stats.scholarships')}</div>
              </div>
              <div className="mission-stat">
                <div className="stat-number">5</div>
                <div className="stat-label">{t('about.mission.stats.categories')}</div>
              </div>
              <div className="mission-stat">
                <div className="stat-number">1000+</div>
                <div className="stat-label">{t('about.mission.stats.users')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="about-features">
        <div className="container">
          <h2 className="section-title center">{t('about.features.title')}</h2>
          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-icon">🎯</div>
              <h3>{t('about.features.items.eligibility.title')}</h3>
              <p>
                {t('about.features.items.eligibility.description')}
              </p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">📋</div>
              <h3>{t('about.features.items.guidance.title')}</h3>
              <p>
                {t('about.features.items.guidance.description')}
              </p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">📄</div>
              <h3>{t('about.features.items.pdf.title')}</h3>
              <p>
                {t('about.features.items.pdf.description')}
              </p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">📍</div>
              <h3>{t('about.features.items.locator.title')}</h3>
              <p>
                {t('about.features.items.locator.description')}
              </p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">💬</div>
              <h3>{t('about.features.items.formFill.title')}</h3>
              <p>
                {t('about.features.items.formFill.description')}
              </p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">✅</div>
              <h3>{t('about.features.items.tracking.title')}</h3>
              <p>
                {t('about.features.items.tracking.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="about-how-it-works">
        <div className="container">
          <h2 className="section-title center">{t('about.howItWorks.title')}</h2>
          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>{t('about.howItWorks.steps.step1.title')}</h3>
                <p>{t('about.howItWorks.steps.step1.description')}</p>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>{t('about.howItWorks.steps.step2.title')}</h3>
                <p>{t('about.howItWorks.steps.step2.description')}</p>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>{t('about.howItWorks.steps.step3.title')}</h3>
                <p>{t('about.howItWorks.steps.step3.description')}</p>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>{t('about.howItWorks.steps.step4.title')}</h3>
                <p>{t('about.howItWorks.steps.step4.description')}</p>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-item">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3>{t('about.howItWorks.steps.step5.title')}</h3>
                <p>{t('about.howItWorks.steps.step5.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="about-categories">
        <div className="container">
          <h2 className="section-title center">{t('about.categories.title')}</h2>
          <div className="categories-list">
            <div className="category-item">
              <div className="category-icon">👨‍🌾</div>
              <h3>{t('about.categories.farmer.title')}</h3>
              <p>{t('about.categories.farmer.description')}</p>
            </div>
            <div className="category-item">
              <div className="category-icon">📜</div>
              <h3>{t('about.categories.sc.title')}</h3>
              <p>{t('about.categories.sc.description')}</p>
            </div>
            <div className="category-item">
              <div className="category-icon">🎓</div>
              <h3>{t('about.categories.merit.title')}</h3>
              <p>{t('about.categories.merit.description')}</p>
            </div>
            <div className="category-item">
              <div className="category-icon">👩</div>
              <h3>{t('about.categories.women.title')}</h3>
              <p>{t('about.categories.women.description')}</p>
            </div>
            <div className="category-item">
              <div className="category-icon">💰</div>
              <h3>{t('about.categories.ews.title')}</h3>
              <p>{t('about.categories.ews.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="about-cta">
          <div className="container">
            <div className="cta-box">
              <h2>{t('about.cta.title')}</h2>
              <p>{t('about.cta.subtitle')}</p>
              <Link to="/Login" className="btn-primary-large">
                {t('about.cta.button')}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="about-contact">
        <div className="container">
          <h2 className="section-title center">{t('about.contact.title')}</h2>
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">📧</div>
              <h3>{t('about.contact.email')}</h3>
              <p>yugpatelart@gmail.com</p>
            </div>
            <div className="contact-item">
              <div className="contact-icon">💬</div>
              <h3>{t('about.contact.support')}</h3>
              <p>{t('about.contact.supportText')}</p>
            </div>
            <div className="contact-item">
              <div className="contact-icon">🌐</div>
              <h3>{t('about.contact.social')}</h3>
              <p>{t('about.contact.socialText')}</p>
            </div>
          </div>
          <div className="contact-actions">
            <Link to="/contact" className="btn-secondary-large">
              {t('about.contact.contactUs')}
            </Link>
            <Link to="/faq" className="btn-secondary-large">
              {t('about.contact.viewFaq')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
