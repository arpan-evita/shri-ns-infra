import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronRight, ChevronLeft, Check, Loader2, UploadCloud, Link2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  // Step 1
  projectName: string; developerName: string; propertyType: string;
  listingStatus: string; reraNumber: string; projectTagline: string;
  // Step 2
  featuredImage: string; featuredImageFile?: File | null;
  galleryImages: string[]; galleryFiles?: (File | null)[];
  brochureUrl: string; brochureFile?: File | null; videoUrl: string;
  // Step 3
  address: string; city: string; state: string; pincode: string;
  googleMapsUrl: string; nearbyLandmarks: string;
  // Step 4
  shortDesc: string; fullDesc: string; usp: string;
  // Step 5
  totalUnits: string; availableUnits: string; minPrice: string; maxPrice: string;
  pricePerSqft: string; maintenanceCharge: string; configurations: string;
  minSize: string; maxSize: string;
  // Step 6
  amenities: string[]; additionalAmenities: string;
  // Step 7
  launchDate: string; possessionDate: string; constructionStatus: string;
  constructionPercent: string; reraExpiryDate: string; constructionUpdates: string;
  // Step 8
  approvedBy: string; landTitle: string; totalArea: string; totalFloors: string;
  bankApprovals: string; legalNote: string;
  // Step 9
  contactName: string; contactDesignation: string; contactPhone: string;
  contactAltPhone: string; contactEmail: string; contactWebsite: string;
  siteOfficeAddress: string; siteVisitTiming: string;
  // Step 10
  additionalNotes: string;
}

const INITIAL: FormData = {
  projectName: '', developerName: '', propertyType: '', listingStatus: '',
  reraNumber: '', projectTagline: '', featuredImage: '', featuredImageFile: null,
  galleryImages: ['', ''], galleryFiles: [null, null], brochureUrl: '', brochureFile: null, videoUrl: '',
  address: '', city: '', state: '', pincode: '', googleMapsUrl: '', nearbyLandmarks: '',
  shortDesc: '', fullDesc: '', usp: '',
  totalUnits: '', availableUnits: '', minPrice: '', maxPrice: '', pricePerSqft: '',
  maintenanceCharge: '', configurations: '', minSize: '', maxSize: '',
  amenities: [], additionalAmenities: '',
  launchDate: '', possessionDate: '', constructionStatus: '', constructionPercent: '',
  reraExpiryDate: '', constructionUpdates: '',
  approvedBy: '', landTitle: '', totalArea: '', totalFloors: '', bankApprovals: '', legalNote: '',
  contactName: '', contactDesignation: '', contactPhone: '', contactAltPhone: '',
  contactEmail: '', contactWebsite: '', siteOfficeAddress: '', siteVisitTiming: '',
  additionalNotes: '',
};

const AMENITY_LIST = [
  'Swimming Pool','Clubhouse','Gymnasium','Children\'s Play Area','24×7 Security',
  'CCTV Surveillance','Power Backup','Lift / Elevator','Car Parking','Visitor Parking',
  'Jogging Track','Landscaped Gardens','Badminton Court','Tennis Court','Cricket Net',
  'Indoor Games','Yoga / Meditation','Senior Citizen Area','Amphitheatre','Cafeteria',
  'EV Charging','Rainwater Harvesting','Solar Panels','Intercom','Smart Home',
  'ATM','Convenience Store','Salon / Spa','Business Centre','Co-working Space',
];

const STEP_LABELS = ['Basic','Media','Location','Description','Pricing','Amenities','Timeline','Legal','Contact','Review'];
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwPRH7oMqIkjLmy-n9I33MTXHPS2OwpUvV-v_hK1vCkfVdz2S9IKtqNd2diC6wLUWy4Hg/exec';
const DRAFT_KEY = 'snsi_project_draft';

// ─── Toast ────────────────────────────────────────────────────────────────────
type ToastType = 'success' | 'error' | 'info';
interface Toast { id: number; msg: string; type: ToastType }

// ─── Field helpers ─────────────────────────────────────────────────────────
const inputCls = `w-full bg-white/[0.04] border border-white/10 text-white text-sm px-4 py-3 rounded
  outline-none transition-all duration-200 placeholder:text-white/25
  hover:border-[#c4a661]/30 focus:border-[#c4a661] focus:bg-[#c4a661]/[0.04]
  focus:shadow-[0_0_0_3px_rgba(196,166,97,0.08)]`;

const selectCls = `${inputCls} cursor-pointer appearance-none pr-10
  bg-[image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23c4a661' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")]
  bg-no-repeat bg-[position:right_14px_center]`;

const labelCls = 'block text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50 mb-1.5';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mt-2">
      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#c4a661]/60 whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px bg-[#c4a661]/15" />
    </div>
  );
}

// ─── Dual URL/Upload field ──────────────────────────────────────────────────
function ImageUploadField({
  label, urlValue, onUrlChange, onFileChange, previewSrc, accept = 'image/*', placeholder
}: {
  label: string; urlValue: string;
  onUrlChange: (v: string) => void;
  onFileChange: (f: File, preview: string) => void;
  previewSrc?: string;
  accept?: string;
  placeholder?: string;
}) {
  const [mode, setMode] = useState<'url' | 'upload'>(urlValue ? 'url' : 'url');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      onFileChange(file, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className={labelCls}>{label}</label>
        <div className="flex gap-1">
          {(['url', 'upload'] as const).map(m => (
            <button key={m} type="button" onClick={() => setMode(m)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider transition-all border
                ${mode === m ? 'bg-[#c4a661]/15 border-[#c4a661]/50 text-[#c4a661]' : 'border-white/10 text-white/30 hover:text-white/60'}`}>
              {m === 'url' ? <Link2 className="w-3 h-3" /> : <UploadCloud className="w-3 h-3" />}
              {m === 'url' ? 'URL' : 'Upload'}
            </button>
          ))}
        </div>
      </div>

      {mode === 'url' ? (
        <input className={inputCls} type="url" value={urlValue} onChange={e => onUrlChange(e.target.value)}
          placeholder={placeholder || 'https://example.com/image.jpg'} />
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 border border-dashed border-[#c4a661]/30 hover:border-[#c4a661]/60 bg-white/[0.02] hover:bg-[#c4a661]/5 rounded px-4 py-6 cursor-pointer transition-all group">
          <UploadCloud className="w-6 h-6 text-[#c4a661]/50 group-hover:text-[#c4a661] transition-colors" />
          <span className="text-xs text-white/40 group-hover:text-white/70 transition-colors">
            {accept === 'application/pdf,image/*' ? 'Click to upload PDF or image' : 'Click to upload image'}
          </span>
          <span className="text-[10px] text-white/20">JPG, PNG, WEBP up to 5MB</span>
          <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={handleFile} />
        </div>
      )}

      {previewSrc && (
        <div className="relative mt-1 rounded overflow-hidden border border-[#c4a661]/20">
          {previewSrc.startsWith('data:application/pdf') || accept?.includes('pdf') ? (
            <div className="flex items-center gap-3 p-3 bg-white/[0.03]">
              <span className="text-2xl">📄</span>
              <span className="text-xs text-white/60 truncate">PDF file attached</span>
            </div>
          ) : (
            <img src={previewSrc} alt="Preview" className="max-h-44 w-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          )}
          <button type="button" onClick={() => { onUrlChange(''); onFileChange(null as any, ''); }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 text-white/70 hover:text-white flex items-center justify-center text-xs transition-all">
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export const SubmitProjectPage = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(() => {
    try { const s = localStorage.getItem(DRAFT_KEY); return s ? { ...INITIAL, ...JSON.parse(s) } : INITIAL; }
    catch { return INITIAL; }
  });
  const [draftSaved, setDraftSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [refNum, setRefNum] = useState('');

  const set = useCallback(<K extends keyof FormData>(key: K, val: FormData[K]) => {
    setForm(f => ({ ...f, [key]: val }));
  }, []);

  // Auto-save draft
  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    }, 800);
    return () => clearTimeout(t);
  }, [form]);

  const toast = useCallback((msg: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const goTo = (n: number) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const next = () => { if (step < 10) goTo(step + 1); };
  const prev = () => { if (step > 1) goTo(step - 1); };

  const toggleAmenity = (name: string) => {
    set('amenities', form.amenities.includes(name)
      ? form.amenities.filter(a => a !== name)
      : [...form.amenities, name]);
  };

  const updateGallery = (i: number, val: string) => {
    const g = [...form.galleryImages]; g[i] = val; set('galleryImages', g);
  };
  const updateGalleryFile = (i: number, file: File, preview: string) => {
    // Store preview as the gallery image URL for submission tracking
    const g = [...form.galleryImages];
    g[i] = preview || `[File: ${file?.name ?? ''}]`;
    set('galleryImages', g);
  };
  const addGallery = () => {
    if (form.galleryImages.length >= 10) { toast('Maximum 10 gallery images', 'info'); return; }
    set('galleryImages', [...form.galleryImages, '']);
  };
  const removeGallery = (i: number) => {
    if (form.galleryImages.length <= 1) return;
    set('galleryImages', form.galleryImages.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    if (!terms) { toast('Please accept the terms before submitting', 'error'); return; }
    setLoading(true);

    const ref = 'SNSI-' + Date.now().toString(36).toUpperCase();

    // Strip large base64 blobs for storage
    const safeFeatured = form.featuredImage?.startsWith('data:') ? '[Uploaded file]' : form.featuredImage;
    const safeBrochure = form.brochureUrl?.startsWith('data:') ? '[Uploaded file]' : form.brochureUrl;
    const safeGallery = form.galleryImages.filter(Boolean)
      .map(u => u.startsWith('data:') ? '[Uploaded file]' : u).join(' | ');

    const payload: Record<string, string> = {
      'Reference ID': ref,
      'Project Name': form.projectName, 'Developer Name': form.developerName,
      'Property Type': form.propertyType, 'Listing Status': form.listingStatus,
      'RERA Number': form.reraNumber, 'Project Tagline': form.projectTagline,
      'Featured Image URL': safeFeatured, 'Gallery Images': safeGallery,
      'Brochure URL': safeBrochure, 'Video URL': form.videoUrl,
      'Address': form.address, 'City': form.city, 'State': form.state,
      'Pincode': form.pincode, 'Google Maps Link': form.googleMapsUrl,
      'Nearby Landmarks': form.nearbyLandmarks,
      'Short Description': form.shortDesc, 'Full Description': form.fullDesc, 'USP': form.usp,
      'Total Units': form.totalUnits, 'Available Units': form.availableUnits,
      'Starting Price': form.minPrice, 'Maximum Price': form.maxPrice,
      'Price per Sqft': form.pricePerSqft, 'Maintenance Charge': form.maintenanceCharge,
      'Configurations': form.configurations, 'Min Size (sqft)': form.minSize, 'Max Size (sqft)': form.maxSize,
      'Amenities': form.amenities.join(', '), 'Additional Amenities': form.additionalAmenities,
      'Launch Date': form.launchDate, 'Possession Date': form.possessionDate,
      'Construction Status': form.constructionStatus, 'Construction %': form.constructionPercent,
      'RERA Expiry': form.reraExpiryDate, 'Construction Update': form.constructionUpdates,
      'Approved By': form.approvedBy, 'Land Title': form.landTitle,
      'Total Land Area': form.totalArea, 'Total Floors/Towers': form.totalFloors,
      'Bank Approvals': form.bankApprovals, 'Legal Notes': form.legalNote,
      'Contact Person': form.contactName, 'Designation': form.contactDesignation,
      'Phone': form.contactPhone, 'Alternate Phone': form.contactAltPhone,
      'Email': form.contactEmail, 'Website': form.contactWebsite,
      'Site Office Address': form.siteOfficeAddress, 'Site Visit Timings': form.siteVisitTiming,
      'Additional Notes': form.additionalNotes,
    };

    // 1. Save to Supabase (non-blocking)
    void (async () => {
      try {
        await supabase.from('project_submissions').insert({
          reference_id: ref, status: 'pending',
          project_name: form.projectName, developer_name: form.developerName,
          property_type: form.propertyType, listing_status: form.listingStatus,
          city: form.city, state: form.state,
          contact_name: form.contactName, contact_phone: form.contactPhone,
          contact_email: form.contactEmail, form_data: payload,
        });
      } catch (_) { /* non-blocking */ }
    })();


    // 2. Send to Google Sheets (no-cors, fire-and-forget)
    fetch(SHEETS_URL, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});

    setRefNum(ref);
    localStorage.removeItem(DRAFT_KEY);
    setLoading(false);
    setSubmitted(true);
    toast('Project submitted successfully!', 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Progress bar ─────────────────────────────────────────────────────────
  const Progress = () => (
    <div className="mb-10">
      <div className="h-0.5 bg-white/7 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#8B6914] via-[#c4a661] to-[#E8C97A] transition-all duration-500"
          style={{ width: `${((step - 1) / 9) * 100}%` }}
        />
      </div>
      <div className="grid grid-cols-10 gap-1">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const done = n < step, active = n === step;
          return (
            <button key={n} onClick={() => done ? goTo(n) : undefined}
              className={`flex flex-col items-center gap-1 transition-opacity duration-200 ${!done && !active ? 'opacity-30' : 'opacity-100'} ${done ? 'cursor-pointer' : 'cursor-default'}`}>
              <div className={`w-6 h-6 md:w-7 md:h-7 rounded-full border flex items-center justify-center text-[9px] md:text-[10px] font-semibold transition-all duration-200
                ${done ? 'bg-[#c4a661] border-[#c4a661] text-black' : active ? 'border-[#c4a661] text-[#c4a661] bg-[#c4a661]/10 shadow-[0_0_0_4px_rgba(196,166,97,0.1)]' : 'border-white/20 text-white/40'}`}>
                {done ? <Check className="w-3 h-3" /> : n}
              </div>
              <span className="hidden md:block text-[7px] uppercase tracking-wider text-white/40 text-center leading-tight">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  // ─── Step header ──────────────────────────────────────────────────────────
  const StepHeader = ({ title, desc }: { title: string; desc: string }) => (
    <div className="mb-8 pb-6 border-b border-[#c4a661]/15">
      <p className="text-[10px] uppercase tracking-[0.2em] text-[#c4a661] font-semibold mb-2">Step {String(step).padStart(2,'0')} of 10</p>
      <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-1">{title}</h2>
      <p className="text-sm text-white/40 font-light">{desc}</p>
    </div>
  );

  // ─── Nav buttons ──────────────────────────────────────────────────────────
  const Nav = ({ onNext, isLast = false }: { onNext?: () => void; isLast?: boolean }) => (
    <div className="flex items-center justify-between mt-10 pt-7 border-t border-[#c4a661]/15 flex-wrap gap-3">
      {step > 1 ? (
        <button onClick={prev} className="flex items-center gap-2 text-white/50 hover:text-white border border-[#c4a661]/25 hover:border-white/40 px-5 py-2.5 rounded text-[11px] uppercase tracking-[0.15em] font-semibold transition-all">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
      ) : <div />}
      <div className="flex items-center gap-4">
        <span className="text-xs text-white/30 tracking-wide">Step <span className="text-[#c4a661] font-bold">{step}</span> of 10</span>
        {isLast ? (
          <button onClick={handleSubmit} disabled={loading}
            className="flex items-center gap-2 bg-transparent border border-[#c4a661] text-[#c4a661] hover:bg-[#c4a661] hover:text-black px-8 py-3 rounded text-[11px] uppercase tracking-[0.18em] font-semibold transition-all disabled:opacity-50 disabled:pointer-events-none">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? 'Submitting...' : 'Submit Project'}
          </button>
        ) : (
          <button onClick={onNext || next} className="flex items-center gap-2 bg-[#c4a661] text-black hover:bg-[#E8C97A] px-6 py-2.5 rounded text-[11px] uppercase tracking-[0.15em] font-bold transition-all">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  // ─── Submitted screen ──────────────────────────────────────────────────────
  if (submitted) return (
    <div className="min-h-screen bg-[#0a0906] flex items-center justify-center px-6 py-20">
      <div className="text-center max-w-xl">
        <div className="w-20 h-20 rounded-full border-2 border-[#c4a661] mx-auto mb-8 flex items-center justify-center animate-[popIn_0.5s_0.2s_ease_both]">
          <Check className="w-8 h-8 text-[#c4a661]" />
        </div>
        <h2 className="text-4xl font-black text-white mb-3">Project Submitted</h2>
        <p className="text-white/50 leading-relaxed mb-2">Thank you for submitting your project to <strong className="text-[#c4a661]">Shri NS Infra</strong>.<br />Our team will review your listing and get in touch within 2–3 business days.</p>
        <p className="text-xs text-[#c4a661] tracking-[0.15em] mt-4">Reference: {refNum}</p>
        <a href="/" className="inline-block mt-8 border border-[#c4a661]/40 hover:border-[#c4a661] text-white/60 hover:text-white px-6 py-3 rounded text-sm uppercase tracking-widest font-semibold transition-all">
          Back to Home
        </a>
      </div>
    </div>
  );

  // ─── Main render ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0906] relative overflow-x-hidden">
      {/* Subtle gold grid background */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%,rgba(196,166,97,0.08) 0%,transparent 60%)' }} />

      {/* Toast container */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map(t => (
          <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-medium animate-[slideIn_0.28s_ease_both]
            ${t.type === 'success' ? 'bg-green-950/95 border border-green-500/30 text-green-300' :
              t.type === 'error'   ? 'bg-red-950/95 border border-red-500/30 text-red-300' :
                                     'bg-slate-900/95 border border-slate-500/30 text-slate-300'}`}>
            <span>{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 pb-20 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 pb-7 border-b border-[#c4a661]/15 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Shri NS Infra" className="h-10 w-auto" />
            {draftSaved && (
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] text-[#c4a661]/70 border border-[#c4a661]/20 bg-[#c4a661]/5 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c4a661] animate-pulse" /> Draft saved
              </span>
            )}
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#c4a661] border border-[#c4a661]/40 px-4 py-1.5 rounded font-semibold">
            Project Submission Portal
          </span>
        </div>

        {/* Title block */}
        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#c4a661] font-semibold mb-3">Developer & Builder Partner Program</p>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-3">
            Submit Your <span className="text-[#c4a661]">Project</span>
          </h1>
          <p className="text-sm text-white/40 font-light">Complete all 10 steps to list your property with Shri NS Infra's premium network</p>
        </div>

        <Progress />

        {/* ── STEP CARD ── */}
        <div className="bg-white/[0.025] border border-[#c4a661]/18 rounded-lg p-6 md:p-10">

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <StepHeader title="Basic Project Information" desc="Provide the core identity details of your project" />
              <div className="grid gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Project Name"><input className={inputCls} value={form.projectName} onChange={e => set('projectName', e.target.value)} placeholder="e.g. Skyline Residences Phase II" maxLength={120} /></Field>
                  <Field label="Developer / Builder Name"><input className={inputCls} value={form.developerName} onChange={e => set('developerName', e.target.value)} placeholder="e.g. Ansal Properties Ltd." maxLength={100} /></Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Property Type">
                    <select className={selectCls} value={form.propertyType} onChange={e => set('propertyType', e.target.value)}>
                      <option value="">— Select Type —</option>
                      {['Residential','Plot / Land','Commercial','Studio / Service Apartment','Villa / Independent House','Farmhouse'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </Field>
                  <Field label="Listing Status">
                    <select className={selectCls} value={form.listingStatus} onChange={e => set('listingStatus', e.target.value)}>
                      <option value="">— Select Status —</option>
                      {['New Launch','Under Construction','Ready to Move','Resale','Pre-Launch'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="RERA Number"><input className={inputCls} value={form.reraNumber} onChange={e => set('reraNumber', e.target.value)} placeholder="e.g. UP-RERA-PRJ-12345" maxLength={40} /></Field>
                  <Field label="Project Tagline"><input className={inputCls} value={form.projectTagline} onChange={e => set('projectTagline', e.target.value)} placeholder="e.g. Where Luxury Meets Living" maxLength={80} /></Field>
                </div>
              </div>
              <Nav />
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <StepHeader title="Media & Branding" desc="Upload images or provide URLs for your project" />
              <div className="grid gap-6">

                {/* Featured Image */}
                <ImageUploadField
                  label="Featured Image (min 1200×800px recommended)"
                  urlValue={form.featuredImage}
                  onUrlChange={v => set('featuredImage', v)}
                  onFileChange={(file, preview) => {
                    set('featuredImage', preview || (file ? `[File: ${file.name}]` : ''));
                  }}
                  previewSrc={form.featuredImage}
                  placeholder="https://example.com/featured.jpg"
                />

                {/* Gallery */}
                <SectionDivider label="Gallery Images (up to 10)" />
                <div className="flex flex-col gap-3">
                  {form.galleryImages.map((url, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <ImageUploadField
                          label={`Image ${i + 1}`}
                          urlValue={url.startsWith('data:') ? '' : (url.startsWith('[File:') ? '' : url)}
                          onUrlChange={v => updateGallery(i, v)}
                          onFileChange={(file, preview) => updateGalleryFile(i, file, preview)}
                          previewSrc={url || ''}
                          placeholder={`Gallery image URL ${i + 1}`}
                        />
                      </div>
                      <button onClick={() => removeGallery(i)}
                        className="shrink-0 mt-7 w-9 h-9 rounded border border-red-500/25 text-red-400 hover:bg-red-500/10 hover:border-red-500/60 transition-all flex items-center justify-center text-xs">
                        ✕
                      </button>
                    </div>
                  ))}
                  <button onClick={addGallery}
                    className="inline-flex items-center gap-2 text-[#c4a661] border border-dashed border-[#c4a661]/40 hover:border-[#c4a661] hover:bg-[#c4a661]/5 px-4 py-2 rounded text-[11px] uppercase tracking-[0.12em] font-semibold transition-all">
                    + Add Another Image
                  </button>
                </div>

                {/* Brochure + Video */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <ImageUploadField
                    label="Brochure / PDF (Optional)"
                    urlValue={form.brochureUrl}
                    onUrlChange={v => set('brochureUrl', v)}
                    onFileChange={(file, preview) => set('brochureUrl', preview || `[File: ${file?.name}]`)}
                    previewSrc={form.brochureUrl}
                    accept="application/pdf,image/*"
                    placeholder="https://example.com/brochure.pdf"
                  />
                  <Field label="Project Video URL (Optional)">
                    <input className={inputCls} type="url" value={form.videoUrl}
                      onChange={e => set('videoUrl', e.target.value)} placeholder="https://youtube.com/..." />
                  </Field>
                </div>
              </div>
              <Nav />
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <StepHeader title="Location Details" desc="Where is the project located?" />
              <div className="grid gap-5">
                <Field label="Full Address"><input className={inputCls} value={form.address} onChange={e => set('address', e.target.value)} placeholder="e.g. Plot 12, Sector 150, Noida" /></Field>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <Field label="City"><input className={inputCls} value={form.city} onChange={e => set('city', e.target.value)} placeholder="e.g. Noida" /></Field>
                  <Field label="State">
                    <select className={selectCls} value={form.state} onChange={e => set('state', e.target.value)}>
                      <option value="">— Select State —</option>
                      {['Uttar Pradesh','Delhi','Haryana','Rajasthan','Maharashtra','Karnataka','Tamil Nadu','Gujarat','Madhya Pradesh','West Bengal','Telangana','Punjab','Other'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </Field>
                  <Field label="Pincode"><input className={inputCls} value={form.pincode} onChange={e => set('pincode', e.target.value)} placeholder="e.g. 201301" maxLength={6} /></Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Google Maps Link (Optional)"><input className={inputCls} type="url" value={form.googleMapsUrl} onChange={e => set('googleMapsUrl', e.target.value)} placeholder="https://maps.google.com/..." /></Field>
                  <Field label="Nearby Landmarks"><input className={inputCls} value={form.nearbyLandmarks} onChange={e => set('nearbyLandmarks', e.target.value)} placeholder="e.g. 2 km from Noida Expressway" /></Field>
                </div>
              </div>
              <Nav />
            </>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <>
              <StepHeader title="Project Description" desc="Describe your project in detail for potential buyers" />
              <div className="grid gap-5">
                <Field label="Short Description">
                  <textarea className={`${inputCls} resize-y min-h-[80px] leading-relaxed`} value={form.shortDesc} onChange={e => set('shortDesc', e.target.value)} placeholder="Brief overview of the project (2–3 lines)" maxLength={300} rows={3} />
                  <span className={`text-[10px] text-right ${form.shortDesc.length > 270 ? 'text-[#c4a661]' : 'text-white/25'}`}>{form.shortDesc.length} / 300</span>
                </Field>
                <Field label="Full Description">
                  <textarea className={`${inputCls} resize-y min-h-[120px] leading-relaxed`} value={form.fullDesc} onChange={e => set('fullDesc', e.target.value)} placeholder="Detailed description: highlight unique features, surroundings, lifestyle, investment value..." maxLength={2000} rows={6} />
                  <span className={`text-[10px] text-right ${form.fullDesc.length > 1800 ? 'text-[#c4a661]' : 'text-white/25'}`}>{form.fullDesc.length} / 2000</span>
                </Field>
                <Field label="Unique Selling Points (USP)">
                  <textarea className={`${inputCls} resize-y min-h-[80px] leading-relaxed`} value={form.usp} onChange={e => set('usp', e.target.value)} placeholder="e.g. 3-side open plot, south-facing, vastu-compliant, zero stamp duty..." maxLength={500} rows={3} />
                </Field>
              </div>
              <Nav />
            </>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <>
              <StepHeader title="Unit & Pricing Details" desc="Provide unit configurations and pricing information" />
              <div className="grid gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Total Units / Plots"><input className={inputCls} type="number" value={form.totalUnits} onChange={e => set('totalUnits', e.target.value)} placeholder="e.g. 240" min={1} /></Field>
                  <Field label="Available Units"><input className={inputCls} type="number" value={form.availableUnits} onChange={e => set('availableUnits', e.target.value)} placeholder="e.g. 85" min={0} /></Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Starting Price (₹)"><input className={inputCls} value={form.minPrice} onChange={e => set('minPrice', e.target.value)} placeholder="e.g. 45,00,000" /></Field>
                  <Field label="Maximum Price (₹)"><input className={inputCls} value={form.maxPrice} onChange={e => set('maxPrice', e.target.value)} placeholder="e.g. 1,20,00,000" /></Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Price per Sq.ft (₹)"><input className={inputCls} value={form.pricePerSqft} onChange={e => set('pricePerSqft', e.target.value)} placeholder="e.g. 6,500" /></Field>
                  <Field label="Maintenance Charge"><input className={inputCls} value={form.maintenanceCharge} onChange={e => set('maintenanceCharge', e.target.value)} placeholder="e.g. ₹2/sq.ft/month" /></Field>
                </div>
                <Field label="Unit Configurations Available"><input className={inputCls} value={form.configurations} onChange={e => set('configurations', e.target.value)} placeholder="e.g. 2 BHK, 3 BHK, 4 BHK, Studio" /></Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Min Size (sq.ft)"><input className={inputCls} value={form.minSize} onChange={e => set('minSize', e.target.value)} placeholder="e.g. 850" /></Field>
                  <Field label="Max Size (sq.ft)"><input className={inputCls} value={form.maxSize} onChange={e => set('maxSize', e.target.value)} placeholder="e.g. 2,400" /></Field>
                </div>
              </div>
              <Nav />
            </>
          )}

          {/* STEP 6 */}
          {step === 6 && (
            <>
              <StepHeader title="Amenities & Features" desc="Select all amenities available in this project" />
              <SectionDivider label="Select Amenities" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 mb-5">
                {AMENITY_LIST.map(a => (
                  <button key={a} type="button" onClick={() => toggleAmenity(a)}
                    className={`px-3 py-2 rounded text-xs text-center transition-all border leading-snug
                      ${form.amenities.includes(a) ? 'border-[#c4a661] bg-[#c4a661]/10 text-[#c4a661]' : 'border-white/10 text-white/40 hover:border-[#c4a661]/30 hover:text-white/70'}`}>
                    {a}
                  </button>
                ))}
              </div>
              <Field label="Additional Amenities (if any)"><input className={inputCls} value={form.additionalAmenities} onChange={e => set('additionalAmenities', e.target.value)} placeholder="List any other amenities not covered above" /></Field>
              <Nav />
            </>
          )}

          {/* STEP 7 */}
          {step === 7 && (
            <>
              <StepHeader title="Project Timeline" desc="Construction and possession schedule" />
              <div className="grid gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Launch Date"><input className={inputCls} type="month" value={form.launchDate} onChange={e => set('launchDate', e.target.value)} /></Field>
                  <Field label="Expected Possession"><input className={inputCls} type="month" value={form.possessionDate} onChange={e => set('possessionDate', e.target.value)} /></Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Construction Status">
                    <select className={selectCls} value={form.constructionStatus} onChange={e => set('constructionStatus', e.target.value)}>
                      <option value="">— Select —</option>
                      {['Pre-Foundation','Foundation Stage','Structure Complete','Finishing Stage','Ready to Move'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </Field>
                  <Field label="% Construction Complete"><input className={inputCls} type="number" value={form.constructionPercent} onChange={e => set('constructionPercent', e.target.value)} placeholder="e.g. 65" min={0} max={100} /></Field>
                </div>
                <Field label="RERA Expiry Date"><input className={inputCls} type="month" value={form.reraExpiryDate} onChange={e => set('reraExpiryDate', e.target.value)} /></Field>
                <Field label="Latest Construction Update">
                  <textarea className={`${inputCls} resize-y min-h-[80px] leading-relaxed`} value={form.constructionUpdates} onChange={e => set('constructionUpdates', e.target.value)} placeholder="e.g. Tower A – slab casting complete up to 12th floor as of March 2025" maxLength={500} rows={3} />
                </Field>
              </div>
              <Nav />
            </>
          )}

          {/* STEP 8 */}
          {step === 8 && (
            <>
              <StepHeader title="Approvals & Legal Details" desc="Regulatory approvals and legal clearances" />
              <div className="grid gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Approved By"><input className={inputCls} value={form.approvedBy} onChange={e => set('approvedBy', e.target.value)} placeholder="e.g. NIDA, HRERA, BDA, CMDA" /></Field>
                  <Field label="Land Title / Ownership">
                    <select className={selectCls} value={form.landTitle} onChange={e => set('landTitle', e.target.value)}>
                      <option value="">— Select —</option>
                      {['Freehold','Leasehold','Govt. Allotted','Agricultural Conversion'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Total Land Area"><input className={inputCls} value={form.totalArea} onChange={e => set('totalArea', e.target.value)} placeholder="e.g. 5 Acres / 20,000 sq.yd" /></Field>
                  <Field label="Total Floors / Towers"><input className={inputCls} value={form.totalFloors} onChange={e => set('totalFloors', e.target.value)} placeholder="e.g. G+24, 3 Towers" /></Field>
                </div>
                <Field label="Bank / Home Loan Approvals"><input className={inputCls} value={form.bankApprovals} onChange={e => set('bankApprovals', e.target.value)} placeholder="e.g. SBI, HDFC, ICICI, Axis Bank" /></Field>
                <Field label="Legal Notes (Optional)">
                  <textarea className={`${inputCls} resize-y min-h-[80px] leading-relaxed`} value={form.legalNote} onChange={e => set('legalNote', e.target.value)} placeholder="Any encumbrances, litigations, or additional legal details..." maxLength={600} rows={3} />
                </Field>
              </div>
              <Nav />
            </>
          )}

          {/* STEP 9 */}
          {step === 9 && (
            <>
              <StepHeader title="Contact Information" desc="Who should we reach out to regarding this listing?" />
              <div className="grid gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Contact Person Name"><input className={inputCls} value={form.contactName} onChange={e => set('contactName', e.target.value)} placeholder="e.g. Rajesh Kumar" /></Field>
                  <Field label="Designation"><input className={inputCls} value={form.contactDesignation} onChange={e => set('contactDesignation', e.target.value)} placeholder="e.g. Sales Manager" /></Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Phone Number"><input className={inputCls} type="tel" value={form.contactPhone} onChange={e => set('contactPhone', e.target.value)} placeholder="e.g. +91 98765 43210" /></Field>
                  <Field label="Alternate Phone (Optional)"><input className={inputCls} type="tel" value={form.contactAltPhone} onChange={e => set('contactAltPhone', e.target.value)} placeholder="e.g. +91 98765 43211" /></Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Email Address"><input className={inputCls} type="email" value={form.contactEmail} onChange={e => set('contactEmail', e.target.value)} placeholder="e.g. sales@developer.com" /></Field>
                  <Field label="Developer Website (Optional)"><input className={inputCls} type="url" value={form.contactWebsite} onChange={e => set('contactWebsite', e.target.value)} placeholder="https://www.developer.com" /></Field>
                </div>
                <Field label="Site Office Address (Optional)"><input className={inputCls} value={form.siteOfficeAddress} onChange={e => set('siteOfficeAddress', e.target.value)} placeholder="Address of on-site sales office" /></Field>
                <Field label="Site Visit Timings"><input className={inputCls} value={form.siteVisitTiming} onChange={e => set('siteVisitTiming', e.target.value)} placeholder="e.g. Mon–Sat, 10 AM – 6 PM" /></Field>
              </div>
              <Nav />
            </>
          )}

          {/* STEP 10 */}
          {step === 10 && (
            <>
              <StepHeader title="Review & Submit" desc="Review your submission before sending it to Shri NS Infra" />
              {/* Summary grid */}
              <div className="bg-[#c4a661]/4 border border-[#c4a661]/15 rounded-lg p-5 mb-6">
                <SectionDivider label="Summary" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {[
                    ['Project Name', form.projectName], ['Developer', form.developerName],
                    ['Property Type', form.propertyType], ['Status', form.listingStatus],
                    ['RERA No.', form.reraNumber], ['City', form.city],
                    ['State', form.state], ['Starting Price', form.minPrice],
                    ['Configurations', form.configurations], ['Possession', form.possessionDate],
                    ['Contact', form.contactName], ['Phone', form.contactPhone],
                    ['Email', form.contactEmail],
                  ].filter(([, val]) => val).map(([key, val]) => (
                    <div key={key}>
                      <p className="text-[9px] uppercase tracking-[0.1em] text-white/30 mb-1">{key}</p>
                      <p className="text-xs text-white break-words">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-4">
                <Field label="Additional Notes for Our Team (Optional)">
                  <textarea className={`${inputCls} resize-y min-h-[80px] leading-relaxed`} value={form.additionalNotes} onChange={e => set('additionalNotes', e.target.value)} placeholder="Anything else you'd like us to know..." maxLength={500} rows={3} />
                </Field>
                <label className="flex items-start gap-3 p-4 bg-[#c4a661]/4 border border-[#c4a661]/15 rounded cursor-pointer">
                  <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 shrink-0 accent-[#c4a661]" />
                  <span className="text-sm text-white/50 leading-relaxed">
                    I confirm that all information provided is accurate and I authorise <strong className="text-[#c4a661]">Shri NS Infra</strong> to list this project on their platform and contact me regarding this submission.
                  </span>
                </label>
              </div>
              <Nav isLast />
            </>
          )}
        </div>

        <p className="text-center text-[11px] text-white/20 mt-10 tracking-wide leading-relaxed">
          <strong className="text-[#c4a661]/50">Shri NS Infra</strong> · Developer & Builder Partner Program<br />
          All submissions are reviewed within 48 hours · shrinsinfra@gmail.com
        </p>
      </div>
    </div>
  );
};
