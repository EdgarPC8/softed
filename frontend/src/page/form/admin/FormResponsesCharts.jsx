import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { Typography, Box, Divider,Grid } from "@mui/material";
import axios from "axios";
import ClosedQuestionsTable from "../components/ClosedQuestionsTable";
import { getResponses } from "../../../api/formsRequest";


const size = {
  width: 400,
  height: 300,
};

export default function FormResponsesCharts() {
  const { id: formId } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect( () => {
    getFecthresponses()

    const mockData = [
      {
        questionId: 1,
        questionText: "¿Cuál es tu sistema operativo preferido?",
        type: "radio",
        options: [
          { id: 1, text: "Windows" },
          { id: 2, text: "macOS" },
          { id: 3, text: "Linux" },
          { id: 4, text: "Otro" },
        ],
        answers: [
          { selectedOptionIds: 1 },
          { selectedOptionIds: 2 },
          { selectedOptionIds: 1 },
          { selectedOptionIds: 3 },
          { selectedOptionIds: 1 },
        ],
      },
      {
        questionId: 2,
        questionText: "¿Qué navegadores usas habitualmente?",
        type: "checkbox",
        options: [
          { id: 5, text: "Chrome" },
          { id: 6, text: "Firefox" },
          { id: 7, text: "Safari" },
          { id: 8, text: "Edge" },
        ],
        answers: [
          { selectedOptionIds: [5, 6] },
          { selectedOptionIds: [5] },
          { selectedOptionIds: [6, 7] },
          { selectedOptionIds: [5, 8] },
        ],
      },
      {
        questionId: 3,
        questionText: "¿Tienes alguna sugerencia para mejorar?",
        type: "text",
        options: [],
        answers: [
          { answerText: "Todo está bien" },
          { answerText: "Podrían mejorar el diseño" },
          { answerText: "Más opciones de personalización" },
        ],
      },
    ];
  
    // setQuestions(mockData);
  }, [formId]);


  const getFecthresponses =async () => {
    const {data}= await getResponses(formId)
    setQuestions(data);
  }
  const processPieData = (question) => {
    const counts = {};

    question.options.forEach((opt) => {
      counts[opt.text] = 0;
    });

    question.answers.forEach((ans) => {
      const selectedIds = Array.isArray(ans.selectedOptionIds)
        ? ans.selectedOptionIds
        : [ans.selectedOptionIds];
      selectedIds.forEach((id) => {
        const option = question.options.find((opt) => opt.id === id);
        if (option) {
          counts[option.text]++;
        }
      });
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return Object.entries(counts).map(([label, value]) => ({
      label,
      value,
      percentage: total > 0 ? ((value / total) * 100).toFixed(1) : 0,
    }));
  };

  const valueFormatter = (item) => `${item.value}`;

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Resultados de Encuesta
      </Typography>
      <ClosedQuestionsTable questions={questions} />
 
<Grid container spacing={4}>

{questions
  .filter((q) => q.type === "checkbox" || q.type === "radio")
  .map((q) => (
    <Grid item xs={12} md={6} key={q.questionId}>
      <Box sx={{ p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
        <Typography variant="h6">{q.questionText}</Typography>
        <Divider sx={{ mb: 2 }} />
        <PieChart
          series={[
            {
              data: processPieData(q),
              arcLabel: (item) => `${item.label}: ${item.percentage}%`,
              arcLabelMinAngle: 15,
              arcLabelRadius: "60%",
              valueFormatter,
            },
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fontWeight: "bold",
            },
          }}
          {...size}
        />
      </Box>
    </Grid>
))}

</Grid>
    </Box>
  );
}
