
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod = null;
let server = null;

const startServer = async () => {
  let uri = process.env.MONGO_URI || null;
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

  if (!uri) {
    try {
      mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
    } catch (err) {
      console.warn('mongodb-memory-server failed to start, falling back to MONGO_URI if set. Error:', err.message || err);
      if (!process.env.MONGO_URI) {
        throw new Error('mongodb-memory-server failed and no MONGO_URI provided. Install libssl (libcrypto) or set MONGO_URI to a running MongoDB.');
      }
      uri = process.env.MONGO_URI;
    }
  }

  process.env.MONGO_URI = uri;

  // connect mongoose
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });

  // require app after mongoose connected
  const app = require('../src/app');
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));

  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  return { server, baseUrl };
};

const stopServer = async () => {
  try {
    if (server && server.close) {
      await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
      server = null;
    }
  } catch (e) {
    // ignore
  }

  try {
    await mongoose.disconnect();
  } catch (e) {}

  if (mongod) {
    await mongod.stop();
    mongod = null;
  }
};

module.exports = { startServer, stopServer };
