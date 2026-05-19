const dotenv = require('dotenv');
const app = require('./src/app');
const connectDB = require('./src/config/database');

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur lance sur le port ${PORT}`);
  });
});
