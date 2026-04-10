import axiosDefault, { axiosForSoftedModules, jwt } from "./axios.js";
import { activeAppId } from "../../appConfig.js";

/**
 * Comandos de backup/BD: EdDeli → eddeliapi; Alumni → alumniapi; shell SoftEd → softedapi.
 */
const comandsAxios = () =>
  activeAppId === "softed" ? axiosForSoftedModules : axiosDefault;

export const sendBackUpRequest = async (back) =>
  await comandsAxios().post("/backUp", back, {
    headers: { Authorization: jwt() },
  });

export const reloadBD = async () =>
  await comandsAxios().get("/comands/reloadBD", {
    headers: { Authorization: jwt() },
    timeout: 120000,
  });

export const saveBackup = async () =>
  await comandsAxios().get("/comands/saveBackup", {
    headers: { Authorization: jwt() },
    timeout: 60000,
  });

export const getLogs = async () =>
  await comandsAxios().get("/comands/getLogs", {
    headers: { Authorization: jwt() },
  });

export const downloadBackup = async () => {
  const response = await comandsAxios().get("/comands/downloadBackup", {
    headers: { Authorization: jwt() },
    responseType: "blob",
    timeout: 90000,
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const a = document.createElement("a");
  a.href = url;
  a.download =
    activeAppId === "softed"
      ? "backup-softed.json"
      : activeAppId === "alumni"
        ? "backup-alumni.json"
        : activeAppId === "musica"
          ? "backup-musica.json"
          : "backup-eddeli.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

export const uploadBackup = (formData) =>
  comandsAxios().post("/comands/upload-backup", formData, {
    headers: { Authorization: jwt() },
    timeout: 120000,
  });
