import {
  Container,
  Button,
  ButtonGroup,
  CircularProgress,
  Box,
} from "@mui/material";
import { CloudUpload, Send } from "@mui/icons-material";
import { VisuallyHiddenInput } from "../Components/VisuallyHiddenInput";
import { useEffect, useState } from "react";
import { sendBackUpRequest } from "../api/programerRequest";
import toast from "react-hot-toast";

function PanelProgramador() {
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);

  const sendBackupFile = () => {
    const formData = new FormData();

    formData.append("backup", file);
    setLoading(true);
    toast.promise(
      sendBackUpRequest(formData),
      {
        loading: "Subiendo...",
        success: ({ data }) => {
          setLoading(false);
          return data.message;
        },
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
  useEffect(() => {
    console.log(file);
  }, [file]);

  return (
    <Container maxWidth="md">
      <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
        <ButtonGroup aria-label="Basic button group">
          <Button
            component="label"
            role={undefined}
            tabIndex={-1}
            startIcon={<CloudUpload />}
          >
            Subir backup JSON
            <VisuallyHiddenInput
              onChange={({ target }) => setFile(target.files[0])}
              type="file"
            />
          </Button>

          {file && (
            <Button
              disabled={loading}
              endIcon={<Send />}
              onClick={sendBackupFile}
            >
              {loading ? "Enviando..." : "Guardar"}
            </Button>
          )}
        </ButtonGroup>
      </Box>
    </Container>
  );
}

export default PanelProgramador;
