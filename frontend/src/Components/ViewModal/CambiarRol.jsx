import { Button, Typography, Stack } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
export default function CambiarRol() {
  const { user, changeRole } = useAuth();

  if (!user?.roles?.length) return <Typography>No hay roles disponibles</Typography>;

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Cambiar de rol:</Typography>
      {user.roles.map((rol) => (
        <Button key={rol.id} variant="outlined" onClick={() => changeRole(rol.id)}>
          {rol.name}
        </Button>
      ))}
    </Stack>
  );
}
