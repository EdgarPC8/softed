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
import { updateTimeCompetencia } from '../api/competenciaResquest';
import Checkbox from '@mui/material/Checkbox'; // Import Checkbox





function createData(name, metros, prueba, categoria, genero, history,pruebasHeaders) {
  return {
    name,
    metros,
    prueba,
    categoria,
    genero,
    history,
    pruebasHeaders
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const handleChange = (event, key) => {
    const checked = event.target.checked;
    // Realizar cualquier acción necesaria cuando se cambie el estado del Checkbox
    // console.log(`Checkbox ${key} checked: ${checked}`);
  };

  const putTime = async (id, time) => {
    const res = await updateTimeCompetencia(id, { tiempo: time })
    // console.log(id)
  }



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
                    <TableCell>#</TableCell>
                    <TableCell>Cedula</TableCell>
                    <TableCell>Nadador</TableCell>
                    <TableCell>Categoria</TableCell>
                    {row.pruebasHeaders.map((historyData, index) => (
                      <TableCell key={index+"pruebasHeaders"}>
                        {historyData.name}
                      </TableCell>
                    ))}
                    {/* <TableCell>25PR_L</TableCell>
                    <TableCell>25PR_E</TableCell>
                    <TableCell>25Lib</TableCell>
                    <TableCell>25Esp</TableCell>
                    <TableCell>25Pech</TableCell>
                    <TableCell>25Mari</TableCell>
                    <TableCell>50Lib</TableCell>
                    <TableCell>50Esp</TableCell>
                    <TableCell>50Pech</TableCell>
                    <TableCell>50Mari</TableCell>
                    <TableCell>100CI</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyData, index) => (
                    <React.Fragment key={historyData.Cedula}>
                      <TableRow>
                        <TableCell>
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          {historyData.Cedula}
                        </TableCell>
                        <TableCell>
                          {historyData.Nadador}
                        </TableCell>
                        <TableCell>
                          {historyData.Categoria}
                        </TableCell>
                        {row.pruebasHeaders.map((pruebaData, index) => (
                        <TableCell key={index+"pruebas"}>
                        <Checkbox
                          defaultChecked={historyData.ArrayChecks.includes(pruebaData)}
                          onChange={(event) => handleChange(event, pruebaData)}
                        />
                      </TableCell>
                      ))}
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

export default function CollapsibleTable({ data = [
  {Id:0,Nadadores:[
    {Categoria:"2006-2007",Cedula:1104661598,Id:1,Nadador:"Edgar Torres",ArrayChecks:["25PR_E"]},
    // {Categoria:"2006-2007",Cedula:1104661599,Id:2,Nadador:"Hola Torres",ArrayChecks:{CI100:"checked"}}
  ],Nombre:"Prueba"}] }) {

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
            <TableCell>Entidad</TableCell>
            <TableCell align="right">Nadadores</TableCell>
            <TableCell align="right">Categorias</TableCell>
            <TableCell align="right">Tiempos</TableCell>
            <TableCell align="right">Descalificados</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : data
          ).map((row, index) => (
            <Row key={row.Nombre}
              row={createData(
                row.Nombre,
                row.Nadadores.length,
                "Numero de Nadadores",
                "Tiempos Registrados",
                "Nadadores descalificados",
                row.Nadadores,
                [
                {name:"PR_L",metros:"25 Metros",prueba:"PR_L",},
                {name:"PR_E",metros:"25 Metros",prueba:"PR_E",},
                {name:"Libre25",metros:"25 Metros",prueba:"Libre",},
                {name:"Espalda25",metros:"25 Metros",prueba:"Espalda",},
                {name:"Pecho25",metros:"25 Metros",prueba:"Pecho",},
                {name:"Mariposa25",metros:"25 Metros",prueba:"Mariposa",},
                {name:"Libre50",metros:"50 Metros",prueba:"Libre",},
                {name:"Espalda50",metros:"50 Metros",prueba:"Espalda",},
                {name:"Pecho50",metros:"50 Metros",prueba:"Pecho",},
                {name:"Mariposa50",metros:"50 Metros",prueba:"Mariposa",},
                {name:"CI100",metros:"100 Metros",prueba:"CI",},
              ])}
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
