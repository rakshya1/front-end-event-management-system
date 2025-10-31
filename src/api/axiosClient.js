// src/api/axiosClient.js
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // set to true if using cookies (Laravel Sanctum, etc.)
});

// 🔐 Attach token automatically
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token"); // consistent key name
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ⚠️ Handle unauthorized errors globally
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Unauthorized – redirecting to login...");
      // Optional: Clear token or redirect logic here
      // localStorage.removeItem("auth_token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
