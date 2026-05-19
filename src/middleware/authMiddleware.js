const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
// Récupère le token après "Bearer"
        const token = req.headers.authorization.split(' ')[1]; 
        // Vérification du token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
         // On stocke l'ID pour les prochaines fonctions
        req.user = { id: decodedToken.id };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentification requise !' });
    }
};