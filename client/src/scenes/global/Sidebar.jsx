// src/scenes/global/Sidebar.jsx

import { useContext, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import { AuthContext } from "../../AuthContext";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import userPlaceholder from "../../assets/user_placeholder.png";
import useMediaQuery from "@mui/material/useMediaQuery";

// Componente para un ítem de menú
const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = ({ isCollapsed, showSidebar, onToggleSidebar }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useContext(AuthContext);

  // Detectar si estamos en pantalla pequeña, para mostrar el botón hamburguesa flotante
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Estado local para el item seleccionado
  const [selected, setSelected] = useState("Dashboard"); // Si deseas mantenerlo local

  // Botón hamburguesa flotante (solo se muestra si sidebar está oculto y es pantalla pequeña)
  const FloatingHamburgerButton = () => (
    <IconButton
      onClick={onToggleSidebar}
      sx={{
        position: "fixed",
        top: 10,
        left: 10,
        zIndex: 9999,
        backgroundColor: colors.primary[400],
        color: colors.grey[100],
        "&:hover": {
          backgroundColor: colors.primary[300],
        },
      }}
    >
      <MenuOutlinedIcon />
    </IconButton>
  );

  return (
    <>
      {/* Si la sidebar está oculta y estamos en móvil, muestra botón hamburguesa */}
      {!showSidebar && isSmallScreen && <FloatingHamburgerButton />}

      {/* Contenedor FIJO para la sidebar */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          display: showSidebar ? "block" : "none",
          width: isCollapsed ? "80px" : "250px",
          backgroundColor: colors.primary[400],
          zIndex: 9998,
          overflowY: "auto", // Scroll interno si excede la pantalla
          "& .pro-sidebar": {
            position: "static !important", // Evitar position absolute
            backgroundColor: "transparent !important",
          },
          "& .pro-sidebar-inner": {
            backgroundColor: "transparent !important",
          },
          "& .pro-icon-wrapper": {
            backgroundColor: "transparent !important",
          },
          "& .pro-inner-item": {
            padding: "5px 35px 5px 20px !important",
          },
          "& .pro-inner-item:hover": {
            color: "#868dfb !important",
          },
          "& .pro-menu-item.active": {
            color: "#6870fa !important",
          },
        }}
      >
        <ProSidebar collapsed={isCollapsed}>
          <Menu iconShape="square">
            {/* Encabezado con ícono hamburguesa */}
            <MenuItem
              onClick={onToggleSidebar}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
              style={{ margin: "10px 0 20px 0", color: colors.grey[100] }}
            >
              {/* Si no está colapsado, muestra el título y otro ícono para toggle */}
              {!isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  ml="15px"
                >
                  <Typography variant="h3" color={colors.grey[100]}>
                    ADMINIS
                  </Typography>
                  <IconButton onClick={onToggleSidebar}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </MenuItem>

            {/* DATOS DEL USUARIO (sólo si no está colapsado) */}
            {!isCollapsed && (
              <Box mb="25px">
                <Box display="flex" justifyContent="center" alignItems="center">
                  <img
                    alt="profile-user"
                    width="100px"
                    height="100px"
                    src={userPlaceholder}
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  />
                </Box>
                <Box textAlign="center">
                  <Typography
                    variant="h2"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{ m: "10px 0 0 0" }}
                  >
                    {user ? `${user.first_name} ${user.last_name}` : "Cargando..."}
                  </Typography>
                  <Typography variant="h5" color={colors.greenAccent[500]}>
                    {user?.rol_usuario || "Sin Rol"}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* MENÚ DE NAVEGACIÓN */}
            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              <Item
                title="Dashboard"
                to="/"
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              {/* 🔐 Mostrar solo si el usuario NO es "Operador" */}
              {/* 🔐 No mostrar si el usuario SÍ es "Operador" */}
              {user?.rol_usuario !== "Operador" && (
                <>
                  <Typography
                    variant="h6"
                    color={colors.grey[300]}
                    sx={{ m: "15px 0 5px 20px" }}
                  >
                    Data
                  </Typography>
                  <Item
                    title="Usuarios"
                    to="/users"
                    icon={<PeopleOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Manage Team"
                    to="/team"
                    icon={<PeopleOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Contacts Information"
                    to="/contacts"
                    icon={<ContactsOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Invoices Balances"
                    to="/invoices"
                    icon={<ReceiptOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />

                  <Typography
                    variant="h6"
                    color={colors.grey[300]}
                    sx={{ m: "15px 0 5px 20px" }}
                  >
                    Charts
                  </Typography>
                  <Item
                    title="Bar Chart"
                    to="/bar"
                    icon={<BarChartOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Pie Chart"
                    to="/pie"
                    icon={<PieChartOutlineOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Line Chart"
                    to="/line"
                    icon={<TimelineOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Geography Chart"
                    to="/geography"
                    icon={<MapOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </>
              )}

              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Pages
              </Typography>              
              <Item
                title="Profile Form"
                to="/form"
                icon={<PersonOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Calendar"
                to="/calendar"
                icon={<CalendarTodayOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="FAQ Page"
                to="/faq"
                icon={<HelpOutlineOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          </Menu>
        </ProSidebar>
      </Box>
    </>
  );
};

export default Sidebar;
