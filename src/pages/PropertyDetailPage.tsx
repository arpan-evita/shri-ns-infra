import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { 
  MapPin, 
  Phone,
  Mail,
  Shield,
  Construction,
} from "lucide-react";
import { 
  Modal, 
  message 
} from 'antd';

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
    <div className="bg-[#0a0a0a] min-h-screen pb-24 selection:bg-primary/30 selection:text-white font-['Inter']">
      {/* 1. Custom Project Banner */}
      <section className="relative h-[400px] md:h-[500px] w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={featuredImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"} 
            className="h-full w-full object-cover"
            alt="Banner Background"
          />
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full space-y-4 md:space-y-6">
          <div className="space-y-2">
            <span className="text-primary text-lg md:text-2xl font-light uppercase tracking-widest block animate-fade-in">Single Project</span>
            <h1 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none m-0">
              {property.title}
            </h1>
          </div>
          
          <nav className="flex items-center gap-3 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">
             <Link to="/" className="hover:text-primary transition-colors">Home</Link>
             <span className="text-primary">/</span>
             <Link to="/properties" className="hover:text-primary transition-colors">Single Project</Link>
             <span className="text-primary">/</span>
             <span className="text-white">{property.title}</span>
          </nav>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 -mt-20 md:-mt-32 relative z-20">
        {/* 2. Main Visual Section */}
        <div className="border border-white/10 bg-black p-1 md:p-2 mb-0">
           <img 
             src={featuredImage} 
             className="w-full aspect-video md:aspect-[21/9] object-cover" 
             alt={property.title} 
           />
        </div>

        {/* 3. Metadata Info Bar */}
        <div className="bg-black border-x border-b border-white/10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
           <div className="p-6 md:p-10 flex items-center gap-6 group hover:bg-white/[0.02] transition-colors">
              <div className="text-primary">
                 <Shield className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <div className="space-y-1">
                <div className="text-white font-black text-lg md:text-xl uppercase tracking-tighter">Client Project</div>
                <div className="text-primary font-bold text-[10px] md:text-xs uppercase tracking-widest">Shri NS Infra</div>
              </div>
           </div>
           <div className="p-6 md:p-10 flex items-center gap-6 group hover:bg-white/[0.02] transition-colors">
              <div className="text-primary">
                 <Construction className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <div className="space-y-1">
                <div className="text-white font-black text-lg md:text-xl uppercase tracking-tighter">Project Date</div>
                <div className="text-primary font-bold text-[10px] md:text-xs uppercase tracking-widest">{property.possession_date || 'Enquire Now'}</div>
              </div>
           </div>
           <div className="p-6 md:p-10 flex items-center gap-6 group hover:bg-white/[0.02] transition-colors">
              <div className="text-primary">
                 <MapPin className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <div className="space-y-1">
                <div className="text-white font-black text-lg md:text-xl uppercase tracking-tighter">Location</div>
                <div className="text-primary font-bold text-[10px] md:text-xs uppercase tracking-widest">{property.city}</div>
              </div>
           </div>
        </div>

        {/* 4. Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16 md:mt-24">
          
          {/* Left Column: Narrative */}
          <div className="lg:col-span-8 space-y-12 md:space-y-20">
            <div className="space-y-8 text-left">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none m-0">
                   {property.title}
                </h2>
                <div className="h-1 w-20 bg-primary" />
              </div>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed font-medium text-justify whitespace-pre-line">
                {property.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.highlights?.split('\n').filter((h: string) => h.trim().length > 0).map((h: string, i: number) => (
                  <div key={i} className="flex items-start gap-4 text-slate-400 font-bold text-xs md:text-sm border-l-2 border-primary/30 pl-4 py-1">
                    <span className="uppercase tracking-tight leading-tight">{h.trim()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            <div className="space-y-10">
               <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter m-0">Visual Showcase</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {property.property_images?.filter((img: any) => !img.is_featured).map((img: any, i: number) => (
                   <div key={i} className="aspect-video bg-white/5 border border-white/10 group cursor-pointer overflow-hidden" onClick={() => setActivePlan(img.image_url)}>
                      <img src={img.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Gallery" />
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4 space-y-12">
            
            {/* Head Project Profile */}
            <div className="bg-[#0f0f0f] border border-white/10 p-8 md:p-12 space-y-10">
               <div className="space-y-4">
                 <h4 className="text-white uppercase tracking-tighter font-black text-2xl m-0">Head Project</h4>
                 <div className="h-1 w-12 bg-primary" />
               </div>
               
               <div className="flex flex-col items-center text-center space-y-8">
                 <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-primary p-1.5 bg-black">
                   <img 
                     src={property.agents?.photo || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop"} 
                     className="w-full h-full object-cover rounded-full" 
                     alt="Agent Profile" 
                   />
                 </div>
                 <div className="space-y-2">
                    <div className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none">{property.agents?.name || "Ajay Sharma"}</div>
                    <div className="text-primary text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">{property.agents?.position || "CEO | Founder"}</div>
                 </div>
                 
                 <div className="w-full pt-6 border-t border-white/10 flex justify-center gap-6">
                    <a href={`tel:${property.agents?.phone}`} className="text-white hover:text-primary transition-colors"><Phone className="w-6 h-6" /></a>
                    <a href={`mailto:${property.agents?.email}`} className="text-white hover:text-primary transition-colors"><Mail className="w-6 h-6" /></a>
                 </div>
               </div>
            </div>

            {/* Quick Action */}
            <div className="bg-primary p-10 space-y-8 shadow-2xl shadow-primary/20">
               <div className="space-y-2">
                 <h3 className="text-4xl font-black text-black uppercase tracking-tighter leading-none m-0">Inquire</h3>
                 <p className="text-black/60 text-[10px] font-black uppercase tracking-widest">Connect with our consultant.</p>
               </div>
               
               <form className="space-y-4" onSubmit={handleLeadSubmit}>
                  <input name="name" required placeholder="Identity" className="w-full bg-black/10 border-b-2 border-black/10 p-4 text-black focus:outline-none placeholder:text-black/40 font-black text-xs uppercase tracking-widest transition-all focus:border-black rounded-none" />
                  <input name="phone" required placeholder="Contact" className="w-full bg-black/10 border-b-2 border-black/10 p-4 text-black focus:outline-none placeholder:text-black/40 font-black text-xs uppercase tracking-widest transition-all focus:border-black rounded-none" />
                  <button 
                    type="submit"
                    className="w-full bg-black text-white font-black py-6 uppercase tracking-[0.3em] text-xs transition-all active:scale-95 hover:bg-black/90"
                  >
                    ESTABLISH CONTACT
                  </button>
               </form>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Location Map Section */}
      {property.map_embed_url && (
      <section className="mt-16 md:mt-24">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none m-0">
              Location
            </h2>
            <div className="h-1 w-20 bg-primary" />
            <p className="text-slate-500 text-sm md:text-base font-bold uppercase tracking-widest">
              {property.location ? `${property.location}, ` : ''}{property.city || ''}
            </p>
          </div>

          <div className="border border-white/10 bg-black p-1 md:p-2">
            <iframe
              src={property.map_embed_url}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale hover:grayscale-0 transition-all duration-700 w-full"
            ></iframe>
          </div>
        </div>
      </section>
      )}

      {/* Plan Modal */}
      <Modal
        open={!!activePlan}
        onCancel={() => setActivePlan(null)}
        footer={null}
        width={1000}
        centered
        className="premium-modal-sharp"
        styles={{ body: { background: '#000', padding: 0 } }}
      >
        <img src={activePlan || ""} className="w-full h-auto p-4" alt="Property View" />
      </Modal>

      <style dangerouslySetInnerHTML={{ __html: `
        .premium-modal-sharp .ant-modal-content {
          border-radius: 0 !important;
          background: #000 !important;
          border: 1px solid rgba(255,255,255,0.1);
        }
      ` }} />
    </div>
  );
};
