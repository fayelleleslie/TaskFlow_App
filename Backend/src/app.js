// Appel des outils bibliothèques nécessaires
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import des routes
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const adminRoutes = require('./routes/admin.routes');
const cookieParser = require('cookie-parser');

const app = express();

// Middlewares de sécurité
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));

// Simple sanitizer: remove keys starting with '$' or containing '.' from req.body and req.params
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.indexOf('.') !== -1) {
      delete obj[key];
      continue;
    }
    if (typeof obj[key] === 'object') sanitizeObject(obj[key]);
  }
  return obj;
};

app.use((req, res, next) => {
  try {
    if (req.body) sanitizeObject(req.body);
    if (req.params) sanitizeObject(req.params);
    // don't mutate req.query as it may be getter-only in Express 5
  } catch (err) {
    // silent fail-safe
    console.error('Sanitization error:', err.message || err);
  }
  next();
});

// cookie parser (pour refresh token en cookie httpOnly)
app.use(cookieParser());

// Limiter le nombre de requêtes pour éviter l'abus
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200 // limitez selon les besoins
});
app.use(limiter);

// Indispensable pour lire le corps des requêtes (req.body) avec limite de taille
app.use(express.json({ limit: '10kb' }));


// Utilisation des routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// On exporte l'app pour le serveur
module.exports = app;
