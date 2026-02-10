import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  TextField,
  IconButton,
  Button,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useState } from "react";
import DataTable from "../../../../Components/Tables/DataTable";
import SimpleDialog from "../../../../Components/Dialogs/SimpleDialog";
import { useAuth } from "../../../../context/AuthContext.jsx";

export default function CvSectionAccordion({
  title,
  getAll,
  add,
  edit,
  remove,
  idParam,
  dataColumns,
  formFields,
  initialValues,
}) {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(initialValues || {});
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const { toast } = useAuth();

  const load = async () => {
    try {
      const { data } = await getAll();
      setList(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(initialValues || {});
    setIsEditing(false);
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      toast({
        promise: edit(editId, form),
        successMessage: "Actualizado con éxito",
        onSuccess: () => {
          load();
          resetForm();
        },
      });
    } else {
      toast({
        promise: add(form),
        successMessage: "Agregado con éxito",
        onSuccess: () => {
          load();
          resetForm();
        },
      });
    }
  };

  const handleEdit = (row) => {
    const values = {};
    formFields.forEach((f) => {
      values[f.name] = row[f.name] ?? "";
    });
    setForm(values);
    setIsEditing(true);
    setEditId(row.id);
  };

  const handleDeleteConfirm = () => {
    if (!rowToDelete) return;
    toast({
      promise: remove(rowToDelete.id),
      successMessage: "Eliminado con éxito",
      onSuccess: () => {
        load();
        setOpenDelete(false);
        setRowToDelete(null);
      },
    });
  };

  const columns = [
    { headerName: "#", field: "#", width: 50 },
    ...(dataColumns || []),
    {
      headerName: "Acciones",
      field: "actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton size="small" onClick={() => handleEdit(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              setRowToDelete(params.row);
              setOpenDelete(true);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Accordion variant="outlined" disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>{title}</AccordionSummary>
      <AccordionDetails>
        <SimpleDialog
          open={openDelete}
          onClose={() => setOpenDelete(false)}
          tittle="Eliminar"
          onClickAccept={handleDeleteConfirm}
        >
          ¿Está seguro de eliminar este registro?
        </SimpleDialog>

        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
          <Grid container spacing={2}>
            {formFields.map((f) => (
              <Grid item xs={12} sm={6} key={f.name}>
                <TextField
                  fullWidth
                  size="small"
                  label={f.label}
                  type={f.type || "text"}
                  value={form[f.name] ?? ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, [f.name]: e.target.value }))}
                  InputLabelProps={f.type === "date" ? { shrink: true } : {}}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" startIcon={<SendIcon />}>
                {isEditing ? "Actualizar" : "Agregar"}
              </Button>
              {isEditing && (
                <Button sx={{ ml: 1 }} onClick={resetForm}>
                  Cancelar
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>

        <DataTable data={list} columns={columns} />
      </AccordionDetails>
    </Accordion>
  );
}
