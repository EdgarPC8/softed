import axiosDefault, { jwt } from "../axios.js";

const base = "/chord-songs";

export const getChordSongs = () =>
  axiosDefault.get(base, { headers: { Authorization: jwt() } });

export const getChordSongById = (id) =>
  axiosDefault.get(`${base}/${id}`, { headers: { Authorization: jwt() } });

export const createChordSong = (data) =>
  axiosDefault.post(base, data, {
    headers: {
      Authorization: jwt(),
      "Content-Type": "application/json",
    },
  });

export const updateChordSong = (id, data) =>
  axiosDefault.put(`${base}/${id}`, data, { headers: { Authorization: jwt() } });

export const deleteChordSong = (id) =>
  axiosDefault.delete(`${base}/${id}`, { headers: { Authorization: jwt() } });
