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
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { useParams } from "react-router-dom";
  import { getQuestionsByForm } from "../../../api/formsRequest";
  
  function FormViewer() {
    const { id: formId } = useParams();
    const [form, setForm] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const loadForm = async () => {
        try {
          const res = await getQuestionsByForm(formId);
          setForm(res.data.form);
          setQuestions(res.data.questions);
        } catch (error) {
          console.error("Error al cargar el formulario", error);
        } finally {
          setLoading(false);
        }
      };
  
      loadForm();
    }, [formId]);
  
    if (loading) {
      return (
        <Container>
          <Box textAlign="center" mt={5}>
            <CircularProgress />
            <Typography variant="body1" mt={2}>
              Cargando encuesta...
            </Typography>
          </Box>
        </Container>
      );
    }
  
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
  
        {questions.map((q, index) => (
          <Box key={q.id} sx={{ mt: 4, mb: 2 }}>
            <Typography variant="h6">
              {index + 1}. {q.text}
            </Typography>
  
            {q.type === "radio" && (
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
  
            {q.type === "checkbox" && (
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
  
            {q.type === "text" && (
              <Typography variant="body2" color="text.secondary" mt={1}>
                (Respuesta abierta)
              </Typography>
            )}
          </Box>
        ))}
      </Container>
    );
  }
  
  export default FormViewer;
  