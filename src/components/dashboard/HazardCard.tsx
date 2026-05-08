import {
  AlertTriangle,
  Construction,
  Route,
  Siren,
  TrafficCone,
  TriangleAlert,
} from 'lucide-react';
import type { Hazard, HazardType } from '../../types/hazard';

const iconMap: Record<HazardType, typeof AlertTriangle> = {
  accident: Siren,
  'road works': Construction,
  pothole: TriangleAlert,
  'traffic jam': Route,
  'vehicle stopped': TrafficCone,
  'dangerous curve': AlertTriangle,
};

interface HazardCardProps {
  hazard: Hazard;
}

export function HazardCard({ hazard }: HazardCardProps) {
  const Icon = iconMap[hazard.type];

  return (
    <article className="hazard-card glass-card">
      <div className="hazard-card__head">
        <div className={`hazard-icon severity-${hazard.severity}`}>
          <Icon size={18} />
        </div>
        <div>
          <p className="hazard-card__type">{hazard.type}</p>
          <h4>{hazard.title}</h4>
        </div>
        <span className={`severity-pill severity-pill--${hazard.severity}`}>{hazard.severity}</span>
      </div>

      <p className="hazard-card__description">{hazard.description}</p>

      <div className="hazard-card__meta">
        <span>{hazard.distance.toFixed(1)} km away</span>
        <span>{hazard.timestamp}</span>
      </div>
    </article>
  );
}
