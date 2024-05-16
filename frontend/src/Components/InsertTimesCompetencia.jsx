import { useEffect, useState } from "react";

import {
  Button,
  Container,
  IconButton,
  DialogActions,
  DialogContent,
  DialogContentText,
  Dialog,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { Person, Edit, Delete } from "@mui/icons-material";
import toast from "react-hot-toast";

import DataTable from "../Components/DataTable";
import DataTableCompetencia from "../Components/DataTableCompetencia";
import { deleteSwimmerRequest, getAllNadadores } from "../api/nadadoresResquest.js";
import { deleteInstitutionRequest } from "../api/institutionRequest.js";
import { getCompetencia,getCompetenciaTiempos,getResultados } from "../api/competenciaResquest";
// import DataTableCompResults from "../Components/DataTableCompResults";


function InsertTimesCompetencia() {
  const [data, setData] = useState([]);

  async function getData() {
    try {
      const res = await getCompetenciaTiempos();
      setData(res.data)
      console.log(res.data)

    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  }
  useEffect(() => {
    getData();
    }, []);
  return (
    <>  
      {/* <DataTableCompetencia data={data.Competencia} setData/> */}
      <DataTableCompetencia data={data.Competencia} setData={setData} />

    </>
  );
}

export default InsertTimesCompetencia;
