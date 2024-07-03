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
export function convertirTiempoAMilisegundos(tiempo) {
  const partes = tiempo.split(":");
  const [segundos, milisegundos] = partes[2].split(",");
  const horas = parseInt(partes[0], 10);
  const minutos = parseInt(partes[1], 10);
  const segundosInt = parseInt(segundos, 10);
  const milisegundosInt = parseInt(milisegundos, 10);

  return (horas * 3600 + minutos * 60 + segundosInt) * 1000 + milisegundosInt * 10;
}

export function convertirMilisegundosATiempo(milisegundos) {
  const horas = Math.floor(milisegundos / 3600000);
  milisegundos %= 3600000;
  const minutos = Math.floor(milisegundos / 60000);
  milisegundos %= 60000;
  const segundos = Math.floor(milisegundos / 1000);
  const milesimas = milisegundos % 1000;

  // Formatear milisegundos para asegurar dos dígitos decimales
  let milesimasStr = String(milesimas).padStart(3, "0");
  milesimasStr = milesimasStr.substring(0, 2);

  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")},${milesimasStr}`;
}
export function getDiferenciasEntreTiempos(primer, segundo) {
  const tiempoActualMs = convertirTiempoAMilisegundos(primer);
  const tiempoAnteriorMs = convertirTiempoAMilisegundos(segundo);

  // Asegurarse de restar siempre el mayor del menor para evitar un resultado negativo
  const diferenciaMs = Math.abs(tiempoActualMs - tiempoAnteriorMs);
  const diferenciaTiempo = convertirMilisegundosATiempo(diferenciaMs);

  return diferenciaTiempo;
}




