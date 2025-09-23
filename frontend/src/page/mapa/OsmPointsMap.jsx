// OsmPointsMap.jsx
import { MapContainer, TileLayer, Popup, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef } from "react";

/**
 * points: Array<{
 *   id: string|number,
 *   lat: number,
 *   lng: number,
 *   name?: string,
 *   address?: string,
 *   status?: "activo" | "inactivo" | "nuevo" | string
 * }>
 * initialCenter: [lat, lng]
 * autoFit: boolean (si true, ajusta el mapa para ver todos los puntos)
 */
export default function OsmPointsMap({
  points = [],
  initialCenter = [-4.3282766, -79.5570572], // Loja
  zoom = 13,
  autoFit = true,
  height = 420,
}) {
  const mapRef = useRef(null);

  // Bounds a partir de todos los puntos
  const bounds = useMemo(() => {
    if (!points.length) return null;
    const latlngs = points.map(p => [p.lat, p.lng]);
    // Evita errores si hay puntos inválidos
    return latlngs.every(([a,b]) => Number.isFinite(a) && Number.isFinite(b))
      ? latlngs
      : null;
  }, [points]);

  // Fit a los puntos cuando cambian
  useEffect(() => {
    const map = mapRef.current;
    if (map && autoFit && bounds && bounds.length > 0) {
      // padding para que no queden pegados a los bordes
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [bounds, autoFit]);

  // Colores por estado (ajusta a tu gusto)
  const getColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "activo":   return "#2e7d32";
      case "nuevo":    return "#1976d2";
      case "inactivo": return "#9e9e9e";
      default:         return "#d32f2f"; // otros/pendiente
    }
  };

  return (
    <div style={{ width: "100%", height, borderRadius: 12, overflow: "hidden" }}>
      <MapContainer
        center={initialCenter}
        zoom={zoom}
        style={{ width: "100%", height: "100%" }}
        whenCreated={(map) => (mapRef.current = map)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />

        {points.map((p) => (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lng]}
            radius={10}
            pathOptions={{ color: getColor(p.status), weight: 2, fillOpacity: 0.6 }}
          >
            {/* Tooltip al pasar el mouse (no hace click) */}
            <Tooltip direction="top" offset={[0, -6]} opacity={0.9}>
              {p.name || "Punto de venta"}
            </Tooltip>

            {/* Popup al hacer click */}
            <Popup>
              <div style={{ minWidth: 180 }}>
                <strong>{p.name || "Punto de venta"}</strong>
                {p.address ? <div style={{ marginTop: 4 }}>{p.address}</div> : null}
                {p.status ? (
                  <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>
                    Estado: <b style={{ color: getColor(p.status) }}>{p.status}</b>
                  </div>
                ) : null}
                <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>
                  ({p.lat.toFixed(6)}, {p.lng.toFixed(6)})
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
