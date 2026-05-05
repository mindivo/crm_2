// ─── Types ───────────────────────────────────────────────────────────────────
export interface Company {
  id: number;
  name: string;
  industry: string;
  website: string;
  phone: string;
  address: string;
  employees: number | null;
  annual_revenue: number | null;
  notes: string;
  created_at: string;
}

export type ContactStatus = 'lead' | 'prospect' | 'customer' | 'churned';
export interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  title: string;
  company_id: number | null;
  status: ContactStatus;
  notes: string;
  created_at: string;
}

export type DealStage = 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
export interface Deal {
  id: number;
  title: string;
  value: number;
  stage: DealStage;
  contact_id: number | null;
  company_id: number | null;
  close_date: string;
  probability: number | null;
  notes: string;
  created_at: string;
}

export type ActivityType = 'call' | 'email' | 'meeting' | 'task' | 'note';
export interface Activity {
  id: number;
  type: ActivityType;
  subject: string;
  notes: string;
  contact_id: number | null;
  deal_id: number | null;
  due_date: string;
  completed: boolean;
  created_at: string;
}

// ─── Seed data ───────────────────────────────────────────────────────────────
const SEED_COMPANIES: Company[] = [
  { id:1, name:'Apex Technologies',     industry:'Technology',    website:'https://apextech.io',      phone:'+1 (415) 555-0101', address:'100 Market St, San Francisco, CA', employees:850,  annual_revenue:42000000,  notes:'Enterprise SaaS company, key strategic partner', created_at:'2024-01-10T09:00:00Z' },
  { id:2, name:'Meridian Capital',      industry:'Finance',       website:'https://meridiancap.com',  phone:'+1 (212) 555-0202', address:'200 Wall St, New York, NY',        employees:320,  annual_revenue:180000000, notes:'Private equity firm, expanding into tech investments', created_at:'2024-01-12T09:00:00Z' },
  { id:3, name:'HealthFirst Group',     industry:'Healthcare',    website:'https://healthfirst.com',  phone:'+1 (312) 555-0303', address:'500 Michigan Ave, Chicago, IL',    employees:1200, annual_revenue:95000000,  notes:'Hospital network looking to modernize operations', created_at:'2024-01-15T09:00:00Z' },
  { id:4, name:'Nova Retail Co.',       industry:'Retail',        website:'https://novaretail.com',   phone:'+1 (713) 555-0404', address:'1200 Main St, Houston, TX',       employees:4500, annual_revenue:320000000, notes:'Large retail chain, 200+ stores nationwide', created_at:'2024-01-18T09:00:00Z' },
  { id:5, name:'Prism Consulting',      industry:'Consulting',    website:'https://prismconsult.com', phone:'+1 (617) 555-0505', address:'88 Federal St, Boston, MA',       employees:150,  annual_revenue:28000000,  notes:'Boutique management consultancy', created_at:'2024-01-20T09:00:00Z' },
  { id:6, name:'Vortex Media',          industry:'Media',         website:'https://vortexmedia.com',  phone:'+1 (323) 555-0606', address:'6000 Sunset Blvd, Los Angeles, CA',employees:600,  annual_revenue:75000000,  notes:'Digital media and content production', created_at:'2024-01-22T09:00:00Z' },
  { id:7, name:'Starfield Education',   industry:'Education',     website:'https://starfieldedu.com', phone:'+1 (206) 555-0707', address:'300 Pine St, Seattle, WA',        employees:280,  annual_revenue:18000000,  notes:'Online learning platform, 500k students', created_at:'2024-01-25T09:00:00Z' },
  { id:8, name:'Ironclad Manufacturing',industry:'Manufacturing', website:'https://ironcladmfg.com',  phone:'+1 (313) 555-0808', address:'400 Industrial Dr, Detroit, MI',  employees:2200, annual_revenue:210000000, notes:'Automotive parts supplier', created_at:'2024-01-28T09:00:00Z' },
];

const SEED_CONTACTS: Contact[] = [
  { id:1,  first_name:'Sarah',   last_name:'Mitchell',  email:'sarah.mitchell@apextech.io',  phone:'+1 (415) 555-1001', title:'VP of Engineering',          company_id:1, status:'customer', notes:'Key decision maker, very responsive',       created_at:'2024-02-01T09:00:00Z' },
  { id:2,  first_name:'James',   last_name:'Thornton',  email:'j.thornton@meridiancap.com',  phone:'+1 (212) 555-1002', title:'Managing Partner',           company_id:2, status:'prospect', notes:'Interested in enterprise plan',             created_at:'2024-02-03T09:00:00Z' },
  { id:3,  first_name:'Elena',   last_name:'Vasquez',   email:'evasquez@healthfirst.com',    phone:'+1 (312) 555-1003', title:'CTO',                        company_id:3, status:'customer', notes:'Signed 3-year contract last quarter',      created_at:'2024-02-05T09:00:00Z' },
  { id:4,  first_name:'Marcus',  last_name:'Reed',      email:'mreed@novaretail.com',         phone:'+1 (713) 555-1004', title:'Director of IT',             company_id:4, status:'prospect', notes:'Evaluating multiple vendors',               created_at:'2024-02-07T09:00:00Z' },
  { id:5,  first_name:'Olivia',  last_name:'Chen',      email:'o.chen@prismconsult.com',      phone:'+1 (617) 555-1005', title:'Principal Consultant',       company_id:5, status:'lead',     notes:'Met at SaaS conference in March',           created_at:'2024-02-09T09:00:00Z' },
  { id:6,  first_name:'Derek',   last_name:'Nakamura',  email:'derek@vortexmedia.com',        phone:'+1 (323) 555-1006', title:'Head of Technology',         company_id:6, status:'customer', notes:'Happy customer, potential upsell',          created_at:'2024-02-11T09:00:00Z' },
  { id:7,  first_name:'Priya',   last_name:'Sharma',    email:'psharma@starfieldedu.com',     phone:'+1 (206) 555-1007', title:'CEO',                        company_id:7, status:'prospect', notes:'Interested in student analytics module',    created_at:'2024-02-13T09:00:00Z' },
  { id:8,  first_name:'Tyler',   last_name:'Brooks',    email:'tbrooks@ironcladmfg.com',      phone:'+1 (313) 555-1008', title:'Operations Manager',         company_id:8, status:'lead',     notes:'Referred by Sarah Mitchell',                created_at:'2024-02-15T09:00:00Z' },
  { id:9,  first_name:'Amanda',  last_name:'Foster',    email:'afoster@apextech.io',          phone:'+1 (415) 555-1009', title:'Product Manager',            company_id:1, status:'customer', notes:'Champion within Apex Technologies',         created_at:'2024-02-17T09:00:00Z' },
  { id:10, first_name:'Ryan',    last_name:'Gallagher', email:'ryan.g@meridiancap.com',       phone:'+1 (212) 555-1010', title:'Senior Analyst',             company_id:2, status:'lead',     notes:'Initial contact, needs qualification',      created_at:'2024-02-19T09:00:00Z' },
  { id:11, first_name:'Natalie', last_name:'Kim',       email:'nkim@healthfirst.com',         phone:'+1 (312) 555-1011', title:'Director of Digital Health', company_id:3, status:'prospect', notes:'Wants demo of new AI features',             created_at:'2024-02-21T09:00:00Z' },
  { id:12, first_name:'Carlos',  last_name:'Mendez',    email:'cmendez@novaretail.com',       phone:'+1 (713) 555-1012', title:'VP of Operations',           company_id:4, status:'churned',  notes:'Left company, no longer a contact',         created_at:'2024-02-23T09:00:00Z' },
  { id:13, first_name:'Sophie',  last_name:'Laurent',   email:'slauren@prismconsult.com',     phone:'+1 (617) 555-1013', title:'Associate Partner',          company_id:5, status:'lead',     notes:'Attended our webinar last week',            created_at:'2024-02-25T09:00:00Z' },
  { id:14, first_name:'Kevin',   last_name:'Walsh',     email:'kwalsh@vortexmedia.com',       phone:'+1 (323) 555-1014', title:'CFO',                        company_id:6, status:'prospect', notes:'Budget approval holder',                    created_at:'2024-02-27T09:00:00Z' },
];

const SEED_DEALS: Deal[] = [
  { id:1,  title:'Apex Enterprise License',      value:85000,  stage:'closed_won',    contact_id:1,  company_id:1, close_date:'2024-03-15', probability:100, notes:'Annual enterprise license, includes premium support', created_at:'2024-02-01T09:00:00Z' },
  { id:2,  title:'Meridian Analytics Suite',     value:45000,  stage:'negotiation',   contact_id:2,  company_id:2, close_date:'2024-07-30', probability:75,  notes:'Negotiating on pricing and SLA terms',               created_at:'2024-02-05T09:00:00Z' },
  { id:3,  title:'HealthFirst Platform Upgrade', value:120000, stage:'proposal',      contact_id:3,  company_id:3, close_date:'2024-08-15', probability:60,  notes:'Full platform migration proposal sent',              created_at:'2024-02-08T09:00:00Z' },
  { id:4,  title:'Nova Retail POS Integration',  value:67000,  stage:'qualification', contact_id:4,  company_id:4, close_date:'2024-09-01', probability:40,  notes:'Qualifying budget and timeline',                     created_at:'2024-02-10T09:00:00Z' },
  { id:5,  title:'Prism Consulting Tools',       value:18000,  stage:'prospecting',   contact_id:5,  company_id:5, close_date:'2024-10-01', probability:20,  notes:'Initial outreach, needs follow-up',                  created_at:'2024-02-12T09:00:00Z' },
  { id:6,  title:'Vortex Media CMS License',     value:32000,  stage:'closed_won',    contact_id:6,  company_id:6, close_date:'2024-02-20', probability:100, notes:'Renewed annual contract',                            created_at:'2024-02-14T09:00:00Z' },
  { id:7,  title:'Starfield LMS Integration',    value:28000,  stage:'proposal',      contact_id:7,  company_id:7, close_date:'2024-08-30', probability:55,  notes:'Custom LMS integration proposal',                   created_at:'2024-02-16T09:00:00Z' },
  { id:8,  title:'Ironclad ERP Module',          value:95000,  stage:'qualification', contact_id:8,  company_id:8, close_date:'2024-09-15', probability:35,  notes:'Large deal, long sales cycle expected',              created_at:'2024-02-18T09:00:00Z' },
  { id:9,  title:'Apex Expansion — Q3',          value:42000,  stage:'negotiation',   contact_id:9,  company_id:1, close_date:'2024-07-15', probability:80,  notes:'Upsell to additional departments',                   created_at:'2024-02-20T09:00:00Z' },
  { id:10, title:'Meridian Data Warehouse',      value:55000,  stage:'prospecting',   contact_id:10, company_id:2, close_date:'2024-10-30', probability:15,  notes:'Early stage, needs executive buy-in',               created_at:'2024-02-22T09:00:00Z' },
  { id:11, title:'HealthFirst Mobile App',       value:38000,  stage:'closed_lost',   contact_id:11, company_id:3, close_date:'2024-04-10', probability:0,   notes:'Lost to competitor on price',                       created_at:'2024-02-24T09:00:00Z' },
  { id:12, title:'Vortex Analytics Upgrade',     value:24000,  stage:'qualification', contact_id:14, company_id:6, close_date:'2024-08-20', probability:45,  notes:'Upgrade existing analytics package',                created_at:'2024-02-26T09:00:00Z' },
];

const SEED_ACTIVITIES: Activity[] = [
  { id:1,  type:'call',    subject:'Discovery call with Sarah Mitchell',       notes:'Discussed current pain points and requirements for Q3 expansion',         contact_id:1,  deal_id:1,    due_date:'2024-07-01', completed:true,  created_at:'2024-03-01T09:00:00Z' },
  { id:2,  type:'email',   subject:'Follow-up on Meridian Analytics proposal',  notes:'Sent revised pricing deck and case studies',                              contact_id:2,  deal_id:2,    due_date:'2024-07-05', completed:true,  created_at:'2024-03-03T09:00:00Z' },
  { id:3,  type:'meeting', subject:'HealthFirst platform demo',                 notes:'Full product demo with CTO and IT team, 2 hours',                         contact_id:3,  deal_id:3,    due_date:'2024-07-10', completed:false, created_at:'2024-03-05T09:00:00Z' },
  { id:4,  type:'task',    subject:'Prepare Nova Retail ROI analysis',          notes:'Custom ROI calculator for 200+ store deployment',                         contact_id:4,  deal_id:4,    due_date:'2024-07-08', completed:false, created_at:'2024-03-07T09:00:00Z' },
  { id:5,  type:'call',    subject:'Intro call with Olivia Chen',               notes:'First contact, understand consulting firm needs',                          contact_id:5,  deal_id:5,    due_date:'2024-07-12', completed:false, created_at:'2024-03-09T09:00:00Z' },
  { id:6,  type:'email',   subject:'Vortex renewal confirmation',               notes:'Sent renewal documents and invoice',                                       contact_id:6,  deal_id:6,    due_date:'2024-06-20', completed:true,  created_at:'2024-03-11T09:00:00Z' },
  { id:7,  type:'meeting', subject:'Starfield LMS requirements workshop',       notes:'3-hour workshop to define integration requirements',                       contact_id:7,  deal_id:7,    due_date:'2024-07-15', completed:false, created_at:'2024-03-13T09:00:00Z' },
  { id:8,  type:'task',    subject:'Send Ironclad ERP case studies',            notes:'Manufacturing industry case studies requested',                            contact_id:8,  deal_id:8,    due_date:'2024-07-06', completed:true,  created_at:'2024-03-15T09:00:00Z' },
  { id:9,  type:'call',    subject:'Apex Q3 expansion negotiation',             notes:'Review contract terms for additional seats',                               contact_id:9,  deal_id:9,    due_date:'2024-07-09', completed:false, created_at:'2024-03-17T09:00:00Z' },
  { id:10, type:'note',    subject:'Meridian new contact identified',           notes:'Ryan Gallagher introduced as additional stakeholder, schedule intro call', contact_id:10, deal_id:10,   due_date:'2024-07-14', completed:false, created_at:'2024-03-19T09:00:00Z' },
  { id:11, type:'email',   subject:'Quarterly check-in with Derek Nakamura',   notes:'Routine QBR email, ask about new projects',                               contact_id:6,  deal_id:null, due_date:'2024-07-20', completed:false, created_at:'2024-03-21T09:00:00Z' },
  { id:12, type:'meeting', subject:'CFO budget review — Vortex',               notes:'Present business case to Kevin Walsh for analytics upgrade',               contact_id:14, deal_id:12,   due_date:'2024-07-18', completed:false, created_at:'2024-03-23T09:00:00Z' },
];

// ─── Keys ────────────────────────────────────────────────────────────────────
const KEYS = {
  companies:  'crm_companies',
  contacts:   'crm_contacts',
  deals:      'crm_deals',
  activities: 'crm_activities',
  seeded:     'crm_seeded',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function nextId<T extends { id: number }>(items: T[]): number {
  return items.length === 0 ? 1 : Math.max(...items.map(i => i.id)) + 1;
}

function now(): string {
  return new Date().toISOString();
}

// ─── Seed on first load ───────────────────────────────────────────────────────
export function seedIfNeeded(): void {
  if (localStorage.getItem(KEYS.seeded)) return;
  save(KEYS.companies,  SEED_COMPANIES);
  save(KEYS.contacts,   SEED_CONTACTS);
  save(KEYS.deals,      SEED_DEALS);
  save(KEYS.activities, SEED_ACTIVITIES);
  localStorage.setItem(KEYS.seeded, '1');
}

// ─── Companies ───────────────────────────────────────────────────────────────
export const db = {
  companies: {
    list(search?: string): Company[] {
      let rows = load<Company>(KEYS.companies);
      if (search) rows = rows.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
      return rows.sort((a, b) => b.id - a.id);
    },
    get(id: number): Company | undefined {
      return load<Company>(KEYS.companies).find(r => r.id === id);
    },
    add(data: Omit<Company, 'id' | 'created_at'>): Company {
      const rows = load<Company>(KEYS.companies);
      const row: Company = { ...data, id: nextId(rows), created_at: now() } as Company;
      save(KEYS.companies, [...rows, row]);
      return row;
    },
    update(id: number, data: Partial<Company>): Company {
      const rows = load<Company>(KEYS.companies);
      const updated = rows.map(r => r.id === id ? { ...r, ...data } : r);
      save(KEYS.companies, updated);
      return updated.find(r => r.id === id)!;
    },
    remove(id: number): void {
      save(KEYS.companies, load<Company>(KEYS.companies).filter(r => r.id !== id));
    },
  },

  contacts: {
    list(search?: string, status?: string): Contact[] {
      let rows = load<Contact>(KEYS.contacts);
      if (search) rows = rows.filter(r =>
        `${r.first_name} ${r.last_name} ${r.email}`.toLowerCase().includes(search.toLowerCase()));
      if (status) rows = rows.filter(r => r.status === status);
      return rows.sort((a, b) => b.id - a.id);
    },
    get(id: number): Contact | undefined {
      return load<Contact>(KEYS.contacts).find(r => r.id === id);
    },
    add(data: Omit<Contact, 'id' | 'created_at'>): Contact {
      const rows = load<Contact>(KEYS.contacts);
      const row: Contact = { ...data, id: nextId(rows), created_at: now() } as Contact;
      save(KEYS.contacts, [...rows, row]);
      return row;
    },
    update(id: number, data: Partial<Contact>): Contact {
      const rows = load<Contact>(KEYS.contacts);
      const updated = rows.map(r => r.id === id ? { ...r, ...data } : r);
      save(KEYS.contacts, updated);
      return updated.find(r => r.id === id)!;
    },
    remove(id: number): void {
      save(KEYS.contacts, load<Contact>(KEYS.contacts).filter(r => r.id !== id));
    },
  },

  deals: {
    list(stage?: string, contactId?: number): Deal[] {
      let rows = load<Deal>(KEYS.deals);
      if (stage) rows = rows.filter(r => r.stage === stage);
      if (contactId) rows = rows.filter(r => r.contact_id === contactId);
      return rows.sort((a, b) => b.id - a.id);
    },
    get(id: number): Deal | undefined {
      return load<Deal>(KEYS.deals).find(r => r.id === id);
    },
    add(data: Omit<Deal, 'id' | 'created_at'>): Deal {
      const rows = load<Deal>(KEYS.deals);
      const row: Deal = { ...data, id: nextId(rows), created_at: now() } as Deal;
      save(KEYS.deals, [...rows, row]);
      return row;
    },
    update(id: number, data: Partial<Deal>): Deal {
      const rows = load<Deal>(KEYS.deals);
      const updated = rows.map(r => r.id === id ? { ...r, ...data } : r);
      save(KEYS.deals, updated);
      return updated.find(r => r.id === id)!;
    },
    remove(id: number): void {
      save(KEYS.deals, load<Deal>(KEYS.deals).filter(r => r.id !== id));
    },
  },

  activities: {
    list(type?: string, contactId?: number, dealId?: number): Activity[] {
      let rows = load<Activity>(KEYS.activities);
      if (type) rows = rows.filter(r => r.type === type);
      if (contactId) rows = rows.filter(r => r.contact_id === contactId);
      if (dealId) rows = rows.filter(r => r.deal_id === dealId);
      return rows.sort((a, b) => b.id - a.id);
    },
    add(data: Omit<Activity, 'id' | 'created_at'>): Activity {
      const rows = load<Activity>(KEYS.activities);
      const row: Activity = { ...data, id: nextId(rows), created_at: now() } as Activity;
      save(KEYS.activities, [...rows, row]);
      return row;
    },
    update(id: number, data: Partial<Activity>): Activity {
      const rows = load<Activity>(KEYS.activities);
      const updated = rows.map(r => r.id === id ? { ...r, ...data } : r);
      save(KEYS.activities, updated);
      return updated.find(r => r.id === id)!;
    },
    remove(id: number): void {
      save(KEYS.activities, load<Activity>(KEYS.activities).filter(r => r.id !== id));
    },
  },

  stats() {
    const contacts   = load<Contact>(KEYS.contacts);
    const companies  = load<Company>(KEYS.companies);
    const deals      = load<Deal>(KEYS.deals);
    const activities = load<Activity>(KEYS.activities);

    const totalRevenue   = deals.filter(d => d.stage === 'closed_won').reduce((s, d) => s + (d.value || 0), 0);
    const pipelineValue  = deals.filter(d => !['closed_won','closed_lost'].includes(d.stage)).reduce((s, d) => s + (d.value || 0), 0);
    const wonDeals       = deals.filter(d => d.stage === 'closed_won').length;
    const winRate        = deals.length > 0 ? Math.round((wonDeals / deals.length) * 100) : 0;

    const stageBreakdown: Record<string, number> = {};
    for (const d of deals) stageBreakdown[d.stage] = (stageBreakdown[d.stage] || 0) + 1;

    const statusBreakdown: Record<string, number> = {};
    for (const c of contacts) statusBreakdown[c.status] = (statusBreakdown[c.status] || 0) + 1;

    return {
      totalContacts:    contacts.length,
      totalCompanies:   companies.length,
      totalDeals:       deals.length,
      totalRevenue,
      pipelineValue,
      winRate,
      pendingActivities: activities.filter(a => !a.completed).length,
      stageBreakdown,
      statusBreakdown,
    };
  },
};
