import { Activity, Gauge, LocateFixed, ShieldAlert, Sparkles } from 'lucide-react';
import type { Hazard } from '../../types/hazard';
import { StatCard } from './StatCard';

interface RadarDisplayProps {
  hazards: Hazard[];
  liveMode: boolean;
  riskScore: number;
  areaLabel: string;
  areaDetail: string;
  locationDebug: string;
  onRequestLocation: () => void;
}

const radarDots = [
  { top: '20%', left: '64%', size: 'lg' },
  { top: '30%', left: '28%', size: 'sm' },
  { top: '50%', left: '76%', size: 'md' },
  { top: '61%', left: '39%', size: 'lg' },
  { top: '70%', left: '63%', size: 'sm' },
  { top: '42%', left: '18%', size: 'md' },
];

export function RadarDisplay({
  hazards,
  liveMode,
  riskScore,
  areaLabel,
  areaDetail,
  locationDebug,
  onRequestLocation,
}: RadarDisplayProps) {
  const highSeverityCount = hazards.filter((hazard) => hazard.severity === 'high').length;

  return (
    <section className="hero-section" id="dashboard">
      <div className="hero-copy">
        <p className="eyebrow">Real-time road intelligence</p>
        <h2>See risk patterns before they become your next hard brake.</h2>
        <p className="hero-copy__body">
          DriveRadar fuses live-style community alerts, AI risk signals, and a tactical scan interface into one focused safety view.
        </p>

        <div className="hero-copy__status glass-card">
          <div className="status-dot" />
          <span>Scanning nearby hazards...</span>
          <strong>{liveMode ? 'Live telemetry synchronized' : 'Demo simulation active'}</strong>
        </div>

        <div className="stats-grid">
          <StatCard title="Current speed" value="58 mph" detail="Adaptive cruise stable" icon={<Gauge size={20} />} />
          <StatCard
            title="Road risk score"
            value={`${riskScore}/100`}
            detail={`${highSeverityCount} critical alerts nearby`}
            icon={<ShieldAlert size={20} />}
            accent="cyan"
          />
          <StatCard
            title="Current area"
            value={areaLabel}
            detail={areaDetail}
            icon={<Activity size={20} />}
            accent="amber"
            action={
              <button type="button" className="chip chip--compact" onClick={onRequestLocation}>
                <LocateFixed size={14} />
                Use my current location
              </button>
            }
          />
        </div>

        <div className="location-debug glass-card">
          <p className="eyebrow">Location status</p>
          <span>{locationDebug}</span>
        </div>
      </div>

      <div className="radar-shell glass-card">
        <div className="radar-header">
          <div>
            <p className="eyebrow">Threat Radar</p>
            <h3>360° hazard sweep</h3>
          </div>
          <div className="chip chip--ghost">
            <Sparkles size={16} />
            AI calibrated
          </div>
        </div>

        <div className="radar">
          <div className="radar__ring radar__ring--outer" />
          <div className="radar__ring radar__ring--mid" />
          <div className="radar__ring radar__ring--inner" />
          <div className="radar__crosshair radar__crosshair--horizontal" />
          <div className="radar__crosshair radar__crosshair--vertical" />
          <div className="radar__beam" />
          {radarDots.map((dot, index) => (
            <span
              key={`${dot.top}-${dot.left}-${index}`}
              className={`radar__dot radar__dot--${dot.size}`}
              style={{ top: dot.top, left: dot.left }}
            />
          ))}
          <div className="radar__core">
            <span>{hazards.length}</span>
            hazards
          </div>
        </div>
      </div>
    </section>
  );
}
