import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWorkshops } from "../services/api";
import { formatarData } from "../utils/formatters";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    getWorkshops().then((dados) => {
      setWorkshops(dados);
      setCarregando(false);
    });
  }, []);

  if (carregando) return <Loading />;

  if (workshops.length === 0)
    return <EmptyState mensagem="Nenhum workshop cadastrado." />;

  return (
    <section className="page">
      <h1>Workshops</h1>
      <ul className="list">
        {workshops.map((workshop) => (
          <li key={workshop.id} className="list-item">
            <Link to={`/workshops/${workshop.id}`} className="list-item-title">
              {workshop.nome}
            </Link>
            <span className="list-item-subtitle">
              {formatarData(workshop.dataRealizacao)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}