import { createContext, useState, useContext } from 'react';
import authService from '../authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(authService.isAuthenticated());

  const register = async (username, email, password) => {
    const data = await authService.register(username, email, password);
    return data;
  };

  const login = async (email, password) => {
    const data = await authService.login(email, password);
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
    <AuthContext.Provider value={{ user, isAuth, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
