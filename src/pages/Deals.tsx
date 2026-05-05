import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Calendar } from 'lucide-react';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import { db, type Deal, type Contact, type Company, type DealStage } from '../lib/store';

const STAGES = ['prospecting','qualification','proposal','negotiation','closed_won','closed_lost'] as const;
const BLANK = { title:'', value:'' as any, stage:'prospecting' as DealStage, contact_id:'' as any, company_id:'' as any, close_date:'', probability:'' as any, notes:'' };

export default function Deals() {
  const [deals,     setDeals]     = useState<Deal[]>([]);
  const [contacts,  setContacts]  = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search,    setSearch]    = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<Deal | null>(null);
  const [form,      setForm]      = useState({ ...BLANK });
  const [selected,  setSelected]  = useState<Deal | null>(null);

  const refresh = () => {
    let rows = db.deals.list(filterStage || undefined);
    if (search) rows = rows.filter(d => d.title.toLowerCase().includes(search.toLowerCase()));
    setDeals(rows);
    setContacts(db.contacts.list());
    setCompanies(db.companies.list());
  };

  useEffect(() => { refresh(); }, [search, filterStage]);

  const openAdd  = () => { setEditing(null); setForm({ ...BLANK }); setShowModal(true); };
  const openEdit = (d: Deal) => {
    setEditing(d);
    setForm({ title: d.title, value: d.value, stage: d.stage, contact_id: d.contact_id ?? '' as any,
              company_id: d.company_id ?? '' as any, close_date: d.close_date, probability: d.probability ?? '' as any, notes: d.notes });
    setShowModal(true);
  };

  const handleSave = () => {
    const payload = { ...form, value: Number(form.value) || 0, contact_id: form.contact_id ? Number(form.contact_id) : null,
                      company_id: form.company_id ? Number(form.company_id) : null, probability: form.probability ? Number(form.probability) : null };
    if (editing) {
      const updated = db.deals.update(editing.id, payload);
      if (selected?.id === editing.id) setSelected(updated);
    } else {
      db.deals.add(payload);
    }
    setShowModal(false);
    refresh();
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this deal?')) return;
    db.deals.remove(id);
    if (selected?.id === id) setSelected(null);
    refresh();
  };

  const totalValue = deals.reduce((s, d) => s + (d.value || 0), 0);

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Deals</h1><p className="page-subtitle">{deals.length} deals · ${totalValue.toLocaleString()} total value</p></div>
        <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add Deal</button>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input placeholder="Search deals..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')}><X size={14} /></button>}
        </div>
        <select className="filter-select" value={filterStage} onChange={e => setFilterStage(e.target.value)}>
          <option value="">All Stages</option>
          {STAGES.map(s => <option key={s} value={s}>{s.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</option>)}
        </select>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead><tr><th>Deal</th><th>Contact</th><th>Company</th><th>Value</th><th>Stage</th><th>Close Date</th><th>Probability</th><th>Actions</th></tr></thead>
          <tbody>
            {deals.map(d => {
              const contact = d.contact_id ? db.contacts.get(d.contact_id) : null;
              const company = d.company_id ? db.companies.get(d.company_id) : null;
              return (
                <tr key={d.id} className={selected?.id === d.id ? 'selected' : ''} onClick={() => setSelected(d)}>
                  <td><span className="deal-title">{d.title}</span></td>
                  <td>{contact ? `${contact.first_name} ${contact.last_name}` : '—'}</td>
                  <td>{company?.name || '—'}</td>
                  <td className="value-cell">${(d.value||0).toLocaleString()}</td>
                  <td><Badge status={d.stage} /></td>
                  <td>{d.close_date ? new Date(d.close_date).toLocaleDateString() : '—'}</td>
                  <td>{d.probability != null ? `${d.probability}%` : '—'}</td>
                  <td>
                    <div className="action-btns" onClick={e => e.stopPropagation()}>
                      <button className="icon-btn" onClick={() => openEdit(d)}><Edit2 size={14} /></button>
                      <button className="icon-btn danger" onClick={() => handleDelete(d.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {deals.length === 0 && <tr><td colSpan={8} className="empty-state">No deals found</td></tr>}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="detail-panel">
          <div className="detail-panel-header"><h3>Deal Details</h3><button className="icon-btn" onClick={() => setSelected(null)}><X size={16} /></button></div>
          <div className="detail-deal-value">${(selected.value||0).toLocaleString()}</div>
          <div className="detail-name">{selected.title}</div>
          <Badge status={selected.stage} />
          <div className="detail-fields">
            <div className="detail-field"><Calendar size={14} /><span>{selected.close_date ? new Date(selected.close_date).toLocaleDateString() : 'No close date'}</span></div>
          </div>
          {selected.notes && <div className="detail-notes">{selected.notes}</div>}
          <div className="detail-actions">
            <button className="btn-primary" onClick={() => openEdit(selected)}>Edit</button>
            <button className="btn-danger" onClick={() => handleDelete(selected.id)}>Delete</button>
          </div>
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Edit Deal' : 'Add Deal'} onClose={() => setShowModal(false)}>
          <div className="form-grid">
            <div className="form-group full"><label>Deal Title</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
            <div className="form-group"><label>Value ($)</label><input type="number" value={form.value} onChange={e => setForm({...form, value: e.target.value})} /></div>
            <div className="form-group"><label>Stage</label>
              <select value={form.stage} onChange={e => setForm({...form, stage: e.target.value as DealStage})}>
                {STAGES.map(s => <option key={s} value={s}>{s.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Contact</label>
              <select value={form.contact_id} onChange={e => setForm({...form, contact_id: e.target.value})}>
                <option value="">— None —</option>
                {contacts.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Company</label>
              <select value={form.company_id} onChange={e => setForm({...form, company_id: e.target.value})}>
                <option value="">— None —</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Close Date</label><input type="date" value={form.close_date} onChange={e => setForm({...form, close_date: e.target.value})} /></div>
            <div className="form-group"><label>Probability (%)</label><input type="number" min="0" max="100" value={form.probability} onChange={e => setForm({...form, probability: e.target.value})} /></div>
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
