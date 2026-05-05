import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import Modal from '../components/Modal';
import { db, type Deal, type Contact, type Company, type DealStage } from '../lib/store';

const STAGES = [
  { id: 'prospecting',   label: 'Prospecting',   color: '#bbbbbb' },
  { id: 'qualification', label: 'Qualification', color: '#888888' },
  { id: 'proposal',      label: 'Proposal',      color: '#555555' },
  { id: 'negotiation',   label: 'Negotiation',   color: '#333333' },
  { id: 'closed_won',    label: 'Closed Won',    color: '#0a0a0a' },
  { id: 'closed_lost',   label: 'Closed Lost',   color: '#d0d0d0' },
] as const;

const BLANK = { title:'', value:'' as any, stage:'prospecting' as DealStage, contact_id:'' as any, company_id:'' as any, close_date:'', probability:'' as any, notes:'' };

export default function Pipeline() {
  const [deals,     setDeals]     = useState<Deal[]>([]);
  const [contacts,  setContacts]  = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<Deal | null>(null);
  const [form,      setForm]      = useState({ ...BLANK });
  const [dragId,    setDragId]    = useState<number | null>(null);

  const refresh = () => {
    setDeals(db.deals.list());
    setContacts(db.contacts.list());
    setCompanies(db.companies.list());
  };

  useEffect(() => { refresh(); }, []);

  const openAdd  = (stage: string) => { setEditing(null); setForm({ ...BLANK, stage: stage as DealStage }); setShowModal(true); };
  const openEdit = (d: Deal) => {
    setEditing(d);
    setForm({ title: d.title, value: d.value, stage: d.stage, contact_id: d.contact_id ?? '' as any,
              company_id: d.company_id ?? '' as any, close_date: d.close_date, probability: d.probability ?? '' as any, notes: d.notes });
    setShowModal(true);
  };

  const handleSave = () => {
    const payload = { ...form, value: Number(form.value) || 0, contact_id: form.contact_id ? Number(form.contact_id) : null,
                      company_id: form.company_id ? Number(form.company_id) : null, probability: form.probability ? Number(form.probability) : null };
    if (editing) db.deals.update(editing.id, payload);
    else db.deals.add(payload);
    setShowModal(false);
    refresh();
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this deal?')) return;
    db.deals.remove(id);
    refresh();
  };

  const handleDrop = (stageId: string) => {
    if (dragId === null) return;
    db.deals.update(dragId, { stage: stageId as DealStage });
    setDragId(null);
    refresh();
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Pipeline</h1><p className="page-subtitle">Drag & drop deals between stages</p></div>
        <button className="btn-primary" onClick={() => openAdd('prospecting')}><Plus size={16} /> Add Deal</button>
      </div>

      <div className="pipeline-board">
        {STAGES.map(stage => {
          const stageDeals = deals.filter(d => d.stage === stage.id);
          const stageValue = stageDeals.reduce((s, d) => s + (d.value || 0), 0);
          return (
            <div key={stage.id} className="pipeline-column"
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(stage.id)}
            >
              <div className="pipeline-col-header" style={{ borderTopColor: stage.color }}>
                <div className="pipeline-col-title">
                  <span className="stage-dot" style={{ background: stage.color }} />
                  <span>{stage.label}</span>
                  <span className="stage-count">{stageDeals.length}</span>
                </div>
                <div className="stage-value">${(stageValue/1000).toFixed(1)}k</div>
              </div>
              <div className="pipeline-cards">
                {stageDeals.map(deal => {
                  const contact = deal.contact_id ? db.contacts.get(deal.contact_id) : null;
                  return (
                    <div key={deal.id}
                      className={`pipeline-card ${dragId === deal.id ? 'dragging' : ''}`}
                      draggable
                      onDragStart={() => setDragId(deal.id)}
                      onDragEnd={() => setDragId(null)}
                      onClick={() => openEdit(deal)}
                    >
                      <div className="card-deal-title">{deal.title}</div>
                      <div className="card-deal-value">${(deal.value||0).toLocaleString()}</div>
                      {contact && <div className="card-deal-contact">{contact.first_name} {contact.last_name}</div>}
                      {deal.close_date && <div className="card-deal-date">{new Date(deal.close_date).toLocaleDateString()}</div>}
                      <button className="card-delete" onClick={e => { e.stopPropagation(); handleDelete(deal.id); }}><X size={12} /></button>
                    </div>
                  );
                })}
                <button className="add-card-btn" onClick={() => openAdd(stage.id)}><Plus size={14} /> Add deal</button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <Modal title={editing ? 'Edit Deal' : 'Add Deal'} onClose={() => setShowModal(false)}>
          <div className="form-grid">
            <div className="form-group full"><label>Deal Title</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
            <div className="form-group"><label>Value ($)</label><input type="number" value={form.value} onChange={e => setForm({...form, value: e.target.value})} /></div>
            <div className="form-group"><label>Stage</label>
              <select value={form.stage} onChange={e => setForm({...form, stage: e.target.value as any})}>
                {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
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
