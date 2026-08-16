import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getWorkshopById, deleteWorkshop } from "../services/api";
import { formatarData, formatarHora } from "../utils/formatters";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

export default function WorkshopDetailPage() {
  const { id } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erroExclusao, setErroExclusao] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  const { isAuthenticated, token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setCarregando(true);
    getWorkshopById(id).then((dados) => {
      setWorkshop(dados);
      setCarregando(false);
    });
  }, [id]);

  async function handleExcluir() {
    const confirmado = window.confirm(
      `Excluir o workshop "${workshop.nome}"? Esta ação não pode ser desfeita.`
    );
    if (!confirmado) return;

    setErroExclusao(null);
    setExcluindo(true);
    try {
      await deleteWorkshop(id, token);
      navigate("/workshops");
    } catch (err) {
      if (err.message.includes("sessão expirou")) {
        logout();
        navigate("/login");
        return;
      }
      setErroExclusao(err.message);
      setExcluindo(false);
    }
  }

  if (carregando) return <Loading />;

  if (!workshop)
    return (
      <section className="page">
        <EmptyState mensagem="Workshop não encontrado." />
        <Link to="/workshops">Voltar para a lista</Link>
      </section>
    );

  return (
    <section className="page">
      <div className="page-header">
        <h1>{workshop.nome}</h1>
        {isAuthenticated && (
          <div className="actions">
            <Link to={`/workshops/${id}/editar`} className="button button-secondary">
              Editar
            </Link>
            <button
              type="button"
              className="button button-danger"
              onClick={handleExcluir}
              disabled={excluindo}
            >
              {excluindo ? "Excluindo..." : "Excluir"}
            </button>
          </div>
        )}
      </div>

      {erroExclusao && <p className="form-error">{erroExclusao}</p>}

      <p className="workshop-meta">
        {formatarData(workshop.dataRealizacao)} às{" "}
        {formatarHora(workshop.dataRealizacao)}
      </p>
      <p className="workshop-descricao">{workshop.descricao}</p>

      <h2>Colaboradores presentes</h2>
      {workshop.colaboradoresPresentes.length === 0 ? (
        <EmptyState mensagem="Nenhum colaborador registrado neste workshop." />
      ) : (
        <ul className="list">
          {workshop.colaboradoresPresentes.map((colaborador) => (
            <li key={colaborador.id} className="list-item">
              {colaborador.nome}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}