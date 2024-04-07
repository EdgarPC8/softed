import { Container } from "@mui/material";

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
    navigate("/nadadores");
  };

  return (
    <Container maxWidth="xs" sx={{ mt: "30px", p: 5 }}>
      <FormSwimmer onSubmit={onSubmit} />
    </Container>
  );
}

export default EditSwimmerForm;
