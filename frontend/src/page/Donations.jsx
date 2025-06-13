import React from "react";
import { Box, Typography, Grid, Card, CardContent, Divider, Avatar, Link } from "@mui/material";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";

const bancoLogo = "https://play-lh.googleusercontent.com/P1klHkUCDArGPvUoTLx1Ch2DwVImHKM8k8YrK9jHkxs_I4Sp272Qx1S66wQO2xzzFg";

const donationData = [
  {
    name: "Edgar Patricio Torres Condolo",
    ci: "1104661598",
    accountNumber: "2951571509",
    bank: "Banco de Loja",
    accountType: "Cuenta de ahorros",
    qrImage: "/qr-edgar.png"
  },
  {
    name: "Patricio Alexander Briceño Sarango",
    ci: "1106011420",
    accountNumber: "2904396463",
    bank: "Banco de Loja",
    accountType: "Cuenta de ahorros",
    qrImage: "/qr-patricio.png"
  }
];

const Donations = () => {
  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, px: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        <VolunteerActivismIcon fontSize="large" sx={{ verticalAlign: "middle", mr: 1 }} />
        Apoya a los Creadores
      </Typography>

      <Typography variant="body1" align="center" sx={{ mb: 4 }}>
        Tu aporte contribuye al desarrollo y mantenimiento de este sistema. ¡Gracias por confiar en nosotros!
      </Typography>

      <Grid container spacing={3}>
        {donationData.map((donor, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ backgroundColor: "#f4fff0" }} elevation={4}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Avatar
                    alt="Banco de Loja"
                    src={bancoLogo}
                    sx={{ width: 48, height: 48 }}
                    variant="rounded"
                  />
                  <Link
                    href="https://www.bancodeloja.fin.ec/"
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                    color="primary"
                    fontWeight="bold"
                  >
                    {donor.bank}
                  </Link>
                </Box>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2} alignItems="center">
                  {/* Columna izquierda: texto */}
                  <Grid item xs={7}>
                    <Typography variant="h6" gutterBottom>{donor.name}</Typography>
                    <Typography variant="body2"><strong>Cédula:</strong> {donor.ci}</Typography>
                    <Typography variant="body2"><strong>Número de cuenta:</strong> {donor.accountNumber}</Typography>
                    <Typography variant="body2"><strong>Tipo de cuenta:</strong> {donor.accountType}</Typography>
                  </Grid>

                  {/* Columna derecha: imagen QR */}
                  <Grid item xs={5} textAlign="center">
                    {donor.qrImage && (
                      <img
                        src={donor.qrImage}
                        alt={`QR de ${donor.name}`}
                        style={{
                          width: "100%",
                          maxWidth: "200px",
                          height: "auto",
                          borderRadius: "12px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                        }}
                      />
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Donations;
