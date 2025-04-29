import React, { useState, useEffect, useCallback } from 'react';
import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps';
import { useAppSelector } from '@/store/reduxHooks';
import { useDispatch } from 'react-redux';
import { selectDiscovery } from '@/store/discovery';
import Pin from './pin';

const containerStyle = {
  width: '100%',
  height: '80vh',
};

const center = {
  lat: 22.0,
  lng: 80.0,
};

const RETRY_INTERVAL = 2500; // Retry interval in milliseconds

const IndiaMap = ({ data }) => {
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(Date.now()); // Key to force re-render
  const dispatch = useDispatch();

  // Redux selector
  const discovery = useAppSelector((state) => state.discovery.discoverySelected);

  // Handle Marker click
  const handleMarkerClick = (d) => {
    dispatch(selectDiscovery(d));
  };
  useEffect(() => {
    dispatch(selectDiscovery({}))
  }, [])

  // Function to load Google Maps script
  const loadGoogleMapsScript = useCallback(() => {
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.google && window.google.maps) {
          setIsGoogleMapsLoaded(true);
          setError(null);
        }
      };

      script.onerror = () => {
        setError('Failed to load Google Maps script.');
        setIsGoogleMapsLoaded(false);
      };

      document.head.appendChild(script);
    } else if (window.google && window.google.maps) {
      setIsGoogleMapsLoaded(true);
      setError(null);
    }
  }, []);

  // Retry mechanism
  const retryLoadMap = useCallback(() => {
    if (!isGoogleMapsLoaded && error) {
      setTimeout(() => {
        setRetryKey(Date.now()); // Change the key to force reload
        loadGoogleMapsScript();
      }, RETRY_INTERVAL);
    }
  }, [isGoogleMapsLoaded, error, loadGoogleMapsScript]);

  // Use Effect to load the script and retry if necessary
  useEffect(() => {
    loadGoogleMapsScript(); // Initial load of the Google Maps script
    retryLoadMap(); // Retry if script loading fails
  }, [retryLoadMap, loadGoogleMapsScript]);

  useEffect(() => {

    if (discovery.id) {

      let markers = document.querySelectorAll('.custom-map-marker')
      markers.forEach((marker) => {
        marker.style.opacity = '0.35';
        marker.style.pointerEvents = 'none';
      });
      let id = `${discovery.coordinates[0]}-${discovery.coordinates[1]}`
      let customMarkers = document.getElementsByClassName(id)

      Array.from(customMarkers).forEach((marker) => {
        marker.style.opacity = '1';
        marker.style.pointerEvents = 'auto';
      });
    } else {
      // dispatch(selectDiscovery({}))

      let markers = document.querySelectorAll('.custom-map-marker')
      markers.forEach((marker) => {
        marker.style.opacity = '1';
        marker.style.pointerEvents = 'auto';
      });
    }

  }, [discovery])

  if (error) {
    return <div>Error loading Google Maps: {error}</div>;
  }

  return (
    <div style={containerStyle}>
      {isGoogleMapsLoaded && (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
          <Map defaultCenter={center} defaultZoom={5} mapId="YOUR_MAP_ID_HERE">
            {data &&
              data.map((d, index) => (
                <AdvancedMarker
                  key={index}
                  title={`${d.coordinates[0]}-${d.coordinates[1]}`}
                  position={{ lat: d.coordinates[1], lng: d.coordinates[0] }}
                  onClick={() => handleMarkerClick(d)}
                  icon={{
                    url: '/images/locationn.png',
                    opacity: '1',

                  }}
                  style={{
                    width: '18px',
                    height: '20px',
                    cursor: 'pointer',
                  }}
                  className={`custom-map-marker ${d.coordinates[0]}-${d.coordinates[1]}`}

                >
                  <Pin />
                </AdvancedMarker>
              ))}
          </Map>
        </APIProvider>
      )}
    </div>
  );
};

export default IndiaMap;
