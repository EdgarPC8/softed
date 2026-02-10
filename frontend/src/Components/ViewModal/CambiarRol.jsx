import { Button, Typography, Stack } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

export default function CambiarRol({ onClose }) {
  const { user, changeRole } = useAuth();
  const currentRolId = user?.rolId;

  if (!user?.roles?.length) return <Typography>No hay roles disponibles</Typography>;

  const handleSelectRol = (rolId) => {
    changeRole(rolId);
    onClose?.();
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Cambiar de rol:</Typography>
      {user.roles.map((rol) => (
        <Button
          key={rol.id}
          variant={rol.id === currentRolId ? "contained" : "outlined"}
          color={rol.id === currentRolId ? "primary" : "inherit"}
          onClick={() => handleSelectRol(rol.id)}
        >
          {rol.name}
        </Button>
      ))}
    </Stack>
  );
}
