//Fonction Inscription
//Import du modèle crée
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenService = require('../Services/tokenService');

const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || '15m';
const REFRESH_TTL_DAYS = parseInt(process.env.REFRESH_TTL_DAYS, 10) || 30;

const createToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET manquant dans le fichier .env');
    }

    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

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
        const user = new User({ username, email, password: hashedPassword });
        //On Sauvegarde le hash dans MongoDB, jamais le mot de passe clair
        await user.save();

        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "Cet email ou nom d'utilisateur existe déjà" });
        }

        res.status(500).json({ message: "Erreur server lors de l'inscription. veuillez réessayer." });
    }
};

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

        // 3. Générer le Token JWT et le refresh token
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });
        const refreshDoc = await tokenService.createRefreshToken(user._id, REFRESH_TTL_DAYS);

        // 4. Envoyer les tokens au client. Refresh token est stocké en cookie httpOnly
        res.cookie('refreshToken', refreshDoc.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000
        });

        res.json({
            message: 'Connexion réussie !',
            accessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Erreur lors de la connexion." });
    }
};

exports.logout = async (req, res) => {
    try {
        // Récupère le token depuis l'entête Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(400).json({ message: 'Token manquant' });
        }

        const token = authHeader.split(' ')[1];
        // Décoder le token pour récupérer la date d'expiration
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.exp) {
            return res.status(400).json({ message: "Token invalide" });
        }

        const BlacklistedToken = require('../models/BlacklistedToken');

        const expiresAt = new Date(decoded.exp * 1000);

        // Enregistrer le token dans la blacklist (sera nettoyé automatiquement après expiration)
        await BlacklistedToken.create({ token, expiresAt });

                // Optionnel: révoquer refreshToken stocké en cookie
                try {
                    const rt = req.cookies && req.cookies.refreshToken;
                    if (rt) await tokenService.revokeRefreshToken(rt);
                    // effacer le cookie côté client
                    res.clearCookie('refreshToken');
                } catch (e) {
                    // ignore
                }

        return res.status(200).json({ message: "Déconnexion réussie. Le token a été révoqué côté serveur." });
    } catch (error) {
        console.error('Erreur lors du logout :', error);
        return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
    }
};

exports.refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies && req.cookies.refreshToken;
        if (!refreshToken) return res.status(400).json({ message: 'refreshToken requis' });

        const stored = await tokenService.findValid(refreshToken);
        if (!stored) return res.status(401).json({ message: 'Refresh token invalide' });

        // rotate: revoke old and create new
        await tokenService.revokeRefreshToken(refreshToken);
        const newRefresh = await tokenService.createRefreshToken(stored.user, REFRESH_TTL_DAYS);

        const accessToken = jwt.sign({ id: stored.user }, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });

        // set new refresh cookie
        res.cookie('refreshToken', newRefresh.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000
        });

        res.json({ accessToken });
    } catch (err) {
        console.error('Erreur refresh token:', err);
        res.status(500).json({ message: 'Erreur lors du rafraîchissement du token' });
    }
};
