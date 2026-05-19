import TasksItem from './TasksItem';

export default function TaskList({ tasks, loading, onDelete, onEdit, onOpen, onToggle }) {
  if (loading) {
    return (
      <section className="task-list">
        <div className="skeleton-line" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
      </section>
    );
  }

  return (
    <section className="task-list">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Execution</p>
          <h2>Liste des taches</h2>
        </div>
        <span className="count-badge">{tasks.length}</span>
      </div>
      {tasks.length === 0 ? (
        <div className="empty-state">
          <h3>Aucune tache trouvee</h3>
          <p className="muted">Ajoute une nouvelle tache ou ajuste tes filtres.</p>
        </div>
      ) : (
        <ul>
          {tasks.map((task) => (
            <TasksItem
              key={task._id}
              task={task}
              onDelete={onDelete}
              onEdit={onEdit}
              onOpen={onOpen}
              onToggle={onToggle}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
