import axios, { jwt } from "../axios.js";

const base = "/piano";

export const getPianoSongs = () =>
  axios.get(base, { headers: { Authorization: jwt() } });

export const getPianoSongById = (id) =>
  axios.get(`${base}/${id}`, { headers: { Authorization: jwt() } });

export const createPianoSong = (data) =>
  axios.post(base, data, {
    headers: {
      Authorization: jwt(),
      'Content-Type': 'application/json',
    },
  });

export const updatePianoSong = (id, data) =>
  axios.put(`${base}/${id}`, data, { headers: { Authorization: jwt() } });

export const deletePianoSong = (id) =>
  axios.delete(`${base}/${id}`, { headers: { Authorization: jwt() } });
