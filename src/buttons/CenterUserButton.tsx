interface Props {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
}

function CenterUserButton({ mapRef }: Props) {
  const handleClick = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        const map = mapRef.current;
        if (map) {
          map.panTo(coords);
          map.setZoom(14);
        }
      },
      (err) => console.error("Geolocation error", err)
    );
  };

  return (
    <button className="map-button center" onClick={handleClick}>
      📍
    </button>
  );
}

export default CenterUserButton;
