import {
  Grid,
  TextField,
  Box,
  Button,
  MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createOrderRequest,
  updateOrderRequest,
  getAllCustomersRequest,
} from "../../../api/ordersRequest";
import { getAllProducts } from "../../../api/inventoryControlRequest";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";

function OrderForm({ onClose, reload, isEditing = false, datos = null }) {
  const { handleSubmit, register, reset, setValue, watch } = useForm();
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const { toast: toastAuth } = useAuth();

  const selectedProductId = watch("productId");

  // Autocompletar precio al seleccionar producto
  useEffect(() => {
    if (!selectedProductId) return;
    const product = products.find((p) => p.id === Number(selectedProductId));
    if (product && product.price) {
      setValue("price", product.price);
    }
  }, [selectedProductId, products, setValue]);

  const removeItem = async (index, item) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);

    if (isEditing && item.id) {
      try {
        await axios.delete(`/order-items/${item.id}`, {
          headers: { Authorization: jwt() },
        });
      } catch (err) {
        toast.error("Error al eliminar ítem del pedido");
      }
    }
  };

  const fetchProducts = async () => {
    const { data } = await getAllProducts();
    setProducts(data);
  };

  const fetchCustomers = async () => {
    const { data } = await getAllCustomersRequest();
    setCustomers(data);
  };

  const addItem = () => {
    const productId = Number(watch("productId"));
    const quantity = Number(watch("quantity"));
    const price = Number(watch("price"));
    if (!productId || !quantity || !price) return;
    const product = products.find((p) => p.id === productId);
    setItems([...items, { productId, quantity, price, name: product.name }]);
    setValue("productId", "");
    setValue("quantity", "");
    setValue("price", "");
  };

  const submitOrder = async (data) => {
    if (items.length === 0) {
      toast.error("Debe agregar al menos un producto al pedido");
      return;
    }

    if (!selectedCustomer) {
      toast.error("Seleccione un cliente");
      return;
    }


  const payload = {
    customerId: selectedCustomer,
    notes: data.notes,
    date: new Date(
  `${data.date}T${new Date().toTimeString().slice(0, 8)}`
),
    items,
  };

    if (isEditing) {
      toastAuth({
        promise: updateOrderRequest(datos.id, payload),
        onSuccess: () => {
          if (onClose) onClose();
          if (reload) reload();
          reset();
          setItems([]);
          setSelectedCustomer("");
          return {
            title: "Pedido",
            description: "Pedido actualizado Correctamente",
          };
        },
      });
      return;
    }

    toastAuth({
      promise: createOrderRequest(payload),
      successMessage: "Pedido registrado Correctamente",
      onSuccess: () => {
        if (onClose) onClose();
        if (reload) reload();
        reset();
        setItems([]);
        setSelectedCustomer("");
      },
    });
  };

  useEffect(() => {
    fetchProducts();
    fetchCustomers();

    // Valores por defecto
    const today = new Date().toISOString().split("T")[0];
    setValue("date", today); // valor inicial por defecto

    if (isEditing && datos) {
      setSelectedCustomer(datos.customerId);
      setValue("notes", datos.notes);
      setValue("date", datos.date?.split("T")[0]); // si viene con hora
      const loadedItems = datos.ERP_order_items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        name: item.ERP_inventory_product?.name || ""
      }));
      setItems(loadedItems);
    }
  }, [datos]);

  return (
    <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit(submitOrder)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            select
            label="Seleccionar Cliente"
            fullWidth
            variant="standard"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
          >
            {customers.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name} - {c.phone}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={4}>
          <TextField
            label="Producto"
            select
            fullWidth
            variant="standard"
            {...register("productId")}
          >
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Cantidad"
            type="number"
            fullWidth
            variant="standard"
            {...register("quantity")}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Precio"
            type="number"
            fullWidth
            variant="standard"
            inputProps={{ step: "any", min: 0 }}
            InputLabelProps={{ shrink: true }}
            {...register("price")}
          />
        </Grid>
        <Grid item xs={2}>
          <Button onClick={addItem}>Agregar</Button>
        </Grid>

        <Grid item xs={12}>
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                {item.name} - {item.quantity} × ${item.price.toFixed(2)}
                <Button
                  color="error"
                  size="small"
                  onClick={() => removeItem(index, item)}
                  sx={{ ml: 1 }}
                >
                  Quitar
                </Button>
              </li>
            ))}
          </ul>
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Fecha del pedido"
            type="date"
            fullWidth
            variant="standard"
            InputLabelProps={{ shrink: true }}
            {...register("date")}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Notas"
            fullWidth
            variant="standard"
            {...register("notes")}
          />
        </Grid>

        <Grid item xs={4}>
          <Button variant="contained" fullWidth type="submit">
            {!isEditing ? "Guardar Pedido" : "Actualizar Pedido"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default OrderForm;
