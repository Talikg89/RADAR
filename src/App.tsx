import { useMemo } from 'react';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { MapView } from './components/map/MapView';
import { generateMockHazardsAroundUser, generateRouteAroundUser } from './data/mockHazards';
import { useUserLocation } from './hooks/useUserLocation';

function App() {
  const { latitude, longitude, accuracy, loading, error, source, requestLocation } = useUserLocation();

  const userPosition = latitude !== null && longitude !== null ? ([latitude, longitude] as [number, number]) : null;

  const hazards = useMemo(() => {
    if (!userPosition) {
      return [];
    }

    return generateMockHazardsAroundUser(userPosition[0], userPosition[1]);
  }, [userPosition]);

  const routeCoordinates = useMemo(() => {
    if (!userPosition) {
      return [];
    }

    return generateRouteAroundUser(userPosition[0], userPosition[1]);
  }, [userPosition]);

  const locationNotice = loading
    ? 'Requesting browser location access...'
    : source === 'browser'
      ? `Location source: Browser GPS — ${latitude?.toFixed(5)}, ${longitude?.toFixed(5)}, accuracy ${Math.round(accuracy ?? 0)}m`
      : `Location source: Fallback demo location — ${latitude?.toFixed(5)}, ${longitude?.toFixed(5)}${error ? ` — ${error}` : ''}`;

  return (
    <ErrorBoundary
      fallback={
        <div className="app-fallback">
          <div className="glass-card app-fallback__card">
            <p className="eyebrow">DriveRadar recovery mode</p>
            <h2>Something failed while loading the map.</h2>
            <p>Refresh the page or restart the dev server to try again.</p>
          </div>
        </div>
      }
    >
      <div className="app-shell app-shell--map-only">
        <div className="background-grid" />
        <main className="content content--map-only">
          <MapView
            hazards={hazards}
            routeCoordinates={routeCoordinates}
            userPosition={userPosition}
          />
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
