import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <p className="eyebrow">404</p>
        <h1>Page introuvable</h1>
        <Link to="/login">Retour a la connexion</Link>
      </section>
    </main>
  );
}
