import { Container, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { getLogs } from "../../api/enfermeriaRequest";
import TablePro from "../../Components/Tables/TablePro";

export default function LogsPage() {
  const [rows, setRows] = useState([]);

  const fetchData = async () => {
    try {
      const { data } = await getLogs();
      setRows((data || []).map((r) => ({ ...r, id: r.id })));
    } catch {
      setRows([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { id: "id", label: "ID" },
    { id: "date", label: "Fecha/Hora" },
    { id: "httpMethod", label: "Método" },
    { id: "endPoint", label: "Endpoint" },
    { id: "action", label: "Acción" },
    { id: "description", label: "Descripción", minWidth: 200 },
    { id: "system", label: "Sistema" },
  ];

  return (
    <Container sx={{ py: 2 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Logs del sistema
      </Typography>
      <Box sx={{ mt: 2 }}>
        <TablePro
          rows={rows}
          columns={columns}
          showSearch
          tableMaxHeight={500}
          rowsPerPageOptions={[25, 50, 100]}
          defaultRowsPerPage={25}
        />
      </Box>
    </Container>
  );
}
