const formatDate = (value) => {
  if (!value) return '';
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
};

export default function ReminderPanel({ reminders, onOpen }) {
  return (
    <section className="reminder-panel" aria-label="Notifications et rappels">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Notifications</p>
          <h2>Rappels</h2>
        </div>
        <span className="count-badge">{reminders.length}</span>
      </div>

      {reminders.length === 0 ? (
        <p className="muted">Aucun rappel actif.</p>
      ) : (
        <ul>
          {reminders.map((task) => (
            <li key={task._id}>
              <button type="button" className="reminder-item" onClick={() => onOpen(task)}>
                <strong>{task.title}</strong>
                <span>{formatDate(task.reminderAt || task.dueDate)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}