import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { userAPI as userProfileAPI, scholarshipAPI } from '../services/api';
import { formFillRequestAPI } from '../services/api';
import { jsPDF } from 'jspdf';
import './Merit.css';

const Merit = () => {
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
      alert('Error submitting form. Please try again.');
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

  if (!isAuthenticated) {
    return null;
  }

  if (submitted) {
    return (
      <div className="merit-container">
        <div className="results-section">
          <h1 className="page-title">Eligible Scholarships</h1>
          <p className="results-subtitle">
            We found {scholarships.length} scholarship{scholarships.length !== 1 ? 's' : ''} you're eligible for
          </p>

          {scholarships.length === 0 ? (
            <div className="no-results">
              <p>No scholarships found matching your profile.</p>
              <button onClick={() => setSubmitted(false)} className="btn-secondary">
                Update Profile
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
                      <h3>Application Steps:</h3>
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
                      <h3>Required Documents:</h3>
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
                        Apply Now
                      </a>
                    )}
                    <button
                      onClick={() => downloadPDF(scholarship)}
                      className="btn-secondary"
                    >
                      📥 Download PDF
                    </button>
                    <button onClick={findNearestCyberCafe} className="btn-secondary">
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
              Update Profile
            </button>
            <a href="/form-fill-request" className="btn-primary">
              Request Form Fill Help
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="merit-container">
      <div className="merit-form-wrapper">
        <h1 className="page-title">Merit-Based & CMSS Scholarship Eligibility</h1>
        <p className="page-description">
          Fill in your details to find merit-based scholarships and CMSS (Chief Minister Scholarship Scheme) you're eligible for
        </p>

        <form onSubmit={handleSubmit} className="merit-form">
          {/* Personal Information */}
          <div className="form-section">
            <h2 className="section-title">Personal Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label>Phone Number <span className="required">*</span></label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label>Age <span className="required">*</span></label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="1"
                  max="100"
                  placeholder="Enter your age"
                />
              </div>

              <div className="form-group">
                <label>Gender <span className="required">*</span></label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Caste/Category <span className="required">*</span></label>
                <select
                  name="caste"
                  value={formData.caste}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="general">General</option>
                  <option value="sc">SC (Scheduled Caste)</option>
                  <option value="st">ST (Scheduled Tribe)</option>
                  <option value="obc">OBC (Other Backward Class)</option>
                  <option value="ebc">EBC (Economically Backward Class)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="form-section">
            <h2 className="section-title">Location Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>State <span className="required">*</span></label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  placeholder="Enter your state"
                />
              </div>

              <div className="form-group">
                <label>District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="Enter your district"
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                />
              </div>

              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                />
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="form-section">
            <h2 className="section-title">Financial Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Annual Family Income (Rs.) <span className="required">*</span></label>
                <input
                  type="number"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="Enter annual family income"
                />
              </div>

              <div className="form-group">
                <label>Aadhaar Number</label>
                <input
                  type="text"
                  name="aadhaar"
                  value={formData.aadhaar}
                  onChange={handleChange}
                  placeholder="Enter Aadhaar number (12 digits)"
                  maxLength="12"
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="form-section">
            <h2 className="section-title">Academic Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>10th Marks (%) <span className="required">*</span></label>
                <input
                  type="number"
                  name="marks10"
                  value={formData.marks10}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="Enter 10th percentage"
                />
              </div>

              <div className="form-group">
                <label>12th Marks (%) <span className="required">*</span></label>
                <input
                  type="number"
                  name="marks12"
                  value={formData.marks12}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="Enter 12th percentage"
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
            <h2 className="section-title">CMSS Special Categories (Optional)</h2>
            <p className="section-description" style={{ marginBottom: '20px', color: '#666', fontSize: '0.9rem' }}>
              Chief Minister Scholarship Scheme (CMSS) has 7 special categories. Select if you belong to any of these:
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
                  List of Taluka Having below 50% Literacy Rate (૫૦% થી ઓછો સાક્ષરતા દર)
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
                  Children of Martyrs (શહીદ જવાન અંગેનું પ્રમાણપત્ર)
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
                  Shramik Card (માન્ય શ્રમિક કાર્ડની વિગત)
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
                  Disability Certificate (વિકલાંગતા પ્રમાણપત્ર)
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
                  Widow Certificate (વિધવા પ્રમાણપત્ર)
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
                  Orphan Certificate (અનાથ અંગેનું પ્રમાણપત્ર)
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
                  Tyakta Certificate (ત્યકતા અંગેનું પ્રમાણપત્ર)
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
              {loading ? 'Checking Eligibility...' : 'Check Eligibility'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Merit;
