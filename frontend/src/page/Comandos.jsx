import {
    Container,
    Button,
    ButtonGroup,
    Modal,
    IconButton,
    Box,
  } from "@mui/material";
  import { CloudUpload, Send } from "@mui/icons-material";
  import { VisuallyHiddenInput } from "../Components/VisuallyHiddenInput";
  import { useEffect, useState } from "react";
  import { Delete, Visibility } from "@mui/icons-material";
  import {
    addImagesHomeRequest,
    deleteImageRequest,
    getHomeImagesRequest,
    reloadBD,
    sendBackUpRequest,
  } from "../api/programerRequest";
  import toast from "react-hot-toast";
  import DataTable from "../Components/DataTable";
  import { pathHomeImages } from "../api/axios";
  
  function PanelProgramador() {
    const [file, setFile] = useState("");
    const [imagesToUpload, setImagesToUpload] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imagesList, setImagesList] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
  
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
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
    const reloadDataBase =async () => {

        await reloadBD();
 
      };
  
    const style = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      bgcolor: "background.paper",
      border: "2px solid #000",
      boxShadow: 24,
      p: 4,
    };
  
    useEffect(() => {
    //   getHomeImages();
    }, []);
  
    return (
      <Container maxWidth="md">
   
        <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
          <ButtonGroup>
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
        <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
          <ButtonGroup>
            <Button
              component="label"
              tabIndex={-1}
              onClick={reloadDataBase}
            >
              Recargar Base de Datos
            </Button>
          </ButtonGroup>
        </Box>
      </Container>
    );
  }
  
  export default PanelProgramador;
  