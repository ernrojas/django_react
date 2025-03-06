// src/scenes/users/index.jsx

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
// import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import api from "../../api";
import { Formik } from "formik";
import * as yup from "yup";

// =====================
//   Yup Validation
// =====================
const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const validationSchema = yup.object().shape({
  username: yup.string().required("Campo requerido"),
  first_name: yup.string().required("Campo requerido"),
  last_name: yup.string().required("Campo requerido"),
  email: yup.string().email("Correo inválido").required("Campo requerido"),
  telefono: yup
    .string()
    .matches(phoneRegExp, "Teléfono no válido")
    .required("Campo requerido"),
  direccion: yup.string().required("Campo requerido"),
  // Ahora 'departamento' se espera como un id (string o número)
  departamento: yup
  .number()
  .transform((value, originalValue) =>
    originalValue === "" ? undefined : Number(originalValue)
  )
  .required("Campo requerido"),
  rol_usuario: yup.string().required("Campo requerido"),
  asignar_linea: yup.array().when("rol_usuario", {
    is: "Operador",
    then: yup
      .array()
      .min(1, "Selecciona al menos una línea")
      .required("Campo requerido"),
    otherwise: yup.array().notRequired(),
  }),
});

// =====================
//   Helper para inicializar valores
// =====================
const getInitialValues = (editingUser) => {
  if (!editingUser) {
    return {
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      telefono: "",
      direccion: "",
      departamento: "",
      rol_usuario: "",
      asignar_linea: [],
    };
  }

  // Caso 1: 'departamento' viene como un string (ej: "1")
  // Caso 2: 'departamento' viene como objeto (ej: {id: 1, nombre: "Producción"})
  // En tu caso actual, es un string => "1"

  let deptValue = "";
  if (typeof editingUser.departamento === "number") {
    // Caso 1: viene como entero
    deptValue = editingUser.departamento;
  } else if (typeof editingUser.departamento === "string") {
    // Caso 2: viene como string, ej: "2"
    deptValue = parseInt(editingUser.departamento, 10);
  } else if (
    editingUser.departamento &&
    typeof editingUser.departamento === "object"
  ) {
    // Caso 3: viene como objeto, ej: { id: 2, nombre: "Producción" }
    deptValue = editingUser.departamento.id;
  }

  return {
    username: editingUser.username || "",
    first_name: editingUser.first_name || "",
    last_name: editingUser.last_name || "",
    email: editingUser.email || "",
    telefono: editingUser.telefono || "",
    direccion: editingUser.direccion || "",
    departamento: deptValue,
    rol_usuario: editingUser.rol_usuario || "",
    asignar_linea: editingUser.asignar_linea || [],
  };
};


const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // Estados para CRUD
  const [users, setUsers] = useState([]);
  const [lines, setLines] = useState([]);
  // Nuevo estado para departamentos obtenidos de la BD
  const [departments, setDepartments] = useState([]);
  const [open, setOpen] = useState(false); // modal crear/editar
  const [editingUser, setEditingUser] = useState(null);

  // Estados para modal de detalle (solo lectura)
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUser, setDetailUser] = useState(null);

  // Catálogos locales para roles (se mantienen igual)
  const roles = [
    "Super Admin",
    "Gerente",
    "Programador",
    "Supervisor",
    "Operador",
    "Admin",
  ];

  // =====================
  //   Carga de datos
  // =====================
  useEffect(() => {
    fetchUsers();
    fetchLines();
    fetchDepartments(); // Obtener departamentos de la nueva app
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("usuarios/usuarios/");
      setUsers(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const fetchLines = async () => {
    try {
      const response = await api.get("conf_adm_lineas/lineas/");
      setLines(response.data);
    } catch (error) {
      console.error("Error al obtener líneas de producción:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get("departamentos/");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error al obtener departamentos:", error);
    }
  };

  // =====================
  //   Manejo modal
  // =====================
  // Modal crear/editar
  const handleOpen = (user = null) => {
    console.log("handleOpen user:", user); // <-- Aquí
    setEditingUser(user);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setEditingUser(null);
  };

  // Modal detalle (solo lectura)
  const handleOpenDetail = (user) => {
    setDetailUser(user);
    setDetailOpen(true);
  };
  const handleCloseDetail = () => {
    setDetailUser(null);
    setDetailOpen(false);
  };

  // =====================
  //   Guardar y eliminar
  // =====================
  const handleSubmitForm = async (values) => {
    // Forzamos que 'departamento' sea numérico
    const payload = {
      ...values,
      departamento: Number(values.departamento),
    };
  
    try {
      if (editingUser) {
        await api.put(`usuarios/usuarios/${editingUser.id}/`, payload);
      } else {
        await api.post("usuarios/usuarios/", payload);
      }
      fetchUsers();
      handleClose();
      Swal.fire("Éxito", "Usuario guardado correctamente", "success");
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      Swal.fire("Error", "No se pudo guardar el usuario", "error");
    }
  };

  const handleDelete = async (row) => {
    const { id, username } = row;
    Swal.fire({
      title: `¿Eliminar a ${username}?`,
      text: "No podrás revertir esto.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f44336",
      cancelButtonColor: "#3e4396",
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`usuarios/usuarios/${id}/`);
          fetchUsers();
          Swal.fire("Eliminado", `${username} ha sido eliminado.`, "success");
        } catch (error) {
          console.error("Error al eliminar usuario:", error);
          Swal.fire("Error", "No se pudo eliminar el usuario", "error");
        }
      }
    });
  };

  // =====================
  //   Columnas DataGrid
  // =====================
  const columns = [
    { field: "id", headerName: "ID", width: 60 },
    {
      field: "nombreCompleto",
      headerName: "Nombre Completo",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const fullName = `${params.row.first_name} ${params.row.last_name}`;
        return (
          <Typography
            sx={{
              color: "#66bb6a",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => handleOpenDetail(params.row)}
          >
            {fullName}
          </Typography>
        );
      },
    },
    {
      field: "username",
      headerName: "Usuario",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "email",
      headerName: "Correo",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "telefono",
      headerName: "Teléfono",
      flex: 1,
    },
    {
      field: "direccion",
      headerName: "Dirección",
      flex: 1,
    },
    {
      field: "departamento",
      headerName: "Departamento",
      flex: 1,
      renderCell: (params) => 
        params.row.departamento_obj
          ? params.row.departamento_obj.nombre
          : "",
    },
    {
      field: "rol_usuario",
      headerName: "Rol",
      flex: 1,
    },
    {
      field: "asignar_linea_nombres",
      headerName: "Líneas Asignadas",
      flex: 1,
      renderCell: (params) => {
        if (!params.value) return "";
        return params.value.join(", ");
      },
    },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,
      minWidth: 220,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            onClick={() => handleOpen(params.row)}
            sx={{
              marginRight: 1,
              backgroundColor: colors.blueAccent[700],
              "&:hover": {
                backgroundColor: colors.blueAccent[600],
              },
            }}
          >
            Editar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete(params.row)}
          >
            Eliminar
          </Button>
        </Box>
      ),
    },
  ];

  // =====================
  //   Render principal
  // =====================
  return (
    <Box p="20px" sx={{ width: "100%" }}>
      <Header title="USUARIOS" subtitle="Gestión de usuarios del sistema" />

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpen()}
        sx={{
          marginBottom: "20px",
          backgroundColor: colors.greenAccent[700],
        }}
      >
        Crear Usuario
      </Button>

      <Box sx={{ width: "100%", overflowX: "auto", mb: 2 }}>
        <Box
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              borderRadius: "8px",
              overflow: "hidden",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
              color: colors.grey[100],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
            },
          }}
        >
          <DataGrid
            rows={users}
            columns={columns}
            getRowId={(row) => row.id}
            pageSize={10}
            checkboxSelection
            disableSelectionOnClick
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
                csvOptions: { disableToolbarButton: false },
              },
            }}
            autoHeight
          />
        </Box>
      </Box>

      {/* Modal para Crear/Editar Usuario */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: {
              xs: "90%",
              sm: 600,
            },
            maxWidth: "600px",
            bgcolor:
              theme.palette.mode === "dark"
                ? colors.primary[400]
                : "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            {editingUser ? "Editar Usuario" : "Crear Usuario"}
          </Typography>

          <Formik
            initialValues={getInitialValues(editingUser)}
            validationSchema={validationSchema}
            onSubmit={handleSubmitForm}
            enableReinitialize
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              setFieldTouched,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  display="grid"
                  gap="20px"
                  gridTemplateColumns={{
                    xs: "1fr",
                    sm: "1fr 1fr",
                  }}
                >
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Usuario"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.username && !!errors.username}
                    helperText={touched.username && errors.username}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Nombre"
                    name="first_name"
                    value={values.first_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.first_name && !!errors.first_name}
                    helperText={touched.first_name && errors.first_name}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Apellido"
                    name="last_name"
                    value={values.last_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.last_name && !!errors.last_name}
                    helperText={touched.last_name && errors.last_name}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Correo"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Teléfono"
                    name="telefono"
                    value={values.telefono}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.telefono && !!errors.telefono}
                    helperText={touched.telefono && errors.telefono}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Dirección"
                    name="direccion"
                    value={values.direccion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.direccion && !!errors.direccion}
                    helperText={touched.direccion && errors.direccion}
                  />

                  {/* Campo Departamento: ahora se usa un select basado en la tabla departamentos */}
                  <FormControl fullWidth variant="filled">
                    <InputLabel id="departamento-label">
                      Departamento
                    </InputLabel>
                    <Select
                      labelId="departamento-label"
                      name="departamento"
                      value={values.departamento}
                      label="Departamento"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.departamento && !!errors.departamento}
                    >
                      {departments.map((dep) => (
                        <MenuItem key={dep.id} value={dep.id}>
                          {dep.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.departamento && errors.departamento && (
                      <Typography color="error" variant="caption">
                        {errors.departamento}
                      </Typography>
                    )}
                  </FormControl>

                  <FormControl fullWidth variant="filled">
                    <InputLabel id="rol-label">Rol</InputLabel>
                    <Select
                      labelId="rol-label"
                      name="rol_usuario"
                      value={values.rol_usuario}
                      label="Rol"
                      onChange={(e) => {
                        handleChange(e);
                        // Si el rol cambiado ya no es "Operador", borramos la asignación de líneas.
                        if (e.target.value !== "Operador") {
                          setFieldValue("asignar_linea", []);
                        }
                      }}
                      onBlur={handleBlur}
                      error={touched.rol_usuario && !!errors.rol_usuario}
                    >
                      {roles.map((rol) => (
                        <MenuItem key={rol} value={rol}>
                          {rol}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.rol_usuario && errors.rol_usuario && (
                      <Typography color="error" variant="caption">
                        {errors.rol_usuario}
                      </Typography>
                    )}
                  </FormControl>

                  {values.rol_usuario === "Operador" ? (
                    <FormControl
                      fullWidth
                      variant="filled"
                      sx={{ gridColumn: "span 2" }}
                    >
                      <InputLabel id="lineas-label">
                        Líneas Asignadas
                      </InputLabel>
                      <Select
                        labelId="lineas-label"
                        name="asignar_linea"
                        multiple
                        value={values.asignar_linea}
                        onChange={(event) =>
                          setFieldValue("asignar_linea", event.target.value)
                        }
                        onBlur={() =>
                          setFieldTouched("asignar_linea", true)
                        }
                        label="Líneas Asignadas"
                        error={
                          touched.asignar_linea &&
                          !!errors.asignar_linea
                        }
                      >
                        {lines.map((line) => (
                          <MenuItem key={line.id} value={line.id}>
                            {line.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.asignar_linea && errors.asignar_linea && (
                        <Typography color="error" variant="caption">
                          {errors.asignar_linea}
                        </Typography>
                      )}
                    </FormControl>
                  ) : (
                    <TextField
                      fullWidth
                      variant="filled"
                      label="Líneas Asignadas"
                      value="No aplica"
                      InputProps={{ readOnly: true }}
                      sx={{ gridColumn: "span 2" }}
                    />
                  )}
                </Box>

                {/* Botones */}
                <Box
                  mt={2}
                  display="flex"
                  justifyContent="space-between"
                >
                  <Button
                    variant="outlined"
                    onClick={handleClose}
                    sx={{ color: colors.grey[100] }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    sx={{
                      color:
                        theme.palette.mode === "dark"
                          ? colors.grey[100]
                          : "background.paper",
                    }}
                  >
                    Guardar
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </Modal>

      {/* Modal para VER Usuario (solo lectura) */}
      <Modal open={detailOpen} onClose={handleCloseDetail}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: {
              xs: "90%",
              sm: 500,
            },
            maxWidth: "500px",
            bgcolor:
              theme.palette.mode === "dark"
                ? colors.primary[400]
                : "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            Información del Usuario
          </Typography>
          {detailUser && (
            <>
              <Typography>
                <strong>Nombre:</strong> {detailUser.first_name}{" "}
                {detailUser.last_name}
              </Typography>
              <Typography>
                <strong>Usuario:</strong> {detailUser.username}
              </Typography>
              <Typography>
                <strong>Correo:</strong> {detailUser.email}
              </Typography>
              <Typography>
                <strong>Teléfono:</strong> {detailUser.telefono}
              </Typography>
              <Typography>
                <strong>Dirección:</strong> {detailUser.direccion}
              </Typography>
              <Typography>
                <strong>Departamento:</strong>{" "}
                {detailUser.departamento
                  ? detailUser.departamento.nombre
                  : ""}
              </Typography>
              <Typography>
                <strong>Rol:</strong> {detailUser.rol_usuario}
              </Typography>
            </>
          )}
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleCloseDetail}>
              Cerrar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Users;
