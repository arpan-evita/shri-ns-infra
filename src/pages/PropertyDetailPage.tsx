import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { 
  MapPin, 
  CheckCircle2,
  Phone,
  Mail,
  Download,
  Shield,
  Construction,
  ArrowUpRight
} from "lucide-react";
import { 
  Button, 
  Tag, 
  Typography, 
  Empty, 
  Modal, 
  message 
} from 'antd';
import 'leaflet/dist/leaflet.css';

const { Title } = Typography;

// Icon Mapping for Amenities
const AmenityIcons: Record<string, any> = {
  'Security': Shield,
  'Swimming Pool': Construction,
  'Gym': Construction,
  'WiFi': Construction,
  'Clubhouse': Construction,
  'Garden': Construction,
  'Parking': Construction,
  'Power Backup': Construction,
  'Elevator': Construction,
  'CCTV': Shield,
  'Lift': Construction,
  'Park': Construction,
  'MEP': Construction,
  'AC Provision': CheckCircle2,
  'Conditioning': CheckCircle2,
  'Inlet': CheckCircle2,
  'Outlet': CheckCircle2,
  'Toilets': CheckCircle2,
  'Facing': CheckCircle2,
};

export const PropertyDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePlan, setActivePlan] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          agents(*),
          property_images(*),
          property_floor_plans(*),
          property_amenity_relation(amenities(*)),
          nearby_places(*)
        `)
        .eq('slug', slug)
        .single();

      if (error || !data) {
        navigate('/properties');
      } else {
        setProperty(data);

        // Update SEO Tags
        if (data.meta_title) document.title = `${data.meta_title} | Shri NS Infra`;
        else document.title = `${data.title} | Shri NS Infra`;

        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', data.meta_description || data.description.substring(0, 160));
        }
      }
      setLoading(false);
    };

    fetchProperty();
  }, [slug, navigate]);

  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const leadData = {
      property_id: property.id,
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
      source: 'Property Detail Page',
      status: 'New'
    };

    if (!leadData.name || !leadData.phone) {
       message.warning("Please provide your name and phone number");
       return;
    }

    const { error } = await supabase.from('property_leads').insert([leadData]);

    if (error) {
       message.error("Failed to send inquiry: " + error.message);
    } else {
       message.success("Your inquiry has been established. Our consultant will contact you shortly.");
       (e.target as HTMLFormElement).reset();
    }
  };

  if (loading) return <div className="pt-32 px-6 text-center text-slate-500 min-h-screen flex items-center justify-center bg-[#0a0a0a] font-black uppercase tracking-[0.5em] animate-pulse">Engineering your premium view...</div>;
  if (!property) return null;

  const featuredImage = property.property_images?.find((img: any) => img.is_featured)?.image_url || property.property_images?.[0]?.image_url;

  return (
    <div className="bg-[#0a0a0a] min-h-screen pb-24 selection:bg-primary/30 selection:text-white">
      {/* 1. Bold Hero Header Section */}
      <section className="bg-black pt-28 md:pt-32 pb-12 md:pb-20 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
             <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate('/')}>Home</span>
             <span className="text-white/20">/</span>
             <span className="text-primary">{property.title}</span>
          </nav>
          
          <div className="space-y-2 text-left">
            <h1 className="text-3xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none md:leading-[0.8] mb-0">
               {property.title}
            </h1>
            <p className="text-lg md:text-4xl font-bold text-primary/80 uppercase tracking-tighter">
               {property.tagline || `The Best of ${property.location || property.city}`}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Main Visual Section */}
      <section className="px-6 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl md:rounded-[3rem] overflow-hidden border border-white/10 group relative aspect-video md:aspect-[21/9]">
             <img 
               src={featuredImage || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"} 
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[5s]" 
               alt={property.title} 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6 md:p-12">
                <div className="flex flex-wrap gap-2 md:gap-4">
                   <Tag className="bg-primary text-black border-none font-black uppercase tracking-widest px-4 md:px-8 py-2 md:py-3 rounded-full text-[10px] md:text-[11px] shadow-2xl m-0">
                     {property.property_type}
                   </Tag>
                   <Tag className="bg-black/50 text-white border-white/20 backdrop-blur-3xl font-black uppercase tracking-widest px-4 md:px-8 py-2 md:py-3 rounded-full text-[10px] md:text-[11px] m-0">
                     {property.possession_status}
                   </Tag>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 3. Quick Stats Grid (The "Wow" Info Bar) */}
      <section className="px-6 md:-mt-10 mb-12 md:mb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-0.5 p-0.5 md:gap-1 md:p-1 bg-white/10 rounded-2xl md:rounded-[2.5rem] border border-white/5 overflow-hidden">
           <div className="bg-[#111] p-6 md:p-10 flex items-center gap-4 md:gap-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center text-primary border border-white/10 shrink-0">
                 <Shield className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <div className="text-white font-black text-lg md:text-xl uppercase tracking-tighter leading-tight">RERA Number</div>
                <div className="text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-widest mt-1">'{property.rera_registration_id || 'REGISTERED'}'</div>
              </div>
           </div>
           <div className="bg-[#111] p-6 md:p-10 flex items-center gap-4 md:gap-6 border-y md:border-y-0 md:border-x border-white/5">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center text-primary border border-white/10 shrink-0">
                 <MapPin className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <div className="text-white font-black text-lg md:text-xl uppercase tracking-tighter leading-tight">Location</div>
                <div className="text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-widest mt-1">{property.location}, {property.city}</div>
              </div>
           </div>
           <div className="bg-[#111] p-6 md:p-10 flex items-center gap-4 md:gap-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center text-black shadow-xl shadow-primary/20 shrink-0">
                 <Construction className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <div className="text-white font-black text-lg md:text-xl uppercase tracking-tighter leading-tight truncate max-w-[150px] md:max-w-none">{property.title}</div>
                <div className="text-primary font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] mt-1">{property.tagline || 'Premium Project'}</div>
              </div>
           </div>
        </div>
      </section>

      {/* 4. Secondary Content Layout */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
          
          {/* Main Info Side */}
          <div className="lg:col-span-8 space-y-16 md:space-y-24">
            
            {/* Story & Description */}
            <div className="space-y-6 md:space-y-10 text-left">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="h-[2px] md:h-[3px] w-12 md:w-20 bg-primary" />
                <Title level={2} className="text-white uppercase tracking-tighter mb-0 text-2xl md:text-4xl">Project Narrative</Title>
              </div>
              <p className="text-sm md:text-lg text-slate-500 leading-relaxed whitespace-pre-line font-medium text-justify">
                {property.description}
              </p>
              
              {/* Highlights List */}
              <div className="space-y-4 pt-4">
                 <Title level={4} className="text-white uppercase tracking-widest text-[10px] md:text-xs font-black">Project Highlights</Title>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {property.highlights?.split('\n').filter((h: string) => h.trim().length > 0).map((h: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 text-slate-400 font-bold text-xs md:text-sm">
                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" />
                        <span className="uppercase tracking-tight leading-tight">{h.trim()}</span>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            {/* Premium Amenities */}
            <div className="space-y-8 md:space-y-12 text-left">
              <Title level={3} className="text-white uppercase tracking-tighter text-2xl md:text-3xl">Premium Facilities</Title>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-0.5 md:gap-1 bg-white/10 rounded-2xl md:rounded-[2rem] overflow-hidden p-0.5 md:p-1">
                {property.property_amenity_relation?.length > 0 ? (
                  property.property_amenity_relation.map((relation: any, i: number) => {
                    const amenity = relation.amenities;
                    const Icon = AmenityIcons[amenity.name] || CheckCircle2;
                    return (
                      <div key={i} className="bg-[#111] p-4 md:p-8 flex flex-col md:flex-row items-center md:items-center gap-3 md:gap-6 border-transparent hover:border-primary/20 transition-all group">
                        <div className="w-10 md:w-12 h-10 md:h-12 bg-white/5 border border-white/10 rounded-lg md:rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Icon className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="text-white font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-[8px] md:text-[10px] text-center md:text-left">{amenity.name}</div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full bg-[#111] p-12 md:p-20 text-center">
                    <Empty description={<span className="text-slate-500 uppercase font-black text-[10px] tracking-widest">Amenities verified upon request</span>} />
                  </div>
                )}
              </div>
            </div>

            {/* Project Images Gallery */}
            <div className="space-y-8 md:space-y-12">
               <div className="text-center">
                 <Title level={3} className="text-white uppercase tracking-tighter text-2xl md:text-3xl mb-2">Project Images</Title>
                 <div className="h-[2px] md:h-[3px] w-12 md:w-20 bg-primary mx-auto" />
               </div>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                 {property.property_images?.filter((img: any) => !img.is_featured).map((img: any, i: number) => (
                   <div key={i} className="aspect-square rounded-xl md:rounded-[2rem] overflow-hidden border border-white/10 group cursor-pointer" onClick={() => setActivePlan(img.image_url)}>
                      <img src={img.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 font-bold" alt="Property Detail" />
                   </div>
                 ))}
               </div>
            </div>

          </div>

          {/* Sidebar Section */}
          <div className="lg:col-span-4 space-y-8 md:space-y-12">
            
            {/* Project Lead Profile */}
            <div className="bg-[#111] border border-white/10 p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] space-y-6 md:space-y-8">
               <div className="space-y-2 text-left">
                 <Title level={4} className="text-white uppercase tracking-tighter mb-0 text-xl">Project Architect</Title>
                 <div className="h-[2px] w-12 bg-primary" />
               </div>
               
               <div className="flex flex-col items-center text-center space-y-6">
                 <div className="w-24 md:w-32 h-24 md:h-32 rounded-2xl md:rounded-3xl overflow-hidden border-2 border-primary p-1 bg-black">
                   <img 
                     src={property.agents?.photo || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop"} 
                     className="w-full h-full object-cover rounded-xl md:rounded-2xl filter brightness-95" 
                     alt="Lead Profile" 
                   />
                 </div>
                 <div>
                    <div className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">{property.agents?.name || "Ajay Sharma"}</div>
                    <div className="text-primary text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] mt-1">{property.agents?.position || "CEO | Founder"}</div>
                 </div>
                 <p className="text-slate-500 text-[10px] md:text-xs leading-relaxed font-bold">
                    Leading the vision for sustainable urban development and verified excellence.
                 </p>
                 <div className="flex gap-4">
                    <Button shape="circle" icon={<Phone className="w-4 h-4" />} className="bg-white/5 border-white/10 text-white hover:text-primary h-10 w-10 md:h-12 md:w-12 flex items-center justify-center p-0" />
                    <Button shape="circle" icon={<Mail className="w-4 h-4" />} className="bg-white/5 border-white/10 text-white hover:text-primary h-10 w-10 md:h-12 md:w-12 flex items-center justify-center p-0" />
                 </div>
               </div>
            </div>

            {/* Nearby Landmarks */}
            {property.nearby_places && property.nearby_places.length > 0 && (
              <div className="bg-[#111] border border-white/10 p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] space-y-6 md:space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity hidden md:block">
                  <MapPin className="w-24 h-24 text-white" />
                </div>
                <div className="space-y-2 text-left">
                  <Title level={4} className="text-white uppercase tracking-tighter mb-0 text-xl">Nearby Landmarks</Title>
                  <div className="h-[2px] w-12 bg-primary" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...property.nearby_places].sort((a: any, b: any) => a.distance - b.distance).map((place: any, idx: number) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 flex items-center justify-between group/item hover:bg-white/10 transition-all hover:translate-x-1 duration-300">
                      <div className="flex items-center gap-3 md:gap-4 text-left">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary group-hover/item:scale-110 transition-transform">
                          <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-white font-black uppercase tracking-widest text-[10px] md:text-xs">{place.name}</div>
                          <div className="text-primary text-[8px] md:text-[9px] font-bold uppercase tracking-wider">{place.type}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-black text-xs md:text-sm tracking-tighter">
                          {place.distance} <span className="text-primary text-[10px]">KM</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Brochure */}
            <div className="bg-[#111] border border-white/10 p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] space-y-4 md:space-y-6 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity hidden md:block">
                 <Download className="w-24 h-24 text-white" />
               </div>
               <div className="space-y-2 text-left">
                 <Title level={4} className="text-white uppercase tracking-tighter mb-0 text-xl">Project Brochure</Title>
                 <div className="h-[2px] w-12 bg-primary" />
               </div>
               <div className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 flex items-center justify-between group-hover:bg-white/10 transition-colors cursor-pointer" onClick={() => window.open(property.brochure_url, '_blank')}>
                 <div className="flex items-center gap-4">
                   <div className="w-8 h-8 md:w-10 md:h-10 bg-red-500/20 rounded-lg flex items-center justify-center text-red-500">
                     <Download className="w-4 h-4 md:w-5 md:h-5" />
                   </div>
                   <div className="text-left">
                     <div className="text-white font-black uppercase tracking-widest text-[8px] md:text-[10px]">E -Brochure</div>
                     <div className="text-slate-500 text-[8px] md:text-[9px] font-bold uppercase">Download PDF</div>
                   </div>
                 </div>
                 <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-slate-500 group-hover:text-primary transition-colors" />
               </div>
            </div>

            {/* Connection Form (CTA) */}
            <div className="bg-primary p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] space-y-8 md:space-y-10 shadow-2xl shadow-primary/20 relative overflow-hidden">
               <div className="absolute -top-12 -right-12 w-48 h-48 bg-black/10 rounded-full blur-3xl" />
               <div className="space-y-2 md:space-y-4 relative z-10 text-left">
                 <h3 className="text-4xl md:text-6xl font-black text-black uppercase tracking-tighter leading-[0.8]">Get Details</h3>
                 <p className="text-black/60 text-[9px] md:text-[11px] font-black uppercase tracking-widest">Connect with our luxury consultant.</p>
               </div>
               
               <form className="space-y-3 md:space-y-4 relative z-10" onSubmit={handleLeadSubmit}>
                  <input name="name" required placeholder="Identity" className="w-full bg-black/10 border-b-2 border-black/10 p-3 md:p-4 text-black focus:outline-none placeholder:text-black/40 font-black text-[10px] md:text-xs uppercase tracking-widest transition-all focus:border-black" />
                  <input name="phone" required placeholder="Contact-Point" className="w-full bg-black/10 border-b-2 border-black/10 p-3 md:p-4 text-black focus:outline-none placeholder:text-black/40 font-black text-[10px] md:text-xs uppercase tracking-widest transition-all focus:border-black" />
                  <Button 
                    htmlType="submit"
                    className="w-full bg-black hover:bg-black/90 text-white border-none font-black py-6 md:py-8 rounded-xl md:rounded-[2rem] uppercase tracking-[0.2em] text-[10px] md:text-xs shadow-2xl mt-4 transition-all active:scale-95 flex items-center justify-center"
                  >
                    ESTABLISH CONTACT
                  </Button>
               </form>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .leaflet-container {
          border-radius: 3rem;
          z-index: 0;
        }
        .premium-popup .leaflet-popup-content-wrapper {
          background: #000 !important;
          color: white !important;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
        }
        .premium-popup .leaflet-popup-tip {
          background: #000;
        }
      `}</style>

      {/* Plan Modal */}
      <Modal
        open={!!activePlan}
        onCancel={() => setActivePlan(null)}
        footer={null}
        width={1000}
        centered
        className="premium-modal"
        styles={{ body: { background: '#000', padding: 0 } }}
      >
        <img src={activePlan || ""} className="w-full h-auto p-4" alt="Property View" />
      </Modal>
    </div>
  );
};
