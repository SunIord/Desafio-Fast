import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login as loginRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const destinoAposLogin = location.state?.from ?? "/workshops";

  async function handleSubmit(event) {
    event.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const dados = await loginRequest(username, password);
      login(dados.token, dados.username);
      navigate(destinoAposLogin, { replace: true });
    } catch (err) {
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="page page-narrow">
      <h1>Login</h1>

      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="username">Usuário</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {erro && <p className="form-error">{erro}</p>}

        <button type="submit" disabled={enviando}>
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </section>
  );
}