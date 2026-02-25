import { Container, IconButton, Tooltip } from "@mui/material";
import TablePro from "../Components/Tables/TablePro";
import { useEffect, useState } from "react";
import { getLogs } from "../api/comandsRequest";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SimpleDialog from "../Components/Dialogs/SimpleDialog";
import LogsForm from "../Components/Forms/LogsForm";

function Logs() {
  const [logs, setLogs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [datos, setDatos] = useState([]);
  const [titleUserDialog, setTitleUserDialog] = useState("");

  const fetchLogs = async () => {
    const { data } = await getLogs();
    setLogs(data);
  };
  const handleDialogUser = () => setOpenDialog((v) => !v);

  const formatDate = (d) => {
    if (!d) return "—";
    try {
      const date = new Date(d);
      return date.toLocaleString();
    } catch {
      return String(d);
    }
  };

  const columns = [
    { id: "id", label: "Id", getSortValue: (r) => r.id },
    { id: "httpMethod", label: "Método Http" },
    { id: "action", label: "Acción" },
    { id: "description", label: "Descripción" },
    { id: "endPoint", label: "Url" },
    { id: "system", label: "Sistema" },
    {
      id: "date",
      label: "Fecha",
      getSortValue: (r) => r.date,
      render: (row) => formatDate(row.date),
    },
    {
      id: "actions",
      label: "Acciones",
      render: (row) => (
        <Tooltip title="Ver detalle">
          <IconButton
            size="small"
            onClick={() => {
              setDatos(row);
              setIsEditing(true);
              setTitleUserDialog("Información del log");
              handleDialogUser();
            }}
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <Container sx={{ py: 2 }}>
      <SimpleDialog
        open={openDialog}
        onClose={handleDialogUser}
        tittle={titleUserDialog}
        maxWidth="lg"
        fullWidth
      >
        <LogsForm
          onClose={handleDialogUser}
          isEditing={isEditing}
          datos={datos}
          reload={fetchLogs}
        />
      </SimpleDialog>
      <TablePro
        title="Logs"
        rows={logs}
        columns={columns}
        showSearch
        showPagination
        showIndex
        indexHeader="#"
        rowsPerPageOptions={[5, 10, 25]}
        defaultRowsPerPage={10}
        tableMaxHeight={440}
      />
    </Container>
  );
}

export default Logs;
