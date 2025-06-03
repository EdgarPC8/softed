import { CloudUpload, Save } from "@mui/icons-material";
import {
  Box,
  Button,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import { getUsersRequest } from "../../../api/userRequest";
import DataTable from "./DataTableFormCheck";
import { assignUsersToForm } from "../../../api/formsRequest";

function AssignUserForm({ datos = [], onClose, reload }) {
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [user, setUser] = useState([]);
  const { id: formId } = useParams(); // Asegúrate que el id esté en la URL
  const { toast } = useAuth();

  const getUsers = async () => {
    const { data } = await getUsersRequest();
  
    // Marca los usuarios que ya están asignados
    const usersWithAssignment = data.map(user => {
      const yaAsignado = datos.some(u => u.id === user.id);
      return { ...user, asignado: yaAsignado };
    });
  
    setUser(usersWithAssignment);
  };
  

  const submitForm = async () => {
    if (selectedUserIds.length === 0) {
        toast({
            info: {
              description: "Agrega al menos un Usuario"
            }
          });
      return;
    }
    toast({
        promise: assignUsersToForm(formId,selectedUserIds),
        onSuccess: (data) => {
          if (onClose) onClose(); 
          if (reload) reload(); 
          return {
            title: "Asignacion de Encuesta",
            description: "Usuario asignado con éxito"
          };
        }
      });

  };

  useEffect(() => {
    getUsers();
  }, []);

  const columns = [
    {
      headerName: "Nombres y Apellidos",
      field: "null",
      width: 200,
      sortable: false,
      renderCell: (params) => {
        const user = params.row;
        return `${user.firstName} ${user.secondName} ${user.firstLastName} ${user.secondLastName}`;
      },
    },
    {
      headerName: "Cédula",
      field: "ci",
      width: 100,
    },
    {
        headerName: "Estado",
        field: "asignado",
        width: 120,
        renderCell: (params) => {
          return params.row.asignado ? "Ya asignado" : "Disponible";
        },
      }
      
  ];

  return (
    <Box>
      <DataTable
        columns={columns}
        rows={user}
        onSelectionChange={(selectedIds) => setSelectedUserIds(selectedIds)}
      />
      <Box sx={{ mt: 2, display: "flex", justifyContent: "end" }}>
        <Button variant="contained" onClick={submitForm}>
          Asignar seleccionados
        </Button>
      </Box>
    </Box>
  );
}


export default AssignUserForm;
