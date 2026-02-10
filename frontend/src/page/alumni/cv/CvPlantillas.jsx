import { useState, useRef } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import FileDownload from "@mui/icons-material/FileDownload";
import FileUpload from "@mui/icons-material/FileUpload";
import { useNavigate } from "react-router-dom";
import { CV_TEMPLATES } from "./templates/config.js";
import SimpleDialog from "../../../Components/Dialogs/SimpleDialog";
import { saveTemplates } from "../../../api/cvRequest";
import { useAuth } from "../../../context/AuthContext";

/** Para exportar: solo datos guardables (sin component) */
function templatesToExportData() {
  return {
    templates: CV_TEMPLATES.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      type: t.type,
      sections: t.sections,
      componentKey: t.id,
    })),
    exportedAt: new Date().toISOString(),
  };
}

export default function CvPlantillas() {
  const navigate = useNavigate();
  const { toast } = useAuth();
  const [openConfirmImport, setOpenConfirmImport] = useState(false);
  const [pendingImport, setPendingImport] = useState(null);
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const data = templatesToExportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cv-plantillas-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result);
        const templates = json.templates ?? (Array.isArray(json) ? json : [json]);
        if (!Array.isArray(templates) || templates.length === 0) {
          toast({
            promise: Promise.reject(new Error("El archivo no contiene plantillas válidas.")),
            errorMessage: "El archivo no contiene plantillas válidas.",
          });
          return;
        }
        setPendingImport(templates);
        setOpenConfirmImport(true);
      } catch (err) {
        toast({
          promise: Promise.reject(err),
          errorMessage: "El archivo JSON no es válido.",
        });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleConfirmImport = () => {
    if (!pendingImport?.length) {
      setOpenConfirmImport(false);
      setPendingImport(null);
      return;
    }
    const count = pendingImport.length;
    toast({
      promise: saveTemplates(pendingImport).then((res) => {
        setOpenConfirmImport(false);
        setPendingImport(null);
        return res;
      }),
      successMessage: `${count} plantilla(s) guardada(s) en la base de datos.`,
      errorMessage: "Error al guardar plantillas en la base de datos.",
    });
  };

  const handleCloseConfirmImport = () => {
    setOpenConfirmImport(false);
    setPendingImport(null);
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Manejador de plantillas de CV
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Elige una plantilla para ver cómo se organiza tu hoja de vida y qué datos se muestran. Luego podrás ver la vista previa y descargar en PDF.
      </Typography>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
        <Button variant="outlined" startIcon={<FileDownload />} onClick={handleExport}>
          Exportar JSON
        </Button>
        <Button variant="outlined" startIcon={<FileUpload />} onClick={handleImportClick}>
          Importar JSON
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Box>

      <SimpleDialog
        open={openConfirmImport}
        onClose={handleCloseConfirmImport}
        tittle="Guardar plantillas en la base de datos"
        onClickAccept={handleConfirmImport}
      >
        <Typography>
          ¿Está seguro que desea guardar {pendingImport?.length ?? 0} plantilla(s) en la base de datos?
        </Typography>
      </SimpleDialog>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {CV_TEMPLATES.map((t) => (
          <Card key={t.id} variant="outlined" sx={{ overflow: "hidden" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Typography variant="h6">{t.name}</Typography>
                <Chip label={t.type} size="small" color={t.type === "Completa" ? "primary" : "default"} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t.description}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Secciones que incluye:
              </Typography>
              <List dense disablePadding sx={{ listStyle: "disc", pl: 2 }}>
                {t.sections.map((sec, i) => (
                  <ListItem key={i} disablePadding sx={{ display: "list-item" }}>
                    <ListItemText primary={sec} primaryTypographyProps={{ variant: "body2" }} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
              <Button
                variant="contained"
                startIcon={<Visibility />}
                onClick={() => navigate(`/cv/ver?plantilla=${t.id}`)}
              >
                Vista previa y PDF
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Container>
  );
}
