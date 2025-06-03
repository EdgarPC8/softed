import React, { useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TablePagination from "@mui/material/TablePagination";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { addAnswerUser } from "../../api/quizRequest";
import { useAuth } from "../../context/AuthContext";


function createData(number, id, question, options) {
  return {
    number,
    id,
    question,
    options,
  };
}
function Row({ row, onAnswer }) {
  const { user} = useAuth(); // Obtenemos los datos del usuario desde el contexto

    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
  
    const handleRadioChange = (event) => {
      const selectedValue = event.target.value; // Valor del texto de la opción seleccionada
      setSelectedOption(selectedValue); // Almacena la opción seleccionada
      
      // Busca la opción seleccionada en el array
      const selectedOptionData = row.options.find(
        (option) => option.text === selectedValue
      );
    
      if (selectedOptionData) {
        const { id, iCorrect } = selectedOptionData; // Extrae el ID y si es correcta
        // console.log({ questionId: row.id, optionId: id,userId:user.userId,intent:1 });
        addAnswerUser({ questionId: row.id, optionId: id,userId:user.userId,intent:28,isCorrect: iCorrect});
    
        // Notifica al componente principal que se respondió la pregunta
        onAnswer(iCorrect);
      }
    };
    
  
    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
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
            {row.number} {row.question}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table size="small" aria-label="purchases">
                  <TableBody>
                    <RadioGroup
                      aria-labelledby={`radio-group-label-${row.id}`}
                      name={`radio-buttons-group-${row.id}`}
                      onChange={handleRadioChange}
                    >
                      {row.options.map((option, index) => (
                        <TableRow key={`Row${row.id}-${index}`}>
                          <TableCell>{`${index + 1}.-`}</TableCell>
                          <TableCell
                            width={"100%"}
                            sx={{
                              backgroundColor:
                                selectedOption !== null // Si hay una opción seleccionada
                                  ? option.iCorrect
                                    ? "colors.green" // Verde si es correcta
                                    : "colors.red"   // Rojo si es incorrecta
                                  : "transparent",    // Sin color si ninguna opción está seleccionada
                              color: selectedOption !== null ? "white" : "inherit",
                            }}
                          >
                            <FormControlLabel
                              value={option.text} // Valor del radio
                              control={<Radio disabled={!!selectedOption} />} // Bloquear si hay una selección
                              label={option.text}
                            />
                          </TableCell>

                        </TableRow>
                      ))}
                    </RadioGroup>
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }
  

export default function DataTableQuestions({ data = [] }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);

  const handleAnswer = (isCorrect) => {
    setAnsweredQuestions((prev) => prev + 1);
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setIncorrectAnswers((prev) => prev + 1);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Box
        sx={{
          padding: 2,
          marginBottom: 2,
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography variant="h6">Estadísticas</Typography>
        <Typography variant="body1">Total de preguntas: {data.length}</Typography>
        <Typography variant="body1">
          Preguntas contestadas: {answeredQuestions}
        </Typography>
        <Typography variant="body1">
          Preguntas acertadas: {correctAnswers}
        </Typography>
        <Typography variant="body1">
          Preguntas no acertadas: {incorrectAnswers}
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Pregunta</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : data
            ).map((row, index) => (
              <Row
                key={`Row${row.id}${index}`}
                row={createData(
                  `${index + 1}.-`,
                  row.id,
                  row.text,
                  row.options
                )}
                onAnswer={handleAnswer}
              />
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50,100,200]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </>
  );
}
