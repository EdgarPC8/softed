import axios, { jwt } from "./axios.js";


export const sendBackUpRequest = async (back) =>
  await axios.post("/backUp", back, {
    headers: {
      Authorization: jwt(),
    },
  });

  export const reloadBD = async () =>
  await axios.get("/comands/reloadBD", {
    headers: {
      Authorization: jwt(),
    },
  });
  export const saveBackup = async () =>
  await axios.get("/comands/saveBackup", {
    headers: { Authorization: jwt() },
    timeout: 60000,
  });
  export const getLogs = async () =>
  await axios.get("/comands/getLogs", {
    headers: {
      Authorization: jwt(),
    },
  });
  
  export const downloadBackup = async () => {
    const response = await axios.get("/comands/downloadBackup", {
      headers: { Authorization: jwt() },
      responseType: 'blob',
      timeout: 90000,
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };


export const uploadBackup = (formData) =>
  axios.post("/comands/upload-backup", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    Authorization: jwt(), // Ajusta esto según tu lógica de autenticación

  });

  
