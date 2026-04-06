import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './services/context/AuthContext';  
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/DashBoard';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}