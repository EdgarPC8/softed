import React from 'react';
import { 
  Button, Typography, AppBar, IconButton, Fab, Chip, 
  Checkbox, Radio, Switch, Slider, CircularProgress, 
  LinearProgress, Tabs, Pagination, Alert, SpeedDial, 
  TextField, Select, InputBase, Icon, Badge, Accordion, 
  AccordionSummary, Box 
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MailIcon from '@mui/icons-material/Mail';
import { useAuth } from "../../context/AuthContext";
import { deleteRolRequest, getRolRequest,updateRolRequest,addRolRequest } from "../../api/accountRequest.js";


export default function All() {
  const { toast} = useAuth();

  const peticion = async() => {
    // const promise =await ; // Crear la promesa
    toast({
      promise: getRolRequest()
    });
    
  };

  return (
    <Box padding={3}>

      {/* 1. Button */}
      <Button onClick={async() => {await peticion()}} color="primary" variant="contained" sx={{ marginTop: 2 }}>Realizar Peticion</Button>

      <br/>
      <Button color="primary" variant="contained" sx={{ marginTop: 2 }}>Primary Button</Button>
      <Button color="secondary" variant="contained" sx={{ marginLeft: 2 }}>Secondary Button</Button>

      {/* 2. Typography */}
      <Typography color="primary" sx={{ marginTop: 3 }}>Primary Text</Typography>
      <Typography color="secondary">Secondary Text</Typography>

      {/* 3. AppBar */}
      <AppBar color="primary" position="static" sx={{ marginTop: 3 }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Primary AppBar
        </Typography>
      </AppBar>

      {/* 4. IconButton */}
      <IconButton color="primary" aria-label="primary">
        <MailIcon />
      </IconButton>
      <IconButton color="secondary" aria-label="secondary" sx={{ marginLeft: 2 }}>
        <MailIcon />
      </IconButton>

      {/* 5. Fab */}
      <Fab color="primary" aria-label="add" sx={{ marginTop: 3 }}>
        +
      </Fab>
      <Fab color="secondary" aria-label="edit" sx={{ marginLeft: 2 }}>
        ✎
      </Fab>

      {/* 6. Chip */}
      <Chip color="primary" label="Primary Chip" sx={{ marginTop: 3 }} />
      <Chip color="secondary" label="Secondary Chip" sx={{ marginLeft: 2 }} />

      {/* 7. Checkbox */}
      <Checkbox color="primary" />
      <Checkbox color="secondary" sx={{ marginLeft: 2 }} />

      {/* 8. Radio */}
      <Radio color="primary" />
      <Radio color="secondary" sx={{ marginLeft: 2 }} />

      {/* 9. Switch */}
      <Switch color="primary" />
      <Switch color="secondary" sx={{ marginLeft: 2 }} />

      {/* 10. Slider */}
      <Slider color="primary" defaultValue={30} sx={{ marginTop: 3 }} />
      <Slider color="secondary" defaultValue={50} sx={{ marginTop: 2 }} />

      {/* 11. CircularProgress and LinearProgress */}
      <CircularProgress color="primary" sx={{ marginTop: 3 }} />
      <CircularProgress color="secondary" sx={{ marginLeft: 2 }} />
      <LinearProgress color="primary" sx={{ marginTop: 3 }} />
      <LinearProgress color="secondary" sx={{ marginTop: 2 }} />

      {/* 12. Tabs */}
      <Tabs value={0} indicatorColor="primary" textColor="primary" sx={{ marginTop: 3 }}>
        <Typography>Tab 1</Typography>
      </Tabs>

      {/* 13. Pagination */}
      <Pagination color="primary" count={10} sx={{ marginTop: 3 }} />
      <Pagination color="secondary" count={10} sx={{ marginLeft: 2 }} />

      {/* 14. Alert */}
      <Alert color="primary" sx={{ marginTop: 3 }}>This is a primary alert</Alert>
      <Alert color="secondary" sx={{ marginTop: 2 }}>This is a secondary alert</Alert>

      {/* 15. SpeedDial */}
      <SpeedDial color="primary" ariaLabel="SpeedDial" sx={{ marginTop: 3 }} />

      {/* 16. TextField */}
      <TextField color="primary" label="Primary TextField" sx={{ marginTop: 3 }} />
      <TextField color="secondary" label="Secondary TextField" sx={{ marginLeft: 2 }} />

      {/* 17. Select */}
      <Select color="primary" native defaultValue="">
        <option value="">Primary Select</option>
      </Select>

      {/* 18. InputBase */}
      <InputBase color="primary" placeholder="Primary Input" sx={{ marginTop: 3 }} />
      <InputBase color="secondary" placeholder="Secondary Input" sx={{ marginLeft: 2 }} />

      {/* 19. Icon */}
      <Icon color="primary">home</Icon>
      <Icon color="secondary" sx={{ marginLeft: 2 }}>star</Icon>

      {/* 20. Badge */}
      <Badge color="primary" badgeContent={4} sx={{ marginTop: 3 }}>
        <MailIcon />
      </Badge>
      <Badge color="secondary" badgeContent={10} sx={{ marginLeft: 2 }}>
        <MailIcon />
      </Badge>

      {/* 21. Accordion */}
      <Accordion sx={{ marginTop: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} color="primary">
          <Typography>Primary Accordion</Typography>
        </AccordionSummary>
      </Accordion>

    </Box>
  );
}
