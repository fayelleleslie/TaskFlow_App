export default function Header({ user, onLogout }) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">TaskFlow</p>
        <h1>Centre de controle</h1>
      </div>

      <div className="user-menu">
        <div className="avatar" aria-hidden="true">
          {(user?.username || 'U').charAt(0).toUpperCase()}
        </div>
        <div>
          <strong>{user?.username || 'Utilisateur'}</strong>
          <span>{user?.email || 'session active'}</span>
        </div>
        <button type="button" className="secondary" onClick={onLogout}>
          Deconnexion
        </button>
      </div>
    </header>
  );
}
