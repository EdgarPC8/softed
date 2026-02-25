import {
  Box,
  Button,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import DataTable from "./DataTableFormCheck";
import { assignAccountsToForm } from "../../../api/formsRequest";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { filterAccounts, getCareers, getEspecialidades, getPeriodosAcademicos, getPeriods } from "../../../api/alumni/alumniRequest";
import { getRolRequest } from "../../../api/accountRequest";
import SelectData from "../../../Components/Selects/SelectData";


function AssignUserForm({ datos = [], onClose, reload }) {
  const [selectedAccountIds, setSelectedAccountIds] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const { id: formId } = useParams();
  const { toast } = useAuth();
  const [tipoUsuario, setTipoUsuario] = useState("todos");
  const [careers, setCareers] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedPeriodoAcademico, setSelectedPeriodoAcademico] = useState("");
  const [selectedEspecialidad, setSelectedEspecialidad] = useState("");
  const [especialidades, setEspecialidades] = useState([]);
  const [periodosAcademicos, setPeriodosAcademicos] = useState([]);
  const [selectedPeriodoActivo, setSelectedPeriodoActivo] = useState("");
  const [roles, setRoles] = useState([]);

  const getAccounts = async () => {
    let response;
    if (tipoUsuario === "estudiantes") {
      response = await filterAccounts({
        fuente: "matriculas",
        especialidad: selectedEspecialidad,
        periodoAcademico: selectedPeriodoAcademico,
        periodoActivo: selectedPeriodoActivo,
      });
    } else if (tipoUsuario === "egresados") {
      response = await filterAccounts({
        fuente: "matrices",
        carrera: selectedCareer,
        periodo: selectedPeriod,
      });
    } else if (tipoUsuario === "admins") {
      const rolAdmin = roles.find((r) => r.name === "Administrador");
      response = await filterAccounts({ rolId: rolAdmin?.id });
    } else if (tipoUsuario === "empresa") {
      const rolEmpresa = roles.find((r) => r.name === "Empresa");
      response = await filterAccounts({ rolId: rolEmpresa?.id });
    } else {
      response = await filterAccounts({});
    }
    const data = response.data || [];
    const withAssignment = data.map((acc) => {
      const yaAsignado = datos.some((d) => (d.id || d.accountId) === acc.accountId);
      return { ...acc, asignado: yaAsignado };
    });
    setAccounts(withAssignment);
  };

  const submitForm = async () => {
    if (selectedAccountIds.length === 0) {
      toast({ info: { description: "Agrega al menos una cuenta" } });
      return;
    }
    toast({
      promise: assignAccountsToForm(formId, selectedAccountIds),
      onSuccess: (data) => {
        if (onClose) onClose();
        if (reload) reload();
        return {
          title: "Asignacion de Encuesta",
          description: "Cuentas asignadas con éxito"
        };
      }
    });

  };

  useEffect(() => {
    getAccounts();
  }, [tipoUsuario, selectedCareer, selectedPeriod, selectedEspecialidad, selectedPeriodoAcademico, selectedPeriodoActivo, roles]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await getRolRequest();
        setRoles(res.data || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchRoles();
  }, []);

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
      field: "nombre",
      width: 350,
      renderCell: (params) => {
        const r = params.row;
        const name = `${r.firstName || ""} ${r.secondName || ""} ${r.firstLastName || ""} ${r.secondLastName || ""}`.trim();
        return name || "-";
      },
    },
    {
      headerName: "Cédula",
      field: "ci",
      width: 200,
      renderCell: (params) => params.row.ci ?? "-",
    },
    {
      headerName: "Rol",
      field: "rol",
      width: 180,
      renderCell: (params) => params.row.rol ?? params.row.roles?.join(", ") ?? "-",
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
          <MenuItem value="admins">Administradores</MenuItem>
          <MenuItem value="empresa">Empresas</MenuItem>
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
        rows={accounts}
        getRowId={(row) => row.accountId ?? row.id}
        onSelectionChange={(selectedIds) => setSelectedAccountIds(selectedIds)}
      />
   
    </Box>
  );
}


export default AssignUserForm;
