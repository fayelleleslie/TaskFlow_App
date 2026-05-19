import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Nom requis';
    if (!formData.email) newErrors.email = 'Email requis';
    if (formData.password.length < 8) newErrors.password = 'Minimum 8 caractères';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } 
    try {
      setLoading(true);
      setServerError('');
      await register(formData.username, formData.email, formData.password);
      navigate('/login');
    } catch (error) {
      setServerError(error.response?.data?.message || 'Erreur lors de la creation du compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Nom d'utilisateur
        <input name="username" value={formData.username} onChange={handleChange} />
      </label>
      {errors.username && <p className="error">{errors.username}</p>}

      <label>
        Email
        <input name="email" type="email" value={formData.email} onChange={handleChange} />
      </label>
      {errors.email && <p className="error">{errors.email}</p>}

      <label>
        Mot de passe
        <input name="password" type="password" value={formData.password} onChange={handleChange} />
      </label>
      {errors.password && <p className="error">{errors.password}</p>}

      <label>
        Confirmer le mot de passe
        <input
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </label>
      {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
      
      {serverError && <p className="error">{serverError}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Creation du compte...' : 'Creer mon compte'}
      </button>

      <p className="muted">
        Deja un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </form>
  );
}
