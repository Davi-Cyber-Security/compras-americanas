import API_URL from '../config/api';

async function request(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}api${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Erro na requisição.');
  }

  return data;
}

export const api = {
  get: (endpoint: string) => request(endpoint),
  post: (endpoint: string, body: unknown) =>
    request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint: string, body: unknown) =>
    request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint: string) => request(endpoint, { method: 'DELETE' }),
};
