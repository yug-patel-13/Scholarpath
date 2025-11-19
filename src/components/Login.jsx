import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Login = ({ setusername }) => {
  const [loginName, setLoginName] = useState('');
  const [passwordd, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation('global');

  const reset = () => {
    setLoginName('');
    setPassword('');
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginName || !passwordd) {
      setErrorMsg(t('login.errors.required'));
      return;
    }

    try {
      const result = await login(loginName, passwordd);
      if (result.success) {
        setusername(result.user.name || 'welcome-back');
        navigate('/');
      } else {
        setErrorMsg(result.message || t('login.errors.invalid'));
      }
    } catch (err) {
      setErrorMsg(t('login.errors.error'));
      console.log(err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-illustration">
            <div className="illustration-circle circle-1"></div>
            <div className="illustration-circle circle-2"></div>
            <div className="illustration-circle circle-3"></div>
            <div className="illustration-icon">🎓</div>
          </div>
          <h2 className="login-welcome">{t('login.welcome')}</h2>
          <p className="login-subtitle">{t('login.subtitle')}</p>
        </div>

        <div className="login-right">
          <div className="login-card">
            <div className="login-header">
              <h1 className="login-title">{t('login.title')}</h1>
              <p className="login-description">{t('login.description')}</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">
                  <span className="label-icon">📧</span>
                  {t('login.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={loginName}
                  onChange={(e) => {
                    setLoginName(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder={t('login.emailPlaceholder')}
                  autoFocus
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <span className="label-icon">🔒</span>
                  {t('login.password')}
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordd}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder={t('login.passwordPlaceholder')}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {errorMsg}
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  <span>{t('login.signIn')}</span>
                  <span className="btn-arrow">→</span>
                </button>
                <button type="button" onClick={reset} className="btn-secondary">
                  {t('common.cancel')}
                </button>
              </div>

              <div className="login-footer">
                <p className="register-link">
                  {t('login.noAccount')}{' '}
                  <Link to="/new" className="link-primary">
                    {t('login.createAccount')}
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

export default Login;
