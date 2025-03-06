// src/scenes/global/Layout.jsx

import { useState, useEffect } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "../../components/Footer"; // Opcional

const Layout = () => {
  const theme = useTheme();

  // Detectar breakpoints
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));     // >= 1200px
  const isTabletScreen = useMediaQuery(theme.breakpoints.between("md", "lg")); // [900, 1200)
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));   // <= 600px

  // Estados del sidebar
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Ajuste del sidebar según breakpoints
  useEffect(() => {
    if (isLargeScreen) {
      setShowSidebar(true);
      setIsCollapsed(false);
    } else if (isTabletScreen) {
      setShowSidebar(true);
      setIsCollapsed(true);
    } else if (isSmallScreen) {
      setShowSidebar(false);
      setIsCollapsed(true);
    } else {
      // Rango 600px - 900px
      setShowSidebar(true);
      setIsCollapsed(true);
    }
  }, [isLargeScreen, isTabletScreen, isSmallScreen]);

  /**
   * handleToggleSidebar:
   * - En pantallas grandes/medianas: alterna colapsar/expandir.
   * - En pantallas pequeñas: si está oculto, lo muestra expandido; si está visible, lo oculta.
   */
  const handleToggleSidebar = () => {
    if (isSmallScreen) {
      if (!showSidebar) {
        setShowSidebar(true);
        setIsCollapsed(false);
      } else {
        setShowSidebar(false);
      }
    } else {
      setShowSidebar(true);
      setIsCollapsed(!isCollapsed);
    }
  };

  // Offset izquierdo según visibilidad/colapso
  const offsetLeft = !showSidebar ? 0 : isCollapsed ? 80 : 250;

  return (
    <Box display="flex" minHeight="100vh" /* <-- clave para footer fijo abajo */>
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        showSidebar={showSidebar}
        onToggleSidebar={handleToggleSidebar}
      />

      {/* Contenedor principal con offset */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${offsetLeft}px`,
          transition: "margin-left 0.3s ease",
          display: "flex",          // Flex para acomodar contenido + footer
          flexDirection: "column",  // Para apilar contenido y footer verticalmente
        }}
      >
        {/* Contenido principal (Topbar + páginas) */}
        <Box sx={{ p: "20px", flex: "1 0 auto" }}>
          <Topbar />
          <Outlet />
        </Box>

        {/* Footer (queda al final) */}
        <Footer /> 
      </Box>
    </Box>
  );
};

export default Layout;
