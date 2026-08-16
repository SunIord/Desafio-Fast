import { useState } from "react";

export default function ColaboradorForm({ colaboradorInicial, onSubmit, enviando }) {
  const [nome, setNome] = useState(colaboradorInicial?.nome ?? "");

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({ nome });
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <label htmlFor="nome">Nome</label>
      <input
        id="nome"
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />

      <button type="submit" disabled={enviando}>
        {enviando ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}