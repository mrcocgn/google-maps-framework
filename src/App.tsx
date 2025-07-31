import { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

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
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
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
          disableDefaultUI: true, // Deaktiviert alle Standard-Buttons
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          rotateControl: false,
          scaleControl: false,
          gestureHandling: 'greedy'
        }}
      >
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
