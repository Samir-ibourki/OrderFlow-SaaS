import axios from "axios";
import { useAuthStore } from "../store/authStore.js";

const API = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses — auto-logout on expired/invalid token
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { logoutStore } = useAuthStore.getState();
      logoutStore();
    }
    return Promise.reject(error);
  }
);

export default API;
