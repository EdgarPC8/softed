import { Container, Typography } from "@mui/material";

import FormSwimmer from "./FormSwimmer";
import { updateSwimmerRequest } from "../api/nadadoresResquest";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function EditSwimmerForm() {
  const navigate = useNavigate();
  const onSubmit = async (dni, data) => {
    toast.promise(
      updateSwimmerRequest(dni, data),
      {
        loading: "Editando...",
        success: "Nadador editado con éxito",
        error: "Ocurrio un error",
      },
      {
        position: "top-right",
        style: {
          fontFamily: "roboto",
        },
      }
    );
    navigate("/nadadores");
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 1, }}>
      <Typography variant="h6">Editar nadador</Typography>
      <FormSwimmer onSubmit={onSubmit} />
    </Container>
  );
}

export default EditSwimmerForm;
