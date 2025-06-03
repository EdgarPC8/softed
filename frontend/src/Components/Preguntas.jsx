import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

export default function Preguntas({ questions, setPage }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 2 }}>
      <Grid container spacing={1} maxWidth={400}>
        {questions.map((_, index) => (
          <Grid item xs={2} key={index}>
            <Button
              variant="contained"
              sx={{
                minWidth: 25,
                minHeight: 25,
                fontSize: 10,
                padding: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => setPage(index)} // Notifica al padre que cambie a la página seleccionada
            >
              {index + 1}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
