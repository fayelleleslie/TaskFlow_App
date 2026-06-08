const request = require('supertest');
const { startServer, stopServer } = require('./testUtils');
const mongoose = require('mongoose');
const ReminderService = require('../src/Services/reminderService');

let server, baseUrl;

beforeAll(async () => {
  const s = await startServer();
  server = s.server;
  baseUrl = s.baseUrl;
});

afterAll(async () => {
  // ensure reminder service stopped
  try { ReminderService.stop(); } catch (e) {}
  await stopServer();
});

test('reminder service marks due tasks as reminderSent', async () => {
  const agent = request(baseUrl);
  const user = { username: 'remuser', email: 'rem@example.com', password: 'password1' };

  // register + login
  await agent.post('/api/auth/register').send(user);
  const login = await agent.post('/api/auth/login').send({ email: user.email, password: user.password });
  const accessToken = login.body.accessToken;

  // create task with reminderAt in the past
  const past = new Date(Date.now() - 60 * 1000).toISOString();
  const taskPayload = { title: 'reminder task', reminderAt: past };
  const create = await agent.post('/api/tasks').set('Authorization', `Bearer ${accessToken}`).send(taskPayload);
  expect(create.status).toBe(201);
  const taskId = create.body._id;

  // start reminder service which runs processReminders immediately
  ReminderService.start();

  // wait briefly for processing
  await new Promise((r) => setTimeout(r, 800));

  // fetch task
  const get = await agent.get(`/api/tasks/${taskId}`).set('Authorization', `Bearer ${accessToken}`);
  expect(get.status).toBe(200);
  expect(get.body.reminderSent).toBe(true);

  ReminderService.stop();

  // cleanup
  await mongoose.connection.db.dropDatabase();
});
