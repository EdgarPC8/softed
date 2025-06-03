import {
  Container,
  IconButton,
} from "@mui/material";
import DataTable from "../Components/Tables/DataTable";
import { useEffect, useState } from "react";
import {  getLogs } from "../api/comandsRequest";
import VisibilityIcon from '@mui/icons-material/Visibility';
import SimpleDialog from "../Components/Dialogs/SimpleDialog";
import LogsForm from "../Components/Forms/LogsForm";
 
function Logs() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [datos, setDatos] = useState([]);
  const [titleUserDialog, settitleUserDialog] = useState("");

  const fetchUsers = async () => {
    const { data } = await getLogs();
    setUsers(data);
  };
  const handleDialogUser = () => {
    setOpenDialog(!openDialog);
  };

  const columns = [
    {
      headerName: "#",
      field: "#",
      width: 20,
    },
    {
      headerName: "Id",
      field: "id",
      width: 20,
    },
     {
      headerName: "Metodo Http",
      field: "httpMethod",
      width: 80,
    },
    {
      headerName: "Accion",
      field: "action",
      width: 150,
    },
    {
      headerName: "Descripcion",
      field: "description",
      width: 300,
    },
    {
      headerName: "Url ",
      field: "endPoint",
      width: 120,
    },
    {
      headerName: "Sistema",
      field: "system",
      width: 100,
    },
    {
      headerName: "Fecha",
      field: "date",
      width: 200,
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => {
              setDatos(params.row)
              setIsEditing(true)
              settitleUserDialog("Informacion del log")
              handleDialogUser();
            }}
          >
            <VisibilityIcon />
          </IconButton>
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);


  return (
    <Container>

      <SimpleDialog
        open={openDialog}
        onClose={handleDialogUser}
        tittle={titleUserDialog}
      >
        <LogsForm onClose={handleDialogUser} isEditing={isEditing} datos={datos} reload={fetchUsers}></LogsForm> 
      </SimpleDialog>
      <DataTable data={users} columns={columns} />
    </Container>
  );
}

export default Logs;
