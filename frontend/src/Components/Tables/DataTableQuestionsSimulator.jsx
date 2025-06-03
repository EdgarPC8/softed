import * as React from "react";
import { Box, Typography, RadioGroup, FormControlLabel, Radio, Button, Grid, Pagination, Badge } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import PushPinIcon from '@mui/icons-material/PushPin';


// Componente que maneja la lógica de las preguntas y la paginación
export default function DataTableQuestionsSimulator({
  rows = [
    {
      text: "Es verde el pasto?",
      id: 1,
      quizId: 1,
      options: [
        { text: "Verdadero", iCorrect: false, id: 1, questionid: 1 },
        { text: "Falso", iCorrect: true, id: 2, questionid: 1 },
      ],
    },
    {
      text: "La vaca dice mu?",
      id: 2,
      quizId: 1,
      options: [
        { text: "Verdadero", iCorrect: false, id: 3, questionid: 2 },
        { text: "Falso", iCorrect: true, id: 4, questionid: 2 },
      ],
    },
  ],
  selectedAnswers,
  setSelectedAnswers,
  markedQuestions,
  setMarkedQuestions,
  comprobateQuizQuestions,
  setEstadisticas,
  setFinalySimulation,
  setComprobateQuizQuestions,
  setDataQuestionsAnswers,
  finalySimulation
}) {
  const [page, setPage] = React.useState(1); // Página actual (1-based index)
  const rowsPerPage = 1; // Número de preguntas por página
  const { user } = useAuth(); // Obtenemos los datos del usuario desde el contexto
  React.useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowLeft') {
        // Si estamos en la primera página, no hacer nada.
        if (page > 1) {
          setPage(page - 1); // Retroceder una página
        }
      } else if (event.key === 'ArrowRight') {
        // Si estamos en la última página, no hacer nada.
        if (page < Math.ceil(rows.length / rowsPerPage)) {
          setPage(page + 1); // Avanzar una página
        }
      }
    };
  
    // Añadir el event listener
    window.addEventListener('keydown', handleKeyPress);
  
    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [page, rows.length]); // Dependencia para que se actualice con la página y el número de filas
  


  const handleAnswerChange = (questionId, answerId) => {
    const newSelectedAnswers = {
      ...selectedAnswers,
      [questionId]: answerId,
    };
    setSelectedAnswers(newSelectedAnswers);

    // Guardar las respuestas en el localStorage
    localStorage.setItem('selectedAnswers', JSON.stringify(newSelectedAnswers));
    cargarEstadisticas({ newSelectedAnswers: newSelectedAnswers })

  };
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleMarkQuestion = (questionId) => {
    let newMarkedQuestions = { ...markedQuestions };

    // Si la pregunta ya está marcada, la eliminamos
    if (newMarkedQuestions[questionId]) {
      delete newMarkedQuestions[questionId];
    } else {
      // Si no está marcada, la agregamos
      newMarkedQuestions[questionId] = questionId;
    }

    setMarkedQuestions(newMarkedQuestions);
    cargarEstadisticas({ newSelectedAnswers: selectedAnswers, newMarkedQuestions: newMarkedQuestions })
    // Guardar en localStorage
    localStorage.setItem('markedQuestions', JSON.stringify(newMarkedQuestions));
  };
  // Filtrar filas según la página actual
  const currentRows = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const cargarEstadisticas = ({ newSelectedAnswers = selectedAnswers, newMarkedQuestions = markedQuestions, button = false }) => {
    let preguntasBien = 0
    let preguntasMal = 0
    const arrayAnswersData = []
    if (newSelectedAnswers) {
      Object.entries(newSelectedAnswers).forEach(([clave, valor]) => {
        const pregunta = rows.find(pre => `${pre.id}` === `${clave}`);
        const opcion = pregunta.options.find(option => `${option.id}` === `${valor}`);
        let focusValue = 0
        if (newMarkedQuestions[clave] && Object.keys(newMarkedQuestions).length > 0) {
          focusValue = newMarkedQuestions[clave] ? 1 : 0
        }
        arrayAnswersData.push({
          questionId: clave,
          optionId: valor,
          isCorrect: opcion.iCorrect ? 1 : 0,
          userId: user.userId,
          intent: 4,
          focus: focusValue,
        })
        // newMarkedQuestions[pregunta.id]?console.log(newMarkedQuestions[pregunta.id]):""
        // console.log(clave + ": " + valor);
        opcion.iCorrect ? preguntasBien++ : preguntasMal++
      });
    }
    // console.log(arrayAnswersData)

    if (preguntasBien + preguntasMal > 0 && finalySimulation && button) {
      setFinalySimulation(false)
      setComprobateQuizQuestions(true)
      setDataQuestionsAnswers(arrayAnswersData)
    }
    if (!comprobateQuizQuestions) {
      setEstadisticas({
        answeredQuestions: preguntasBien + preguntasMal,
        correctAnswers: preguntasBien,
        incorrectAnswers: preguntasMal
      })

    }

    // console.log(preguntasBien,preguntasMal)
  };

  return (
    <Box sx={{ maxWidth: "1300px", margin: "auto", p: 0 }}>
      {currentRows.map((row, index) => (
        <Grid container key={row.id} >
          <Grid container key={`Segundo${row.id}`} xs={12} md={8}>
            {/* Información de la Pregunta */}
            <Grid item xs={12} md={2}>
              <Box
                sx={{
                  padding: 4,
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  textAlign: "center",
                }}
              >
                <Typography variant="h6">Pregunta {index + 1 + (page - 1) * rowsPerPage}</Typography>
                <Typography variant="body1">Respuesta Incompleta</Typography>
                <Typography variant="body1">Puntúa como 1,00</Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    mt: 1,
                    backgroundColor: markedQuestions[row.id] ? 'secondary.main' : 'default', // Cambiar a amarillo si la pregunta está marcada
                  }}
                  onClick={() => handleMarkQuestion(row.id)} // Marcar o desmarcar la pregunta
                >
                  {markedQuestions[row.id] ? 'Desmarcar Pregunta' : 'Marcar Pregunta'}
                </Button>

              </Box>
            </Grid>
            {/* Contenido Principal de la Pregunta */}
            <Grid item xs={12} md={10}>
              <Box
                sx={{
                  padding: 2,
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  height: 300,
                }}
              >
                <Typography variant="h6">{row.text}</Typography>
                <RadioGroup
                  value={selectedAnswers[row.id] || ""}
                  onChange={(e) => handleAnswerChange(row.id, e.target.value)}
                >
                  {row.options.map((option) => {
                    const errorColor = "text.error"
                    const successColor = "text.success"
                    const defaultColor = "default"
                    let color = defaultColor
                    if (selectedAnswers[row.id] && !comprobateQuizQuestions) {
                      if (option.iCorrect) {
                        color = successColor
                      } else {
                        color = errorColor
                      }
                    }
                    return (
                      <FormControlLabel
                        disabled={!finalySimulation}

                        sx={{
                          backgroundColor: color,
                        }}
                        key={option.id}
                        value={option.id}
                        control={<Radio />}
                        label={option.text}
                      />
                    )
                  })}
                </RadioGroup>

              </Box>
            </Grid>
            <Grid item xs={12} md={12}>
              {/* Paginación con flechas para navegar entre preguntas */}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Pagination
                  count={Math.ceil(rows.length / rowsPerPage)} // Total de páginas
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                padding: 0.5,
                border: "1px solid #ccc",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <Preguntas questions={rows} setPage={setPage} selectedAnswers={selectedAnswers} page={page} markedQuestions={markedQuestions} comprobateQuizQuestions={comprobateQuizQuestions} />

            </Box>
            <Button variant="contained" size="small" onClick={() => cargarEstadisticas({ button: true })} disabled={!finalySimulation}>
              Finalizar Simulador
            </Button>
          </Grid>
        </Grid>
      ))}
    </Box>
  );
}



function Preguntas({ questions, setPage, selectedAnswers, page, markedQuestions, comprobateQuizQuestions }) {
  const green = "text.success";
  const red = "text.error";
  const dark = "text.dark";
  const normal = "text.muted";
  let borderColor = "none"
  let color = normal;
  let badgeValue = false

  const gridItems = questions.map((question, index) => {
    const foundOption = question.options.find(option => `${option.id}` === `${selectedAnswers[question["id"]]}`);
    markedQuestions[question.id] ? badgeValue = true : badgeValue = false
    if (!comprobateQuizQuestions && foundOption) {
      foundOption.iCorrect ? color = green : color = red
      page === index + 1 ? borderColor = "purple" : borderColor = "none"
    } else {
      selectedAnswers[question["id"]] ? color = dark : color = normal
      page === index + 1 ? borderColor = "yellow" : borderColor = "none"
    }
    return (
      <Grid item xs={1} key={index}>

        <Badge

          color="secondary"
          badgeContent={<PushPinIcon sx={{ fontSize: 8 }} />}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{
            '& .MuiBadge-badge': {
              minWidth: '12px', // Ajusta el ancho mínimo del círculo
              height: '12px',   // Ajusta la altura del círculo
              fontSize: '8px',  // Opcional: ajusta el tamaño del contenido
              padding: '0',     // Opcional: elimina relleno extra
              visibility: badgeValue ? 'visible' : 'hidden'
            },
          }}
        >
          <Button
            variant="contained"
            sx={{
              minWidth: 25,
              minHeight: 25,
              fontSize: 12,
              padding: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: color,
              border: `2px solid ${borderColor}`, // Aquí defines el color del borde
              borderRadius: '4px', // Opcional: ajusta el radio del borde (esquinas redondeadas)
            }}
            onClick={() => setPage(index + 1)} // Notifica al padre que cambie a la página seleccionada
          >
            {index + 1}
          </Button>

        </Badge>
      </Grid>
    );
  });

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 0, m: 0 }}>
      <Grid container spacing={1} maxWidth={400}>
        {gridItems}
      </Grid>
    </Box>
  );
}


