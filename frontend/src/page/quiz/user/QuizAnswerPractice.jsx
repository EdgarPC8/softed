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
  Pagination
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getQuestionsByQuiz } from "../../../api/quizRequest";
import { useAuth } from "../../../context/AuthContext";

function QuizAnswerPractice() {
  const { id: quizId } = useParams();
  const [infoQuiz, setInfoQuiz] = useState({});
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
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

  const handleChange = (questionId, selectedText) => {
    const question = questions.find((q) => q.id === questionId);
    const selectedOption = question.options.find(opt => opt.text === selectedText);
    const isCorrect = selectedOption?.isCorrect === true;

    setFeedback((prev) => ({
      ...prev,
      [questionId]: isCorrect ? "correct" : "incorrect"
    }));

    setAnswers((prev) => ({ ...prev, [questionId]: selectedText }));
  };

  const handleCheckboxChange = (questionId, optionText) => {
    const current = answers[questionId] || [];
    const updated = current.includes(optionText)
      ? current.filter((val) => val !== optionText)
      : [...current, optionText];

    setAnswers({ ...answers, [questionId]: updated });

    const question = questions.find((q) => q.id === questionId);
    const correctOptions = question.options.filter((o) => o.isCorrect).map(o => o.text).sort();
    const selectedOptions = [...updated].sort();

    const isCorrect = JSON.stringify(correctOptions) === JSON.stringify(selectedOptions);
    setFeedback((prev) => ({
      ...prev,
      [questionId]: isCorrect ? "correct" : "incorrect"
    }));
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
              onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
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

          {feedback[q.id] && (
            <Typography
              variant="subtitle2"
              color={feedback[q.id] === "correct" ? "green" : "red"}
              sx={{ mt: 1 }}
            >
              {feedback[q.id] === "correct" ? "✔ Respuesta correcta" : "✘ Respuesta incorrecta"}
            </Typography>
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
    </Container>
  );
}

export default QuizAnswerPractice;
