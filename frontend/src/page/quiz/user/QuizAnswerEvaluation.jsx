import {
  Box,
  Button,
  Container,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  TextField,
  Typography,
  Pagination
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getQuestionsByQuiz, submitQuizAnswers } from "../../../api/quizRequest";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";

function QuizAnswerEvaluation() {
  const { id: quizId } = useParams();
  const navigate = useNavigate();
  const [infoQuiz, setInfoQuiz] = useState({});
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const perPage = 5;

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

  const handleChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleCheckboxChange = (questionId, option) => {
    const currentAnswers = answers[questionId] || [];
    if (currentAnswers.includes(option)) {
      setAnswers({
        ...answers,
        [questionId]: currentAnswers.filter((val) => val !== option),
      });
    } else {
      setAnswers({
        ...answers,
        [questionId]: [...currentAnswers, option],
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const userId = user.userId;
      const formattedAnswers = [];

      for (const question of questions) {
        const userAnswer = answers[question.id];

        if (question.type === "open") {
          formattedAnswers.push({
            questionId: question.id,
            answerText: userAnswer,
            selectedOptionIds: [],
          });
        }

        if (question.type === "single") {
          const selectedOption = question.options.find((opt) => opt.text === userAnswer);
          formattedAnswers.push({
            questionId: question.id,
            answerText: null,
            selectedOptionIds: selectedOption ? [selectedOption.id] : [],
          });
        }

        if (question.type === "multiple") {
          const selectedIds = (userAnswer || []).map((optText) => {
            const selectedOption = question.options.find((opt) => opt.text === optText);
            return selectedOption?.id;
          }).filter(Boolean);

          formattedAnswers.push({
            questionId: question.id,
            answerText: null,
            selectedOptionIds: selectedIds,
          });
        }
      }

      await submitQuizAnswers(quizId, {
        userId,
        answers: formattedAnswers,
      });

      toast.success("Respuestas enviadas correctamente");
      navigate("/myquizzes");
    } catch (err) {
      console.error(err);
      toast.error("Error al enviar respuestas");
    }
  };

  const paginatedQuestions = questions.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(questions.length / perPage);

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4">{infoQuiz.title}</Typography>
        <Typography variant="body1">{infoQuiz.description}</Typography>
        <Typography variant="caption" color="text.secondary">
          Fecha: {new Date(infoQuiz.date).toLocaleDateString()}
        </Typography>
      </Box>

      {paginatedQuestions.map((q) => (
        <Box key={q.id} mb={4}>
          <Typography variant="h6">{q.text}</Typography>

          {q.type === "open" && (
            <TextField
              fullWidth
              variant="outlined"
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
            />
          )}

          {q.type === "single" && (
            <RadioGroup
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
            >
              {q.options.map((opt) => (
                <FormControlLabel
                  key={opt.id}
                  value={opt.text}
                  control={<Radio />}
                  label={opt.text}
                />
              ))}
            </RadioGroup>
          )}

          {q.type === "multiple" && (
            <FormGroup>
              {q.options.map((opt) => (
                <FormControlLabel
                  key={opt.id}
                  control={
                    <Checkbox
                      checked={(answers[q.id] || []).includes(opt.text)}
                      onChange={() => handleCheckboxChange(q.id, opt.text)}
                    />
                  }
                  label={opt.text}
                />
              ))}
            </FormGroup>
          )}
        </Box>
      ))}

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mb={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, val) => setPage(val)}
            color="primary"
          />
        </Box>
      )}

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Enviar respuestas
      </Button>
    </Container>
  );
}

export default QuizAnswerEvaluation;
