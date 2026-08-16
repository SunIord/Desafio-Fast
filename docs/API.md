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
      { "id": 3, "nome": "João" }
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

## Convenção de erros

Todos os erros seguem o formato `{ "mensagem": "..." }`, com os seguintes status HTTP:

| Status | Significado |
|---|---|
| 400 | Dado inválido no corpo da requisição |
| 401 | Não autenticado / credenciais inválidas |
| 404 | Recurso não encontrado |
| 409 | Conflito de integridade (exclusão bloqueada por dado relacionado) |