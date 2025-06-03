import { CloudUpload, Save } from "@mui/icons-material";
import {
  Grid,
  TextField,
  Box,
  Button,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  addAccountRequest,
  getOneAccountRequest,
  updateAccountRequest,
  getAccount,
  updateAccountUser
} from "../../api/accountRequest";
import toast from "react-hot-toast";
import DataTable from "../Tables/DataTable";
import { getOneUserRequest, getUsersRequest } from "../../api/userRequest";
import SelectDataRoles from "../Selects/SelectDataRoles";
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { useAuth } from "../../context/AuthContext";

function ProfileForm({ isEditing = false, datos = [], onClose, reload }) {
  const [inputValue, setInputValue] = useState("");
  const { handleSubmit, register, reset, setValue, control, watch } = useForm();
  // const [user, setUser] = useState();
  const [passwordChange, setPasswordChange] = useState(false);
  const dni = datos.userId;
  const { toast,setUser } = useAuth();




  const resetForm = () => {
    setInputValue("");
    reset();
  };

  const fetchUsers = async () => {
    // const { data } = await getUsersRequest();
    // setUsers(data);
  };

  const submitForm = (data) => {
    // Validamos si no hay un usuario seleccionado
   
  
    const formData = { ...data};
    if (isEditing) {
      toast({
        promise:
        updateAccountUser(datos.accountId,datos.userId,datos.rolId, formData),
        successMessage: "Cuenta editada con éxito",
        onSuccess: (data) => {
          const userResponse=data.data.data;
          setUser(userResponse)
          if (onClose) onClose();
          // if (reload) reload();
          resetForm();

        },
        onError: (error) => {
          console.log(error)
          return {
            title: "Error al editar",
            description: error.response.data.message // Puedes usar error.message para el mensaje de error
          };
        }
      });
    } 
  };
  const loadUser = async () => {
    if (isEditing) {
      const { data } = await getOneUserRequest(datos.userId);
      const users = data;
      const keys = Object.keys(users);
      delete users.id;
      keys.forEach((key) => {
        setValue(key, users[key]);
      });
    }
  };


  useEffect(() => {
    loadUser();
    fetchUsers();
  }, []);

  return (
    <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit(submitForm)}>
      <Grid spacing={2} container sx={{ justifyContent: "center" }}>
      <Grid item xs={12}>
          <TextField
            label="Cedula"
            fullWidth
            variant="standard"
            {...register("ci", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Primer nombre"
            fullWidth
            variant="standard"
            {...register("firstName", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Segundo nombre"
            variant="standard"
            fullWidth
            {...register("secondName", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Primer apellido"
            variant="standard"
            fullWidth
            {...register("firstLastName", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Segundo apellido"
            variant="standard"
            fullWidth
            {...register("secondLastName", { required: true })}
            InputLabelProps={dni ? { shrink: true } : {}}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel dni="sex-select">Sexo</InputLabel>
            <Controller
              name="gender"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select labelId="sex-select" label="Sexo" {...field}>
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
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date.toISOString())}
                  renderInput={(params) => <TextField {...params} />}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        {
          passwordChange&&(
            <>
                     <Grid item xs={6}>
            <TextField
              label={!isEditing ? "Contraseña" : "Contraseña Anterior"}
              variant="standard"
              fullWidth
              type={"password"}
              {...register("password", { required: true })}
              InputLabelProps={dni ? { shrink: true } : {}}
            />
          </Grid>
  
          <Grid item xs={6}>
            <TextField
              label={!isEditing ? "Confirmar Contraseña" : "Contraseña Nueva"}
              fullWidth
              variant="standard"
              type={"password"}
              {...register("confirmPassword", { required: true })}
              InputLabelProps={dni ? { shrink: true } : {}}
            />
          </Grid>
            </>
   
          )
        }
        {
          !passwordChange&&(
            <Grid item xs={12}>
            <Button variant="contained" onClick={()=>{
              setPasswordChange(true)
            }} >
              Cambiar Contraseña
            </Button>
          </Grid>

          )
        }
        <Grid item xs={4}>
          <Button variant="contained" fullWidth type="submit">
            {!isEditing ? "Guardar" : "Guardar Datos"}
          </Button>
        </Grid>

      </Grid>
    </Box>
  );
}

export default ProfileForm;
