import {
  Container,
  Typography,
  Box,
  Avatar,
  Button,
  ButtonGroup,
} from "@mui/material";
import UserForm from "./UserForm";
import { updateUserPhotoRequest, updateUserRequest } from "../api/userRequest";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { VisuallyHiddenInput } from "./VisuallyHiddenInput";
import { pathPhotos } from "../api/axios";

function EditUserForm() {
  const [photo, setPhoto] = useState("");
  const [iWantEditPhoto, setIwantEditPhoto] = useState(true);
  const navigate = useNavigate();
  const { dni } = useParams();

  const sendPhoto = async () => {
    const formData = new FormData();
    formData.append("_method", "put"); // Agrega este campo para simular una solicitud PUT
    formData.append("photo", photo);

    toast.promise(
      updateUserPhotoRequest(dni, formData),
      {
        loading: "Editando...",
        success: "Foto editado con éxito",
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

  const onSubmit = async (id, data) => {
    toast.promise(
      updateUserRequest(id, {
        ...data,
        fecha_nacimiento: data.fecha_nacimiento.split("T")[0],
      }),
      {
        loading: "Editando...",
        success: "Usuario editado con éxito",
        error: "Ocurrio un error",
      },
      {
        position: "top-right",
        style: {
          fontFamily: "roboto",
        },
      }
    );
    navigate("/usuarios");
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 3 }}>
      <Typography variant="h6">Editar usuario</Typography>
     
      <UserForm onSubmit={onSubmit} />
    </Container>
  );
}

export default EditUserForm;
