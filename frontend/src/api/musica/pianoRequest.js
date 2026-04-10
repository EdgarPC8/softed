import axiosDefault, { jwt } from "../axios.js";

/** API principal (musicaapi) — mismo contrato que softed /piano */
const base = "/piano";

export const getPianoSongs = () =>
  axiosDefault.get(base, { headers: { Authorization: jwt() } });

export const getPianoSongById = (id) =>
  axiosDefault.get(`${base}/${id}`, { headers: { Authorization: jwt() } });

export const createPianoSong = (data) =>
  axiosDefault.post(base, data, {
    headers: {
      Authorization: jwt(),
      "Content-Type": "application/json",
    },
  });

export const updatePianoSong = (id, data) =>
  axiosDefault.put(`${base}/${id}`, data, { headers: { Authorization: jwt() } });

export const deletePianoSong = (id) =>
  axiosDefault.delete(`${base}/${id}`, { headers: { Authorization: jwt() } });
