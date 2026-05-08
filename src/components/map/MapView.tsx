import { lazy, Suspense, useEffect, useState } from 'react';
import type { Hazard } from '../../types/hazard';
import { ErrorBoundary } from '../common/ErrorBoundary';

const LeafletHazardMap = lazy(async () => {
  const module = await import('./LeafletHazardMap');
  return { default: module.LeafletHazardMap };
});

interface MapViewProps {
  hazards: Hazard[];
  routeCoordinates: [number, number][];
  userPosition: [number, number] | null;
}

function MapFallback({ title, description, loading = false }: { title: string; description: string; loading?: boolean }) {
  return (
    <div className={`map-fallback ${loading ? 'map-fallback--loading' : ''}`}>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
}

export function MapView({ hazards, routeCoordinates, userPosition }: MapViewProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="map-shell map-shell--raw" id="map">
      <div className="map-frame map-frame--raw">
        <ErrorBoundary
          fallback={
            <MapFallback
              title="Map couldn't initialize."
              description="Refresh the page or restart the dev server to try again."
            />
          }
        >
          {!isClient || !userPosition ? (
            <MapFallback
              loading
              title="Waiting for current location..."
              description="Requesting browser location before loading the map."
            />
          ) : (
            <Suspense
              fallback={
                <MapFallback
                  loading
                  title="Loading map..."
                  description="Syncing live map tiles and nearby hazards."
                />
              }
            >
              <LeafletHazardMap hazards={hazards} routeCoordinates={routeCoordinates} userPosition={userPosition} />
            </Suspense>
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
}
