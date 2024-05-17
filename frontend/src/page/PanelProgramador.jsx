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

  const getHomeImages = async () => {
    try {
      const { data } = await getHomeImagesRequest();
      setImagesList(data.images);
    } catch (error) {
      console.log(error);
    }
  };

  const viewImage = (name) => {
    handleOpen();
    setSelectedImage(name);
  };

  const deleteImage = async (name) => {
    toast.promise(
      deleteImageRequest(name),
      {
        loading: "Subiendo...",
        success: ({ data }) => {
          setLoading(false);
          setImagesList(imagesList.filter((image) => image.name !== name));
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
    // console.log(name);
  };

  const columns = [
    { field: "name", headerName: "Nombre de la imagen", width: 600 },
    {
      headerName: "Acciones",
      field: "actions",

      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => deleteImage(params.row.name)}>
            <Delete />
          </IconButton>
          <IconButton onClick={() => viewImage(params.row.name)}>
            <Visibility />
          </IconButton>
        </>
      ),
    },
  ];

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

  const sendImages = () => {
    const formData = new FormData();

    if (!imagesToUpload.length) {
      return alert("Selecciona imágenes");
    }

    for (const img of imagesToUpload) {
      formData.append("images[]", img);
    }

    setLoading(true);

    toast.promise(
      addImagesHomeRequest(formData),
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
    getHomeImages();
  }, []);

  return (
    <Container maxWidth="md">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img
            src={`${pathHomeImages}/${selectedImage}`}
            alt={selectedImage}
            loading="lazy"
          />
        </Box>
      </Modal>
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

      <ButtonGroup sx={{ mt: 3 }}>
        <Button
          variant="contained"
          component="label"
          role={undefined}
          tabIndex={-1}
        >
          Subir imágenes para el Inicio
          <VisuallyHiddenInput
            onChange={({ target }) => {
              setImagesToUpload([...target.files]);
            }}
            type="file"
            multiple
          />
        </Button>
        {imagesToUpload.length && (
          <Button disabled={loading} endIcon={<Send />} onClick={sendImages}>
            {loading ? "Enviando..." : "Enviar"}
          </Button>
        )}
      </ButtonGroup>
      <DataTable columns={columns} data={imagesList} />
    </Container>
  );
}

export default PanelProgramador;
