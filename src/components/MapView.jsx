import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/MapView.css';

const MapView = ({ latitude, longitude, countryName }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    // Check if coordinates are valid
    if (!latitude || !longitude) {
      setMapError('Coordinates not available for this country');
      return;
    }

    // Create map if it hasn't been initialized
    if (!mapRef.current && mapContainerRef.current) {
      try {
        // Check if mapboxgl is available from window global
        if (window.mapboxgl) {
          const mapboxgl = window.mapboxgl;
          
          // Set your access token - using a fallback for development
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
            
          // Clear any previous errors
          setMapError(null);
        } else {
          // Mapbox not loaded
          setMapError('Interactive map not available');
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Could not load the map');
      }
    } else if (mapRef.current && markerRef.current) {
      try {
        // Update map and marker if they already exist
        mapRef.current.setCenter([longitude, latitude]);
        markerRef.current
          .setLngLat([longitude, latitude])
          .setPopup(new window.mapboxgl.Popup({ offset: 25 }).setText(countryName));
        
        // Clear any previous errors
        setMapError(null);
      } catch (error) {
        console.error('Error updating map:', error);
        setMapError('Could not update the map');
      }
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
      {mapError ? (
        <div className="map-fallback">
          <p className="map-error">{mapError}</p>
          <div className="static-map">
            <div className="map-placeholder">
              <h3>{countryName}</h3>
              {latitude && longitude && (
                <p className="coordinates">Coordinates: {latitude.toFixed(2)}°, {longitude.toFixed(2)}°</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div ref={mapContainerRef} className="map-container-inner" />
          <div className="map-overlay">
            <p className="map-coordinates">
              {latitude && longitude ? `${latitude.toFixed(2)}° N, ${longitude.toFixed(2)}° E` : 'Coordinates not available'}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

MapView.propTypes = {
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  countryName: PropTypes.string.isRequired
};

export default MapView; 