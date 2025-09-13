import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Paper, TextField, Typography, Box
} from '@mui/material';

const TablePro = ({
  columns = [],
  rows = [],
  title = '',
  showSearch = true,
  showPagination = true,
  rowsPerPageOptions = [5, 10, 25],
  defaultRowsPerPage = 5,
  showIndex = false,            // 👈 muestra columna #
  indexHeader = '#',            // 👈 texto encabezado de la columna índice
  tableMaxHeight = 150,         // 👈 alto máximo del contenedor (scroll)
}) => {
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value.toLowerCase());
    setPage(0);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filtrado: usa column.getSearchValue(row) si existe; si no, row[column.id]
  const filteredRows = rows.filter((row) =>
    columns.some((column) => {
      const raw = column.getSearchValue ? column.getSearchValue(row) : row[column.id];
      if (raw == null) return false;
      const val = typeof raw === 'string' || typeof raw === 'number' ? String(raw).toLowerCase() : '';
      return val.includes(searchText);
    })
  );

  const paginatedRows = showPagination
    ? filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : filteredRows;

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2 }}>
        {title && <Typography variant="h6" gutterBottom>{title}</Typography>}
        {showSearch && (
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar..."
            value={searchText}
            onChange={handleSearchChange}
            sx={{ mb: 2 }}
          />
        )}

        <TableContainer sx={{ maxHeight: tableMaxHeight }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {showIndex && <TableCell sx={{ width: 56 }}>{indexHeader}</TableCell>}
                {columns.map((column) => (
                  <TableCell key={column.id}>{column.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedRows.map((row, idx) => (
                <TableRow hover key={row.id ?? `${idx}-${Math.random()}`}>
                  {showIndex && (
                    <TableCell sx={{ py: 0.5 }}>
                      {showPagination ? page * rowsPerPage + idx + 1 : idx + 1}
                    </TableCell>
                  )}

                  {columns.map((column) => (
                    <TableCell key={column.id} sx={{ py: 0.5 }}>
                      {column.render ? column.render(row) : row[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {paginatedRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={(showIndex ? 1 : 0) + columns.length} align="center">
                    No hay datos
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {showPagination && (
          <TablePagination
            component="div"
            count={filteredRows.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions}
          />
        )}
      </Box>
    </Paper>
  );
};

export default TablePro;
