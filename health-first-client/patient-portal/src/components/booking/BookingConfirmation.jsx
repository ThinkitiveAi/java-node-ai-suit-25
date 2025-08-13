import { useState } from 'react';
import './BookingConfirmation.css';

const BookingConfirmation = ({ bookingData, onStartOver }) => {
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);

  const generateGoogleCalendarUrl = () => {
    const { appointment } = bookingData;
    const startDate = new Date(`${appointment.slot.date} ${appointment.slot.start}`);
    const endDate = new Date(`${appointment.slot.date} ${appointment.slot.end}`);
    
    const details = `
      Provider: ${appointment.provider.name}
      Type: ${appointment.slot.type}
      Location: ${appointment.provider.clinic}
      Confirmation #: ${bookingData.confirmationNumber}
    `.trim();

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `Appointment with ${appointment.provider.name}`,
      dates: `${startDate.toISOString().replace(/-|:|\.\d+/g, '')}/${endDate.toISOString().replace(/-|:|\.\d+/g, '')}`,
      details,
      location: appointment.provider.clinic,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const generateOutlookCalendarUrl = () => {
    const { appointment } = bookingData;
    const startDate = new Date(`${appointment.slot.date} ${appointment.slot.start}`);
    const endDate = new Date(`${appointment.slot.date} ${appointment.slot.end}`);
    
    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      startdt: startDate.toISOString(),
      enddt: endDate.toISOString(),
      subject: `Appointment with ${appointment.provider.name}`,
      location: appointment.provider.clinic,
      body: `
        Provider: ${appointment.provider.name}
        Type: ${appointment.slot.type}
        Location: ${appointment.provider.clinic}
        Confirmation #: ${bookingData.confirmationNumber}
      `.trim(),
    });

    return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
  };

  const generateIcsFile = () => {
    const { appointment } = bookingData;
    const startDate = new Date(`${appointment.slot.date} ${appointment.slot.start}`);
    const endDate = new Date(`${appointment.slot.date} ${appointment.slot.end}`);
    
    const formatDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:Appointment with ${appointment.provider.name}
DESCRIPTION:Provider: ${appointment.provider.name}\\nType: ${appointment.slot.type}\\nLocation: ${appointment.provider.clinic}\\nConfirmation #: ${bookingData.confirmationNumber}
LOCATION:${appointment.provider.clinic}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `appointment_${bookingData.confirmationNumber}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="booking-confirmation">
      <div className="confirmation-header">
        <div className="success-icon">✓</div>
        <h2>Appointment Confirmed!</h2>
        <p>Your appointment has been successfully scheduled</p>
      </div>

      <div className="confirmation-details">
        <div className="confirmation-number">
          <label>Confirmation Number</label>
          <span>{bookingData.confirmationNumber}</span>
        </div>

        <div className="appointment-details">
          <h3>Appointment Details</h3>
          
          <div className="detail-group">
            <div className="provider-info">
              <img
                src={bookingData.appointment.provider.photo}
                alt={bookingData.appointment.provider.name}
              />
              <div>
                <h4>{bookingData.appointment.provider.name}</h4>
                <p>{bookingData.appointment.provider.specialization}</p>
              </div>
            </div>
          </div>

          <div className="detail-group">
            <label>Date & Time</label>
            <p>
              {new Date(bookingData.appointment.slot.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
            <p>
              {bookingData.appointment.slot.start} - {bookingData.appointment.slot.end}
            </p>
          </div>

          <div className="detail-group">
            <label>Location</label>
            <p>{bookingData.appointment.provider.clinic}</p>
          </div>

          <div className="detail-group">
            <label>Appointment Type</label>
            <p>{bookingData.appointment.slot.type}</p>
          </div>

          {bookingData.appointment.slot.price && (
            <div className="detail-group">
              <label>Fee</label>
              <p>${bookingData.appointment.slot.price}</p>
            </div>
          )}
        </div>

        <div className="calendar-integration">
          <button
            className="calendar-button"
            onClick={() => setShowCalendarOptions(!showCalendarOptions)}
          >
            Add to Calendar
          </button>

          {showCalendarOptions && (
            <div className="calendar-options">
              <a
                href={generateGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="calendar-option"
              >
                Google Calendar
              </a>
              <a
                href={generateOutlookCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="calendar-option"
              >
                Outlook Calendar
              </a>
              <button
                onClick={generateIcsFile}
                className="calendar-option"
              >
                Download .ics File
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="confirmation-actions">
        <p>A confirmation email has been sent to your email address.</p>
        <button onClick={onStartOver} className="start-over-button">
          Book Another Appointment
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation; 