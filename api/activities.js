import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { contact_id, deal_id, type } = req.query;
      let query = supabase.from('activities').select('*, contacts(first_name, last_name), deals(title)').order('created_at', { ascending: false }).limit(100);
      if (contact_id) query = query.eq('contact_id', contact_id);
      if (deal_id) query = query.eq('deal_id', deal_id);
      if (type) query = query.eq('type', type);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { type, subject, notes, contact_id, deal_id, due_date, completed } = req.body;
      const { data, error } = await supabase.from('activities').insert({ type, subject, notes, contact_id, deal_id, due_date, completed: completed || false }).select('*, contacts(first_name, last_name), deals(title)').single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...fields } = req.body;
      const { data, error } = await supabase.from('activities').update(fields).eq('id', id).select('*, contacts(first_name, last_name), deals(title)').single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('activities').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
