const express = require('express');
const authController = require('../Controllers/authController');
const auth = require('../middleware/authMiddleware');
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware');

const router = express.Router();

// POST /api/auth/register
router.post('/register', validateRegister, authController.register);

// POST /api/auth/login
router.post('/login', validateLogin, authController.login);

// POST /api/auth/logout
router.post('/logout', auth, authController.logout);

// POST /api/auth/refresh
router.post('/refresh', authController.refresh);

module.exports = router;
