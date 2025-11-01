import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Createacc.css';
import { useAuth } from '../context/AuthContext';

const Createacc = ({ setusername }) => {
  const [creatName, setcreateName] = useState('');
  const [creatEmail, setcreateEmail] = useState('');
  const [creatPass, setcreatePass] = useState('');
  const [creatPhone, setcreatePhone] = useState('');
  const [para, setPara] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const subtn = async (e) => {
    e.preventDefault();

    if (!creatName.trim()) {
      setPara('Please enter your name');
      return;
    }
    if (!creatEmail.trim()) {
      setPara('Please enter your email');
      return;
    }
    if (!creatPass || creatPass.length < 6) {
      setPara('Password must be at least 6 characters');
      return;
    }

    try {
      const result = await register(creatName, creatEmail, creatPass, creatPhone);
      if (result.success) {
        setusername(result.user?.name || 'welcome-' + creatName);
        navigate('/');
        setcreateName('');
        setcreateEmail('');
        setcreatePass('');
        setcreatePhone('');
        setPara('');
      } else {
        setPara(result.message || 'Registration failed');
      }
    } catch (err) {
      setPara('An error occurred during registration');
      console.error(err);
    }
  };

  const resetbtn = () => {
    setcreateEmail('');
    setcreateName('');
    setcreatePass('');
    setcreatePhone('');
    setPara('');
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-left">
          <div className="register-illustration">
            <div className="illustration-circle circle-1"></div>
            <div className="illustration-circle circle-2"></div>
            <div className="illustration-circle circle-3"></div>
            <div className="illustration-icon">✨</div>
          </div>
          <h2 className="register-welcome">Join ScholarPath!</h2>
          <p className="register-subtitle">Create your account and start discovering scholarships</p>
        </div>

        <div className="register-right">
          <div className="register-card">
            <div className="register-header">
              <h1 className="register-title">Create Account</h1>
              <p className="register-description">Fill in your details to get started</p>
            </div>

            <form onSubmit={subtn} className="register-form">
              {para && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {para}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="name">
                  <span className="label-icon">👤</span>
                  Full Name
                  <span className="required-star">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={creatName}
                  onChange={(e) => {
                    setcreateName(e.target.value);
                    setPara('');
                  }}
                  placeholder="Enter your full name"
                  autoFocus
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <span className="label-icon">📧</span>
                  Email Address
                  <span className="required-star">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={creatEmail}
                  onChange={(e) => {
                    setcreateEmail(e.target.value);
                    setPara('');
                  }}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <span className="label-icon">🔒</span>
                  Password
                  <span className="required-star">*</span>
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={creatPass}
                    onChange={(e) => {
                      setcreatePass(e.target.value);
                      setPara('');
                    }}
                    placeholder="Enter password (min 6 characters)"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                <small className="password-hint">Minimum 6 characters required</small>
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  <span className="label-icon">📱</span>
                  Phone Number <span className="optional">(Optional)</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={creatPhone}
                  onChange={(e) => {
                    setcreatePhone(e.target.value);
                    setPara('');
                  }}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  <span>Create Account</span>
                  <span className="btn-arrow">→</span>
                </button>
                <button type="button" onClick={resetbtn} className="btn-secondary">
                  Reset
                </button>
              </div>

              <div className="register-footer">
                <p className="login-link">
                  Already have an account?{' '}
                  <Link to="/Login" className="link-primary">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Createacc;
