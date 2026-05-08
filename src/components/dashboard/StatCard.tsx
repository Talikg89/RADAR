import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  detail: string;
  icon: ReactNode;
  accent?: 'green' | 'cyan' | 'amber';
  action?: ReactNode;
}

export function StatCard({ title, value, detail, icon, accent = 'green', action }: StatCardProps) {
  return (
    <article className={`glass-card stat-card stat-card--${accent}`}>
      <div className="stat-card__icon">{icon}</div>
      <p>{title}</p>
      <h3>{value}</h3>
      <span>{detail}</span>
      {action ? <div className="stat-card__action">{action}</div> : null}
    </article>
  );
}
