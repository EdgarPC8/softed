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
import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
import ProductForm from "./components/ProductForm";
import {
  getAllProducts,
  deleteProduct
} from "../../api/inventoryControlRequest";
import TablePro from "../../Components/Tables/TablePro";

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
      label: "Nombre",
      id: "name",
      width: 40,
    },
    {
      label: "Tipo",
      id: "type",
      width: 80,
      render: (params) => {
        const type = params.type;
        return type === "raw" ? "Materia Prima" : type === "intermediate" ? "Producto Intermedio" : "Producto Final";
      }
    },
    {
      label: "Descripcion",
      id: "desc",
      width: 40,
    },
    {
      label: "Unidad",
      id: "inventory_unit.name",
      width: 100,
      render: (params) => params.ERP_inventory_unit?.name,
    },
    {
      label: "Categoría",
      id: "category",
      width: 150,
      render: (params) => params.ERP_inventory_category?.name,
    },
    {
      label: "Precio",
      id: "price",
      width: 60,
    },
    {
      label: "Peso Neto",
      id: "netWeight",
      width: 60,
    },
    {
      label: "Stock",
      id: "stock",
      width: 60,
    },
    {
      label: "Stock Mínimo",
      id: "minStock",
      width: 100,
    },
    {
      label: "Acciones",
      id: "actions",
      width: 150,
      render: (params) => (
        <>
          <Tooltip title="Editar Producto">
            <IconButton
         onClick={() => {

          setDatos(params);
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
                setDataToDelete(params);
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

       
      <TablePro
            rows={data}
            columns={columns}
            defaultRowsPerPage={10}
            title="PRODUCTOS"
            tableMaxHeight={380}
            showIndex={true}
          />
    </Container>
  );
}

export default ProductsPage;
