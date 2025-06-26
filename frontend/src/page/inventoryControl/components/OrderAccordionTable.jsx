import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Collapse,
    IconButton,
    Typography,
    Box,
    TablePagination,
    Tooltip
  } from '@mui/material';
  import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
  import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
  import LocalShippingIcon from '@mui/icons-material/LocalShipping';
  import { useState } from 'react';
  import toast from 'react-hot-toast';
  import { updateOrderStatusRequest } from '../../../api/ordersRequest';
  
  function OrderRow({ order, onReload }) {
    const [open, setOpen] = useState(false);
  
    const total = order.ERP_order_items.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
  
    const handleDeliver = async () => {
      toast.promise(updateOrderStatusRequest(order.id, 'entregado'), {
        loading: 'Marcando como entregado...',
        success: 'Pedido entregado',
        error: 'Error al actualizar pedido',
      });
      onReload();
    };
  
    return (
      <>
        <TableRow>
          <TableCell>
            <IconButton onClick={() => setOpen(!open)} size="small">
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>{order.ERP_customer?.name}</TableCell>
          <TableCell>{order.status}</TableCell>
          <TableCell>{order.notes}</TableCell>
          <TableCell>{order.ERP_order_items.length}</TableCell>
          <TableCell>${total.toFixed(2)}</TableCell>
          <TableCell>
            <Tooltip title="Entregar Pedido">
              <IconButton onClick={handleDeliver}>
                <LocalShippingIcon />
              </IconButton>
            </Tooltip>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={7} sx={{ p: 0 }}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Detalles del Pedido:
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell>Precio Unitario</TableCell>
                      <TableCell>Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.ERP_order_items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.ERP_inventory_product?.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }
  
  export default function OrderAccordionTable({ orders, onReload }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
  
    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    if (!orders || orders.length === 0) return null;
  
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Pedidos Detallados
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Cliente</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Notas</TableCell>
                <TableCell># Productos</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                  <OrderRow key={order.id} order={order} onReload={onReload} />
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={orders.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Pedidos por página"
          />
        </TableContainer>
      </Box>
    );
  }
  