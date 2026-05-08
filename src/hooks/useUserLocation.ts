import { useCallback, useEffect, useState } from 'react';
import { FALLBACK_LOCATION } from '../data/mockHazards';

type LocationSource = 'browser' | 'fallback';

interface UserLocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
  source: LocationSource | null;
}

const initialState: UserLocationState = {
  latitude: null,
  longitude: null,
  accuracy: null,
  loading: true,
  error: null,
  source: null,
};

function getGeolocationErrorMessage(error: GeolocationPositionError) {
  switch (error.code) {
    case 1:
      return 'Location permission denied. Please allow location access in your browser.';
    case 2:
      return 'Position unavailable. Check Windows location services or browser permissions.';
    case 3:
      return 'Location request timed out. Try again.';
    default:
      return error.message || 'Unable to detect your current location.';
  }
}

export function useUserLocation() {
  const [state, setState] = useState<UserLocationState>(initialState);

  const requestLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setState({
        latitude: FALLBACK_LOCATION.latitude,
        longitude: FALLBACK_LOCATION.longitude,
        accuracy: null,
        loading: false,
        error: 'Geolocation is not supported in this browser. Showing demo location.',
        source: 'fallback',
      });
      return;
    }

    setState((current) => ({
      ...current,
      loading: true,
      error: null,
    }));

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setState({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy ?? null,
          loading: false,
          error: null,
          source: 'browser',
        });
      },
      (error) => {
        setState({
          latitude: FALLBACK_LOCATION.latitude,
          longitude: FALLBACK_LOCATION.longitude,
          accuracy: null,
          loading: false,
          error: getGeolocationErrorMessage(error),
          source: 'fallback',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    ...state,
    requestLocation,
  };
}
