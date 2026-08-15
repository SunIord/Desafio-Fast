import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getWorkshopById } from "../services/api";
import { formatarData, formatarHora } from "../utils/formatters";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

export default function WorkshopDetailPage() {
  const { id } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setCarregando(true);
    getWorkshopById(id).then((dados) => {
      setWorkshop(dados);
      setCarregando(false);
    });
  }, [id]);

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
      <Link to="/workshops" className="back-link">
        ← Voltar para workshops
      </Link>

      <h1>{workshop.nome}</h1>
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