import { useState } from 'react';

interface Props {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
}

function ToggleMapTypeButton({ mapRef }: Props) {
  const [isSatellite, setIsSatellite] = useState(false);

  const handleClick = () => {
    const map = mapRef.current;
    if (map) {
      const next = isSatellite ? 'roadmap' : 'satellite';
      map.setMapTypeId(next);
      setIsSatellite(!isSatellite);
    }
  };

  return (
    <button className="map-button toggle" onClick={handleClick}>
      {isSatellite ? '🗺️' : '🛰️'}
    </button>
  );
}

export default ToggleMapTypeButton;
