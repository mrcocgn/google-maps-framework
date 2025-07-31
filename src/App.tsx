import { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

import ZoomInButton from './buttons/ZoomInButton';
import ZoomOutButton from './buttons/ZoomOutButton';
import CenterUserButton from './buttons/CenterUserButton';
import ToggleMapTypeButton from './buttons/ToggleMapTypeButton';

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const defaultCenter = {
  lat: 50.9375, // Köln (Fallback)
  lng: 6.9603
};

function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [center, setCenter] = useState(defaultCenter);
  const [userPosition, setUserPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCenter(coords);
          setUserPosition(coords);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

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
          disableDoubleClickZoom: false
        }}
      >
        {/* ✅ Sichtbarer Marker für Benutzer */}
        {userPosition && (
          <Marker
            position={userPosition}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new window.google.maps.Size(30, 30)
            }}
          />
        )}

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
