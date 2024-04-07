import {
  Box,
  Container,
  Grid,
  TextField,
  Typography,
  Button,
  Select,
  Avatar,
  IconButton,
  FormControl,
  Autocomplete,
  InputLabel,
  MenuItem,
} from "@mui/material";

import { useForm } from "react-hook-form";

function FormAddInstitution() {
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm();

  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <Container maxWidth="xs" sx={{ mt: "30px", p: 5 }}>
      <Typography component="h1" variant="h5">
        Añadir institución
      </Typography>
      <Box
        component="form"
        sx={{ mt: "30px" }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Institucion"
              variant="standard"
              {...register("institution")}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default FormAddInstitution;
