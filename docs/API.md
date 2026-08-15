# API Contract

## GET /api/workshops
\`\`\`json
[
  {
    "id": 1,
    "nome": "Workshop Teste",
    "dataRealizacao": "2026-08-15T16:00:00",
    "descricao": "Teste de RESTRICT"
  }
]
\`\`\`

## GET /api/colaboradores
\`\`\`json
[
  {
    "id": 3,
    "nome": "João"
  }
]
\`\`\`

## GET /api/workshops/1
\`\`\`json
{
  "id": 1,
  "nome": "Workshop Teste",
  "dataRealizacao": "2026-08-15T16:00:00",
  "descricao": "Teste de RESTRICT",
  "colaboradoresPresentes": [
    {
      "id": 3,
      "nome": "João"
    }
  ]
}
\`\`\`