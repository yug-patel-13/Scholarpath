import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { formFillRequestAPI, scholarshipAPI } from '../services/api';
import './FormFillRequest.css';

const FormFillRequest = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    requestType: 'online',
    scholarshipId: '',
    formName: '',
    description: '',
    contactPhone: '',
    contactEmail: '',
    address: '',
    pincode: '382418',
    preferredDate: '',
    preferredTime: '',
  });
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/Login');
      return;
    }
    loadScholarships();
    
    // Check if scholarship ID was passed from navigation
    const locationState = location.state || {};
    if (locationState.scholarshipId) {
      setFormData(prev => ({
        ...prev,
        scholarshipId: locationState.scholarshipId.toString(),
        formName: locationState.scholarshipTitle || '',
        description: locationState.scholarshipTitle 
          ? `I need help filling the form for: ${locationState.scholarshipTitle}`
          : prev.description
      }));
    }
  }, [isAuthenticated, navigate, location]);

  const loadScholarships = async () => {
    try {
      const response = await scholarshipAPI.getAll();
      setScholarships(response.data);
    } catch (error) {
      console.error('Error loading scholarships:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-fill formName when scholarship is selected
    if (name === 'scholarshipId') {
      if (value) {
        const selectedScholarship = scholarships.find(sch => sch.id.toString() === value);
        if (selectedScholarship) {
          setFormData((prev) => ({
            ...prev,
            [name]: value,
            formName: selectedScholarship.title,
            description: prev.description || `I need help filling the form for: ${selectedScholarship.title}`
          }));
          return;
        }
      } else {
        // If scholarship is cleared, clear formName if it was auto-filled
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          formName: prev.formName && scholarships.find(sch => sch.title === prev.formName) ? '' : prev.formName
        }));
        return;
      }
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login first');
      navigate('/Login');
      return;
    }

    setLoading(true);
    try {
      // Validate formName - required only if no scholarship is selected
      if (!formData.scholarshipId && (!formData.formName || formData.formName.trim() === '')) {
        alert('Please enter a form name or select a benefit/scholarship from the list.');
        setLoading(false);
        return;
      }

      // Ensure description is always provided and valid
      let description = (formData.description || '').trim();
      if (!description || description.length < 10) {
        if (formData.formName) {
          description = `I need help filling the form for: ${formData.formName}. Please assist me with the complete process.`;
        } else {
          alert('Please provide a description of the help you need (at least 10 characters).');
          setLoading(false);
          return;
        }
      }

      // Ensure formName is set
      let formName = formData.formName?.trim() || '';
      if (!formName && formData.scholarshipId) {
        const selectedScholarship = scholarships.find(sch => sch.id.toString() === formData.scholarshipId);
        formName = selectedScholarship?.title || '';
      }

      const requestData = {
        userId: user.id,
        requestType: formData.requestType,
        description: description,
        contactPhone: formData.contactPhone || user.phone || '',
        contactEmail: formData.contactEmail || user.email || '',
        address: formData.address || '',
        pincode: formData.pincode || '',
        preferredTime: formData.preferredTime || '',
      };

      // Only include preferredDate if it's provided and not empty
      if (formData.preferredDate && formData.preferredDate.trim() !== '') {
        requestData.preferredDate = formData.preferredDate;
      }

      // Only include scholarshipId if it's selected and convert to number
      if (formData.scholarshipId && formData.scholarshipId !== '') {
        requestData.scholarshipId = parseInt(formData.scholarshipId, 10);
      }

      // Include formName
      if (formName) {
        requestData.formName = formName;
      }

      await formFillRequestAPI.create(requestData);
      setSubmitted(true);
      alert('Request submitted successfully! We will contact you soon.');
    } catch (error) {
      console.error('Error submitting request:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error submitting request. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (submitted) {
    return (
      <div className="form-fill-request-container">
        <div className="success-message">
          <h2>Request Submitted Successfully!</h2>
          <p>We have received your form fill request. Our team will contact you soon.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-fill-request-container">
      <h1 className="page-title">
        <span className="highlight-text">Book Form Fill Helper</span> - Request Service
      </h1>
      <p className="page-description">
        Need help filling out <strong>benefits or other forms</strong>? Request our assistance and we'll help you complete
        the process. Whether it's JEE Main, scholarship forms, farmer benefits, or any other government form - we're here to help!
      </p>

      <div className="request-types-info">
        <div className="info-card">
          <h3>Online Request</h3>
          <p>
            Submit your documents via WhatsApp, and our team will fill the form for you remotely.
            You'll receive all updates and completed forms digitally.
          </p>
        </div>
        <div className="info-card">
          <h3>Offline Request (Coming Soon)</h3>
          <p>
            Book a form filler service similar to Uber or food delivery. A trained representative
            will visit your location to help you complete the forms. This feature will be available
            soon!
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="request-form">
        <div className="form-group">
          <label>
            Request Type <span className="required">*</span>
          </label>
          <select
            name="requestType"
            value={formData.requestType}
            onChange={handleChange}
            required
          >
            <option value="online">Online (via WhatsApp)</option>
            <option value="offline">Offline (Coming Soon - Booking Service)</option>
          </select>
          {formData.requestType === 'offline' && (
            <div className="info-badge">
              <p>
                Offline booking service is coming soon! You can still submit the request(on 382418 pincode only), and we'll
                notify you when it's available.
                
              </p>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Benefits or Other Form Help</label>
          <select name="scholarshipId" value={formData.scholarshipId} onChange={handleChange}>
            <option value="">Select a benefit/scholarship (optional)</option>
            {scholarships.map((sch) => (
              <option key={sch.id} value={sch.id}>
                {sch.title}
              </option>
            ))}
          </select>
          <small className="field-hint">Select a benefit/scholarship to auto-fill the form name</small>
        </div>

        <div className="form-group">
          <label>
            Form Name {!formData.scholarshipId && <span className="required">*</span>}
            <span className="help-text">(e.g., JEE Main form, PM Kisan form, Scholarship form, etc.)</span>
          </label>
          <input
            type="text"
            name="formName"
            value={formData.formName}
            onChange={handleChange}
            placeholder={formData.scholarshipId ? "Form name auto-filled from selection (you can edit)" : "Enter form name (e.g., JEE Main form, PM Kisan form)"}
            required={!formData.scholarshipId}
          />
          {formData.scholarshipId && (
            <small className="field-hint success-hint">
              ✓ Form name auto-filled from selected benefit. You can edit if needed.
            </small>
          )}
        </div>

        <div className="form-group">
          <label>
            Additional Description <span className="required">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            placeholder="Describe what help you need... (e.g., I need help filling JEE Main form, or I need assistance with PM Kisan application)"
            required
            minLength={10}
          />
          <small className="field-hint">Please provide at least a brief description of the help you need</small>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Contact Phone <span className="required">*</span></label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder={user.phone || 'Enter phone number'}
              required
            />
          </div>

          <div className="form-group">
            <label>Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder={user.email || 'Enter email'}
            />
          </div>
        </div>

        {formData.requestType === 'offline' && (
          <>
            <div className="form-group">
              <label>Address <span className="required">*</span></label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                placeholder="Enter your address for offline service"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Pincode  <span className="required">*</span> </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Preferred Date</label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Preferred Time</label>
                <input
                  type="time"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                />
              </div>
            </div>
          </>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
          <button type="button" onClick={() => navigate('/')} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormFillRequest;

