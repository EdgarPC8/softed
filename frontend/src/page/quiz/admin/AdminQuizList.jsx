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
import SimpleDialog from "../../../Components/Dialogs/SimpleDialog";
import QuizForm from "../components/QuizForm";
import {
  getQuizzes,
  deleteQuiz,
  // cloneQuiz, // aún no implementado
} from "../../../api/quizRequest";
import { formatDate } from "../../../helpers/functions";
import DataTable from "../../../Components/Tables/DataTable";

function AdminQuizList() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [dataToDelete, setDataToDelete] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [datos, setDatos] = useState([]);
  const [titleUserDialog, settitleUserDialog] = useState("");

  const navigate = useNavigate();

  const fetchData = async () => {
    const { data } = await getQuizzes();
    setData(data);
  };

  const handleDialog = () => setOpen(!open);
  const handleDialogUser = () => setOpenDialog(!openDialog);

  const deleteData = async () => {
    toast.promise(
      deleteQuiz(dataToDelete.id),
      {
        loading: "Eliminando...",
        success: "Cuestionario eliminado con éxito",
        error: "Ocurrió un error",
      },
      { position: "top-right" }
    );
    setData(data.filter((item) => item.id !== dataToDelete.id));
    handleDialog();
  };

  const columns = [
    {
      headerName: "#",
      field: "#",
      width: 30,
      sortable: false,
      renderCell: (params, index) => index,
    },
    {
      headerName: "Titulo",
      field: "title",
      width: 240,
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

          <Tooltip title="Asignar Cuestionario">
            <IconButton onClick={() => navigate(`assign/${params.row.id}`)}>
              <Person />
            </IconButton>
          </Tooltip>

          <Tooltip title="Editar Cuestionario">
            <IconButton
              onClick={() => {
                setDatos(params.row);
                setIsEditing(true);
                settitleUserDialog("Editar Cuestionario");
                handleDialogUser();
              }}
            >
              <Edit />
            </IconButton>
          </Tooltip>

          <Tooltip title="Eliminar Cuestionario">
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
    fetchData();
  }, []);

  return (
    <Container>
      <SimpleDialog
        open={open}
        onClose={handleDialog}
        tittle="Eliminar Cuestionario"
        onClickAccept={deleteData}
      >
        ¿Está seguro de eliminar el Cuestionario?
      </SimpleDialog>

      <SimpleDialog
        open={openDialog}
        onClose={handleDialogUser}
        tittle={titleUserDialog}
      >
        <QuizForm
          onClose={handleDialogUser}
          isEditing={isEditing}
          datos={datos}
          reload={fetchData}
        />
      </SimpleDialog>

      <Button
        variant="text"
        endIcon={<Person />}
        onClick={() => {
          setIsEditing(false);
          settitleUserDialog("Agregar Cuestionario");
          handleDialogUser();
        }}
      >
        Crear Cuestionario
      </Button>

      <DataTable data={data} columns={columns} />
    </Container>
  );
}

export default AdminQuizList;
