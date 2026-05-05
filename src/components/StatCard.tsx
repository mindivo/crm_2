interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  positive?: boolean;
  color?: string;
}

export default function StatCard({ label, value, icon, change, positive }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: '#0a0a0a', color: '#ffffff' }}>{icon}</div>
      <div className="stat-body">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {change && (
          <div className={`stat-change ${positive ? 'positive' : 'negative'}`}>
            {positive ? '↑' : '↓'} {change}
          </div>
        )}
      </div>
    </div>
  );
}
