import {
  Box,
  Container,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  TextField,
  Typography,
  Button
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getQuestionsByQuiz } from "../../../api/quizRequest";
import { useAuth } from "../../../context/AuthContext";

function QuizSimulatorMode() {
  const { id: quizId } = useParams();
  const { user } = useAuth();
  const [infoQuiz, setInfoQuiz] = useState({});
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await getQuestionsByQuiz(quizId);
        setInfoQuiz(res.data.form);
        setQuestions(res.data.questions);
      } catch (err) {
        console.error("Error cargando preguntas", err);
      }
    };
    fetchQuestions();
  }, [quizId]);

  const currentQuestion = questions[currentIndex];

  const handleSelect = (question, selected) => {
    const correct = (() => {
      if (question.type === "single") {
        const selectedOption = question.options.find((opt) => opt.text === selected);
        return selectedOption?.isCorrect;
      }
      if (question.type === "multiple") {
        const correctOptions = question.options.filter(o => o.isCorrect).map(o => o.text).sort();
        const selectedOptions = [...selected].sort();
        return JSON.stringify(correctOptions) === JSON.stringify(selectedOptions);
      }
      return false;
    })();

    setAnswers({ ...answers, [question.id]: selected });
    setFeedback({ ...feedback, [question.id]: correct });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const isAnswered = answers[currentQuestion?.id] !== undefined;
  const result = feedback[currentQuestion?.id];

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4">{infoQuiz.title}</Typography>
        <Typography variant="body1">{infoQuiz.description}</Typography>
        <Typography variant="caption" color="text.secondary">
          Fecha: {new Date(infoQuiz.date).toLocaleDateString()}
        </Typography>
      </Box>

      {currentQuestion && (
        <Box mb={4}>
          <Typography variant="h6">
            Pregunta {currentIndex + 1} de {questions.length}: {currentQuestion.text}
          </Typography>

          {currentQuestion.type === "open" && (
            <TextField
              fullWidth
              variant="outlined"
              value={answers[currentQuestion.id] || ""}
              onChange={(e) => handleSelect(currentQuestion, e.target.value)}
              disabled={isAnswered}
            />
          )}

          {currentQuestion.type === "single" && (
            <RadioGroup
              value={answers[currentQuestion.id] || ""}
              onChange={(e) => handleSelect(currentQuestion, e.target.value)}
            >
              {currentQuestion.options.map((opt) => (
                <FormControlLabel
                  key={opt.id}
                  value={opt.text}
                  control={<Radio disabled={isAnswered} />}
                  label={opt.text}
                />
              ))}
            </RadioGroup>
          )}

          {currentQuestion.type === "multiple" && (
            <FormGroup>
              {currentQuestion.options.map((opt) => (
                <FormControlLabel
                  key={opt.id}
                  control={
                    <Checkbox
                      disabled={isAnswered}
                      checked={(answers[currentQuestion.id] || []).includes(opt.text)}
                      onChange={() => {
                        const current = answers[currentQuestion.id] || [];
                        const updated = current.includes(opt.text)
                          ? current.filter((val) => val !== opt.text)
                          : [...current, opt.text];
                        handleSelect(currentQuestion, updated);
                      }}
                    />
                  }
                  label={opt.text}
                />
              ))}
            </FormGroup>
          )}

          {isAnswered && (
            <Typography
              variant="subtitle2"
              color={result ? "green" : "red"}
              sx={{ mt: 1 }}
            >
              {result ? "✔ Respuesta correcta" : "✘ Respuesta incorrecta"}
            </Typography>
          )}

          <Box mt={3}>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!isAnswered || currentIndex === questions.length - 1}
            >
              Siguiente
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
}

export default QuizSimulatorMode;
