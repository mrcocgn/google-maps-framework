interface Props {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
}

function ZoomOutButton({ mapRef }: Props) {
  const handleClick = () => {
    const map = mapRef.current;
    const currentZoom = map?.getZoom();
    if (map && typeof currentZoom === 'number') {
      map.setZoom(currentZoom - 1);
    }
  };

  return (
    <button className="map-button out" onClick={handleClick}>
      ➖
    </button>
  );
}

export default ZoomOutButton;
