import { useState } from 'react';
import ProviderLogin from './components/ProviderLogin';
import ProviderRegistration from './components/ProviderRegistration';
import ProviderAvailability from './components/ProviderAvailability';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'dashboard', 'availability'
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const switchToLogin = () => setCurrentView('login');
  const switchToRegister = () => setCurrentView('register');
  const switchToDashboard = () => {
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };
  const switchToAvailability = () => setCurrentView('availability');
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('login');
  };

  // Simple Dashboard/Navigation Component
  const renderDashboard = () => (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <div className="dashboard-logo">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19Z"/>
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M17,13H13V17H11V13H7V11H11V7H13V11H17V13Z" opacity="0.3"/>
              <path d="M17,13H13V17H11V13H7V11H11V7H13V11H17V13Z"/>
            </svg>
          </div>
          <div className="dashboard-title">
            <h1>HealthFirst Provider Portal</h1>
            <p>Welcome, Dr. Johnson</p>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <h2>Provider Dashboard</h2>
          <p>Manage your practice, appointments, and patient care</p>
        </div>

        <div className="dashboard-modules">
          <div className="module-card" onClick={switchToAvailability}>
            <div className="module-icon">📅</div>
            <h3>Availability Management</h3>
            <p>Set your appointment availability, manage time slots, and control your schedule</p>
            <div className="module-features">
              <span>• Calendar Views</span>
              <span>• Time Slot Management</span>
              <span>• Recurring Schedules</span>
              <span>• Conflict Detection</span>
            </div>
            <button className="module-btn">Manage Availability</button>
          </div>

          <div className="module-card coming-soon">
            <div className="module-icon">👥</div>
            <h3>Patient Management</h3>
            <p>View and manage your patient records, appointments, and medical history</p>
            <div className="module-features">
              <span>• Patient Records</span>
              <span>• Appointment History</span>
              <span>• Medical Notes</span>
              <span>• Patient Communication</span>
            </div>
            <button className="module-btn" disabled>Coming Soon</button>
          </div>

          <div className="module-card coming-soon">
            <div className="module-icon">📊</div>
            <h3>Analytics & Reports</h3>
            <p>Track your practice performance, patient metrics, and revenue insights</p>
            <div className="module-features">
              <span>• Appointment Statistics</span>
              <span>• Revenue Reports</span>
              <span>• Patient Demographics</span>
              <span>• Practice Insights</span>
            </div>
            <button className="module-btn" disabled>Coming Soon</button>
          </div>

          <div className="module-card coming-soon">
            <div className="module-icon">💬</div>
            <h3>Communication Hub</h3>
            <p>Communicate with patients, staff, and other healthcare professionals</p>
            <div className="module-features">
              <span>• Patient Messages</span>
              <span>• Team Chat</span>
              <span>• Appointment Reminders</span>
              <span>• Notifications</span>
            </div>
            <button className="module-btn" disabled>Coming Soon</button>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced Login component that handles successful login
  const renderLoginWithNavigation = () => (
    <ProviderLogin 
      onSwitchToRegister={switchToRegister}
      onLoginSuccess={switchToDashboard}
    />
  );

  return (
    <>
      {!isLoggedIn && currentView === 'login' && renderLoginWithNavigation()}
      {!isLoggedIn && currentView === 'register' && (
        <ProviderRegistration onSwitchToLogin={switchToLogin} />
      )}
      {isLoggedIn && currentView === 'dashboard' && renderDashboard()}
      {isLoggedIn && currentView === 'availability' && (
        <div className="module-container">
          <div className="module-header">
            <button onClick={switchToDashboard} className="back-btn">
              ← Back to Dashboard
            </button>
          </div>
          <ProviderAvailability />
        </div>
      )}
    </>
  );
}

export default App;
