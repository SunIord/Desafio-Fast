export function contarWorkshopsPorColaborador(workshops) {
  const contagem = new Map();

  workshops.forEach((workshop) => {
    workshop.colaboradoresPresentes.forEach((colaborador) => {
      contagem.set(
        colaborador.nome,
        (contagem.get(colaborador.nome) ?? 0) + 1
      );
    });
  });

  return Array.from(contagem, ([nome, total]) => ({ nome, total })).sort(
    (a, b) => b.total - a.total
  );
}

export function contarPresencasPorWorkshop(workshops) {
  return workshops.map((workshop) => ({
    nome: workshop.nome,
    total: workshop.colaboradoresPresentes.length,
  }));
}

export function presencasAoLongoDoTempo(workshops) {
  return [...workshops]
    .sort((a, b) => new Date(a.dataRealizacao) - new Date(b.dataRealizacao))
    .map((workshop) => ({
      nome: workshop.nome,
      data: new Date(workshop.dataRealizacao).toLocaleDateString("pt-BR", {
        month: "short",
        year: "numeric",
      }),
      total: workshop.colaboradoresPresentes.length,
    }));
}