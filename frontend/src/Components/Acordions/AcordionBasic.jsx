import * as React from 'react';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom'; // Importar Link para la navegación

export default function AccordionBasic({ page }) {
  return (
      <Accordion
        disableGutters // Elimina el margen lateral del Accordion
        sx={{
          boxShadow: 'none', // Elimina la sombra por defecto
          margin: 0, // Elimina cualquier margen externo
          padding: 0, // Elimina el padding interno
        }}
      >
        {/* Título del menú principal */}
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />} // Icono para expandir el acordeón
          aria-controls={`${page.name}-content`}
          id={`${page.name}-header`}
          sx={{
            margin: 0, // Elimina el margen en el resumen
            minHeight: 'unset', // Elimina la altura mínima
            padding: 0, // Elimina padding
            '&.Mui-expanded': {
              minHeight: 'unset', // Evita que el expandido tenga mayor altura
            },
          }}
        >
          <Typography>{page.icon}{page.name}</Typography>
        </AccordionSummary>

        {/* Detalles del submenú (ítems dentro del acordeón) */}
        <AccordionDetails
          sx={{
            padding: 0, // Elimina padding en los detalles
          }}
        >
          {page.menu && page.menu.items.map((item) => (
            <MenuItem
              key={item.name}
              component={Link} // Navegación con Link
              to={item.link}
              sx={{
                padding: '8px 16px', // Ajusta el padding de los ítems según tu preferencia
              }}
            >
              <Typography textAlign="center">{item.name}</Typography>
            </MenuItem>
          ))}
        </AccordionDetails>
      </Accordion>
  );
}
