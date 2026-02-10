import { Container, Typography, Button, Box, CircularProgress, Alert } from "@mui/material";
import PdfIcon from "@mui/icons-material/PictureAsPdf";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { getFullCv } from "../../../api/cvRequest.js";
import { pathImg } from "../../../api/axios.js";
import { getTemplateById } from "./templates/config.js";
import { useAuth } from "../../../context/AuthContext.jsx";

/** Datos mínimos para la plantilla cuando la API falla o no devuelve datos (solo datos personales del usuario logueado). */
function buildFallbackData(authUser) {
  if (!authUser) return null;
  return {
    user: {
      ci: authUser.ci,
      firstName: authUser.firstName,
      secondName: authUser.secondName,
      firstLastName: authUser.firstLastName,
      secondLastName: authUser.secondLastName,
      birthday: authUser.birthday,
      gender: authUser.gender,
    },
    userData: {},
    professional: null,
    academicTraining: [],
    teachingExperience: [],
    coursesWorkshops: [],
    intellectualProduction: [],
    books: [],
    merits: [],
    languages: [],
    professionalExperience: [],
  };
}

export default function CvVer() {
  const { user: authUser } = useAuth();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("plantilla") || "completa";
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const printRef = useRef(null);
  const template = getTemplateById(templateId);
  const TemplateComponent = template?.component;

  useEffect(() => {
    let cancelled = false;
    getFullCv()
      .then((res) => {
        if (!cancelled) setData(res.data ?? null);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message || "Error al cargar el CV");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handleDownloadPdf = () => {
    const element = printRef.current;
    if (!element) return;
    const displayData = data || buildFallbackData(authUser);
    const opt = {
      margin: 10,
      filename: `CV_${displayData?.user?.firstName || "curriculum"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress /></Box>;
  if (!TemplateComponent) return <Container sx={{ py: 2 }}><Alert severity="warning">Plantilla no encontrada.</Alert></Container>;

  const displayData = data || buildFallbackData(authUser);
  const usingFallback = !data && !!displayData;

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      {usingFallback && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No se pudieron cargar todos los datos del CV. Se muestran tus datos personales.
        </Alert>
      )}
      {error && !displayData && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1, mb: 2 }}>
        <Typography variant="h5">Vista previa del CV</Typography>
        <Button variant="contained" startIcon={<PdfIcon />} onClick={handleDownloadPdf} disabled={!displayData}>
          Descargar PDF
        </Button>
      </Box>
      <Box sx={{ bgcolor: "grey.100", p: 2, borderRadius: 2 }} ref={printRef}>
        {displayData ? <TemplateComponent data={displayData} pathImg={pathImg} /> : <Typography color="text.secondary">Inicia sesión para ver tu CV.</Typography>}
      </Box>
    </Container>
  );
}
