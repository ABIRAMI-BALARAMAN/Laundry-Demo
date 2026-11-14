// Relative URLs work in both places: Vite's proxy in dev,
// and Vercel's routing in production.
const BASE = '/api/todos';

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const getTodos = () => request(BASE);

export const createTodo = (title) =>
  request(BASE, { method: 'POST', body: JSON.stringify({ title }) });

export const updateTodo = (id, changes) =>
  request(`${BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(changes) });

export const deleteTodo = (id) => request(`${BASE}/${id}`, { method: 'DELETE' });
