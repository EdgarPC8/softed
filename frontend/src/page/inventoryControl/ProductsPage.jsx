import {
  Container,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Edit,
  Delete,
  Inventory,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import DataTable from "../../Components/Tables/DataTable";
import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
import ProductForm from "./components/ProductForm";
import {
  getAllProducts,
  deleteProduct
} from "../../api/inventoryControlRequest";

function ProductsPage() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [dataToDelete, setDataToDelete] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [datos, setDatos] = useState([]);
  const [titleUserDialog, settitleUserDialog] = useState("");

  const navigate = useNavigate();

  const fecthData = async () => {
    const { data } = await getAllProducts();
    setData(data);
  };

  const handleDialog = () => setOpen(!open);
  const handleDialogUser = () => setOpenDialog(!openDialog);

  const deleteData = async () => {
    toast.promise(
      deleteProduct(dataToDelete.id),
      {
        loading: "Eliminando...",
        success: "Producto eliminado con éxito",
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
      width: 120,
    },
    {
      headerName: "Tipo",
      field: "type",
      width: 120,
      renderCell: (params) => {
        const type = params.row.type;
        return type === "raw" ? "Materia Prima" : type === "intermediate" ? "Producto Intermedio" : "Producto Final";
      }
    },
    {
      headerName: "Unidad",
      field: "inventory_unit.name",
      width: 100,
      renderCell: (params) => params.row.inventory_unit?.name,
    },
    {
      headerName: "Categoría",
      field: "category",
      width: 150,
      renderCell: (params) => params.row.inventory_category?.name,
    },
    {
      headerName: "Precio",
      field: "price",
      width: 60,
    },
    {
      headerName: "Stock",
      field: "stock",
      width: 60,
    },
    {
      headerName: "Stock Mínimo",
      field: "minStock",
      width: 100,
    },
    {
      headerName: "Acciones",
      field: "actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="Editar Producto">
            <IconButton
         onClick={() => {

          setDatos(params.row);
          setIsEditing(true);
          settitleUserDialog("Editar Producto");
          handleDialogUser();
        }}
        
            >
              <Edit />
            </IconButton>
          </Tooltip>

          <Tooltip title="Eliminar Producto">
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
        tittle="Eliminar Producto"
        onClickAccept={deleteData}
      >
        ¿Está seguro de eliminar el producto?
      </SimpleDialog>

      {/* Dialog crear o editar */}
      <SimpleDialog
        open={openDialog}
        onClose={handleDialogUser}
        tittle={titleUserDialog}
      >
  <ProductForm
  onClose={handleDialogUser}
  isEditing={isEditing}
  datos={datos}
  reload={fecthData}
/>

      </SimpleDialog>

      <Button
        variant="text"
        endIcon={<Inventory />}
        onClick={() => {
          setIsEditing(false);
          settitleUserDialog("Agregar Producto");
          handleDialogUser();
        }}
      >
        Crear Producto
      </Button>

      <DataTable data={data} columns={columns} />
    </Container>
  );
}

export default ProductsPage;
