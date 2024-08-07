// src/lib/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api", // Base URL comum para todas as requisições
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
