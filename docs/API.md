# API Contract — Workshop Tracker

Base URL local: `http://localhost:5187/api` (porta pode variar por ambiente — confirme no `dotnet run`).

Autenticação: Bearer JWT via `POST /api/auth/login`. Endpoints de escrita (`POST`, `PUT`, `DELETE`) exigem `Authorization: Bearer <token>`. Endpoints de leitura (`GET`) são públicos.

---

## Auth

### POST /api/auth/login
**Autenticação:** não exigida.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin",
  "expiresAt": "2026-08-16T01:52:41.0224974Z"
}
```

**Response 401** (credenciais inválidas):
```json
{ "mensagem": "Usuário ou senha inválidos." }
```

---

## Workshops

### GET /api/workshops
**Autenticação:** não exigida.

Retorna todos os workshops, já incluindo os colaboradores presentes em cada um.

**Response 200:**
```json
[
  {
    "id": 1,
    "nome": "Workshop Teste",
    "dataRealizacao": "2026-08-15T16:00:00",
    "descricao": "Teste de RESTRICT",
    "colaboradoresPresentes": [
      { "id": 3, "nome": "João" },
      { "id": 4, "nome": "Teste Console" }
    ]
  }
]
```

### GET /api/workshops/{id}
**Autenticação:** não exigida.

**Response 200:** mesmo shape de um item da listagem acima.

**Response 404:**
```json
{ "mensagem": "Workshop com Id 9999 não encontrado." }
```

### POST /api/workshops
**Autenticação:** obrigatória (`Bearer <token>`).

**Request:**
```json
{
  "nome": "string",
  "dataRealizacao": "2026-08-15T16:00:00",
  "descricao": "string"
}
```

**Response 201:** `WorkshopResponseDto` (sem `colaboradoresPresentes` — workshop recém-criado ainda não tem presenças).
```json
{
  "id": 2,
  "nome": "string",
  "dataRealizacao": "2026-08-15T16:00:00",
  "descricao": "string"
}
```

**Response 400** (nome vazio):
```json
{ "mensagem": "O campo Nome é obrigatório." }
```

### PUT /api/workshops/{id}
**Autenticação:** obrigatória.

**Request:** mesmo shape do `POST`.

**Response:** `204 No Content`.

**Response 404 / 400:** mesmos formatos acima.

### DELETE /api/workshops/{id}
**Autenticação:** obrigatória.

**Response:** `204 No Content`.

**Response 404:** workshop não encontrado.

**Response 409** (workshop possui presenças registradas):
```json
{ "mensagem": "Não é possível excluir este workshop pois ele possui presenças registradas." }
```

---

## Colaboradores

### GET /api/colaboradores
**Autenticação:** não exigida.

**Response 200:**
```json
[
  { "id": 3, "nome": "João" }
]
```

### GET /api/colaboradores/{id}
**Autenticação:** não exigida.

**Response 200:** `{ "id": 3, "nome": "João" }`

**Response 404:**
```json
{ "mensagem": "Colaborador com Id {id} não encontrado." }
```

### POST /api/colaboradores
**Autenticação:** obrigatória.

**Request:**
```json
{ "nome": "string" }
```

**Response 201:** `{ "id": 4, "nome": "string" }`

**Response 400:** `{ "mensagem": "O campo Nome é obrigatório." }`

### PUT /api/colaboradores/{id}
**Autenticação:** obrigatória.

**Request:** `{ "nome": "string" }`

**Response:** `204 No Content`.

### DELETE /api/colaboradores/{id}
**Autenticação:** obrigatória.

**Response:** `204 No Content`.

**Response 409** (colaborador possui presenças registradas):
```json
{ "mensagem": "Não é possível excluir este colaborador pois ele possui presenças registradas em workshops." }
```

---

## Presenças

Endpoints introduzidos para permitir o vínculo entre colaborador e workshop via API (ver `docs/decisions/0006-endpoints-presenca.md`). Não existe um `GET` de listagem próprio — a leitura de presenças é feita através de `colaboradoresPresentes` no `GET /api/workshops` e `GET /api/workshops/{id}`.

### POST /api/presencas
**Autenticação:** obrigatória.

Registra a presença de um colaborador em um workshop.

**Request:**
```json
{
  "workshopId": 1,
  "colaboradorId": 4
}
```

**Response 201:**
```json
{
  "id": 2,
  "workshopId": 1,
  "workshopNome": "Workshop Teste",
  "colaboradorId": 4,
  "colaboradorNome": "Teste Console",
  "dataRegistro": "2026-08-16T14:20:00Z"
}
```

**Response 404** (workshop ou colaborador inexistente):
```json
{ "mensagem": "Workshop com Id {id} não encontrado." }
```
ou
```json
{ "mensagem": "Colaborador com Id {id} não encontrado." }
```

**Response 409** (colaborador já registrado neste workshop):
```json
{ "mensagem": "Este colaborador já está registrado como presente neste workshop." }
```

### DELETE /api/presencas/{workshopId}/{colaboradorId}
**Autenticação:** obrigatória.

Remove o vínculo de presença entre um colaborador e um workshop específicos. A rota usa o par `workshopId`/`colaboradorId` (não o `Id` interno da `Presenca`), já que é esse par que a interface tem disponível ao exibir a lista de presentes de um workshop.

**Response:** `204 No Content`.

**Response 404** (presença não encontrada para o par informado):
```json
{ "mensagem": "Presença não encontrada para este workshop e colaborador." }
```

---

## Convenção de erros

Todos os erros seguem o formato `{ "mensagem": "..." }`, com os seguintes status HTTP:

| Status | Significado |
|---|---|
| 400 | Dado inválido no corpo da requisição |
| 401 | Não autenticado / credenciais inválidas |
| 404 | Recurso não encontrado |
| 409 | Conflito de integridade (exclusão bloqueada por dado relacionado, ou presença duplicada) |