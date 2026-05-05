import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const [contacts, companies, deals, activities] = await Promise.all([
      supabase.from('contacts').select('id, status', { count: 'exact' }),
      supabase.from('companies').select('id', { count: 'exact' }),
      supabase.from('deals').select('id, value, stage', { count: 'exact' }),
      supabase.from('activities').select('id, completed', { count: 'exact' }),
    ]);

    const totalRevenue = (deals.data || []).filter(d => d.stage === 'closed_won').reduce((sum, d) => sum + (d.value || 0), 0);
    const pipelineValue = (deals.data || []).filter(d => !['closed_won','closed_lost'].includes(d.stage)).reduce((sum, d) => sum + (d.value || 0), 0);
    const wonDeals = (deals.data || []).filter(d => d.stage === 'closed_won').length;
    const totalDeals = (deals.data || []).length;
    const winRate = totalDeals > 0 ? Math.round((wonDeals / totalDeals) * 100) : 0;

    const stageBreakdown = {};
    for (const d of (deals.data || [])) {
      stageBreakdown[d.stage] = (stageBreakdown[d.stage] || 0) + 1;
    }

    const statusBreakdown = {};
    for (const c of (contacts.data || [])) {
      statusBreakdown[c.status] = (statusBreakdown[c.status] || 0) + 1;
    }

    return res.status(200).json({
      totalContacts: contacts.count || 0,
      totalCompanies: companies.count || 0,
      totalDeals: totalDeals,
      totalRevenue,
      pipelineValue,
      winRate,
      pendingActivities: (activities.data || []).filter(a => !a.completed).length,
      stageBreakdown,
      statusBreakdown,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: err.message });
  }
}
