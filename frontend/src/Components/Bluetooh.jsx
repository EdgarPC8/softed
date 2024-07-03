import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
} from "@mui/material";

function Bluetooth() {
  const [status, setStatus] = useState("Estado: No conectado");
  const [batteryLevel, setBatteryLevel] = useState(null);

  const connectToDevice = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['battery_service'] }]
      });

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('battery_service');
      const characteristic = await service.getCharacteristic('battery_level');

      const value = await characteristic.readValue();
      const batteryLevel = value.getUint8(0);

      setStatus(`Estado: Conectado`);
      setBatteryLevel(batteryLevel);
    } catch (error) {
      console.error("Error al conectar al dispositivo Bluetooth:", error);
      setStatus('Estado: Error al conectar');
    }
  };

  return (
    <Container>
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <Typography variant="h4" gutterBottom>
          Conectar a Dispositivo Bluetooth
        </Typography>
        <Button variant="contained" color="primary" onClick={connectToDevice}>
          Conectar
        </Button>
        <Typography variant="h6" mt={2}>
          {status}
        </Typography>
        {batteryLevel !== null && (
          <Typography variant="h6">
            Nivel de batería: {batteryLevel}%
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default Bluetooth;
