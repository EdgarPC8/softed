import { Box, TextField, Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { getProfessional, updateProfessional } from "../../../../api/alumni/cvRequest.js";
import { useAuth } from "../../../../context/AuthContext.jsx";

export default function ProfessionalFormSection() {
  const [professional, setProfessional] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useAuth();

  const load = async () => {
    try {
      const { data } = await getProfessional();
      setProfessional(data);
      setSummary(data?.summary ?? "");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = () => {
    toast({
      promise: updateProfessional({ summary }),
      successMessage: "Perfil actualizado",
      onSuccess: () => load(),
    });
  };

  if (loading) return <CircularProgress size={24} />;

  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        multiline
        minRows={3}
        label="Resumen / Perfil profesional"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        variant="outlined"
        sx={{ mb: 1 }}
      />
      <Button variant="contained" onClick={handleSave}>
        Guardar perfil
      </Button>
    </Box>
  );
}
