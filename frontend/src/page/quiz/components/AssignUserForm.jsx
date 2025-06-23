import {
  Box,
  Button,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  ListItemText
} from "@mui/material";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import DataTable from "./DataTableFormCheck";
import { assignUsersToQuiz, filterUsersByRole } from "../../../api/quizRequest.js";
import SelectData from "../../../Components/Selects/SelectData";
import { getRolRequest } from "../../../api/accountRequest";

function AssignUserForm({ datos = [], onClose, reload, quizId }) {
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [user, setUser] = useState([]);
  const { toast } = useAuth();
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedModes, setSelectedModes] = useState(["evaluation"]);

  const availableModesList = [
    { value: "evaluation", name: "Evaluación" },
    { value: "simulator", name: "Simulador" },
    { value: "practice", name: "Práctica" }
  ];

  const getUsers = async () => {
    let response;
    if (selectedRole) {
      response = await filterUsersByRole(selectedRole);
    } else {
      response = await filterUsersByRole();
    }

    const data = response.data;
    const usersWithAssignment = data.map(user => {
      const yaAsignado = datos.some(u => u.id === user.id);
      return { ...user, asignado: yaAsignado };
    });

    setUser(usersWithAssignment);
  };

  const submitForm = async () => {
    if (selectedUserIds.length === 0) {
      toast({ info: { description: "Agrega al menos un Usuario" } });
      return;
    }
    toast({
      promise: assignUsersToQuiz(quizId, {
        userIds: selectedUserIds,
        availableModes: selectedModes
      }),
      onSuccess: () => {
        if (onClose) onClose();
        if (reload) reload();
        return {
          title: "Asignación de Cuestionario",
          description: "Usuarios asignados con éxito",
        };
      },
    });
  };

  useEffect(() => {
    const fetchRoles = async () => {
      const rolesRes = await getRolRequest();
      setRoles(
        rolesRes.data.map(r => ({ value: r.id, name: r.name }))
      );
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    getUsers();
  }, [selectedRole, datos]);

  const columns = [
    {
      headerName: "Nombres y Apellidos",
      field: "null",
      width: 350,
      sortable: false,
      renderCell: (params) => {
        const user = params.row;
        const name = `${user.firstName} ${user.secondName} ${user.firstLastName} ${user.secondLastName}`;
        return name;
      },
    },
    {
      headerName: "Cédula",
      field: "ci",
      width: 200,
    },
    {
      headerName: "Estado",
      field: "asignado",
      width: 120,
      renderCell: (params) => (params.row.asignado ? "Ya asignado" : "Disponible"),
    },
  ];

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <SelectData
            Data={roles}
            Label="Filtrar por Rol"
            onChange={(val) => setSelectedRole(val)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="modes-label">Modos permitidos</InputLabel>
            <Select
              labelId="modes-label"
              multiple
              value={selectedModes}
              onChange={(e) => setSelectedModes(e.target.value)}
              renderValue={(selected) =>
                selected.map(
                  (val) =>
                    availableModesList.find((m) => m.value === val)?.name || val
                ).join(", ")
              }
            >
              {availableModesList.map((mode) => (
                <MenuItem key={mode.value} value={mode.value}>
                  <Checkbox checked={selectedModes.indexOf(mode.value) > -1} />
                  <ListItemText primary={mode.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "end" }}>
        <Button variant="contained" onClick={submitForm}>
          Asignar seleccionados
        </Button>
      </Box>

      <DataTable
        columns={columns}
        rows={user}
        onSelectionChange={(selectedIds) => setSelectedUserIds(selectedIds)}
      />
    </Box>
  );
}

export default AssignUserForm;
