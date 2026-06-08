const dotenv = require('dotenv');
const app = require('./src/app');
const connectDB = require('./src/config/database');

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Serveur lance sur le port ${PORT}`);
  });

  // démarrer les services internes (rappels)
  try {
    // Prefer Redis/Bull queue when REDIS_URL is configured
    const { initQueue } = require('./src/Jobs/reminderQueue');
    const queue = initQueue();
    if (!queue) {
      const reminderService = require('./src/Services/reminderService');
      reminderService.start();
    }
  } catch (err) {
    console.error('Impossible de démarrer reminderService:', err);
  }
  return server;
});
