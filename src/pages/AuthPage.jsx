// AuthPage.js (phiên bản nâng cao)
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Đồng bộ state với URL
  useEffect(() => {
    setIsLogin(location.pathname === '/login');
  }, [location]);

  const handleSwitchToRegister = () => {
    setIsLogin(false);
    navigate('/register');
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {isLogin ? (
        <Login onSwitchToRegister={handleSwitchToRegister} />
      ) : (
        <Register onSwitchToLogin={handleSwitchToLogin} />
      )}
    </div>
  );
}