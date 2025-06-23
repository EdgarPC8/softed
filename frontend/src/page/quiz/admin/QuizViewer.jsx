import {
  Box,
  Container,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  CircularProgress,
  Pagination
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestionsByQuiz } from "../../../api/quizRequest";

function QuizViewer() {
  const { id: quizId } = useParams();
  const [form, setForm] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const questionsPerPage = 10;

  useEffect(() => {
    const loadForm = async () => {
      try {
        const res = await getQuestionsByQuiz(quizId);
        setForm(res.data.form);
        setQuestions(res.data.questions);
      } catch (error) {
        console.error("Error al cargar el cuestionario", error);
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [quizId]);

  if (loading) {
    return (
      <Container>
        <Box textAlign="center" mt={5}>
          <CircularProgress />
          <Typography variant="body1" mt={2}>
            Cargando cuestionario...
          </Typography>
        </Box>
      </Container>
    );
  }

  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const paginatedQuestions = questions.slice(
    (page - 1) * questionsPerPage,
    page * questionsPerPage
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {form.title}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {form.description}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Fecha: {new Date(form.date).toLocaleDateString()}
      </Typography>

      {paginatedQuestions.map((q, index) => (
        <Box key={q.id} sx={{ mt: 4, mb: 2 }}>
          <Typography variant="h6">
            {(page - 1) * questionsPerPage + index + 1}. {q.text}
          </Typography>

          {q.type === "single" && (
            <RadioGroup>
              {q.options.map((opt) => (
                <FormControlLabel
                  key={opt.id}
                  value={opt.text}
                  control={<Radio disabled />}
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
                  control={<Checkbox disabled />}
                  label={opt.text}
                />
              ))}
            </FormGroup>
          )}

          {q.type === "open" && (
            <Typography variant="body2" color="text.secondary" mt={1}>
              (Respuesta abierta)
            </Typography>
          )}
        </Box>
      ))}

      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, val) => setPage(val)}
          color="primary"
        />
      </Box>
    </Container>
  );
}

export default QuizViewer;
