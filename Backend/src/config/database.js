const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connecté avec succès');
    } catch (err) {
        console.error('Erreur de connexion MongoDB:', err.message);
        // Arrête l'app en cas d'échec de connexion à la base de données, car elle est essentielle pour le fonctionnement de l'app
        process.exit(1); 
    }
};

module.exports = connectDB;