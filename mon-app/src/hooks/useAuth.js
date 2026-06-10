import { useContext } from 'react';
import AuthContext from '../services/context/authContext';

export function useAuth() {
  return useContext(AuthContext);
}