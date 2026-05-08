import { BrainCircuit, TimerReset } from 'lucide-react';
import type { DriverMetric } from '../../types/hazard';

interface SafetyScoreProps {
  metrics: DriverMetric[];
}

export function SafetyScore({ metrics }: SafetyScoreProps) {
  return (
    <section className="analytics-grid" id="analytics">
      <article className="glass-card analytics-score">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Safety analytics</p>
            <h3>Driver safety score</h3>
          </div>
          <div className="score-ring">
            <span>87</span>
          </div>
        </div>

        <p className="analytics-copy">
          Your trend remains in the premium safety band. Braking consistency and route anticipation improved over the last 24 hours.
        </p>

        <div className="metric-grid">
          {metrics.map((metric) => (
            <article key={metric.label} className={`metric-card metric-card--${metric.tone}`}>
              <p>{metric.label}</p>
              <h4>{metric.value}</h4>
              <span>{metric.trend}</span>
            </article>
          ))}
        </div>
      </article>

      <article className="glass-card insight-card">
        <div className="insight-card__icon">
          <BrainCircuit size={20} />
        </div>
        <p className="eyebrow">AI insight</p>
        <h3>Increased braking detected near your route.</h3>
        <p>
          AI detected increased braking patterns near this area. Drive carefully and maintain extra following distance for the next 1.5 miles.
        </p>
        <div className="insight-card__footer">
          <TimerReset size={16} />
          Refreshed 40 seconds ago
        </div>
      </article>
    </section>
  );
}
