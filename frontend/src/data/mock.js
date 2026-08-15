export const colaboradoresMock = [
    {id: 1, nome: "João Silva"},
    {id: 2, nome: "Maria Oliveira"},
    {id: 3, nome: "Carlos Santos"},
    {id: 4, nome: "Ana Costa"},
];

export const workshopsMock = [
  {
    id: 1,
    nome: "Workshop Teste",
    dataRealizacao: "2026-08-15T16:00:00",
    descricao: "Teste de RESTRICT",
    colaboradoresPresentes: [
      { id: 3, nome: "Carlos Santos" },
    ],
  },
  {
    id: 2,
    nome: "Workshop Teste 2",
    dataRealizacao: "2026-08-16T16:00:00",
    descricao: "Teste de RESTRICT 2",
    colaboradoresPresentes: [
      { id: 4, nome: "Ana Costa" },
    ],
  },
  {
    id: 3,
    nome: "Workshop Teste 3",
    dataRealizacao: "2026-08-17T16:00:00",
    descricao: "Teste de RESTRICT 3",
    colaboradoresPresentes: [
      { id: 1, nome: "João Silva" },
      { id: 2, nome: "Maria Oliveira" },
    ],
  }
];