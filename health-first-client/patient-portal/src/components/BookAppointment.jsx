import { useState } from 'react';
import SearchFilters from './booking/SearchFilters';
import ProviderList from './booking/ProviderList';
import BookingForm from './booking/BookingForm';
import BookingConfirmation from './booking/BookingConfirmation';
import './BookAppointment.css';

const BookAppointment = () => {
  // Booking flow states
  const [currentStep, setCurrentStep] = useState('search'); // search, form, confirmation
  const [searchFilters, setSearchFilters] = useState({
    dateRange: {
      start: new Date(),
      end: new Date(new Date().setDate(new Date().getDate() + 30)),
    },
    specialization: '',
    location: '',
    appointmentType: '',
    insurance: '',
    maxPrice: '',
  });

  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle search filters update
  const handleFilterChange = (filters) => {
    setSearchFilters(filters);
    // Here you would typically fetch providers based on new filters
  };

  // Handle provider and slot selection
  const handleSlotSelect = (provider, slot) => {
    setSelectedProvider(provider);
    setSelectedSlot(slot);
    setCurrentStep('form');
  };

  // Handle booking form submission
  const handleBookingSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Here you would make the actual booking API call
      const bookingResponse = {
        success: true,
        confirmationNumber: 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        appointment: {
          provider: selectedProvider,
          slot: selectedSlot,
          patient: formData,
        },
      };

      setBookingData(bookingResponse);
      setCurrentStep('confirmation');
    } catch (err) {
      setError('Failed to complete booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle booking restart
  const handleStartOver = () => {
    setCurrentStep('search');
    setSelectedProvider(null);
    setSelectedSlot(null);
    setBookingData(null);
    setError(null);
  };

  return (
    <div className="book-appointment-container">
      {/* Header */}
      <header className="booking-header">
        <h1>Book an Appointment</h1>
        <p>Find and schedule your next healthcare visit</p>
      </header>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {/* Main Content */}
      <main className="booking-content">
        {/* Progress Indicator */}
        <div className="booking-progress">
          <div className={`progress-step ${currentStep === 'search' ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Search & Select</span>
          </div>
          <div className={`progress-step ${currentStep === 'form' ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Patient Details</span>
          </div>
          <div className={`progress-step ${currentStep === 'confirmation' ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Confirmation</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="booking-step-content">
          {currentStep === 'search' && (
            <div className="search-step">
              <SearchFilters
                filters={searchFilters}
                onFilterChange={handleFilterChange}
              />
              <ProviderList
                filters={searchFilters}
                onSlotSelect={handleSlotSelect}
                isLoading={isLoading}
              />
            </div>
          )}

          {currentStep === 'form' && selectedProvider && selectedSlot && (
            <BookingForm
              provider={selectedProvider}
              slot={selectedSlot}
              onSubmit={handleBookingSubmit}
              onBack={() => setCurrentStep('search')}
              isLoading={isLoading}
            />
          )}

          {currentStep === 'confirmation' && bookingData && (
            <BookingConfirmation
              bookingData={bookingData}
              onStartOver={handleStartOver}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default BookAppointment; 