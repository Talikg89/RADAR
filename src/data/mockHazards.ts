import type { DriverMetric, Hazard, HazardType, Severity } from '../types/hazard';

export const FALLBACK_LOCATION = {
  latitude: 32.0853,
  longitude: 34.7818,
};

const hazardTemplates: Array<{
  type: HazardType;
  title: string;
  description: string;
  severity: Severity;
  distanceKm: number;
  bearing: number;
  timestamp: string;
}> = [
  {
    type: 'accident',
    title: 'Multi-vehicle collision reported',
    description: 'Emergency response activity ahead with lane compression.',
    severity: 'high',
    distanceKm: 0.35,
    bearing: 18,
    timestamp: '2 min ago',
  },
  {
    type: 'road works',
    title: 'Active resurfacing zone',
    description: 'Temporary barriers and narrowed lanes reducing flow.',
    severity: 'medium',
    distanceKm: 0.7,
    bearing: 74,
    timestamp: '9 min ago',
  },
  {
    type: 'pothole',
    title: 'Pothole cluster reported',
    description: 'Drivers flagged repeated wheel impacts near the curb lane.',
    severity: 'medium',
    distanceKm: 1.1,
    bearing: 126,
    timestamp: '12 min ago',
  },
  {
    type: 'traffic jam',
    title: 'Stop-and-go traffic wave',
    description: 'Congestion pulse building near the next arterial merge.',
    severity: 'high',
    distanceKm: 1.5,
    bearing: 167,
    timestamp: '4 min ago',
  },
  {
    type: 'vehicle stopped',
    title: 'Vehicle stopped on shoulder',
    description: 'Disabled vehicle close to merge point. Expect evasive lane changes.',
    severity: 'high',
    distanceKm: 1.8,
    bearing: 219,
    timestamp: '7 min ago',
  },
  {
    type: 'dangerous curve',
    title: 'Reduced-visibility curve',
    description: 'Sharp bend with low sight distance and unstable approach speeds.',
    severity: 'medium',
    distanceKm: 2.1,
    bearing: 258,
    timestamp: '15 min ago',
  },
  {
    type: 'pothole',
    title: 'Surface break detected',
    description: 'Fresh road cavity flagged after recent traffic loading.',
    severity: 'low',
    distanceKm: 2.6,
    bearing: 305,
    timestamp: '24 min ago',
  },
  {
    type: 'road works',
    title: 'Utility crew activity',
    description: 'Short-duration drilling and cones partially blocking the lane.',
    severity: 'low',
    distanceKm: 2.95,
    bearing: 340,
    timestamp: '29 min ago',
  },
];

export const driverMetrics: DriverMetric[] = [
  { label: 'Harsh braking', value: '02', trend: '-18% this week', tone: 'low' },
  { label: 'Sharp turns', value: '05', trend: 'Smooth cornering', tone: 'low' },
  { label: 'Speeding', value: '11%', trend: 'Down 4% vs yesterday', tone: 'medium' },
  { label: 'Driving time', value: '1h 42m', trend: 'Healthy break window', tone: 'low' },
];

const EARTH_RADIUS_KM = 6371;

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function toDegrees(value: number) {
  return (value * 180) / Math.PI;
}

export function calculateDistanceKm(
  fromLatitude: number,
  fromLongitude: number,
  toLatitude: number,
  toLongitude: number,
) {
  const dLatitude = toRadians(toLatitude - fromLatitude);
  const dLongitude = toRadians(toLongitude - fromLongitude);
  const startLatitude = toRadians(fromLatitude);
  const endLatitude = toRadians(toLatitude);

  const a =
    Math.sin(dLatitude / 2) * Math.sin(dLatitude / 2) +
    Math.sin(dLongitude / 2) * Math.sin(dLongitude / 2) * Math.cos(startLatitude) * Math.cos(endLatitude);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

function projectCoordinate(latitude: number, longitude: number, distanceKm: number, bearingDegrees: number) {
  const angularDistance = distanceKm / EARTH_RADIUS_KM;
  const bearing = toRadians(bearingDegrees);
  const latitudeRad = toRadians(latitude);
  const longitudeRad = toRadians(longitude);

  const targetLatitude = Math.asin(
    Math.sin(latitudeRad) * Math.cos(angularDistance) +
      Math.cos(latitudeRad) * Math.sin(angularDistance) * Math.cos(bearing),
  );

  const targetLongitude =
    longitudeRad +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(latitudeRad),
      Math.cos(angularDistance) - Math.sin(latitudeRad) * Math.sin(targetLatitude),
    );

  return {
    latitude: Number(toDegrees(targetLatitude).toFixed(6)),
    longitude: Number(toDegrees(targetLongitude).toFixed(6)),
  };
}

export function generateMockHazardsAroundUser(latitude: number, longitude: number): Hazard[] {
  return hazardTemplates
    .map((template, index) => {
      const point = projectCoordinate(latitude, longitude, template.distanceKm, template.bearing);
      const distance = calculateDistanceKm(latitude, longitude, point.latitude, point.longitude);

      return {
        id: `hz-${String(index + 1).padStart(3, '0')}`,
        type: template.type,
        title: template.title,
        description: template.description,
        latitude: point.latitude,
        longitude: point.longitude,
        distance: Number(distance.toFixed(2)),
        severity: template.severity,
        timestamp: template.timestamp,
      };
    })
    .sort((left, right) => left.distance - right.distance);
}

export function generateRouteAroundUser(latitude: number, longitude: number): [number, number][] {
  const routePattern = [
    { distanceKm: 0.25, bearing: 315 },
    { distanceKm: 0.45, bearing: 340 },
    { distanceKm: 0.7, bearing: 12 },
    { distanceKm: 1.05, bearing: 38 },
    { distanceKm: 1.35, bearing: 64 },
    { distanceKm: 1.7, bearing: 92 },
  ];

  return routePattern.map(({ distanceKm, bearing }) => {
    const point = projectCoordinate(latitude, longitude, distanceKm, bearing);
    return [point.latitude, point.longitude];
  });
}

export function calculateRiskScore(hazards: Hazard[]) {
  if (hazards.length === 0) {
    return 8;
  }

  const score = hazards.reduce((total, hazard) => {
    const severityWeight = hazard.severity === 'high' ? 20 : hazard.severity === 'medium' ? 12 : 6;
    const proximityWeight = Math.max(0.45, 1.45 - hazard.distance / 3.2);
    return total + severityWeight * proximityWeight;
  }, 6);

  return Math.max(0, Math.min(100, Math.round(score)));
}
