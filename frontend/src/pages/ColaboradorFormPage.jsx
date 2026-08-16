import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getColaboradores,
  createColaborador,
  updateColaborador,
} from "../services/api";
import ColaboradorForm from "../components/ColaboradorForm";
import Loading from "../components/Loading";

export default function ColaboradorFormPage() {
  const { id } = useParams();
  const isEdicao = Boolean(id);

  const [colaborador, setColaborador] = useState(null);
  const [carregando, setCarregando] = useState(isEdicao);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEdicao) return;
    // Não existe GET /api/colaboradores/{id} exposto ainda no services/api.js
    // além do que a listagem já traz — reaproveita a lista e filtra pelo id.
    getColaboradores().then((lista) => {
      const encontrado = lista.find((c) => c.id === Number(id));
      setColaborador(encontrado ?? null);
      setCarregando(false);
    });
  }, [id, isEdicao]);

  async function handleSubmit(dados) {
    setErro(null);
    setEnviando(true);
    try {
      if (isEdicao) {
        await updateColaborador(id, dados, token);
      } else {
        await createColaborador(dados, token);
      }
      navigate("/colaboradores");
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
      <h1>{isEdicao ? "Editar Colaborador" : "Novo Colaborador"}</h1>
      {erro && <p className="form-error">{erro}</p>}
      <ColaboradorForm
        colaboradorInicial={colaborador}
        onSubmit={handleSubmit}
        enviando={enviando}
      />
    </section>
  );
}