export const getAgePatient = (date) => {
  let today = new Date();
  let birthday = new Date(date);
  let age = today.getFullYear() - birthday.getFullYear();
  let month = today.getMonth() - birthday.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < birthday.getDate())) age--;

  return age;
};
export const getDateNow = () => {
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  if (day < 10) day = "0" + day;
  if (month < 10) month = "0" + month;
  let string = `${year}-${month}-${day}`;
  return string;
};
export const mostrarRelojDigital=(input)=> {
  function actualizarHora() {
    let hora = new Date();
    let horas = hora.getHours();
    let minutos = hora.getMinutes();
    let segundos = hora.getSeconds();

    // Añade un cero delante de los números menores de 10
    horas = (horas < 10 ? "0" : "") + horas;
    minutos = (minutos < 10 ? "0" : "") + minutos;
    segundos = (segundos < 10 ? "0" : "") + segundos;

    let horaActual = horas + ":" + minutos + ":" + segundos;

    // Asigna la hora actual al valor del input
    input.value = horaActual;
  }

  // Actualiza la hora cada segundo
  setInterval(actualizarHora, 1000);
}


