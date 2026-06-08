import api from './api';

const DEMO_TASKS_KEY = 'taskflow_demo_tasks';

const demoSeedTasks = [
  {
    _id: 'demo-1',
    title: 'Preparer le backlog de la semaine',
    description: 'Lister les taches importantes et clarifier les priorites.',
    status: 'En cours',
    priority: 'haute',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    reminderAt: new Date(Date.now() + 3600000).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    _id: 'demo-2',
    title: 'Finaliser la page dashboard',
    description: 'Verifier les filtres, les cartes de statistiques et le responsive.',
    status: 'Non terminee',
    priority: 'moyenne',
    dueDate: new Date(Date.now() + 172800000).toISOString(),
    reminderAt: '',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'demo-3',
    title: 'Tester le formulaire de connexion',
    description: 'Confirmer les erreurs et le parcours utilisateur.',
    status: 'Terminee',
    priority: 'basse',
    dueDate: '',
    reminderAt: '',
    createdAt: new Date().toISOString()
  }
];

const isDemoMode = () => localStorage.getItem('token') === 'demo-token';

const getDemoTasks = () => {
  const storedTasks = localStorage.getItem(DEMO_TASKS_KEY);

  if (storedTasks) {
    return JSON.parse(storedTasks);
  }

  localStorage.setItem(DEMO_TASKS_KEY, JSON.stringify(demoSeedTasks));
  return demoSeedTasks;
};

const saveDemoTasks = (tasks) => {
  localStorage.setItem(DEMO_TASKS_KEY, JSON.stringify(tasks));
};

const filterAndPaginateDemoTasks = (tasks, params = {}) => {
  const page = Math.max(Number(params.page) || 1, 1);
  const limit = Math.max(Number(params.limit) || 20, 1);
  const search = params.search?.trim().toLowerCase();

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = !params.status || params.status === 'all' || task.status === params.status;
    const text = `${task.title} ${task.description || ''}`.toLowerCase();
    const matchesSearch = !search || text.includes(search);
    return matchesStatus && matchesSearch;
  });

  const start = (page - 1) * limit;
  const paginatedTasks = filteredTasks.slice(start, start + limit);

  return {
    tasks: paginatedTasks,
    pagination: {
      page,
      limit,
      total: filteredTasks.length,
      totalPages: Math.ceil(filteredTasks.length / limit)
    }
  };
};

const taskService = {
  getTasks: async (params = {}) => {
    if (isDemoMode()) {
      return filterAndPaginateDemoTasks(getDemoTasks(), params);
    }

    const response = await api.get('/tasks', { params });
    return response.data;
  },

  getTaskById: async (id) => {
    if (isDemoMode()) {
      return getDemoTasks().find((task) => task._id === id);
    }

    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (task) => {
    if (isDemoMode()) {
      const tasks = getDemoTasks();
      const createdTask = {
        ...task,
        _id: `demo-${Date.now()}`,
        status: 'Non terminee',
        createdAt: new Date().toISOString()
      };

      saveDemoTasks([createdTask, ...tasks]);
      return createdTask;
    }

    const response = await api.post('/tasks', task);
    return response.data;
  },

  updateTask: async (id, task) => {
    if (isDemoMode()) {
      const tasks = getDemoTasks();
      const updatedTask = { ...task, _id: id };
      saveDemoTasks(tasks.map((item) => (item._id === id ? updatedTask : item)));
      return updatedTask;
    }

    const response = await api.put(`/tasks/${id}`, task);
    return response.data;
  },

  deleteTask: async (id) => {
    if (isDemoMode()) {
      saveDemoTasks(getDemoTasks().filter((task) => task._id !== id));
      return { message: 'Tache supprimee' };
    }

    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  }
};

export default taskService;
