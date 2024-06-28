import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import DataTable from "../Components/DataTable";
import {
  deleteSwimmerRequest,
  getAllNadadores,
} from "../api/nadadoresResquest.js";
import { useEffect, useState } from "react";
import { Person, Edit, Delete } from "@mui/icons-material";
import {
  Button,
  IconButton,
} from "@mui/material";

import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  addInstitutionRequest,
  deleteInstitutionRequest,
  getInstitutionsRequest,
  updateInstitutionRequest,
} from "../api/institutionRequest";


const AddNadadorModal = ({ open, handleClose, handleAddNadador }) => {
  const [nuevoNadador, setNuevoNadador] = useState({
    carril: '',
    cedula: '',
    descalificado: 0,
    entidad: '',
    id: '',
    lugar: 0,
    nadador: '',
    premiado: 0,
    tiempo: '',
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    id_institucion: ''
  });
  const [data, setData] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [nadadorAccordionExpanded, setNadadorAccordionExpanded] = useState(false);
  const [entidadAccordionExpanded, setEntidadAccordionExpanded] = useState(false);



  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNuevoNadador({ ...nuevoNadador, [name]: value });
  };

  const handleAddClick = () => {
    // Aquí podrías validar los datos ingresados antes de agregar el nadador
    handleAddNadador(nuevoNadador);
    handleClose();
    setNuevoNadador({
      carril: '',
      cedula: '',
      descalificado: 0,
      entidad: '',
      id: '',
      lugar: 0,
      nadador: '',
      premiado: 0,
      tiempo: '',
      primer_nombre: '',
      segundo_nombre: '',
      primer_apellido: '',
      segundo_apellido: ''
    })

  };
  const columns = [
    {
      headerName: "Cedula",
      field: "cedula",
      width: 100,
      editable: true,
    },
    {
      headerName: "Nombre1",
      field: "primer_nombre",
      width: 100,
    },
    {
      headerName: "Nombre2",
      field: "segundo_nombre",
      width: 100,
    },
    {
      headerName: "Apellido1",
      field: "primer_apellido",
      width: 100,
    },
    {
      headerName: "Apellido2",
      field: "segundo_apellido",
      width: 100,
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          onClick={() => {
            // Obtener el nadador correspondiente de los datos
            const nadador = params.row.nadador;
            const cedula = params.row.cedula;
            const primer_nombre = params.row.primer_nombre;
            const segundo_nombre = params.row.segundo_nombre;
            const primer_apellido = params.row.primer_apellido;
            const segundo_apellido = params.row.segundo_apellido;
            // Añadir el nadador
            setNuevoNadador({ ...nuevoNadador, 
              nadador: nadador, 
              cedula: cedula ,
              primer_nombre: primer_nombre ,
              segundo_nombre: segundo_nombre ,
              primer_apellido: primer_apellido ,
              segundo_apellido: segundo_apellido 
            });
            setNadadorAccordionExpanded(false)

          }}
        >
          Añadir
        </Button>
      ),
    },
  ];
  const columnsEntidad = [
    {
      headerName: "Institucion",
      field: "nombre",
      width: 500,
      editable: true,
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          onClick={() => {
            // Obtener el nadador correspondiente de los datos
            const entidad = params.row.nombre;
            const id_institucion = params.row.id;
            // Añadir el nadador
            setNuevoNadador({ ...nuevoNadador, entidad: entidad,id_institucion:id_institucion });
            // aqui quiero que al dar click aqui colapse el acordion o se cierre
            setEntidadAccordionExpanded(false)
          }}
        >
          Añadir
        </Button>
      ),
    },
  ];
  async function fetchData() {
    try {
      const nadadores = await getAllNadadores();
      setData(nadadores.data);
      const entidad = await getInstitutionsRequest();
      setInstitutions(entidad.data);
      // console.log(nadadores)
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      }}>
        <h2 id="modal-modal-title">Agregar Nadador</h2>
        <TextField
          label="Carril"
          name="carril"
          value={nuevoNadador.carril}
          onChange={handleInputChange}
          fullWidth
        />
          <Accordion expanded={nadadorAccordionExpanded} onChange={() => setNadadorAccordionExpanded(!nadadorAccordionExpanded)}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              
              {nuevoNadador.nadador==""?"Seleccionar Nadador":nuevoNadador.nadador}
            </AccordionSummary>
            <AccordionDetails>
              <DataTable columns={columns} data={data} />
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={entidadAccordionExpanded} onChange={() => setEntidadAccordionExpanded(!entidadAccordionExpanded)}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              {nuevoNadador.entidad==""?"Seleccionar Entidad":nuevoNadador.entidad}

            </AccordionSummary>
            <AccordionDetails>
              <DataTable columns={columnsEntidad} data={institutions} />
            </AccordionDetails>
          </Accordion>
        <Button variant="contained" onClick={handleAddClick}>Agregar Nadador</Button>
      </Box>
    </Modal>
  );
};

export default AddNadadorModal;
