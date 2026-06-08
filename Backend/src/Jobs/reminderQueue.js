const Queue = require('bull');
const Task = require('../models/Tasks');
const User = require('../models/User');

const REDIS_URL = process.env.REDIS_URL || null;

let queue = null;

const initQueue = () => {
  if (!REDIS_URL) return null;
  queue = new Queue('reminder-queue', REDIS_URL);

  // processor: find due tasks and send reminders (simple logging for now)
  queue.process(async (job) => {
    const now = new Date();
    const tasks = await Task.find({ reminderAt: { $lte: now }, reminderSent: false }).populate('user', 'email username');
    for (const task of tasks) {
      // placeholder: log
      console.log(`[ReminderQueue] task ${task._id} for user ${task.user?.email}`);
      task.reminderSent = true;
      await task.save();
    }
    return Promise.resolve();
  });

  // add a repeatable job every minute
  queue.add({}, { repeat: { cron: '*/1 * * * *' } });
  console.log('ReminderQueue: queue initialized (repeat every minute)');
  return queue;
};

module.exports = { initQueue };
