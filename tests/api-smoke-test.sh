#!/usr/bin/env bash
set -uo pipefail

BASE_URL="${1:-http://localhost:5187/api}"
PASS=0
FAIL=0

verde() { echo -e "\033[32m$1\033[0m"; }
vermelho() { echo -e "\033[31m$1\033[0m"; }

# assert_status <descricao> <status_esperado> <metodo> <path> [body] [auth]
assert_status() {
  local descricao="$1" esperado="$2" metodo="$3" path="$4" body="${5:-}" auth="${6:-}"
  local args=(-s -o /tmp/smoke_body -w "%{http_code}" -X "$metodo" "$BASE_URL$path")
  [[ -n "$body" ]] && args+=(-H "Content-Type: application/json" -d "$body")
  [[ -n "$auth" ]] && args+=(-H "Authorization: Bearer $auth")

  local status
  status=$(curl "${args[@]}")

  if [[ "$status" == "$esperado" ]]; then
    verde "PASS  $descricao ($status)"
    PASS=$((PASS + 1))
  else
    vermelho "FAIL  $descricao (esperado $esperado, veio $status)"
    cat /tmp/smoke_body
    echo
    FAIL=$((FAIL + 1))
  fi
}

echo "== Workshop Tracker — smoke test da API =="
echo "Base URL: $BASE_URL"
echo

# --- Auth ---
assert_status "Login com credenciais inválidas -> 401" 401 POST "/auth/login" \
  '{"username":"admin","password":"senha_errada"}'

TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.token')

if [[ -z "$TOKEN" || "$TOKEN" == "null" ]]; then
  vermelho "FAIL  Login com credenciais válidas -> não retornou token"
  FAIL=$((FAIL + 1))
else
  verde "PASS  Login com credenciais válidas -> token obtido"
  PASS=$((PASS + 1))
fi

# --- Leitura pública ---
assert_status "GET /workshops sem auth -> 200" 200 GET "/workshops"
assert_status "GET /colaboradores sem auth -> 200" 200 GET "/colaboradores"
assert_status "GET /workshops/9999 inexistente -> 404" 404 GET "/workshops/9999"

# --- Escrita sem token -> deve bloquear ---
assert_status "POST /workshops sem token -> 401" 401 POST "/workshops" \
  '{"nome":"X","dataRealizacao":"2026-01-01T16:00:00","descricao":"X"}'

# --- CRUD Colaborador (autenticado) ---
NOVO_COLAB=$(curl -s -X POST "$BASE_URL/colaboradores" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"nome":"Smoke Test Colaborador"}')
COLAB_ID=$(echo "$NOVO_COLAB" | jq -r '.id')

if [[ -n "$COLAB_ID" && "$COLAB_ID" != "null" ]]; then
  verde "PASS  POST /colaboradores -> criado (id=$COLAB_ID)"
  PASS=$((PASS + 1))
else
  vermelho "FAIL  POST /colaboradores -> não retornou id"
  FAIL=$((FAIL + 1))
fi

assert_status "PUT /colaboradores/{id} -> 204" 204 PUT "/colaboradores/$COLAB_ID" \
  '{"nome":"Smoke Test Colaborador Editado"}' "$TOKEN"

assert_status "POST /colaboradores com nome vazio -> 400" 400 POST "/colaboradores" \
  '{"nome":""}' "$TOKEN"

# --- CRUD Workshop (autenticado) ---
NOVO_WORKSHOP=$(curl -s -X POST "$BASE_URL/workshops" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"nome":"Smoke Test Workshop","dataRealizacao":"2026-01-01T16:00:00","descricao":"Gerado pelo smoke test"}')
WORKSHOP_ID=$(echo "$NOVO_WORKSHOP" | jq -r '.id')

if [[ -n "$WORKSHOP_ID" && "$WORKSHOP_ID" != "null" ]]; then
  verde "PASS  POST /workshops -> criado (id=$WORKSHOP_ID)"
  PASS=$((PASS + 1))
else
  vermelho "FAIL  POST /workshops -> não retornou id"
  FAIL=$((FAIL + 1))
fi

# --- Presença ---
assert_status "POST /presencas -> 201" 201 POST "/presencas" \
  "{\"workshopId\":$WORKSHOP_ID,\"colaboradorId\":$COLAB_ID}" "$TOKEN"

assert_status "POST /presencas duplicada -> 409" 409 POST "/presencas" \
  "{\"workshopId\":$WORKSHOP_ID,\"colaboradorId\":$COLAB_ID}" "$TOKEN"

DETALHE=$(curl -s "$BASE_URL/workshops/$WORKSHOP_ID")
TEM_PRESENTE=$(echo "$DETALHE" | jq --argjson id "$COLAB_ID" \
  '.colaboradoresPresentes | any(.id == $id)')

if [[ "$TEM_PRESENTE" == "true" ]]; then
  verde "PASS  GET /workshops/{id} reflete a presença registrada"
  PASS=$((PASS + 1))
else
  vermelho "FAIL  GET /workshops/{id} não reflete a presença registrada"
  FAIL=$((FAIL + 1))
fi

# --- Restrict on delete: workshop/colaborador com presença não pode ser excluído ---
assert_status "DELETE /workshops/{id} com presença -> 409" 409 DELETE "/workshops/$WORKSHOP_ID" "" "$TOKEN"
assert_status "DELETE /colaboradores/{id} com presença -> 409" 409 DELETE "/colaboradores/$COLAB_ID" "" "$TOKEN"

# --- Limpeza: remove presença, depois os registros criados pelo teste ---
assert_status "DELETE /presencas/{workshopId}/{colaboradorId} -> 204" 204 \
  DELETE "/presencas/$WORKSHOP_ID/$COLAB_ID" "" "$TOKEN"

assert_status "DELETE /workshops/{id} (limpeza) -> 204" 204 DELETE "/workshops/$WORKSHOP_ID" "" "$TOKEN"
assert_status "DELETE /colaboradores/{id} (limpeza) -> 204" 204 DELETE "/colaboradores/$COLAB_ID" "" "$TOKEN"

# --- Resultado ---
echo
echo "== Resultado: $PASS passaram, $FAIL falharam =="
[[ "$FAIL" -eq 0 ]] && exit 0 || exit 1