import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { 
  MapPin, 
  Phone,
  Mail,
  Shield,
  Construction,
  Home,
  Compass,
  Car,
  Layers,
  Calendar,
  DollarSign,
  Wind,
  CheckCircle2,
  Lock,
  Waves,
  Dumbbell,
  Wifi,
  Trees,
  CloudLightning,
  Sparkles,
} from "lucide-react";
import { 
  Modal, 
  message,
  Carousel
} from 'antd';
import { sendLeadEmail } from "@/lib/emailService";
import founderImg from '../assets/founder.png';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.845L0 24l6.337-1.662c1.635.891 3.474 1.361 5.341 1.362h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export const PropertyDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          listing_status,
          property_images(*),
          property_floor_plans(*),
          property_amenity_relation(amenities(name, icon)),
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
       // Send Email via Resend
       await sendLeadEmail({
         name: String(leadData.name),
         email: String(leadData.email),
         phone: String(leadData.phone),
         message: String(leadData.message),
         subject: `New Property Inquiry: ${property.title} from ${leadData.name}`
       });

       message.success("Your inquiry has been established. Our consultant will contact you shortly.");
       (e.target as HTMLFormElement).reset();
    }
  };

  if (loading) return <div className="pt-32 px-6 text-center text-slate-500 min-h-screen flex items-center justify-center bg-[#0a0a0a] font-black uppercase tracking-[0.5em] animate-pulse">Engineering your premium view...</div>;
  
  if (!property) return (
    <div className="pt-32 px-6 text-center text-slate-500 min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] space-y-6">
      <div className="text-xl font-black text-white uppercase tracking-widest">Project Not Found</div>
      <p className="text-slate-600 max-w-md uppercase text-[10px] font-bold tracking-[0.2em]">
        We couldn't find the project with the ID "{slug}". 
        Check if the property is published in the Admin Panel.
      </p>
      <Link to="/properties" className="bg-primary text-black px-8 py-3 font-black uppercase tracking-widest text-[10px] rounded-none hover:scale-105 transition-transform">
        Back to listings
      </Link>
    </div>
  );

  console.log("Rendering Property:", property.title, property);

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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <span className="text-primary text-lg md:text-2xl font-light uppercase tracking-widest block animate-fade-in">Property Details</span>
                <h1 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none m-0">
                  {property.title}
                </h1>
              </div>
              
              <div className="bg-primary px-8 py-6 md:px-12 md:py-8 shadow-[0_20px_50px_rgba(234,179,8,0.3)] animate-slide-up border-b-4 border-black/20">
                 <div className="text-black font-black text-xs uppercase tracking-[0.3em] mb-2 opacity-70">Investment Value</div>
                 <div className="text-black font-black text-3xl md:text-5xl uppercase tracking-tighter flex items-baseline gap-1">
                   <span className="text-xl md:text-2xl mr-1">₹</span>
                   {property.price ? Number(property.price).toLocaleString('en-IN') : 'Price on Request'}
                 </div>
              </div>
            </div>
          
          <nav className="flex items-center gap-3 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">
             <Link to="/" className="hover:text-primary transition-colors">Home</Link>
             <span className="text-primary">/</span>
             <Link to="/properties" className="hover:text-primary transition-colors">Properties</Link>
             <span className="text-primary">/</span>
             <span className="text-white">{property.title}</span>
          </nav>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 -mt-20 md:-mt-32 relative z-20">
        {/* 2. Main Visual Section */}
        <div className="border border-white/10 bg-black p-1 md:p-2 mb-0">
           {property.video_url ? (
             <iframe 
               src={property.video_url.includes('youtube.com/watch?v=') 
                 ? property.video_url.replace('watch?v=', 'embed/') 
                 : property.video_url.includes('youtu.be/') 
                   ? property.video_url.replace('youtu.be/', 'youtube.com/embed/') 
                   : property.video_url
               }
               className="w-full aspect-video md:aspect-[21/9] object-cover"
               title={property.title}
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               allowFullScreen
             />
           ) : (
             <img 
               src={featuredImage} 
               className="w-full aspect-video md:aspect-[21/9] object-cover" 
               alt={property.title} 
             />
           )}
        </div>

        {/* 3. Metadata Info Bar */}
        <div className="flex justify-end relative z-30">
          <div className="bg-black border border-white/10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 -mt-12 md:-mt-20 w-full md:w-[70%] shadow-2xl">
             <div className="p-4 md:p-8 flex items-center gap-4 group hover:bg-white/[0.02] transition-colors">
                <div className="text-primary">
                   <Shield className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="space-y-1 text-left">
                  <div className="text-white font-black text-[10px] md:text-base uppercase tracking-tighter">Project Name</div>
                  <div className="text-primary font-bold text-[8px] md:text-xs uppercase tracking-widest leading-none">
                    {property.project_name || property.title}
                  </div>
                </div>
             </div>
             <div className="p-4 md:p-8 flex items-center gap-4 group hover:bg-white/[0.02] transition-colors">
                <div className="text-primary border-none md:border-l border-white/10 pl-0 md:pl-4">
                   <Construction className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="space-y-1 text-left">
                  <div className="text-white font-black text-[10px] md:text-base uppercase tracking-tighter">
                    {property.rera_id ? 'RERA Number' : 'Published On'}
                  </div>
                  <div className="text-primary font-bold text-[8px] md:text-xs uppercase tracking-widest leading-none">
                    {property.rera_id || (property.created_at ? new Date(property.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A')}
                  </div>
                </div>
             </div>
             <div className="p-4 md:p-8 flex items-center gap-4 group hover:bg-white/[0.02] transition-colors">
                <div className="text-primary border-none md:border-l border-white/10 pl-0 md:pl-4">
                   <MapPin className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="space-y-1 text-left">
                  <div className="text-white font-black text-[10px] md:text-base uppercase tracking-tighter">Location</div>
                  <div className="text-primary font-bold text-[8px] md:text-xs uppercase tracking-widest leading-none">{property.city}</div>
                </div>
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
              
              <div className="space-y-8">
                 <div className="space-y-2">
                    <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter m-0">Specifications</h3>
                    <div className="h-1 w-12 bg-primary/50" />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                  {[
                    { label: "Project Name", value: property.project_name, icon: Shield },
                    { label: "Status", value: property.listing_status, icon: CheckCircle2 },
                    { label: "Configuration", value: property.bhk_type, icon: Home },
                    { label: "Handover Date", value: property.possession_date, icon: Calendar },
                    { label: "Facing", value: property.facing, icon: Compass },
                    { label: "Balconies", value: property.balconies, icon: Wind },
                    { label: "Floor No", value: property.floor_no ? `${property.floor_no} of ${property.total_floors || 'N/A'}` : null, icon: Layers },
                    { label: "Parking", value: property.parking, icon: Car },
                    { label: "RERA ID", value: property.rera_id, icon: Lock },
                    { label: "Property Age", value: property.age_of_property, icon: Construction },
                    { label: "Maintenance", value: property.maintenance_charges ? `₹${Number(property.maintenance_charges).toLocaleString()} / Monthly` : null, icon: DollarSign }
                  ].filter(item => item.value).map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 group">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                        <span className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-widest">{item.label}</span>
                      </div>
                      <span className="text-white text-[10px] md:text-xs font-black uppercase tracking-widest text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {property.highlights && (
                <div className="space-y-6 pt-12">
                   <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter m-0">Project Highlights</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.highlights.split('\n').filter((h: string) => h.trim().length > 0).map((h: string, i: number) => (
                      <div key={i} className="flex items-start gap-4 text-slate-400 font-bold text-xs md:text-sm border-l-2 border-primary/30 pl-4 py-1 bg-white/[0.02] hover:bg-white/[0.05] transition-colors pr-4">
                        <span className="uppercase tracking-tight leading-tight">{h.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {property.property_amenity_relation && property.property_amenity_relation.length > 0 && (
                <div className="space-y-10 pt-12">
                   <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter m-0">Curated Amenities</h3>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {property.property_amenity_relation.map((relation: any, i: number) => {
                        const amenity = relation.amenities;
                        const iconMap: Record<string, any> = {
                          'Shield': Shield, 'Waves': Waves, 'Dumbbell': Dumbbell, 'Wifi': Wifi,
                          'Cigarette': Lock, 'Trees': Trees, 'Car': Car, 'CloudLightning': CloudLightning,
                          'Construction': Layers, 'Sparkles': Sparkles, 'Run': Wind, 'Baby': Home
                        };
                        const IconComponent = iconMap[amenity.icon] || Shield;
                        return (
                          <div key={i} className="flex flex-col items-center justify-center p-6 bg-white/[0.03] border border-white/5 hover:border-primary/30 group transition-all">
                             <IconComponent className="w-8 h-8 text-slate-500 group-hover:text-primary transition-colors mb-4" />
                             <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">{amenity.name}</span>
                          </div>
                        );
                      })}
                   </div>
                </div>
              )}
            </div>

            {/* Gallery */}
            <div className="space-y-10">
               <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter m-0">Visual Showcase</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {property.property_images?.map((img: any, i: number) => (
                   <div key={i} className="aspect-video bg-white/5 border border-white/10 group cursor-pointer overflow-hidden" onClick={() => setGalleryIndex(i)}>
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
                     src={founderImg} 
                     className="w-full h-full object-cover rounded-full" 
                     alt="Agent Profile" 
                   />
                 </div>
                 
                 <div className="space-y-2">
                   <div className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none">Ajay Sharma</div>
                   <div className="text-primary text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">CEO | Founder</div>
                 </div>
                 
                 <div className="w-full pt-6 border-t border-white/10 flex justify-center gap-6">
                    <a href="tel:+918090965996" className="text-white hover:text-primary transition-colors"><Phone className="w-6 h-6" /></a>
                    <a href="https://wa.me/918090965996" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors">
                       <WhatsAppIcon className="w-6 h-6" />
                    </a>
                    <a href="mailto:info@shrinsinfra.com" className="text-white hover:text-primary transition-colors"><Mail className="w-6 h-6" /></a>
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

      {/* Gallery Slider Modal */}
      <Modal
        open={galleryIndex !== null}
        onCancel={() => setGalleryIndex(null)}
        footer={null}
        width="100%"
        centered
        className="premium-lightbox-modal"
        styles={{ body: { background: 'transparent', padding: 0 } }}
      >
        <Carousel 
          arrows={true} 
          dots={false} 
          initialSlide={galleryIndex || 0}
          className="gallery-carousel"
          infinite={true}
        >
          {property.property_images?.map((img: any, i: number) => (
            <div key={i} className="h-screen w-screen grid place-items-center outline-none bg-black">
              <img src={img.image_url} className="max-w-full max-h-screen object-contain select-none" alt="Gallery View" />
            </div>
          ))}
        </Carousel>
      </Modal>

      {/* Plan Modal (Floor Plans) */}
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
        .premium-lightbox-modal {
          max-width: 100vw !important;
          top: 0 !important;
          padding-bottom: 0 !important;
          margin: 0 !important;
        }
        .premium-lightbox-modal .ant-modal-content {
          border-radius: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
          height: 100vh !important;
        }
        .premium-lightbox-modal .ant-modal-body {
          padding: 0 !important;
          height: 100vh !important;
        }
        .premium-lightbox-modal .ant-modal-close {
          color: white !important;
          top: 30px !important;
          right: 30px !important;
          z-index: 1000;
          background: rgba(0,0,0,0.5);
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .premium-modal-sharp .ant-modal-content {
          border-radius: 0 !important;
          background: #000 !important;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0 !important;
        }
        .premium-modal-sharp .ant-modal-close {
          color: white !important;
          z-index: 100;
        }

        .gallery-carousel,
        .gallery-carousel .slick-list,
        .gallery-carousel .slick-track {
          height: 100vh !important;
        }
        
        .gallery-carousel .slick-track {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        
        .gallery-carousel .slick-slide > div {
          display: grid !important;
          place-items: center !important;
          height: 100vh !important;
          width: 100vw !important;
          outline: none !important;
        }

        .gallery-carousel .slick-prev,
        .gallery-carousel .slick-next {
          color: white !important;
          z-index: 1000;
          font-size: 32px !important;
          padding: 20px;
          background: transparent !important;
          position: absolute !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 80px;
          height: 100px !important;
          transition: all 0.3s;
        }
        .gallery-carousel .slick-prev:hover,
        .gallery-carousel .slick-next:hover {
          background: rgba(255,255,255,0.05) !important;
        }
        .gallery-carousel .slick-prev { left: 0px !important; border-radius: 0 50px 50px 0; }
        .gallery-carousel .slick-next { right: 0px !important; border-radius: 50px 0 0 50px; }
      ` }} />
    </div>
  );
};
