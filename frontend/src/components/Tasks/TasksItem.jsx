const priorityLabels = {
  basse: 'Basse',
  moyenne: 'Moyenne',
  haute: 'Haute'
};

const formatDate = (value) => {
  if (!value) return null;
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
};

export default function TasksItem({ task, onDelete, onEdit, onOpen, onToggle }) {
  const isDone = task.status === 'Terminee';
  const dueDate = formatDate(task.dueDate);
  const reminderAt = formatDate(task.reminderAt);

  return (
    <li className={`task-item ${isDone ? 'done' : ''}`}>
      <button
        type="button"
        className="status-toggle"
        aria-label={isDone ? 'Marquer comme non terminee' : 'Marquer comme terminee'}
        onClick={() => onToggle(task)}
      >
        {isDone ? 'OK' : ''}
      </button>

      <div className="task-content">
        <div className="task-title-row">
          <h3>{task.title}</h3>
          <span className={`priority priority-${task.priority || 'moyenne'}`}>
            {priorityLabels[task.priority] || 'Moyenne'}
          </span>
        </div>
        {task.description && <p>{task.description}</p>}
        <div className="task-meta">
          <span className="status-pill">{task.status}</span>
          {dueDate && <span className="status-pill">Echeance: {dueDate}</span>}
          {reminderAt && <span className="status-pill">Rappel: {reminderAt}</span>}
        </div>
      </div>

      <div className="task-actions">
        <button type="button" className="ghost" onClick={() => onOpen(task)}>
          Detail
        </button>
        <button type="button" className="ghost" onClick={() => onEdit(task)}>
          Modifier
        </button>
        <button type="button" className="ghost danger-text" onClick={() => onDelete(task)}>
          Supprimer
        </button>
      </div>
    </li>
  );
}
