import * as React from 'react';
import PropTypes from 'prop-types';
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

function createData(name, metros, prueba, categoria, genero,history) {
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
              {`Evento #${row.name} ${row.metros} ${row.prueba} ${row.categoria} ${row.genero}`}
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
                  {row.history.map((historyRow,num) => (
                    <TableRow key={historyRow.ci}>
                       <TableCell component="th" scope="row">
                        {num+1}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {historyRow.ci}
                      </TableCell>
                      <TableCell>{historyRow.nadador}</TableCell>
                      <TableCell>{historyRow.entidad}</TableCell>
                      <TableCell>{historyRow.tiempo}</TableCell>
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

Row.propTypes = {
  row: PropTypes.shape({
    categoria: PropTypes.string.isRequired,
    genero: PropTypes.string.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        ci: PropTypes.string.isRequired,
        nadador: PropTypes.string.isRequired,
        entidad: PropTypes.string.isRequired,
        tiempo: PropTypes.string.isRequired,
      }),
    ).isRequired,
    metros: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    prueba: PropTypes.string.isRequired,
  }).isRequired,
};


const rows = [
  createData("1", "50 Metros", "Libre", "2011-2012", "Femenino",[
    {
      ci: '1104661598',
      nadador: 'Edgar Torres',
      entidad: 'Tiburones',
      tiempo: '00:00:59,89',
    },
    {
      ci: '1104661528',
      nadador: 'Patricio Torres',
      entidad: 'Titanes',
      tiempo: '00:00:12,34',
    }
   
  ],),
];

export default function CollapsibleTable() {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Evento</TableCell>
            <TableCell align="right">Metros</TableCell>
            <TableCell align="right">Prueba</TableCell>
            <TableCell align="right">Categoria</TableCell>
            <TableCell align="right">Genero</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
