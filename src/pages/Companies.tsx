import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Globe, Phone, X } from 'lucide-react';
import Modal from '../components/Modal';
import { db, type Company } from '../lib/store';

const INDUSTRIES = ['Technology','Finance','Healthcare','Retail','Manufacturing','Education','Real Estate','Media','Consulting','Other'];
const BLANK = { name:'', industry:'', website:'', phone:'', address:'', employees:'' as any, annual_revenue:'' as any, notes:'' };

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search,    setSearch]    = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<Company | null>(null);
  const [form,      setForm]      = useState({ ...BLANK });
  const [selected,  setSelected]  = useState<Company | null>(null);

  const refresh = () => setCompanies(db.companies.list(search || undefined));
  useEffect(() => { refresh(); }, [search]);

  const openAdd  = () => { setEditing(null); setForm({ ...BLANK }); setShowModal(true); };
  const openEdit = (c: Company) => {
    setEditing(c);
    setForm({ name: c.name, industry: c.industry, website: c.website, phone: c.phone,
              address: c.address, employees: c.employees ?? '' as any, annual_revenue: c.annual_revenue ?? '' as any, notes: c.notes });
    setShowModal(true);
  };

  const handleSave = () => {
    const payload = { ...form, employees: form.employees ? Number(form.employees) : null, annual_revenue: form.annual_revenue ? Number(form.annual_revenue) : null };
    if (editing) {
      const updated = db.companies.update(editing.id, payload);
      if (selected?.id === editing.id) setSelected(updated);
    } else {
      db.companies.add(payload);
    }
    setShowModal(false);
    refresh();
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this company?')) return;
    db.companies.remove(id);
    if (selected?.id === id) setSelected(null);
    refresh();
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Companies</h1><p className="page-subtitle">{companies.length} companies total</p></div>
        <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add Company</button>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input placeholder="Search companies..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')}><X size={14} /></button>}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead><tr><th>Company</th><th>Industry</th><th>Website</th><th>Phone</th><th>Employees</th><th>Revenue</th><th>Actions</th></tr></thead>
          <tbody>
            {companies.map(c => (
              <tr key={c.id} className={selected?.id === c.id ? 'selected' : ''} onClick={() => setSelected(c)}>
                <td><div className="cell-with-avatar"><div className="avatar-sm company">{c.name?.[0]}</div><span>{c.name}</span></div></td>
                <td>{c.industry || '—'}</td>
                <td>{c.website ? <a href={c.website} target="_blank" rel="noreferrer" className="link">{c.website.replace(/https?:\/\//,'')}</a> : '—'}</td>
                <td>{c.phone || '—'}</td>
                <td>{c.employees ? c.employees.toLocaleString() : '—'}</td>
                <td>{c.annual_revenue ? `$${(c.annual_revenue/1000000).toFixed(1)}M` : '—'}</td>
                <td>
                  <div className="action-btns" onClick={e => e.stopPropagation()}>
                    <button className="icon-btn" onClick={() => openEdit(c)}><Edit2 size={14} /></button>
                    <button className="icon-btn danger" onClick={() => handleDelete(c.id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {companies.length === 0 && <tr><td colSpan={7} className="empty-state">No companies found</td></tr>}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="detail-panel">
          <div className="detail-panel-header"><h3>Company Details</h3><button className="icon-btn" onClick={() => setSelected(null)}><X size={16} /></button></div>
          <div className="detail-avatar company">{selected.name?.[0]}</div>
          <div className="detail-name">{selected.name}</div>
          <div className="detail-title">{selected.industry}</div>
          <div className="detail-fields">
            {selected.website && <div className="detail-field"><Globe size={14} /><a href={selected.website} target="_blank" rel="noreferrer" className="link">{selected.website}</a></div>}
            {selected.phone   && <div className="detail-field"><Phone size={14} /><span>{selected.phone}</span></div>}
          </div>
          {selected.notes && <div className="detail-notes">{selected.notes}</div>}
          <div className="detail-actions">
            <button className="btn-primary" onClick={() => openEdit(selected)}>Edit</button>
            <button className="btn-danger" onClick={() => handleDelete(selected.id)}>Delete</button>
          </div>
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Edit Company' : 'Add Company'} onClose={() => setShowModal(false)}>
          <div className="form-grid">
            <div className="form-group full"><label>Company Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
            <div className="form-group"><label>Industry</label>
              <select value={form.industry} onChange={e => setForm({...form, industry: e.target.value})}>
                <option value="">Select Industry</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Website</label><input value={form.website} onChange={e => setForm({...form, website: e.target.value})} placeholder="https://" /></div>
            <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
            <div className="form-group"><label>Address</label><input value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
            <div className="form-group"><label>Employees</label><input type="number" value={form.employees} onChange={e => setForm({...form, employees: e.target.value})} /></div>
            <div className="form-group"><label>Annual Revenue ($)</label><input type="number" value={form.annual_revenue} onChange={e => setForm({...form, annual_revenue: e.target.value})} /></div>
            <div className="form-group full"><label>Notes</label><textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3} /></div>
          </div>
          <div className="modal-actions">
            <button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
