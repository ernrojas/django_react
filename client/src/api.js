import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";

// Obtener el token almacenado en localStorage
//const getToken = () => localStorage.getItem("token");

// Configurar Axios con el token JWT
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Agregar el token en cada solicitud
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
