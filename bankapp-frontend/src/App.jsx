import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';

const AuthApp = () => {
  const { user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  if (user) {
    return <Dashboard />;
  }

  return isLogin ? 
    <LoginForm onToggleMode={() => setIsLogin(false)} /> : 
    <RegisterForm onToggleMode={() => setIsLogin(true)} />;
};

const App = () => {
  return (
    <AuthProvider>
      <AuthApp />
    </AuthProvider>
  );
};

export default App;