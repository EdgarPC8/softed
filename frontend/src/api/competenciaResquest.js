// import axios from "./axios.js";
// import { authorization } from "./axios.js";

import axios, { jwt } from "./axios.js";

export const getCompetencia = async () =>
  await axios.get("/administrarCompetencia", {
    headers: {
      Authorization: jwt(),
    },
  });


