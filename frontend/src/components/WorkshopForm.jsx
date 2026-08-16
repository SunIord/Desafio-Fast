import { useState } from "react";

const CAMPOS_VAZIOS = { nome: "", dataRealizacao: "", descricao: "" };

function paraInputDatetimeLocal(dataIso) {
  if (!dataIso) return "";
  return dataIso.slice(0, 16); // "2026-08-15T16:00:00" -> "2026-08-15T16:00"
}

export default function WorkshopForm({ workshopInicial, onSubmit, enviando }) {
  const [dados, setDados] = useState(() =>
    workshopInicial
      ? {
          nome: workshopInicial.nome,
          dataRealizacao: paraInputDatetimeLocal(workshopInicial.dataRealizacao),
          descricao: workshopInicial.descricao,
        }
      : CAMPOS_VAZIOS
  );

  function handleChange(campo, valor) {
    setDados((atual) => ({ ...atual, [campo]: valor }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(dados);
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <label htmlFor="nome">Nome</label>
      <input
        id="nome"
        type="text"
        value={dados.nome}
        onChange={(e) => handleChange("nome", e.target.value)}
        required
      />

      <label htmlFor="dataRealizacao">Data e hora</label>
      <input
        id="dataRealizacao"
        type="datetime-local"
        value={dados.dataRealizacao}
        onChange={(e) => handleChange("dataRealizacao", e.target.value)}
        required
      />

      <label htmlFor="descricao">Descrição</label>
      <textarea
        id="descricao"
        value={dados.descricao}
        onChange={(e) => handleChange("descricao", e.target.value)}
        rows={4}
      />

      <button type="submit" disabled={enviando}>
        {enviando ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}