import { useState } from 'react';
import './ProviderRegistration.css';

const ProviderRegistration = ({ onSwitchToLogin }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    
    // Professional Information
    specialization: '',
    medicalLicenseNumber: '',
    yearsOfExperience: '',
    
    // Clinic Address
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Account Security
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const steps = [
    { id: 1, title: 'Personal Info', description: 'Basic information' },
    { id: 2, title: 'Professional', description: 'Medical credentials' },
    { id: 3, title: 'Clinic Address', description: 'Practice location' },
    { id: 4, title: 'Security', description: 'Account security' }
  ];

  const specializationOptions = [
    { value: '', label: 'Select Specialization' },
    { value: 'family-medicine', label: 'Family Medicine' },
    { value: 'internal-medicine', label: 'Internal Medicine' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'dermatology', label: 'Dermatology' },
    { value: 'emergency-medicine', label: 'Emergency Medicine' },
    { value: 'gastroenterology', label: 'Gastroenterology' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'oncology', label: 'Oncology' },
    { value: 'orthopedics', label: 'Orthopedics' },
    { value: 'psychiatry', label: 'Psychiatry' },
    { value: 'radiology', label: 'Radiology' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'other', label: 'Other' }
  ];

  const stateOptions = [
    { value: '', label: 'Select State' },
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' }
  ];

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/)) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 15;
    if (password.match(/[^A-Za-z0-9]/)) strength += 10;
    return Math.min(strength, 100);
  };

  const getPasswordStrengthLabel = (strength) => {
    if (strength < 25) return 'Very Weak';
    if (strength < 50) return 'Weak';
    if (strength < 75) return 'Good';
    return 'Strong';
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength < 25) return '#dc2626';
    if (strength < 50) return '#ea580c';
    if (strength < 75) return '#ca8a04';
    return '#059669';
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      } else if (formData.firstName.length < 2 || formData.firstName.length > 50) {
        newErrors.firstName = 'First name must be between 2 and 50 characters';
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      } else if (formData.lastName.length < 2 || formData.lastName.length > 50) {
        newErrors.lastName = 'Last name must be between 2 and 50 characters';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required';
      } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
        newErrors.phoneNumber = 'Please enter a valid phone number';
      }
    }

    if (step === 2) {
      if (!formData.specialization) {
        newErrors.specialization = 'Specialization is required';
      }
      
      if (!formData.medicalLicenseNumber.trim()) {
        newErrors.medicalLicenseNumber = 'Medical license number is required';
      } else if (!/^[A-Za-z0-9]{6,20}$/.test(formData.medicalLicenseNumber)) {
        newErrors.medicalLicenseNumber = 'License number must be 6-20 alphanumeric characters';
      }
      
      if (!formData.yearsOfExperience) {
        newErrors.yearsOfExperience = 'Years of experience is required';
      } else if (formData.yearsOfExperience < 0 || formData.yearsOfExperience > 50) {
        newErrors.yearsOfExperience = 'Years of experience must be between 0 and 50';
      }
    }

    if (step === 3) {
      if (!formData.streetAddress.trim()) {
        newErrors.streetAddress = 'Street address is required';
      } else if (formData.streetAddress.length > 200) {
        newErrors.streetAddress = 'Street address must be less than 200 characters';
      }
      
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      } else if (formData.city.length > 100) {
        newErrors.city = 'City must be less than 100 characters';
      }
      
      if (!formData.state) {
        newErrors.state = 'State is required';
      }
      
      if (!formData.zipCode.trim()) {
        newErrors.zipCode = 'ZIP code is required';
      } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
        newErrors.zipCode = 'Please enter a valid ZIP code';
      }
    }

    if (step === 4) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Calculate password strength
    if (name === 'password') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('Provider registration successful! Please check your email for verification instructions.');
      console.log('Provider registration data:', formData);
    }, 2000);
  };

  const renderStepIndicator = () => (
    <div className="provider-step-indicator">
      {steps.map((step, index) => (
        <div key={step.id} className="provider-step-item">
          <div className={`provider-step-circle ${currentStep >= step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}>
            {currentStep > step.id ? '✓' : step.id}
          </div>
          <div className="provider-step-info">
            <div className="provider-step-title">{step.title}</div>
            <div className="provider-step-description">{step.description}</div>
          </div>
          {index < steps.length - 1 && <div className={`provider-step-connector ${currentStep > step.id ? 'completed' : ''}`}></div>}
        </div>
      ))}
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="provider-form-section">
      <h3>Personal Information</h3>
      <div className="provider-form-row">
        <div className="provider-form-group">
          <label className="provider-form-label">First Name *</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`provider-form-input ${errors.firstName ? 'error' : ''}`}
            placeholder="Enter your first name"
            maxLength="50"
          />
          {errors.firstName && <span className="provider-error-message">{errors.firstName}</span>}
        </div>
        <div className="provider-form-group">
          <label className="provider-form-label">Last Name *</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`provider-form-input ${errors.lastName ? 'error' : ''}`}
            placeholder="Enter your last name"
            maxLength="50"
          />
          {errors.lastName && <span className="provider-error-message">{errors.lastName}</span>}
        </div>
      </div>

      <div className="provider-form-group">
        <label className="provider-form-label">Email Address *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`provider-form-input ${errors.email ? 'error' : ''}`}
          placeholder="doctor@example.com"
        />
        {errors.email && <span className="provider-error-message">{errors.email}</span>}
        <div className="provider-input-hint">This will be your login email</div>
      </div>

      <div className="provider-form-group">
        <label className="provider-form-label">Phone Number *</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          className={`provider-form-input ${errors.phoneNumber ? 'error' : ''}`}
          placeholder="(555) 123-4567"
        />
        {errors.phoneNumber && <span className="provider-error-message">{errors.phoneNumber}</span>}
      </div>
    </div>
  );

  const renderProfessionalInfo = () => (
    <div className="provider-form-section">
      <h3>Professional Information</h3>
      <div className="provider-form-group">
        <label className="provider-form-label">Medical Specialization *</label>
        <select
          name="specialization"
          value={formData.specialization}
          onChange={handleInputChange}
          className={`provider-form-input ${errors.specialization ? 'error' : ''}`}
        >
          {specializationOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        {errors.specialization && <span className="provider-error-message">{errors.specialization}</span>}
      </div>

      <div className="provider-form-group">
        <label className="provider-form-label">Medical License Number *</label>
        <input
          type="text"
          name="medicalLicenseNumber"
          value={formData.medicalLicenseNumber}
          onChange={handleInputChange}
          className={`provider-form-input ${errors.medicalLicenseNumber ? 'error' : ''}`}
          placeholder="Enter your medical license number"
          maxLength="20"
        />
        {errors.medicalLicenseNumber && <span className="provider-error-message">{errors.medicalLicenseNumber}</span>}
        <div className="provider-input-hint">6-20 alphanumeric characters</div>
      </div>

      <div className="provider-form-group">
        <label className="provider-form-label">Years of Experience *</label>
        <input
          type="number"
          name="yearsOfExperience"
          value={formData.yearsOfExperience}
          onChange={handleInputChange}
          className={`provider-form-input ${errors.yearsOfExperience ? 'error' : ''}`}
          placeholder="0"
          min="0"
          max="50"
        />
        {errors.yearsOfExperience && <span className="provider-error-message">{errors.yearsOfExperience}</span>}
        <div className="provider-input-hint">Years of professional medical practice</div>
      </div>
    </div>
  );

  const renderClinicAddress = () => (
    <div className="provider-form-section">
      <h3>Clinic Address</h3>
      <div className="provider-form-group">
        <label className="provider-form-label">Street Address *</label>
        <input
          type="text"
          name="streetAddress"
          value={formData.streetAddress}
          onChange={handleInputChange}
          className={`provider-form-input ${errors.streetAddress ? 'error' : ''}`}
          placeholder="123 Medical Center Drive"
          maxLength="200"
        />
        {errors.streetAddress && <span className="provider-error-message">{errors.streetAddress}</span>}
      </div>

      <div className="provider-form-row">
        <div className="provider-form-group">
          <label className="provider-form-label">City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className={`provider-form-input ${errors.city ? 'error' : ''}`}
            placeholder="Enter city"
            maxLength="100"
          />
          {errors.city && <span className="provider-error-message">{errors.city}</span>}
        </div>
        <div className="provider-form-group">
          <label className="provider-form-label">State *</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className={`provider-form-input ${errors.state ? 'error' : ''}`}
          >
            {stateOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {errors.state && <span className="provider-error-message">{errors.state}</span>}
        </div>
      </div>

      <div className="provider-form-group">
        <label className="provider-form-label">ZIP Code *</label>
        <input
          type="text"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleInputChange}
          className={`provider-form-input ${errors.zipCode ? 'error' : ''}`}
          placeholder="12345"
          maxLength="10"
        />
        {errors.zipCode && <span className="provider-error-message">{errors.zipCode}</span>}
      </div>
    </div>
  );

  const renderAccountSecurity = () => (
    <div className="provider-form-section">
      <h3>Account Security</h3>
      <div className="provider-form-group">
        <label className="provider-form-label">Password *</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className={`provider-form-input ${errors.password ? 'error' : ''}`}
          placeholder="Create a strong password"
        />
        {errors.password && <span className="provider-error-message">{errors.password}</span>}
        
        {formData.password && (
          <div className="provider-password-strength">
            <div className="provider-strength-bar">
              <div 
                className="provider-strength-fill" 
                style={{ 
                  width: `${passwordStrength}%`,
                  backgroundColor: getPasswordStrengthColor(passwordStrength)
                }}
              ></div>
            </div>
            <span className="provider-strength-label" style={{ color: getPasswordStrengthColor(passwordStrength) }}>
              {getPasswordStrengthLabel(passwordStrength)}
            </span>
          </div>
        )}
        
        <div className="provider-password-requirements">
          <p>Password must contain:</p>
          <ul>
            <li className={formData.password.length >= 8 ? 'valid' : ''}>At least 8 characters</li>
            <li className={/[a-z]/.test(formData.password) ? 'valid' : ''}>Lowercase letter</li>
            <li className={/[A-Z]/.test(formData.password) ? 'valid' : ''}>Uppercase letter</li>
            <li className={/[0-9]/.test(formData.password) ? 'valid' : ''}>Number</li>
            <li className={/[^A-Za-z0-9]/.test(formData.password) ? 'valid' : ''}>Special character</li>
          </ul>
        </div>
      </div>

      <div className="provider-form-group">
        <label className="provider-form-label">Confirm Password *</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className={`provider-form-input ${errors.confirmPassword ? 'error' : ''}`}
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && <span className="provider-error-message">{errors.confirmPassword}</span>}
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderPersonalInfo();
      case 2: return renderProfessionalInfo();
      case 3: return renderClinicAddress();
      case 4: return renderAccountSecurity();
      default: return renderPersonalInfo();
    }
  };

  return (
    <div className="provider-registration-container">
      <div className="provider-registration-card">
        <div className="provider-registration-header">
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
          <h2>Join Our Provider Network</h2>
          <p>Create your professional healthcare provider account</p>
        </div>

        {renderStepIndicator()}

        <form className="provider-registration-form" noValidate>
          {renderCurrentStep()}

          <div className="provider-form-actions">
            {currentStep > 1 && (
              <button type="button" onClick={handlePrevious} className="provider-btn-secondary">
                Previous
              </button>
            )}
            
            {currentStep < 4 ? (
              <button type="button" onClick={handleNext} className="provider-btn-primary">
                Next
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handleSubmit} 
                className={`provider-btn-primary ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="provider-spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Provider Account'
                )}
              </button>
            )}
          </div>
        </form>

        <div className="provider-registration-footer">
          <p>
            Already have an account? 
            <button onClick={onSwitchToLogin} className="provider-login-link">
              Sign in here
            </button>
          </p>
          <div className="provider-help-section">
            <p>Questions about provider registration?</p>
            <div className="provider-contact-info">
              <span>📞 Provider Support: 1-800-PROVIDER</span>
              <span>✉️ providers@healthfirst.com</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="provider-background-pattern"></div>
    </div>
  );
};

export default ProviderRegistration; 