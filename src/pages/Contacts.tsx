import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Mail, Phone, X } from 'lucide-react';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import { db, type Contact, type Company, type ContactStatus } from '../lib/store';

const STATUS_OPTIONS = ['lead','prospect','customer','churned'] as const;

const BLANK = { first_name:'', last_name:'', email:'', phone:'', title:'', company_id:'' as any, status:'lead' as ContactStatus, notes:'' };

export default function Contacts() {
  const [contacts,  setContacts]  = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search,    setSearch]    = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<Contact | null>(null);
  const [form,      setForm]      = useState({ ...BLANK });
  const [selected,  setSelected]  = useState<Contact | null>(null);

  const refresh = () => {
    setContacts(db.contacts.list(search || undefined, filterStatus || undefined));
    setCompanies(db.companies.list());
  };

  useEffect(() => { refresh(); }, [search, filterStatus]);

  const openAdd  = () => { setEditing(null); setForm({ ...BLANK }); setShowModal(true); };
  const openEdit = (c: Contact) => {
    setEditing(c);
    setForm({ first_name: c.first_name, last_name: c.last_name, email: c.email, phone: c.phone,
              title: c.title, company_id: c.company_id ?? '' as any, status: c.status, notes: c.notes });
    setShowModal(true);
  };

  const handleSave = () => {
    const payload = { ...form, company_id: form.company_id ? Number(form.company_id) : null };
    if (editing) {
      const updated = db.contacts.update(editing.id, payload);
      if (selected?.id === editing.id) setSelected(updated);
    } else {
      db.contacts.add(payload);
    }
    setShowModal(false);
    refresh();
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this contact?')) return;
    db.contacts.remove(id);
    if (selected?.id === id) setSelected(null);
    refresh();
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Contacts</h1>
          <p className="page-subtitle">{contacts.length} contacts total</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add Contact</button>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input placeholder="Search contacts..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')}><X size={14} /></button>}
        </div>
        <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/\b\w/g, c => c.toUpperCase())}</option>)}
        </select>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Phone</th><th>Company</th><th>Title</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {contacts.map(c => {
              const company = c.company_id ? db.companies.get(c.company_id) : null;
              return (
                <tr key={c.id} className={selected?.id === c.id ? 'selected' : ''} onClick={() => setSelected(c)}>
                  <td><div className="cell-with-avatar"><div className="avatar-sm">{c.first_name?.[0]}{c.last_name?.[0]}</div><span>{c.first_name} {c.last_name}</span></div></td>
                  <td><a href={`mailto:${c.email}`} className="link">{c.email}</a></td>
                  <td>{c.phone || '—'}</td>
                  <td>{company?.name || '—'}</td>
                  <td>{c.title || '—'}</td>
                  <td><Badge status={c.status} /></td>
                  <td>
                    <div className="action-btns" onClick={e => e.stopPropagation()}>
                      <button className="icon-btn" onClick={() => openEdit(c)}><Edit2 size={14} /></button>
                      <button className="icon-btn danger" onClick={() => handleDelete(c.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {contacts.length === 0 && <tr><td colSpan={7} className="empty-state">No contacts found</td></tr>}
          </tbody>
        </table>
      </div>

      {selected && (() => {
        const company = selected.company_id ? db.companies.get(selected.company_id) : null;
        return (
          <div className="detail-panel">
            <div className="detail-panel-header"><h3>Contact Details</h3><button className="icon-btn" onClick={() => setSelected(null)}><X size={16} /></button></div>
            <div className="detail-avatar">{selected.first_name?.[0]}{selected.last_name?.[0]}</div>
            <div className="detail-name">{selected.first_name} {selected.last_name}</div>
            <div className="detail-title">{selected.title}{company ? ` · ${company.name}` : ''}</div>
            <Badge status={selected.status} />
            <div className="detail-fields">
              <div className="detail-field"><Mail size={14} /><span>{selected.email || '—'}</span></div>
              <div className="detail-field"><Phone size={14} /><span>{selected.phone || '—'}</span></div>
            </div>
            {selected.notes && <div className="detail-notes">{selected.notes}</div>}
            <div className="detail-actions">
              <button className="btn-primary" onClick={() => openEdit(selected)}>Edit</button>
              <button className="btn-danger" onClick={() => handleDelete(selected.id)}>Delete</button>
            </div>
          </div>
        );
      })()}

      {showModal && (
        <Modal title={editing ? 'Edit Contact' : 'Add Contact'} onClose={() => setShowModal(false)}>
          <div className="form-grid">
            <div className="form-group"><label>First Name</label><input value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} /></div>
            <div className="form-group"><label>Last Name</label><input value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} /></div>
            <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
            <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
            <div className="form-group"><label>Title</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
            <div className="form-group"><label>Company</label>
              <select value={form.company_id} onChange={e => setForm({...form, company_id: e.target.value})}>
                <option value="">— None —</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value as ContactStatus})}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/\b\w/g, c => c.toUpperCase())}</option>)}
              </select>
            </div>
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
