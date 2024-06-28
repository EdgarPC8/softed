import { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { Button } from "@mui/material";
import { getCompetenciaTiempos } from "../api/competenciaResquest";
import DataTableCompetencia from "./DataTableCompetencia";

export default function InsertTimesCompetencia() {
  const [data, setData] = useState([]);

  const saveDataToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const competenciaSheet = workbook.addWorksheet("competencia");
    competenciaSheet.columns = [
      { header: "", width: 10 },
      { header: "", width: 20 },
      { header: "", width: 25 },
      { header: "", width: 10 },
      { header: "", width: 3 },
      { header: "", width: 10 },
      { header: "", width: 20 },
      { header: "", width: 25 },
      { header: "", width: 10 },
      { header: "", width: 3 },
    ];

    let currentRowFemenino = 1;
    let currentRowMasculino = 1;

    data.Competencia.forEach((competence, index) => {
      if (competence.genero === "F") {
        if (index !== 0 && index !== 1) {
          if (currentRowFemenino < currentRowMasculino) {
            currentRowFemenino = currentRowMasculino;
          } else {
            currentRowMasculino = currentRowFemenino;
          }
        }
        // Evento: F
        competenciaSheet.getRow(currentRowFemenino).getCell(1).value = `Evento: ${index + 1}`;
        competenciaSheet.getRow(currentRowFemenino).getCell(2).value = competence.name;
        competenciaSheet.getRow(currentRowFemenino).getCell(3).value = "Cat:";
        competenciaSheet.getRow(currentRowFemenino).getCell(4).value = competence.categoria.name;
        competenciaSheet.getRow(currentRowFemenino).getCell(5).value = competence.genero;
        currentRowFemenino++;

        // Cabecera de nadadores (F)
        competenciaSheet.getRow(currentRowFemenino).values = ["Carril", "Nadador", "Institución", "Tiempo", "N"];
        currentRowFemenino++;

        // Datos de nadadores (F)
        competence.series.forEach((serie, serieIndex) => {
          competenciaSheet.getRow(currentRowFemenino).getCell(2).value = `Serie: ${serieIndex + 1}`;
          competenciaSheet.mergeCells(`B${currentRowFemenino}:D${currentRowFemenino}`);
          competenciaSheet.getRow(currentRowFemenino).getCell(2).alignment = { horizontal: 'center' };
          currentRowFemenino++;

          serie.nadadores.forEach((nadador) => {
            competenciaSheet.getRow(currentRowFemenino).getCell(1).value = nadador.carril;
            competenciaSheet.getRow(currentRowFemenino).getCell(2).value = nadador.nadador;
            competenciaSheet.getRow(currentRowFemenino).getCell(3).value = nadador.entidad;
            competenciaSheet.getRow(currentRowFemenino).getCell(4).value = nadador.tiempo;
            competenciaSheet.getRow(currentRowFemenino).getCell(5).value = "";
            currentRowFemenino++;
          });

          currentRowFemenino++;
        });

      } else {
        competenciaSheet.getRow(currentRowMasculino).getCell(6).value = `Evento: ${index + 1}`;
        competenciaSheet.getRow(currentRowMasculino).getCell(7).value = competence.name;
        competenciaSheet.getRow(currentRowMasculino).getCell(8).value = "Cat:";
        competenciaSheet.getRow(currentRowMasculino).getCell(9).value = competence.categoria.name;
        competenciaSheet.getRow(currentRowMasculino).getCell(10).value = competence.genero;
        currentRowMasculino++;

        // Cabecera de nadadores (M)
        competenciaSheet.getRow(currentRowMasculino).getCell(6).value = "Carril";
        competenciaSheet.getRow(currentRowMasculino).getCell(7).value = "Nadador";
        competenciaSheet.getRow(currentRowMasculino).getCell(8).value = "Institución";
        competenciaSheet.getRow(currentRowMasculino).getCell(9).value = "Tiempo";
        competenciaSheet.getRow(currentRowMasculino).getCell(10).value = "N";
        currentRowMasculino++;

        // Datos de nadadores (M)
        competence.series.forEach((serie, serieIndex) => {
          competenciaSheet.getRow(currentRowMasculino).getCell(7).value = `Serie: ${serieIndex + 1}`;
          competenciaSheet.mergeCells(`G${currentRowMasculino}:I${currentRowMasculino}`);
          competenciaSheet.getRow(currentRowMasculino).getCell(7).alignment = { horizontal: 'center' };
          currentRowMasculino++;

          serie.nadadores.forEach((nadador) => {
            competenciaSheet.getRow(currentRowMasculino).getCell(6).value = nadador.carril;
            competenciaSheet.getRow(currentRowMasculino).getCell(7).value = nadador.nadador;
            competenciaSheet.getRow(currentRowMasculino).getCell(8).value = nadador.entidad;
            competenciaSheet.getRow(currentRowMasculino).getCell(9).value = nadador.tiempo;
            competenciaSheet.getRow(currentRowMasculino).getCell(10).value = "";
            currentRowMasculino++;
          });

          currentRowMasculino++;
        });
      }
    });

    // Guardar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const excelBlob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const excelBlobUrl = URL.createObjectURL(excelBlob);
    const link = document.createElement("a");
    link.href = excelBlobUrl;
    link.download = "resultados.xlsx";
    link.click();
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
      <DataTableCompetencia data={data.Competencia}setData={setData}/>

    </>
  );
}
