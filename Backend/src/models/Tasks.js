const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    status: {
      type: String,
      enum: ['Non terminee', 'Terminee', 'En cours'],
      default: 'Non terminee'
    },
    priority: {
      type: String,
      enum: ['basse', 'moyenne', 'haute'],
      default: 'moyenne'
    },
    dueDate: {
      type: Date
    },
    reminderAt: {
      type: Date
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
