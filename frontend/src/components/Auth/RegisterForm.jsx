import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/context/AuthContext';

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
      setServerError('Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Nom d'utilisateur" onChange={handleChange} />
      {errors.username && <p>{errors.username}</p>}

      <input name="email" type="email" placeholder="Email" onChange={handleChange} />
      {errors.email && <p>{errors.email}</p>}

      <input name="password" type="password" placeholder="Mot de passe" onChange={handleChange} />
      {errors.password && <p>{errors.password}</p>}

      <input name="confirmPassword" type="password" placeholder="Confirmer le mot de passe" onChange={handleChange} />
      {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
      
      {serverError && <p style={{ color: 'red' }}>{serverError}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Création du compte...' : 'Créer mon compte'}
      </button>
    </form>
  );
}
