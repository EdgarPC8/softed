import axios from "axios";
import { io } from "socket.io-client";
import { apiPath } from "../../appConfig.js";

export const urlRequestsApi = {
  local: `http://localhost:3001/${apiPath}`,
  production: `https://aplicaciones.marianosamaniego.edu.ec/${apiPath}`,
  edgar: `http://192.168.1.101:3001/${apiPath}`,
};
const url = urlRequestsApi.edgar;
// Socket.IO está en la raíz del servidor, no bajo /alumniapi - usar solo origin para que conecte bien
const socketUrl = new URL(url).origin;
const instance = axios.create({
  baseURL: `${url}`,
  withCredentials: true,
});
export const pathPhotos = `${url}/photos/`;
// export const pathImg = `${url}/inventory/imgEdDeli/`;
// ✅ pathImg: asegurar que termine con / y que incluya el prefijo correcto
export const pathImg = `${url}/img/`;
export const pathFiles = `${url}/files/`;
export const socket = io(socketUrl, { withCredentials: true });

// ✅ Helper para construir URLs de imágenes de forma segura
export const buildImageUrl = (imagePath) => {
  if (!imagePath) return null;
  // Si ya es una URL completa, retornarla tal cual
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  // Normalizar: quitar / inicial si existe y asegurar que pathImg termine con /
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const basePath = pathImg.endsWith('/') ? pathImg : `${pathImg}/`;
  return `${basePath}${cleanPath}`;
}; 

export const jwt = () => {
  return `Bearer ${window.localStorage.getItem("token")}`;
};

export default instance;

