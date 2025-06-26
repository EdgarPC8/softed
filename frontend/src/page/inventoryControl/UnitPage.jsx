import {
    Container,
    IconButton,
    Button,
    Tooltip,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { Edit, Delete, Straighten } from "@mui/icons-material";
  import toast from "react-hot-toast";
  import UnitForm from "./components/UnitForm.jsx";

import DataTable from "../../Components/Tables/DataTable";
import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
import { getUnits,deleteUnitRequest } from "../../api/inventoryControlRequest";



  function UnitPage() {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [dataToDelete, setDataToDelete] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [datos, setDatos] = useState([]);
    const [titleUserDialog, settitleUserDialog] = useState("");
  
    const fecthData = async () => {
      const { data } = await getUnits();
      setData(data);
    };
  
    const handleDialog = () => setOpen(!open);
    const handleDialogUser = () => setOpenDialog(!openDialog);
  
    const deleteData = async () => {
      toast.promise(
        deleteUnitRequest(dataToDelete.id),
        {
          loading: "Eliminando...",
          success: "Unidad eliminada con éxito",
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
      {
        headerName: "#",
        field: "#",
        width: 40,
        sortable: false,
        renderCell: (params, index) => index,
      },
      {
        headerName: "Nombre",
        field: "name",
        width: 180,
      },
      {
        headerName: "Abreviatura",
        field: "abbreviation",
        width: 120,
      },
      {
        headerName: "Descripción",
        field: "description",
        width: 300,
      },
      {
        headerName: "Acciones",
        field: "actions",
        width: 150,
        sortable: false,
        renderCell: (params) => (
          <>
            <Tooltip title="Editar">
              <IconButton
                onClick={() => {
                  setDatos(params.row);
                  setIsEditing(true);
                  settitleUserDialog("Editar Unidad");
                  handleDialogUser();
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
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
        <SimpleDialog
          open={open}
          onClose={handleDialog}
          tittle="Eliminar Unidad"
          onClickAccept={deleteData}
        >
          ¿Está seguro de eliminar esta unidad?
        </SimpleDialog>
  
        <SimpleDialog
          open={openDialog}
          onClose={handleDialogUser}
          tittle={titleUserDialog}
        >
          <UnitForm
            onClose={handleDialogUser}
            isEditing={isEditing}
            datos={datos}
            reload={fecthData}
          />
        </SimpleDialog>
  
        <Button
          variant="text"
          endIcon={<Straighten />}
          onClick={() => {
            setIsEditing(false);
            settitleUserDialog("Agregar Unidad");
            handleDialogUser();
          }}
        >
          Crear Unidad
        </Button>
  
        <DataTable data={data} columns={columns} />
      </Container>
    );
  }
  
  export default UnitPage;
  