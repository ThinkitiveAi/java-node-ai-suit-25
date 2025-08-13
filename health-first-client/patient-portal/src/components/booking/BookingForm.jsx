import { useState } from 'react';
import './BookingForm.css';

const BookingForm = ({ provider, slot, onSubmit, onBack, isLoading }) => {
  const [formData, setFormData] = useState({
    // Patient Details
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    reasonForVisit: '',
    
    // Insurance Details
    hasInsurance: false,
    insuranceProvider: '',
    insuranceNumber: '',
    insuranceGroupNumber: '',
    
    // Payment Details
    paymentMethod: 'card', // card, insurance
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    billingZip: '',
  });

  const [currentSection, setCurrentSection] = useState('patient'); // patient, insurance, payment
  const [errors, setErrors] = useState({});

  const validateSection = (section) => {
    const newErrors = {};

    if (section === 'patient') {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
        newErrors.phone = 'Invalid phone number';
      }
      if (!formData.reasonForVisit) newErrors.reasonForVisit = 'Reason for visit is required';
    }

    if (section === 'insurance' && formData.hasInsurance) {
      if (!formData.insuranceProvider) newErrors.insuranceProvider = 'Insurance provider is required';
      if (!formData.insuranceNumber) newErrors.insuranceNumber = 'Insurance number is required';
      if (!formData.insuranceGroupNumber) newErrors.insuranceGroupNumber = 'Group number is required';
    }

    if (section === 'payment' && formData.paymentMethod === 'card') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!formData.cardExpiry) newErrors.cardExpiry = 'Expiry date is required';
      if (!formData.cardCvc) newErrors.cardCvc = 'CVC is required';
      if (!formData.billingZip) newErrors.billingZip = 'Billing ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      if (currentSection === 'patient') {
        setCurrentSection(formData.hasInsurance ? 'insurance' : 'payment');
      } else if (currentSection === 'insurance') {
        setCurrentSection('payment');
      }
    }
  };

  const handleBack = () => {
    if (currentSection === 'payment') {
      setCurrentSection(formData.hasInsurance ? 'insurance' : 'patient');
    } else if (currentSection === 'insurance') {
      setCurrentSection('patient');
    } else {
      onBack();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateSection(currentSection)) {
      onSubmit(formData);
    }
  };

  return (
    <div className="booking-form">
      <div className="booking-summary">
        <h3>Appointment Summary</h3>
        <div className="summary-details">
          <div className="summary-provider">
            <img src={provider.photo} alt={provider.name} />
            <div>
              <h4>{provider.name}</h4>
              <p>{provider.specialization}</p>
            </div>
          </div>
          <div className="summary-appointment">
            <div className="summary-item">
              <span>Date:</span>
              <span>{new Date(slot.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}</span>
            </div>
            <div className="summary-item">
              <span>Time:</span>
              <span>{slot.start} - {slot.end}</span>
            </div>
            <div className="summary-item">
              <span>Type:</span>
              <span>{slot.type}</span>
            </div>
            <div className="summary-item">
              <span>Fee:</span>
              <span>${slot.price}</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-sections">
        {/* Patient Details Section */}
        <div className={`form-section ${currentSection === 'patient' ? 'active' : ''}`}>
          <h3>Patient Details</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={errors.lastName ? 'error' : ''}
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth *</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                max={new Date().toISOString().split('T')[0]}
                className={errors.dateOfBirth ? 'error' : ''}
              />
              {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender *</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={errors.gender ? 'error' : ''}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
              {errors.gender && <span className="error-message">{errors.gender}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reasonForVisit">Reason for Visit *</label>
            <textarea
              id="reasonForVisit"
              name="reasonForVisit"
              value={formData.reasonForVisit}
              onChange={handleInputChange}
              rows="3"
              className={errors.reasonForVisit ? 'error' : ''}
            ></textarea>
            {errors.reasonForVisit && <span className="error-message">{errors.reasonForVisit}</span>}
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="hasInsurance"
                checked={formData.hasInsurance}
                onChange={handleInputChange}
              />
              I have insurance
            </label>
          </div>
        </div>

        {/* Insurance Details Section */}
        {formData.hasInsurance && (
          <div className={`form-section ${currentSection === 'insurance' ? 'active' : ''}`}>
            <h3>Insurance Details</h3>

            <div className="form-group">
              <label htmlFor="insuranceProvider">Insurance Provider *</label>
              <select
                id="insuranceProvider"
                name="insuranceProvider"
                value={formData.insuranceProvider}
                onChange={handleInputChange}
                className={errors.insuranceProvider ? 'error' : ''}
              >
                <option value="">Select Provider</option>
                <option value="aetna">Aetna</option>
                <option value="bluecross">Blue Cross</option>
                <option value="cigna">Cigna</option>
                <option value="medicare">Medicare</option>
                <option value="unitedhealthcare">UnitedHealthcare</option>
              </select>
              {errors.insuranceProvider && <span className="error-message">{errors.insuranceProvider}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="insuranceNumber">Insurance Number *</label>
                <input
                  type="text"
                  id="insuranceNumber"
                  name="insuranceNumber"
                  value={formData.insuranceNumber}
                  onChange={handleInputChange}
                  className={errors.insuranceNumber ? 'error' : ''}
                />
                {errors.insuranceNumber && <span className="error-message">{errors.insuranceNumber}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="insuranceGroupNumber">Group Number *</label>
                <input
                  type="text"
                  id="insuranceGroupNumber"
                  name="insuranceGroupNumber"
                  value={formData.insuranceGroupNumber}
                  onChange={handleInputChange}
                  className={errors.insuranceGroupNumber ? 'error' : ''}
                />
                {errors.insuranceGroupNumber && <span className="error-message">{errors.insuranceGroupNumber}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Payment Section */}
        <div className={`form-section ${currentSection === 'payment' ? 'active' : ''}`}>
          <h3>Payment Details</h3>

          <div className="form-group">
            <label>Payment Method</label>
            <div className="payment-methods">
              <label className="payment-method">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleInputChange}
                />
                <span>Credit/Debit Card</span>
              </label>
              {formData.hasInsurance && (
                <label className="payment-method">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="insurance"
                    checked={formData.paymentMethod === 'insurance'}
                    onChange={handleInputChange}
                  />
                  <span>Insurance</span>
                </label>
              )}
            </div>
          </div>

          {formData.paymentMethod === 'card' && (
            <>
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number *</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  className={errors.cardNumber ? 'error' : ''}
                />
                {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cardExpiry">Expiry Date *</label>
                  <input
                    type="text"
                    id="cardExpiry"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className={errors.cardExpiry ? 'error' : ''}
                  />
                  {errors.cardExpiry && <span className="error-message">{errors.cardExpiry}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="cardCvc">CVC *</label>
                  <input
                    type="text"
                    id="cardCvc"
                    name="cardCvc"
                    value={formData.cardCvc}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength="4"
                    className={errors.cardCvc ? 'error' : ''}
                  />
                  {errors.cardCvc && <span className="error-message">{errors.cardCvc}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="billingZip">Billing ZIP Code *</label>
                  <input
                    type="text"
                    id="billingZip"
                    name="billingZip"
                    value={formData.billingZip}
                    onChange={handleInputChange}
                    className={errors.billingZip ? 'error' : ''}
                  />
                  {errors.billingZip && <span className="error-message">{errors.billingZip}</span>}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={handleBack}
            className="back-button"
          >
            Back
          </button>
          
          {currentSection === 'payment' ? (
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Confirming...
                </>
              ) : (
                'Confirm Booking'
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="next-button"
            >
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BookingForm; 