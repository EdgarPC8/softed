// CustomerOrderGroupsDemo.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Button,
  Alert,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  useMediaQuery,
  IconButton,
  Tooltip,
  MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

import {
  getFinanceWorkbenchAllRequest,
  createItemGroupRequest,
  payItemGroupRequest,
  deleteItemGroupRequest,
  moveItemBetweenGroupsRequest,
  updateItemGroupRequest,
  updateOrderItemRequest, // ✅ asegúrate que exista en ../../../api/ordersRequest
} from "../../../api/ordersRequest";

import { useAuth } from "../../../context/AuthContext";

// =======================
// Helpers
// =======================
const safeFileName = (s = "") =>
  String(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .toLowerCase();

const downloadTextFile = (filename, text) => {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const money = (n) =>
  new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(
    Number(n || 0)
  );

const todayISO = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const sum = (arr, fn) =>
  (arr || []).reduce((acc, x) => acc + Number(fn(x) || 0), 0);

const dayLabel = (iso) => iso;

// ✅ IMPORTANTE:
// - Si backend solo manda inGroup:true/false, aquí lo tratamos como "ya está agrupado"
// - Para MOSTRAR en qué grupo está, el backend debe mandar itemGroupId o groupId real.
const getItemGroupId = (it) =>
  it?.groupId ?? it?.itemGroupId ?? (it?.inGroup ? "__grouped__" : null);

const toNum = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

// =======================
// UI bits
// =======================
function ItemsTable({
  items,
  selectable = false,
  selectedItemIds = [],
  onToggleItem,
  isItemSelectable, // (it)=>boolean

  // ✅ edición
  editable = false,
  canEditItem, // (it)=>boolean
  isEditingItem, // (id)=>boolean
  getEditFields, // (id)=>{qty,price,soldQty,damagedQty,giftQty,replacedQty}
  onEditToggle, // (it)=>void
  onEditFieldChange, // (id, field, value)=>void
  onEditConfirm, // (it)=>void

  // ✅ acciones de grupo
  showGroupActions = false,
  onRemoveFromGroup, // (it)=>void
  onMoveToGroup, // (it)=>void
}) {
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Table size="small" sx={{ minWidth: 980 }}>
        <TableHead>
          <TableRow>
            {selectable && <TableCell width={40}></TableCell>}

            <TableCell>Producto</TableCell>

            <TableCell align="right" width={90}>
              Entregado
            </TableCell>

            {/* ✅ nuevos campos de cierre */}
            <TableCell align="right" width={90}>
              Vendido
            </TableCell>
            <TableCell align="right" width={90}>
              Dañado
            </TableCell>
            <TableCell align="right" width={90}>
              Yapa
            </TableCell>
            <TableCell align="right" width={90}>
              Cambiado
            </TableCell>

            <TableCell align="right" width={110}>
              P/U
            </TableCell>
            <TableCell align="right" width={120}>
              Total vendido
            </TableCell>

            <TableCell align="center" width={90}>
              Pagado
            </TableCell>

            {(editable || showGroupActions) && (
              <TableCell align="right" width={170}>
                Acciones
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {(items || []).map((it) => {
            const checked = selectedItemIds.includes(it.id);
            const paid = !!it.paidAt;

            const editing = !!isEditingItem?.(it.id);
            const fields = getEditFields?.(it.id) || {};

            const qtyDelivered = editing
              ? toNum(fields.qty, it.qty)
              : toNum(it.qty, 0);
            const price = editing
              ? toNum(fields.price, it.price)
              : toNum(it.price, 0);

            // valores de cierre (siempre existen)
            const damagedQty = editing
              ? toNum(fields.damagedQty, it.damagedQty)
              : toNum(it.damagedQty, 0);
            const giftQty = editing
              ? toNum(fields.giftQty, it.giftQty)
              : toNum(it.giftQty, 0);
            const replacedQty = editing
              ? toNum(fields.replacedQty, it.replacedQty)
              : toNum(it.replacedQty, 0);

            // ✅ vendido cobrable siempre se calcula así
            const billableQty = Math.max(0, qtyDelivered - damagedQty - giftQty);
            const totalSold = Number((billableQty * price).toFixed(2));

            const allowEdit = !!canEditItem?.(it);

            const groupIdReal = it?.itemGroupId ?? it?.groupId; // ✅ real (si backend lo manda)
            const canGroupActions =
              !!groupIdReal && !!(onRemoveFromGroup || onMoveToGroup);

            const selectableOk =
              typeof isItemSelectable === "function"
                ? isItemSelectable(it)
                : !paid && !getItemGroupId(it); // default

            return (
              <TableRow key={it.id} hover>
                {selectable && (
                  <TableCell>
                    <Checkbox
                      disabled={!selectableOk}
                      checked={checked}
                      onChange={() => onToggleItem?.(it.id)}
                    />
                  </TableCell>
                )}

                <TableCell>{it.product}</TableCell>

                {/* Entregado */}
                <TableCell align="right">
                  {!editing ? (
                    qtyDelivered
                  ) : (
                    <TextField
                      size="small"
                      type="number"
                      inputProps={{ min: 0, step: 1 }}
                      value={fields.qty ?? ""}
                      onChange={(e) =>
                        onEditFieldChange?.(it.id, "qty", e.target.value)
                      }
                      sx={{ maxWidth: 90 }}
                    />
                  )}
                </TableCell>

                {/* Vendido (calculado) */}
                <TableCell align="right">{billableQty}</TableCell>

                {/* Dañado */}
                <TableCell align="right">
                  {!editing ? (
                    damagedQty
                  ) : (
                    <TextField
                      size="small"
                      type="number"
                      inputProps={{ min: 0, step: 1 }}
                      value={fields.damagedQty ?? ""}
                      onChange={(e) =>
                        onEditFieldChange?.(it.id, "damagedQty", e.target.value)
                      }
                      sx={{ maxWidth: 90 }}
                    />
                  )}
                </TableCell>

                {/* Yapa ✅ (ARREGLADO: ahora guarda giftQty) */}
                <TableCell align="right">
                  {!editing ? (
                    giftQty
                  ) : (
                    <TextField
                      size="small"
                      type="number"
                      inputProps={{ min: 0, step: 1 }}
                      value={fields.giftQty ?? ""}
                      onChange={(e) =>
                        onEditFieldChange?.(it.id, "giftQty", e.target.value)
                      }
                      sx={{ maxWidth: 90 }}
                    />
                  )}
                </TableCell>

                {/* Cambiado */}
                <TableCell align="right">
                  {!editing ? (
                    replacedQty
                  ) : (
                    <TextField
                      size="small"
                      type="number"
                      inputProps={{ min: 0, step: 1 }}
                      value={fields.replacedQty ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        // ✅ cambiado -> dañado (tu regla)
                        onEditFieldChange?.(it.id, "replacedQty", v);
                        onEditFieldChange?.(it.id, "damagedQty", v);
                      }}
                      sx={{ maxWidth: 90 }}
                    />
                  )}
                </TableCell>

                {/* P/U */}
                <TableCell align="right">
                  {!editing ? (
                    money(price)
                  ) : (
                    <TextField
                      size="small"
                      type="number"
                      inputProps={{ min: 0, step: "0.01" }}
                      value={fields.price ?? ""}
                      onChange={(e) =>
                        onEditFieldChange?.(it.id, "price", e.target.value)
                      }
                      sx={{ maxWidth: 110 }}
                    />
                  )}
                </TableCell>

                {/* Total vendido ✅ (coherente con billableQty) */}
                <TableCell align="right">{money(totalSold)}</TableCell>

                {/* Pagado */}
                <TableCell align="center">
                  <Chip
                    size="small"
                    label={paid ? "Sí" : "No"}
                    color={paid ? "success" : "warning"}
                    variant="outlined"
                  />
                </TableCell>

                {(editable || showGroupActions) && (
                  <TableCell align="right">
                    {/* edición */}
                    {editable && (
                      <>
                        {!editing ? (
                          <Tooltip title={allowEdit ? "Editar" : "No permitido"}>
                            <span>
                              <IconButton
                                size="small"
                                disabled={!allowEdit}
                                onClick={() => onEditToggle?.(it)}
                              >
                                <EditNoteIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        ) : (
                          <Stack
                            direction="row"
                            spacing={0.5}
                            justifyContent="flex-end"
                          >
                            <Tooltip title="Guardar">
                              <IconButton
                                size="small"
                                onClick={() => onEditConfirm?.(it)}
                              >
                                <SaveIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancelar">
                              <IconButton
                                size="small"
                                onClick={() => onEditToggle?.(it)}
                              >
                                <CloseIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        )}
                      </>
                    )}

                    {/* acciones del grupo (detalle) */}
                    {showGroupActions && !editing && (
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="flex-end"
                        sx={{ mt: editable ? 0.5 : 0 }}
                      >
                        <Tooltip
                          title={
                            canGroupActions
                              ? "Sacar del grupo"
                              : "Falta groupId en el item"
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              disabled={!canGroupActions}
                              onClick={() => onRemoveFromGroup?.(it)}
                            >
                              🗑️
                            </IconButton>
                          </span>
                        </Tooltip>

                        <Tooltip
                          title={
                            canGroupActions
                              ? "Mover a otro grupo"
                              : "Falta groupId en el item"
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              disabled={!canGroupActions}
                              onClick={() => onMoveToGroup?.(it)}
                            >
                              🔁
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Stack>
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })}

          {(!items || items.length === 0) && (
            <TableRow>
              <TableCell
                colSpan={
                  (selectable ? 10 : 9) + (editable || showGroupActions ? 1 : 0)
                }
              >
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Sin ítems.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
}

// =======================
// Component
// =======================
export default function CustomerOrderGroupsDemo() {
  const isMobile = useMediaQuery("(max-width:900px)");
  const { user, toast: toastAuth } = useAuth();
  const isProgrammer = user?.loginRol === "Programador";

  // data
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]); // cada order trae items
  const [groups, setGroups] = useState([]); // ItemGroup
  const [payments, setPayments] = useState([]); // Payment (por groupId)

  // ui
  const [loading, setLoading] = useState(false);
  const [uiMsg, setUiMsg] = useState(null);

  // selection
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  // ✅ selección para crear grupos (pendientes y pagados sin grupo)
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [selectedPaidItemIds, setSelectedPaidItemIds] = useState([]);

  // tabs: 0=pendientes sin grupo, 1=pagados sin grupo, 2=grupos, 3=detalle
  const [tab, setTab] = useState(0);

  // dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [createMode, setCreateMode] = useState("pending"); // "pending" | "paid"
  const [groupConcept, setGroupConcept] = useState("");

  const [payOpen, setPayOpen] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payDate, setPayDate] = useState(todayISO());
  const [payNote, setPayNote] = useState("Abono");
  const [payMethod, setPayMethod] = useState("efectivo");

  // ✅ edición por ítem
  const [editMode, setEditMode] = useState({}); // { [itemId]: boolean }
  const [editFields, setEditFields] = useState({}); // { [itemId]: { qty, price, damagedQty, giftQty, replacedQty } }

  // ✅ mover ítem a otro grupo / sacar del grupo
  const [moveOpen, setMoveOpen] = useState(false);
  const [moveItem, setMoveItem] = useState(null);
  const [moveToGroupId, setMoveToGroupId] = useState("");

  // ✅ editar concepto grupo
  const [groupEditOpen, setGroupEditOpen] = useState(false);
  const [groupEditConcept, setGroupEditConcept] = useState("");

  // =======================
  // Load
  // =======================
  const loadWorkbench = async (keepSelection = true) => {
    try {
      setLoading(true);
      setUiMsg(null);

      const res = await getFinanceWorkbenchAllRequest();
      const data = res?.data || {};

      const nextCustomers = Array.isArray(data.customers) ? data.customers : [];
      const nextOrders = Array.isArray(data.orders) ? data.orders : [];
      const nextGroups = Array.isArray(data.groups) ? data.groups : [];
      const nextPayments = Array.isArray(data.payments) ? data.payments : [];

      setCustomers(nextCustomers);
      setOrders(nextOrders);
      setGroups(nextGroups);
      setPayments(nextPayments);

      if (!keepSelection || !selectedCustomerId) {
        setSelectedCustomerId(nextCustomers[0]?.id ?? null);
        setSelectedGroupId(null);
        setSelectedItemIds([]);
        setSelectedPaidItemIds([]);
        setEditMode({});
        setEditFields({});
        return;
      }

      const stillExists = nextCustomers.some((c) => c.id === selectedCustomerId);
      if (!stillExists) {
        setSelectedCustomerId(nextCustomers[0]?.id ?? null);
        setSelectedGroupId(null);
        setSelectedItemIds([]);
        setSelectedPaidItemIds([]);
        setEditMode({});
        setEditFields({});
      }
    } catch (err) {
      console.error("loadWorkbench:", err);
      setUiMsg({
        type: "error",
        text: err?.response?.data?.message || "Error cargando cobranzas",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkbench(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =======================
  // Derived
  // =======================
  const customer = useMemo(
    () => customers.find((c) => c.id === selectedCustomerId) || null,
    [customers, selectedCustomerId]
  );

  const customerOrders = useMemo(
    () => orders.filter((o) => o.customerId === selectedCustomerId),
    [orders, selectedCustomerId]
  );

  // items del cliente (aplanados)
  const customerItems = useMemo(() => {
    const out = [];
    for (const o of customerOrders) {
      const itemsArr = Array.isArray(o.items) ? o.items : [];
      for (const it of itemsArr) {
        out.push({
          ...it,
          orderId: o.id,
          orderDate: o.date,

          // ✅ normalizamos nombres comunes
          qty: it.qty ?? it.quantity ?? 0,
          price: it.price ?? 0,
          product: it.product ?? it.productName ?? it.name ?? "(sin nombre)",

          // ✅ campos de cierre (si backend no manda, quedan en 0)
          damagedQty: it.damagedQty ?? 0,
          giftQty: it.giftQty ?? 0,
          replacedQty: it.replacedQty ?? 0,
        });
      }
    }
    return out;
  }, [customerOrders]);

  // ✅ Pendientes y sin grupo
  const itemsUngrouped = useMemo(
    () => customerItems.filter((it) => !it.paidAt && !getItemGroupId(it)),
    [customerItems]
  );

  // ✅ Pagados y sin grupo (histórico)
  const itemsPaidUngrouped = useMemo(
    () => customerItems.filter((it) => !!it.paidAt && !getItemGroupId(it)),
    [customerItems]
  );

  const customerGroups = useMemo(
    () => groups.filter((g) => g.customerId === selectedCustomerId),
    [groups, selectedCustomerId]
  );

  // ✅ itemsByGroup (requiere groupId real por item: itemGroupId o groupId)
  const itemsByGroup = useMemo(() => {
    const map = new Map();
    for (const it of customerItems) {
      const gid = it?.itemGroupId ?? it?.groupId; // ⚠️ real
      if (!gid) continue;
      if (!map.has(gid)) map.set(gid, []);
      map.get(gid).push(it);
    }
    for (const [gid, arr] of map.entries()) {
      map.set(
        gid,
        arr
          .slice()
          .sort(
            (a, b) =>
              a.orderId - b.orderId ||
              String(a.product).localeCompare(String(b.product), "es")
          )
      );
    }
    return map;
  }, [customerItems]);

  // ✅ Total cobrable (VENDIDO)
  const getBillableQty = (it) => {
    const delivered = toNum(it.qty ?? it.quantity, 0);
    const damaged = toNum(it.damagedQty, 0);
    const gift = toNum(it.giftQty, 0);
    // replaced no descuenta dinero
    return Math.max(0, delivered - damaged - gift);
  };

  const itemLineTotal = (it) =>
    Number((getBillableQty(it) * toNum(it.price, 0)).toFixed(2));

  const groupTotal = (groupId) => {
    const arr = itemsByGroup.get(groupId) || [];
    return Number(sum(arr, (it) => itemLineTotal(it)).toFixed(2));
  };

  const groupPaid = (groupId) => {
    const arr = payments.filter((p) => p.groupId === groupId);
    return Number(sum(arr, (p) => p.amount).toFixed(2));
  };

  const groupRemaining = (groupId) => {
    const rem = groupTotal(groupId) - groupPaid(groupId);
    return Number(Math.max(0, rem).toFixed(2));
  };

  const groupStatus = (groupId) => {
    const total = groupTotal(groupId);
    const paid = groupPaid(groupId);
    if (total <= 0) return "empty";
    if (paid <= 0) return "pending";
    if (paid >= total - 0.0001) return "paid";
    return "partial";
  };

  const selectedGroup = useMemo(
    () =>
      selectedGroupId ? groups.find((g) => g.id === selectedGroupId) : null,
    [groups, selectedGroupId]
  );

  const selectedGroupItems = useMemo(
    () => (selectedGroupId ? itemsByGroup.get(selectedGroupId) || [] : []),
    [itemsByGroup, selectedGroupId]
  );

  const selectedGroupPayments = useMemo(
    () => payments.filter((p) => p.groupId === selectedGroupId),
    [payments, selectedGroupId]
  );

  const selectedItemsTotal = useMemo(() => {
    const selected = itemsUngrouped.filter((it) =>
      selectedItemIds.includes(it.id)
    );
    return Number(sum(selected, (it) => itemLineTotal(it)).toFixed(2));
  }, [itemsUngrouped, selectedItemIds]);

  const selectedPaidItemsTotal = useMemo(() => {
    const selected = itemsPaidUngrouped.filter((it) =>
      selectedPaidItemIds.includes(it.id)
    );
    return Number(sum(selected, (it) => itemLineTotal(it)).toFixed(2));
  }, [itemsPaidUngrouped, selectedPaidItemIds]);

  const customerPending = useMemo(() => {
    if (customer && typeof customer.debtTotal !== "undefined") {
      return Number(customer.debtTotal || 0);
    }
    const groupRemainingSum = Number(
      sum(customerGroups, (g) => groupRemaining(g.id)).toFixed(2)
    );
    const ungroupedSum = Number(
      sum(itemsUngrouped, (it) => itemLineTotal(it)).toFixed(2)
    );
    return Number((groupRemainingSum + ungroupedSum).toFixed(2));
  }, [customer, customerGroups, itemsUngrouped, payments, itemsByGroup]);

  // ✅ RESUMEN PENDIENTE POR PRODUCTO (cantidad cobrable y total $)
  const pendingProductSummary = useMemo(() => {
    const pendingItems = customerItems.filter((it) => !it.paidAt);

    const byProduct = new Map();
    let grandTotal = 0;
    let grandQty = 0;

    for (const it of pendingItems) {
      const qty = getBillableQty(it);
      const price = toNum(it.price, 0);
      const total = Number((qty * price).toFixed(2));
      if (qty <= 0) continue;

      grandTotal = Number((grandTotal + total).toFixed(2));
      grandQty = Number((grandQty + qty).toFixed(2));

      const key = String(it.product || "(sin nombre)");
      if (!byProduct.has(key)) byProduct.set(key, { product: key, qty: 0, total: 0 });

      const agg = byProduct.get(key);
      agg.qty = Number((agg.qty + qty).toFixed(2));
      agg.total = Number((agg.total + total).toFixed(2));
    }

    const rows = Array.from(byProduct.values()).sort((a, b) => b.total - a.total);
    return { rows, grandTotal, grandQty };
  }, [customerItems]);

  // =======================
  // TXT builders
  // =======================
  const buildReportTxtByProduct = ({ title, customer, items }) => {
    const byProduct = new Map();
    let total = 0;
    let itemsCount = 0;

    for (const it of items || []) {
      const qty = getBillableQty(it);
      const price = toNum(it.price, 0);
      const line = Number((qty * price).toFixed(2));
      if (qty <= 0) continue;

      total = Number((total + line).toFixed(2));
      itemsCount += 1;

      const key = String(it.product || "(sin nombre)");
      if (!byProduct.has(key)) byProduct.set(key, { product: key, qty: 0, total: 0 });

      const agg = byProduct.get(key);
      agg.qty = Number((agg.qty + qty).toFixed(2));
      agg.total = Number((agg.total + line).toFixed(2));
    }

    const productsSorted = Array.from(byProduct.values()).sort((a, b) => b.total - a.total);
    const now = todayISO();

    const txt = [
      title,
      `Fecha: ${now}`,
      `Cliente: ${customer?.name || "—"}`,
      `Tel: ${customer?.phone || "—"}`,
      "",
      "RESUMEN",
      `Total: ${money(total)}`,
      `Ítems considerados: ${itemsCount}`,
      "",
      "DETALLE POR PRODUCTO",
      ...(productsSorted.length
        ? productsSorted.map(
            (p) => `- ${p.product} | Cantidad: ${p.qty} | Total: ${money(p.total)}`
          )
        : ["(Sin datos)"]),
      "",
    ].join("\r\n");

    return { txt, total };
  };

  // =======================
  // Actions
  // =======================
  const toggleSelectItem = (itemId) => {
    setSelectedItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((x) => x !== itemId) : [...prev, itemId]
    );
  };

  const toggleSelectPaidItem = (itemId) => {
    setSelectedPaidItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((x) => x !== itemId) : [...prev, itemId]
    );
  };

  const resetOnCustomerChange = (customerId) => {
    setSelectedCustomerId(customerId);
    setSelectedGroupId(null);
    setSelectedItemIds([]);
    setSelectedPaidItemIds([]);
    setUiMsg(null);
    setTab(0);
    setEditMode({});
    setEditFields({});
  };

  const openCreateGroup = (mode) => {
    setUiMsg(null);
    setCreateMode(mode);
    setGroupConcept(
      mode === "paid"
        ? `Grupo HISTÓRICO de ${customer?.name || ""} (${todayISO()})`.trim()
        : `Grupo de ${customer?.name || ""} (${todayISO()})`.trim()
    );
    setCreateOpen(true);
  };

  const createGroup = async () => {
    try {
      if (!selectedCustomerId) {
        setUiMsg({ type: "error", text: "Selecciona un cliente." });
        return;
      }

      const selectedIds = createMode === "paid" ? selectedPaidItemIds : selectedItemIds;
      if (selectedIds.length === 0) {
        setUiMsg({ type: "error", text: "Selecciona al menos un ítem." });
        return;
      }

      // valida que no estén ya agrupados
      const badGrouped = customerItems.find(
        (it) => selectedIds.includes(it.id) && getItemGroupId(it)
      );
      if (badGrouped) {
        setUiMsg({ type: "error", text: `El ítem #${badGrouped.id} ya está en un grupo.` });
        return;
      }

      // valida según modo
      if (createMode === "pending") {
        const paidBad = customerItems.find((it) => selectedIds.includes(it.id) && it.paidAt);
        if (paidBad) {
          setUiMsg({ type: "error", text: `El ítem #${paidBad.id} ya está pagado.` });
          return;
        }
      } else {
        const notPaidBad = customerItems.find((it) => selectedIds.includes(it.id) && !it.paidAt);
        if (notPaidBad) {
          setUiMsg({ type: "error", text: `El ítem #${notPaidBad.id} NO está pagado.` });
          return;
        }
      }

      setLoading(true);
      setUiMsg(null);

      const res = await createItemGroupRequest({
        customerId: selectedCustomerId,
        itemIds: selectedIds,
        concept: groupConcept,
      });

      const createdId = res?.data?.groupId ?? res?.data?.id ?? null;

      await loadWorkbench(true);

      setCreateOpen(false);
      setSelectedItemIds([]);
      setSelectedPaidItemIds([]);

      if (createdId) {
        setSelectedGroupId(createdId);
        setTab(3);
      }

      setUiMsg({
        type: "success",
        text: createMode === "paid" ? "Grupo HISTÓRICO creado ✅" : "Grupo creado ✅ Ahora puedes registrar abonos.",
      });
    } catch (err) {
      console.error("createGroup:", err);
      setUiMsg({
        type: "error",
        text: err?.response?.data?.message || "Error creando grupo",
      });
    } finally {
      setLoading(false);
    }
  };

  const openPay = () => {
    if (!selectedGroupId) return;
    setUiMsg(null);
    setPayAmount("");
    setPayDate(todayISO());
    setPayNote("Abono");
    setPayMethod("efectivo");
    setPayOpen(true);
  };

  const confirmPay = async () => {
    try {
      if (!selectedGroupId) return;

      const amt = Number(payAmount);
      if (!Number.isFinite(amt) || amt <= 0) {
        setUiMsg({ type: "error", text: "Monto inválido." });
        return;
      }

      const rem = groupRemaining(selectedGroupId);
      if (amt > rem + 0.0001) {
        setUiMsg({ type: "error", text: `El abono excede el saldo. Saldo: ${money(rem)}` });
        return;
      }

      setLoading(true);
      setUiMsg(null);

      const res = await payItemGroupRequest(selectedGroupId, {
        amount: amt,
        date: payDate,
        note: payNote,
        method: payMethod,
      });

      const closed = !!res?.data?.closed;

      await loadWorkbench(true);

      setPayOpen(false);

      setUiMsg({
        type: "success",
        text: closed ? "Grupo pagado ✅ Se marcaron los ítems como pagados." : "Abono registrado ✅",
      });
    } catch (err) {
      console.error("confirmPay:", err);
      setUiMsg({
        type: "error",
        text: err?.response?.data?.message || "Error registrando abono",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edición (qty/price + cierre)
  const toggleEditItem = (item) => {
    const itemId = item.id;
    setEditMode((prev) => {
      const next = !prev[itemId];
      if (next) {
        setEditFields((fprev) => ({
          ...fprev,
          [itemId]: {
            qty: String(item.qty ?? ""),
            price: String(item.price ?? ""),

            // ✅ campos de cierre
            damagedQty: String(item.damagedQty ?? 0),
            giftQty: String(item.giftQty ?? 0),
            replacedQty: String(item.replacedQty ?? 0),
          },
        }));
      }
      return { ...prev, [itemId]: next };
    });
  };

  const setItemField = (itemId, field, value) => {
    setEditFields((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], [field]: value },
    }));
  };

  const confirmEditItem = async (item) => {
    const itemId = item.id;
    const f = editFields[itemId] || {};

    const qty = Math.max(0, Number(f.qty));
    const price = Math.max(0, Number(f.price));

    const damagedQty = Math.max(0, Number(f.damagedQty));
    const giftQty = Math.max(0, Number(f.giftQty));
    const replacedQty = Math.max(0, Number(f.replacedQty));

    if (![qty, price, damagedQty, giftQty, replacedQty].every(Number.isFinite)) {
      setUiMsg({ type: "error", text: "Hay valores inválidos." });
      return;
    }

    // ✅ consistencia mínima: dañado + yapa no puede superar entregado
    // (cambiado es informativo; si tú lo sincronizas con dañado ya queda cubierto)
    const sumClose = damagedQty + giftQty;
    if (sumClose > qty + 1e-9) {
      setUiMsg({
        type: "error",
        text: `La suma (dañado+yapa=${sumClose}) no puede ser mayor que entregado (${qty}).`,
      });
      return;
    }

    // 🔒 recomendado: no editar pagados (evita descuadrar ingresos)
    if (item.paidAt) {
      setUiMsg({ type: "error", text: "No se puede editar un ítem pagado." });
      return;
    }

    await toastAuth({
      promise: updateOrderItemRequest(itemId, {
        quantity: qty,
        price,
        damagedQty,
        giftQty,
        replacedQty,
      }),
      onSuccess: async () => {
        setEditMode((prev) => ({ ...prev, [itemId]: false }));
        await loadWorkbench(true);
        return { title: "Ítem", description: "Actualizado (entregado + cierre)" };
      },
      onError: (res) => ({
        title: "Ítem",
        description: res?.response?.data?.message || "No se pudo actualizar",
      }),
    });
  };

  // ✅ Sacar del grupo
  const handleRemoveFromGroup = async (item) => {
    const gid = item?.itemGroupId ?? item?.groupId;
    if (!gid) {
      setUiMsg({ type: "error", text: "Falta itemGroupId/groupId en el item. Haz que backend lo envíe." });
      return;
    }

    await toastAuth({
      promise: deleteItemGroupRequest(gid, item.id),
      onSuccess: async () => {
        await loadWorkbench(true);
        return { title: "Grupo", description: "Ítem removido del grupo" };
      },
      onError: (res) => ({
        title: "Grupo",
        description: res?.response?.data?.message || "No se pudo remover",
      }),
    });
  };

  // ✅ Mover a otro grupo
  const openMoveDialog = (item) => {
    setMoveItem(item);
    setMoveToGroupId("");
    setMoveOpen(true);
  };

  const confirmMoveToGroup = async () => {
    if (!moveItem) return;

    const fromGroupId = moveItem?.itemGroupId ?? moveItem?.groupId;
    if (!fromGroupId) {
      setUiMsg({ type: "error", text: "Falta itemGroupId/groupId en el item. Haz que backend lo envíe." });
      return;
    }
    if (!moveToGroupId) {
      setUiMsg({ type: "error", text: "Selecciona el grupo destino." });
      return;
    }

    await toastAuth({
      promise: moveItemBetweenGroupsRequest({
        itemId: moveItem.id,
        fromGroupId,
        toGroupId: Number(moveToGroupId),
      }),
      onSuccess: async () => {
        setMoveOpen(false);
        setMoveItem(null);
        await loadWorkbench(true);
        return { title: "Grupo", description: "Ítem movido al nuevo grupo" };
      },
      onError: (res) => ({
        title: "Grupo",
        description: res?.response?.data?.message || "No se pudo mover",
      }),
    });
  };

  // ✅ Editar concepto del grupo
  const openEditGroupConcept = () => {
    if (!selectedGroupId) return;
    setGroupEditConcept(selectedGroup?.concept || "");
    setGroupEditOpen(true);
  };

  const confirmEditGroupConcept = async () => {
    if (!selectedGroupId) return;
    const concept = String(groupEditConcept || "").trim();
    if (!concept) {
      setUiMsg({ type: "error", text: "El concepto no puede estar vacío." });
      return;
    }

    await toastAuth({
      promise: updateItemGroupRequest(selectedGroupId, { concept }),
      onSuccess: async () => {
        setGroupEditOpen(false);
        await loadWorkbench(true);
        return { title: "Grupo", description: "Concepto actualizado" };
      },
      onError: (res) => ({
        title: "Grupo",
        description: res?.response?.data?.message || "No se pudo actualizar",
      }),
    });
  };

  // =======================
  // Render
  // =======================
  return (
    <Box sx={{ p: { xs: 1, md: 2 }, maxWidth: 1400, mx: "auto" }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h5">Cobranzas (por ítems)</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Cliente: <b>{customer?.name || "—"}</b> · Pendiente:{" "}
            <b>{money(customerPending)}</b>
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} justifyContent={{ xs: "flex-start", md: "flex-end" }}>
          <Button variant="outlined" disabled={loading} onClick={() => loadWorkbench(true)}>
            Refrescar
          </Button>

          {/* ✅ TXT TOTAL (todo lo pendiente) */}
          <Button
            variant="contained"
            disabled={!customer || loading || customerItems.length === 0}
            onClick={() => {
              const pending = customerItems.filter((it) => !it.paidAt);
              const { txt, total } = buildReportTxtByProduct({
                title: "REPORTE TOTAL PENDIENTE (POR PRODUCTO)",
                customer,
                items: pending,
              });

              const filename = `deuda_total_${safeFileName(customer?.name)}_${todayISO()}.txt`;
              downloadTextFile(filename, txt);

              if (total <= 0) {
                setUiMsg({ type: "info", text: "El cliente no tiene deuda pendiente (se descargó igual)." });
              }
            }}
          >
            Descargar deuda total (TXT)
          </Button>
        </Stack>
      </Stack>

      {loading && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Cargando...
        </Alert>
      )}

      {uiMsg && (
        <Alert severity={uiMsg.type} sx={{ mb: 2 }}>
          {uiMsg.text}
        </Alert>
      )}

      {/* Clientes */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Clientes (ordenados por deuda)
          </Typography>

          {customers.length === 0 ? (
            <Alert severity="info">No hay clientes.</Alert>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Stack direction="row" spacing={1} sx={{ minWidth: "max-content" }}>
                {customers.map((c) => {
                  const active = c.id === selectedCustomerId;
                  const debt = Number(c.debtTotal || 0);
                  return (
                    <Chip
                      key={c.id}
                      clickable
                      onClick={() => resetOnCustomerChange(c.id)}
                      color={active ? "primary" : debt > 0 ? "warning" : "default"}
                      variant={active ? "filled" : "outlined"}
                      label={`${c.name} · ${money(debt)}`}
                      sx={{ fontWeight: 700 }}
                    />
                  );
                })}
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* ✅ Resumen por producto (pendiente cobrable) */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1} justifyContent="space-between">
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                Resumen pendiente por producto (cobrable)
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Total cobrable: <b>{money(pendingProductSummary.grandTotal)}</b> · Cantidad:{" "}
                <b>{pendingProductSummary.grandQty}</b>
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label={`Productos: ${pendingProductSummary.rows.length}`} variant="outlined" />
              <Chip label={`Pendiente: ${money(pendingProductSummary.grandTotal)}`} variant="outlined" />
            </Stack>
          </Stack>

          <Divider sx={{ my: 1 }} />

          {pendingProductSummary.rows.length === 0 ? (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Sin deuda pendiente.
            </Typography>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small" sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Cantidad (cobrable)</TableCell>
                    <TableCell align="right">Total ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingProductSummary.rows.map((r) => (
                    <TableRow key={r.product}>
                      <TableCell>{r.product}</TableCell>
                      <TableCell align="right">{r.qty}</TableCell>
                      <TableCell align="right">{money(r.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card variant="outlined">
        <CardContent sx={{ p: 0 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
          >
            <Tab label={`Pendientes sin grupo (${itemsUngrouped.length})`} />
            <Tab label={`Pagados sin grupo (${itemsPaidUngrouped.length})`} />
            <Tab label={`Grupos (${customerGroups.length})`} />
            <Tab label="Detalle" />
          </Tabs>

          <Divider />

          {/* TAB 0: Pendientes sin grupo (por pedido) */}
          {tab === 0 && (
            <Box sx={{ p: 2 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                sx={{ mb: 2 }}
              >
                <Typography variant="subtitle1">Ítems pendientes sin grupo</Typography>

                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  {/* ✅ TXT sin grupo */}
                  <Button
                    variant="outlined"
                    disabled={loading || itemsUngrouped.length === 0}
                    onClick={() => {
                      const { txt } = buildReportTxtByProduct({
                        title: "REPORTE PENDIENTE SIN GRUPO (POR PRODUCTO)",
                        customer,
                        items: itemsUngrouped,
                      });
                      const filename = `pendiente_sin_grupo_${safeFileName(customer?.name)}_${todayISO()}.txt`;
                      downloadTextFile(filename, txt);
                    }}
                  >
                    TXT sin grupo
                  </Button>

                  <Button
                    variant="contained"
                    disabled={loading || itemsUngrouped.length === 0}
                    onClick={() => openCreateGroup("pending")}
                  >
                    Crear grupo
                  </Button>
                </Stack>
              </Stack>

              {customerOrders.length === 0 ? (
                <Alert severity="info">Este cliente no tiene pedidos.</Alert>
              ) : itemsUngrouped.length === 0 ? (
                <Alert severity="info">No hay ítems pendientes sin grupo.</Alert>
              ) : (
                <Stack spacing={1}>
                  {customerOrders
                    .slice()
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((o) => {
                      const items = (o.items || [])
                        .map((it) => ({
                          ...it,
                          qty: it.qty ?? it.quantity ?? 0,
                          product: it.product ?? it.productName ?? it.name ?? "(sin nombre)",
                          damagedQty: it.damagedQty ?? 0,
                          giftQty: it.giftQty ?? 0,
                          replacedQty: it.replacedQty ?? 0,
                        }))
                        .filter((it) => !it.paidAt);

                      if (items.length === 0) return null;

                      const selectableItems = items.filter((it) => !getItemGroupId(it));
                      const hasSelectable = selectableItems.length > 0;

                      const orderPendingTotal = Number(sum(items, (it) => itemLineTotal(it)).toFixed(2));

                      return (
                        <Accordion key={o.id} variant="outlined" disableGutters>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ width: "100%", pr: 1 }}>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography sx={{ fontWeight: 800 }}>Pedido #{o.id}</Typography>
                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                  Día: {dayLabel(o.date)}
                                </Typography>
                              </Box>
                              <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
                                <Chip size="small" label={`Pendiente ${money(orderPendingTotal)}`} variant="outlined" />
                                <Chip
                                  size="small"
                                  label={hasSelectable ? "Tiene ítems sin grupo" : "Todo ya en grupo"}
                                  color={hasSelectable ? "warning" : "default"}
                                  variant="outlined"
                                />
                              </Stack>
                            </Stack>
                          </AccordionSummary>

                          <AccordionDetails>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              Ítems pendientes (selecciona los SIN GRUPO)
                            </Typography>

                            <Paper variant="outlined" sx={{ p: 1 }}>
                              <ItemsTable
                                items={items}
                                selectable
                                selectedItemIds={selectedItemIds}
                                onToggleItem={toggleSelectItem}
                                isItemSelectable={(it) => !it.paidAt && !getItemGroupId(it)}
                                editable={isProgrammer}
                                canEditItem={(it) => isProgrammer && !it.paidAt}
                                isEditingItem={(id) => !!editMode[id]}
                                getEditFields={(id) => editFields[id] || {}}
                                onEditToggle={(it) => toggleEditItem(it)}
                                onEditFieldChange={(id, field, value) => setItemField(id, field, value)}
                                onEditConfirm={(it) => confirmEditItem(it)}
                              />
                            </Paper>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })}
                </Stack>
              )}

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                sx={{ mt: 2 }}
              >
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Selecciona ítems pendientes sin grupo para crear un grupo.
                </Typography>

                <Stack direction="row" spacing={1}>
                  <Chip label={`Seleccionados: ${selectedItemIds.length}`} variant="outlined" />
                  <Chip label={`Total: ${money(selectedItemsTotal)}`} variant="outlined" />
                </Stack>
              </Stack>
            </Box>
          )}

          {/* TAB 1: Pagados sin grupo */}
          {tab === 1 && (
            <Box sx={{ p: 2 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                sx={{ mb: 2 }}
              >
                <Typography variant="subtitle1">
                  Ítems pagados sin grupo (histórico) — agrupados por pedido
                </Typography>

                <Button
                  variant="contained"
                  disabled={loading || itemsPaidUngrouped.length === 0}
                  onClick={() => openCreateGroup("paid")}
                >
                  Crear grupo (pagados)
                </Button>
              </Stack>

              {customerOrders.length === 0 ? (
                <Alert severity="info">Este cliente no tiene pedidos.</Alert>
              ) : itemsPaidUngrouped.length === 0 ? (
                <Alert severity="info">No hay ítems pagados sin grupo.</Alert>
              ) : (
                <Stack spacing={1}>
                  {customerOrders
                    .slice()
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((o) => {
                      const paidItems = (o.items || [])
                        .map((it) => ({
                          ...it,
                          qty: it.qty ?? it.quantity ?? 0,
                          product: it.product ?? it.productName ?? it.name ?? "(sin nombre)",
                          damagedQty: it.damagedQty ?? 0,
                          giftQty: it.giftQty ?? 0,
                          replacedQty: it.replacedQty ?? 0,
                        }))
                        .filter((it) => !!it.paidAt);

                      if (paidItems.length === 0) return null;

                      const selectablePaid = paidItems.filter((it) => !getItemGroupId(it));
                      const hasSelectable = selectablePaid.length > 0;

                      const orderPaidTotal = Number(sum(paidItems, (it) => itemLineTotal(it)).toFixed(2));

                      return (
                        <Accordion key={o.id} variant="outlined" disableGutters>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ width: "100%", pr: 1 }}>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography sx={{ fontWeight: 800 }}>Pedido #{o.id}</Typography>
                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                  Día: {dayLabel(o.date)}
                                </Typography>
                              </Box>

                              <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
                                <Chip size="small" label={`Pagado ${money(orderPaidTotal)}`} variant="outlined" />
                                <Chip
                                  size="small"
                                  label={hasSelectable ? "Tiene pagados sin grupo" : "Todo ya en grupo"}
                                  color={hasSelectable ? "warning" : "default"}
                                  variant="outlined"
                                />
                              </Stack>
                            </Stack>
                          </AccordionSummary>

                          <AccordionDetails>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              Ítems pagados (selecciona los PAGADOS SIN GRUPO)
                            </Typography>

                            <Paper variant="outlined" sx={{ p: 1 }}>
                              <ItemsTable
                                items={paidItems}
                                selectable
                                selectedItemIds={selectedPaidItemIds}
                                onToggleItem={toggleSelectPaidItem}
                                isItemSelectable={(it) => !!it.paidAt && !getItemGroupId(it)}
                              />
                            </Paper>

                            <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 1 }}>
                              * Solo se pueden seleccionar los ítems pagados que NO estén en un grupo.
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })}
                </Stack>
              )}

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                sx={{ mt: 2 }}
              >
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Selecciona ítems pagados sin grupo para crear un grupo histórico.
                </Typography>

                <Stack direction="row" spacing={1}>
                  <Chip label={`Seleccionados: ${selectedPaidItemIds.length}`} variant="outlined" />
                  <Chip label={`Total: ${money(selectedPaidItemsTotal)}`} variant="outlined" />
                </Stack>
              </Stack>
            </Box>
          )}

          {/* TAB 2: Grupos */}
          {tab === 2 && (
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Grupos del cliente
              </Typography>

              {customerGroups.length === 0 ? (
                <Alert severity="info">Aún no hay grupos para este cliente.</Alert>
              ) : (
                <Stack spacing={1}>
                  {customerGroups
                    .slice()
                    .sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0))
                    .map((g) => {
                      const total = groupTotal(g.id);
                      const paid = groupPaid(g.id);
                      const rem = groupRemaining(g.id);
                      const st = groupStatus(g.id);

                      const active = g.id === selectedGroupId;
                      const chip =
                        st === "paid"
                          ? { label: "Pagado", color: "success" }
                          : st === "partial"
                          ? { label: "Parcial", color: "warning" }
                          : { label: "Pendiente", color: "default" };

                      return (
                        <Card
                          key={g.id}
                          variant="outlined"
                          sx={{
                            borderColor: active ? "primary.main" : "divider",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setSelectedGroupId(g.id);
                            setTab(3);
                          }}
                        >
                          <CardContent>
                            <Stack
                              direction={{ xs: "column", sm: "row" }}
                              spacing={1}
                              justifyContent="space-between"
                              alignItems={{ xs: "stretch", sm: "center" }}
                            >
                              <Box sx={{ minWidth: 0 }}>
                                <Typography sx={{ fontWeight: 900 }}>
                                  #{g.id} · {g.concept}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                  Estado: {g.status || "—"} · Creado: {g.createdAt || g.date || "—"}
                                </Typography>
                              </Box>

                              <Stack direction="row" spacing={1} flexWrap="wrap">
                                <Chip size="small" label={chip.label} color={chip.color} variant="outlined" />
                                <Chip size="small" label={`Total ${money(total)}`} variant="outlined" />
                                <Chip size="small" label={`Abonado ${money(paid)}`} variant="outlined" />
                                <Chip
                                  size="small"
                                  label={`Saldo ${money(rem)}`}
                                  color={rem > 0 ? "warning" : "success"}
                                  variant="outlined"
                                />
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      );
                    })}
                </Stack>
              )}
            </Box>
          )}

          {/* TAB 3: Detalle de grupo */}
          {tab === 3 && (
            <Box sx={{ p: 2 }}>
              {!selectedGroupId ? (
                <Alert severity="info">Selecciona un grupo en la pestaña “Grupos”.</Alert>
              ) : (
                <>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", sm: "center" }}
                    sx={{ mb: 2 }}
                  >
                    <Box>
                      <Typography variant="subtitle1">
                        Grupo #{selectedGroupId} · {selectedGroup?.concept}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        Total: <b>{money(groupTotal(selectedGroupId))}</b> · Abonado:{" "}
                        <b>{money(groupPaid(selectedGroupId))}</b> · Saldo:{" "}
                        <b>{money(groupRemaining(selectedGroupId))}</b>
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                      {/* ✅ TXT por grupo */}
                      <Button
                        variant="outlined"
                        disabled={loading || !selectedGroupId}
                        onClick={() => {
                          const { txt } = buildReportTxtByProduct({
                            title: `REPORTE DEL GRUPO #${selectedGroupId} (POR PRODUCTO)`,
                            customer,
                            items: selectedGroupItems,
                          });
                          const filename = `grupo_${selectedGroupId}_${safeFileName(customer?.name)}_${todayISO()}.txt`;
                          downloadTextFile(filename, txt);
                        }}
                      >
                        TXT del grupo
                      </Button>

                      {isProgrammer && (
                        <Button variant="outlined" onClick={openEditGroupConcept} disabled={loading}>
                          Editar grupo
                        </Button>
                      )}

                      <Button
                        variant="contained"
                        disabled={loading || groupStatus(selectedGroupId) === "paid"}
                        onClick={openPay}
                      >
                        Abonar
                      </Button>
                    </Stack>
                  </Stack>

                  {/* Items del grupo */}
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Ítems del grupo
                  </Typography>

                  {selectedGroupItems.length === 0 ? (
                    <Alert severity="warning">
                      No hay ítems en este grupo.{" "}
                      <b>
                        Si tus ítems no muestran groupId (itemGroupId), el backend debe enviarlo para que se
                        rendericen aquí.
                      </b>
                    </Alert>
                  ) : (
                    <Paper variant="outlined" sx={{ p: 1, mb: 2 }}>
                      <ItemsTable
                        items={selectedGroupItems}
                        editable={isProgrammer}
                        canEditItem={(it) => isProgrammer && !it.paidAt}
                        isEditingItem={(id) => !!editMode[id]}
                        getEditFields={(id) => editFields[id] || {}}
                        onEditToggle={(it) => toggleEditItem(it)}
                        onEditFieldChange={(id, field, value) => setItemField(id, field, value)}
                        onEditConfirm={(it) => confirmEditItem(it)}
                        showGroupActions={isProgrammer}
                        onRemoveFromGroup={handleRemoveFromGroup}
                        onMoveToGroup={openMoveDialog}
                      />
                    </Paper>
                  )}

                  {/* Pagos */}
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Abonos
                    </Typography>

                    {selectedGroupPayments.length === 0 ? (
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        Aún no hay abonos.
                      </Typography>
                    ) : (
                      <Stack spacing={1}>
                        {selectedGroupPayments
                          .slice()
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map((p) => (
                            <Box key={p.id} sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                              <Typography variant="body2">
                                {p.date} · {p.note || "Abono"} · {p.method || "—"}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 800 }}>
                                {money(p.amount)}
                              </Typography>
                            </Box>
                          ))}
                      </Stack>
                    )}
                  </Paper>
                </>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Crear grupo */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          {createMode === "paid"
            ? "Crear grupo HISTÓRICO con ítems pagados seleccionados"
            : "Crear grupo con ítems pendientes seleccionados"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre del grupo (concepto)"
              value={groupConcept}
              onChange={(e) => setGroupConcept(e.target.value)}
              placeholder={createMode === "paid" ? "Ej: Pagos antiguos (Dic)" : "Ej: Semana 50 (08–14 Dic)"}
            />

            <Alert severity="info">
              {createMode === "paid" ? (
                <>
                  Se crearán grupos solo con <b>ítems pagados</b> y <b>sin grupo</b>.
                </>
              ) : (
                <>
                  Se crearán grupos solo con <b>ítems pendientes</b> y <b>sin grupo</b>.
                </>
              )}{" "}
              Un ítem solo puede estar en un grupo.
            </Alert>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="space-between">
              <Chip
                label={`Ítems seleccionados: ${
                  createMode === "paid" ? selectedPaidItemIds.length : selectedItemIds.length
                }`}
                variant="outlined"
              />
              <Chip
                label={`Total estimado (cobrable): ${
                  createMode === "paid" ? money(selectedPaidItemsTotal) : money(selectedItemsTotal)
                }`}
                variant="outlined"
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} onClick={() => setCreateOpen(false)}>
            Cancelar
          </Button>
          <Button disabled={loading} variant="contained" onClick={createGroup}>
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      {/* Abonar */}
      <Dialog open={payOpen} onClose={() => setPayOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Registrar abono al grupo</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Monto"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              type="number"
              inputProps={{ step: "0.01", min: 0 }}
              helperText={selectedGroupId ? `Saldo actual: ${money(groupRemaining(selectedGroupId))}` : ""}
            />

            <TextField
              label="Fecha"
              type="date"
              value={payDate}
              onChange={(e) => setPayDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Método"
              value={payMethod}
              onChange={(e) => setPayMethod(e.target.value)}
              placeholder="efectivo / transferencia / etc."
            />

            <TextField
              label="Nota"
              value={payNote}
              onChange={(e) => setPayNote(e.target.value)}
              placeholder="Ej: Abono en efectivo"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} onClick={() => setPayOpen(false)}>
            Cancelar
          </Button>
          <Button disabled={loading} variant="contained" onClick={confirmPay}>
            Guardar abono
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mover ítem */}
      <Dialog open={moveOpen} onClose={() => setMoveOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Mover ítem a otro grupo</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Ítem: <b>{moveItem?.product || "—"}</b>
            </Typography>

            <TextField
              select
              label="Grupo destino"
              value={moveToGroupId}
              onChange={(e) => setMoveToGroupId(e.target.value)}
              fullWidth
            >
              {(customerGroups || [])
                .filter((g) => g.id !== (moveItem?.itemGroupId ?? moveItem?.groupId))
                .map((g) => (
                  <MenuItem key={g.id} value={g.id}>
                    #{g.id} · {g.concept}
                  </MenuItem>
                ))}
            </TextField>

            <Alert severity="info">Esto moverá el ítem del grupo actual al grupo seleccionado.</Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMoveOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={confirmMoveToGroup}>
            Mover
          </Button>
        </DialogActions>
      </Dialog>

      {/* Editar concepto */}
      <Dialog open={groupEditOpen} onClose={() => setGroupEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Editar nombre (concepto) del grupo</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Concepto"
              value={groupEditConcept}
              onChange={(e) => setGroupEditConcept(e.target.value)}
              fullWidth
            />
            <Alert severity="info">Cambia el nombre del grupo (solo texto). No modifica ítems ni pagos.</Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGroupEditOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={confirmEditGroupConcept}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
