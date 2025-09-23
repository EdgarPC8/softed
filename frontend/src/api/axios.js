

import axios from "axios";
import { io } from "socket.io-client";

const api = "eddeliapi"
export const urlRequestsApi = {
    local: `http://localhost:3001/${api}`,
    production:`https://aplicaciones.marianosamaniego.edu.ec/${api}`,
    edgar:`http://192.168.137.156:3001/${api}`
  };

const url =  urlRequestsApi.production;

const instance = axios.create({
  baseURL: `${url}`,
  withCredentials: true,
});

export const pathPhotos = `${url}/photos/`;
export const pathImg = `${url}/inventory/imgEdDeli/`;
export const socket = io(`${url}`); 


export const jwt = () => {
  return `Bearer ${window.localStorage.getItem("token")}`;
};

export default instance;

