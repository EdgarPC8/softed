import axios from "axios";
import { io } from "socket.io-client";
import { apiPath } from "../../appConfig.js";

export const urlRequestsApi = {
  local: `http://localhost:3001/${apiPath}`,
  production: `https://aplicaciones.marianosamaniego.edu.ec/${apiPath}`,
  edgar: `http://192.168.1.100:3001/${apiPath}`,
};
const url = urlRequestsApi.edgar;
const instance = axios.create({
  baseURL: `${url}`,
  withCredentials: true,
});
export const pathPhotos = `${url}/photos/`;
// export const pathImg = `${url}/inventory/imgEdDeli/`;
export const pathImg = `${url}/img/`;
export const pathFiles = `${url}/file/`;
export const socket = io(`${url}`); 

export const jwt = () => {
  return `Bearer ${window.localStorage.getItem("token")}`;
};

export default instance;

