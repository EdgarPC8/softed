// src/pages/Img/components/UploadImageForm.jsx
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { uploadImageRequest } from "../../api/imgRequest";

const formatBytes = (bytes = 0) => {
  const b = Number(bytes || 0);
  if (b < 1024) return `${b} B`;
  const kb = b / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(2)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
};

const isSafeFolder = (folder = "") => {
  const f = String(folder || "").trim().replace(/\\/g, "/");
  if (!f) return true; // vacío = base
  if (f.includes("..")) return false;
  if (f.startsWith("/") || f.startsWith("~")) return false;
  // permite letras, números, /, -, _, ., espacio
  return /^[a-zA-Z0-9/._\- ]+$/.test(f);
};

function UploadImageForm({ onClose, defaultFolder = "", onUploaded }) {
  const [folder, setFolder] = useState(defaultFolder || "");
  const [name, setName] = useState("");
  const [replace, setReplace] = useState(true);
  const [file, setFile] = useState(null);

  // ✅ si cambias el filtro y abres el modal, se sincroniza
  useEffect(() => {
    setFolder(defaultFolder || "");
  }, [defaultFolder]);

  const safeFolder = useMemo(() => String(folder || "").trim().replace(/\\/g, "/"), [folder]);
  const safeName = useMemo(() => String(name || "").trim(), [name]);

  const submit = async () => {
    if (!file) return toast.error("Selecciona un archivo");
    if (!isSafeFolder(safeFolder)) {
      return toast.error('Folder inválido. Evita ".." y rutas raras.');
    }

    try {
      await toast.promise(
        uploadImageRequest({
          file,
          folder: safeFolder,
          name: safeName,
          replace,
        }),
        {
          loading: "Subiendo...",
          success: replace ? "Imagen subida / reemplazada" : "Imagen subida",
          error: (err) => err?.response?.data?.message || "Error al subir",
        },
        { position: "top-right", style: { fontFamily: "roboto" } }
      );

      // ✅ limpia form
      setName("");
      setFile(null);

      onUploaded?.();
    } catch {
      // toast.promise ya maneja el error
    }
  };

  return (
    <Box>
      <Stack spacing={1}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>
          Subcarpeta dentro de <b>src/img</b>. Ej: <code>EdDeli/products</code>
        </Typography>

        <TextField
          label="Folder"
          size="small"
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          placeholder='Ej: "EdDeli/products" (vacío = base)'
          fullWidth
          error={!isSafeFolder(safeFolder)}
          helperText={
            !isSafeFolder(safeFolder)
              ? 'Folder inválido (no uses ".." ni rutas absolutas)'
              : " "
          }
        />

        <TextField
          label="Name (opcional)"
          size="small"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Ej: "dona1.png" (si vacío, se autogenera)'
          fullWidth
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={replace}
              onChange={(e) => setReplace(e.target.checked)}
            />
          }
          label="Reemplazar si existe"
        />

        <Button variant="outlined" component="label">
          Seleccionar archivo
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </Button>

        <Typography variant="body2">
          Archivo: <b>{file?.name || "—"}</b>
          {file?.size ? (
            <span style={{ opacity: 0.75 }}> · {formatBytes(file.size)}</span>
          ) : null}
        </Typography>

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button variant="text" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={submit} disabled={!file}>
            Subir
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default UploadImageForm;
