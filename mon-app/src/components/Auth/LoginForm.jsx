import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function LoginForm() {
  const { demoLogin, login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleDemo = () => {
    demoLogin();
    navigate('/dashboard');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      setServerError(error.response?.data?.message || 'Connexion impossible pour le moment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Email
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Mot de passe
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </label>

      {serverError && <p className="error">{serverError}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>

      <button type="button" className="secondary full-width" onClick={handleDemo}>
        Essayer le mode demo
      </button>

      <p className="muted">
        Pas encore de compte ? <Link to="/register">Creer un compte</Link>
      </p>
    </form>
  );
}