import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Registration from './components/Registration';
import BookAppointment from './components/BookAppointment';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'register'

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  const switchToLogin = () => setCurrentView('login');
  const switchToRegister = () => setCurrentView('register');

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              currentView === 'login' ? (
                <Login onSwitchToRegister={switchToRegister} onLogin={handleLogin} />
              ) : (
                <Registration onSwitchToLogin={switchToLogin} />
              )
            ) : (
              <Navigate to="/book-appointment" replace />
            )
          }
        />
        <Route
          path="/book-appointment"
          element={
            <BookAppointment onLogout={handleLogout} />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
