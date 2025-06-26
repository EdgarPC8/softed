import {
    Container,
    Typography,
    Button,
    IconButton,
    Tooltip,
  } from '@mui/material';
  import { useEffect, useState } from 'react';
  import { Edit, Delete } from '@mui/icons-material';
  import toast from 'react-hot-toast';
  import DataTable from '../../Components/Tables/DataTable';
  import SimpleDialog from '../../Components/Dialogs/SimpleDialog';
  import CustomerForm from './components/CustomerForm';
import { getAllCustomersRequest,deleteCustomerRequest } from '../../api/inventoryControlRequest';
  
  function CustomerPage() {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [dataToDelete, setDataToDelete] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [datos, setDatos] = useState([]);
    const [titleUserDialog, setTitleUserDialog] = useState("");
  
    const fetchData = async () => {
      const { data } = await getAllCustomersRequest();
      setData(data);
    };
  
    const handleDialog = () => setOpen(!open);
    const handleDialogUser = () => setOpenDialog(!openDialog);
  
    const deleteData = async () => {
      toast.promise(
        deleteCustomerRequest(dataToDelete.id),
        {
          loading: "Eliminando...",
          success: "Cliente eliminado con éxito",
          error: "Ocurrió un error",
        },
        {
          position: "top-right",
          style: { fontFamily: "roboto" },
        }
      );
      setData(data.filter((item) => item.id !== dataToDelete.id));
      handleDialog();
    };
  
    const columns = [
      { headerName: "#", field: "#", width: 40, renderCell: (_, i) => i + 1 },
      { headerName: "Nombre", field: "name", width: 200 },
      { headerName: "Teléfono", field: "phone", width: 150 },
      { headerName: "Email", field: "email", width: 200 },
      { headerName: "Dirección", field: "address", width: 250 },
      {
        headerName: "Acciones",
        field: "actions",
        width: 120,
        renderCell: (params) => (
          <>
            <Tooltip title="Editar">
              <IconButton
                onClick={() => {
                  setDatos(params.row);
                  setIsEditing(true);
                  setTitleUserDialog("Editar Cliente");
                  handleDialogUser();
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton
                onClick={() => {
                  setDataToDelete(params.row);
                  handleDialog();
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
          tittle="Eliminar Cliente"
          onClickAccept={deleteData}
        >
          ¿Está seguro de eliminar este cliente?
        </SimpleDialog>
  
        <SimpleDialog
          open={openDialog}
          onClose={handleDialogUser}
          tittle={titleUserDialog}
        >
          <CustomerForm
            onClose={handleDialogUser}
            isEditing={isEditing}
            datos={datos}
            reload={fetchData}
          />
        </SimpleDialog>
  
        <Button
          variant="contained"
          onClick={() => {
            setIsEditing(false);
            setDatos([]);
            setTitleUserDialog("Agregar Cliente");
            handleDialogUser();
          }}
          sx={{ mb: 2 }}
        >
          Agregar Cliente
        </Button>
  
        <DataTable data={data} columns={columns} />
      </Container>
    );
  }
  
  export default CustomerPage;
  