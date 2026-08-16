import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getColaboradores, deleteColaborador } from "../services/api";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

export default function ColaboradoresPage() {
  const [colaboradores, setColaboradores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [erroExclusaoId, setErroExclusaoId] = useState(null);
  const [excluindoId, setExcluindoId] = useState(null);

  const { isAuthenticated, token, logout } = useAuth();

  function carregar() {
    setCarregando(true);
    getColaboradores()
      .then((dados) => setColaboradores(dados))
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false));
  }

  useEffect(carregar, []);

  async function handleExcluir(colaborador) {
    const confirmado = window.confirm(
      `Excluir o colaborador "${colaborador.nome}"? Esta ação não pode ser desfeita.`
    );
    if (!confirmado) return;

    setErroExclusaoId(null);
    setExcluindoId(colaborador.id);
    try {
      await deleteColaborador(colaborador.id, token);
      carregar();
    } catch (err) {
      if (err.message.includes("sessão expirou")) {
        logout();
        return;
      }
      setErroExclusaoId({ id: colaborador.id, mensagem: err.message });
    } finally {
      setExcluindoId(null);
    }
  }

  if (carregando) return <Loading />;

  if (erro)
    return <EmptyState mensagem={`Não foi possível carregar os colaboradores: ${erro}`} />;

  return (
    <section className="page">
      <div className="page-header">
        <h1>Colaboradores</h1>
        {isAuthenticated && (
          <Link to="/colaboradores/novo" className="button">
            Novo Colaborador
          </Link>
        )}
      </div>

      {colaboradores.length === 0 ? (
        <EmptyState mensagem="Nenhum colaborador cadastrado." />
      ) : (
        <ul className="list">
          {colaboradores.map((colaborador) => (
            <li key={colaborador.id} className="list-item list-item-row">
              <span>{colaborador.nome}</span>

              {isAuthenticated && (
                <div className="actions">
                  <Link
                    to={`/colaboradores/${colaborador.id}/editar`}
                    className="button button-secondary"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    className="button button-danger"
                    onClick={() => handleExcluir(colaborador)}
                    disabled={excluindoId === colaborador.id}
                  >
                    {excluindoId === colaborador.id ? "Excluindo..." : "Excluir"}
                  </button>
                </div>
              )}

              {erroExclusaoId?.id === colaborador.id && (
                <p className="form-error">{erroExclusaoId.mensagem}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}