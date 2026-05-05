import { useEffect, useState } from 'react';
import { Users, Building2, TrendingUp, DollarSign, Target, Activity } from 'lucide-react';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import PipelineChart from '../components/PipelineChart';
import { db } from '../lib/store';

export default function Dashboard() {
  const [stats, setStats]               = useState<any>(null);
  const [recentContacts, setRecentContacts] = useState<any[]>([]);
  const [recentDeals, setRecentDeals]   = useState<any[]>([]);
  const [allDeals, setAllDeals]         = useState<any[]>([]);

  const refresh = () => {
    setStats(db.stats());
    const contacts = db.contacts.list();
    setRecentContacts(contacts.slice(0, 5));
    const deals = db.deals.list();
    setAllDeals(deals);
    setRecentDeals(deals.slice(0, 5));
  };

  useEffect(() => { refresh(); }, []);

  if (!stats) return null;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Welcome back, John. Here's what's happening.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Contacts"  value={stats.totalContacts}  icon={<Users size={20} />}      change="12% this month" positive />
        <StatCard label="Companies"       value={stats.totalCompanies} icon={<Building2 size={20} />}  change="8% this month"  positive />
        <StatCard label="Active Deals"    value={stats.totalDeals}     icon={<TrendingUp size={20} />} change="5% this month"  positive />
        <StatCard label="Revenue Won"     value={`$${(stats.totalRevenue / 1000).toFixed(1)}k`}  icon={<DollarSign size={20} />} change="23% this month" positive />
        <StatCard label="Pipeline Value"  value={`$${(stats.pipelineValue / 1000).toFixed(1)}k`} icon={<Target size={20} />} />
        <StatCard label="Win Rate"        value={`${stats.winRate}%`}  icon={<Activity size={20} />}  change="3% this month"  positive />
      </div>

      <div className="dashboard-grid">
        <div className="card pipeline-card-full">
          <div className="card-header">
            <h3>Deal Pipeline</h3>
            <span className="card-header-sub">Hover a stage for details</span>
          </div>
          <PipelineChart stageBreakdown={stats.stageBreakdown} deals={allDeals} />
        </div>

        <div className="card">
          <div className="card-header"><h3>Recent Contacts</h3></div>
          <div className="table-list">
            {recentContacts.map(c => {
              const company = c.company_id ? db.companies.get(c.company_id) : null;
              return (
                <div key={c.id} className="list-row">
                  <div className="avatar-sm">{c.first_name?.[0]}{c.last_name?.[0]}</div>
                  <div className="list-row-info">
                    <div className="list-row-name">{c.first_name} {c.last_name}</div>
                    <div className="list-row-sub">{c.email}</div>
                  </div>
                  <Badge status={c.status} />
                </div>
              );
            })}
            {recentContacts.length === 0 && <div className="empty-state-sm">No contacts yet</div>}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>Recent Deals</h3></div>
          <div className="table-list">
            {recentDeals.map(d => (
              <div key={d.id} className="list-row">
                <div className="deal-icon">$</div>
                <div className="list-row-info">
                  <div className="list-row-name">{d.title}</div>
                  <div className="list-row-sub">${(d.value || 0).toLocaleString()}</div>
                </div>
                <Badge status={d.stage} />
              </div>
            ))}
            {recentDeals.length === 0 && <div className="empty-state-sm">No deals yet</div>}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>Contact Status</h3></div>
          <div className="donut-legend">
            {Object.entries(stats.statusBreakdown).map(([status, count]) => (
              <div key={status} className="legend-row">
                <div className="legend-dot" style={{
                  background: status === 'customer' ? '#0a0a0a' : status === 'prospect' ? '#444' : status === 'lead' ? '#888' : '#d0d0d0',
                  border: '1px solid #ccc'
                }} />
                <span className="legend-label">{status.replace(/\b\w/g, c => c.toUpperCase())}</span>
                <span className="legend-count">{count as number}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
