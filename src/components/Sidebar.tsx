import { LayoutDashboard, Users, Building2, TrendingUp, Kanban, Activity, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import type { Page } from '../App';

interface SidebarProps {
  page: Page;
  setPage: (p: Page) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'contacts', label: 'Contacts', icon: Users },
  { id: 'companies', label: 'Companies', icon: Building2 },
  { id: 'deals', label: 'Deals', icon: TrendingUp },
  { id: 'pipeline', label: 'Pipeline', icon: Kanban },
  { id: 'activities', label: 'Activities', icon: Activity },
] as const;

export default function Sidebar({ page, setPage, collapsed, setCollapsed }: SidebarProps) {
  return (
    <aside className="sidebar" style={{ width: collapsed ? '72px' : '240px' }}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon"><Zap size={18} /></div>
          {!collapsed && <span className="logo-text">NexusCRM</span>}
        </div>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {!collapsed && <div className="sidebar-section-label">MAIN MENU</div>}

      <nav className="sidebar-nav">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${page === id ? 'active' : ''}`}
            onClick={() => setPage(id as Page)}
            title={collapsed ? label : undefined}
          >
            <Icon size={18} />
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-avatar">JD</div>
        {!collapsed && (
          <div className="user-info">
            <div className="user-name">John Doe</div>
            <div className="user-role">Sales Manager</div>
          </div>
        )}
      </div>
    </aside>
  );
}
