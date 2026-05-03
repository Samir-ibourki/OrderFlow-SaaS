import axios from "axios";
import { useAuthStore } from "../store/authStore.js";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3030/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

