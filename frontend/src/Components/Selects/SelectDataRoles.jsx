import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getRolRequest } from '../../api/accountRequest';
import { useEffect, useState } from "react";

export default function SelectDataRoles({ value, onChange }) {
  const [rol, setRoles] = useState([]);

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    onChange(selectedValue); // ← ya es array si `multiple` está activado
  };

  const fetch = async () => {
    const { data } = await getRolRequest();
    setRoles(data);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <FormControl sx={{ m: 1, minWidth: "100%" }}>
      <InputLabel id="roles-select-label">Roles</InputLabel>
      <Select
        labelId="roles-select-label"
        id="roles-select"
        value={value}
        onChange={handleChange}
        label="Roles"
        multiple // ← habilita selección múltiple
        renderValue={(selected) =>
          selected.map(id => rol.find(r => r.id === id)?.name || id).join(", ")
        }
      >
        {rol.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

