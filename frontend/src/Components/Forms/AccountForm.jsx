import {
  Grid,
  TextField,
  Box,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  addAccountRequest,
  updateAccountRequest,
} from "../../api/accountRequest";
import { getUsersRequest } from "../../api/userRequest";
import TablePro from "../Tables/TablePro";
import SelectDataRoles from "../Selects/SelectDataRoles";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import { useAuth } from "../../context/AuthContext";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";


function AccountForm({ isEditing = false, datos = [], onClose, reload }) {
  const { handleSubmit, register, reset, setValue } = useForm();
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState();
  const [passwordChange, setPasswordChange] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const dni = datos.userId;
  const { toast } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  

  const resetForm = () => {
    reset();
    setSelectedRoles([]);
    setUser(null);
    setPasswordChange(false);
  };

  const fetchUsers = async () => {
    const { data } = await getUsersRequest();
    setUsers(data);
  };

  const submitForm = (data) => {
    if (!isEditing) {
      if (!user) {
        toast({ info: { description: "Seleccione por favor un Usuario" } });
        return;
      }
      if (data.newPassword !== data.confirmPassword) {
        toast({ info: { description: "Las contraseñas no coinciden" } });
        return;
      }
      if (!selectedRoles.length) {
        toast({ info: { description: "Seleccione al menos un Rol por favor" } });
        return;
      }
    } else if (passwordChange) {
      if (!data.newPassword || !data.confirmPassword) {
        toast({ info: { description: "Complete todos los campos de contraseña" } });
        return;
      }
      if (data.newPassword !== data.confirmPassword) {
        toast({ info: { description: "Las nuevas contraseñas no coinciden" } });
        return;
      }
    }

    const formData = {
      ...data,
      userId: user?.id,
      roles: selectedRoles
    };

    if (isEditing) {
      toast({
        promise: updateAccountRequest(datos.id, formData),
        successMessage: "Cuenta editada con éxito",
        onSuccess: () => {
          if (onClose) onClose();
          if (reload) reload();
          resetForm();
        },
        onError: (error) => ({
          title: "Error al editar",
          description: error.response.data.message
        })
      });
    } else {
      toast({
        promise: addAccountRequest(formData),
        successMessage: "Cuenta guardada con éxito",
        onSuccess: () => {
          if (onClose) onClose();
          if (reload) reload();
          resetForm();
        }
      });
    }
  };

  const loadUser = async () => {
    if (isEditing && datos) {
      setSelectedRoles(datos.roles.map(r => r.id));
      const keys = Object.keys(datos);
      keys.forEach(key => setValue(key, datos[key]));
    }
  };

  const userColumns = [
    { id: "ci", label: "Cédula", getSortValue: (r) => (r.ci || "").toLowerCase() },
    {
      id: "fullName",
      label: "Nombres y Apellidos",
      getSearchValue: (r) =>
        [r.firstName, r.firstLastName, r.secondName, r.secondLastName].filter(Boolean).join(" "),
      render: (row) =>
        [row.firstName, row.firstLastName, row.secondName, row.secondLastName].filter(Boolean).join(" ") || "—",
    },
    {
      id: "actions",
      label: "Seleccionar",
      render: (row) => (
        <IconButton size="small" onClick={() => setUser(row)} title="Seleccionar usuario">
          <ArrowCircleUpIcon sx={{ fontSize: "2rem" }} />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    loadUser();
    fetchUsers();
  }, []);

  return (
    <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit(submitForm)}>
      <Grid spacing={2} container sx={{ justifyContent: "center" }}>
        <Grid item xs={6}>
          <TextField
            label="Nombre de la Cuenta"
            fullWidth
            variant="standard"
            {...register("username", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>

        <Grid item xs={6}>
          <SelectDataRoles
            value={selectedRoles}
            onChange={setSelectedRoles}
            multiple
          />
        </Grid>

        {!isEditing ? (
  <>
<Grid item xs={6}>
  <TextField
    label="Contraseña"
    type={showPassword ? "text" : "password"}
    variant="standard"
    fullWidth
    {...register("newPassword", { required: true })}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            onClick={() => setShowPassword((prev) => !prev)}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
</Grid>

<Grid item xs={6}>
  <TextField
    label="Confirmar Contraseña"
    type={showConfirmPassword ? "text" : "password"}
    variant="standard"
    fullWidth
    {...register("confirmPassword", { required: true })}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            edge="end"
          >
            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
</Grid>

  </>
) : passwordChange ? (
  <>
    {/* Si en el futuro diferenciarás entre usuario autenticado vs admin, aquí puedes usar un flag extra */}
    <Grid item xs={6}>
  <TextField
    label="Nueva Contraseña"
    type={showPassword ? "text" : "password"}
    variant="standard"
    fullWidth
    {...register("newPassword", { required: true })}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            onClick={() => setShowPassword((prev) => !prev)}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
</Grid>

<Grid item xs={6}>
  <TextField
    label="Confirmar Nueva Contraseña"
    type={showConfirmPassword ? "text" : "password"}
    variant="standard"
    fullWidth
    {...register("confirmPassword", { required: true })}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            edge="end"
          >
            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
</Grid>

  </>
) : (
  <Grid item xs={12}>
    <Button variant="contained" onClick={() => setPasswordChange(true)}>
      Cambiar Contraseña
    </Button>
  </Grid>
)}


        <Grid item xs={8}>
          {!user ? (
            <Typography textAlign="center">
              {!isEditing
                ? "\u00a1Seleccione por favor un Usuario!"
                : "Si desea cambiar la contraseña por favor poner la anterior y después la nueva contraseña"}
            </Typography>
          ) : (
            <Typography textAlign="center">
              {user.firstName} {user.firstLastName} {user.secondName} {user.secondLastName}
            </Typography>
          )}
        </Grid>

        <Grid item xs={4}>
          <Button variant="contained" fullWidth type="submit">
            {!isEditing ? "Guardar" : "Editar"}
          </Button>
        </Grid>

        <Grid item xs={12}>
          {!isEditing && (
            <TablePro
              title="Seleccione por favor un usuario"
              rows={users}
              columns={userColumns}
              showSearch
              showPagination
              showIndex
              indexHeader="#"
              rowsPerPageOptions={[5, 10, 25]}
              defaultRowsPerPage={10}
              tableMaxHeight={280}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default AccountForm;
