import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import { getQuizResponses, getQuizUserResponses } from "../../../api/quizRequest";
import UserResponsesTable from "../components/UserResponsesTable";



export default function QuizResponsesCharts() {
  const { id: quizId } = useParams();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const { data } = await getQuizUserResponses(quizId);
        console.log("📊 DATA RESPUESTAS:", data);
        setUsers(data);
      } catch (error) {
        console.error("Error al obtener respuestas del quiz:", error);
      }
    };
    fetchResponses();
  }, [quizId]);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Resultados por usuario
      </Typography>
      <UserResponsesTable users={users} />
    </Box>
  );
}
