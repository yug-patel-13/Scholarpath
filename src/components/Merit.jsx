import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { userAPI as userProfileAPI, scholarshipAPI } from '../services/api';
import { formFillRequestAPI } from '../services/api';
import { jsPDF } from 'jspdf';
import { useTranslation } from 'react-i18next';
import './Merit.css';

const Merit = () => {
  const { t } = useTranslation('global');
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    caste: '',
    state: '',
    district: '',
    city: '',
    pincode: '',
    annualIncome: '',
    marks10: '',
    marks12: '',
    course: '',
    stream: '',
    college: '',
    aadhaar: '',
    bankAccount: '',
    ifscCode: '',
    // CMSS Special Categories
    lowLiteracyTaluka: false,
    childrenOfMartyrs: false,
    shramikCard: false,
    disabilityCertificate: false,
    widowCertificate: false,
    orphanCertificate: false,
    tyaktaCertificate: false,
  });

  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/Login');
      return;
    }
    if (user) {
      loadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, navigate]);

  const loadProfile = async () => {
    try {
      const response = await userProfileAPI.getProfile(user.id);
      if (response.data) {
        setFormData({
          name: response.data.name || user.name || '',
          email: user.email || '',
          phone: response.data.phone || user.phone || '',
          age: response.data.age || '',
          gender: response.data.gender || '',
          caste: response.data.caste || '',
          state: response.data.state || '',
          district: response.data.district || '',
          city: response.data.city || '',
          pincode: response.data.pincode || '',
          annualIncome: response.data.annualIncome || '',
          marks10: response.data.marks10 || '',
          marks12: response.data.marks12 || '',
          course: '',
          stream: '',
          college: '',
          aadhaar: response.data.aadhaar || '',
          bankAccount: '',
          ifscCode: '',
          // CMSS Special Categories
          lowLiteracyTaluka: response.data.lowLiteracyTaluka || false,
          childrenOfMartyrs: response.data.childrenOfMartyrs || false,
          shramikCard: response.data.shramikCard || false,
          disabilityCertificate: response.data.disabilityCertificate || false,
          widowCertificate: response.data.widowCertificate || false,
          orphanCertificate: response.data.orphanCertificate || false,
          tyaktaCertificate: response.data.tyaktaCertificate || false,
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const findNearestCyberCafe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          window.open(
            `https://www.google.com/maps/search/cyber+cafe/@${latitude},${longitude},12z`,
            '_blank'
          );
        },
        (error) => {
          alert('Could not get location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save/Update profile
      const profileData = {
        userId: user.id,
        category: 'merit',
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        caste: formData.caste,
        phone: formData.phone,
        state: formData.state,
        district: formData.district,
        city: formData.city,
        pincode: formData.pincode,
        annualIncome: parseFloat(formData.annualIncome),
        marks10: parseFloat(formData.marks10),
        marks12: parseFloat(formData.marks12),
        aadhaar: formData.aadhaar,
        // CMSS Special Categories
        lowLiteracyTaluka: formData.lowLiteracyTaluka || false,
        childrenOfMartyrs: formData.childrenOfMartyrs || false,
        shramikCard: formData.shramikCard || false,
        disabilityCertificate: formData.disabilityCertificate || false,
        widowCertificate: formData.widowCertificate || false,
        orphanCertificate: formData.orphanCertificate || false,
        tyaktaCertificate: formData.tyaktaCertificate || false,
      };

      await userProfileAPI.createProfile(profileData);

      // Get eligible scholarships
      const eligibleResponse = await scholarshipAPI.getEligible(user.id);
      setScholarships(eligibleResponse.data);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(t('common.error') + ': ' + (t('common.tryAgain', 'Please try again')));
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = (scholarship) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(scholarship.title, 20, 20);
    doc.setFontSize(12);
    let y = 40;
    doc.text(`Description: ${scholarship.description}`, 20, y);
    y += 20;
    if (scholarship.amount) {
      doc.text(`Amount: Rs. ${scholarship.amount}`, 20, y);
      y += 10;
    }
    if (scholarship.link) {
      doc.text(`Apply at: ${scholarship.link}`, 20, y);
      y += 20;
    }
    if (scholarship.steps) {
      doc.text('Application Steps:', 20, y);
      y += 10;
      scholarship.steps.forEach((stepGroup) => {
        doc.text(stepGroup.title, 20, y);
        y += 8;
        stepGroup.items.forEach((item) => {
          doc.text(`• ${item}`, 30, y);
          y += 8;
        });
        y += 5;
      });
    }
    doc.save(`${scholarship.title.replace(/\s+/g, '_')}.pdf`);
  };

  

  if (!isAuthenticated) {
    return null;
  }

  if (submitted) {
    return (
      <div className="merit-container">
        <div className="results-section">
          <h1 className="page-title">{t('merit.results.title')}</h1>
          <p className="results-subtitle">
            {t('merit.results.subtitle', { count: scholarships.length })}
          </p>

          {scholarships.length === 0 ? (
            <div className="no-results">
              <p>{t('merit.results.none')}</p>
              <button onClick={() => setSubmitted(false)} className="btn-secondary">
                {t('merit.results.updateProfile')}
              </button>
            </div>
          ) : (
            <div className="scholarships-grid">
              {scholarships.map((scholarship) => (
                <div key={scholarship.id} className="scholarship-card">
                  <div className="scholarship-header">
                    <h2 className="scholarship-title">{scholarship.title}</h2>
                    {scholarship.amount && (
                      <div className="scholarship-amount">
                        Rs. {scholarship.amount.toLocaleString()}
                      </div>
                    )}
                  </div>
                  <p className="scholarship-description">{scholarship.description}</p>

                  {scholarship.steps && (
                    <div className="scholarship-steps">
                      <h3>{t('merit.scholarship.steps')}:</h3>
                      {scholarship.steps.map((stepGroup, idx) => (
                        <div key={idx} className="step-group">
                          <h4>{stepGroup.title}</h4>
                          <ul>
                            {stepGroup.items.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {scholarship.requiredDocuments && (
                    <div className="required-documents">
                      <h3>{t('merit.scholarship.documents')}:</h3>
                      <ul>
                        {scholarship.requiredDocuments.map((doc, idx) => (
                          <li key={idx}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="scholarship-actions">
                    {scholarship.link && (
                      <a
                        href={scholarship.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                      >
                        {t('merit.scholarship.apply')}
                      </a>
                    )}
                    <button
                      onClick={() => downloadPDF(scholarship)}
                      className="btn-secondary"
                    >
                      📥 {t('merit.scholarship.downloadPDF')}
                    </button>

                    <button
                      onClick={() => findNearestCyberCafe()}
                      className="btn-cyber"
                      title="Find nearest cyber cafe"
                    >
                      📍 Find Cyber Cafe
                    </button>

                    <button
                      onClick={() => {
                        navigate('/form-fill-request', {
                          state: { scholarshipId: scholarship.id, scholarshipTitle: scholarship.title }
                        });
                      }}
                      className="btn-request"
                      title="Request help filling this form"
                    >
                      📋 Request Form Fill
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="actions-row">
            <button onClick={() => setSubmitted(false)} className="btn-secondary">
              {t('merit.results.updateProfile')}
            </button>
            <a href="/form-fill-request" className="btn-primary">
              {t('nav.formHelp')}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="merit-container">
      <div className="merit-form-wrapper">
        <h1 className="page-title">{t('merit.title')}</h1>
        <p className="page-description">
          {t('merit.subtitle')}
        </p>

        <form onSubmit={handleSubmit} className="merit-form">
          {/* Personal Information */}
          <div className="form-section">
            <h2 className="section-title">{t('common.personalInfo', 'Personal Information')}</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>{t('merit.name')} <span className="required">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={t('merit.name')}
                />
              </div>

              <div className="form-group">
                <label>{t('login.email')} <span className="required">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder={t('login.emailPlaceholder')}
                />
              </div>

              <div className="form-group">
                <label>{t('merit.phone')} <span className="required">*</span></label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder={t('merit.phone')}
                />
              </div>

              <div className="form-group">
                <label>{t('merit.age')} <span className="required">*</span></label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="1"
                  max="100"
                  placeholder={t('merit.age')}
                />
              </div>

              <div className="form-group">
                <label>{t('merit.gender')} <span className="required">*</span></label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t('merit.gender')}</option>
                  <option value="male">{t('merit.genders.male')}</option>
                  <option value="female">{t('merit.genders.female')}</option>
                  <option value="other">{t('merit.genders.other')}</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t('merit.caste')} <span className="required">*</span></label>
                <select
                  name="caste"
                  value={formData.caste}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t('merit.caste')}</option>
                  <option value="general">{t('merit.castes.general')}</option>
                  <option value="sc">{t('merit.castes.sc')}</option>
                  <option value="st">{t('merit.castes.st')}</option>
                  <option value="obc">{t('merit.castes.obc')}</option>
                  <option value="ebc">{t('merit.castes.ebc')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="form-section">
            <h2 className="section-title">{t('common.locationInfo', 'Location Information')}</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>{t('merit.state')} <span className="required">*</span></label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  placeholder={t('merit.state')}
                />
              </div>

              <div className="form-group">
                <label>{t('merit.district')}</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder={t('merit.district')}
                />
              </div>

              <div className="form-group">
                <label>{t('merit.city')}</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder={t('merit.city')}
                />
              </div>

              <div className="form-group">
                <label>{t('merit.pincode')}</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder={t('merit.pincode')}
                />
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="form-section">
            <h2 className="section-title">{t('common.financialInfo', 'Financial Information')}</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>{t('merit.annualIncome')} <span className="required">*</span></label>
                <input
                  type="number"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder={t('merit.annualIncome')}
                />
              </div>

              <div className="form-group">
                <label>{t('merit.aadhaar')}</label>
                <input
                  type="text"
                  name="aadhaar"
                  value={formData.aadhaar}
                  onChange={handleChange}
                  placeholder={t('merit.aadhaar')}
                  maxLength="12"
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="form-section">
            <h2 className="section-title">{t('common.academicInfo', 'Academic Information')}</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>{t('merit.marks10')} <span className="required">*</span></label>
                <input
                  type="number"
                  name="marks10"
                  value={formData.marks10}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder={t('merit.marks10')}
                />
              </div>

              <div className="form-group">
                <label>{t('merit.marks12')} <span className="required">*</span></label>
                <input
                  type="number"
                  name="marks12"
                  value={formData.marks12}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder={t('merit.marks12')}
                />
              </div>

              <div className="form-group">
                <label>Current Course/Stream</label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="e.g., B.Tech, B.Com, etc."
                />
              </div>

              <div className="form-group">
                <label>College/University</label>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Enter college name"
                />
              </div>
            </div>
          </div>

          {/* CMSS Special Categories */}
          <div className="form-section">
            <h2 className="section-title">{t('merit.cmssTitle')}</h2>
            <p className="section-description" style={{ marginBottom: '20px', color: '#666', fontSize: '0.9rem' }}>
              {t('merit.cmssDescription')}
            </p>
            <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  name="lowLiteracyTaluka"
                  checked={formData.lowLiteracyTaluka}
                  onChange={handleChange}
                  id="lowLiteracyTaluka"
                />
                <label htmlFor="lowLiteracyTaluka" style={{ margin: 0, cursor: 'pointer' }}>
                  {t('merit.cmssCategories.lowLiteracyTaluka')}
                </label>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  name="childrenOfMartyrs"
                  checked={formData.childrenOfMartyrs}
                  onChange={handleChange}
                  id="childrenOfMartyrs"
                />
                <label htmlFor="childrenOfMartyrs" style={{ margin: 0, cursor: 'pointer' }}>
                  {t('merit.cmssCategories.childrenOfMartyrs')}
                </label>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  name="shramikCard"
                  checked={formData.shramikCard}
                  onChange={handleChange}
                  id="shramikCard"
                />
                <label htmlFor="shramikCard" style={{ margin: 0, cursor: 'pointer' }}>
                  {t('merit.cmssCategories.shramikCard')}
                </label>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  name="disabilityCertificate"
                  checked={formData.disabilityCertificate}
                  onChange={handleChange}
                  id="disabilityCertificate"
                />
                <label htmlFor="disabilityCertificate" style={{ margin: 0, cursor: 'pointer' }}>
                  {t('merit.cmssCategories.disabilityCertificate')}
                </label>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  name="widowCertificate"
                  checked={formData.widowCertificate}
                  onChange={handleChange}
                  id="widowCertificate"
                />
                <label htmlFor="widowCertificate" style={{ margin: 0, cursor: 'pointer' }}>
                  {t('merit.cmssCategories.widowCertificate')}
                </label>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  name="orphanCertificate"
                  checked={formData.orphanCertificate}
                  onChange={handleChange}
                  id="orphanCertificate"
                />
                <label htmlFor="orphanCertificate" style={{ margin: 0, cursor: 'pointer' }}>
                  {t('merit.cmssCategories.orphanCertificate')}
                </label>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  name="tyaktaCertificate"
                  checked={formData.tyaktaCertificate}
                  onChange={handleChange}
                  id="tyaktaCertificate"
                />
                <label htmlFor="tyaktaCertificate" style={{ margin: 0, cursor: 'pointer' }}>
                  {t('merit.cmssCategories.tyaktaCertificate')}
                </label>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="form-section">
            <h2 className="section-title">Bank Details (Optional)</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Bank Account Number</label>
                <input
                  type="text"
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleChange}
                  placeholder="Enter bank account number"
                />
              </div>

              <div className="form-group">
                <label>IFSC Code</label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  placeholder="Enter IFSC code"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? t('merit.loading') : t('merit.submit')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              {t('common.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Merit;
