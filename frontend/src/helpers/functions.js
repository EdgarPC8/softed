// import { fromBlankAsync } from "xlsx-populate";


export function inputsNumberToTime(value) {
  // Verificar si el valor no está vacío y es un número entero
  if (
    value !== "" &&
    Number.isInteger(parseInt(value)) &&
    value.toString().length <= 8
  ) {
    let valor = value.toString(); // Convertir a cadena de texto si no lo es

    // Asegurarse de que la longitud de la cadena sea la correcta
    while (valor.length < 8) {
      valor = "0" + valor; // Agregar ceros a la izquierda si es necesario
    }

    // Extraer las partes de hora, minutos y segundos
    let hours = valor.substring(0, 2);
    let minutes = valor.substring(2, 4);
    let seconds = valor.substring(4, 6);
    let milliseconds = valor.substring(6, 8);

    // Formatear la cadena de tiempo en el formato deseado
    let formattedTime = `${hours}:${minutes}:${seconds},${milliseconds}`;

    return formattedTime;
  } else {
    return value;
  }
}

