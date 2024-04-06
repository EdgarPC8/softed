
import axios from "axios";

const objUrl={
  local:"localhost:8888",
  edgar:"192.168.100.250:8888",
  alumni:"aplicaciones.marianosamaniego.edu.ec",
}
const url =objUrl.local

const instance = axios.create({
  baseURL: `http://${url}/natacion/backend`
  // withCredentials: true
});
export const jwt = () => {
  return `Bearer ${window.localStorage.getItem("token")}`;
};
// export const authorization = {
//   Authorization: `Bearer ${localStorage.getItem("token")}`,
// };

export default instance;






