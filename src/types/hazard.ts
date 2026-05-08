export type HazardType =
  | 'accident'
  | 'road works'
  | 'pothole'
  | 'traffic jam'
  | 'vehicle stopped'
  | 'dangerous curve';

export type Severity = 'low' | 'medium' | 'high';

export interface Hazard {
  id: string;
  type: HazardType;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  distance: number;
  severity: Severity;
  timestamp: string;
}

export interface DriverMetric {
  label: string;
  value: string;
  trend: string;
  tone: Severity;
}
