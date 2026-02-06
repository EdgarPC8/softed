import React, { useRef, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useEditor } from "../EditorProvider";
export default function ExportPanel() {
  const {
    exportAsImage,
    copyTemplate,
    copyOps,
    downloadTemplateJson,
    importTemplateJson,
    saveTemplateDoc,
  } = useEditor();



  const onPickFile = () => fileRef.current?.click();

    const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const onSave = async () => {
    try {
      setSaving(true);
      await saveTemplateDoc();
      alert("✅ Guardado en la BD");
    } catch (e) {
      console.error(e);
      alert(`❌ No se pudo guardar: ${e?.message || e}`);
    } finally {
      setSaving(false);
    }
  };

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // permite volver a subir el mismo archivo
    if (!file) return;

    try {
      const text = await file.text();
      await importTemplateJson(text);
    } catch (err) {
      console.error(err);
      alert("No se pudo importar el JSON. Revisa que sea un template válido.");
    }
  };

  return (
<Box>
      <Typography sx={{ fontWeight: 900, color: "#fff", mb: 1 }}>
        Exportar
      </Typography>

<Stack direction="row" spacing={1} sx={{ mb: 1 }}>
<Button variant="contained" onClick={onSave} disabled={saving}>
  {saving ? "Guardando..." : "Guardar (BD)"}
</Button>
</Stack>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Button variant="contained" onClick={() => exportAsImage("png")}>
          PNG
        </Button>
        <Button variant="outlined" onClick={() => exportAsImage("jpg")}>
          JPG
        </Button>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Button variant="outlined" onClick={downloadTemplateJson}>
          Descargar JSON
        </Button>

        <Button variant="outlined" onClick={onPickFile}>
          Subir JSON
        </Button>

        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          style={{ display: "none" }}
          onChange={onFileChange}
        />
      </Stack>

      <Stack direction="row" spacing={1}>
        <Button size="small" variant="outlined" onClick={copyTemplate}>
          Copiar template
        </Button>
        <Button size="small" variant="outlined" onClick={copyOps}>
          Copiar ops
        </Button>
      </Stack>
    </Box>
  );
}
