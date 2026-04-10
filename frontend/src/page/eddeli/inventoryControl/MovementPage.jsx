import {
  Container,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import toast from "react-hot-toast";
import DataTable from "../../../Components/Tables/DataTable";
import TablePro from "../../../Components/Tables/TablePro";
import SimpleDialog from "../../../Components/Dialogs/SimpleDialog";
import MovementForm from "./components/MovementForm";


import {
  getAllProducts,
  getAllMovements,
} from "../../../api/eddeli/inventoryControlRequest";

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

  // Función para formatear fecha
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleString("es-EC", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Función para formatear precio
  const formatPrice = (price) => {
    if (price == null || price === undefined) return "-";
    return new Intl.NumberFormat("es-EC", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(price));
  };

  const columns = [
    {
      label: "Producto",
      id: "product",
      render: (row) => row.ERP_inventory_product?.name || "-",
    },
    { label: "Tipo", id: "type" },
    { label: "Cantidad", id: "quantity" },
    {
      label: "Precio",
      id: "price",
      render: (row) => formatPrice(row.price),
    },
    { label: "Descripción", id: "description" },
    {
      label: "Fecha",
      id: "date",
      render: (row) => formatDate(row.date),
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
          onSaved={() => {
            fetchMovements();
            fetchProducts();
          }}
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

      {/* <DataTable data={movements} columns={columns} /> */}
      <TablePro
        columns={columns}
        rows={movements}
        showSearch={true}
        showPagination={true}
        defaultRowsPerPage={10}
        title="Movimientos"
        showIndex={true}
        tableMaxHeight={350}     


      />
    </Container>
  );
}

export default MovementPage;
