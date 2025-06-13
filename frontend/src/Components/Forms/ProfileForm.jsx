import {
  Grid,
  TextField,
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  getOneUserRequest
} from "../../api/userRequest";
import {
  updateAccountUser
} from "../../api/accountRequest";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function ProfileForm({ isEditing = false, datos = [], onClose }) {
  const { handleSubmit, register, reset, setValue, control } = useForm();
  const [passwordChange, setPasswordChange] = useState(false);
  const dni = datos.userId;
  const { toast, setUser,loadUserProfile } = useAuth();
  // dentro del componente:
const [showPassword, setShowPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetForm = () => {
    reset();
  };

  const submitForm = (data) => {
    // Validación de contraseñas
    if (passwordChange) {
      if (data.newPassword !== data.confirmPassword) {
        toast({
          info: {
            description: "Las contraseñas no coinciden",
          },
        });
        return;
      }
    }

    const formData = {
      ...(passwordChange && {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }),
    };

    toast({
      promise: updateAccountUser(datos.accountId, datos.userId, datos.rolId, formData),
      successMessage: "Cuenta actualizada con éxito",
      onSuccess: async(response) => {
        const userResponse = response.data.data;
        await loadUserProfile();
     
        if (onClose) onClose();
        resetForm();
      },
      onError: (error) => {
        return {
          title: "Error al editar",
          description: error?.response?.data?.message || "Algo salió mal",
        };
      },
    });
  };

  const loadUser = async () => {
    if (isEditing) {
      const { data } = await getOneUserRequest(datos.userId);
      const users = data;
      delete users.id;
      Object.keys(users).forEach((key) => {
        setValue(key, users[key]);
      });
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit(submitForm)}>
      <Grid spacing={2} container sx={{ justifyContent: "center" }}>
        <Grid item xs={12}>
          <TextField
            label="Cédula"
            fullWidth
            disabled
            variant="standard"
            {...register("ci", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Primer nombre"
            disabled
            fullWidth
            variant="standard"
            {...register("firstName")}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Segundo nombre"
            disabled
            variant="standard"
            fullWidth
            {...register("secondName")}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Primer apellido"
            disabled
            variant="standard"
            fullWidth
            {...register("firstLastName")}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Segundo apellido"
            disabled
            variant="standard"
            fullWidth
            {...register("secondLastName")}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="sex-select-label">Sexo</InputLabel>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  labelId="sex-select-label"
                  label="Sexo"
                  disabled
                  {...field}
                >
                  <MenuItem value="M">Masculino</MenuItem>
                  <MenuItem value="F">Femenino</MenuItem>
                  <MenuItem value="otro">Otro</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="birthday"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Fecha de nacimiento"
                  disabled
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date.toISOString())}
                  renderInput={(params) => <TextField {...params} />}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>

        {passwordChange ? (
          <>
         <Grid item xs={6}>
  <TextField
    label="Contraseña anterior"
    type={showPassword ? "text" : "password"}
    variant="standard"
    fullWidth
    {...register("oldPassword", { required: true })}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
</Grid>

<Grid item xs={6}>
  <TextField
    label="Nueva contraseña"
    type={showNewPassword ? "text" : "password"}
    variant="standard"
    fullWidth
    {...register("newPassword", { required: true })}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
            {showNewPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
</Grid>

<Grid item xs={12}>
  <TextField
    label="Confirmar nueva contraseña"
    type={showConfirmPassword ? "text" : "password"}
    variant="standard"
    fullWidth
    {...register("confirmPassword", { required: true })}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
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

        <Grid item xs={4}>
          <Button variant="contained" fullWidth type="submit">
            Guardar Datos
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProfileForm;
