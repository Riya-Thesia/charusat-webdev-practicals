const BASE_URL = 'http://localhost:5000/api';

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
};

export const getTasks = () => fetchWithAuth(`${BASE_URL}/tasks`);

export const getTaskById = (id) => fetchWithAuth(`${BASE_URL}/tasks/${id}`);

export const createTask = (taskData) =>
  fetchWithAuth(`${BASE_URL}/tasks`, {
    method: 'POST',
    body: JSON.stringify(taskData)
  });

export const updateTask = (id, taskData) =>
  fetchWithAuth(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(taskData)
  });

export const deleteTask = (id) =>
  fetchWithAuth(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE'
  });

export const loginUser = (credentials) =>
  fetchWithAuth(`${BASE_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(credentials)
  });

export const registerUser = (userData) =>
  fetchWithAuth(`${BASE_URL}/auth/register`, {
    method: 'POST',
    body: JSON.stringify(userData)
  });

export const getMe = () => fetchWithAuth(`${BASE_URL}/auth/me`);
