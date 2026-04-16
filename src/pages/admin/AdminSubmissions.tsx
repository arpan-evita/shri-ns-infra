import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Eye, Search, Filter, RefreshCw, CheckCircle, Clock, XCircle, AlertCircle, Download, ExternalLink, Mail, Phone } from 'lucide-react';

type Status = 'pending' | 'reviewing' | 'approved' | 'rejected';

interface Submission {
  id: string;
  created_at: string;
  reference_id: string;
  status: Status;
  project_name: string;
  developer_name: string;
  property_type: string;
  listing_status: string;
  city: string;
  state: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  form_data: Record<string, string>;
}

const STATUS_CONFIG: Record<Status, { label: string; icon: typeof Clock; color: string; bg: string }> = {
  pending:   { label: 'Pending',   icon: Clock,         color: 'text-amber-400',  bg: 'bg-amber-400/10 border-amber-400/20' },
  reviewing: { label: 'Reviewing', icon: AlertCircle,   color: 'text-blue-400',   bg: 'bg-blue-400/10 border-blue-400/20' },
  approved:  { label: 'Approved',  icon: CheckCircle,   color: 'text-emerald-400',bg: 'bg-emerald-400/10 border-emerald-400/20' },
  rejected:  { label: 'Rejected',  icon: XCircle,       color: 'text-red-400',    bg: 'bg-red-400/10 border-red-400/20' },
};

const DETAIL_GROUPS = [
  { label: 'Basic Info', keys: ['Project Name','Developer Name','Property Type','Listing Status','RERA Number','Project Tagline'] },
  { label: 'Location',   keys: ['Address','City','State','Pincode','Nearby Landmarks','Google Maps Link'] },
  { label: 'Description',keys: ['Short Description','Full Description','USP'] },
  { label: 'Pricing',    keys: ['Starting Price','Maximum Price','Price per Sqft','Maintenance Charge','Configurations','Min Size (sqft)','Max Size (sqft)','Total Units','Available Units'] },
  { label: 'Amenities',  keys: ['Amenities','Additional Amenities'] },
  { label: 'Timeline',   keys: ['Launch Date','Possession Date','Construction Status','Construction %','RERA Expiry','Construction Update'] },
  { label: 'Legal',      keys: ['Approved By','Land Title','Total Land Area','Total Floors/Towers','Bank Approvals','Legal Notes'] },
  { label: 'Media',      keys: ['Featured Image URL','Gallery Images','Brochure URL','Video URL'] },
  { label: 'Contact',    keys: ['Contact Person','Designation','Phone','Alternate Phone','Email','Website','Site Office Address','Site Visit Timings'] },
  { label: 'Notes',      keys: ['Additional Notes'] },
];

export const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [selected, setSelected] = useState<Submission | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('project_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    setSubmissions((data as Submission[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const updateStatus = async (id: string, status: Status) => {
    setUpdating(true);
    await supabase.from('project_submissions').update({ status }).eq('id', id);
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
    setUpdating(false);
  };

  const exportCSV = () => {
    const visible = filtered;
    if (!visible.length) return;
    const allKeys = ['reference_id','created_at','status','project_name','developer_name','property_type','listing_status','city','state','contact_name','contact_phone','contact_email'];
    const header = allKeys.join(',');
    const rows = visible.map(s => allKeys.map(k => `"${(s as any)[k] ?? ''}"`).join(',')).join('\n');
    const blob = new Blob([header + '\n' + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'project_submissions.csv'; a.click();
  };

  const filtered = submissions.filter(s => {
    const q = search.toLowerCase();
    const matchQ = !q || [s.project_name, s.developer_name, s.city, s.contact_name, s.reference_id].some(v => v?.toLowerCase().includes(q));
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchQ && matchStatus;
  });

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    reviewing: submissions.filter(s => s.status === 'reviewing').length,
    approved: submissions.filter(s => s.status === 'approved').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Project Submissions</h1>
          <p className="text-sm text-slate-500 mt-1">Developer & Builder partner submissions</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 border border-white/10 text-slate-400 hover:text-white hover:border-white/30 rounded-lg text-sm transition-all">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={fetch} className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 rounded-lg text-sm transition-all">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-white' },
          { label: 'Pending', value: stats.pending, color: 'text-amber-400' },
          { label: 'Reviewing', value: stats.reviewing, color: 'text-blue-400' },
          { label: 'Approved', value: stats.approved, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#12110c] border border-white/5 rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search project, developer, city..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#12110c] border border-white/10 text-white text-sm rounded-lg outline-none focus:border-primary/50 placeholder:text-slate-600" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}
            className="bg-[#12110c] border border-white/10 text-white text-sm px-3 py-2.5 rounded-lg outline-none focus:border-primary/50 cursor-pointer">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#12110c] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left">
                {['Ref / Date','Project','Developer','Type','City','Contact','Status','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-16 text-slate-600">Loading submissions...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 text-slate-600">No submissions found</td></tr>
              ) : filtered.map(sub => {
                const cfg = STATUS_CONFIG[sub.status];
                const StatusIcon = cfg.icon;
                return (
                  <tr key={sub.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-[10px] font-bold text-primary tracking-wider">{sub.reference_id}</p>
                      <p className="text-[10px] text-slate-600">{new Date(sub.created_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</p>
                    </td>
                    <td className="px-4 py-3 max-w-[160px]">
                      <p className="font-semibold text-white text-xs truncate">{sub.project_name || '—'}</p>
                      <p className="text-[10px] text-slate-500">{sub.listing_status}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 max-w-[120px] truncate">{sub.developer_name || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{sub.property_type || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{sub.city}{sub.state ? `, ${sub.state}` : ''}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-white">{sub.contact_name || '—'}</p>
                      <p className="text-[10px] text-slate-500">{sub.contact_phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${cfg.bg} ${cfg.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(sub)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-primary/10 hover:text-primary text-slate-400 rounded-lg text-xs transition-all border border-white/5 hover:border-primary/30">
                        <Eye className="w-3 h-3" /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-white/5 text-[11px] text-slate-600">
            Showing {filtered.length} of {submissions.length} submissions
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setSelected(null)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-[#0e0d09] border-l border-white/10 z-50 overflow-y-auto">
            {/* Drawer header */}
            <div className="sticky top-0 bg-[#0e0d09] border-b border-white/10 p-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] text-primary font-bold tracking-widest mb-1">{selected.reference_id}</p>
                <h2 className="text-xl font-black text-white">{selected.project_name || 'Untitled Project'}</h2>
                <p className="text-sm text-slate-500">{selected.developer_name}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all text-lg shrink-0">✕</button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status selector */}
              <div className="flex items-center gap-3 flex-wrap">
                {(Object.keys(STATUS_CONFIG) as Status[]).map(s => {
                  const cfg = STATUS_CONFIG[s];
                  const Icon = cfg.icon;
                  return (
                    <button key={s} disabled={updating || selected.status === s}
                      onClick={() => updateStatus(selected.id, s)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold uppercase tracking-wider transition-all
                        ${selected.status === s ? `${cfg.bg} ${cfg.color} border-opacity-100` : 'border-white/10 text-slate-500 hover:border-white/30 hover:text-white'}`}>
                      <Icon className="w-3.5 h-3.5" /> {cfg.label}
                    </button>
                  );
                })}
              </div>

              {/* Quick contact */}
              <div className="flex gap-3 flex-wrap">
                {selected.contact_email && (
                  <a href={`mailto:${selected.contact_email}`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-xs hover:bg-blue-500/20 transition-all">
                    <Mail className="w-3.5 h-3.5" /> {selected.contact_email}
                  </a>
                )}
                {selected.contact_phone && (
                  <a href={`tel:${selected.contact_phone}`}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs hover:bg-emerald-500/20 transition-all">
                    <Phone className="w-3.5 h-3.5" /> {selected.contact_phone}
                  </a>
                )}
              </div>

              {/* All fields grouped */}
              {DETAIL_GROUPS.map(group => {
                const items = group.keys
                  .map(k => ({ key: k, val: selected.form_data?.[k] }))
                  .filter(i => i.val);
                if (!items.length) return null;
                return (
                  <div key={group.label} className="bg-white/[0.025] border border-white/5 rounded-xl overflow-hidden">
                    <div className="px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{group.label}</h3>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {items.map(({ key, val }) => (
                        <div key={key} className={key.includes('Description') || key === 'USP' || key === 'Amenities' || key === 'Gallery Images' ? 'col-span-2' : ''}>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">{key}</p>
                          {key === 'Featured Image URL' && val.startsWith('http') ? (
                            <a href={val} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-400 hover:underline">
                              <ExternalLink className="w-3 h-3" /> View Image
                            </a>
                          ) : key === 'Google Maps Link' && val.startsWith('http') ? (
                            <a href={val} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-400 hover:underline">
                              <ExternalLink className="w-3 h-3" /> Open Maps
                            </a>
                          ) : (
                            <p className="text-xs text-white/80 leading-relaxed whitespace-pre-wrap break-words">{val}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
