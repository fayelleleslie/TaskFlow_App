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
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
    }
    if (response.data.user) {
      localStorage.setItem('taskflow_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  demoLogin: () => {
    const demoUser = {
      id: 'demo-user',
      username: 'Demo',
      email: 'demo@taskflow.local'
    };

    localStorage.setItem('token', 'demo-token');
    localStorage.setItem('taskflow_user', JSON.stringify(demoUser));

    return {
      message: 'Mode demo active',
      token: 'demo-token',
      user: demoUser
    };
  },

  // Déconnexion
  logout: () => {
    // appeler le backend pour révoquer le refresh token cookie
    try {
      api.post('/auth/logout').catch(() => {});
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('token');
    localStorage.removeItem('taskflow_user');
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('taskflow_user');
    return user ? JSON.parse(user) : null;
  }

};

export default authService;
