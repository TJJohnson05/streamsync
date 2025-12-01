import axios from "axios";

// Use environment variable for flexibility
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://<backend-vm-ip>:3000/api",
});

// Auth routes
export const registerUser = (userData) => API.post("/auth/register", userData);
export const loginUser = (userData) => API.post("/auth/login", userData);

// Optional: add a default token handler (for logged-in users)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;


