import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Modal from '../components/Common/Modal';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import ReminderPanel from '../components/Tasks/ReminderPanel';
import TaskFilters from '../components/Tasks/TaskFilters';
import TaskForm from '../components/Tasks/TaskForm';
import TaskList from '../components/Tasks/TaskList';
import { useAuth } from '../hooks/useAuth';
import taskService from '../services/taskService';

const formatDate = (value) => {
  if (!value) return 'Non renseignee';
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(new Date(value));
};

export default function Dashboard() {
  const { isAuth, logout, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: 'all' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await taskService.getTasks();
      setTasks(data);
    } catch {
      setError("Impossible de charger les taches. Verifie que le backend et MongoDB sont lances.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuth) loadTasks();
  }, [isAuth]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((task) => task.status === 'Terminee').length;
    const active = tasks.filter((task) => task.status !== 'Terminee').length;
    const urgent = tasks.filter((task) => task.priority === 'haute' && task.status !== 'Terminee').length;

    return {
      total,
      done,
      active,
      urgent,
      completionRate: total ? Math.round((done / total) * 100) : 0
    };
  }, [tasks]);

  const reminders = useMemo(() => {
    const now = Date.now();
    const nextWeek = now + 7 * 24 * 60 * 60 * 1000;

    return tasks
      .filter((task) => task.status !== 'Terminee')
      .filter((task) => {
        const reminderTime = task.reminderAt ? new Date(task.reminderAt).getTime() : null;
        const dueTime = task.dueDate ? new Date(task.dueDate).getTime() : null;
        return (reminderTime && reminderTime <= nextWeek) || (dueTime && dueTime <= nextWeek);
      })
      .sort((a, b) => new Date(a.reminderAt || a.dueDate) - new Date(b.reminderAt || b.dueDate));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus = filters.status === 'all' || task.status === filters.status;
      const text = `${task.title} ${task.description || ''}`.toLowerCase();
      const matchesSearch = text.includes(filters.search.toLowerCase().trim());
      return matchesStatus && matchesSearch;
    });
  }, [filters, tasks]);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  const handleCreate = async (task) => {
    const createdTask = await taskService.createTask(task);
    setTasks([createdTask, ...tasks]);
  };

  const handleUpdate = async (task) => {
    const updatedTask = await taskService.updateTask(editingTask._id, { ...editingTask, ...task });
    setTasks(tasks.map((item) => (item._id === updatedTask._id ? updatedTask : item)));
    setEditingTask(null);
  };

  const handleToggle = async (task) => {
    const nextStatus = task.status === 'Terminee' ? 'Non terminee' : 'Terminee';
    const updatedTask = await taskService.updateTask(task._id, { ...task, status: nextStatus });
    setTasks(tasks.map((item) => (item._id === updatedTask._id ? updatedTask : item)));
  };

  const handleConfirmDelete = async () => {
    await taskService.deleteTask(taskToDelete._id);
    setTasks(tasks.filter((task) => task._id !== taskToDelete._id));
    setTaskToDelete(null);
  };

  return (
    <div className="app-shell">
      <Sidebar stats={stats} />

      <main className="dashboard">
        <Header user={user} onLogout={logout} />

        {error && <p className="error">{error}</p>}

        <section className="stats-grid" aria-label="Statistiques des taches">
          <article>
            <span>Total</span>
            <strong>{stats.total}</strong>
          </article>
          <article>
            <span>En cours</span>
            <strong>{stats.active}</strong>
          </article>
          <article>
            <span>Terminees</span>
            <strong>{stats.done}</strong>
          </article>
          <article>
            <span>Priorite haute</span>
            <strong>{stats.urgent}</strong>
          </article>
        </section>

        <TaskFilters filters={filters} onChange={setFilters} />

        <section className="task-layout" id="tasks">
          <div className="side-stack" id="new-task">
            <TaskForm onSubmit={handleCreate} />
            <ReminderPanel reminders={reminders} onOpen={setSelectedTask} />
          </div>
          <TaskList
            tasks={filteredTasks}
            loading={loading}
            onDelete={setTaskToDelete}
            onEdit={setEditingTask}
            onOpen={setSelectedTask}
            onToggle={handleToggle}
          />
        </section>
      </main>

      {selectedTask && (
        <Modal title="Detail de la tache" onClose={() => setSelectedTask(null)}>
          <div className="detail-list">
            <div>
              <span>Titre</span>
              <strong>{selectedTask.title}</strong>
            </div>
            <div>
              <span>Description</span>
              <p>{selectedTask.description || 'Aucune description'}</p>
            </div>
            <div>
              <span>Statut</span>
              <strong>{selectedTask.status}</strong>
            </div>
            <div>
              <span>Priorite</span>
              <strong>{selectedTask.priority}</strong>
            </div>
            <div>
              <span>Date de creation</span>
              <strong>{formatDate(selectedTask.createdAt)}</strong>
            </div>
            <div>
              <span>Echeance</span>
              <strong>{formatDate(selectedTask.dueDate)}</strong>
            </div>
            <div>
              <span>Rappel</span>
              <strong>{formatDate(selectedTask.reminderAt)}</strong>
            </div>
          </div>
        </Modal>
      )}

      {editingTask && (
        <Modal title="Modifier une tache" onClose={() => setEditingTask(null)}>
          <TaskForm initialTask={editingTask} mode="edit" onCancel={() => setEditingTask(null)} onSubmit={handleUpdate} />
        </Modal>
      )}

      {taskToDelete && (
        <Modal
          title="Supprimer cette tache ?"
          onClose={() => setTaskToDelete(null)}
          actions={
            <>
              <button type="button" className="secondary" onClick={() => setTaskToDelete(null)}>
                Annuler
              </button>
              <button type="button" className="danger" onClick={handleConfirmDelete}>
                Supprimer
              </button>
            </>
          }
        >
          <p>
            La tache <strong>{taskToDelete.title}</strong> sera supprimee definitivement.
          </p>
        </Modal>
      )}
    </div>
  );
}
