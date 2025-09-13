// src/pages/Reports/CustomersAccordionTable.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Collapse, IconButton, Typography, Box, TablePagination,
  Tooltip, TextField, Stack, Chip
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon   from "@mui/icons-material/KeyboardArrowUp";
import PaidIcon from "@mui/icons-material/AttachMoney";
import PendingIcon from "@mui/icons-material/HourglassEmpty";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getCustomerSalesSummary } from "../../../api/financeRequest";

/* ---------------------- Utils ---------------------- */
const toNum = (v, def = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
};

const money = (n) =>
  new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(
    toNum(n)
  );

const safeArray = (v) => (Array.isArray(v) ? v : []);

/** Normaliza el JSON crudo (como tu ejemplo) y calcula pendientes por producto */
function normalizeRows(rawList) {
  return safeArray(rawList).map((r) => {
    const orders = safeArray(r.orders);

    let lineItems = 0;
    let unitsFromItems = 0;
    let unitsDelivered = 0;

    const productMap = new Map();

    for (const o of orders) {
      const items = safeArray(o.ERP_order_items);
      lineItems += items.length;

      for (const it of items) {
        const qty = toNum(it.quantity);
        const price = toNum(it.price);
        const amt = qty * price;
        const isPaid = Boolean(it.paidAt);
        const isDelivered = Boolean(it.deliveredAt);

        unitsFromItems += qty;
        if (isDelivered) unitsDelivered += qty;

        const prodId = it?.ERP_inventory_product?.id ?? it.productId ?? "unknown";
        const prodName = it?.ERP_inventory_product?.name ?? `Producto #${prodId}`;

        const prev =
          productMap.get(prodId) ??
          { productId: prodId, name: prodName, totalQuantity: 0, totalAmount: 0, pendingQuantity: 0, pendingAmount: 0 };

        prev.totalQuantity += qty;
        prev.totalAmount += amt;

        if (!isPaid) {
          prev.pendingQuantity += qty;
          prev.pendingAmount += amt;
        }

        productMap.set(prodId, prev);
      }
    }

    const productSummary = Array.from(productMap.values());

    // Si tu backend ya manda totalQuantity / totalAmount / totalAmountDeuda los usamos,
    // caso contrario tomamos los calculados.
    const computedTotalAmount = productSummary.reduce((s, p) => s + toNum(p.totalAmount), 0);
    const computedPendingAmount = productSummary.reduce((s, p) => s + toNum(p.pendingAmount), 0);

    return {
      customerId: r.customerId ?? r.customer?.id,
      customer: r.customer ?? null,
      ordersCount: orders.length,
      lineItems,
      units: toNum(r.totalQuantity) || unitsFromItems,
      unitsDelivered,
      revenueTotal: toNum(r.totalAmount) || computedTotalAmount,
      totalAmountDeuda: toNum(r.totalAmountDeuda) || computedPendingAmount,
      lastOrderAt: r.lastOrderAt ?? r.updatedAt ?? null,
      productSummary,
      _raw: r,
    };
  });
}

/* ---------------------- Fila ---------------------- */
function CustomerRow({ row }) {
  const [open, setOpen] = useState(false);

  const lastOrderLabel = row?.lastOrderAt
    ? format(new Date(row.lastOrderAt), "dd/MM/yyyy HH:mm", { locale: es })
    : "—";

  return (
    <>
      <TableRow hover>
        <TableCell padding="checkbox">
          <IconButton onClick={() => setOpen((v) => !v)} size="small">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2">
              {row?.customer?.name ?? `Cliente #${row?.customerId ?? "—"}`}
            </Typography>
            {row?.customer?.email && (
              <Chip size="small" label={row.customer.email} />
            )}
          </Stack>
        </TableCell>

        <TableCell align="right">{toNum(row?.ordersCount)}</TableCell>
        <TableCell align="right">{toNum(row?.lineItems)}</TableCell>

        <TableCell align="right">
          <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
            <span>{toNum(row?.units).toLocaleString()}</span>
            <Tooltip title="Unidades entregadas">
              <Chip icon={<LocalShippingIcon />} size="small" label={`${toNum(row?.unitsDelivered)}`} />
            </Tooltip>
          </Stack>
        </TableCell>

        <TableCell align="right">
          <Chip icon={<PaidIcon />} color="success" size="small" label={money(row?.revenueTotal)} />
        </TableCell>

        <TableCell align="right">
          <Chip icon={<PendingIcon />} color="warning" size="small" label={money(row?.totalAmountDeuda)} />
        </TableCell>

        <TableCell>{lastOrderLabel}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={8} sx={{ p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2, bgcolor: "#fafafa", borderTop: "1px solid #eee" }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Productos pedidos por este cliente
              </Typography>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell align="right">Cantidad total</TableCell>
                      <TableCell align="right">Σ Total $</TableCell>
                      <TableCell align="right">Pendiente (u)</TableCell>
                      <TableCell align="right">Pendiente $</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {safeArray(row?.productSummary).map((p) => {
                      const pq = toNum(p.pendingQuantity);
                      const pa = toNum(p.pendingAmount);
                      return (
                        <TableRow key={p.productId ?? p.name}>
                          <TableCell>{p.name}</TableCell>
                          <TableCell align="right">
                            {toNum(p.totalQuantity).toLocaleString()}
                          </TableCell>
                          <TableCell align="right">{money(p.totalAmount)}</TableCell>
                          <TableCell align="right">
                            {pq > 0 ? (
                              <Chip color="warning" size="small" label={pq.toLocaleString()} />
                            ) : (
                              0
                            )}
                          </TableCell>
                          <TableCell align="right">
                            {pa > 0 ? (
                              <Chip color="warning" size="small" label={money(pa)} />
                            ) : (
                              money(0)
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {safeArray(row?.productSummary).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          Sin productos
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

/* --------------- Tabla principal --------------- */
export default function CustomersAccordionTable() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        // Debe devolver el JSON como tu ejemplo (array) o { data: array }
        const { data } = await getCustomerSalesSummary();

        const raw =
          Array.isArray(data?.data) ? data.data :
          Array.isArray(data)       ? data :
          [];

        const normalized = normalizeRows(raw);
        if (!active) return;
        setRows(normalized);
      } catch (err) {
        console.error("Error cargando resumen de clientes:", err);
        if (!active) return;
        setRows([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) => {
      const name = r?.customer?.name ? r.customer.name.toLowerCase() : "";
      const phone = r?.customer?.phone ? String(r.customer.phone).toLowerCase() : "";
      const email = r?.customer?.email ? r.customer.email.toLowerCase() : "";
      const idStr = String(r?.customerId ?? "");
      return name.includes(s) || phone.includes(s) || email.includes(s) || idStr.includes(s);
    });
  }, [rows, search]);

  const paginated = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Clientes — Ventas y Pedidos
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Buscar cliente / teléfono / email"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Cliente</TableCell>
              <TableCell align="right"># Pedidos</TableCell>
              <TableCell align="right">Líneas</TableCell>
              <TableCell align="right">Unidades</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Deuda</TableCell>
              <TableCell>Último pedido</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={8} align="center">Cargando…</TableCell>
              </TableRow>
            )}

            {!loading && paginated.map((row, idx) => (
              <CustomerRow key={row?.customerId ?? row?.customer?.id ?? `row-${idx}`} row={row} />
            ))}

            {!loading && paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">Sin datos</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
        />
      </TableContainer>
    </Box>
  );
}
