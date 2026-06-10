export default function Sidebar({ stats }) {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <span className="brand-mark">TF</span>
        <div>
          <strong>SL TASK</strong>
          <p>Gestion de taches</p>
        </div>
      </div>

      <nav className="side-nav" aria-label="Navigation principale">
        <a className="active" href="#tasks">Tableau de bord</a>
        <a href="#new-task">Nouvelle tache</a>
        <a href="#tasks">Toutes les taches</a>
      </nav>

      <div className="progress-card">
        <span>Progression</span>
        <strong>{stats.completionRate}%</strong>
        <div className="progress-track">
          <div style={{ width: `${stats.completionRate}%` }} />
        </div>
      </div>
    </aside>
  );
}