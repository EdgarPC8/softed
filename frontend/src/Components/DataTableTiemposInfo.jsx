import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TablePagination from '@mui/material/TablePagination';
import { convertirMilisegundosATiempo, convertirTiempoAMilisegundos, getDiferenciasEntreTiempos } from '../helpers/functions';

function createData(index, fecha,tiemposTotal,
  tiemposNuevos,
  tiemposSuperados,
  tiemposNoSuperados, pruebas) {
  return {
    index,
    fecha,
    tiemposTotal,
  tiemposNuevos,
  tiemposSuperados,
  tiemposNoSuperados, 
    pruebas
  };
}

function PruebaRow({ prueba }) {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {prueba.prueba}
        </TableCell>
        <TableCell>{prueba.tiemposTotal}</TableCell>
        <TableCell>{`${prueba.tiemposNuevos}/${prueba.tiemposTotal}`}</TableCell>
        <TableCell>{`${prueba.tiemposSuperados}/${prueba.tiemposTotal}`}</TableCell>
        <TableCell>{`${prueba.tiemposNoSuperados}/${prueba.tiemposTotal}`}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="tiempos">
                <TableHead>
                  <TableRow>
                    <TableCell>Metros</TableCell>
                    <TableCell>Tiempo</TableCell>
                    <TableCell>Record Anterior</TableCell>
                    <TableCell>Fecha Record</TableCell>
                    <TableCell>Info</TableCell>
                    <TableCell>Diferencia</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prueba.dataPruebas.map((tiempo, index) => (
                    <TableRow key={index}>
                      <TableCell>{tiempo.metros}</TableCell>
                      <TableCell>{tiempo.tiempo}</TableCell>
                      <TableCell>{tiempo.recordAnterior === null ? tiempo.tiempo : tiempo.recordAnterior}</TableCell>
                      <TableCell>{tiempo.recordAnterior === null ? 'HOY' : tiempo.recordFechaAnterior}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'inline-block',
                            padding: '0.5em 1em 0.1em 0.1em',
                            borderRadius: '8px',
                            backgroundColor:
                              tiempo.tipoTiempo === 'Superado'
                                ? '#a5d6a7' // Verde suave
                                : tiempo.tipoTiempo === 'Nuevo'
                                ? '#fff59d' // Amarillo suave
                                : tiempo.tipoTiempo === 'No Superado'
                                ? '#ef9a9a' // Rojo suave
                                : '#ffffff', // Blanco como valor predeterminado (en caso de no coincidir con ninguno)
                            color: '#000', // Texto negro para mejor legibilidad
                            width: '100px', // Ancho fijo para todos los fondos coloreados
                          }}
                        >
                          {tiempo.tipoTiempo}
                        </Box>
                      </TableCell>
                      <TableCell>{tiempo.recordAnterior === null ? 'Nuevo' : getDiferenciasEntreTiempos(tiempo.tiempo,tiempo.recordAnterior)}</TableCell>


                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function FechaRow({ row }) {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="right">{row.index}</TableCell>
        <TableCell align="right">{row.fecha}</TableCell>
        <TableCell>{row.tiemposTotal}</TableCell>
        <TableCell>{`${row.tiemposNuevos}/${row.tiemposTotal}`}</TableCell>
        <TableCell>{`${row.tiemposSuperados}/${row.tiemposTotal}`}</TableCell>
        <TableCell>{`${row.tiemposNoSuperados}/${row.tiemposTotal}`}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Pruebas
              </Typography>
              <Table size="small" aria-label="pruebas">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Prueba</TableCell>
                    <TableCell>Tiempos Total</TableCell>
                    <TableCell>Tiempos Nuevos</TableCell>
                    <TableCell>Tiempos Superados</TableCell>
                    <TableCell>Tiempos No Superados</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.pruebas.map((prueba, index) => (
                    <PruebaRow key={index} prueba={prueba} />
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CollapsibleTable({ data = [] }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const rows = data.map((row, index) =>
    createData(`#${index}`, row.fecha,
    row.tiemposTotal,
    row.tiemposNuevos,
    row.tiemposSuperados,
    row.tiemposNoSuperados, row.pruebas)
  );


  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>#</TableCell>
            <TableCell align="right">Fecha</TableCell>
            <TableCell>Tiempos Total</TableCell>
            <TableCell>Tiempos Nuevos</TableCell>
            <TableCell>Tiempos Superados</TableCell>
            <TableCell>Tiempos No Superados</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row, index) => (
            <FechaRow key={index} row={row} />
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}
