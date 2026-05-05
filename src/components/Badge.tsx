const statusColors: Record<string, { bg: string; color: string; border: string }> = {
  lead:         { bg: '#f5f5f5', color: '#555555', border: '#d0d0d0' },
  prospect:     { bg: '#0a0a0a', color: '#ffffff', border: '#0a0a0a' },
  customer:     { bg: '#0a0a0a', color: '#ffffff', border: '#0a0a0a' },
  churned:      { bg: '#fff0f0', color: '#b91c1c', border: '#fca5a5' },
  prospecting:  { bg: '#f5f5f5', color: '#555555', border: '#d0d0d0' },
  qualification:{ bg: '#f0f0f0', color: '#333333', border: '#c0c0c0' },
  proposal:     { bg: '#0a0a0a', color: '#ffffff', border: '#0a0a0a' },
  negotiation:  { bg: '#333333', color: '#ffffff', border: '#333333' },
  closed_won:   { bg: '#f0faf4', color: '#1a7a3c', border: '#86efac' },
  closed_lost:  { bg: '#fff0f0', color: '#b91c1c', border: '#fca5a5' },
  call:         { bg: '#0a0a0a', color: '#ffffff', border: '#0a0a0a' },
  email:        { bg: '#333333', color: '#ffffff', border: '#333333' },
  meeting:      { bg: '#f0f0f0', color: '#111111', border: '#c0c0c0' },
  task:         { bg: '#f5f5f5', color: '#555555', border: '#d0d0d0' },
  note:         { bg: '#fafafa', color: '#888888', border: '#e0e0e0' },
};

export default function Badge({ status }: { status: string }) {
  const s = statusColors[status] || { bg: '#f5f5f5', color: '#555', border: '#d0d0d0' };
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return (
    <span className="badge" style={{ background: s.bg, color: s.color, borderColor: s.border }}>
      {label}
    </span>
  );
}
