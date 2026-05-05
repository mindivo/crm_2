import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, CheckCircle, Circle } from 'lucide-react';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import { db, type Activity, type Contact, type Deal, type ActivityType } from '../lib/store';

const TYPES = ['call','email','meeting','task','note'] as const;
const BLANK = { type: 'call' as ActivityType, subject:'', notes:'', contact_id:'' as any, deal_id:'' as any, due_date:'', completed: false };

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [contacts,   setContacts]   = useState<Contact[]>([]);
  const [deals,      setDeals]      = useState<Deal[]>([]);
  const [search,     setSearch]     = useState('');
  const [filterType, setFilterType] = useState('');
  const [showModal,  setShowModal]  = useState(false);
  const [editing,    setEditing]    = useState<Activity | null>(null);
  const [form,       setForm]       = useState({ ...BLANK });

  const refresh = () => {
    let rows = db.activities.list(filterType || undefined);
    if (search) rows = rows.filter(a => a.subject.toLowerCase().includes(search.toLowerCase()));
    setActivities(rows);
    setContacts(db.contacts.list());
    setDeals(db.deals.list());
  };

  useEffect(() => { refresh(); }, [search, filterType]);

  const openAdd  = () => { setEditing(null); setForm({ ...BLANK }); setShowModal(true); };
  const openEdit = (a: Activity) => {
    setEditing(a);
    setForm({ type: a.type, subject: a.subject, notes: a.notes, contact_id: a.contact_id ?? '' as any,
              deal_id: a.deal_id ?? '' as any, due_date: a.due_date, completed: a.completed });
    setShowModal(true);
  };

  const handleSave = () => {
    const payload = { ...form, contact_id: form.contact_id ? Number(form.contact_id) : null,
                      deal_id: form.deal_id ? Number(form.deal_id) : null };
    if (editing) db.activities.update(editing.id, payload);
    else db.activities.add(payload);
    setShowModal(false);
    refresh();
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this activity?')) return;
    db.activities.remove(id);
    refresh();
  };

  const toggleComplete = (a: Activity) => {
    db.activities.update(a.id, { completed: !a.completed });
    refresh();
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Activities</h1>
          <p className="page-subtitle">{activities.filter(a => !a.completed).length} pending · {activities.filter(a => a.completed).length} completed</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Log Activity</button>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input placeholder="Search activities..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')}><X size={14} /></button>}
        </div>
        <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          {TYPES.map(t => <option key={t} value={t}>{t.replace(/\b\w/g, c => c.toUpperCase())}</option>)}
        </select>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead><tr><th>Done</th><th>Type</th><th>Subject</th><th>Contact</th><th>Deal</th><th>Due Date</th><th>Actions</th></tr></thead>
          <tbody>
            {activities.map(a => {
              const contact = a.contact_id ? db.contacts.get(a.contact_id) : null;
              const deal    = a.deal_id    ? db.deals.get(a.deal_id)       : null;
              return (
                <tr key={a.id} className={a.completed ? 'completed-row' : ''}>
                  <td><button className="icon-btn" onClick={() => toggleComplete(a)}>{a.completed ? <CheckCircle size={16} color="#1a7a3c" /> : <Circle size={16} color="#aaa" />}</button></td>
                  <td><Badge status={a.type} /></td>
                  <td className={a.completed ? 'line-through' : ''}>{a.subject}</td>
                  <td>{contact ? `${contact.first_name} ${contact.last_name}` : '—'}</td>
                  <td>{deal?.title || '—'}</td>
                  <td>{a.due_date ? new Date(a.due_date).toLocaleDateString() : '—'}</td>
                  <td>
                    <div className="action-btns">
                      <button className="icon-btn" onClick={() => openEdit(a)}><Edit2 size={14} /></button>
                      <button className="icon-btn danger" onClick={() => handleDelete(a.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {activities.length === 0 && <tr><td colSpan={7} className="empty-state">No activities found</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={editing ? 'Edit Activity' : 'Log Activity'} onClose={() => setShowModal(false)}>
          <div className="form-grid">
            <div className="form-group"><label>Type</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value as ActivityType})}>
                {TYPES.map(t => <option key={t} value={t}>{t.replace(/\b\w/g, c => c.toUpperCase())}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Due Date</label><input type="date" value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} /></div>
            <div className="form-group full"><label>Subject</label><input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} /></div>
            <div className="form-group"><label>Contact</label>
              <select value={form.contact_id} onChange={e => setForm({...form, contact_id: e.target.value})}>
                <option value="">— None —</option>
                {contacts.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Deal</label>
              <select value={form.deal_id} onChange={e => setForm({...form, deal_id: e.target.value})}>
                <option value="">— None —</option>
                {deals.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
              </select>
            </div>
            <div className="form-group full"><label>Notes</label><textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3} /></div>
            <div className="form-group full">
              <label className="checkbox-label">
                <input type="checkbox" checked={form.completed} onChange={e => setForm({...form, completed: e.target.checked})} />
                Mark as completed
              </label>
            </div>
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
