const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/BlacklistedToken');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentification requise !' });
    }

    const token = authHeader.split(' ')[1];

    // Vérifier si le token a été révoqué
    const revoked = await BlacklistedToken.findOne({ token });
    if (revoked) {
      return res.status(401).json({ message: 'Token révoqué. Veuillez vous reconnecter.' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decodedToken.id };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide ou expire.' });
  }
};
