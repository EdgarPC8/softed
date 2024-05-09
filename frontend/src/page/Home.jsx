import React from "react";
import { Typography, Paper, Grid, Button, Container, Box } from "@mui/material";
import { grey } from "@mui/material/colors";

function Home() {
  return (
    <Container maxWidth="md" style={{ backgroundColor: grey[50] }}>
      <Box mt={5}>
        <Typography variant="h2" gutterBottom>
          Bienvenido a nuestra Pagina Web del Club de Natación Ciudad de
          Cariamanga
        </Typography>
        <Typography variant="body1" paragraph></Typography>
      </Box>
    </Container>
  );
}

export default Home;
