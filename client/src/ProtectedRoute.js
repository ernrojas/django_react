import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Cargando...</div>; // 🔄 Esperar a que cargue la autenticación

  if (!user) {
    return <Navigate to="/login" replace />; // 🔒 Redirigir a login si no hay usuario autenticado
  }

  // ✅ Evitar bucles de redirección innecesarios
  if (allowedRoles && !allowedRoles.includes(user.rol_usuario)) {
    return <Navigate to="/" replace />; // 🔒 Si el rol no está permitido, redirigir a Dashboard
  }

  return <Outlet />;
};

export default ProtectedRoute;
