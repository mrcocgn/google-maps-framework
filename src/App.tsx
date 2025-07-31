import { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

import ZoomInButton from './buttons/ZoomInButton';
import ZoomOutButton from './buttons/ZoomOutButton';
import CenterUserButton from './buttons/CenterUserButton';
import ToggleMapTypeButton from './buttons/ToggleMapTypeButton';

const containerStyle = {
  width: '100vw',
  height: '100vh',
};

const defaultCenter = {
  lat: 50.9375, // Köln (Fallback)
  lng: 6.9603,
};

type Ship = {
  mmsi: string;
  lat: number;
  lon: number;
  name: string;
};

function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const aisApiKey = import.meta.env.VITE_AISSTREAM_API_KEY;

  const [center, setCenter] = useState(defaultCenter);
  const [userPosition, setUserPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [ships, setShips] = useState<Ship[]>([]);
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(coords);
          setUserPosition(coords);
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`wss://stream.aisstream.io/v0/stream?token=${aisApiKey}`);

    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);

        if (parsed.meta?.message_type === 'position_report' && Array.isArray(parsed.data?.vessels)) {
          const newShips: Ship[] = parsed.data.vessels.map((vessel: any) => ({
            mmsi: vessel.mmsi,
            lat: vessel.lat,
            lon: vessel.lon,
            name: vessel.shipname || 'Unbekannt',
          }));

          setShips((prev) => {
            const map = new Map(prev.map((s) => [s.mmsi, s]));
            newShips.forEach((ship) => map.set(ship.mmsi, ship));
            return Array.from(map.values());
          });
        }
      } catch (err) {
        console.error('Fehler beim Parsen von AIS-Daten:', err);
      }
    };

    return () => {
      // Check if the socket is open before closing it
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [aisApiKey]);

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={(map) => {
          mapRef.current = map;
        }}
        options={{
          disableDefaultUI: true,
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          rotateControl: false,
          scaleControl: false,
          gestureHandling: 'greedy',
          scrollwheel: true,
          disableDoubleClickZoom: false,
        }}
      >
        {/* ✅ Benutzer-Position */}
        {userPosition && (
          <Marker
            position={userPosition}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />
        )}

        {/* ✅ Schiff-Positionen */}
        {ships.map((ship: Ship) => (
          <Marker
            key={ship.mmsi}
            position={{ lat: ship.lat, lng: ship.lon }}
            label={ship.name}
            icon={{
              url: '/icons/ship.svg', // muss in public/icons/ship.svg vorhanden sein
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />
        ))}

        {/* ✅ UI-Buttons */}
        <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 100 }}>
          <ZoomInButton mapRef={mapRef} />
          <ZoomOutButton mapRef={mapRef} />
          <ToggleMapTypeButton mapRef={mapRef} />
          <CenterUserButton mapRef={mapRef} />
        </div>
      </GoogleMap>
    </LoadScript>
  );
}

export default App;
