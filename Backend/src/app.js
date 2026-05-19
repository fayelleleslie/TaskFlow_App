// Appel des outils bibliothèques nécessaires
const express = require('express');
const cors = require('cors');

// Import des routes
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');

const app = express();

// Indispensable pour lire le corps des requêtes (req.body)
// Middlewares
app.use(express.json());
app.use(cors());


// Utilisation des routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// On exporte l'app pour le serveur
module.exports = app;
