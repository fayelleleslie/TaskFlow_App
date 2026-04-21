const mongoose = require('mongoose');

// On définit le "moule" de ton utilisateur
const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true 
    },
    password: { 
        type: String, 
        required: true 
    }
}, { timestamps: true }); // Cela crée automatiquement 'createdAt' et 'updatedAt'

// On exporte le modèle pour l'utiliser dans d'autres fichiers
module.exports = mongoose.model('User', userSchema);