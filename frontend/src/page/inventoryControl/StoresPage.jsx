import {
    Container,
    IconButton,
    Button,
    Tooltip,
    TextField,
    FormControlLabel,
    Switch,
    Stack,
    Box,
    Typography,
    Slider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
  } from "@mui/material";
  import { useEffect, useMemo, useState, useRef } from "react";
  import { Add, Edit, Delete } from "@mui/icons-material";
  import SimpleDialog from "../../Components/Dialogs/SimpleDialog";
  import TablePro from "../../Components/Tables/TablePro";
  
import {
    getStoresRequest,
    createStoreRequest,
    updateStoreRequest,
    deleteStoreRequest,
  } from "../../api/inventoryControlRequest"; // <-- crea este archivo con los request que te pasé

  import { pathImg } from "../../api/axios";
  import { useAuth } from "../../context/AuthContext";
  import Cropper from "react-easy-crop";
  
  /* ===========================
     Helpers de imagen / crop
  =========================== */
  
  async function getCroppedBlob(
    imageSrc,
    cropAreaPixels,
    { targetW = 800, targetH = 800, mime = "image/jpeg", quality = 0.9 } = {}
  ) {
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
    const ext =
      mime === "image/png" ? ".png" : mime === "image/webp" ? ".webp" : ".jpg";
    return new File([blob], base + ext, { type: mime });
  }
  
  /* ===========================
     CropperDialog (igual que productos)
  =========================== */
  function CropperDialog({ open, imageSrc, onClose, onConfirm, aspect }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [areaPixels, setAreaPixels] = useState(null);
  
    const PRESETS = [
      { k: "original", label: "Original (máx. del recorte)" },
      { k: "1080", label: "Ancho 1080 (auto alto)" },
      { k: "800", label: "Ancho 800 (auto alto)" },
      { k: "1280x720", label: "1280 × 720" },
    ];
    const [sizeMode, setSizeMode] = useState("original");
    const [customW, setCustomW] = useState("");
    const [customH, setCustomH] = useState("");
    const [quality, setQuality] = useState(0.9);
    const [mime, setMime] = useState("image/jpeg");
    const [estimateMB, setEstimateMB] = useState(null);
    const [estimateWH, setEstimateWH] = useState(null);
  
    useEffect(() => {
      if (!open) {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setAreaPixels(null);
        setSizeMode("original");
        setCustomW("");
        setCustomH("");
        setQuality(0.9);
        setMime("image/jpeg");
        setEstimateMB(null);
        setEstimateWH(null);
      }
    }, [open]);
  
    const onCropComplete = (_, croppedAreaPixels) => setAreaPixels(croppedAreaPixels);
  
    const getTargetSize = () => {
      if (!areaPixels) return { w: null, h: null };
      const { width, height } = areaPixels;
      if (sizeMode === "original")
        return { w: Math.round(width), h: Math.round(height) };
      if (sizeMode === "1080") {
        const scale = 1080 / width;
        return { w: 1080, h: Math.round(height * scale) };
      }
      if (sizeMode === "800") {
        const scale = 800 / width;
        return { w: 800, h: Math.round(height * scale) };
      }
      if (sizeMode === "1280x720") return { w: 1280, h: 720 };
  
      // custom
      const w = Number(customW) || null;
      const h = Number(customH) || null;
      if (w && !h) {
        const scale = w / width;
        return { w, h: Math.round(height * scale) };
      }
      if (!w && h) {
        const scale = h / height;
        return { w: Math.round(width * scale), h };
      }
      return {
        w: w || Math.round(width),
        h: h || Math.round(height),
      };
    };
  
    const handleEstimate = async () => {
      if (!imageSrc || !areaPixels) return;
      const { w, h } = getTargetSize();
      const blob = await getCroppedBlob(imageSrc, areaPixels, {
        targetW: w,
        targetH: h,
        mime,
        quality,
      });
      if (!blob) return;
      setEstimateMB((blob.size / (1024 * 1024)).toFixed(2));
      setEstimateWH({ w, h });
    };
  
    const handleConfirm = async () => {
      if (!imageSrc || !areaPixels) return;
      const { w, h } = getTargetSize();
      const blob = await getCroppedBlob(imageSrc, areaPixels, {
        targetW: w,
        targetH: h,
        mime,
        quality,
      });
      onConfirm(blob, {
        width: w,
        height: h,
        mime,
        quality,
        sizeBytes: blob?.size ?? null,
      });
    };
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Recortar imagen</DialogTitle>
  
        <Box sx={{ px: 3, pt: 1 }}>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Arrastra para mover. En modo libre puedes redimensionar las esquinas.
          </Typography>
        </Box>
  
        <Box
          sx={{
            position: "relative",
            height: "70vh",
            maxHeight: 800,
            minHeight: 480,
            backgroundColor: "#111",
          }}
        >
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect} // undefined => libre
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              restrictPosition
              objectFit="contain"
              minZoom={1}
            />
          )}
        </Box>
  
        {/* Controles */}
        <Box sx={{ px: 3, pt: 2, display: "grid", gap: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Zoom
            </Typography>
            <Slider
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(_, v) => setZoom(v)}
            />
          </Box>
  
          <Box sx={{ display: "grid", gap: 1 }}>
            <Typography variant="subtitle2">Tamaño de salida</Typography>
            <TextField
              label="Modo de tamaño"
              value={sizeMode}
              onChange={(e) => setSizeMode(e.target.value)}
              select
              fullWidth
            >
              {PRESETS.map((p) => (
                <MenuItem key={p.k} value={p.k}>
                  {p.label}
                </MenuItem>
              ))}
            </TextField>
  
            {sizeMode === "custom" && (
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <TextField
                  label="Ancho (px)"
                  type="number"
                  value={customW}
                  onChange={(e) => setCustomW(e.target.value)}
                  placeholder="ej: 1600"
                />
                <TextField
                  label="Alto (px)"
                  type="number"
                  value={customH}
                  onChange={(e) => setCustomH(e.target.value)}
                  placeholder="ej: 1200"
                />
              </Box>
            )}
          </Box>
  
          <Box sx={{ display: "grid", gap: 1 }}>
            <Typography variant="subtitle2">Formato y calidad</Typography>
            <TextField
              label="Formato"
              value={mime}
              onChange={(e) => setMime(e.target.value)}
              select
              fullWidth
            >
              <MenuItem value="image/jpeg">JPEG (recomendado)</MenuItem>
              <MenuItem value="image/webp">WEBP</MenuItem>
              <MenuItem value="image/png">PNG (sin pérdidas, peso alto)</MenuItem>
            </TextField>
  
            {(mime === "image/jpeg" || mime === "image/webp") && (
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Calidad ({Math.round(quality * 100)}%)
                </Typography>
                <Slider
                  min={0.5}
                  max={1}
                  step={0.01}
                  value={quality}
                  onChange={(_, v) => setQuality(v)}
                />
              </Box>
            )}
          </Box>
  
          <Stack direction="row" spacing={2} alignItems="center">
            <Button variant="outlined" onClick={handleEstimate}>
              Estimar tamaño
            </Button>
            {estimateMB && estimateWH && (
              <Typography variant="body2" color="text.secondary">
                Estimado: {estimateMB} MB — {estimateWH.w}×{estimateWH.h}px
              </Typography>
            )}
          </Stack>
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
     Formulario de Store
  =========================== */
  function StoreForm({ value, onChange }) {
    const set = (k, v) => onChange({ ...value, [k]: v });
  
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
  
    const [cropOpen, setCropOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [aspectKey, setAspectKey] = useState("4:3"); // sugerido para locales
  
    const ASPECTS = {
      "1:1": 1,
      "4:3": 4 / 3,
      "16:9": 16 / 9,
      free: undefined,
    };
  
    const fileRef = useRef(null);
    const handleChooseFile = () => fileRef.current?.click();
  
    const handleFileChange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setCropOpen(true);
      e.target.value = "";
    };
  
    const [lastMeta, setLastMeta] = useState(null);
  
    const handleCropConfirm = async (blob, meta) => {
      const file = blobToFile(blob, "image", meta?.mime || "image/jpeg");
      setSelectedFile(file);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
      set("imageFile", file);
      setCropOpen(false);
      setLastMeta(meta || null);
  
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
  
    return (
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            label="Nombre del punto de venta"
            value={value.name || ""}
            onChange={(e) => set("name", e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Dirección"
            value={value.address || ""}
            onChange={(e) => set("address", e.target.value)}
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
  
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Teléfono"
              value={value.phone || ""}
              onChange={(e) => set("phone", e.target.value)}
              fullWidth
            />
            <TextField
              label="Email"
              value={value.email || ""}
              onChange={(e) => set("email", e.target.value)}
              type="email"
              fullWidth
            />
          </Stack>
  
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Ciudad"
              value={value.city || ""}
              onChange={(e) => set("city", e.target.value)}
              fullWidth
            />
            <TextField
              label="Provincia"
              value={value.province || ""}
              onChange={(e) => set("province", e.target.value)}
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
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(value.isActive)}
                  onChange={(e) => set("isActive", e.target.checked)}
                />
              }
              label="Activo (visible)"
            />
          </Stack>
  
          <TextField
            label="Relación de aspecto"
            value={aspectKey}
            onChange={(e) => setAspectKey(e.target.value)}
            select
            fullWidth
          >
            <MenuItem value="free">Personalizado / libre</MenuItem>
            {Object.keys(ASPECTS)
              .filter((k) => k !== "free")
              .map((k) => (
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
                flexWrap: "wrap",
              }}
            >
              <img
                src={previewSrc}
                alt="preview"
                style={{ width: 160, height: 120, objectFit: "cover", borderRadius: 8 }}
              />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {selectedFile ? "Vista previa (recortada)" : "Imagen actual"}
                </Typography>
                {/* Puedes mostrar meta si quieres como en productos */}
              </Box>
            </Box>
          ) : null}
  
          {/* Modal del cropper */}
          <CropperDialog
            open={cropOpen}
            imageSrc={imageSrc}
            aspect={ASPECTS[aspectKey]}
            onClose={handleCropCancel}
            onConfirm={handleCropConfirm}
          />
        </Stack>
      </DialogContent>
    );
  }
  
  /* ===========================
     Página principal (Stores)
  =========================== */
  function StoresPage() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const { toast: toastAuth } = useAuth();
  
    const [openDelete, setOpenDelete] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null);
  
    const [openForm, setOpenForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formValue, setFormValue] = useState({
      name: "",
      address: "",
      description: "",
      phone: "",
      email: "",
      city: "",
      province: "",
      position: 0,
      isActive: true,
      imageUrl: "",
      imageFile: null,
      customFileName: "",
    });
  
    const titleDialog = useMemo(
      () => (isEditing ? "Editar punto de venta" : "Agregar punto de venta"),
      [isEditing]
    );
  
    const fetchRows = async () => {
      try {
        setLoading(true);
        const { data } = await getStoresRequest();
        setRows(Array.isArray(data) ? data : []);
      } catch (err) {
        toastAuth({
          promise: Promise.reject(err),
          onError: (res) => ({
            title: "Puntos de venta",
            description: res?.response?.data?.message || "No se pudo cargar la lista",
          }),
        });
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchRows();
    }, []);
  
    const handleOpenCreate = () => {
      setIsEditing(false);
      setFormValue({
        name: "",
        address: "",
        description: "",
        phone: "",
        email: "",
        city: "",
        province: "",
        position: 0,
        isActive: true,
        imageUrl: "",
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
        address: row.address || "",
        description: row.description || "",
        phone: row.phone || "",
        email: row.email || "",
        city: row.city || "",
        province: row.province || "",
        position: Number.isFinite(row.position) ? row.position : 0,
        isActive: Boolean(row.isActive),
        imageUrl: row.imageUrl || "",
        imageFile: null,
        customFileName: "",
      });
      setOpenForm(true);
    };
  
    const handleSubmitForm = async () => {
      if (!formValue.name?.trim() || !formValue.address?.trim()) {
        return toastAuth({
          promise: Promise.reject(new Error("Nombre y dirección son obligatorios")),
          onError: () => ({
            title: "Formulario",
            description: "Nombre y dirección son obligatorios",
          }),
        });
      }
  
      const fd = new FormData();
      fd.append("name", formValue.name.trim());
      fd.append("address", formValue.address.trim());
      if (formValue.description) fd.append("description", formValue.description);
      if (formValue.phone) fd.append("phone", formValue.phone);
      if (formValue.email) fd.append("email", formValue.email);
      if (formValue.city) fd.append("city", formValue.city);
      if (formValue.province) fd.append("province", formValue.province);
      fd.append(
        "position",
        String(Number.isFinite(formValue.position) ? formValue.position : 0)
      );
      fd.append("isActive", String(Boolean(formValue.isActive)));
  
      if (formValue.customFileName?.trim())
        fd.append("customFileName", formValue.customFileName.trim());
  
      if (formValue.imageFile) {
        fd.append("image", formValue.imageFile, formValue.imageFile.name);
      } else if (formValue.imageUrl) {
        fd.append("imageUrl", formValue.imageUrl); // mantener actual
      }
  
      const promise =
        isEditing && formValue.id
          ? updateStoreRequest(formValue.id, fd)
          : createStoreRequest(fd);
  
      toastAuth({
        promise,
        onSuccess: async () => {
          setOpenForm(false);
          await fetchRows();
          return {
            title: "Puntos de venta",
            description: isEditing ? "Punto de venta actualizado" : "Punto de venta creado",
          };
        },
        onError: (res) => ({
          title: "Puntos de venta",
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
        promise: deleteStoreRequest(rowToDelete.id),
        onSuccess: () => {
          setRows((prev) => prev.filter((r) => r.id !== rowToDelete.id));
          setOpenDelete(false);
          return { title: "Puntos de venta", description: "Eliminado correctamente" };
        },
        onError: (res) => ({
          title: "Puntos de venta",
          description: res?.response?.data?.message || "No se pudo eliminar",
        }),
      });
    };
  
    const columns = [
      {
        label: "Imagen",
        id: "image",
        width: 100,
        render: (row) => {
          const filename = row?.imageUrl;
          const src = filename ? `${pathImg}${filename}` : null;
          return src ? (
            <img
              src={src}
              alt={row?.name || "img"}
              style={{ width: 70, height: 56, objectFit: "cover", borderRadius: 8 }}
            />
          ) : (
            <Box sx={{ width: 70, height: 56, borderRadius: 1, bgcolor: "action.hover" }} />
          );
        },
      },
      { label: "Nombre", id: "name", width: 240 },
      { label: "Ciudad", id: "city", width: 140 },
      { label: "Provincia", id: "province", width: 140 },
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
          <Typography variant="h6">Puntos de venta (Stores)</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
            Agregar punto de venta
          </Button>
        </Stack>
  
        <TablePro
          rows={rows}
          columns={columns}
          loading={loading}
          defaultRowsPerPage={10}
          title="Listado de puntos de venta"
          tableMaxHeight={420}
        />
  
        {/* Diálogo de formulario (crear/editar) */}
        <SimpleDialog open={openForm} onClose={() => setOpenForm(false)} tittle={titleDialog}>
          <StoreForm value={formValue} onChange={setFormValue} />
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
          tittle="Eliminar punto de venta"
          onClickAccept={handleDelete}
        >
          ¿Seguro que deseas eliminar <b>{rowToDelete?.name}</b>?
        </SimpleDialog>
      </Container>
    );
  }
  
  export default StoresPage;
  