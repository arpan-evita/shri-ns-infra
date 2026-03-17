import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet + React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapSelectorProps {
  value?: { lat: number; lng: number };
  onChange?: (value: { lat: number; lng: number }) => void;
}

const MapEvents = ({ onLocationSelect }: { onLocationSelect: (latlng: L.LatLng) => void }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
};

const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
};

const MapSelector = ({ value, onChange }: MapSelectorProps) => {
  const [position, setPosition] = useState<[number, number]>(
    value ? [value.lat, value.lng] : [28.6139, 77.209] // Default New Delhi
  );

  useEffect(() => {
    if (value && (value.lat !== position[0] || value.lng !== position[1])) {
      setPosition([value.lat, value.lng]);
    }
  }, [value]);

  const handleLocationSelect = (latlng: L.LatLng) => {
    const newPos: [number, number] = [latlng.lat, latlng.lng];
    setPosition(newPos);
    onChange?.({ lat: latlng.lat, lng: latlng.lng });
  };

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-white/10">
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={position} />
        <MapEvents onLocationSelect={handleLocationSelect} />
        <Marker position={position} />
      </MapContainer>
      <div className="bg-white/5 p-4 text-[10px] uppercase font-black tracking-widest text-slate-500 text-center border-t border-white/5">
        Click on the map to place a pin and update coordinates
      </div>
    </div>
  );
};

export default MapSelector;
