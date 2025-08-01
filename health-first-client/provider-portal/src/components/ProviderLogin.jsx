import { useState } from 'react';
import './ProviderLogin.css';

const ProviderLogin = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Real-time email validation
    if (name === 'email') {
      setIsEmailValid(validateEmail(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Here you would normally handle the actual login
      console.log('Provider login attempt:', formData);
      
      // If login is successful and onLoginSuccess callback is provided, call it
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        alert('Provider login functionality will be implemented with backend integration');
      }
    }, 1500);
  };

  const handleForgotPassword = () => {
    alert('Password reset functionality will be implemented');
  };

  const simulateError = (errorType) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      switch(errorType) {
        case 'invalid':
          setErrors({ email: 'Invalid email or password. Please try again.' });
          break;
        case 'locked':
          setErrors({ email: 'Account temporarily locked due to multiple failed attempts.' });
          break;
        case 'network':
          setErrors({ email: 'Network error. Please check your connection and try again.' });
          break;
        case 'server':
          setErrors({ email: 'Server error. Please try again later or contact support.' });
          break;
        default:
          setErrors({ email: 'An unexpected error occurred. Please try again.' });
      }
    }, 1000);
  };

  return (
    <div className="provider-login-container">
      <div className="provider-login-card">
        <div className="provider-login-header">
          <div className="provider-logo-section">
            <div className="provider-health-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19Z"/>
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M17,13H13V17H11V13H7V11H11V7H13V11H17V13Z" opacity="0.3"/>
                <path d="M17,13H13V17H11V13H7V11H11V7H13V11H17V13Z"/>
              </svg>
            </div>
            <div className="provider-brand">
              <h1>HealthFirst</h1>
              <span className="provider-subtitle">Provider Portal</span>
            </div>
          </div>
          <h2>Welcome Back, Doctor</h2>
          <p>Sign in to access your patient records and clinical tools</p>
        </div>

        <form onSubmit={handleSubmit} className="provider-login-form" noValidate>
          <div className="provider-form-group">
            <label htmlFor="email" className="provider-form-label">
              Email Address
            </label>
            <div className="provider-input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`provider-form-input ${errors.email ? 'error' : ''} ${isEmailValid ? 'valid' : ''}`}
                placeholder="doctor@healthfirst.com"
                autoComplete="email"
              />
              {isEmailValid && (
                <div className="provider-input-indicator">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="check-icon">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            {errors.email && (
              <span className="provider-error-message">{errors.email}</span>
            )}
            <div className="provider-input-hint">
              Use your professional email address
            </div>
          </div>

          <div className="provider-form-group">
            <label htmlFor="password" className="provider-form-label">
              Password
            </label>
            <div className="provider-input-wrapper provider-password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`provider-form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your secure password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="provider-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <span className="provider-error-message">{errors.password}</span>
            )}
          </div>

          <div className="provider-form-options">
            <label className="provider-checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="provider-checkbox-input"
              />
              <span className="provider-checkbox-custom"></span>
              Keep me signed in for 30 days
            </label>
            
            <button
              type="button"
              className="provider-forgot-password-link"
              onClick={handleForgotPassword}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className={`provider-login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="provider-spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In to Portal'
            )}
          </button>
        </form>

        {/* Demo Error Simulation Buttons */}
        <div className="provider-demo-section">
          <details className="provider-demo-details">
            <summary>Demo Error Scenarios</summary>
            <div className="provider-demo-buttons">
              <button type="button" onClick={() => simulateError('invalid')} className="demo-btn">Invalid Credentials</button>
              <button type="button" onClick={() => simulateError('locked')} className="demo-btn">Account Locked</button>
              <button type="button" onClick={() => simulateError('network')} className="demo-btn">Network Error</button>
              <button type="button" onClick={() => simulateError('server')} className="demo-btn">Server Error</button>
            </div>
          </details>
        </div>

        <div className="provider-login-footer">
          <div className="provider-security-notice">
            <div className="security-icon">🔒</div>
            <div>
              <p><strong>Secure Access</strong></p>
              <p>This portal contains protected health information (PHI). Access is logged and monitored.</p>
            </div>
          </div>
          
          <div className="provider-registration-section">
            <p>New to HealthFirst? <button onClick={onSwitchToRegister} className="provider-register-link">Join our provider network</button></p>
          </div>
          
          <div className="provider-help-section">
            <p>Need technical assistance?</p>
            <div className="provider-contact-info">
              <span>📞 IT Support: 1-800-HEALTH-IT</span>
              <span>✉️ support@healthfirst.com</span>
            </div>
          </div>
          
          <div className="provider-compliance">
            <span>HIPAA Compliant</span>
            <span>•</span>
            <span>SOC 2 Certified</span>
          </div>
        </div>
      </div>
      
      <div className="provider-background-pattern"></div>
    </div>
  );
};

export default ProviderLogin; 