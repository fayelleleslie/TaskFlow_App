const Task = require('../models/Tasks');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Simple reminder service: every minute, find tasks with reminderAt <= now and reminderSent=false
// For each, send an email if SMTP is configured, otherwise log to console, and mark reminderSent=true.
const POLL_INTERVAL_MS = 60 * 1000; // 1 minute

let timer = null;

// Setup optional transporter if env vars are present
let transporter = null;
const initTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;
  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && EMAIL_FROM) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT, 10),
      secure: SMTP_PORT == 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });
    console.log('ReminderService: SMTP transporter configured');
  }
};

const sendEmailReminder = async (to, subject, text, html) => {
  if (!transporter) return false;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html
    });
    return true;
  } catch (err) {
    console.error('Erreur envoi email reminder:', err);
    return false;
  }
};

const processReminders = async () => {
  try {
    const now = new Date();
    // populate user to access email
    const tasks = await Task.find({ reminderAt: { $lte: now }, reminderSent: false }).populate('user', 'email username');
    if (tasks.length === 0) return;

    for (const task of tasks) {
      const user = task.user;
      const msg = `[Reminder] Task ${task._id} (${task.title}) reminderAt=${task.reminderAt}`;

      if (user && user.email && transporter) {
        const subject = `Rappel: ${task.title}`;
        const text = `Bonjour ${user.username || ''},\n\nCeci est un rappel pour votre tâche: ${task.title}\nEchéance: ${task.dueDate || 'N/A'}\nRappel: ${task.reminderAt}\n\n--\nTaskFlow`;
        const html = `<p>Bonjour ${user.username || ''},</p><p>Ceci est un rappel pour votre tâche: <strong>${task.title}</strong></p><p>Echéance: ${task.dueDate || 'N/A'}<br/>Rappel: ${task.reminderAt}</p>`;
        const sent = await sendEmailReminder(user.email, subject, text, html);
        if (sent) {
          console.log(`ReminderService: email envoyé à ${user.email} pour la tache ${task._id}`);
        } else {
          console.log(msg);
        }
      } else {
        console.log(msg);
      }

      // mark as sent to avoid duplicates
      task.reminderSent = true;
      await task.save();
    }
  } catch (err) {
    console.error('Erreur reminderService:', err);
  }
};

const start = () => {
  if (timer) return;
  initTransporter();
  // immediate run then periodic
  processReminders();
  timer = setInterval(processReminders, POLL_INTERVAL_MS);
  console.log('Reminder service started (interval 1 minute)');
};

const stop = () => {
  if (!timer) return;
  clearInterval(timer);
  timer = null;
};

module.exports = { start, stop };
