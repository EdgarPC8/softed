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
    tiempo: ''
  });
  const [data, setData] = useState([]);


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNuevoNadador({ ...nuevoNadador, [name]: value });
  };

  const handleAddClick = () => {
    // Aquí podrías validar los datos ingresados antes de agregar el nadador
    handleAddNadador(nuevoNadador);
    handleClose();
  };
  const columns = [
    {
      headerName: "Cedula",
      field: "cedula",
      width: 50,
      editable: true,
    },
    {
      headerName: "Nadador",
      field: "nombres",
      width: 150,
    },
    {
        headerName: "Nombre1",
        field: "primer_nombre",
        width: 150,
    },
    {
        headerName: "Nombre2",
        field: "segundo_nombre",
        width: 150,
    },
    {
        headerName: "Apellido1",
        field: "primer_apellido",
        width: 150,
    },
    {
        headerName: "Apellido2",
        field: "segundo_apellido",
        width: 150,
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
              // Añadir el nadador
              setNuevoNadador({ ...nuevoNadador, nadador: nadador,cedula: cedula });
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
        <TextField
          label="Entidad"
          name="entidad"
          value={nuevoNadador.entidad}
          onChange={handleInputChange}
          fullWidth
        />
     
      <DataTable columns={columns} data={data} />

        {/* Otros campos de entrada para los datos restantes */}
        <Button variant="contained" onClick={handleAddClick}>Agregar Nadador</Button>
      </Box>
    </Modal>
  );
};

export default AddNadadorModal;
