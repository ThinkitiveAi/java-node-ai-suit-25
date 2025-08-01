import { useState } from 'react';
import Login from './components/Login';
import Registration from './components/Registration';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'register'

  const switchToLogin = () => setCurrentView('login');
  const switchToRegister = () => setCurrentView('register');

  return (
    <>
      {currentView === 'login' ? (
        <Login onSwitchToRegister={switchToRegister} />
      ) : (
        <Registration onSwitchToLogin={switchToLogin} />
      )}
    </>
  );
}

export default App;
