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
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getQuestionsByForm, respondeForm } from "../../../api/formsRequest";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";


function FormAnswer() {
  const { id: formId } = useParams();
  const navigate = useNavigate();
  const [infoForm, setInfoForm] = useState({});
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // key: questionId, value: respuesta
  const { user} = useAuth();


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await getQuestionsByForm(formId);
        setInfoForm(res.data.form);
        setQuestions(res.data.questions);
      } catch (err) {
        console.error("Error cargando preguntas", err);
      }
    };
    fetchQuestions();
  }, [formId]);

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
      const userId = user.userId; // reemplaza esto por el userId real (autenticado)
  
      // Construir el arreglo de respuestas
      const formattedAnswers = [];

      for (const question of questions) {
        const userAnswer = answers[question.id];
      
        if (question.type === "text") {
          formattedAnswers.push({
            questionId: question.id,
            answerText: userAnswer,
            selectedOptionIds: [],
          });
        }
      
        if (question.type === "radio") {
          const selectedOption = question.options.find(
            (opt) => opt.text === userAnswer
          );
          formattedAnswers.push({
            questionId: question.id,
            answerText: null,
            selectedOptionIds: selectedOption ? [selectedOption.id] : [],
          });
        }
      
        if (question.type === "checkbox") {
          const selectedIds = (userAnswer || []).map((optText) => {
            const selectedOption = question.options.find(
              (opt) => opt.text === optText
            );
            return selectedOption?.id;
          }).filter(Boolean); // elimina nulls o undefined
      
          formattedAnswers.push({
            questionId: question.id,
            answerText: null,
            selectedOptionIds: selectedIds,
          });
        }
      }
  
      // Enviar al backend
      await respondeForm(formId, {
        userId,
        answers: formattedAnswers,
      });
  
      toast.success("Encuesta enviada correctamente");
      navigate("/myforms");
    } catch (err) {
      console.error(err);
      toast.error("Error al enviar respuestas");
    }
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4">{infoForm.title}</Typography>
        <Typography variant="body1">{infoForm.description}</Typography>
        <Typography variant="caption" color="text.secondary">
          Fecha: {new Date(infoForm.date).toLocaleDateString()}
        </Typography>
      </Box>

      {questions.map((q) => (
        <Box key={q.id} mb={4}>
          <Typography variant="h6">{q.text}</Typography>

          {q.type === "text" && (
            <TextField
              fullWidth
              variant="outlined"
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
            />
          )}

          {q.type === "radio" && (
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

          {q.type === "checkbox" && (
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

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Enviar respuestas
      </Button>
    </Container>
  );
}

export default FormAnswer;
