import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { saveForm } from '../../api/formsRequest';

const CreatorQuizForm = () => {
  const { control, handleSubmit, setValue, getValues } = useForm();
  const [questions, setQuestions] = useState([]);
  const [questionCount, setQuestionCount] = useState(1);

  // Manejo de envío de formulario
  const onSubmit = async (data) => {
    const formData = {
      title: data.title,
      description: data.description,
      questions: questions.map((question, index) => ({
        text: question.text,
        type: question.type,
        required: question.required,
        order: index + 1,
        options: question.options,
      })),
    };

    try {
      await saveForm(formData);
      alert('Formulario guardado con éxito');
    } catch (error) {
      console.error("Error al guardar el formulario:", error);
      alert('Hubo un error al guardar el formulario');
    }
  };

  // Agregar una nueva pregunta
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        type: 'short_answer',
        required: true,
        options: [],
      },
    ]);
    setQuestionCount(questionCount + 1);
  };

  // Manejo de cambios en preguntas
  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  // Manejo de opciones de respuesta
  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    const newQuestions = [...questions];
    const options = [...newQuestions[questionIndex].options];
    options[optionIndex] = { ...options[optionIndex], [field]: value };
    newQuestions[questionIndex].options = options;
    setQuestions(newQuestions);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <TextField
          label="Título"
          fullWidth
          {...control.register("title", { required: true })}
        />
      </div>
      <div>
        <TextField
          label="Descripción"
          fullWidth
          multiline
          rows={4}
          {...control.register("description")}
        />
      </div>

      <div>
        {questions.map((question, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <TextField
              label={`Pregunta ${index + 1}`}
              fullWidth
              value={question.text}
              onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
            />
            <FormControl>
              <FormLabel>Tipo de pregunta</FormLabel>
              <RadioGroup
                value={question.type}
                onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
              >
                <FormControlLabel value="short_answer" control={<Radio />} label="Respuesta corta" />
                <FormControlLabel value="multiple_choice" control={<Radio />} label="Opción múltiple" />
                <FormControlLabel value="paragraph" control={<Radio />} label="Párrafo" />
              </RadioGroup>
            </FormControl>

            {question.type === 'multiple_choice' && (
              <div>
                <Button onClick={() => handleQuestionChange(index, 'options', [...question.options, { text: '', isCorrect: false }])}>
                  Agregar opción
                </Button>
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex}>
                    <TextField
                      label={`Opción ${optionIndex + 1}`}
                      value={option.text}
                      onChange={(e) => handleOptionChange(index, optionIndex, 'text', e.target.value)}
                    />
                    <FormControlLabel
                      control={
                        <Radio
                          checked={option.isCorrect}
                          onChange={(e) => handleOptionChange(index, optionIndex, 'isCorrect', e.target.checked)}
                        />
                      }
                      label="Correcta"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <Button type="button" onClick={addQuestion}>
          Agregar pregunta
        </Button>
      </div>

      <Button type="submit" variant="contained" color="primary">
        Guardar Formulario
      </Button>
    </form>
  );
};

export default CreatorQuizForm;
