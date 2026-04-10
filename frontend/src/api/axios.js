import axios from "axios";
import { io } from "socket.io-client";
import appsInfo, {
  apiPath,
  activeApp,
  activeAppId,
  softedApiPath,
  softedApiPort,
} from "../../appConfig.js";

const alumniApp = appsInfo.alumni;
export const urlRequestsApiAlumni = {
  local: `http://localhost:${alumniApp.apiPort}/${alumniApp.apiPath}`,
  production: `https://aplicaciones.marianosamaniego.edu.ec/${alumniApp.apiPath}`,
  edgar: `http://192.168.1.102:${alumniApp.apiPort}/${alumniApp.apiPath}`,
};

const apiPort = activeApp?.apiPort ?? 3001;

export const urlRequestsApi = {
  local: `http://localhost:${apiPort}/${apiPath}`,
  production: `https://aplicaciones.marianosamaniego.edu.ec/${apiPath}`,
  edgar: `http://192.168.1.102:${apiPort}/${apiPath}`,
};

/** Cambia solo esto: qué URL usar para el API principal (misma app activa en appConfig). */
const API_ENV = "production"; // 'local' | 'edgar' | 'production'

const url = urlRequestsApi[API_ENV];

/** URLs del API SoftEd (Piano, Quiz, Forms, CV, comandos) cuando activeAppId === 'softed' */
export const urlRequestsApiSofted =
  softedApiPath && softedApiPort
    ? {
        local: `http://localhost:${softedApiPort}/${softedApiPath}`,
        production: `https://aplicaciones.marianosamaniego.edu.ec/${softedApiPath}`,
        edgar: `http://192.168.1.102:${softedApiPort}/${softedApiPath}`,
      }
    : null;

const softedModulesUrl =
  activeAppId === "softed" && urlRequestsApiSofted
    ? urlRequestsApiSofted[API_ENV]
    : null;

const socketUrl = new URL(url).origin;
const instance = axios.create({
  baseURL: `${url}`,
  withCredentials: true,
});

const softedModulesInstance =
  activeAppId === "softed" && softedModulesUrl
    ? axios.create({
        baseURL: softedModulesUrl,
        withCredentials: true,
      })
    : null;

/** Cliente para rutas en softedapi (solo app shell softed); en otras apps = API principal. */
export const axiosForSoftedModules = softedModulesInstance ?? instance;

/** En shell softed, matriz/carreras van al backend alumni; en app alumni = cliente principal. */
export const axiosForAlumniModules =
  activeAppId === "softed"
    ? axios.create({
        baseURL: urlRequestsApiAlumni[API_ENV],
        withCredentials: true,
      })
    : instance;

export const pathPhotos = `${url}/photos/`;
export const pathImg = `${url}/img/`;
export const pathFiles = `${url}/files/`;
export const socket = io(socketUrl, { withCredentials: true });

export const buildImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("data:")
  ) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  const basePath = pathImg.endsWith("/") ? pathImg : `${pathImg}/`;
  return `${basePath}${cleanPath}`;
};

export const jwt = () => {
  return `Bearer ${window.localStorage.getItem("token")}`;
};

export default instance;
