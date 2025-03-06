// src/App.js

import { useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./pages/Login";

// Importa tus páginas
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Users from "./scenes/users";
import Geography from "./scenes/geography";
import Calendar from "./scenes/calendar/calendar";

// Importa tu Layout
import Layout from "./scenes/global/Layout";

function App() {
  const [theme, colorMode] = useMode();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <AuthProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          {isLoginPage ? (
            // Si la ruta es "/login", renderiza la pantalla de Login sin Layout
            <Login />
          ) : (
            // Si NO es "/login", renderiza el Layout que contiene sidebar, topbar, etc.
            <Routes>
              {/* Layout "envolvente" para todas las rutas hijas */}
              <Route path="/" element={<Layout />}>
                {/* Ejemplo de rutas protegidas */}
                <Route element={<ProtectedRoute />}>
                  <Route index element={<Dashboard />} />
                  <Route path="calendar" element={<Calendar />} />
                  <Route path="faq" element={<FAQ />} />
                </Route>

                <Route
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        "Admin",
                        "Super Admin",
                        "Gerente",
                        "Programador",
                        "Supervisor",
                      ]}
                    />
                  }
                >
                  <Route path="team" element={<Team />} />
                  <Route path="contacts" element={<Contacts />} />
                  <Route path="invoices" element={<Invoices />} />
                  <Route path="bar" element={<Bar />} />
                  <Route path="pie" element={<Pie />} />
                  <Route path="line" element={<Line />} />
                  <Route path="geography" element={<Geography />} />
                </Route>

                <Route
                  element={<ProtectedRoute allowedRoles={["Admin", "Super Admin"]} />}
                >
                  <Route path="users" element={<Users />} />
                  <Route path="form" element={<Form />} />
                </Route>
              </Route>
            </Routes>
          )}
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AuthProvider>
  );
}

export default App;
