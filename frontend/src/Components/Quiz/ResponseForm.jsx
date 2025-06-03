import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // ✅ aquí
import { getOneForm, submitFormAnswers } from '../../api/formsRequest.js';  // Corrección aquí

import {
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormControl,
  FormLabel,
  Button,
  Box,
  Typography,
} from '@mui/material';

const ResponseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ aquí
  const [formulario, setFormulario] = useState(null);
  const [respuestas, setRespuestas] = useState([]);


  useEffect(() => {
    const obtenerFormulario = async () => {
      try {
        const response = await getOneForm(id);  // Corrección aquí
        setFormulario(response.data);
      } catch (error) {
        console.error("Error al obtener formulario", error);
      }
    };

    obtenerFormulario();
  }, [id]);

  const handleChange = (questionId, value, type) => {
    setRespuestas((prevRespuestas) => {
      const updated = [...prevRespuestas];
      const existingIndex = updated.findIndex(r => r.questionId === questionId);

      if (type === 'checkbox') {
        // Para checkbox: permitir múltiples opciones por pregunta
        const existing = updated.find(r => r.questionId === questionId);
        if (existing) {
          if (value) {
            existing.answer = [...new Set([...(Array.isArray(existing.answer) ? existing.answer : []), value])];
          } else {
            existing.answer = existing.answer.filter(v => v !== value);
          }
        } else {
          updated.push({ questionId, answer: [value] });
        }
      } else {
        if (existingIndex !== -1) {
          updated[existingIndex].answer = value;
        } else {
          updated.push({ questionId, answer: value });
        }
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitFormAnswers(id, respuestas);
      navigate('/gracias'); // ✅ aquí
    } catch (error) {
      console.error("Error al guardar respuestas", error);
    }
  };
  if (!formulario) return <div>Cargando formulario...</div>;

  return (
    <Box>
      <Typography variant="h4">{formulario.title}</Typography>
      <Typography variant="body1">{formulario.description}</Typography>
      <form onSubmit={handleSubmit}>
        {formulario.questions.map((question) => (
          <Box key={question.id} sx={{ marginBottom: 3 }}>
            <Typography variant="h6">{question.text}</Typography>

            {question.type === 'short_answer' && (
              <TextField
                fullWidth
                label="Escribe tu respuesta"
                onChange={(e) => handleChange(question.id, e.target.value, question.type)}
                required={question.required}
              />
            )}

            {question.type === 'paragraph' && (
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Escribe tu respuesta"
                onChange={(e) => handleChange(question.id, e.target.value, question.type)}
                required={question.required}
              />
            )}

            {question.type === 'multiple_choice' && (
              <FormControl component="fieldset" required={question.required}>
                <FormLabel component="legend">Elige una opción</FormLabel>
                <RadioGroup
                  onChange={(e) => handleChange(question.id, e.target.value, question.type)}
                  name={`question-${question.id}`}
                >
                  {question.options.map((option) => (
                    <FormControlLabel
                      key={option.id}
                      value={option.id}
                      control={<Radio />}
                      label={option.text}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}

            {question.type === 'checkbox' && (
              <FormControl component="fieldset" required={question.required}>
                <FormLabel component="legend">Selecciona las opciones</FormLabel>
                {question.options.map((option) => (
                  <FormControlLabel
                    key={option.id}
                    control={
                      <Checkbox
                        onChange={(e) =>
                          handleChange(question.id, e.target.checked ? option.id : null, question.type)
                        }
                        value={option.id}
                      />
                    }
                    label={option.text}
                  />
                ))}
              </FormControl>
            )}
          </Box>
        ))}
        <Button type="submit" variant="contained" color="primary">
          Enviar respuestas
        </Button>
      </form>
    </Box>
  );
};

export default ResponseForm;
