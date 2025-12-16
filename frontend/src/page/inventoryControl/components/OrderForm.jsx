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
import SearchableSelect from "../../../Components/SearchableSelect";


/* ========= Utils de fecha en LOCAL (sin UTC) ========= */
const pad2 = (n) => String(n).padStart(2, "0");

// yyyy-MM-dd en hora local (para <input type="date">)
const localISODate = () => {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

// HH:mm:ss actual en local
const localHMS = () => {
  const d = new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
};

// Convierte un Date a ISO con offset local (no Z)
const toLocalISOWithOffset = (d) => {
  const off = -d.getTimezoneOffset(); // minutos respecto a UTC
  const sign = off >= 0 ? "+" : "-";
  const hhOff = pad2(Math.floor(Math.abs(off) / 60));
  const mmOff = pad2(Math.abs(off) % 60);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}${sign}${hhOff}:${mmOff}`;
};

// Intenta normalizar cualquier forma de fecha recibida en datos.* a yyyy-MM-dd
const normalizeToYYYYMMDD = (datos) => {
  if (!datos) return localISODate();
  // 1) dateMs (epoch)
  if (datos.dateMs) {
    const d = new Date(Number(datos.dateMs));
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }
  // 2) ISO con T (con o sin Z)
  if (typeof datos.date === "string" && datos.date.includes("T")) {
    const d = new Date(datos.date);
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }
  // 3) Formato "dd/MM/yyyy HH:mm:ss" o "dd/MM/yyyy"
  if (typeof datos.date === "string" && datos.date.includes("/")) {
    const [datePart] = datos.date.split(" ");
    const [dd, mm, yyyy] = datePart.split("/");
    if (dd && mm && yyyy) return `${yyyy}-${mm}-${dd}`;
  }
  // Fallback
  return localISODate();
};

function OrderForm({ onClose, reload, isEditing = false, datos = null }) {
  const { handleSubmit, register, reset, setValue, watch } = useForm();
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const { toast: toastAuth } = useAuth();

  const selectedProductId = watch("productId");

  // Autocompletar precio al seleccionar producto
  useEffect(() => {
    if (!selectedProductId) return;
    const product = products.find((p) => p.id === Number(selectedProductId));
    if (product && product.distributorPrice) {
      setValue("price", product.distributorPrice);
    }
  }, [selectedProductId, products, setValue]);

  const removeItem = async (index, item) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);

    if (isEditing && item.id) {
      try {
        await axios.delete(`/order-items/${item.id}`, {
          headers: { Authorization: jwt() }, // asumiendo que jwt() existe en tu proyecto
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

    // Construye un Date local a partir de la fecha seleccionada + hora actual local
    const localDT = new Date(`${data.date}T${localHMS()}`);

    // Payload compatible: enviamos epoch y cadena con offset local
    const payload = {
      customerId: selectedCustomer,
      notes: data.notes,
      dateMs: localDT.getTime(),                 // ✅ estable y sin ambigüedad de zona
      date: toLocalISOWithOffset(localDT),       // ✅ por compatibilidad si el backend espera string
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
        onError: (res) => ({
          title: "Pedido",
          description: res?.response?.data?.message || "Error al actualizar pedido",
        }),
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
      onError: (res) => ({
        title: "Pedido",
        description: res?.response?.data?.message || "Error al registrar pedido",
      }),
    });
  };

  useEffect(() => {
    fetchProducts();
    fetchCustomers();

    // Valor por defecto para fecha en LOCAL (no UTC)
    setValue("date", localISODate());

    if (isEditing && datos) {
      setSelectedCustomer(datos.customerId);
      setValue("notes", datos.notes || "");
      // Normaliza fecha entrante a yyyy-MM-dd para el input date
      setValue("date", normalizeToYYYYMMDD(datos));

      const loadedItems = (datos.ERP_order_items || []).map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.distributorPrice,
        name: item.ERP_inventory_product?.name || "",
      }));
      setItems(loadedItems);
    }
  }, [datos]);

  return (
    <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit(submitOrder)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/* <TextField
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
          </TextField> */}
<SearchableSelect
  label="Seleccionar Cliente"
  items={customers}
  value={selectedCustomer}
  onChange={setSelectedCustomer} // 👌 esto también sirve
/>

        </Grid>

        <Grid item xs={6}>
          {/* <TextField
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
          </TextField> */}
<SearchableSelect
  label="Seleccionar Producto"
  items={products}
  value={selectedProduct}
  onChange={setSelectedProduct} // 👌 esto también sirve
/>
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="Cantidad"
            type="number"
            fullWidth
            variant="standard"
            {...register("quantity")}
          />
        </Grid>
        <Grid item xs={2}>
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
                {item.name} - {item.quantity} × ${Number(item.distributorPrice).toFixed(2)}
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
