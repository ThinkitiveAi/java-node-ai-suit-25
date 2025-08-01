import { useState } from 'react';
import './Registration.css';

const Registration = ({ onSwitchToLogin }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: {
      month: '',
      day: '',
      year: ''
    },
    gender: '',
    profilePhoto: null,
    
    // Address Information
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyRelationship: '',
    emergencyPhone: '',
    
    // Account Security
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [profilePreview, setProfilePreview] = useState(null);

  const steps = [
    { id: 1, title: 'Personal Info', description: 'Basic information' },
    { id: 2, title: 'Address', description: 'Contact details' },
    { id: 3, title: 'Emergency Contact', description: 'Emergency information' },
    { id: 4, title: 'Security', description: 'Account security' }
  ];

  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  const relationshipOptions = [
    { value: '', label: 'Select Relationship' },
    { value: 'spouse', label: 'Spouse/Partner' },
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Child' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'friend', label: 'Friend' },
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
    // Add more states as needed
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
    if (strength < 25) return '#e53e3e';
    if (strength < 50) return '#dd6b20';
    if (strength < 75) return '#d69e2e';
    return '#38a169';
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      
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
      
      if (!formData.dateOfBirth.month || !formData.dateOfBirth.day || !formData.dateOfBirth.year) {
        newErrors.dateOfBirth = 'Date of birth is required';
      } else {
        // Check if user is at least 13 years old
        const birthDate = new Date(formData.dateOfBirth.year, formData.dateOfBirth.month - 1, formData.dateOfBirth.day);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 13 || (age === 13 && today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()))) {
          newErrors.dateOfBirth = 'You must be at least 13 years old to register';
        }
      }
      
      if (!formData.gender) newErrors.gender = 'Please select your gender';
    }

    if (step === 2) {
      if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.zipCode.trim()) {
        newErrors.zipCode = 'ZIP code is required';
      } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
        newErrors.zipCode = 'Please enter a valid ZIP code';
      }
    }

    if (step === 3) {
      if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = 'Emergency contact name is required';
      if (!formData.emergencyRelationship) newErrors.emergencyRelationship = 'Relationship is required';
      if (!formData.emergencyPhone.trim()) {
        newErrors.emergencyPhone = 'Emergency contact phone is required';
      } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.emergencyPhone.replace(/[\s\-\(\)]/g, ''))) {
        newErrors.emergencyPhone = 'Please enter a valid phone number';
      }
      
      // Check if emergency contact is different from patient
      if (formData.emergencyPhone === formData.phoneNumber) {
        newErrors.emergencyPhone = 'Emergency contact must be different from your own number';
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
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        setFormData(prev => ({ ...prev, profilePhoto: file }));
        const reader = new FileReader();
        reader.onload = (e) => setProfilePreview(e.target.result);
        reader.readAsDataURL(file);
      }
      return;
    }

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

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
      alert('Registration successful! Please check your email for verification instructions.');
      // Here you would normally handle the actual registration
      console.log('Registration data:', formData);
    }, 2000);
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      {steps.map((step, index) => (
        <div key={step.id} className="step-item">
          <div className={`step-circle ${currentStep >= step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}>
            {currentStep > step.id ? '✓' : step.id}
          </div>
          <div className="step-info">
            <div className="step-title">{step.title}</div>
            <div className="step-description">{step.description}</div>
          </div>
          {index < steps.length - 1 && <div className={`step-connector ${currentStep > step.id ? 'completed' : ''}`}></div>}
        </div>
      ))}
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="form-section">
      <h3>Personal Information</h3>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">First Name *</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`form-input ${errors.firstName ? 'error' : ''}`}
            placeholder="Enter your first name"
          />
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Last Name *</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`form-input ${errors.lastName ? 'error' : ''}`}
            placeholder="Enter your last name"
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Email Address *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`form-input ${errors.email ? 'error' : ''}`}
          placeholder="Enter your email address"
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Phone Number *</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
          placeholder="(555) 123-4567"
        />
        {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Date of Birth *</label>
        <div className="date-inputs">
          <select
            name="dateOfBirth.month"
            value={formData.dateOfBirth.month}
            onChange={handleInputChange}
            className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
          >
            <option value="">Month</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('en', { month: 'long' })}
              </option>
            ))}
          </select>
          <select
            name="dateOfBirth.day"
            value={formData.dateOfBirth.day}
            onChange={handleInputChange}
            className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
          >
            <option value="">Day</option>
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
          <select
            name="dateOfBirth.year"
            value={formData.dateOfBirth.year}
            onChange={handleInputChange}
            className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
          >
            <option value="">Year</option>
            {Array.from({ length: 100 }, (_, i) => (
              <option key={2024 - i} value={2024 - i}>{2024 - i}</option>
            ))}
          </select>
        </div>
        {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Gender *</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          className={`form-input ${errors.gender ? 'error' : ''}`}
        >
          {genderOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        {errors.gender && <span className="error-message">{errors.gender}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Profile Photo (Optional)</label>
        <div className="photo-upload">
          <input
            type="file"
            name="profilePhoto"
            onChange={handleInputChange}
            accept="image/*"
            className="file-input"
            id="profilePhoto"
          />
          <label htmlFor="profilePhoto" className="file-label">
            {profilePreview ? (
              <img src={profilePreview} alt="Profile preview" className="photo-preview" />
            ) : (
              <div className="photo-placeholder">
                <span>📷</span>
                <span>Upload Photo</span>
              </div>
            )}
          </label>
        </div>
      </div>
    </div>
  );

  const renderAddressInfo = () => (
    <div className="form-section">
      <h3>Address Information</h3>
      <div className="form-group">
        <label className="form-label">Street Address *</label>
        <input
          type="text"
          name="streetAddress"
          value={formData.streetAddress}
          onChange={handleInputChange}
          className={`form-input ${errors.streetAddress ? 'error' : ''}`}
          placeholder="123 Main Street"
        />
        {errors.streetAddress && <span className="error-message">{errors.streetAddress}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className={`form-input ${errors.city ? 'error' : ''}`}
            placeholder="Enter city"
          />
          {errors.city && <span className="error-message">{errors.city}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">State *</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className={`form-input ${errors.state ? 'error' : ''}`}
          >
            {stateOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {errors.state && <span className="error-message">{errors.state}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">ZIP Code *</label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
            className={`form-input ${errors.zipCode ? 'error' : ''}`}
            placeholder="12345"
          />
          {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="form-input"
            readOnly
          />
        </div>
      </div>
    </div>
  );

  const renderEmergencyContact = () => (
    <div className="form-section">
      <h3>Emergency Contact</h3>
      <div className="form-group">
        <label className="form-label">Emergency Contact Name *</label>
        <input
          type="text"
          name="emergencyContactName"
          value={formData.emergencyContactName}
          onChange={handleInputChange}
          className={`form-input ${errors.emergencyContactName ? 'error' : ''}`}
          placeholder="Enter emergency contact full name"
        />
        {errors.emergencyContactName && <span className="error-message">{errors.emergencyContactName}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Relationship *</label>
        <select
          name="emergencyRelationship"
          value={formData.emergencyRelationship}
          onChange={handleInputChange}
          className={`form-input ${errors.emergencyRelationship ? 'error' : ''}`}
        >
          {relationshipOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        {errors.emergencyRelationship && <span className="error-message">{errors.emergencyRelationship}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Emergency Contact Phone *</label>
        <input
          type="tel"
          name="emergencyPhone"
          value={formData.emergencyPhone}
          onChange={handleInputChange}
          className={`form-input ${errors.emergencyPhone ? 'error' : ''}`}
          placeholder="(555) 987-6543"
        />
        {errors.emergencyPhone && <span className="error-message">{errors.emergencyPhone}</span>}
        <div className="input-hint">Must be different from your own phone number</div>
      </div>
    </div>
  );

  const renderAccountSecurity = () => (
    <div className="form-section">
      <h3>Account Security</h3>
      <div className="form-group">
        <label className="form-label">Password *</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className={`form-input ${errors.password ? 'error' : ''}`}
          placeholder="Create a strong password"
        />
        {errors.password && <span className="error-message">{errors.password}</span>}
        
        {formData.password && (
          <div className="password-strength">
            <div className="strength-bar">
              <div 
                className="strength-fill" 
                style={{ 
                  width: `${passwordStrength}%`,
                  backgroundColor: getPasswordStrengthColor(passwordStrength)
                }}
              ></div>
            </div>
            <span className="strength-label" style={{ color: getPasswordStrengthColor(passwordStrength) }}>
              {getPasswordStrengthLabel(passwordStrength)}
            </span>
          </div>
        )}
        
        <div className="password-requirements">
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

      <div className="form-group">
        <label className="form-label">Confirm Password *</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderPersonalInfo();
      case 2: return renderAddressInfo();
      case 3: return renderEmergencyContact();
      case 4: return renderAccountSecurity();
      default: return renderPersonalInfo();
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="registration-header">
          <div className="logo-section">
            <div className="health-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M17,13H13V17H11V13H7V11H11V7H13V11H17V13Z"/>
              </svg>
            </div>
            <h1>HealthFirst</h1>
          </div>
          <h2>Create Your Account</h2>
          <p>Join thousands of patients managing their healthcare online</p>
        </div>

        {renderStepIndicator()}

        <form className="registration-form" noValidate>
          {renderCurrentStep()}

          <div className="form-actions">
            {currentStep > 1 && (
              <button type="button" onClick={handlePrevious} className="btn-secondary">
                Previous
              </button>
            )}
            
            {currentStep < 4 ? (
              <button type="button" onClick={handleNext} className="btn-primary">
                Next
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handleSubmit} 
                className={`btn-primary ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            )}
          </div>
        </form>

        <div className="registration-footer">
          <p>
            Already have an account? 
            <button onClick={onSwitchToLogin} className="login-link">
              Sign in here
            </button>
          </p>
          <div className="help-section">
            <p>Need assistance? Our support team is here to help</p>
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

export default Registration; 