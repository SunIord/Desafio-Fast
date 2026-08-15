import { useEffect, useState } from "react";
import { getColaboradores } from "../services/api";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";

export default function ColaboradoresPage() {
  const [colaboradores, setColaboradores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    getColaboradores()
      .then((dados) => setColaboradores(dados))
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return <Loading />;

  if (erro)
    return <EmptyState mensagem={`Não foi possível carregar os colaboradores: ${erro}`} />;

  if (colaboradores.length === 0)
    return <EmptyState mensagem="Nenhum colaborador cadastrado." />;

  return (
    <section className="page">
      <h1>Colaboradores</h1>
      <ul className="list">
        {colaboradores.map((colaborador) => (
          <li key={colaborador.id} className="list-item">
            {colaborador.nome}
          </li>
        ))}
      </ul>
    </section>
  );
}