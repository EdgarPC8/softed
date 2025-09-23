// OsmPointsMap.jsx
import { MapContainer, TileLayer, Popup, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Stack,
} from "@mui/material";

const points = [
  {
    id: 1,
    lat: -4.3282,
    lng: -79.5570,
    name: "Sucursal Centro",
    address: "Av. Bolívar 123",
    status: "activo",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  },
  {
    id: 2,
    lat: -4.3305,
    lng: -79.5530,
    name: "Sucursal Norte",
    address: "C. Loja y Quito",
    status: "nuevo",
    img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80",
  },
  {
    id: 3,
    lat: -4.3270,
    lng: -79.5600,
    name: "Kiosko Plaza",
    address: "Plaza Central",
    status: "inactivo",
    img: "https://images.unsplash.com/photo-1526312426976-593c2e6155c0?w=400&q=80",
  },
];

export default function OsmPointsMap() {
  const center = [-4.3282766, -79.5570572]; // Loja

  const colorByStatus = (status) => {
    switch ((status || "").toLowerCase()) {
      case "activo":   return "#2e7d32";
      case "nuevo":    return "#1976d2";
      case "inactivo": return "#9e9e9e";
      default:         return "#d32f2f";
    }
  };

  return (
    <div style={{ width: "100%", height: 460, borderRadius: 12, overflow: "hidden" }}>
      <MapContainer center={center} zoom={13} style={{ width: "100%", height: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />

        {points.map((p) => {
          const color = colorByStatus(p.status);
          return (
            <CircleMarker
              key={p.id}
              center={[p.lat, p.lng]}
              radius={10}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.7, weight: 2 }}
              eventHandlers={{
                mouseover: (e) => e.target.openTooltip(),
                mouseout:  (e) => e.target.closeTooltip(),
              }}
            >
              {/* Tooltip al pasar el mouse */}
              <Tooltip direction="top" offset={[0, -8]} opacity={0.95} sticky>
                <Typography variant="body2" fontWeight={600}>
                  {p.name}
                </Typography>
              </Tooltip>

              {/* Popup con tarjeta MUI */}
              <Popup maxWidth={260} minWidth={200}>
  <Card
    sx={{
      width: 220,      // ancho fijo compacto
      height: "auto",  // se ajusta según contenido
    }}
  >
    {p.img && (
      <CardMedia
        component="img"
        image={p.img}
        alt={p.name}
        sx={{
          height: 100,          // altura fija para la imagen
          objectFit: "cover",   // que no se deforme
        }}
      />
    )}
    <CardContent sx={{ p: 1 }}>
      <Typography variant="subtitle2" fontWeight={600} noWrap>
        {p.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" noWrap>
        {p.address || "Sin dirección"}
      </Typography>
      <Typography
        variant="body2"
        sx={{ mt: 0.5 }}
        color={color}
        fontWeight={600}
      >
        Estado: {p.status}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {p.lat.toFixed(4)}, {p.lng.toFixed(4)}
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <Button
          variant="outlined"
          size="small"
          sx={{ flex: 1, fontSize: "0.7rem" }}
          href={`https://www.google.com/maps?q=${p.lat},${p.lng}`}
          target="_blank"
        >
          Maps
        </Button>
        <Button
          variant="outlined"
          size="small"
          sx={{ flex: 1, fontSize: "0.7rem" }}
          onClick={() => alert(`Detalle de ${p.name}`)}
        >
          Detalle
        </Button>
      </Stack>
    </CardContent>
  </Card>
</Popup>

            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
