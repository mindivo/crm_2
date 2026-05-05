import { useState } from 'react';
import { Search, CheckSquare, FileText, Handshake, Trophy, XCircle } from 'lucide-react';

interface StageData {
  id: string;
  label: string;
  count: number;
  value: number;
  shade: string;
  textColor: string;
  Icon: React.ElementType;
  description: string;
}

const STAGE_META: Record<string, { shade: string; textColor: string; Icon: React.ElementType; description: string }> = {
  prospecting:   { shade: '#f0f0f0', textColor: '#777',    Icon: Search,      description: 'Initial outreach' },
  qualification: { shade: '#e0e0e0', textColor: '#555',    Icon: CheckSquare, description: 'Needs confirmed' },
  proposal:      { shade: '#555555', textColor: '#ffffff', Icon: FileText,    description: 'Proposal sent' },
  negotiation:   { shade: '#222222', textColor: '#ffffff', Icon: Handshake,   description: 'Terms discussion' },
  closed_won:    { shade: '#0a0a0a', textColor: '#ffffff', Icon: Trophy,      description: 'Deal signed' },
  closed_lost:   { shade: '#f5f5f5', textColor: '#aaa',    Icon: XCircle,     description: 'Not converted' },
};

const ORDERED = ['prospecting','qualification','proposal','negotiation','closed_won','closed_lost'];

interface Props {
  stageBreakdown: Record<string, number>;
  deals: any[];
}

export default function PipelineChart({ stageBreakdown, deals }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  const stages: StageData[] = ORDERED.map(id => {
    const meta = STAGE_META[id];
    const stageDeals = deals.filter(d => d.stage === id);
    const value = stageDeals.reduce((s: number, d: any) => s + (d.value || 0), 0);
    return {
      id,
      label: id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      count: stageBreakdown[id] || 0,
      value,
      ...meta,
    };
  });

  const activeStages = stages.filter(s => s.id !== 'closed_lost');
  const totalActive = activeStages.reduce((s, st) => s + st.count, 0) || 1;
  const totalValue = stages.filter(s => !['closed_lost'].includes(s.id)).reduce((s, st) => s + st.value, 0);
  const wonValue = stages.find(s => s.id === 'closed_won')?.value || 0;
  const lostCount = stages.find(s => s.id === 'closed_lost')?.count || 0;

  const funnelWidths = [100, 88, 76, 64, 52];

  return (
    <div className="pipeline-viz">

      {/* ── Summary strip ── */}
      <div className="pipeline-summary">
        <div className="pipeline-summary-item">
          <span className="ps-value">{totalActive}</span>
          <span className="ps-label">Active Deals</span>
        </div>
        <div className="pipeline-summary-divider" />
        <div className="pipeline-summary-item">
          <span className="ps-value">${(totalValue / 1000).toFixed(1)}k</span>
          <span className="ps-label">Pipeline Value</span>
        </div>
        <div className="pipeline-summary-divider" />
        <div className="pipeline-summary-item">
          <span className="ps-value won">${(wonValue / 1000).toFixed(1)}k</span>
          <span className="ps-label">Won Revenue</span>
        </div>
        <div className="pipeline-summary-divider" />
        <div className="pipeline-summary-item">
          <span className="ps-value lost">{lostCount}</span>
          <span className="ps-label">Lost Deals</span>
        </div>
      </div>

      {/* ── Funnel visualization ── */}
      <div className="funnel-wrap">
        {activeStages.map((stage, i) => {
          const pct = Math.round((stage.count / totalActive) * 100);
          const isHovered = hovered === stage.id;
          const w = funnelWidths[i] ?? 44;
          const iconColor = stage.textColor === '#ffffff' ? '#888' : '#aaa';

          return (
            <div
              key={stage.id}
              className={`funnel-row ${isHovered ? 'funnel-row-hovered' : ''}`}
              onMouseEnter={() => setHovered(stage.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Left label */}
              <div className="funnel-left">
                <span className="funnel-icon-wrap">
                  <stage.Icon size={15} strokeWidth={1.75} color="#333" />
                </span>
                <div className="funnel-label-group">
                  <span className="funnel-label">{stage.label}</span>
                  <span className="funnel-desc">{stage.description}</span>
                </div>
              </div>

              {/* Funnel bar */}
              <div className="funnel-center">
                <div className="funnel-bar-outer" style={{ width: `${w}%` }}>
                  <div
                    className="funnel-bar-inner"
                    style={{
                      background: stage.shade,
                      color: stage.textColor,
                      width: `${Math.max(pct, stage.count > 0 ? 8 : 0)}%`,
                      minWidth: stage.count > 0 ? '32px' : '0',
                    }}
                  >
                    {stage.count > 0 && (
                      <span className="funnel-bar-label">{stage.count}</span>
                    )}
                  </div>
                  <div className="funnel-bar-track" />
                </div>

                {i < activeStages.length - 1 && (
                  <div className="funnel-connector">
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path d="M0 0 L12 5 L0 10 Z" fill="#d0d0d0" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Right stats */}
              <div className="funnel-right">
                <span className="funnel-pct">{pct}%</span>
                {stage.value > 0 && (
                  <span className="funnel-val">${(stage.value / 1000).toFixed(0)}k</span>
                )}
              </div>

              {/* Tooltip */}
              {isHovered && (
                <div className="funnel-tooltip">
                  <div className="ft-title">{stage.label}</div>
                  <div className="ft-row"><span>Deals</span><strong>{stage.count}</strong></div>
                  <div className="ft-row"><span>Value</span><strong>${stage.value.toLocaleString()}</strong></div>
                  <div className="ft-row"><span>Share</span><strong>{pct}%</strong></div>
                </div>
              )}
            </div>
          );
        })}

        {/* Closed Lost row */}
        {(() => {
          const lost = stages.find(s => s.id === 'closed_lost')!;
          return (
            <div
              className={`funnel-lost-row ${hovered === 'closed_lost' ? 'funnel-row-hovered' : ''}`}
              onMouseEnter={() => setHovered('closed_lost')}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="funnel-icon-wrap">
                <XCircle size={15} strokeWidth={1.75} color="#b91c1c" />
              </span>
              <span className="funnel-lost-label">Closed Lost</span>
              <span className="funnel-lost-count">{lost.count} deals</span>
              {lost.value > 0 && <span className="funnel-lost-val">${(lost.value / 1000).toFixed(0)}k lost</span>}
            </div>
          );
        })()}
      </div>

      {/* ── Segmented total bar ── */}
      <div className="pipeline-seg-wrap">
        <div className="pipeline-seg-label">Overall distribution</div>
        <div className="pipeline-seg-bar">
          {stages.map(stage => {
            const all = stages.reduce((s, st) => s + st.count, 0) || 1;
            const w = (stage.count / all) * 100;
            if (w === 0) return null;
            return (
              <div
                key={stage.id}
                className="pipeline-seg-segment"
                style={{
                  width: `${w}%`,
                  background: stage.shade,
                  border: stage.shade === '#f0f0f0' || stage.shade === '#f5f5f5' ? '1px solid #ddd' : 'none'
                }}
                title={`${stage.label}: ${stage.count}`}
              />
            );
          })}
        </div>
        <div className="pipeline-seg-legend">
          {stages.filter(s => s.count > 0).map(stage => (
            <div key={stage.id} className="pipeline-seg-leg-item">
              <span className="pipeline-seg-dot" style={{
                background: stage.shade,
                border: stage.shade === '#f0f0f0' || stage.shade === '#f5f5f5' ? '1px solid #ccc' : 'none'
              }} />
              <span>{stage.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
