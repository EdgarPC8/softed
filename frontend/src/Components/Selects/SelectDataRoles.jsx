import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getRolRequest } from '../../api/accountRequest';
import { useEffect, useState } from "react";

export default function SelectDataRoles({ value, onChange }) { // Recibimos el valor y onChange
  const [rol, setRoles] = useState([]);

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    onChange(selectedValue); // Propagamos el valor hacia el componente padre
  };

  const fetch = async () => {
    const { data } = await getRolRequest();
    setRoles(data);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: "100%" }}>
        <InputLabel id="demo-simple-select-autowidth-label">Roles</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={value} // Le asignamos el valor recibido
          onChange={handleChange} // El cambio se maneja con el onChange pasado desde el padre
          autoWidth
          label="rolId"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {rol.map(item => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
