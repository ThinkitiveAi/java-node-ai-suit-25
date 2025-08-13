import { useState } from 'react';
import './Login.css';

const Login = ({ onSwitchToRegister, onLogin }) => {
  const [formData, setFormData] = useState({
    loginIdentifier: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [inputType, setInputType] = useState('');
  const [loginError, setLoginError] = useState('');

  // Detect if input is email or phone
  const detectInputType = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    
    if (emailRegex.test(value)) {
      return 'email';
    } else if (phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
      return 'phone';
    }
    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.loginIdentifier.trim()) {
      newErrors.loginIdentifier = 'Email or phone number is required';
    } else {
      const type = detectInputType(formData.loginIdentifier);
      if (!type) {
        newErrors.loginIdentifier = 'Please enter a valid email or phone number';
      }
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

    // Clear login error when user makes changes
    if (loginError) {
      setLoginError('');
    }
    
    // Detect input type for login identifier
    if (name === 'loginIdentifier') {
      setInputType(detectInputType(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setLoginError('');

    // Simulate API call with a delay
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo purposes, accept any valid input
      if (detectInputType(formData.loginIdentifier) && formData.password.length >= 6) {
        // Store demo user data
        localStorage.setItem('demoUser', JSON.stringify({
          name: 'Demo Patient',
          email: formData.loginIdentifier,
          isAuthenticated: true
        }));
        
        // Call the onLogin callback
        onLogin();
      } else {
        setLoginError('Invalid credentials. Please try again.');
      }
    }, 1000);
  };

  const handleForgotPassword = () => {
    alert('Password reset functionality will be implemented');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-section">
            <div className="health-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M17,13H13V17H11V13H7V11H11V7H13V11H17V13Z"/>
              </svg>
            </div>
            <h1>HealthFirst</h1>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to access your healthcare account</p>
        </div>

        {loginError && (
          <div className="error-banner">
            {loginError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="form-group">
            <label htmlFor="loginIdentifier" className="form-label">
              Email or Phone Number
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="loginIdentifier"
                name="loginIdentifier"
                value={formData.loginIdentifier}
                onChange={handleInputChange}
                className={`form-input ${errors.loginIdentifier ? 'error' : ''} ${inputType ? 'valid' : ''}`}
                placeholder="Enter your email or phone number"
                autoComplete="username"
              />
              {inputType && (
                <div className="input-type-indicator">
                  {inputType === 'email' ? '📧' : '📱'}
                </div>
              )}
            </div>
            {errors.loginIdentifier && (
              <span className="error-message">{errors.loginIdentifier}</span>
            )}
            <div className="input-hint">
              Accepts: user@example.com or +1 (555) 123-4567
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-wrapper password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              Remember me for 30 days
            </label>
            
            <button
              type="button"
              className="forgot-password-link"
              onClick={handleForgotPassword}
            >
              Forgot your password?
            </button>
          </div>

          <button
            type="submit"
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <button onClick={onSwitchToRegister} className="register-link">Sign up here</button></p>
          <div className="help-section">
            <p>Need help? Contact our support team</p>
            <div className="contact-info">
              <span>📞 1-800-HEALTH</span>
              <span>✉️ support@healthfirst.com</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="background-pattern"></div>
    </div>
  );
};

export default Login; 