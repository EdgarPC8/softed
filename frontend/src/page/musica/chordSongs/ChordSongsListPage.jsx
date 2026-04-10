import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AddIcon from "@mui/icons-material/Add";
import { useSnackbar } from "notistack";
import { useAuth } from "../../../context/AuthContext.jsx";
import { createChordSong, getChordSongs } from "../../../api/musica/chordSongRequest.js";

const canEdit = (rol) => rol === "Administrador" || rol === "Programador";

export default function ChordSongsListPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const edit = canEdit(user?.loginRol);

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const res = await getChordSongs();
        if (ok) setRows(res.data || []);
      } catch (e) {
        console.error(e);
        if (ok) setRows([]);
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => {
      ok = false;
    };
  }, []);

  const handleNueva = async () => {
    setCreating(true);
    try {
      const res = await createChordSong({
        title: "Nueva canción",
        beatsPerLine: 4,
      });
      enqueueSnackbar("Canción creada.", { variant: "success" });
      navigate(`/canciones/${res.data.id}/estructura`);
    } catch (e) {
      console.error(e);
      enqueueSnackbar("No se pudo crear la canción.", { variant: "error" });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">Canciones · ritmo y armonía</Typography>
        {edit && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => void handleNueva()}
            disabled={creating}
          >
            {creating ? "Creando…" : "Nueva canción"}
          </Button>
        )}
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Define tempo, tonalidad y progresiones por secciones. Desde el listado abres cada tema en el editor de estructura.
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Artista</TableCell>
              <TableCell>Tono</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4}>Cargando…</TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>No hay canciones todavía.</TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell>{r.title}</TableCell>
                  <TableCell>{r.artist || "—"}</TableCell>
                  <TableCell>{r.originalKey || "—"}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Abrir ritmo y armonía">
                      <IconButton
                        size="small"
                        aria-label="Estructura"
                        onClick={() => navigate(`/canciones/${r.id}/estructura`)}
                        color="primary"
                      >
                        <AccountTreeIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
