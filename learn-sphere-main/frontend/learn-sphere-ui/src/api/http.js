import axios from "axios";

const API_BASE = "http://localhost:5267/api/";

export const http = axios.create({
  baseURL: API_BASE,
});

// Attach JWT automatically
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
