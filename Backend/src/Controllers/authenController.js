//Fonction Inscription
//Import du modèle crée
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Vérifier si l'utilisateur existe déjà
        let userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "L'utilisateur existe déjà" });

        // 2. Hachage du mot de passe
        // on génère un "Salt" pour renforcer la sécurité du mot de passe
        const salt = await bcrypt.genSalt(10);
        // On hache le mot de passe avec le "Salt" généré ou on crée un mot de passe haché directement
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Création de l'utilisateur avec le mot de passe haaché et sauvegarder
        user = new User({ username, email, password: hashedPassword });
        //On Sauvegarde le hash dans MongoDB, jamais le mot de passe clair
        await user.save();

        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur server lors de l'inscription. veuillez réessayer." });
    }
};

//Fonction Login
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Chercher l'utilisateur par son email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Identifiants invalides." });
        }

        // 2. Comparer le mot de passe saisi avec le mot de passe haché en base
        // bcrypt.compare() va hacher le mot de passe saisi et comparer les empreintes
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Identifiants invalides." });
        }

        // 3. Générer le Token JWT
        // On ne met jamais d'infos sensibles (comme le mot de passe) dans le payload
        const token = jwt.sign(
             // Payload; on peut y mettre des infos utiles pour l'authentification, comme l'id de l'utilisateur
            { id: user._id }, 
            // Clé secrète pour signer le token, à stocker dans le fichier .env pour plus de sécurité  
            process.env.JWT_SECRET,  
             // Durée de validité du token, ici 24h (on peut aussi faire '1d' ou '12h' etc.)
            { expiresIn: '24h' }     
         );

        // 4. Envoyer le token au client
        res.json({
            message: "Connexion réussie !",
            token: token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la connexion." });
    }
};