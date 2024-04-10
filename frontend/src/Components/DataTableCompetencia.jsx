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
import TextField from '@mui/material/TextField';
import { inputsNumberToTime } from '../helpers/functions';


function createData(name, metros, prueba, categoria, genero, history) {
  return {
    name,
    metros,
    prueba,
    categoria,
    genero,
    history
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

const handleTiempoChange = (index, newValue) => {
  
};
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
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.metros}</TableCell>
        <TableCell align="right">{row.prueba}</TableCell>
        <TableCell align="right">{row.categoria}</TableCell>
        <TableCell align="right">{row.genero}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                {`Evento #${row.metros} ${row.prueba} ${row.categoria} ${row.genero}`}
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Carril</TableCell>
                    <TableCell>Cedula</TableCell>
                    <TableCell>Nadador</TableCell>
                    <TableCell>Entidad</TableCell>
                    <TableCell>Tiempo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyData, index) => (
                    <React.Fragment key={index}>
                      <TableRow>
                        <TableCell colSpan={6} style={{ borderBottom: 'unset' }}>
                          <Box sx={{ margin: 1 }}>
                            <Table size="small" aria-label="purchases">
                              <TableHead>
                                <TableRow>
                                  <TableCell colSpan={5} align={"center"}>Serie {index + 1}</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {historyData.Nadadores.map((nadadorData, nadIndex) => (
                                  <TableRow key={"nad"+nadIndex}>
                                    <TableCell component="th" scope="row">
                                    {nadadorData.carril}
                                    </TableCell>
                                    <TableCell>{nadadorData.cedula}</TableCell>
                                    <TableCell>{nadadorData.nadador}</TableCell>
                                    <TableCell>{nadadorData.entidad}</TableCell>
                                    <TableCell>
                                    <TextField
                                      type="text"
                                      defaultValue={nadadorData.tiempo}
                                      // onChange={(e) => handleTiempoChange(nadIndex, e.target.value)}
                                      inputProps={{ maxLength: 8 }}
                                      onKeyPress={(e) => {
                                        const charCode = e.charCode;
                                        if (charCode < 48 || charCode > 57) {
                                          e.preventDefault();
                                        }
                                      }}
                                      onBlur={(e) => {
                                        const newValue=e.target.value 
                                        e.target.value = inputsNumberToTime(newValue);
                                      }}
                                    />


                                    </TableCell>


                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
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

export default function CollapsibleTable({data=[]}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Evento</TableCell>
            <TableCell align="right">Series</TableCell>
            <TableCell align="right">Nadadores</TableCell>
            <TableCell align="right">Tiempos</TableCell>
            <TableCell align="right">Descalificados</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : data
          ).map((row,index) => (
            <Row key={row.Categoria+row.Genero+row.Prueba} 
              row={createData(
                `#${index+1} ${row.Prueba} ${row.Categoria} ${row.Genero}`, 
                row.Series.length, 
                "Numero de Nadadores", 
                "Tiempos Registrados", 
                "Nadadores descalificados",
                row.Series)} 
            />
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}
