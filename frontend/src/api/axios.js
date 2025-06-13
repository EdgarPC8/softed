// import axios from "axios";
// import { io } from "socket.io-client";


// export const urlRequestsApi = {
//     local: "localhost:4000",
//     // edgar: "192.168.137.92:4000",
//     edgar: "192.169.100d.109",
//   };
  

// const url =  urlRequestsApi.local;

// const instance = axios.create({
//   baseURL: `http://${url}/api`,
//   withCredentials: true,
// });

// export const pathPhotos = `http://${url}/photos/`;
// export const socket = io(`http://${url}`); 


// export const jwt = () => {
//   return `Bearer ${window.localStorage.getItem("token")}`;
// };

// export default instance;

import axios from "axios";
import { io } from "socket.io-client";


export const urlRequestsApi = {
    local: "http://localhost:3000",
    // edgar: "192.168.137.92:4000",
    edgar: "192.169.100d.109",
    production:"https://www.aplicaciones.marianosamaniego.edu.ec"
  };
  

const url =  urlRequestsApi.production;

const instance = axios.create({
  baseURL: `${url}/api`,
  withCredentials: true,
});

export const pathPhotos = `${url}/photos/`;
export const socket = io(`${url}`); 


export const jwt = () => {
  return `Bearer ${window.localStorage.getItem("token")}`;
};

export default instance;

