import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
export default function SelectData({ Data, Label = "Seleccione", onChange }) {
    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
        if (onChange) {
            onChange(event.target.value);
        }
    };
    

    return (
        <div>
            <FormControl sx={{ m: 1, minWidth: 80 }}>
                <InputLabel id="demo-simple-select-autowidth-label">{Label}</InputLabel>
                <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={age}
                    onChange={handleChange}
                    autoWidth
                    label={Label}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {Data.map(item => (
                        <MenuItem key={item.value} value={item.value}>
                            {item.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
