import {
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Typography,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Pagination,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Add, Delete, ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { addQuestionsToQuiz, getQuestionsByQuiz } from "../../../api/quizRequest";
import toast from "react-hot-toast";

const questionTypes = [
  { value: "open", label: "Respuesta corta" },
  { value: "single", label: "Selección única (radio)" },
  { value: "multiple", label: "Selección múltiple (checkbox)" },
];

function QuizQuestions() {
  const { id: quizId } = useParams();
  const navigate = useNavigate();
  const [infoQuiz, setInfoQuiz] = useState({});
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openProgressDialog, setOpenProgressDialog] = useState(false);
  const questionsPerPage = 10;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await getQuestionsByQuiz(quizId);
        setInfoQuiz(res.data.form);

        const processed = res.data.questions.map((q) => ({
          id: q.id,
          question: q.text,
          type: q.type,
          isRequired: q.isRequired,
          order: q.order > 0 ? q.order : q.id,
          options: q.options?.map((opt, idx) => ({
            id: opt.id,
            text: opt.text,
            isCorrect: opt.isCorrect,
            order: opt.order || idx + 1
          })) || [],
        }));

        setQuestions(processed);
      } catch (err) {
        console.error("Error cargando preguntas", err);
      }
    };
    fetchQuestions();
  }, [quizId]);

  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const paginatedQuestions = questions.slice(
    (page - 1) * questionsPerPage,
    page * questionsPerPage
  );

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        type: "single",
        isRequired: true,
        order: questions.length + 1,
        options: []
      }
    ]);
  };

  const handleAddOption = (index) => {
    const updated = [...questions];
    if (!updated[index].options) updated[index].options = [];
    updated[index].options.push({ text: "", isCorrect: false });
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex].text = value;
    setQuestions(updated);
  };

  const handleCorrectToggle = (qIndex, optIndex) => {
    const updated = [...questions];
    if (updated[qIndex].type === "single") {
      updated[qIndex].options = updated[qIndex].options.map((opt, i) => ({
        ...opt,
        isCorrect: i === optIndex,
      }));
    } else {
      updated[qIndex].options[optIndex].isCorrect = !updated[qIndex].options[optIndex].isCorrect;
    }
    setQuestions(updated);
  };

  const handleTypeChange = (index, type) => {
    const updated = [...questions];
    updated[index].type = type;
    if (type === "open") updated[index].options = [];
    setQuestions(updated);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const handleSubmit = async () => {
    try {
      setOpenProgressDialog(true);
      setLoading(true);
      setProgress(0);
      const chunks = chunkArray(questions, 10);
      let total = chunks.length;

      for (let i = 0; i < chunks.length; i++) {
        const formatted = chunks[i].map((q, qIndex) => ({
          id: q.id,
          question: q.question,
          type: q.type,
          isRequired: q.isRequired,
          order: (i * 10) + qIndex + 1,
          options: q.options.map((opt, optIndex) => ({
            id: opt.id,
            text: opt.text,
            isCorrect: opt.isCorrect,
            order: opt.order || optIndex + 1
          }))
        }));

        await addQuestionsToQuiz(quizId, formatted);
        setProgress(Math.round(((i + 1) / total) * 100));
      }

      toast.success("Preguntas actualizadas por lotes con éxito");
    } catch (error) {
      toast.error("Error al guardar preguntas por lotes");
    } finally {
      setLoading(false);
      setOpenProgressDialog(false);
      navigate("/quizzes");
    }
  };

  return (
    <>
      <Dialog open={openProgressDialog} fullWidth maxWidth="xs">
        <DialogTitle>Guardando Preguntas...</DialogTitle>
        <DialogContent>
          <Box my={2}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="body2" align="center" mt={1}>
              {progress}% completado
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h4">{infoQuiz.title}</Typography>
        <Typography variant="body1" color="text.secondary">
          {infoQuiz.description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fecha: {new Date(infoQuiz.date).toLocaleDateString()}
        </Typography>
      </Box>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h5">
            Gestionar Preguntas (página {page} de {totalPages})
          </Typography>
          <Button variant="outlined" startIcon={<Add />} onClick={handleAddQuestion}>
            Agregar Pregunta
          </Button>
        </Box>

        {paginatedQuestions.map((q, index) => (
          <Box
            key={q.id || index}
            sx={{ border: "1px solid #ccc", p: 2, mb: 2, borderRadius: "8px" }}
          >
            <TextField
              fullWidth
              label={`Pregunta ${(page - 1) * questionsPerPage + index + 1}`}
              value={q.question}
              onChange={(e) => handleQuestionChange(((page - 1) * questionsPerPage) + index, "question", e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              select
              label="Tipo"
              value={q.type}
              onChange={(e) => handleTypeChange(((page - 1) * questionsPerPage) + index, e.target.value)}
              sx={{ mb: 2, width: 300 }}
            >
              {questionTypes.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>

            {(q.type === "single" || q.type === "multiple") && q.options.map((opt, optIndex) => (
              <Box
                key={opt.id || optIndex}
                display="flex"
                alignItems="center"
                gap={1}
                mb={1}
              >
                <TextField
                  value={opt.text}
                  fullWidth
                  size="small"
                  onChange={(e) => handleOptionChange(((page - 1) * questionsPerPage) + index, optIndex, e.target.value)}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={opt.isCorrect || false}
                      onChange={() => handleCorrectToggle(((page - 1) * questionsPerPage) + index, optIndex)}
                    />
                  }
                  label="Correcta"
                />
              </Box>
            ))}

            {(q.type === "single" || q.type === "multiple") && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<Add />}
                onClick={() => handleAddOption(((page - 1) * questionsPerPage) + index)}
              >
                Agregar Opción
              </Button>
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

        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={handleSubmit}>Guardar</Button>
        </Box>
      </Container>
    </>
  );
}

export default QuizQuestions;
