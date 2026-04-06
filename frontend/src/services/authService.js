import api from './api';

const authService = {

  // Inscription
  register: async (username, email, password) => {
    const response = await api.post('/auth/register', {
      username,
      email,
      password
    });
    return response.data;
  },

  // Connexion
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password
    });
    // On sauvegarde le token reçu du backend
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('token');
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }

};

export default authService;

