const API_BASE_URL = 'http://localhost:8000';

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  return response.json();
}

// Generic CRUD operations
async function getAll(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  return handleResponse(response);
}

async function getOne(endpoint, id) {
  const response = await fetch(`${API_BASE_URL}${endpoint}/${id}`);
  return handleResponse(response);
}

async function create(endpoint, data) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

async function update(endpoint, id, data) {
  const response = await fetch(`${API_BASE_URL}${endpoint}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

async function remove(endpoint, id) {
  const response = await fetch(`${API_BASE_URL}${endpoint}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  return { success: true };
}

// Customers API
export const customersAPI = {
  getAll: () => getAll('/api/customers'),
  getOne: (id) => getOne('/api/customers', id),
  create: (data) => create('/api/customers', data),
  update: (id, data) => update('/api/customers', id, data),
  delete: (id) => remove('/api/customers', id),
};

// Vehicles API
export const vehiclesAPI = {
  getAll: () => getAll('/api/vehicles'),
  getOne: (id) => getOne('/api/vehicles', id),
  create: (data) => create('/api/vehicles', data),
  update: (id, data) => update('/api/vehicles', id, data),
  delete: (id) => remove('/api/vehicles', id),
};

// Services API
export const servicesAPI = {
  getAll: () => getAll('/api/services'),
  getOne: (id) => getOne('/api/services', id),
  create: (data) => create('/api/services', data),
  update: (id, data) => update('/api/services', id, data),
  delete: (id) => remove('/api/services', id),
};
