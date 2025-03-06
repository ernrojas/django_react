import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { styled } from "@mui/system";
import logo from "../assets/logo_login.png"; // Ruta del logo

const LoginContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  backgroundColor: "#1E1E2F",
});

const FormContainer = styled(Paper)({
  padding: "40px",
  width: "400px",
  textAlign: "center",
  borderRadius: "10px",
  backgroundColor: "#282A36",
  color: "white",
});

const Logo = styled("img")({
  width: "150px",
  marginBottom: "20px",
});

const Login = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(username, password);

    if (success) {
      navigate("/");
    } else {
      setError("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <LoginContainer>
      <FormContainer elevation={5}>
        <Logo src={logo} alt="IMOEE Logo" />
        <Typography variant="h5" gutterBottom>
          Iniciar Sesión
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            variant="outlined"
            label="Usuario"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "white" } }}
          />
          <TextField
            fullWidth
            variant="outlined"
            type="password"
            label="Contraseña"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "white" } }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: "20px" }}
          >
            Ingresar
          </Button>
        </form>
      </FormContainer>
    </LoginContainer>
  );
};

export default Login;
