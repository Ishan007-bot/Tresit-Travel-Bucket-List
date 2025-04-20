import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const MapView = ({ latitude, longitude, countryName }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // Check if coordinates are valid
    if (!latitude || !longitude) {
      return;
    }

    // Create map if it hasn't been initialized
    if (!mapRef.current && mapContainerRef.current) {
      // Check if mapboxgl is available from window global
      if (window.mapboxgl) {
        const mapboxgl = window.mapboxgl;
        
        // Set your access token
        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
        
        // Initialize map
        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [longitude, latitude],
          zoom: 3
        });

        // Add navigation control
        mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add marker
        markerRef.current = new mapboxgl.Marker()
          .setLngLat([longitude, latitude])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(countryName))
          .addTo(mapRef.current);
      } else {
        // Fallback for when Mapbox is not available
        const fallbackDiv = document.createElement('div');
        fallbackDiv.className = 'map-fallback';
        fallbackDiv.innerHTML = `
          <p>Map not available</p>
          <p>Coordinates: ${latitude}, ${longitude}</p>
          <p>${countryName}</p>
        `;
        mapContainerRef.current.appendChild(fallbackDiv);
      }
    } else if (mapRef.current && markerRef.current) {
      // Update map and marker if they already exist
      mapRef.current.setCenter([longitude, latitude]);
      markerRef.current
        .setLngLat([longitude, latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(countryName));
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [latitude, longitude, countryName]);

  return (
    <div className="map-view">
      <div ref={mapContainerRef} className="map-container-inner" />
      <div className="map-overlay">
        <p className="map-coordinates">
          {latitude && longitude ? `${latitude.toFixed(2)}° N, ${longitude.toFixed(2)}° E` : 'Coordinates not available'}
        </p>
      </div>
    </div>
  );
};

MapView.propTypes = {
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  countryName: PropTypes.string.isRequired
};

export default MapView; 