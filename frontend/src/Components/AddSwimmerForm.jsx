import { Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import FormSwimmer from "./FormSwimmer";
import {
  addSwimmerRequest,
  getOneSwimmerRequest,
} from "../api/nadadoresResquest";
import toast from "react-hot-toast";

function AddSwimmerForm() {
  const onSubmit = async (data) => {
    toast.promise(
      addSwimmerRequest({
        ...data,
        fecha_nacimiento: data.fecha_nacimiento.split("T")[0],
        cedula: parseInt(data.cedula),
      }),
      {
        loading: "Guardando...",
        success: "Nadador guardando con éxito",
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
    <Container maxWidth="xs" sx={{ mt: 2 }}>
      <Typography variant="h6">Añadir nadador</Typography>
      <FormSwimmer onSubmit={onSubmit} />
    </Container>
  );
}

export default AddSwimmerForm;
