// src/pages/Img/ImgManagerPage.jsx
import {
  Container,
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  TextField,
  Stack,
  Chip,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import {
  Delete,
  Refresh,
  UploadFile,
  FolderOpen,
  Download,
  DeleteForever,
} from "@mui/icons-material";
import toast from "react-hot-toast";

import SimpleDialog from "../Components/Dialogs/SimpleDialog";
import TablePro from "../Components/Tables/TablePro";

import { pathImg } from "../api/axios";
import UploadImageForm from "../Components/Forms/UploadImageForm";
import {
  scanImagesRequest,
  deleteImageRequest,
  downloadFolderZipRequest,
  deleteFolderRequest, // ✅ NUEVO
} from "../api/imgRequest";

function ImgManagerPage() {
  const [rows, setRows] = useState([]);
  const [totals, setTotals] = useState(null);

  const [folder, setFolder] = useState(""); // ej: "EdDeli/products"
  const [maxDepth, setMaxDepth] = useState(5);

  const [openUpload, setOpenUpload] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  // ✅ borrar carpeta
  const [openDeleteFolder, setOpenDeleteFolder] = useState(false);
  const [forceDeleteFolder, setForceDeleteFolder] = useState(false);

  const handleUploadDialog = () => setOpenUpload((p) => !p);
  const handleDeleteDialog = () => setOpenDelete((p) => !p);

  const handleDeleteFolderDialog = () => {
    setOpenDeleteFolder((p) => !p);
    if (!openDeleteFolder) setForceDeleteFolder(false);
  };

  const fetchScan = async () => {
    try {
      const { data } = await scanImagesRequest({
        folder,
        maxDepth,
        includeNonImages: false,
      });

      setRows(data?.files || []);
      setTotals(data?.totals || null);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error al escanear imágenes");
    }
  };

  useEffect(() => {
    fetchScan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteSelected = async () => {
    if (!rowToDelete?.relPath) return;

    toast.promise(
      deleteImageRequest(rowToDelete.relPath),
      {
        loading: "Eliminando imagen...",
        success: "Imagen eliminada",
        error: (err) => err?.response?.data?.message || "Error al eliminar imagen",
      },
      { position: "top-right", style: { fontFamily: "roboto" } }
    );

    // optimista
    setRows((prev) => prev.filter((x) => x.relPath !== rowToDelete.relPath));
    handleDeleteDialog();
  };

  const downloadZip = async () => {
    try {
      const { data } = await downloadFolderZipRequest(folder);

      const blob = new Blob([data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      const safeName = (folder || "img").replace(/[\/\\]/g, "_");
      a.href = url;
      a.download = `${safeName}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error al descargar ZIP");
    }
  };

  // ✅ eliminar carpeta (vacía o recursivo)
  const deleteCurrentFolder = async () => {
    const f = String(folder || "").trim();

    if (!f) {
      toast.error("Escribe una carpeta en el filtro (ej: EdDeli/products)");
      return;
    }

    try {
      await toast.promise(
        deleteFolderRequest(f, { force: forceDeleteFolder }),
        {
          loading: "Eliminando carpeta...",
          success: forceDeleteFolder
            ? "Carpeta eliminada (recursivo)"
            : "Carpeta eliminada (si estaba vacía)",
          error: (err) => err?.response?.data?.message || "Error al eliminar carpeta",
        },
        { position: "top-right", style: { fontFamily: "roboto" } }
      );

      handleDeleteFolderDialog();

      // refresca listado
      await fetchScan();

      // si borraste la carpeta actual, limpia filas (por si quedó cache visual)
      // y si quieres, puedes limpiar el input folder:
      // setFolder("");
    } catch (e) {
      // toast.promise ya maneja el error
    }
  };

  const columns = useMemo(
    () => [
      {
        label: "Preview",
        id: "preview",
        width: 90,
        render: (row) => {
          const url = `${pathImg}${row.relPath}`;
          return (
            <img
              src={url}
              alt={row.name || "img"}
              style={{
                width: 60,
                height: 60,
                objectFit: "cover",
                borderRadius: 8,
                display: "block",
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          );
        },
      },
      {
        label: "Ruta",
        id: "relPath",
        width: 360,
        render: (row) => (
          <Typography variant="body2" noWrap title={row.relPath}>
            {row.relPath}
          </Typography>
        ),
      },
      { label: "Nombre", id: "name", width: 200 },
      {
        label: "Ext",
        id: "ext",
        width: 70,
        render: (row) => <Chip size="small" label={row.ext || "—"} />,
      },
      {
        label: "Tamaño",
        id: "sizeHuman",
        width: 110,
        render: (row) => row.sizeHuman || "—",
      },
      {
        label: "Modificado",
        id: "mtime",
        width: 180,
        render: (row) => (row?.mtime ? new Date(row.mtime).toLocaleString() : "—"),
      },
      {
        label: "Acciones",
        id: "actions",
        width: 120,
        render: (row) => (
          <>
            <Tooltip title="Eliminar">
              <IconButton
                onClick={() => {
                  setRowToDelete(row);
                  handleDeleteDialog();
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>

            <Tooltip title="Abrir carpeta (usar como filtro)">
              <IconButton
                onClick={() => {
                  const parts = String(row.relPath || "").split("/");
                  parts.pop();
                  setFolder(parts.join("/"));
                }}
              >
                <FolderOpen />
              </IconButton>
            </Tooltip>
          </>
        ),
      },
    ],
    []
  );

  return (
    <Container>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Control de Imágenes
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Base pública: <b>{pathImg}</b>
        </Typography>
      </Box>

      {/* Filtros */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        alignItems={{ xs: "stretch", sm: "center" }}
        sx={{ mb: 1 }}
      >
        <TextField
          label="Carpeta (folder)"
          size="small"
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          placeholder='Ej: "EdDeli" o "EdDeli/products" (vacío = todo)'
          fullWidth
        />

        <TextField
          label="Max Depth"
          size="small"
          type="number"
          value={maxDepth}
          onChange={(e) => setMaxDepth(Number(e.target.value || 0))}
          sx={{ width: 140 }}
        />

        <Tooltip title="Escanear / Recargar">
          <IconButton onClick={fetchScan}>
            <Refresh />
          </IconButton>
        </Tooltip>

        <Button variant="text" startIcon={<UploadFile />} onClick={handleUploadDialog}>
          Subir imagen
        </Button>

        <Button variant="text" startIcon={<Download />} onClick={downloadZip}>
          Descargar carpeta
        </Button>

        <Button
          variant="text"
          color="error"
          startIcon={<DeleteForever />}
          onClick={handleDeleteFolderDialog}
        >
          Eliminar carpeta
        </Button>
      </Stack>

      {/* Totales */}
      <Box sx={{ mb: 1 }}>
        <Chip size="small" label={`Archivos: ${totals?.totalFiles ?? 0}`} sx={{ mr: 1 }} />
        <Chip size="small" label={`Peso total: ${totals?.totalSizeHuman ?? "0 B"}`} />
      </Box>

      {/* Tabla */}
      <TablePro
        rows={rows}
        columns={columns}
        defaultRowsPerPage={10}
        title="IMÁGENES"
        tableMaxHeight={420}
        showIndex={true}
      />

      {/* Dialog subir */}
      <SimpleDialog
        open={openUpload}
        onClose={handleUploadDialog}
        tittle="Subir / Reemplazar imagen"
      >
        <UploadImageForm
          onClose={handleUploadDialog}
          defaultFolder={folder}
          onUploaded={() => {
            handleUploadDialog();
            fetchScan();
          }}
        />
      </SimpleDialog>

      {/* Dialog eliminar imagen */}
      <SimpleDialog
        open={openDelete}
        onClose={handleDeleteDialog}
        tittle="Eliminar imagen"
        onClickAccept={deleteSelected}
      >
        ¿Seguro que deseas eliminar?
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
            {rowToDelete?.relPath || "—"}
          </Typography>
        </Box>
      </SimpleDialog>

      {/* ✅ Dialog eliminar carpeta */}
      <SimpleDialog
        open={openDeleteFolder}
        onClose={handleDeleteFolderDialog}
        tittle="Eliminar carpeta"
        onClickAccept={deleteCurrentFolder}
      >
        <Typography variant="body2">
          Se eliminará la carpeta:
        </Typography>

        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
            {folder || "— (vacío)"}
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={forceDeleteFolder}
                onChange={(e) => setForceDeleteFolder(e.target.checked)}
              />
            }
            label="Borrar recursivo (⚠️ elimina todo dentro)"
          />
          <Typography variant="caption" sx={{ display: "block", opacity: 0.75 }}>
            Si NO está marcado, solo elimina si la carpeta está vacía.
          </Typography>
        </Box>
      </SimpleDialog>
    </Container>
  );
}

export default ImgManagerPage;
