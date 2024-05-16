import { useEffect, useState } from "react";
import ExcelJS from "exceljs";

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
import {
  deleteSwimmerRequest,
  getAllNadadores,
} from "../api/nadadoresResquest.js";
import { deleteInstitutionRequest } from "../api/institutionRequest.js";
import {
  getCompetencia,
  getCompetenciaTiempos,
  getResultados,
} from "../api/competenciaResquest";
// import DataTableCompResults from "../Components/DataTableCompResults";

function InsertTimesCompetencia() {
  const [data, setData] = useState([]);

  const saveDataToExcel = async () => {
    const workbook = new ExcelJS.Workbook();

    const maleSheet = workbook.addWorksheet("masculino");
    const femaleSheet = workbook.addWorksheet("femenino");

    maleSheet.columns = [
      { header: "", key: "columna1", width: 40 },
      { header: "", key: "columna2", width: 40 },
      { header: "", key: "columna3", width: 40 },
      { header: "", key: "columna3", width: 40 },
      { header: "", key: "columna3", width: 40 },
    ];

    femaleSheet.columns = [
      { header: "", key: "columna1", width: 40 },
      { header: "", key: "columna2", width: 40 },
      { header: "", key: "columna3", width: 40 },
      { header: "", key: "columna3", width: 40 },
      { header: "", key: "columna3", width: 40 },
    ];

    // Recorrer cada competencia
    data.Competencia.forEach((competence, index) => {
      if (competence.genero === "M") {
        maleSheet.addRow([
          `Evento: ${index + 1}`,
          `${competence.name}`,
          "Cat:",
          competence.categoria.name,
          competence.genero,
        ]);

        competence.series.forEach((serie, index) => {
          maleSheet.addRow([``, "Nadador", "Institución", "Tiempo", "N"]);

          maleSheet.addRow([`Serie: ${index + 1}/carril`]);

          serie.nadadores.forEach((nadador, index) => {
            maleSheet.addRow([
              index + 1,
              nadador.nadador,
              nadador.entidad,
              nadador.tiempo,
            ]);
          });
        });

        maleSheet.addRow({});
      }

      if (competence.genero === "F") {
        femaleSheet.addRow([
          `Evento: ${index + 1}`,
          `${competence.name}`,
          "Cat:",
          competence.categoria.name,
          competence.genero,
        ]);

        competence.series.forEach((serie, index) => {
          femaleSheet.addRow([``, "Nadador", "Institución", "Tiempo", "N"]);

          femaleSheet.addRow([`Serie: ${index + 1}/carril`]);

          serie.nadadores.forEach((nadador, index) => {
            femaleSheet.addRow([
              index + 1,
              nadador.nadador,
              nadador.entidad,
              nadador.tiempo,
            ]);
          });
        });

        femaleSheet.addRow({});
      }
      // Definir las columnas para este evento/competencia
    });

    // Generar un archivo Excel en formato buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Convertir el buffer en un Blob
    const excelBlob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Crear un objeto URL para el Blob
    const excelBlobUrl = URL.createObjectURL(excelBlob);

    // Crear un enlace para descargar el archivo
    const link = document.createElement("a");
    link.href = excelBlobUrl;
    link.download = "resultados.xlsx";

    // Simular un clic en el enlace para iniciar la descarga
    link.click();

    // Liberar el objeto URL
    URL.revokeObjectURL(excelBlobUrl);
  };

  async function getData() {
    try {
      const res = await getCompetenciaTiempos();
      setData(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  }
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <Button onClick={saveDataToExcel}>Exportar</Button>
      <DataTableCompetencia data={data.Competencia} />
    </>
  );
}

export default InsertTimesCompetencia;
