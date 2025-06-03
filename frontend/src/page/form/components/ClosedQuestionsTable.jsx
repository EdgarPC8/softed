import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Collapse, IconButton, Typography, Box, TablePagination
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React, { useState } from 'react';

function ClosedQuestionRow({ question }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton onClick={() => setOpen(!open)} size="small">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{question.questionText}</TableCell>
        <TableCell align="right">{question.answers.length}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={3} sx={{ p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>
              {question.answers.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Sin respuestas aún.
                </Typography>
              ) : (
                question.answers.map((a, idx) => (
                  <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
                    • {a.answerText}
                  </Typography>
                ))
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function ClosedQuestionsTable({ questions }) {
  const closedQuestions = questions.filter(q => q.type === 'text' || q.type === 'paragraph');

  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Puedes ajustar este valor

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (closedQuestions.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Preguntas de respuesta abierta
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Pregunta</TableCell>
              <TableCell align="right">Cantidad de respuestas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {closedQuestions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((q) => (
                <ClosedQuestionRow key={q.questionId} question={q} />
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={closedQuestions.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Preguntas por página"
        />
      </TableContainer>
    </Box>
  );
}
