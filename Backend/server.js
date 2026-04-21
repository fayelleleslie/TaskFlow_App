Appel des outils bibliothèques nécessaires
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import des routes
const authRoutes = require('./src/routes/authRoutes'); 

dotenv.config();

const app = express();
// Utilisation de l'import des routes
// Middleware pour lire le JSON envoyé par le client (React ou Postman)
app.use(express.json());

// Utilisation des routes d'authentification aui sont dans le dossier routes
// Toutes les routes dans authRoutes commenceront par /api/auth
app.use('/api/auth', authRoutes);


// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connecté à MongoDB !"))
    .catch(error => console.log("Erreur de connexion :", error));

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT} a démarré`);
});