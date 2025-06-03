import axios from "axios";

export const urlRequestsApi = {
    local: "localhost:4000",
    edgar: "192.168.137.58:4000",
  };
  

const url =  urlRequestsApi.edgar;

const instance = axios.create({
  baseURL: `http://${url}/api`,
  withCredentials: true,
});

export const pathPhotos = `http://${url}/photos/`;

export const jwt = () => {
  return `Bearer ${window.localStorage.getItem("token")}`;
};

export default instance;

