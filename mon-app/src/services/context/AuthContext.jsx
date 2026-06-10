import { useState } from 'react';
import authService from '../authService';
import AuthContext from './authContext';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [isAuth, setIsAuth] = useState(authService.isAuthenticated());

  const register = async (username, email, password) => {
    const data = await authService.register(username, email, password);
    return data;
  };

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('taskflow_user', JSON.stringify(data.user));
    setUser(data.user);
    setIsAuth(true);
    return data;
  };

  const demoLogin = () => {
    const data = authService.demoLogin();
    setUser(data.user);
    setIsAuth(true);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuth, register, login, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}