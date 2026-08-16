import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getWorkshopById,
  deleteWorkshop,
  getColaboradores,
  registrarPresenca,
  removerPresenca,
} from "../services/api";
import { formatarData, formatarHora } from "../utils/formatters";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

export default function WorkshopDetailPage() {
  const { id } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erroExclusao, setErroExclusao] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  // Estado da seção de presença
  const [colaboradores, setColaboradores] = useState([]);
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState("");
  const [erroPresenca, setErroPresenca] = useState(null);
  const [processandoPresenca, setProcessandoPresenca] = useState(false);

  const { isAuthenticated, token, logout } = useAuth();
  const navigate = useNavigate();

  function carregarWorkshop() {
    setCarregando(true);
    return getWorkshopById(id).then((dados) => {
      setWorkshop(dados);
      setCarregando(false);
    });
  }

  useEffect(() => {
    carregarWorkshop();
  }, [id]);

  // Só busca a lista completa de colaboradores se o usuário estiver logado
  // (é só ela que precisa do seletor de "adicionar presença")
  useEffect(() => {
    if (!isAuthenticated) return;
    getColaboradores().then(setColaboradores);
  }, [isAuthenticated]);

  function handleErroPresencaOuSessao(err) {
    if (err.message.includes("sessão expirou")) {
      logout();
      navigate("/login");
      return true;
    }
    return false;
  }

  async function handleExcluirWorkshop() {
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
      if (handleErroPresencaOuSessao(err)) return;
      setErroExclusao(err.message);
      setExcluindo(false);
    }
  }

  async function handleAdicionarPresenca(event) {
    event.preventDefault();
    if (!colaboradorSelecionado) return;

    setErroPresenca(null);
    setProcessandoPresenca(true);
    try {
      await registrarPresenca(id, Number(colaboradorSelecionado), token);
      setColaboradorSelecionado("");
      await carregarWorkshop();
    } catch (err) {
      if (handleErroPresencaOuSessao(err)) return;
      setErroPresenca(err.message);
    } finally {
      setProcessandoPresenca(false);
    }
  }

  async function handleRemoverPresenca(colaboradorId) {
    setErroPresenca(null);
    setProcessandoPresenca(true);
    try {
      await removerPresenca(id, colaboradorId, token);
      await carregarWorkshop();
    } catch (err) {
      if (handleErroPresencaOuSessao(err)) return;
      setErroPresenca(err.message);
    } finally {
      setProcessandoPresenca(false);
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

  // Colaboradores que ainda não estão presentes neste workshop —
  // são os únicos que fazem sentido aparecer no seletor de "adicionar"
  const idsPresentes = new Set(workshop.colaboradoresPresentes.map((c) => c.id));
  const colaboradoresDisponiveis = colaboradores.filter(
    (c) => !idsPresentes.has(c.id)
  );

  return (
    <section className="page">
      <Link to="/workshops" className="back-link">
        ← Voltar para workshops
      </Link>

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
              onClick={handleExcluirWorkshop}
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

      {erroPresenca && <p className="form-error">{erroPresenca}</p>}

      {isAuthenticated && (
        <form onSubmit={handleAdicionarPresenca} className="form form-inline">
          <select
            value={colaboradorSelecionado}
            onChange={(e) => setColaboradorSelecionado(e.target.value)}
          >
            <option value="">Selecione um colaborador...</option>
            {colaboradoresDisponiveis.map((colaborador) => (
              <option key={colaborador.id} value={colaborador.id}>
                {colaborador.nome}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={!colaboradorSelecionado || processandoPresenca}
          >
            {processandoPresenca ? "Adicionando..." : "Adicionar presença"}
          </button>
        </form>
      )}

      {workshop.colaboradoresPresentes.length === 0 ? (
        <EmptyState mensagem="Nenhum colaborador registrado neste workshop." />
      ) : (
        <ul className="list">
          {workshop.colaboradoresPresentes.map((colaborador) => (
            <li key={colaborador.id} className="list-item list-item-row">
              <span>{colaborador.nome}</span>
              {isAuthenticated && (
                <button
                  type="button"
                  className="button button-danger"
                  onClick={() => handleRemoverPresenca(colaborador.id)}
                  disabled={processandoPresenca}
                >
                  Remover
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}