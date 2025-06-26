import {
  Container,
  Button,
  IconButton,
  Tooltip,
  MenuItem,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Edit, Delete, RestaurantMenu } from "@mui/icons-material";
import toast from "react-hot-toast";

import DataTable from "../../Components/Tables/DataTable";
import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
import RecipeForm from "./components/RecipeForm";
import {
  getAllProducts,
  getRecipeByProduct,
  deleteRecipeRequest,
} from "../../api/inventoryControlRequest";

function RecipePage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [recipe, setRecipe] = useState([]);
  const [open, setOpen] = useState(false);
  const [dataToDelete, setDataToDelete] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [datos, setDatos] = useState([]);
  const [titleUserDialog, settitleUserDialog] = useState("");

  const handleDialog = () => setOpen(!open);
  const handleDialogUser = () => setOpenDialog(!openDialog);

  const fetchProducts = async () => {
    const { data } = await getAllProducts();
    setProducts(data.filter((p) => p.type === "final" || p.type === "intermediate"));
  };

  const fetchRecipe = async (productId) => {
    const { data } = await getRecipeByProduct(productId);
    setRecipe(data);
  };

  const deleteData = async () => {
    toast.promise(
      deleteRecipeRequest(dataToDelete.id),
      {
        loading: "Eliminando...",
        success: "Insumo eliminado con éxito",
        error: "Ocurrió un error",
      },
      {
        position: "top-right",
        style: { fontFamily: "roboto" },
      }
    );
    setRecipe(recipe.filter((item) => item.id !== dataToDelete.id));
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
      headerName: "Insumo",
      field: "rawProduct",
      width: 200,
      renderCell: (params) => params.row.rawProduct?.name,
    },
    {
      headerName: "Cantidad",
      field: "quantity",
      width: 100,
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
                settitleUserDialog("Editar Insumo");
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
    fetchProducts();
  }, []);

  return (
    <Container>
      <SimpleDialog
        open={open}
        onClose={handleDialog}
        tittle="Eliminar Insumo"
        onClickAccept={deleteData}
      >
        ¿Está seguro de eliminar este insumo?
      </SimpleDialog>

      <SimpleDialog
        open={openDialog}
        onClose={handleDialogUser}
        tittle={titleUserDialog}
      >
        <RecipeForm
          onClose={handleDialogUser}
          isEditing={isEditing}
          datos={datos}
          reload={() => fetchRecipe(selectedProduct)}
          productFinalId={selectedProduct}
        />
      </SimpleDialog>

      <TextField
        label="Seleccionar Producto Final"
        select
        fullWidth
        sx={{ mb: 2 }}
        value={selectedProduct}
        onChange={(e) => {
          setSelectedProduct(e.target.value);
          fetchRecipe(e.target.value);
        }}
      >
        {products.map((prod) => (
          <MenuItem key={prod.id} value={prod.id}>
            {prod.name}
          </MenuItem>
        ))}
      </TextField>

      <Button
        variant="text"
        endIcon={<RestaurantMenu />}
        onClick={() => {
          setIsEditing(false);
          settitleUserDialog("Agregar Insumo");
          handleDialogUser();
        }}
        disabled={!selectedProduct}
      >
        Agregar Insumo
      </Button>

      <DataTable data={recipe} columns={columns} />
    </Container>
  );
}

export default RecipePage;
