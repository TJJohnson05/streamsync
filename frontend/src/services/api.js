// src/services/api.js

// Change this to your backend VM IP + port in production:
// e.g. "http://192.168.10.20:4000"
const API_URL = process.env.REACT_APP_API_URL || "http://192.168.10.20:4000";

// Helper: get auth headers with token
function getAuthHeaders(extra = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...extra,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// Helper: handle non-OK responses consistently
async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data.message || "Request failed";
    throw new Error(message);
  }
  return data;
}

/* ========== AUTH ========== */

export async function registerUser({ username, email, password }) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ username, email, password }),
  });
  return handleResponse(res); // { message: "...", user? }
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse(res); // { token, user }
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  return data;
}

export function logoutUser() {
  localStorage.removeItem("token");
}

export async function fetchCurrentUser() {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res); // { user }
}

/* ========== STREAMS ========== */

export async function fetchRecommendedStreams() {
  const res = await fetch(`${API_URL}/api/streams/recommended`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res); // { streams: [...] }
}

export async function searchStreams(query) {
  const params = new URLSearchParams({ q: query });
  const res = await fetch(`${API_URL}/api/streams/search?` + params.toString(), {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res); // { streams: [...] }
}

export async function fetchStreamById(id) {
  const res = await fetch(`${API_URL}/api/streams/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res); // { stream }
}

/* ========== HISTORY ========== */

export async function fetchHistory() {
  const res = await fetch(`${API_URL}/api/history`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res); // { history: [...] }
}

export async function addHistoryEntry(streamId) {
  const res = await fetch(`${API_URL}/api/history`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ streamId }),
  });
  return handleResponse(res); // { historyItem }
}

export async function clearHistory() {
  const res = await fetch(`${API_URL}/api/history`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(res); // { message }
}

/* ========== FAVORITES ========== */

export async function fetchFavorites() {
  const res = await fetch(`${API_URL}/api/favorites`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res); // { favorites: [...] }
}

export async function addFavorite(streamId) {
  const res = await fetch(`${API_URL}/api/favorites/${streamId}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return handleResponse(res); // { message, favorites }
}

export async function removeFavorite(streamId) {
  const res = await fetch(`${API_URL}/api/favorites/${streamId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(res); // { message, favorites }
}
