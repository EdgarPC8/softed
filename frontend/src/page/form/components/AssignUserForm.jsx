import {
  Box,
  Button,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import DataTable from "./DataTableFormCheck";
import { assignUsersToForm } from "../../../api/formsRequest";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { filterUsers, getCareers, getEspecialidades, getPeriodosAcademicos, getPeriods } from "../../../api/alumniRequest";
import SelectData from "../../../Components/Selects/SelectData";
import { anonimizarTextoChino } from "../../../helpers/functions";


function AssignUserForm({ datos = [], onClose, reload }) {
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [user, setUser] = useState([]);
  const { id: formId } = useParams(); // Asegúrate que el id esté en la URL
  const { toast } = useAuth();
  const [tipoUsuario, setTipoUsuario] = useState("todos"); // todos, estudiantes, egresados

  const [careers, setCareers] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedPeriodoAcademico, setSelectedPeriodoAcademico] = useState("");
  const [selectedEspecialidad, setSelectedEspecialidad] = useState("");
  const [especialidades, setEspecialidades] = useState([]);
  const [periodosAcademicos, setPeriodosAcademicos] = useState([]);

  const [selectedPeriodoActivo, setSelectedPeriodoActivo] = useState("");



  const getUsers = async () => {
    let response;

    if (tipoUsuario === "estudiantes") {
      response = await filterUsers({
        fuente: "matriculas",
        especialidad: selectedEspecialidad,
        periodoAcademico: selectedPeriodoAcademico,
        periodoActivo: selectedPeriodoActivo
      });
    } else if (tipoUsuario === "egresados") {
      response = await filterUsers({
        fuente: "matrices",
        carrera: selectedCareer,
        periodo: selectedPeriod
      });
    } else {
      response = await filterUsers();
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
      toast({
        info: {
          description: "Agrega al menos un Usuario"
        }
      });
      return;
    }
    toast({
      promise: assignUsersToForm(formId, selectedUserIds),
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
  }, [tipoUsuario, selectedCareer, selectedPeriod, selectedEspecialidad, selectedPeriodoAcademico, selectedPeriodoActivo]);

  useEffect(() => {
    const fetchFilters = async () => {
      const [especialidadesRes, periodosAcademicosRes] = await Promise.all([
        getEspecialidades(),
        getPeriodosAcademicos()
      ]);
      setEspecialidades(especialidadesRes.data);
      setPeriodosAcademicos(periodosAcademicosRes.data);
    };

    if (tipoUsuario === "estudiantes") {
      fetchFilters();
    }
  }, [tipoUsuario]);

  useEffect(() => {
    const fetchData = async () => {
      const [careersRes, periodsRes] = await Promise.all([getCareers(), getPeriods()]);
      setCareers(
        careersRes.data.map(c => ({ value: c.idCareer, name: c.name }))
      );
      setPeriods(
        periodsRes.data.map(p => ({ value: p.idPeriod, name: p.name }))
      );
    };
    fetchData();
  }, []);


  const columns = [
    {
      headerName: "Nombres y Apellidos",
      field: "null",
      width: 350,
      sortable: false,
      renderCell: (params) => {
        const user = params.row;
        const name=`${user.firstName} ${user.secondName} ${user.firstLastName} ${user.secondLastName}`
        return anonimizarTextoChino(name);
      },
    },
    {
      headerName: "Cédula",
      field: "ci",
      width: 200,
      renderCell: (params) => anonimizarTextoChino(params.row.ci)
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
      <FormControl sx={{ mb: 2, minWidth: 200 }}>
        <InputLabel>Filtrar por tipo</InputLabel>
        <Select
          value={tipoUsuario}
          label="Filtrar por tipo"
          onChange={(e) => {
            setTipoUsuario(e.target.value);
          }}
        >
          <MenuItem value="todos">Todos</MenuItem>
          <MenuItem value="estudiantes">Estudiantes</MenuItem>
          <MenuItem value="egresados">Egresados o Graduados</MenuItem>
        </Select>
        {tipoUsuario === "egresados" && (
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <SelectData
              Data={careers}
              Label="Carrera"
              onChange={(val) => setSelectedCareer(val)}
            />
            <SelectData
              Data={periods}
              Label="Periodo"
              onChange={(val) => setSelectedPeriod(val)}
            />
          </Box>
        )}
        {tipoUsuario === "estudiantes" && (
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <SelectData
              Data={especialidades}
              Label="Especialidad"
              onChange={(val) => setSelectedEspecialidad(val)}
            />
            <SelectData
              Data={periodosAcademicos}
              Label="Periodo Académico"
              onChange={(val) => setSelectedPeriodoAcademico(val)}
            />
            <SelectData
              Data={[
                { value: "ACTIVO", name: "Si" },
                { value: "INACTIVO", name: "No" }
              ]}
              Label="Activo"
              onChange={(val) => setSelectedPeriodoActivo(val)}
            />
          </Box>
        )}



      </FormControl>
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
