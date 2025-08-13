import { useState, useEffect } from 'react';
import './SearchFilters.css';

const SearchFilters = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (field, value) => {
    const updatedFilters = {
      ...localFilters,
      [field]: value,
    };
    setLocalFilters(updatedFilters);
  };

  const handleDateChange = (field, value) => {
    const updatedFilters = {
      ...localFilters,
      dateRange: {
        ...localFilters.dateRange,
        [field]: value,
      },
    };
    setLocalFilters(updatedFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      dateRange: {
        start: new Date(),
        end: new Date(new Date().setDate(new Date().getDate() + 30)),
      },
      specialization: '',
      location: '',
      appointmentType: '',
      insurance: '',
      maxPrice: '',
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="search-filters">
      <div className="filters-header">
        <h2>Search Filters</h2>
        <button
          className="toggle-filters-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className={`filters-content ${isExpanded ? 'expanded' : ''}`}>
        {/* Date Range */}
        <div className="filter-group">
          <label>Date Range</label>
          <div className="date-inputs">
            <div className="date-input">
              <label>From</label>
              <input
                type="date"
                value={localFilters.dateRange.start.toISOString().split('T')[0]}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => handleDateChange('start', new Date(e.target.value))}
              />
            </div>
            <div className="date-input">
              <label>To</label>
              <input
                type="date"
                value={localFilters.dateRange.end.toISOString().split('T')[0]}
                min={localFilters.dateRange.start.toISOString().split('T')[0]}
                onChange={(e) => handleDateChange('end', new Date(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Specialization */}
        <div className="filter-group">
          <label>Specialization</label>
          <select
            value={localFilters.specialization}
            onChange={(e) => handleInputChange('specialization', e.target.value)}
          >
            <option value="">All Specializations</option>
            <option value="cardiology">Cardiology</option>
            <option value="dermatology">Dermatology</option>
            <option value="neurology">Neurology</option>
            <option value="orthopedics">Orthopedics</option>
            <option value="pediatrics">Pediatrics</option>
            <option value="psychiatry">Psychiatry</option>
          </select>
        </div>

        {/* Location */}
        <div className="filter-group">
          <label>Location</label>
          <select
            value={localFilters.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
          >
            <option value="">All Locations</option>
            <option value="clinic">Clinic</option>
            <option value="hospital">Hospital</option>
            <option value="virtual">Virtual Visit</option>
          </select>
        </div>

        {/* Appointment Type */}
        <div className="filter-group">
          <label>Appointment Type</label>
          <select
            value={localFilters.appointmentType}
            onChange={(e) => handleInputChange('appointmentType', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="consultation">Consultation</option>
            <option value="follow-up">Follow-up</option>
            <option value="procedure">Procedure</option>
            <option value="checkup">Regular Check-up</option>
          </select>
        </div>

        {/* Insurance */}
        <div className="filter-group">
          <label>Insurance Provider</label>
          <select
            value={localFilters.insurance}
            onChange={(e) => handleInputChange('insurance', e.target.value)}
          >
            <option value="">All Insurance</option>
            <option value="aetna">Aetna</option>
            <option value="bluecross">Blue Cross</option>
            <option value="cigna">Cigna</option>
            <option value="medicare">Medicare</option>
            <option value="unitedhealthcare">UnitedHealthcare</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="filter-group">
          <label>Maximum Price</label>
          <div className="price-input">
            <span className="currency-symbol">$</span>
            <input
              type="number"
              value={localFilters.maxPrice}
              onChange={(e) => handleInputChange('maxPrice', e.target.value)}
              placeholder="Any price"
              min="0"
              step="10"
            />
          </div>
        </div>

        {/* Filter Actions */}
        <div className="filter-actions">
          <button className="reset-btn" onClick={handleReset}>
            Reset Filters
          </button>
          <button className="apply-btn" onClick={handleApplyFilters}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters; 