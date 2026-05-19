import RegisterForm from "../components/Auth/RegisterForm";

export default function Register() {
  return (
    <main className="auth-page">
      <section className="auth-panel">
      <p className="eyebrow">TaskFlow</p>
      <h1>Créer un compte</h1>
      <p className="muted">Cree ton espace pour organiser tes taches.</p>
      <RegisterForm />
      </section>
    </main>
  );
}
