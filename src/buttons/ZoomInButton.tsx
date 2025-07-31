interface Props {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
}

function ZoomInButton({ mapRef }: Props) {
  const handleClick = () => {
    const map = mapRef.current;
    const currentZoom = map?.getZoom();
    if (map && typeof currentZoom === 'number') {
      map.setZoom(currentZoom + 1);
    }
  };

  return (
    <button className="map-button in" onClick={handleClick}>
      ➕
    </button>
  );
}

export default ZoomInButton;
