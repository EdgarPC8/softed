import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Collapse, IconButton, Typography, Box, TablePagination
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React, { useState } from 'react';

function UserRow({ user }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton onClick={() => setOpen(!open)} size="small">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{user.username || `Usuario ${user.userId}`}</TableCell>
        <TableCell align="right">{user.attempts?.length || 0}</TableCell>

      </TableRow>
      <TableRow>
        <TableCell colSpan={3} sx={{ p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>
                {(user.attempts?.length || 0) === 0 ? (

                <Typography variant="body2" color="text.secondary">
                  Sin intentos registrados.
                </Typography>
              ) : (
                user.attempts.map((attempt, i) => (
                  <Box key={i} sx={{ mb: 2, pl: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Intento #{attempt.attemptNumber} - {new Date(attempt.startedAt).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Preguntas respondidas: {attempt.answers.length}
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      Correctas: {attempt.answers.filter(a => a.isCorrect).length}
                    </Typography>
                    <Typography variant="body2" color="error.main">
                      Incorrectas: {attempt.answers.filter(a => a.isCorrect === false).length}
                    </Typography>
                  </Box>
                ))
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function UserResponsesTable({ users }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (!users || users.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Resumen por usuario
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Usuario</TableCell>
              <TableCell align="right"># de intentos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user, index) => (
                <UserRow key={user.userId || index} user={user} />
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={users.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Usuarios por página"
        />
      </TableContainer>
    </Box>
  );
}
