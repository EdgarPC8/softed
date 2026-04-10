import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SearchIcon from "@mui/icons-material/Search";
import {
  getCie10Grupos,
  getCie10Subgrupos,
  getCie10Categorias,
  getCie10Diagnosticos,
  searchCie10,
} from "../../api/enfermeriaRequest";

const NIVELES = { GRUPO: 0, SUBGRUPO: 1, CATEGORIA: 2, DIAGNOSTICO: 3 };

function Cie10Page() {
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedGrupos, setExpandedGrupos] = useState({});
  const [expandedSubgrupos, setExpandedSubgrupos] = useState({});
  const [expandedCategorias, setExpandedCategorias] = useState({});
  const [subgruposCache, setSubgruposCache] = useState({});
  const [categoriasCache, setCategoriasCache] = useState({});
  const [diagnosticosCache, setDiagnosticosCache] = useState({});
  const [loadingSub, setLoadingSub] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  const fetchGrupos = async () => {
    setLoading(true);
    try {
      const { data } = await getCie10Grupos();
      setGrupos(data || []);
    } catch (e) {
      console.error(e);
      setGrupos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrupos();
  }, []);

  const toggleGrupo = async (id) => {
    const next = { ...expandedGrupos, [id]: !expandedGrupos[id] };
    setExpandedGrupos(next);
    if (next[id] && !subgruposCache[id]) {
      setLoadingSub((p) => ({ ...p, [id]: true }));
      try {
        const { data } = await getCie10Subgrupos(id);
        setSubgruposCache((c) => ({ ...c, [id]: data || [] }));
      } catch (e) {
        setSubgruposCache((c) => ({ ...c, [id]: [] }));
      } finally {
        setLoadingSub((p) => ({ ...p, [id]: false }));
      }
    }
  };

  const toggleSubgrupo = async (id) => {
    const next = { ...expandedSubgrupos, [id]: !expandedSubgrupos[id] };
    setExpandedSubgrupos(next);
    if (next[id] && !categoriasCache[id]) {
      setLoadingSub((p) => ({ ...p, [`s${id}`]: true }));
      try {
        const { data } = await getCie10Categorias(id);
        setCategoriasCache((c) => ({ ...c, [id]: data || [] }));
      } catch (e) {
        setCategoriasCache((c) => ({ ...c, [id]: [] }));
      } finally {
        setLoadingSub((p) => ({ ...p, [`s${id}`]: false }));
      }
    }
  };

  const toggleCategoria = async (id) => {
    const next = { ...expandedCategorias, [id]: !expandedCategorias[id] };
    setExpandedCategorias(next);
    if (next[id] && !diagnosticosCache[id]) {
      setLoadingSub((p) => ({ ...p, [`c${id}`]: true }));
      try {
        const { data } = await getCie10Diagnosticos(id);
        setDiagnosticosCache((c) => ({ ...c, [id]: data || [] }));
      } catch (e) {
        setDiagnosticosCache((c) => ({ ...c, [id]: [] }));
      } finally {
        setLoadingSub((p) => ({ ...p, [`c${id}`]: false }));
      }
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults(null);
      return;
    }
    setSearching(true);
    try {
      const { data } = await searchCie10(searchTerm.trim());
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (e) {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const paddingByLevel = (level) => ({
    pl: 2 + level * 3,
    fontWeight: level === NIVELES.DIAGNOSTICO ? 400 : 600,
  });

  return (
    <Container sx={{ py: 2 }}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Catálogo CIE-10
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Clasificación Internacional de Enfermedades 10.ª revisión. Expandir filas para ver el detalle.
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
        <TextField
          size="small"
          placeholder="Buscar por clave o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 280 }}
        />
        <IconButton color="primary" onClick={handleSearch} disabled={searching}>
          {searching ? <CircularProgress size={24} /> : <SearchIcon />}
        </IconButton>
      </Box>

      {searchResults !== null && (
        <Paper sx={{ mb: 2, p: 2 }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            Resultados de búsqueda ({searchResults.length})
          </Typography>
          {searchResults.length === 0 ? (
            <Typography color="text.secondary">Sin resultados</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Clave</strong></TableCell>
                  <TableCell><strong>Descripción</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchResults.map((d) => (
                  <TableRow key={d.id_diagnostico}>
                    <TableCell>{d.clave}</TableCell>
                    <TableCell>{d.descripcion}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      )}

      <Paper>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 48 }} />
                <TableCell><strong>Clave</strong></TableCell>
                <TableCell><strong>Descripción</strong></TableCell>
                <TableCell sx={{ width: 80 }}><strong>Nivel</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                grupos.map((g) => (
                  <CieRow
                    key={`g-${g.id_grupo}`}
                    row={g}
                    nivel={NIVELES.GRUPO}
                    labelNivel="Grupo"
                    expanded={expandedGrupos[g.id_grupo]}
                    onToggle={() => toggleGrupo(g.id_grupo)}
                    loading={loadingSub[g.id_grupo]}
                    childrenData={subgruposCache[g.id_grupo]}
                    childrenKey="id_subgrupo"
                    renderChild={(s) => (
                      <CieRow
                        key={`s-${s.id_subgrupo}`}
                        row={s}
                        nivel={NIVELES.SUBGRUPO}
                        labelNivel="Subgrupo"
                        expanded={expandedSubgrupos[s.id_subgrupo]}
                        onToggle={() => toggleSubgrupo(s.id_subgrupo)}
                        loading={loadingSub[`s${s.id_subgrupo}`]}
                        childrenData={categoriasCache[s.id_subgrupo]}
                        childrenKey="id_categoria"
                        renderChild={(c) => (
                          <CieRow
                            key={`c-${c.id_categoria}`}
                            row={c}
                            nivel={NIVELES.CATEGORIA}
                            labelNivel="Categoría"
                            expanded={expandedCategorias[c.id_categoria]}
                            onToggle={() => toggleCategoria(c.id_categoria)}
                            loading={loadingSub[`c${c.id_categoria}`]}
                            childrenData={diagnosticosCache[c.id_categoria]}
                            childrenKey="id_diagnostico"
                            renderChild={(d) => (
                              <TableRow key={`d-${d.id_diagnostico}`}>
                                <TableCell sx={{ pl: 11 }} />
                                <TableCell sx={paddingByLevel(NIVELES.DIAGNOSTICO)}>{d.clave}</TableCell>
                                <TableCell sx={paddingByLevel(NIVELES.DIAGNOSTICO)} colSpan={2}>
                                  {d.descripcion}
                                </TableCell>
                              </TableRow>
                            )}
                          />
                        )}
                      />
                    )}
                  />
                ))
              )}
              {!loading && grupos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    No hay datos CIE-10. Carga el backup con los diagnósticos.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}

function CieRow({
  row,
  nivel,
  labelNivel,
  expanded,
  onToggle,
  loading,
  childrenData,
  childrenKey,
  renderChild,
}) {
  const clave = row.clave ?? "";
  const descripcion = row.descripcion ?? "";
  const children = childrenData || [];
  const hasChildren = renderChild != null;

  return (
    <>
      <TableRow hover sx={{ "& > *": { borderBottom: "none" } }}>
        <TableCell sx={{ width: 48, py: 0.5 }}>
          {hasChildren ? (
            <IconButton size="small" onClick={onToggle} disabled={loading}>
              {loading ? (
                <CircularProgress size={20} />
              ) : expanded ? (
                <ExpandLessIcon fontSize="small" />
              ) : (
                <ExpandMoreIcon fontSize="small" />
              )}
            </IconButton>
          ) : null}
        </TableCell>
        <TableCell sx={{ pl: 2 + nivel * 3, fontWeight: 600 }}>{clave}</TableCell>
        <TableCell>{descripcion}</TableCell>
        <TableCell sx={{ color: "text.secondary", fontSize: "0.75rem" }}>{labelNivel}</TableCell>
      </TableRow>
      {hasChildren && (
        <TableRow>
          <TableCell colSpan={4} sx={{ py: 0, borderBottom: "none", verticalAlign: "top" }}>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Table size="small" sx={{ "& td": { borderBottom: "1px solid", borderColor: "divider" } }}>
                <TableBody>
                  {children.map((child) => renderChild(child))}
                </TableBody>
              </Table>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default Cie10Page;
