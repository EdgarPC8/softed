import {
  Container,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Person,
  Edit,
  Delete,
  QuestionAnswer,
} from "@mui/icons-material";
import BarChart from "@mui/icons-material/BarChart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import toast from "react-hot-toast";

import DataTable from "../../../Components/Tables/DataTable";
import SimpleDialog from "../../../Components/Dialogs/SimpleDialog";
import FormForm from "../components/Form";
import {
  getForms,
  deleteForm,
  cloneFormRequest,
} from "../../../api/formsRequest";
import { formatDate } from "../../../helpers/functions";

function AdminFormsList() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [dataToDelete, setDataToDelete] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [datos, setDatos] = useState([]);
  const [titleUserDialog, settitleUserDialog] = useState("");
  const [openCloneDialog, setOpenCloneDialog] = useState(false);
  const [formToClone, setFormToClone] = useState(null);

  const navigate = useNavigate();

  const fecthData = async () => {
    const { data } = await getForms();
    setData(data);
  };

  const handleDialog = () => setOpen(!open);
  const handleDialogUser = () => setOpenDialog(!openDialog);
  const handleCloneDialog = () => setOpenCloneDialog(!openCloneDialog);

  const deleteData = async () => {
    toast.promise(
      deleteForm(dataToDelete.id),
      {
        loading: "Eliminando...",
        success: "Encuesta eliminada con éxito",
        error: "Ocurrió un error",
      },
      {
        position: "top-right",
        style: {
          fontFamily: "roboto",
        },
      }
    );
    setData(data.filter((item) => item.id !== dataToDelete.id));
    handleDialog();
  };

  const handleClone = async () => {
    if (!formToClone) return;
    try {
      const res = await cloneFormRequest(formToClone.id);
      toast.success("Encuesta clonada correctamente");
      fecthData();
    } catch (err) {
      console.error("Error al clonar", err);
      toast.error("No se pudo clonar la encuesta");
    } finally {
      handleCloneDialog();
    }
  };

  const columns = [
    {
      headerName: "#",
      field: "#",
      width: 40,
      sortable: false,
      renderCell: (params, index) => index,
    },
    {
      headerName: "Titulo",
      field: "title",
      width: 250,
    },
    {
      headerName: "Descripcion",
      field: "description",
      width: 275,
    },
    {
      headerName: "Fecha",
      field: "date",
      width: 100,
      renderCell: (params) => formatDate(params.row.date),
    },
    {
      headerName: "Enviada a",
      field: "assignedUsers",
      width: 70,
    },
    {
      headerName: "Respondida por",
      field: "respondedUsers",
      width: 100,
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 300,
      sortable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="Ver">
            <IconButton onClick={() => navigate(`view/${params.row.id}`)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Clonar Encuesta">
            <IconButton
              onClick={() => {
                setFormToClone(params.row);
                handleCloneDialog();
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Ver Gráficas">
            <IconButton onClick={() => navigate(`charts/${params.row.id}`)}>
              <BarChart />
            </IconButton>
          </Tooltip>

          <Tooltip title="Gestionar Preguntas">
            <IconButton onClick={() => navigate(`manage/${params.row.id}`)}>
              <QuestionAnswer />
            </IconButton>
          </Tooltip>

          <Tooltip title="Asignar Encuesta">
            <IconButton onClick={() => navigate(`assign/${params.row.id}`)}>
              <Person />
            </IconButton>
          </Tooltip>

          <Tooltip title="Editar Encuesta">
            <IconButton
              onClick={() => {
                setDatos(params.row);
                setIsEditing(true);
                settitleUserDialog("Editar Encuesta");
                handleDialogUser();
              }}
            >
              <Edit />
            </IconButton>
          </Tooltip>

          <Tooltip title="Eliminar Encuesta">
            <IconButton
              onClick={() => {
                handleDialog();
                setDataToDelete(params.row);
              }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  useEffect(() => {
    fecthData();
  }, []);

  return (
    <Container>
      {/* Dialog eliminar */}
      <SimpleDialog
        open={open}
        onClose={handleDialog}
        tittle="Eliminar Encuesta"
        onClickAccept={deleteData}
      >
        ¿Está seguro de eliminar la encuesta?
      </SimpleDialog>

      {/* Dialog clonar */}
      <SimpleDialog
        open={openCloneDialog}
        onClose={handleCloneDialog}
        tittle="Clonar Encuesta"
        onClickAccept={handleClone}
      >
        ¿Está seguro de clonar la encuesta <strong>{formToClone?.title}</strong>?
      </SimpleDialog>

      {/* Dialog crear o editar */}
      <SimpleDialog
        open={openDialog}
        onClose={handleDialogUser}
        tittle={titleUserDialog}
      >
        <FormForm
          onClose={handleDialogUser}
          isEditing={isEditing}
          datos={datos}
          reload={fecthData}
        />
      </SimpleDialog>

      <Button
        variant="text"
        endIcon={<Person />}
        onClick={() => {
          setIsEditing(false);
          settitleUserDialog("Agregar Encuesta");
          handleDialogUser();
        }}
      >
        Crear Encuesta
      </Button>

      <DataTable data={data} columns={columns} />
    </Container>
  );
}

export default AdminFormsList;
