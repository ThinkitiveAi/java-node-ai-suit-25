import { useState, useEffect } from 'react';
import './ProviderAvailability.css';

const ProviderAvailability = () => {
  const [currentView, setCurrentView] = useState('monthly'); // 'monthly', 'weekly', 'daily'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
  const [editingAvailability, setEditingAvailability] = useState(null);
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [notification, setNotification] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    providerId: '',
    date: '',
    startTime: '',
    endTime: '',
    timezone: 'America/New_York',
    isRecurring: false,
    recurrencePattern: 'weekly',
    recurrenceEndDate: '',
    slotDuration: 30,
    breakDuration: 0,
    maxAppointments: 1,
    appointmentType: 'consultation',
    locationType: 'clinic',
    address: '',
    roomNumber: '',
    baseFee: '',
    insuranceAccepted: false,
    currency: 'USD',
    notes: '',
    specialRequirements: []
  });

  // Sample data for providers and availability
  const providers = [
    { id: 1, name: 'Dr. Sarah Johnson', specialization: 'Cardiology' },
    { id: 2, name: 'Dr. Michael Chen', specialization: 'Pediatrics' },
    { id: 3, name: 'Dr. Emily Davis', specialization: 'Internal Medicine' }
  ];

  const appointmentTypes = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'follow_up', label: 'Follow-up' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'telemedicine', label: 'Telemedicine' }
  ];

  const locationTypes = [
    { value: 'clinic', label: 'Clinic' },
    { value: 'hospital', label: 'Hospital' },
    { value: 'telemedicine', label: 'Telemedicine' },
    { value: 'home_visit', label: 'Home Visit' }
  ];

  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' }
  ];

  const currencies = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'CAD', label: 'CAD (C$)' }
  ];

  // Initialize form with current date
  useEffect(() => {
    const today = new Date();
    setFormData(prev => ({
      ...prev,
      date: today.toISOString().split('T')[0],
      providerId: providers[0]?.id || ''
    }));
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleDateNavigation = (direction) => {
    const newDate = new Date(selectedDate);
    
    if (currentView === 'monthly') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (currentView === 'weekly') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else {
      newDate.setDate(newDate.getDate() + direction);
    }
    
    setSelectedDate(newDate);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.providerId || !formData.date || !formData.startTime || !formData.endTime) {
      showNotification('error', 'Please fill in all required fields');
      return;
    }

    // Check for conflicts
    const hasConflict = availabilitySlots.some(slot => 
      slot.date === formData.date && 
      slot.providerId === formData.providerId &&
      ((formData.startTime >= slot.startTime && formData.startTime < slot.endTime) ||
       (formData.endTime > slot.startTime && formData.endTime <= slot.endTime))
    );

    if (hasConflict) {
      showNotification('warning', 'Schedule conflict detected. Please choose different times.');
      return;
    }

    const newSlot = {
      id: editingAvailability ? editingAvailability.id : Date.now(),
      ...formData,
      status: 'available'
    };

    if (editingAvailability) {
      setAvailabilitySlots(prev => 
        prev.map(slot => slot.id === editingAvailability.id ? newSlot : slot)
      );
      showNotification('success', 'Availability updated successfully');
    } else {
      setAvailabilitySlots(prev => [...prev, newSlot]);
      showNotification('success', 'Availability created successfully');
    }

    resetForm();
  };

  const resetForm = () => {
    setShowAvailabilityForm(false);
    setEditingAvailability(null);
    setFormData({
      providerId: providers[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      timezone: 'America/New_York',
      isRecurring: false,
      recurrencePattern: 'weekly',
      recurrenceEndDate: '',
      slotDuration: 30,
      breakDuration: 0,
      maxAppointments: 1,
      appointmentType: 'consultation',
      locationType: 'clinic',
      address: '',
      roomNumber: '',
      baseFee: '',
      insuranceAccepted: false,
      currency: 'USD',
      notes: '',
      specialRequirements: []
    });
  };

  const handleEditAvailability = (slot) => {
    setFormData(slot);
    setEditingAvailability(slot);
    setShowAvailabilityForm(true);
  };

  const handleDeleteAvailability = (slotId) => {
    setAvailabilitySlots(prev => prev.filter(slot => slot.id !== slotId));
    showNotification('success', 'Availability deleted successfully');
  };

  const handleBulkDelete = () => {
    setAvailabilitySlots(prev => 
      prev.filter(slot => !selectedSlots.includes(slot.id))
    );
    setSelectedSlots([]);
    showNotification('success', `${selectedSlots.length} availability slots deleted`);
  };

  const toggleSlotSelection = (slotId) => {
    setSelectedSlots(prev => 
      prev.includes(slotId) 
        ? prev.filter(id => id !== slotId)
        : [...prev, slotId]
    );
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const renderCalendarHeader = () => (
    <div className="calendar-header">
      <div className="calendar-navigation">
        <button 
          onClick={() => handleDateNavigation(-1)}
          className="nav-button"
          aria-label="Previous"
        >
          ‹
        </button>
        <div className="date-display">
          {currentView === 'monthly' && (
            <h2>{selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
          )}
          {currentView === 'weekly' && (
            <h2>Week of {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</h2>
          )}
          {currentView === 'daily' && (
            <h2>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h2>
          )}
        </div>
        <button 
          onClick={() => handleDateNavigation(1)}
          className="nav-button"
          aria-label="Next"
        >
          ›
        </button>
        <button 
          onClick={() => setSelectedDate(new Date())}
          className="today-button"
        >
          Today
        </button>
      </div>
      
      <div className="view-controls">
        <div className="view-toggle">
          <button 
            className={`view-btn ${currentView === 'monthly' ? 'active' : ''}`}
            onClick={() => setCurrentView('monthly')}
          >
            Month
          </button>
          <button 
            className={`view-btn ${currentView === 'weekly' ? 'active' : ''}`}
            onClick={() => setCurrentView('weekly')}
          >
            Week
          </button>
          <button 
            className={`view-btn ${currentView === 'daily' ? 'active' : ''}`}
            onClick={() => setCurrentView('daily')}
          >
            Day
          </button>
        </div>
        
        <button 
          onClick={() => setShowAvailabilityForm(true)}
          className="add-availability-btn"
        >
          + Add Availability
        </button>
      </div>
    </div>
  );

  const renderAvailabilityList = () => (
    <div className="availability-list">
      <div className="list-header">
        <h3>Availability Slots</h3>
        {selectedSlots.length > 0 && (
          <div className="bulk-actions">
            <span>{selectedSlots.length} selected</span>
            <button onClick={handleBulkDelete} className="bulk-delete-btn">
              Delete Selected
            </button>
          </div>
        )}
      </div>
      
      <div className="slots-container">
        {availabilitySlots.length === 0 ? (
          <div className="empty-state">
            <p>No availability slots created yet</p>
            <button 
              onClick={() => setShowAvailabilityForm(true)}
              className="empty-action-btn"
            >
              Create your first availability slot
            </button>
          </div>
        ) : (
          availabilitySlots.map(slot => (
            <div key={slot.id} className={`availability-slot ${selectedSlots.includes(slot.id) ? 'selected' : ''}`}>
              <div className="slot-header">
                <input
                  type="checkbox"
                  checked={selectedSlots.includes(slot.id)}
                  onChange={() => toggleSlotSelection(slot.id)}
                  className="slot-checkbox"
                />
                <div className="slot-info">
                  <span className="slot-date">{new Date(slot.date).toLocaleDateString()}</span>
                  <span className="slot-time">{slot.startTime} - {slot.endTime}</span>
                  <span className={`slot-status status-${slot.status}`}>{slot.status}</span>
                </div>
                <div className="slot-actions">
                  <button 
                    onClick={() => handleEditAvailability(slot)}
                    className="edit-btn"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDeleteAvailability(slot.id)}
                    className="delete-btn"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="slot-details">
                <span className="slot-type">{slot.appointmentType}</span>
                <span className="slot-location">{slot.locationType}</span>
                <span className="slot-duration">{slot.slotDuration}min</span>
                {slot.baseFee && <span className="slot-fee">{slot.currency} {slot.baseFee}</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderAvailabilityForm = () => (
    <div className="form-overlay">
      <div className="availability-form-container">
        <div className="form-header">
          <h3>{editingAvailability ? 'Edit Availability' : 'Add New Availability'}</h3>
          <button onClick={resetForm} className="close-btn">×</button>
        </div>
        
        <form onSubmit={handleFormSubmit} className="availability-form">
          {/* Basic Details */}
          <div className="form-section">
            <h4>Basic Details</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Provider *</label>
                <select
                  value={formData.providerId}
                  onChange={(e) => setFormData(prev => ({ ...prev, providerId: e.target.value }))}
                  required
                >
                  <option value="">Select Provider</option>
                  {providers.map(provider => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name} - {provider.specialization}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Start Time *</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Time *</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Timezone</label>
                <select
                  value={formData.timezone}
                  onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                >
                  {timezones.map(tz => (
                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Recurring Availability */}
          <div className="form-section">
            <h4>Recurring Availability</h4>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                />
                Is Recurring?
              </label>
            </div>
            
            {formData.isRecurring && (
              <div className="form-row">
                <div className="form-group">
                  <label>Recurrence Pattern</label>
                  <select
                    value={formData.recurrencePattern}
                    onChange={(e) => setFormData(prev => ({ ...prev, recurrencePattern: e.target.value }))}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={formData.recurrenceEndDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, recurrenceEndDate: e.target.value }))}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Slot Settings */}
          <div className="form-section">
            <h4>Slot Settings</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Slot Duration (minutes)</label>
                <input
                  type="number"
                  value={formData.slotDuration}
                  onChange={(e) => setFormData(prev => ({ ...prev, slotDuration: parseInt(e.target.value) }))}
                  min="15"
                  max="240"
                  step="15"
                />
              </div>
              <div className="form-group">
                <label>Break Duration (minutes)</label>
                <input
                  type="number"
                  value={formData.breakDuration}
                  onChange={(e) => setFormData(prev => ({ ...prev, breakDuration: parseInt(e.target.value) }))}
                  min="0"
                  max="60"
                  step="5"
                />
              </div>
              <div className="form-group">
                <label>Max Appointments Per Slot</label>
                <input
                  type="number"
                  value={formData.maxAppointments}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxAppointments: parseInt(e.target.value) }))}
                  min="1"
                  max="10"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Appointment Type</label>
              <select
                value={formData.appointmentType}
                onChange={(e) => setFormData(prev => ({ ...prev, appointmentType: e.target.value }))}
              >
                {appointmentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="form-section">
            <h4>Location</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Location Type</label>
                <select
                  value={formData.locationType}
                  onChange={(e) => setFormData(prev => ({ ...prev, locationType: e.target.value }))}
                >
                  {locationTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              {formData.locationType !== 'telemedicine' && (
                <>
                  <div className="form-group">
                    <label>Room Number</label>
                    <input
                      type="text"
                      value={formData.roomNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
                      placeholder="Room 101"
                    />
                  </div>
                </>
              )}
            </div>
            
            {formData.locationType !== 'telemedicine' && (
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Medical Center Drive, City, State"
                />
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="form-section">
            <h4>Pricing (Optional)</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Base Fee</label>
                <input
                  type="number"
                  value={formData.baseFee}
                  onChange={(e) => setFormData(prev => ({ ...prev, baseFee: e.target.value }))}
                  step="0.01"
                  min="0"
                  placeholder="150.00"
                />
              </div>
              <div className="form-group">
                <label>Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                >
                  {currencies.map(curr => (
                    <option key={curr.value} value={curr.value}>{curr.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.insuranceAccepted}
                  onChange={(e) => setFormData(prev => ({ ...prev, insuranceAccepted: e.target.checked }))}
                />
                Insurance Accepted
              </label>
            </div>
          </div>

          {/* Additional Information */}
          <div className="form-section">
            <h4>Additional Information</h4>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional notes or special instructions..."
                maxLength="500"
                rows="3"
              ></textarea>
              <div className="char-count">{formData.notes.length}/500</div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={resetForm} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {editingAvailability ? 'Update Availability' : 'Create Availability'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="provider-availability-container">
      {/* Notification */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)}>×</button>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <h1>Provider Availability Management</h1>
        <p>Manage your appointment availability and scheduling preferences</p>
      </div>

      {/* Calendar and Controls */}
      {renderCalendarHeader()}

      {/* Main Content */}
      <div className="availability-content">
        <div className="calendar-section">
          <div className={`calendar-view ${currentView}-view`}>
            {/* Calendar will be rendered based on currentView */}
            <div className="calendar-placeholder">
              <p>📅 {currentView.charAt(0).toUpperCase() + currentView.slice(1)} Calendar View</p>
              <p>Calendar visualization will be displayed here</p>
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          {renderAvailabilityList()}
        </div>
      </div>

      {/* Availability Form Modal */}
      {showAvailabilityForm && renderAvailabilityForm()}
    </div>
  );
};

export default ProviderAvailability; 