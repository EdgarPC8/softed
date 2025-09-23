import {
    Container,
    IconButton,
    Button,
    Tooltip,
    TextField,
    DialogContent,
    DialogActions,
    MenuItem,
    FormControlLabel,
    Switch,
    Stack,
    Box,
    Typography,
    Slider,
    Dialog,
    DialogTitle,
  } from "@mui/material";
  import { useEffect, useMemo, useState, useRef } from "react";
  import { Add, Edit, Delete } from "@mui/icons-material";
  import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
  import TablePro from "../../Components/Tables/TablePro";
  import {
    getHomeProductsRequest,
    createHomeProductRequest,
    updateHomeProductRequest,
    deleteHomeProductRequest,
    getAllProducts,
  } from "../../api/inventoryControlRequest";
  import { pathImg } from "../../api/axios";
  import { useAuth } from "../../context/AuthContext";
  import Cropper from "react-easy-crop";
  
  /* ===========================
     Helpers de imagen / crop
  =========================== */
  
  // Canvas a partir del área de recorte del cropper, luego escala a tamaño final
  async function getCroppedBlob(imageSrc, cropAreaPixels, {
    targetW = 800,
    targetH = 800,
    mime = "image/jpeg",
    quality = 0.9,
  } = {}) {
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.crossOrigin = "anonymous";
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = imageSrc;
    });
  
    const { x, y, width, height } = cropAreaPixels;
  
    const canvasCrop = document.createElement("canvas");
    canvasCrop.width = width;
    canvasCrop.height = height;
    const cctx = canvasCrop.getContext("2d");
    cctx.drawImage(img, x, y, width, height, 0, 0, width, height);
  
    const canvasOut = document.createElement("canvas");
    canvasOut.width = targetW;
    canvasOut.height = targetH;
    const octx = canvasOut.getContext("2d");
    octx.drawImage(canvasCrop, 0, 0, width, height, 0, 0, targetW, targetH);
  
    return new Promise((resolve) => canvasOut.toBlob(resolve, mime, quality));
  }
  
  function blobToFile(blob, originalName = "image", mime = "image/jpeg") {
    const base = originalName.replace(/\.[^.]+$/, "");
    const ext = mime === "image/png" ? ".png" : mime === "image/webp" ? ".webp" : ".jpg";
    return new File([blob], base + ext, { type: mime });
  }
  
  /* ===========================
     CropperDialog (modal)
  =========================== */
  function CropperDialog({
    open,
    imageSrc,
    onClose,
    onConfirm,
    aspect = 1,
    targetW = 800,
    targetH = 800,
  }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [areaPixels, setAreaPixels] = useState(null);
  
    useEffect(() => {
      if (!open) {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setAreaPixels(null);
      }
    }, [open]);
  
    const onCropComplete = (_, croppedAreaPixels) => setAreaPixels(croppedAreaPixels);
  
    const handleConfirm = async () => {
      if (!imageSrc || !areaPixels) return;
      const mime = "image/jpeg";
      const quality = 0.9;
      const blob = await getCroppedBlob(imageSrc, areaPixels, { targetW, targetH, mime, quality });
      onConfirm(blob);
    };
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Recortar imagen</DialogTitle>
        <Box sx={{ position: "relative", height: 360, backgroundColor: "#111" }}>
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              restrictPosition
              objectFit="auto-cover"
            />
          )}
        </Box>
  
        <Box sx={{ px: 3, pt: 2 }}>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            Zoom
          </Typography>
          <Slider min={1} max={3} step={0.01} value={zoom} onChange={(_, v) => setZoom(v)} />
        </Box>
  
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleConfirm}>
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  
  /* ===========================
     Formulario (usa cropper)
  =========================== */
  const SECTION_OPTIONS = [
    { value: "home", label: "Portada" },
    { value: "offers", label: "Ofertas" },
    { value: "recommended", label: "Recomendados" },
    { value: "new", label: "Nuevos" },
  ];
  
  function HomeProductForm({ value, onChange, productOptions }) {
    const set = (k, v) => onChange({ ...value, [k]: v });
  
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
  
    const [cropOpen, setCropOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState(null); // objectURL para cropear
    const [aspectKey, setAspectKey] = useState("1:1");
  
    const ASPECTS = {
      "1:1": 1,
      "4:3": 4 / 3,
      "16:9": 16 / 9,
    };
    const TARGETS = {
      "1:1": { w: 800, h: 800 },
      "4:3": { w: 1200, h: 900 },
      "16:9": { w: 1280, h: 720 },
    };
  
    const fileRef = useRef(null);
    const handleChooseFile = () => fileRef.current?.click();
  
    const handleFileChange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setCropOpen(true);
      e.target.value = ""; // para poder elegir el mismo archivo de nuevo
    };
  
    const handleCropConfirm = async (blob) => {
      const { w, h } = TARGETS[aspectKey] || TARGETS["1:1"];
      const mime = "image/jpeg";
      const file = blobToFile(blob, "image", mime);
  
      setSelectedFile(file);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
      set("imageFile", file);
      setCropOpen(false);
  
      if (imageSrc) URL.revokeObjectURL(imageSrc);
      setImageSrc(null);
    };
  
    const handleCropCancel = () => {
      setCropOpen(false);
      if (imageSrc) URL.revokeObjectURL(imageSrc);
      setImageSrc(null);
    };
  
    useEffect(() => {
      return () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        if (imageSrc) URL.revokeObjectURL(imageSrc);
      };
    }, [previewUrl, imageSrc]);
  
    const previewSrc = previewUrl || (value.imageUrl ? `${pathImg}${value.imageUrl}` : null);
  
    const finalProducts = useMemo(
      () => (Array.isArray(productOptions) ? productOptions.filter((p) => p.type === "final") : []),
      [productOptions]
    );
  
    return (
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            label="Nombre (visible)"
            value={value.name || ""}
            onChange={(e) => set("name", e.target.value)}
            required
            fullWidth
          />
  
          <TextField
            label="Descripción"
            value={value.description || ""}
            onChange={(e) => set("description", e.target.value)}
            multiline
            minRows={2}
            fullWidth
          />
  
          <TextField
            label="Producto del catálogo (opcional)"
            value={value.productId ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              set("productId", v === "" ? null : Number(v));
            }}
            select
            fullWidth
          >
            <MenuItem value="">(Sin producto)</MenuItem>
            {finalProducts.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>
  
          <TextField
            label="Nombre de archivo (opcional)"
            placeholder="ej: sandwich-jamon"
            value={value.customFileName || ""}
            onChange={(e) => set("customFileName", e.target.value)}
            helperText="Se usará como base; el backend agregará sufijo/ext."
            fullWidth
          />
  
          <TextField
            label="Relación de aspecto"
            value={aspectKey}
            onChange={(e) => setAspectKey(e.target.value)}
            select
            fullWidth
          >
            {Object.keys(ASPECTS).map((k) => (
              <MenuItem key={k} value={k}>
                {k}
              </MenuItem>
            ))}
          </TextField>
  
          <input type="file" accept="image/*" hidden ref={fileRef} onChange={handleFileChange} />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
            <Button onClick={handleChooseFile} variant="outlined">
              {value.imageUrl ? "Cambiar imagen…" : "Elegir imagen…"}
            </Button>
            {!!selectedFile && (
              <Typography variant="body2" color="text.secondary">
                {selectedFile.name}
              </Typography>
            )}
          </Stack>
  
          {previewSrc ? (
            <Box
              sx={{
                mt: 1,
                border: "1px dashed",
                borderColor: "divider",
                p: 1,
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <img
                src={previewSrc}
                alt="preview"
                style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8 }}
              />
              <Typography variant="body2" color="text.secondary">
                {selectedFile ? "Vista previa (recortada)" : "Imagen actual"}
              </Typography>
            </Box>
          ) : null}
  
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Sección"
              value={value.section || "home"}
              onChange={(e) => set("section", e.target.value)}
              select
              fullWidth
            >
              {SECTION_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </TextField>
  
            <TextField
              label="Etiqueta (badge)"
              value={value.badge || ""}
              onChange={(e) => set("badge", e.target.value)}
              placeholder="Ej: Promo, -20%, Nuevo"
              fullWidth
            />
          </Stack>
  
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Posición"
              type="number"
              value={value.position ?? 0}
              onChange={(e) => set("position", Number(e.target.value))}
              fullWidth
            />
            <TextField
              label="Precio (override)"
              type="number"
              value={value.priceOverride ?? ""}
              onChange={(e) =>
                set("priceOverride", e.target.value === "" ? null : Number(e.target.value))
              }
              placeholder="Opcional"
              fullWidth
            />
          </Stack>
  
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(value.isActive)}
                onChange={(e) => set("isActive", e.target.checked)}
              />
            }
            label="Activo (visible en el home)"
          />
        </Stack>
  
        {/* Modal del cropper */}
        <CropperDialog
          open={cropOpen}
          imageSrc={imageSrc}
          aspect={ASPECTS[aspectKey]}
          targetW={(TARGETS[aspectKey] || TARGETS["1:1"]).w}
          targetH={(TARGETS[aspectKey] || TARGETS["1:1"]).h}
          onClose={handleCropCancel}
          onConfirm={handleCropConfirm}
        />
      </DialogContent>
    );
  }
  
  /* ===========================
     Página principal
  =========================== */
  function HomeProductPage() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const { toast: toastAuth } = useAuth();
  
    const [products, setProducts] = useState([]);
  
    const [openDelete, setOpenDelete] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null);
  
    const [openForm, setOpenForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formValue, setFormValue] = useState({
      name: "",
      description: "",
      imageUrl: "",
      section: "home",
      badge: "",
      position: 0,
      priceOverride: null,
      productId: null,
      isActive: true,
      imageFile: null,
      customFileName: "",
    });
  
    const titleDialog = useMemo(
      () => (isEditing ? "Editar destacado" : "Agregar destacado"),
      [isEditing]
    );
  
    const fetchRows = async () => {
      try {
        setLoading(true);
        const { data } = await getHomeProductsRequest();
        setRows(Array.isArray(data) ? data : []);
      } catch (err) {
        toastAuth({
          promise: Promise.reject(err),
          onError: (res) => ({
            title: "Vitrina",
            description: res?.response?.data?.message || "No se pudo cargar la vitrina",
          }),
        });
      } finally {
        setLoading(false);
      }
    };
  
    const fetchProducts = async () => {
      try {
        const { data } = await getAllProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        toastAuth({
          promise: Promise.reject(err),
          onError: (res) => ({
            title: "Productos",
            description: res?.response?.data?.message || "No se pudieron cargar productos",
          }),
        });
      }
    };
  
    useEffect(() => {
      fetchRows();
      fetchProducts();
    }, []);
  
    const handleOpenCreate = () => {
      setIsEditing(false);
      setFormValue({
        name: "",
        description: "",
        imageUrl: "",
        section: "home",
        badge: "",
        position: 0,
        priceOverride: null,
        productId: null,
        isActive: true,
        imageFile: null,
        customFileName: "",
      });
      setOpenForm(true);
    };
  
    const handleOpenEdit = (row) => {
      setIsEditing(true);
      setFormValue({
        id: row.id,
        name: row.name || "",
        description: row.description || "",
        imageUrl: row.imageUrl || "",
        imageFile: null,
        section: row.section || "home",
        badge: row.badge || "",
        position: Number.isFinite(row.position) ? row.position : 0,
        priceOverride:
          typeof row.priceOverride === "number" ? row.priceOverride : row.priceOverride ?? "",
        productId: row.productId ?? null,
        isActive: Boolean(row.isActive),
        customFileName: "",
      });
      setOpenForm(true);
    };
  
    const handleSubmitForm = async () => {
      if (!formValue.name?.trim()) {
        return toastAuth({
          promise: Promise.reject(new Error("El nombre es obligatorio")),
          onError: () => ({ title: "Formulario", description: "El nombre es obligatorio" }),
        });
      }
  
      const fd = new FormData();
      fd.append("name", formValue.name.trim());
      if (formValue.description) fd.append("description", formValue.description);
      if (formValue.productId !== null && formValue.productId !== "")
        fd.append("productId", String(formValue.productId));
      fd.append("section", formValue.section || "home");
      if (formValue.badge) fd.append("badge", formValue.badge);
      fd.append("position", String(Number.isFinite(formValue.position) ? formValue.position : 0));
      if (formValue.priceOverride !== null && formValue.priceOverride !== "")
        fd.append("priceOverride", String(formValue.priceOverride));
      fd.append("isActive", String(Boolean(formValue.isActive)));
  
      if (formValue.customFileName?.trim())
        fd.append("customFileName", formValue.customFileName.trim());
  
      if (formValue.imageFile) {
        fd.append("image", formValue.imageFile, formValue.imageFile.name);
      } else if (formValue.imageUrl) {
        fd.append("imageUrl", formValue.imageUrl); // mantener la actual
      }
  
      const promise =
        isEditing && formValue.id
          ? updateHomeProductRequest(formValue.id, fd)
          : createHomeProductRequest(fd);
  
      toastAuth({
        promise,
        onSuccess: async () => {
          setOpenForm(false);
          await fetchRows();
          return {
            title: "Vitrina",
            description: isEditing ? "Destacado actualizado" : "Destacado creado",
          };
        },
        onError: (res) => ({
          title: "Vitrina",
          description: res?.response?.data?.message || "No se pudo guardar",
        }),
      });
    };
  
    const handleConfirmDelete = (row) => {
      setRowToDelete(row);
      setOpenDelete(true);
    };
  
    const handleDelete = async () => {
      if (!rowToDelete) return;
  
      toastAuth({
        promise: deleteHomeProductRequest(rowToDelete.id),
        onSuccess: () => {
          setRows((prev) => prev.filter((r) => r.id !== rowToDelete.id));
          setOpenDelete(false);
          return { title: "Vitrina", description: "Eliminado correctamente" };
        },
        onError: (res) => ({
          title: "Vitrina",
          description: res?.response?.data?.message || "No se pudo eliminar",
        }),
      });
    };
  
    const columns = [
      {
        label: "Imagen",
        id: "image",
        width: 90,
        render: (row) => {
          const filename = row?.imageUrl;
          const src = filename ? `${pathImg}${filename}` : null;
          return src ? (
            <img
              src={src}
              alt={row?.name || "img"}
              style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
            />
          ) : (
            <Box sx={{ width: 60, height: 60, borderRadius: 1, bgcolor: "action.hover" }} />
          );
        },
      },
      { label: "Nombre", id: "name", width: 240 },
      { label: "Sección", id: "section", width: 120 },
      { label: "Posición", id: "position", width: 90, align: "right" },
      {
        label: "Activo",
        id: "isActive",
        width: 90,
        render: (row) => (row.isActive == 1 || row.isActive === true ? "Sí" : "No"),
      },
      {
        label: "Acciones",
        id: "actions",
        width: 140,
        render: (row) => (
          <>
            <Tooltip title="Editar">
              <IconButton onClick={() => handleOpenEdit(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton onClick={() => handleConfirmDelete(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </>
        ),
      },
    ];
  
    return (
      <Container sx={{ py: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6">Vitrina (Home Products)</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
            Agregar destacado
          </Button>
        </Stack>
  
        <TablePro
          rows={rows}
          columns={columns}
          loading={loading}
          defaultRowsPerPage={10}
          title="Listado de destacados"
          tableMaxHeight={420}
        />
  
        {/* Diálogo de formulario (crear/editar) */}
        <SimpleDialog open={openForm} onClose={() => setOpenForm(false)} tittle={titleDialog}>
          <HomeProductForm value={formValue} onChange={setFormValue} productOptions={products} />
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleSubmitForm}>
              {isEditing ? "Guardar cambios" : "Crear"}
            </Button>
          </DialogActions>
        </SimpleDialog>
  
        {/* Diálogo de confirmación de borrado */}
        <SimpleDialog
          open={openDelete}
          onClose={() => setOpenDelete(false)}
          tittle="Eliminar destacado"
          onClickAccept={handleDelete}
        >
          ¿Seguro que deseas eliminar <b>{rowToDelete?.name}</b>?
        </SimpleDialog>
      </Container>
    );
  }
  
  export default HomeProductPage;
  