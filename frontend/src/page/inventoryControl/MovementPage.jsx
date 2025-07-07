import {
  Container,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import toast from "react-hot-toast";
import DataTable from "../../Components/Tables/DataTable";
import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
import MovementForm from "./components/MovementForm";
import {
  getAllProducts,
  getAllMovements,
} from "../../api/inventoryControlRequest";

function MovementPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);

  const handleDialog = () => setOpenDialog(!openDialog);

  const fetchProducts = async () => {
    const { data } = await getAllProducts();
    setProducts(data);
  };

  const fetchMovements = async () => {
    const { data } = await getAllMovements();
    setMovements(data);
  };

  const columns = [
    { headerName: "#", field: "#", width: 40},
    {
      headerName: "Producto",
      field: "product",
      width: 200,
      renderCell: (params) => params.row.ERP_inventory_product?.name || "-",
    },
    { headerName: "Tipo", field: "type", width: 100 },
    { headerName: "Cantidad", field: "quantity", width: 100 },
    { headerName: "Descripción", field: "description", width: 300 },
    {
      headerName: "Fecha",
      field: "date",
      width: 200,
      renderCell: (params) => new Date(params.row.date).toLocaleString(),
    },
  ];

  useEffect(() => {
    fetchProducts();
    fetchMovements();
  }, []);

  return (
    <Container>
      <SimpleDialog
        open={openDialog}
        onClose={handleDialog}
        tittle="Registrar Movimiento"
      >
        <MovementForm
          productOptions={products}
          onClose={handleDialog}
          onSaved={fetchMovements}
        />
      </SimpleDialog>

      <Button
        variant="text"
        endIcon={<AddCircleOutlineIcon />}
        onClick={handleDialog}
        sx={{ mb: 2 }}
      >
        Registrar Movimiento
      </Button>

      <DataTable data={movements} columns={columns} />
    </Container>
  );
}

export default MovementPage;
