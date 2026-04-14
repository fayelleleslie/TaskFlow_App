const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route pour l'inscription : POST http://127.0.0.1:3000/api/auth/register
router.post('/register', authController.register);

// Route pour la connexion : POST http://127.0.0.1:3000/api/auth/login
router.post('/login', authController.login);

module.exports = router;