const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

exports.validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Le nom d'utilisateur doit faire entre 3 et 50 caracteres"),
  body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit faire 8 caracteres minimum')
    .matches(/\d/)
    .withMessage('Le mot de passe doit contenir au moins un chiffre'),
  handleValidationErrors
];

exports.validateLogin = [
  body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
  body('password').notEmpty().withMessage('Mot de passe requis'),
  handleValidationErrors
];

exports.validateTask = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Le titre doit faire entre 3 et 100 caracteres'),
  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('La description ne doit pas depasser 500 caracteres'),
  body('status')
    .optional()
    .isIn(['Non terminee', 'Terminee', 'En cours'])
    .withMessage('Statut invalide'),
  body('priority')
    .optional()
    .isIn(['basse', 'moyenne', 'haute'])
    .withMessage('Priorite invalide'),
  body('dueDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Date d'echeance invalide"),
  body('reminderAt')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Date de rappel invalide'),
  handleValidationErrors
];
