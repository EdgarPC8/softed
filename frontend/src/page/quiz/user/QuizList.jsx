import {
  Container,
  IconButton,
  Button,
  Avatar,
  Tooltip,
  Box,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionAnswer } from "@mui/icons-material";
import toast from "react-hot-toast";
import DataTable from "../../../Components/Tables/DataTable";
import { getQuizzesByUserId } from "../../../api/quizRequest";
import { useAuth } from "../../../context/AuthContext";
import QuizIcon from "@mui/icons-material/Quiz";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";


function QuizList() {
  const [data, setData] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    const { data } = await getQuizzesByUserId(user.userId);
    setData(data);
  };

  const columns = [
    {
      headerName: "#",
      field: "#",
      width: 50,
      sortable: false,
    },
    {
      headerName: "Titulo",
      field: "title",
      width: 250,
    },
    {
      headerName: "Descripcion",
      field: "description",
      width: 250,
    },
    {
      headerName: "Intentos",
      field: "attempts",
      width: 80,
      renderCell: (params) => `${params.row.currentAttempts}/${params.row.maxAttempts}`,
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const { currentAttempts, maxAttempts, id, availableModes = [] } = params.row;
    
        if (currentAttempts >= maxAttempts) {
          return <Typography variant="body2" color="text.secondary">Máximo alcanzado</Typography>;
        }
    
        return (
          <Box display="flex" gap={1}>
            {availableModes.includes("evaluation") && (
              <Tooltip title="Modo Evaluación">
                <IconButton onClick={() => navigate(`evaluation/${id}`)}>
                  <QuizIcon />
                </IconButton>
              </Tooltip>
            )}
            {availableModes.includes("simulator") && (
              <Tooltip title="Modo Simulador">
                <IconButton onClick={() => navigate(`simulator/${id}`)}>
                  <PsychologyAltIcon />
                </IconButton>
              </Tooltip>
            )}
            {availableModes.includes("practice") && (
              <Tooltip title="Modo Práctica">
                <IconButton onClick={() => navigate(`practice/${id}`)}>
                  <AutoFixHighIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        );
      }
    }
    
  ];

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <Box
      maxWidth="md"
      sx={{ mt: 4, mx: "auto", textAlign: "center" }}
    >
      <DataTable data={data} columns={columns} />
    </Box>
  );
}

export default QuizList;
