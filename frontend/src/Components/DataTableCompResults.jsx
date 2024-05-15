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
import Checkbox from '@mui/material/Checkbox'; // Import Checkbox
import { inputsNumberToTime } from '../helpers/functions';
import { updateTimeCompetencia } from '../api/competenciaResquest';

function createData(name,categoria, series, nadadores,entidades, tiempos,descalificados, history) {
  return {
    name,
    categoria,
    series,
    nadadores,
    entidades,
    tiempos,
    descalificados,
    history
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  const handleTiempoChange = (index, newValue) => {
    
  };

  const putTime = async(id,time)=>{
    const res = await updateTimeCompetencia(id,{tiempo:time})
    // console.log(id)
  }
  const putDesc = async(id,desc)=>{
    const res = await updateTimeCompetencia(id,{descalificado:desc})
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
        <TableCell align="right">{row.categoria}</TableCell>
        <TableCell align="right">{row.series.length}</TableCell>
        <TableCell align="right">{row.nadadores.length}</TableCell>
        <TableCell align="right">{row.entidades.length}</TableCell>
        <TableCell align="right">{row.tiempos}</TableCell>
        <TableCell align="right">{row.descalificados}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                {`Evento ${row.name}`}
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Puesto</TableCell>
                    <TableCell>Puntos</TableCell>
                    <TableCell>Nadador</TableCell>
                    <TableCell>Entidad</TableCell>
                    <TableCell>Tiempo</TableCell>
                    <TableCell>Desc</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.nadadores.map((nadadorData, index) => (
                    <TableRow key={`${nadadorData.cedula}${index}`}> 
                      <TableCell>
                        {`#${index + 1}`}
                      </TableCell>
                      <TableCell>{nadadorData.puntos}</TableCell>
                      <TableCell>{nadadorData.nadador}</TableCell>
                      <TableCell>{nadadorData.entidad}</TableCell>
                      <TableCell>{nadadorData.tiempo}</TableCell>
                      <TableCell>{nadadorData.descalificado === 0 ? "" : "Descalificado"}</TableCell>
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
            <TableCell align="right">Categoria</TableCell>
            <TableCell align="right">Series</TableCell>
            <TableCell align="right">Nadadores</TableCell>
            <TableCell align="right">Entidades</TableCell>
            <TableCell align="right">Tiempos</TableCell>
            <TableCell align="right">Descalificados</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : data
          ).map((row,index) => (
            <Row key={`${row.numero+row.prueba+row.categoria.name+row.genero}`} 
              row={createData(
                `#${row.numero} ${row.metros} ${row.prueba} ${row.categoria.name} ${row.genero}`, 
                row.categoria.name,
                row.series, 
                row.nadadores, 
                row.entidades,
                row.tiempos?`${row.tiempos.length}/${row.nadadores.length}`:"",
                row.descalificados?`${row.descalificados.length}/${row.nadadores.length}`:"0/0",
                row.series)} 
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
