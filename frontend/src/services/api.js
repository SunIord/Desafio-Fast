const API_URL = import.meta.env.VITE_API_URL;

async function handleResponse(response) {
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