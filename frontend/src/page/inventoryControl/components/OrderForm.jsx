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
    createCustomerRequest,

  } from "../../../api/ordersRequest";
import { getAllProducts } from "../../../api/inventoryControlRequest";

  
  function OrderForm({ onClose, reload, isEditing = false, datos = null }) {
    const { handleSubmit, register, reset, setValue, watch } = useForm();
    const [products, setProducts] = useState([]);
    const [items, setItems] = useState([]);
    const [customer, setCustomer] = useState({ name: "", phone: "" });
  
    const fetchProducts = async () => {
      const { data } = await getAllProducts();
      setProducts(data);
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
      console.log("golaaaaa")
  
      if (!isEditing) {
        toast.promise(
          createCustomerRequest(customer).then((res) => {
            return createOrderRequest({
              customerId: res.data.id,
              notes: data.notes,
              items,
            });
          }),
          {
            loading: "Registrando pedido...",
            success: "Pedido registrado",
            error: "Error al registrar pedido",
          }
        );
      } else {
        toast("Edición aún no implementada.", { icon: "⚠️" });
      }
  
      if (onClose) onClose();
      if (reload) reload();
      reset();
      setItems([]);
    };
  
    useEffect(() => {
      fetchProducts();
      if (isEditing && datos) {
        setCustomer({
          name: datos.customer?.name || "",
          phone: datos.customer?.phone || "",
        });
        setValue("notes", datos.notes);
        const loadedItems = datos.order_items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          name: item.inventory_product?.name || ""
        }));
        setItems(loadedItems);
      }
    }, [datos]);
  
    return (
      <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit(submitOrder)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre del cliente"
              fullWidth
              variant="standard"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Teléfono"
              fullWidth
              variant="standard"
              value={customer.phone}
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
            />
          </Grid>
  
          <Grid item xs={5}>
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
              {...register("price")}
            />
          </Grid>
          <Grid item xs={1}>
            <Button onClick={addItem}>+</Button>
          </Grid>
  
          <Grid item xs={12}>
            <ul>
              {items.map((item, index) => (
                <li key={index}>
                  {item.name} - {item.quantity} × ${item.price.toFixed(2)}
                </li>
              ))}
            </ul>
          </Grid>
  
          <Grid item xs={12}>
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
  