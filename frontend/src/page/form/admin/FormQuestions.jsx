import {
    Box,
    Button,
    Container,
    IconButton,
    TextField,
    Typography,
    MenuItem,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Add, Delete, ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { addQuestionsToForm, getQuestionsByForm } from "../../../api/formsRequest";
import toast from "react-hot-toast";

const questionTypes = [
    { value: "text", label: "Respuesta corta" },
    { value: "radio", label: "Selección única (radio)" },
    { value: "checkbox", label: "Selección múltiple (checkbox)" },
];

function FormQuestions() {
    const { id: formId } = useParams();
    const navigate = useNavigate();
    const [infoForm, setInfoForm] = useState({})



    const [questions, setQuestions] = useState([
        { question: "", type: "text", options: [] },
    ]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await getQuestionsByForm(formId);
                setInfoForm(res.data.form)
                setQuestions(
                    res.data.questions.map((q) => ({
                        id: q.id,
                        question: q.text,
                        type: q.type,
                        order: q.order,  // Aseguramos que recibimos y guardamos el orden
                        options: q.options?.map((opt) => ({
                            id: opt.id,
                            text: opt.text,
                            order: opt.order,
                        })) || [],
                    }))
                );
            } catch (err) {
                console.error("Error cargando preguntas", err);
            }
        };
        fetchQuestions();
    }, [formId]);

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: "", type: "text", options: [] }]);
    };

    const handleRemoveQuestion = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const handleQuestionChange = (index, field, value) => {
        const updated = [...questions];
        updated[index][field] = value;

        if (field === "type" && value === "text") {
            updated[index].options = []; // Eliminar las opciones si el tipo cambia a "text"
        }

        setQuestions(updated);
    };

    const handleOptionChange = (qIndex, optIndex, value) => {
        const updated = [...questions];
        updated[qIndex].options[optIndex].text = value;
        setQuestions(updated);
    };

    const handleAddOption = (qIndex) => {
        const updated = [...questions];
        if (!updated[qIndex].options) updated[qIndex].options = [];
        updated[qIndex].options.push({ text: "" });
        setQuestions(updated);
    };

    const handleRemoveOption = (qIndex, optIndex) => {
        const updated = [...questions];
        updated[qIndex].options.splice(optIndex, 1);
        setQuestions(updated);
    };
    const moveOption = (qIndex, optIndex, direction) => {
        const updated = [...questions];
        const opts = updated[qIndex].options;
        const [movedOpt] = opts.splice(optIndex, 1);
        opts.splice(optIndex + direction, 0, movedOpt);
        updated[qIndex].options = opts;
        setQuestions(updated);
    };


    const moveQuestion = (index, direction) => {
        const updatedQuestions = [...questions];
        const [movedQuestion] = updatedQuestions.splice(index, 1); // Eliminar la pregunta
        updatedQuestions.splice(index + direction, 0, movedQuestion); // Insertar la pregunta en el nuevo lugar

        // Actualizar el estado con el nuevo orden
        setQuestions(updatedQuestions);
    };

    const handleSubmit = async () => {
        try {
            // Asignar explícitamente el orden antes de enviar
            const questionsWithOrder = questions.map((q, index) => ({
                ...q,
                order: index + 1, // El índice es el orden actual
                options: q.options?.map((opt, optIndex) => ({
                    ...opt,
                    order: optIndex + 1,
                })) || [],
            }));

            await addQuestionsToForm(formId, questionsWithOrder);
            toast.success("Preguntas guardadas correctamente.");
            navigate("/forms");
        } catch (error) {
            console.error(error);
            toast.error("Error al guardar preguntas.");
        }
    };


    return (
<>
<Box sx={{ mb: 2 }}>
  <Typography variant="h4">{infoForm.title}</Typography>
  <Typography variant="body1" color="text.secondary">
    {infoForm.description}
  </Typography>
  <Typography variant="body2" color="text.secondary">
    Fecha: {new Date(infoForm.date).toLocaleDateString()}
  </Typography>
</Box>
<Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Gestionar Preguntas
            </Typography>

            {questions.map((q, index) => (
                <Box
                    key={index}
                    sx={{
                        border: "1px solid #ccc",
                        p: 2,
                        mb: 2,
                        borderRadius: "8px",
                    }}
                >
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <TextField
                            label={`Pregunta ${index + 1}`}
                            fullWidth
                            value={q.question}
                            onChange={(e) =>
                                handleQuestionChange(index, "question", e.target.value)
                            }
                        />
                        <TextField
                            select
                            label="Tipo"
                            value={q.type}
                            onChange={(e) =>
                                handleQuestionChange(index, "type", e.target.value)
                            }
                            sx={{ width: 200 }}
                        >
                            {questionTypes.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Box display="flex" gap={1}>
                            <IconButton
                                onClick={() => moveQuestion(index, -1)} // Mover hacia arriba
                                disabled={index === 0}
                                title="Mover arriba"
                            >
                                <ArrowUpward />
                            </IconButton>
                            <IconButton
                                onClick={() => moveQuestion(index, 1)} // Mover hacia abajo
                                disabled={index === questions.length - 1}
                                title="Mover abajo"
                            >
                                <ArrowDownward />
                            </IconButton>
                            <IconButton
                                onClick={() => handleRemoveQuestion(index)}
                                title="Eliminar pregunta"
                            >
                                <Delete />
                            </IconButton>
                        </Box>
                    </Box>

                    {(q.type === "radio" || q.type === "checkbox") && (
                        <>
                            <Typography variant="subtitle2">Opciones:</Typography>
                            {q.options.map((opt, optIndex) => (
                                <Box
                                    key={optIndex}
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                    mb={1}
                                >
                                    <TextField
                                        value={opt.text}
                                        fullWidth
                                        size="small"
                                        onChange={(e) =>
                                            handleOptionChange(index, optIndex, e.target.value)
                                        }
                                    />
                                    <IconButton
                                        onClick={() => moveOption(index, optIndex, -1)}
                                        disabled={optIndex === 0}
                                        title="Mover opción arriba"
                                    >
                                        <ArrowUpward fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => moveOption(index, optIndex, 1)}
                                        disabled={optIndex === q.options.length - 1}
                                        title="Mover opción abajo"
                                    >
                                        <ArrowDownward fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleRemoveOption(index, optIndex)}
                                        title="Eliminar opción"
                                    >
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}

                            <Button
                                variant="outlined"
                                startIcon={<Add />}
                                onClick={() => handleAddOption(index)}
                                sx={{ mt: 1 }}
                            >
                                Agregar Opción
                            </Button>
                        </>
                    )}
                </Box>
            ))}

            <Box display="flex" justifyContent="space-between" mt={3}>
                <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddQuestion}
                >
                    Agregar Pregunta
                </Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Guardar Preguntas
                </Button>
            </Box>
        </Container>
</>

    
    );
}

export default FormQuestions;
