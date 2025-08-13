import { useState, useEffect } from 'react';
import './ProviderList.css';

const ProviderList = ({ filters, onSlotSelect, isLoading }) => {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [showTimezoneModal, setShowTimezoneModal] = useState(false);

  useEffect(() => {
    // Simulated API call to fetch providers
    const fetchProviders = async () => {
      // This would be replaced with actual API call
      const mockProviders = [
        {
          id: 1,
          name: 'Dr. Sarah Johnson',
          photo: 'https://randomuser.me/api/portraits/women/68.jpg',
          specialization: 'Cardiology',
          experience: 15,
          rating: 4.8,
          reviews: 127,
          clinic: 'Heart Care Center',
          location: 'New York, NY',
          insurance: ['Aetna', 'Blue Cross', 'Cigna'],
          slots: [
            {
              id: 1,
              date: '2024-03-20',
              times: [
                { id: 1, start: '09:00', end: '09:30', type: 'consultation', price: 150 },
                { id: 2, start: '10:00', end: '10:30', type: 'consultation', price: 150 },
                { id: 3, start: '14:00', end: '14:30', type: 'follow-up', price: 100 },
              ],
            },
            // Add more dates...
          ],
        },
        {
          id: 2,
          name: 'Dr. Michael Chen',
          photo: 'https://randomuser.me/api/portraits/men/32.jpg',
          specialization: 'Dermatology',
          experience: 12,
          rating: 4.9,
          reviews: 203,
          clinic: 'Skin Health Clinic',
          location: 'Los Angeles, CA',
          insurance: ['Medicare', 'UnitedHealthcare'],
          slots: [
            {
              id: 1,
              date: '2024-03-20',
              times: [
                { id: 1, start: '11:00', end: '11:30', type: 'consultation', price: 175 },
                { id: 2, start: '13:00', end: '13:30', type: 'procedure', price: 250 },
              ],
            },
            // Add more dates...
          ],
        },
        // Add more providers...
      ];

      setProviders(mockProviders);
    };

    fetchProviders();
  }, [filters]);

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider === selectedProvider ? null : provider);
  };

  const formatTime = (time, timezone) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: timezone,
    });
  };

  const handleTimezoneChange = (newTimezone) => {
    setTimezone(newTimezone);
    setShowTimezoneModal(false);
  };

  if (isLoading) {
    return (
      <div className="provider-list-loading">
        <div className="spinner"></div>
        <p>Finding available providers...</p>
      </div>
    );
  }

  return (
    <div className="provider-list">
      {/* Timezone Selector */}
      <div className="timezone-selector">
        <button onClick={() => setShowTimezoneModal(true)}>
          🌐 {timezone.replace('_', ' ')}
        </button>
      </div>

      {/* Provider Cards */}
      <div className="provider-cards">
        {providers.map(provider => (
          <div
            key={provider.id}
            className={`provider-card ${selectedProvider?.id === provider.id ? 'expanded' : ''}`}
          >
            <div
              className="provider-header"
              onClick={() => handleProviderSelect(provider)}
            >
              <div className="provider-info">
                <img
                  src={provider.photo}
                  alt={provider.name}
                  className="provider-photo"
                />
                <div className="provider-details">
                  <h3>{provider.name}</h3>
                  <p className="specialization">{provider.specialization}</p>
                  <div className="provider-meta">
                    <span className="experience">{provider.experience} years exp.</span>
                    <span className="rating">
                      ⭐ {provider.rating} ({provider.reviews} reviews)
                    </span>
                  </div>
                  <p className="location">
                    🏥 {provider.clinic} - {provider.location}
                  </p>
                </div>
              </div>
              <div className="provider-insurance">
                <p>Insurance Accepted:</p>
                <div className="insurance-badges">
                  {provider.insurance.map(ins => (
                    <span key={ins} className="insurance-badge">
                      {ins}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Available Slots */}
            {selectedProvider?.id === provider.id && (
              <div className="available-slots">
                {provider.slots.map(dateSlot => (
                  <div key={dateSlot.id} className="date-slots">
                    <h4>{new Date(dateSlot.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}</h4>
                    <div className="time-slots">
                      {dateSlot.times.map(slot => (
                        <div key={slot.id} className="time-slot">
                          <div className="slot-info">
                            <span className="slot-time">
                              {formatTime(slot.start, timezone)} - {formatTime(slot.end, timezone)}
                            </span>
                            <span className="slot-type">{slot.type}</span>
                            <span className="slot-price">${slot.price}</span>
                          </div>
                          <button
                            onClick={() => onSlotSelect(provider, {
                              ...slot,
                              date: dateSlot.date,
                            })}
                            className="book-slot-btn"
                          >
                            Book Now
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Timezone Modal */}
      {showTimezoneModal && (
        <div className="timezone-modal">
          <div className="modal-content">
            <h3>Select Timezone</h3>
            <select
              value={timezone}
              onChange={(e) => handleTimezoneChange(e.target.value)}
            >
              {Intl.supportedValuesOf('timeZone').map(tz => (
                <option key={tz} value={tz}>
                  {tz.replace('_', ' ')}
                </option>
              ))}
            </select>
            <button onClick={() => setShowTimezoneModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderList; 