import { CloudUpload, Save } from "@mui/icons-material";
import {
  Grid,
  TextField,
  Box,
  Button,
  IconButton,
  Typography
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  addAccountRequest,
  getOneAccountRequest,
  updateAccountRequest,
  getAccount
} from "../../api/accountRequest";
import toast from "react-hot-toast";
import DataTable from "../Tables/DataTable";
import { getUsersRequest } from "../../api/userRequest";
import SelectDataRoles from "../Selects/SelectDataRoles";
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { useAuth } from "../../context/AuthContext";

function AccountForm({ isEditing = false, datos = [], onClose, reload }) {
  const [inputValue, setInputValue] = useState("");
  const { handleSubmit, register, reset, setValue, control, watch } = useForm();
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState();
  const [passwordChange, setPasswordChange] = useState(false);
  const [selectedRole, setSelectedRole] = useState(""); // Estado para el rol seleccionado
  const dni = datos.userId;
  const { toast } = useAuth();




  const resetForm = () => {
    setInputValue("");
    reset();
    setSelectedRole(""); // Reseteamos el rol también
  };

  const fetchUsers = async () => {
    const { data } = await getUsersRequest();
    setUsers(data);
  };

  const submitForm = (data) => {
    // Validamos si no hay un usuario seleccionado
    if(!isEditing){
      if (!user) {
        // toast.error("Por favor, seleccione un usuario antes de continuar.");
        toast({
          info: {
            description: "Seleccione porfavor un Usuario"
          }
        });
        return;
      }
      // Validamos si las contraseñas coinciden
      if (data.password !== data.confirmPassword) {
        toast({
          info: {
            description: "Las contraseñas no coinciden"
          }
        });
        return;
      }
      if (selectedRole=="") {
        toast({
          info: {
            description: "Seleccione el Rol porfavor"
          }
        });
        return;
      }

    }
  
    const formData = { ...data, userId: user?.id, rolId: selectedRole }; // Incluimos el rol seleccionado
    if (isEditing) {
      toast({
        promise:
          updateAccountRequest(datos.id, formData),
        successMessage: "Cuenta editada con éxito",
        onSuccess: (data) => {
          if (onClose) onClose();
          if (reload) reload();
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
    } else {
      toast({
        promise:
          addAccountRequest(formData),
        successMessage: "Cuenta guardada con éxito",
        onSuccess: (data) => {
          if (onClose) onClose();
          if (reload) reload();
          resetForm();
        },
     
      });

    }
  };

  const loadUser = async () => {
    if (isEditing) {
      const { data } = await getOneAccountRequest(datos.id);
      const users = data;
      setSelectedRole(users.rolId)
      const keys = Object.keys(users);
      keys.forEach((key) => {
        setValue(key, users[key]);
      });
    }
  };

  const columns = [
    {
      headerName: "#",
      field: "#",
      width: 30,
    },
    {
      headerName: "Cedula",
      field: "ci",
      width: 100,
    },
    {
      headerName: "Nombres y Apellidos",
      field: "null",
      width: 200,
      sortable: false,
      renderCell: (params) => {
        const user = params.row;
        return `${user.firstName} ${user.firstLastName} ${user.secondName} ${user.secondLastName}`;
      },
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => {
              setUser(params.row); // Asignar el usuario seleccionado
            }}
          >
            <ArrowCircleUpIcon sx={{ fontSize: "2.5rem" }} />
          </IconButton>
        </>
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
            value={selectedRole} // Pasamos el rol seleccionado
            onChange={setSelectedRole} // Actualizamos el estado al cambiar
          />
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
        

      
        <Grid item xs={8}>
          {!user && (
            <Typography textAlign={"center"}>
            {!isEditing ? "¡Seleccione por favor un Usuario!" : "Si desea cambiar la contraseña por favor poner la anterior y despues la nueva contraseña"}

              
            </Typography>
          )}
          {user && (
            <Typography textAlign={"center"}>
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
          {!isEditing&&(
            <DataTable data={users} columns={columns} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default AccountForm;
