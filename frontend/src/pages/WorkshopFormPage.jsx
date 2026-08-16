import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getWorkshopById,
  createWorkshop,
  updateWorkshop,
} from "../services/api";
import WorkshopForm from "../components/WorkshopForm";
import Loading from "../components/Loading";

export default function WorkshopFormPage() {
  const { id } = useParams();
  const isEdicao = Boolean(id);

  const [workshop, setWorkshop] = useState(null);
  const [carregando, setCarregando] = useState(isEdicao);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEdicao) return;
    getWorkshopById(id).then((dados) => {
      setWorkshop(dados);
      setCarregando(false);
    });
  }, [id, isEdicao]);

  async function handleSubmit(dados) {
    setErro(null);
    setEnviando(true);
    try {
      if (isEdicao) {
        await updateWorkshop(id, dados, token);
        navigate(`/workshops/${id}`);
      } else {
        const criado = await createWorkshop(dados, token);
        navigate(`/workshops/${criado.id}`);
      }
    } catch (err) {
      if (err.message.includes("sessão expirou")) {
        logout();
        navigate("/login");
        return;
      }
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) return <Loading />;

  return (
    <section className="page">
      <h1>{isEdicao ? "Editar Workshop" : "Novo Workshop"}</h1>
      {erro && <p className="form-error">{erro}</p>}
      <WorkshopForm
        workshopInicial={workshop}
        onSubmit={handleSubmit}
        enviando={enviando}
      />
    </section>
  );
}