import LoginForm from '../components/Auth/LoginForm';

export default function Login() {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <p className="eyebrow">TaskFlow</p>
        <h1>Connexion</h1>
        <p className="muted">Connecte-toi pour retrouver tes taches.</p>
        <LoginForm />
      </section>
    </main>
  );
}