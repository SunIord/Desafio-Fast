const API_URL = import.meta.env.VITE_API_URL;

async function handleResponse(response) {
  if (response.status === 401) {
    throw new Error("Sua sessão expirou. Faça login novamente.");
  }

  if (!response.ok) {
    let mensagem = `Erro ${response.status} ao consultar a API.`;
    try {
      const corpo = await response.json();
      if (corpo?.mensagem) mensagem = corpo.mensagem;
    } catch {
      // resposta sem corpo JSON, mantém a mensagem genérica
    }
    throw new Error(mensagem);
  }
  return response.json();
}

export function buildAuthHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function login(username, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(response);
}

export async function getColaboradores() {
  const response = await fetch(`${API_URL}/colaboradores`);
  return handleResponse(response);
}

export async function getWorkshops() {
  const response = await fetch(`${API_URL}/workshops`);
  return handleResponse(response);
}

export async function getWorkshopById(id) {
  const response = await fetch(`${API_URL}/workshops/${id}`);
  if (response.status === 404) return null;
  return handleResponse(response);
}

// --- Workshops ---

export async function createWorkshop(dados, token) {
  const response = await fetch(`${API_URL}/workshops`, {
    method: "POST",
    headers: buildAuthHeaders(token),
    body: JSON.stringify(dados),
  });
  return handleResponse(response);
}

export async function updateWorkshop(id, dados, token) {
  const response = await fetch(`${API_URL}/workshops/${id}`, {
    method: "PUT",
    headers: buildAuthHeaders(token),
    body: JSON.stringify(dados),
  });
  if (!response.ok) return handleResponse(response); // dispara o erro tratado
  return true; // 204 No Content não tem corpo pra parsear
}

export async function deleteWorkshop(id, token) {
  const response = await fetch(`${API_URL}/workshops/${id}`, {
    method: "DELETE",
    headers: buildAuthHeaders(token),
  });
  if (!response.ok) return handleResponse(response);
  return true;
}

// --- Colaboradores ---

export async function createColaborador(dados, token) {
  const response = await fetch(`${API_URL}/colaboradores`, {
    method: "POST",
    headers: buildAuthHeaders(token),
    body: JSON.stringify(dados),
  });
  return handleResponse(response);
}

export async function updateColaborador(id, dados, token) {
  const response = await fetch(`${API_URL}/colaboradores/${id}`, {
    method: "PUT",
    headers: buildAuthHeaders(token),
    body: JSON.stringify(dados),
  });
  if (!response.ok) return handleResponse(response);
  return true;
}

export async function deleteColaborador(id, token) {
  const response = await fetch(`${API_URL}/colaboradores/${id}`, {
    method: "DELETE",
    headers: buildAuthHeaders(token),
  });
  if (!response.ok) return handleResponse(response);
  return true;
}