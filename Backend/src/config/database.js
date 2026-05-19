const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('MongoDB connecté avec succès');
    } catch (err) {
        console.error('Erreur de connexion MongoDB:', err.message);
        console.error('Demarre MongoDB pour utiliser inscription, connexion et taches.');
    }
};

module.exports = connectDB;
