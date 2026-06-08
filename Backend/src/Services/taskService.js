const Task = require('../models/Tasks');

const MAX_PAGE_LIMIT = 100;

const normalizeTaskPayload = (payload) => ({
  ...payload,
  dueDate: payload.dueDate || undefined,
  reminderAt: payload.reminderAt || undefined
});

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.createTask = async (userId, payload) => {
  const newTask = new Task({ ...normalizeTaskPayload(payload), user: userId });
  await newTask.save();
  return newTask;
};

exports.getTasks = async (userId, queryParams) => {
  const { status, search } = queryParams;
  const page = Math.max(parseInt(queryParams.page, 10) || 1, 1);
  const requestedLimit = parseInt(queryParams.limit, 10) || 20;
  const limit = Math.min(Math.max(requestedLimit, 1), MAX_PAGE_LIMIT);
  const skip = (page - 1) * limit;

  let query = { user: userId };

  if (status && status !== 'all') {
    query.status = status;
  }

  if (search) {
    if (search.length > 200) throw { status: 400, message: 'Terme de recherche trop long' };
    const safeSearch = escapeRegex(search.trim());
    query.$or = [
      { title: { $regex: safeSearch, $options: 'i' } },
      { description: { $regex: safeSearch, $options: 'i' } }
    ];
  }

  const [tasks, total] = await Promise.all([
    Task.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Task.countDocuments(query)
  ]);

  return {
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

exports.getTaskById = async (userId, id) => {
  const task = await Task.findOne({ _id: id, user: userId });
  if (!task) throw { status: 404, message: 'Tâche non trouvée' };
  return task;
};

exports.updateTask = async (userId, id, payload) => {
  const task = await Task.findOneAndUpdate(
    { _id: id, user: userId },
    normalizeTaskPayload(payload),
    { new: true }
  );
  if (!task) throw { status: 404, message: 'Tâche non trouvée' };
  return task;
};

exports.deleteTask = async (userId, id) => {
  const task = await Task.findOneAndDelete({ _id: id, user: userId });
  if (!task) throw { status: 404, message: 'Tâche introuvable' };
  return task;
};
