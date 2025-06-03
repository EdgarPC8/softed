import axios, { jwt } from "./axios.js";


export const sendBackUpRequest = async (back) =>
  await axios.post("/backUp", back, {
    headers: {
      Authorization: jwt(),
    },
  });

  export const reloadBD = async () =>
  await axios.get("/reloadBD", {
    headers: {
      Authorization: jwt(),
    },
  });
  export const saveBackup = async () =>
  await axios.get("/comands/saveBackup", {
    headers: {
      Authorization: jwt(),
    },
  });
  export const getLogs = async () =>
  await axios.get("/comands/getLogs", {
    headers: {
      Authorization: jwt(),
    },
  });
  
  export const downloadBackup = async () => {
    try {
      const response = await axios.get("/comands/downloadBackup", {
        headers: {
          Authorization: jwt(), // Ajusta esto según tu lógica de autenticación
        },
        responseType: 'blob', // Asegúrate de que la respuesta sea un blob
      });
  
      // Crear un objeto URL para el blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Crear un enlace y simular un clic para descargar el archivo
      const a = document.createElement('a');
      a.href = url;
      a.download = 'backup.json'; // Nombre del archivo que se descargará
      document.body.appendChild(a);
      a.click();
      a.remove();
      
      // Revocar el objeto URL para liberar memoria
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar el backup:', error);
    }
  };
  
