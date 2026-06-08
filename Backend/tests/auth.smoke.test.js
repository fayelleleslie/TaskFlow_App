const request = require('supertest');
const { startServer, stopServer } = require('./testUtils');
const mongoose = require('mongoose');

let server, baseUrl;

beforeAll(async () => {
  const s = await startServer();
  server = s.server;
  baseUrl = s.baseUrl;
});

afterAll(async () => {
  await stopServer();
});

test('register -> login -> create task (protected)', async () => {
  const agent = request(baseUrl);

  const user = { username: 'smokeuser', email: 'smoke@example.com', password: 'password1' };

  // register
  const reg = await agent.post('/api/auth/register').send(user).set('Accept', 'application/json');
  expect(reg.status).toBe(201);

  // login
  const login = await agent.post('/api/auth/login').send({ email: user.email, password: user.password });
  expect(login.status).toBe(200);
  expect(login.body.accessToken).toBeTruthy();
  const accessToken = login.body.accessToken;
  const cookies = login.headers['set-cookie'];
  expect(cookies && cookies.length).toBeGreaterThan(0);

  // create a task using the access token
  const taskPayload = { title: 'smoke task', description: 'testing', priority: 'moyenne' };
  const create = await agent.post('/api/tasks').set('Authorization', `Bearer ${accessToken}`).send(taskPayload);
  expect(create.status).toBe(201);
  expect(create.body && create.body._id).toBeTruthy();

  // cleanup: remove created collections
  await mongoose.connection.db.dropDatabase();
});
