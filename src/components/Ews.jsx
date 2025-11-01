import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { userAPI as userProfileAPI, scholarshipAPI } from '../services/api';
import { jsPDF } from 'jspdf';
import './Merit.css';

const Ews = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    state: '',
    district: '',
    city: '',
    pincode: '',
    annualIncome: '',
    aadhaar: '',
    bankAccount: '',
    ifscCode: '',
    ewsCertificate: '',
    marks12: '', // Optional - only for some scholarships
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
          state: response.data.state || '',
          district: response.data.district || '',
          city: response.data.city || '',
          pincode: response.data.pincode || '',
          annualIncome: response.data.annualIncome || '',
          aadhaar: response.data.aadhaar || '',
          bankAccount: '',
          ifscCode: '',
          ewsCertificate: '',
          marks12: response.data.marks12 || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const profileData = {
        userId: user.id,
        category: 'ews',
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        caste: 'general', // EWS must be general category
        phone: formData.phone,
        state: formData.state,
        district: formData.district,
        city: formData.city,
        pincode: formData.pincode,
        annualIncome: parseFloat(formData.annualIncome),
        marks12: formData.marks12 ? parseFloat(formData.marks12) : null,
        aadhaar: formData.aadhaar,
      };

      await userProfileAPI.createProfile(profileData);
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
    doc.setFontSize(20);
    doc.text(scholarship.title, 105, 20, { align: 'center' });

    let y = 40;
    doc.setFontSize(12);
    doc.text('Description:', 20, y);
    y += 10;
    const descLines = doc.splitTextToSize(scholarship.description || 'No description available', 170);
    doc.text(descLines, 20, y);
    y += descLines.length * 7;

    if (scholarship.amount) {
      y += 5;
      doc.setFontSize(14);
      doc.text(`Amount: ₹${scholarship.amount.toLocaleString('en-IN')}`, 20, y);
      y += 10;
    }

    if (scholarship.link) {
      doc.setFontSize(10);
      doc.text('Official Link: ' + scholarship.link, 20, y);
      y += 10;
    }

    if (scholarship.steps && scholarship.steps.length > 0) {
      y += 5;
      doc.setFontSize(14);
      doc.text('Application Steps:', 20, y);
      y += 10;
      doc.setFontSize(10);
      scholarship.steps.forEach((step) => {
        if (y > 250) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(12);
        doc.text(step.title + ':', 25, y);
        y += 7;
        doc.setFontSize(10);
        step.items.forEach((item) => {
          if (y > 250) {
            doc.addPage();
            y = 20;
          }
          doc.text('• ' + item, 30, y);
          y += 7;
        });
        y += 3;
      });
    }

    if (scholarship.requiredDocuments && scholarship.requiredDocuments.length > 0) {
      if (y > 230) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(14);
      doc.text('Required Documents:', 20, y);
      y += 10;
      doc.setFontSize(10);
      scholarship.requiredDocuments.forEach((docName) => {
        if (y > 250) {
          doc.addPage();
          y = 20;
        }
        doc.text('• ' + docName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), 25, y);
        y += 7;
      });
    }

    doc.save(`${scholarship.title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
  };

  if (submitted) {
    return (
      <div className="merit-container">
        <div className="merit-form-wrapper">
          <h1 className="page-title">Eligible EWS Scholarships & Benefits</h1>
          <p className="page-description">
            You are eligible for {scholarships.length} scholarship(s) based on your profile
          </p>

          {scholarships.length === 0 ? (
            <div className="no-results">
              <p>Sorry, you are not eligible for any scholarships based on your current profile.</p>
              <p>Please ensure you have an EWS certificate and family income is below Rs. 8 lakh.</p>
              <button onClick={() => setSubmitted(false)} className="btn-primary">
                Update Profile
              </button>
            </div>
          ) : (
            <div className="scholarships-grid">
              {scholarships.map((scholarship) => (
                <div key={scholarship.id} className="scholarship-card">
                  <div className="scholarship-header">
                    <h3 className="scholarship-title">{scholarship.title}</h3>
                    {scholarship.amount && (
                      <div className="scholarship-amount">
                        ₹{scholarship.amount.toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>

                  <div className="scholarship-description">
                    {scholarship.description}
                  </div>

                  {scholarship.steps && scholarship.steps.length > 0 && (
                    <div className="scholarship-steps">
                      <h4>Application Steps:</h4>
                      {scholarship.steps.map((step, idx) => (
                        <div key={idx} className="step-section">
                          <strong>{step.title}:</strong>
                          <ul>
                            {step.items.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {scholarship.requiredDocuments && scholarship.requiredDocuments.length > 0 && (
                    <div className="required-documents">
                      <h4>Required Documents:</h4>
                      <ul>
                        {scholarship.requiredDocuments.map((doc, idx) => (
                          <li key={idx}>
                            {doc.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </li>
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
                        className="btn-link"
                      >
                        Visit Official Website
                      </a>
                    )}
                    <button
                      onClick={() => downloadPDF(scholarship)}
                      className="btn-download"
                    >
                      📥 Download PDF
                    </button>
                    <button
                      onClick={() => {
                        navigate('/form-fill-request', {
                          state: { scholarshipId: scholarship.id, scholarshipTitle: scholarship.title }
                        });
                      }}
                      className="btn-request"
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="merit-container">
      <div className="merit-form-wrapper">
        <h1 className="page-title">EWS (Economically Weaker Section) Benefits Eligibility</h1>
        <p className="page-description">
          Fill in your details to find EWS scholarships and benefits you're eligible for. Family income must be below Rs. 8 lakh per annum.
        </p>

        <form onSubmit={handleSubmit} className="merit-form">
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
            </div>
          </div>

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
                  placeholder="Enter annual family income (must be below Rs. 8 lakh)"
                />
                <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '5px' }}>
                  Must be below Rs. 8 lakh per annum for EWS eligibility
                </small>
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

              <div className="form-group">
                <label>Do you have EWS Certificate? <span className="required">*</span></label>
                <select
                  name="ewsCertificate"
                  value={formData.ewsCertificate}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="yes">Yes, I have EWS certificate</option>
                  <option value="no">No, I need to obtain it from Tehsildar/SDM office</option>
                </select>
                <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '5px' }}>
                  EWS certificate is mandatory for all EWS benefits. Visit Tehsildar/SDM office with income proof.
                </small>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Academic Information (Optional - Only for Education Scholarships)</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>12th Marks (%) - Only if you are a student</label>
                <input
                  type="number"
                  name="marks12"
                  value={formData.marks12}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="Enter 12th percentage (optional)"
                />
                <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '5px' }}>
                  Only required for education scholarships, not for other EWS benefits
                </small>
              </div>
            </div>
          </div>

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

export default Ews;
