import { Container, Typography } from "@mui/material";
import UserForm from "./UserForm";
import { addUserRequest } from "../api/userRequest";
import toast from "react-hot-toast";

function AddUserForm() {
  const onSubmit = async (data) => {
    // console.log(data);
    toast.promise(
      addUserRequest({
        ...data,
        fecha_nacimiento: data.fecha_nacimiento.split("T")[0]
      }),
      {
        loading: "Guardando...",
        success: "Usuario guardando con éxito",
        error: "Ocurrio un error",
      },
      {
        position: "top-right",
        style: {
          fontFamily: "roboto",
        },
      }
    );
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 3, }}>
      <Typography variant="h6">
        Añadir usuario
      </Typography>
      <UserForm onSubmit={onSubmit} />
    </Container>
  );
}

export default AddUserForm;
