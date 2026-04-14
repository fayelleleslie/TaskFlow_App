// Appel des outils bibliothèques nécessaires
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Import des routes
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');

dotenv.config();
const app = express();

// Indispensable pour lire le corps des requêtes (req.body)
// Middlewares
app.use(express.json());
app.use(cors());


// Utilisation des routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
//// On exporte l'app pour le serveur
module.exports = app; 