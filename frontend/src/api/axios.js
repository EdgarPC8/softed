import axios from "axios";

const objUrl = {
  pato: "localhost/Dev",
  local: "localhost:8888",
  edgar: "192.168.100.250:8888",
  pc: "192.168.137.250:8888",
  alumni: "aplicaciones.marianosamaniego.edu.ec",
};
const url = objUrl.pato;

const instance = axios.create({
  baseURL: `http://${url}/natacion/backend`,
  // withCredentials: true
});

export const pathPhotos = `http://${url}/natacion/backend/photos`;
export const jwt = () => {
  return `Bearer ${window.localStorage.getItem("token")}`;
};
// export const authorization = {
//   Authorization: `Bearer ${localStorage.getItem("token")}`,
// };deddedesded

export default instance;
