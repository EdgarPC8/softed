import {
    Container,
    Button,
    Typography,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
  import OrderForm from "./components/OrderForm";
  import {
    getAllOrdersRequest,
  } from "../../api/ordersRequest";
import OrderAccordionTable from "./components/OrderAccordionTable";
  function OrderPage() {
    const [orders, setOrders] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [titleDialog, setTitleDialog] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [orderToEdit, setOrderToEdit] = useState(null);
  
    const fetchOrders = async () => {
      const { data } = await getAllOrdersRequest();
      setOrders(data);
    };
  
    const handleDialog = () => setOpenDialog(!openDialog);
  
    useEffect(() => {
      fetchOrders();
    }, []);
  
    return (
      <Container>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Pedidos Registrados
        </Typography>
  
        <SimpleDialog
          open={openDialog}
          onClose={() => {
            setIsEditing(false);
            setOrderToEdit(null);
            handleDialog();
          }}
          tittle={titleDialog}
        >
          <OrderForm
            onClose={() => {
              setIsEditing(false);
              setOrderToEdit(null);
              handleDialog();
            }}
            reload={fetchOrders}
            isEditing={isEditing}
            datos={orderToEdit}
          />
        </SimpleDialog>
  
        <Button
          variant="contained"
          onClick={() => {
            setIsEditing(false);
            setOrderToEdit(null);
            setTitleDialog("Registrar nuevo pedido");
            handleDialog();
          }}
          sx={{ mb: 2 }}
        >
          Crear Pedido
        </Button>
  
        <OrderAccordionTable orders={orders} onReload={fetchOrders} />
      </Container>
    );
  }
  
  export default OrderPage;
  