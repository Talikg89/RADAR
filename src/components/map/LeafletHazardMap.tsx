import { useEffect } from 'react';
import L from 'leaflet';
import { Circle, MapContainer, Marker, Popup, Polyline, TileLayer, useMap } from 'react-leaflet';
import type { Hazard } from '../../types/hazard';

const createMarker = (color: string) =>
  L.divIcon({
    className: '',
    html: `<div class="map-pin" style="--pin-color:${color}"><span></span></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });

const userMarker = createMarker('#6fffd2');

const severityColor: Record<Hazard['severity'], string> = {
  low: '#6fffd2',
  medium: '#4bd6ff',
  high: '#ff7a59',
};

interface LeafletHazardMapProps {
  hazards: Hazard[];
  routeCoordinates: [number, number][];
  userPosition: [number, number];
}

function RecenterMap({ center }: { center: { latitude: number; longitude: number } }) {
  const map = useMap();

  useEffect(() => {
    map.setView([center.latitude, center.longitude], 15, {
      animate: true,
      duration: 1.2,
    });
  }, [center.latitude, center.longitude, map]);

  return null;
}

export function LeafletHazardMap({ hazards, routeCoordinates, userPosition }: LeafletHazardMapProps) {
  const center = { latitude: userPosition[0], longitude: userPosition[1] };

  return (
    <MapContainer center={userPosition} zoom={15} scrollWheelZoom className="leaflet-map">
      <RecenterMap center={center} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <Circle center={userPosition} radius={900} pathOptions={{ className: 'user-radius user-radius--outer' }} />
      <Circle center={userPosition} radius={420} pathOptions={{ className: 'user-radius user-radius--pulse' }} />
      <Marker position={userPosition} icon={userMarker}>
        <Popup>You are here</Popup>
      </Marker>

      <Polyline positions={[userPosition, ...routeCoordinates]} pathOptions={{ className: 'route-line route-line--glow' }} />
      <Polyline positions={[userPosition, ...routeCoordinates]} pathOptions={{ className: 'route-line route-line--pulse' }} />

      {hazards.map((hazard) => (
        <Marker
          key={hazard.id}
          position={[hazard.latitude, hazard.longitude]}
          icon={createMarker(severityColor[hazard.severity])}
        >
          <Popup>
            <strong>{hazard.title}</strong>
            <br />
            {hazard.description}
            <br />
            {hazard.distance.toFixed(1)} km away • {hazard.severity}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
