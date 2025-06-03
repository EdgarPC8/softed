import {
    Container,
    IconButton,
    Button,
    Avatar,
    Tooltip,
    Typography
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { QuestionAnswer } from "@mui/icons-material";
  import toast from "react-hot-toast";
  import DataTable from "../../../Components/Tables/DataTable";
  import { getFormsByUserId } from "../../../api/formsRequest";
  
import { useAuth } from "../../../context/AuthContext";

  function FormsList() {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [dataToDelete, setDataToDelete] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const { user} = useAuth();

    const navigate = useNavigate();
  
    const fecthData = async () => {
      const { data } = await getFormsByUserId(user.userId);
      setData(data);
    };
    const handleDialog = () => {
      setOpen(!open);
    };
    const handleDialogUser = () => {
      setOpenDialog(!openDialog);
    };
  
  
    const columns = [
      {
        headerName: "#",
        field: "#",
        width: 50,
        sortable: false,
        renderCell: (params, index) => {
          return index;
        },
      },
  
      {
        headerName: "Titulo",
        field: "title",
        width: 250,
      },
      {
        headerName: "Descripcion",
        field: "description",
        width: 250,
      },
  
      {
        headerName: "Actions",
        field: "actions",
        width: 200,
        sortable: false,
        renderCell: (params) => (
          <>
            {params.row.responded ? (
              // Si ya fue respondida, mostrar "Respondida"
                "Respondida"
            ) : (
              // Si no fue respondida, mostrar el botón
              <Tooltip title="Responder Encuesta">
                <IconButton
                  onClick={() => navigate(`${params.row.id}`)}
                >
                  <QuestionAnswer />
                </IconButton>
              </Tooltip>
            )}
          </>
        ),
      }
      
    ];
  
    useEffect(() => {
      fecthData();
    }, [user]);
  
  
    return (
      <Container>
        <DataTable data={data} columns={columns} />
      </Container>
    );
  }
  
  export default FormsList;