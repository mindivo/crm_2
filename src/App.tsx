import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Companies from './pages/Companies';
import Deals from './pages/Deals';
import Pipeline from './pages/Pipeline';
import Activities from './pages/Activities';

export type Page = 'dashboard' | 'contacts' | 'companies' | 'deals' | 'pipeline' | 'activities';

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard />;
      case 'contacts': return <Contacts />;
      case 'companies': return <Companies />;
      case 'deals': return <Deals />;
      case 'pipeline': return <Pipeline />;
      case 'activities': return <Activities />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={setPage} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <main className="main-content" style={{ marginLeft: sidebarCollapsed ? '72px' : '240px' }}>
        {renderPage()}
      </main>
    </div>
  );
}
