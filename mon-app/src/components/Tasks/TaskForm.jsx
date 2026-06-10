import { useEffect, useState } from 'react';

const emptyTask = {
  title: '',
  description: '',
  priority: 'moyenne',
  status: 'Non terminee',
  dueDate: '',
  reminderAt: ''
};

const toDateTimeInputValue = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 16);
};

export default function TaskForm({ initialTask, mode = 'create', onCancel, onSubmit }) {
  const [task, setTask] = useState(emptyTask);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialTask) {
      setTask(emptyTask);
      return;
    }

    setTask({
      title: initialTask.title || '',
      description: initialTask.description || '',
      priority: initialTask.priority || 'moyenne',
      status: initialTask.status || 'Non terminee',
      dueDate: toDateTimeInputValue(initialTask.dueDate),
      reminderAt: toDateTimeInputValue(initialTask.reminderAt)
    });
  }, [initialTask]);

  const handleChange = (event) => {
    setTask({ ...task, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (task.title.trim().length < 3) {
      setError('Le titre doit contenir au moins 3 caracteres');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSubmit({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : '',
        reminderAt: task.reminderAt ? new Date(task.reminderAt).toISOString() : ''
      });

      if (mode === 'create') {
        setTask(emptyTask);
      }
    } catch {
      setError(mode === 'create' ? 'Impossible de creer la tache' : 'Impossible de modifier la tache');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{mode === 'create' ? 'Capture' : 'Edition'}</p>
          <h2>{mode === 'create' ? 'Nouvelle tache' : 'Modifier la tache'}</h2>
        </div>
      </div>

      <label>
        Titre
        <input name="title" value={task.title} onChange={handleChange} placeholder="Ex: Appeler le client" />
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={task.description}
          onChange={handleChange}
          placeholder="Ajoute un contexte utile"
        />
      </label>

      <div className="form-grid">
        <label>
          Priorite
          <select name="priority" value={task.priority} onChange={handleChange}>
            <option value="basse">Basse</option>
            <option value="moyenne">Moyenne</option>
            <option value="haute">Haute</option>
          </select>
        </label>

        <label>
          Statut
          <select name="status" value={task.status} onChange={handleChange}>
            <option value="Non terminee">A faire</option>
            <option value="En cours">En cours</option>
            <option value="Terminee">Terminee</option>
          </select>
        </label>
      </div>

      <label>
        Date d'echeance
        <input name="dueDate" type="datetime-local" value={task.dueDate} onChange={handleChange} />
      </label>

      <label>
        Rappel
        <input name="reminderAt" type="datetime-local" value={task.reminderAt} onChange={handleChange} />
      </label>

      {error && <p className="error">{error}</p>}

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel}>
            Annuler
          </button>
        )}
        <button type="submit" disabled={loading}>
          {loading ? 'Enregistrement...' : mode === 'create' ? 'Ajouter' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}