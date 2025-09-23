// MapboxView.jsx
import Map, { Marker, Popup } from "react-map-gl";

export default function ProMap() {
  const lat = -4.3282766, lng = -79.5570572;
  
  return (
    <div style={{ width: "100%", height: 420 }}>
      <Map
        initialViewState={{ longitude: lng, latitude: lat, zoom: 13 }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%", borderRadius: 12 }}
      >
        <Marker longitude={lng} latitude={lat} />
        <Popup longitude={lng} latitude={lat} closeButton closeOnMove>
          ¡Hola Mapbox!
        </Popup>
      </Map>
    </div>
  );
}
