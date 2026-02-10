import axios, { jwt } from "./axios.js";

const auth = () => ({ headers: { Authorization: jwt() } });

/** Obtener datos adicionales del usuario autenticado (dirección, teléfonos, tipo de sangre, correos). */
export const getMyUserData = () =>
  axios.get("/users/me/data", auth());

/** Actualizar datos adicionales del usuario autenticado. */
export const updateMyUserData = (data) =>
  axios.put("/users/me/data", data, auth());
