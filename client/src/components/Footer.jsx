import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import controlaLogo from "../assets/logo_footer.png"; // ✅ Importamos la imagen del logo

const Footer = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const currentYear = new Date().getFullYear(); // ✅ Obtener el año dinámicamente

  return (
    <Box
      sx={{
        backgroundColor: colors.primary[400], // ✅ Se adapta al tema claro/oscuro
        color: colors.grey[100],
        textAlign: "center",
        p: 2,
        mt: "auto", // ✅ Para que siempre esté en la parte inferior
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="body2">
        © {currentYear} Empresa S.A de C.V, Todos los derechos reservados.
      </Typography>

      {/* Logo */}
      <img
        src={controlaLogo}
        alt="Controla Digital Services"
        style={{ height: "40px" }} // ✅ Tamaño ajustable según diseño
      />
    </Box>
  );
};

export default Footer;
