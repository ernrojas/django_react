import React, { createContext, useState, useEffect, useCallback } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Usamos useCallback para evitar recreaciones innecesarias
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      api.get("usuarios/me/")
        .then(response => {
          setUser(response.data); // ✅ Guardar el usuario en el estado global
          setLoading(false); // ✅ Ya terminó de cargar
        })
        .catch((error) => {
          console.error("Error al obtener usuario:", error.response?.status);
          if (error.response?.status === 401) {
            logout(); // ✅ Solo desloguear si el token es inválido
          } else {
            setLoading(false); // ✅ No bloquear la app si hay otro error
          }
        });
    } else {
      setLoading(false); // ✅ No bloquear la carga si no hay token
    }
  }, [logout]);

  const login = async (username, password) => {
    try {
      const response = await api.post("token/", { username, password });

      localStorage.setItem("token", response.data.access);
      setUser(response.data); // ✅ Guardar el usuario en el estado
      navigate("/");
      return true;
    } catch (error) {
      console.error("Error en el login:", error.response?.data);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
