import { Container, Grid, Typography, Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import * as React from "react";
import { getOptionsQuestions,addAllAnswersUsers } from "../../api/quizRequest.js";
import DataTableQuestionsSimulator from "../Tables/DataTableQuestionsSimulator.jsx";

function QuizPage() {
  const [dataQuestions, setDataQuestions] = useState([]);
  const [dataQuestionsAnswers, setDataQuestionsAnswers] = useState([]);
  const [quizStarted, setQuizStarted] = useState(true);
  const [finalySimulation, setFinalySimulation] = useState(true);
  const [comprobateQuizQuestions, setComprobateQuizQuestions] = useState(false);
  const [estadisticas, setEstadisticas] = useState({
    answeredQuestions:0,
    correctAnswers:0,
    incorrectAnswers:0,
  }); // Nueva página actual
  const [selectedAnswers, setSelectedAnswers] = React.useState(() => {
    // Intentar recuperar las respuestas del localStorage
    const savedAnswers = JSON.parse(localStorage.getItem('selectedAnswers'));
      return savedAnswers || {}; // Si no hay respuestas guardadas, usa un objeto vacío
  });
  const [markedQuestions, setMarkedQuestions] = React.useState(JSON.parse(localStorage.getItem('markedQuestions')) || {}); // Estado para preguntas marcadas
  const [timeLeft, setTimeLeft] = useState(3600); // Tiempo inicial en segundos (ejemplo: 1 hora)

  // Función para formatear el tiempo como hh:mm:ss
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    // if (timeLeft <= 0) return; // Detener el temporizador cuando llegue a 0
    // const timer = setInterval(() => {
    //   setTimeLeft((prev) => prev - 1);
    // }, 1000);

    // return () => clearInterval(timer); // Limpiar el intervalo al desmontar
  }, [timeLeft]);

  // Función para cargar el estado guardado en localStorage
  const loadSavedState = () => {
    const savedState = JSON.parse(localStorage.getItem("quizState"));
    if (savedState) {
      // Si hay preguntas guardadas, actualiza el estado
      setDataQuestions(savedState.dataQuestions);
      setEstadisticas({
        answeredQuestions:savedState.answeredQuestions,
        correctAnswers:savedState.correctAnswers,
        incorrectAnswers:savedState.incorrectAnswers
      });
      // setQuizStarted(savedState.quizStarted);
      setQuizStarted(false);  // Si no hay estado guardado, el cuestionario no ha iniciado
    } else {
      setQuizStarted(true);  // Si no hay estado guardado, el cuestionario no ha iniciado
    }
  };

  // Guardar el estado en localStorage
  const saveStateToLocalStorage = async () => {
    const { data } = await getOptionsQuestions();
    setDataQuestions(data);
    const state = {
      dataQuestions: data,
    };
    localStorage.setItem("quizState", JSON.stringify(state));
  };
  const saveDataBase = async () => {

    // console.log(selectedAnswers,dataQuestionsAnswers)

    await addAllAnswersUsers(dataQuestionsAnswers)


  };
    //Comprobar 
    const comprobateQuiz = async () => {
      setComprobateQuizQuestions(!comprobateQuizQuestions)
      let preguntasBien=0
      let preguntasMal=0
    Object.entries(selectedAnswers).forEach(([clave, valor]) => {
      const pregunta = dataQuestions.find(pre => `${pre.id }`=== `${clave}`);
      const opcion = pregunta.options.find(option => `${option.id }`=== `${valor}`);
      // console.log(clave + ": " + valor);
      opcion.iCorrect?preguntasBien++:preguntasMal++
    });

    if(comprobateQuizQuestions){
      setEstadisticas({})
    }else{
      setEstadisticas({
        correctAnswers:preguntasBien,
        incorrectAnswers:preguntasMal,
        answeredQuestions:preguntasBien+preguntasMal,
      })

    }
  
    };

  // Eliminar el estado guardado en localStorage
  const deleteSavedState = () => {
    localStorage.removeItem("quizState");
    localStorage.removeItem("selectedAnswers");
    localStorage.removeItem("markedQuestions");
    setSelectedAnswers({})
    setMarkedQuestions({})
    setDataQuestions([]);
    setQuizStarted(true);
    setFinalySimulation(true)


  };

  const startQuiz = () => {
    setQuizStarted(false);
    saveStateToLocalStorage();  // Guardar el estado al iniciar el cuestionario
  };

  const resetQuiz = () => {
    deleteSavedState()
    setQuizStarted(false);
    saveStateToLocalStorage();  // Guardar el estado al reiniciar el cuestionario
  };

  useEffect(() => {
    loadSavedState();  // Cargar el estado guardado al iniciar la página
  }, []);

  return (
    <Container>
      <Grid container spacing={1}>
        {/* Columna de la tabla */}
        <Grid item xs={12} md={12}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  padding: 2,
                  marginBottom: 2,
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Typography variant="h6">
              Estadísticas {" "}
              <Typography
                variant="subtitle1"
                component="span"
                sx={{ color: "#1976d2", fontWeight: "bold" }}
              >
                {formatTime(timeLeft)} {/* Temporizador */}
              </Typography>
            </Typography>
                <Typography variant="body1">Total de preguntas: {dataQuestions.length}</Typography>
                <Typography variant="body1">
                  Preguntas contestadas: {estadisticas.answeredQuestions}
                </Typography>
                <Typography variant="body1">
                  Preguntas acertadas: {estadisticas.correctAnswers}
                </Typography>
                <Typography variant="body1">
                  Preguntas no acertadas: {estadisticas.incorrectAnswers}
                </Typography>
                
              </Box>
            </Grid>

            {/* Botones para iniciar, reiniciar, eliminar y guardar el cuestionario */}
            <Grid item xs={12} md={8} sx={{ display: "flex", justifyContent: "space-between" }}>
              
              <Button
                variant="contained"
                color="primary"
                onClick={startQuiz}
                disabled={!quizStarted}
              >
                Iniciar Cuestionario
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={resetQuiz}
                disabled={quizStarted}
              >
                Recargar Cuestionario
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={deleteSavedState}
                disabled={quizStarted}  // Deshabilitar si no se ha iniciado el cuestionario
              >
                Eliminar Cuestionario
              </Button>
              <Button
                variant="contained"
                color="info"
                onClick={saveDataBase}
                disabled={finalySimulation}  // Deshabilitar si no se ha iniciado el cuestionario
              >
                Guardar Cuestionario
              </Button>

              <Button
                variant="contained"
                color="success"
                onClick={comprobateQuiz}
                disabled={!finalySimulation||quizStarted}  // Deshabilitar si no se ha iniciado el cuestionario
              >
                {!comprobateQuizQuestions?"Comprobar Cuestionario (Desactivado)":"Comprobar Cuestionario (Activado)"}
                
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={12}>
          <DataTableQuestionsSimulator rows={dataQuestions} selectedAnswers={selectedAnswers}
          setSelectedAnswers={setSelectedAnswers}
          comprobateQuizQuestions={!comprobateQuizQuestions}
          setComprobateQuizQuestions={setComprobateQuizQuestions}
          markedQuestions={markedQuestions}
          setFinalySimulation={setFinalySimulation}
          finalySimulation={finalySimulation}
          setDataQuestionsAnswers={setDataQuestionsAnswers}
          setEstadisticas={setEstadisticas}
          setMarkedQuestions={setMarkedQuestions}/>
        </Grid>
      </Grid>
    </Container>
  );
}

export default QuizPage;
