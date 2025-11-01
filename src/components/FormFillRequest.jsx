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
    description: '',
    contactPhone: '',
    contactEmail: '',
    address: '',
    pincode: '',
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
      await formFillRequestAPI.create({
        userId: user.id,
        ...formData,
        contactPhone: formData.contactPhone || user.phone,
        contactEmail: formData.contactEmail || user.email,
      });
      setSubmitted(true);
      alert('Request submitted successfully! We will contact you soon.');
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Error submitting request. Please try again.');
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
      <h1 className="page-title">Form Fill Request</h1>
      <p className="page-description">
        Need help filling out scholarship forms? Request our assistance and we'll help you complete
        the process.
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
                Offline booking service is coming soon! You can still submit the request, and we'll
                notify you when it's available.
              </p>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Scholarship (Optional)</label>
          <select name="scholarshipId" value={formData.scholarshipId} onChange={handleChange}>
            <option value="">Select a scholarship</option>
            {scholarships.map((sch) => (
              <option key={sch.id} value={sch.id}>
                {sch.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>
            Description <span className="required">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            placeholder="Describe what help you need..."
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Contact Phone</label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder={user.phone || 'Enter phone number'}
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
              <label>Address</label>
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
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
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

