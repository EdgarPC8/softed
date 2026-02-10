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
    qrImage: "./qr-edgar.png"
  },
  {
    name: "Patricio Alexander Briceño Sarango",
    ci: "1106011420",
    accountNumber: "2904396463",
    bank: "Banco de Loja",
    accountType: "Cuenta de ahorros",
    qrImage: "./qr-patricio.png"
  }
];

const Donations = () => {
  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: "auto",
        mt: 4,
        px: 2,
        bgcolor: "background.default",
        color: "text.primary",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom color="text.primary">
        <VolunteerActivismIcon fontSize="large" sx={{ verticalAlign: "middle", mr: 1 }} />
        Apoya a los Creadores
      </Typography>

      <Typography variant="body1" align="center" sx={{ mb: 4 }} color="text.secondary">
        Tu aporte contribuye al desarrollo y mantenimiento de este sistema. ¡Gracias por confiar en nosotros!
      </Typography>

      <Grid container spacing={3}>
        {donationData.map((donor, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card elevation={4} sx={{ bgcolor: "background.paper", color: "text.primary" }}>
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
                  <Grid item xs={7}>
                    <Typography variant="h6" gutterBottom color="text.primary">
                      {donor.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Cédula:</strong> {donor.ci}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Número de cuenta:</strong> {donor.accountNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Tipo de cuenta:</strong> {donor.accountType}
                    </Typography>
                  </Grid>

                  <Grid item xs={5} textAlign="center">
                    {donor.qrImage && (
                      <Box
                        component="img"
                        src={donor.qrImage}
                        alt={`QR de ${donor.name}`}
                        sx={{
                          width: "100%",
                          maxWidth: 200,
                          height: "auto",
                          borderRadius: 2,
                          boxShadow: 2,
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
