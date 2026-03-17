import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { 
  MapPin, 
  BedDouble, 
  Maximize, 
  CheckCircle2,
  Phone,
  Mail,
  Calculator,
  Compass,
  Clock,
  ArrowLeft,
  Share2,
  Download,
  Shield,
  Wifi,
  Waves,
  Cigarette,
  Dumbbell,
  Trees,
  CloudLightning,
  Construction,
  Car,
  Video,
  MousePointer2,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { 
  Button, 
  Slider, 
  Card, 
  Tag, 
  Divider, 
  Typography, 
  Empty, 
  Modal, 
  message 
} from 'antd';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet + React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const { Title, Text } = Typography;

// Icon Mapping for Amenities
const AmenityIcons: Record<string, any> = {
  'Security': Shield,
  'Swimming Pool': Waves,
  'Gym': Dumbbell,
  'WiFi': Wifi,
  'Clubhouse': Cigarette,
  'Garden': Trees,
  'Parking': Car,
  'Power Backup': CloudLightning,
  'Elevator': Construction,
  'CCTV': Shield,
  'Lift': Construction,
  'Park': Trees,
};

// Utility Constants

export const PropertyDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePlan, setActivePlan] = useState<string | null>(null);
  
  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [emi, setEmi] = useState(0);

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
        setLoanAmount(data.total_price || data.price * 0.8);

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

  useEffect(() => {
    if (loanAmount > 0) {
      const r = (interestRate || 8.5) / (12 * 100);
      const n = (tenure || 20) * 12;
      const emiVal = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setEmi(Math.round(emiVal));
    }
  }, [loanAmount, interestRate, tenure]);

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

  if (loading) return <div className="pt-32 px-6 text-center text-slate-500 min-h-screen flex items-center justify-center bg-background-dark font-black uppercase tracking-[0.5em] animate-pulse">Engineering your premium view...</div>;
  if (!property) return null;

  const featuredImage = property.property_images?.find((img: any) => img.is_featured)?.image_url || property.property_images?.[0]?.image_url;

  return (
    <div className="bg-[#0a0a0a] min-h-screen pb-24">
      {/* Premium Hero Section */}
      <section className="relative h-[90vh] overflow-hidden">
        <img 
          src={featuredImage || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"} 
          className="w-full h-full object-cover filter brightness-[0.4] scale-105 hover:scale-100 transition-transform duration-[3s]" 
          alt={property.title} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
        
        <div className="absolute top-32 left-0 right-0 px-6">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
             <div className="space-y-8 flex-1">
                <Button 
                   onClick={() => navigate('/properties')}
                   icon={<ArrowLeft className="w-4 h-4" />}
                   className="bg-white/5 border-white/10 text-white hover:text-primary backdrop-blur-3xl uppercase text-[10px] font-black tracking-[0.3em] px-8 h-12 rounded-full"
                >
                  Back to listings
                </Button>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Tag className="bg-primary text-black border-none font-black uppercase tracking-widest px-6 py-2 rounded-full text-[10px] shadow-lg shadow-primary/20">
                      {property.property_type}
                    </Tag>
                    <Tag className="bg-white/10 text-white border-none backdrop-blur-md font-black uppercase tracking-widest px-6 py-2 rounded-full text-[10px]">
                      {property.possession_status}
                    </Tag>
                  </div>
                  <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] max-w-4xl">
                    {property.title}
                  </h1>
                </div>

                <div className="flex items-center gap-4 text-slate-400 text-xl uppercase tracking-widest font-bold">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  {property.location}, {property.city}
                </div>
             </div>
             
             <div className="w-full lg:w-[450px] space-y-4">
                <Card className="bg-white/5 backdrop-blur-3xl border border-white/10 p-4 rounded-[2rem] overflow-hidden">
                  <div className="space-y-1 text-center py-8">
                     <Text className="text-slate-500 uppercase tracking-[0.4em] text-[10px] font-black">Investment Quotient</Text>
                     <div className="text-6xl font-black text-primary tracking-tighter">₹{property.price?.toLocaleString('en-IN')}</div>
                     <div className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[11px] mt-2">₹{property.price_per_sqft?.toLocaleString('en-IN')} / SQ.FT</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <Button 
                      href={property.brochure_url}
                      target="_blank"
                      icon={<Download className="w-4 h-4" />}
                      className="h-16 bg-white/5 hover:bg-white/10 text-white border-white/10 font-bold uppercase tracking-widest rounded-2xl text-[10px]"
                    >
                      Brochure
                    </Button>
                    <Button className="h-16 bg-primary hover:bg-primary/90 text-black border-none font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/30">
                      Book Now
                    </Button>
                  </div>
                </Card>
             </div>
          </div>
        </div>
      </section>

      {/* Content Layout */}
      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-8 space-y-24">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                 { icon: <BedDouble className="w-6 h-6" />, label: "Configuration", value: property.bhk_type },
                 { icon: <Maximize className="w-6 h-6" />, label: "Carpet Area", value: property.carpet_area ? `${property.carpet_area} Sq.Ft` : null },
                 { icon: <Compass className="w-6 h-6" />, label: "Facing", value: property.facing },
                 { icon: <Clock className="w-6 h-6" />, label: "Possession", value: property.possession_status },
                 { icon: <Layers className="w-6 h-6" />, label: "Floor", value: property.floor_no ? `${property.floor_no} of ${property.total_floors}` : null },
                 { icon: <Car className="w-6 h-6" />, label: "Parking", value: property.parking_type },
                 { icon: <Construction className="w-6 h-6" />, label: "Age", value: property.property_age },
                 { icon: <CheckCircle2 className="w-6 h-6" />, label: "Status", value: property.status }
               ].filter(item => item.value).map((item, i) => (
                 <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl group hover:border-primary transition-all duration-500">
                    <div className="text-primary mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                    <div className="text-white font-black text-lg uppercase tracking-tighter truncate">{item.value || 'N/A'}</div>
                    <div className="text-slate-500 uppercase tracking-widest text-[9px] font-bold mt-1">{item.label}</div>
                 </div>
               ))}
            </div>

            {/* Description Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-[2px] w-24 bg-primary" />
                <Title level={2} className="text-white uppercase tracking-tighter mb-0">The Narrative</Title>
              </div>
              <p className="text-slate-400 leading-relaxed text-xl whitespace-pre-line font-light max-w-4xl">
                {property.description}
              </p>
            </div>

            {/* Amenities Section */}
            <div className="space-y-12">
              <Title level={3} className="text-white uppercase tracking-tighter">Premium Lifestyle Amenities</Title>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {property.property_amenity_relation?.length > 0 ? (
                  property.property_amenity_relation.map((relation: any, i: number) => {
                    const amenity = relation.amenities;
                    const Icon = AmenityIcons[amenity.name] || CheckCircle2;
                    return (
                      <div key={i} className="flex items-center gap-4 group">
                        <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="text-white font-black uppercase tracking-widest text-[10px]">{amenity.name}</div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full">
                    <Empty description={<span className="text-slate-500">Contact agent for full list of amenities.</span>} />
                  </div>
                )}
              </div>
            </div>

            {/* Video & 360 Tour (Dynamic) */}
            {(property.video_url || property.virtual_tour_360) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {property.video_url && (
                  <div className="space-y-6">
                    <Title level={4} className="text-white uppercase tracking-tighter flex items-center gap-3">
                      <Video className="text-primary w-5 h-5" /> Video Presentation
                    </Title>
                    <div className="aspect-video bg-white/5 rounded-3xl overflow-hidden border border-white/10 group relative">
                       <iframe 
                         src={property.video_url.includes('youtube.com') ? property.video_url.replace('watch?v=', 'embed/') : property.video_url} 
                         className="w-full h-full border-0"
                         allowFullScreen
                       />
                    </div>
                  </div>
                )}
                {property.virtual_tour_360 && (
                  <div className="space-y-6">
                    <Title level={4} className="text-white uppercase tracking-tighter flex items-center gap-3">
                      <MousePointer2 className="text-primary w-5 h-5" /> 360° Experience
                    </Title>
                    <div className="aspect-video bg-white/5 rounded-3xl overflow-hidden border border-white/10 relative group">
                       <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 z-10 bg-black/60 opacity-100 group-hover:opacity-0 transition-opacity pointer-events-none">
                          <MousePointer2 className="w-12 h-12 text-primary animate-bounce" />
                          <span className="text-white font-black uppercase tracking-widest text-[10px]">Click to launch virtual world</span>
                       </div>
                       <iframe src={property.virtual_tour_360} className="w-full h-full border-0" allowFullScreen />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Interactive Location Hub */}
            {(property.latitude && property.longitude) && (
              <div className="space-y-8">
                <div className="flex justify-between items-end">
                   <div className="space-y-2">
                     <Title level={3} className="text-white uppercase tracking-tighter mb-0">Location Hub</Title>
                     <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Explore the neighborhood ecosystem</p>
                   </div>
                   <Button 
                     icon={<ArrowUpRight className="w-4 h-4" />}
                     href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
                     target="_blank"
                     className="bg-white/5 border-white/10 text-white hover:text-primary uppercase text-[10px] font-black tracking-widest h-12 px-6 rounded-2xl"
                   >
                     Open in Maps
                   </Button>
                </div>
                <div className="h-[500px] w-full bg-white/5 rounded-[3rem] overflow-hidden border border-white/10 z-0">
                  <MapContainer 
                    center={[property.latitude, property.longitude]} 
                    zoom={15} 
                    scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%', filter: 'invert(100%) hue-rotate(180deg) brightness(0.9) contrast(0.9)' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[property.latitude, property.longitude]}>
                      <Popup className="premium-popup">
                        <div className="font-black uppercase tracking-tighter text-xs pt-2">{property.title}</div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            )}

            {/* Floor Plans */}
            <div className="space-y-12">
               <Title level={3} className="text-white uppercase tracking-tighter">Spatial Layouts (Floor Plans)</Title>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {property.property_floor_plans?.length > 0 ? (
                    property.property_floor_plans.map((plan: any, i: number) => (
                      <div 
                        key={i} 
                        className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-primary transition-all cursor-zoom-in group"
                        onClick={() => setActivePlan(plan.image_url)}
                      >
                         <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <span className="text-white font-black uppercase tracking-widest text-xs">{plan.title}</span>
                            <Maximize className="w-4 h-4 text-slate-500 group-hover:text-primary" />
                         </div>
                         <img src={plan.image_url} className="w-full h-64 object-contain p-8 bg-white/10" alt={plan.title} />
                      </div>
                    ))
                 ) : (
                    <div className="col-span-full bg-white/5 border border-white/10 p-12 rounded-3xl text-center">
                       <Layers className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                       <Text className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Floor plans available on visit request</Text>
                    </div>
                 )}
               </div>
            </div>

            {/* Connectivity */}
            <div className="space-y-12">
               <Title level={3} className="text-white uppercase tracking-tighter">Prime Connectivity Landmarks</Title>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-1 p-1 bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                 {property.nearby_places?.map((place: any, i: number) => (
                    <div key={i} className="bg-[#0f0f0f] p-8 flex flex-col items-center justify-center text-center space-y-3">
                       <div className="text-primary uppercase tracking-[0.3em] font-black text-[9px]">{place.type}</div>
                       <div className="text-white font-bold text-sm leading-tight">{place.name}</div>
                       <div className="text-slate-500 font-bold text-lg">{place.distance} <span className="text-[10px] uppercase">KM</span></div>
                    </div>
                 ))}
                 {(!property.nearby_places || property.nearby_places.length === 0) && (
                   <div className="col-span-full p-12 text-center text-slate-600">Landmarks data being verified.</div>
                 )}
               </div>
            </div>

            {/* Full Specs Table */}
            <div className="space-y-12">
               <Title level={3} className="text-white uppercase tracking-tighter">Detailed Inventory Specs</Title>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-16 border-t border-white/10 pt-12">
                   {[
                    { label: "BHK Configuration", value: property.bhk_type },
                    { label: "Built-up Area", value: property.builtup_area ? `${property.builtup_area} ${property.area_unit}` : null },
                    { label: "Super Built-up", value: property.super_builtup_area ? `${property.super_builtup_area} ${property.area_unit}` : null },
                    { label: "Carpet Area", value: property.carpet_area ? `${property.carpet_area} ${property.area_unit}` : null },
                    { label: "Balconies", value: property.balcony_count },
                    { label: "Structure", value: (property.floor_no && property.total_floors) ? `${property.floor_no} Stories of ${property.total_floors}` : null },
                    { label: "Parking Space", value: property.parking_type },
                    { label: "Monthly Maintenance", value: property.monthly_maintenance ? `₹${property.monthly_maintenance}` : null },
                    { label: "Booking Amount", value: property.booking_amount ? `₹${property.booking_amount}` : null },
                    { label: "RERA Registry ID", value: property.rera_registration_id, color: "text-primary font-black" },
                    { label: "Property Age", value: property.property_age },
                    { label: "Negotiable", value: property.price_negotiable ? "Yes" : "No" }
                   ].filter(spec => spec.value !== null && spec.value !== undefined).map((spec, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-white/10 pb-6">
                       <span className="text-slate-500 uppercase tracking-widest text-[10px] font-black">{spec.label}</span>
                       <span className={spec.color || "text-white font-black text-sm"}>{spec.value}</span>
                    </div>
                   ))}
               </div>
            </div>

            {/* EMI Section */}
            <section className="bg-white/2 border border-white/10 rounded-[3rem] p-12 space-y-12">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-black shadow-2xl shadow-primary/40 rotate-12">
                      <Calculator className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tight">Investment Planner</h3>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Calculated Ownership Costs</p>
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                  <div className="space-y-10">
                     <div className="space-y-6">
                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-widest">
                          <span>Loan Portfolio</span>
                          <span className="text-primary">₹{loanAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <Slider 
                          min={100000} 
                          max={property.total_price || property.price || 100000000} 
                          step={100000}
                          value={loanAmount} 
                          onChange={setLoanAmount}
                          handleStyle={{ borderColor: '#c9a41d', backgroundColor: '#c9a41d', width: 24, height: 24 }}
                          trackStyle={{ backgroundColor: '#c9a41d', height: 4 }}
                          railStyle={{ height: 4, background: 'rgba(255,255,255,0.05)' }}
                        />
                     </div>
                     <div className="space-y-6">
                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-widest">
                          <span>Interest Threshold</span>
                          <span className="text-primary">{interestRate}%</span>
                        </div>
                        <Slider 
                          min={7} max={15} step={0.1}
                          value={interestRate} 
                          onChange={setInterestRate}
                          handleStyle={{ borderColor: '#c9a41d', backgroundColor: '#c9a41d', width: 24, height: 24 }}
                          trackStyle={{ backgroundColor: '#c9a41d', height: 4 }}
                          railStyle={{ height: 4, background: 'rgba(255,255,255,0.05)' }}
                        />
                     </div>
                     <div className="space-y-6">
                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-widest">
                          <span>Tenure Horizon</span>
                          <span className="text-primary">{tenure} CYCLES (Years)</span>
                        </div>
                        <Slider 
                          min={5} max={30}
                          value={tenure} 
                          onChange={setTenure}
                          handleStyle={{ borderColor: '#c9a41d', backgroundColor: '#c9a41d', width: 24, height: 24 }}
                          trackStyle={{ backgroundColor: '#c9a41d', height: 4 }}
                          railStyle={{ height: 4, background: 'rgba(255,255,255,0.05)' }}
                        />
                     </div>
                  </div>

                  <div className="bg-[#111] rounded-[2rem] p-12 text-center border border-white/5 relative overflow-hidden group">
                     <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                     <Text className="text-slate-500 uppercase tracking-[0.4em] text-[10px] font-black mb-4 block">Monthly Commitment</Text>
                     <div className="text-6xl font-black text-white mb-2 leading-none tracking-tighter">₹{emi.toLocaleString('en-IN')}</div>
                     <div className="text-primary text-[10px] font-bold uppercase tracking-widest">per calendar month</div>
                     <Divider className="border-white/5 my-8" />
                     <p className="text-slate-600 text-[9px] leading-relaxed uppercase font-bold tracking-widest">
                        Standard bank processing fees & local taxes apply. 
                     </p>
                  </div>
               </div>
            </section>
          </div>

          {/* Premium Sidebar */}
          <div className="lg:col-span-4 space-y-12">
            
            <div className="bg-[#111] border border-white/10 p-10 rounded-[3rem] space-y-10 sticky top-32 shadow-2xl">
               <div className="space-y-2">
                 <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Ownership Inquiry</h3>
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Priority callback within 30 minutes</p>
               </div>
               
               <form className="space-y-4" onSubmit={handleLeadSubmit}>
                  <input name="name" required placeholder="Personal Identity (Name)" className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white focus:outline-none placeholder:text-slate-600 font-bold text-xs uppercase tracking-widest" />
                  <input name="email" type="email" placeholder="Digital Mailbox (Email)" className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white focus:outline-none placeholder:text-slate-600 font-bold text-xs uppercase tracking-widest" />
                  <input name="phone" required placeholder="Tele-Connection (Phone)" className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white focus:outline-none placeholder:text-slate-600 font-bold text-xs uppercase tracking-widest" />
                  <textarea name="message" rows={4} placeholder="Detailed Requirements..." className="w-full bg-white/5 border border-white/5 rounded-3xl p-5 text-white focus:outline-none placeholder:text-slate-600 font-bold text-xs uppercase tracking-widest resize-none" />
                  
                  <Button 
                    htmlType="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-black border-none font-black py-8 rounded-[2rem] uppercase tracking-[0.2em] text-xs shadow-2xl shadow-primary/40 mt-6"
                  >
                    Establish Connection
                  </Button>
               </form>

               {property.agents && (
                 <div className="flex items-center gap-6 p-6 bg-white/5 rounded-[2rem] border border-white/5">
                    <img src={property.agents.photo} className="w-16 h-16 rounded-2xl object-cover filter grayscale hover:grayscale-0 transition-all cursor-pointer" />
                    <div>
                       <div className="text-white font-black uppercase tracking-tighter text-lg leading-tight">{property.agents.name}</div>
                       <div className="text-primary text-[9px] font-black uppercase tracking-[0.2em]">Portfolio Consultant</div>
                       <div className="flex gap-4 mt-2">
                          <a href={`tel:${property.agents.phone}`} className="text-white hover:text-primary transition-colors"><Phone className="w-4 h-4" /></a>
                          <a href={`mailto:${property.agents.email}`} className="text-white hover:text-primary transition-colors"><Mail className="w-4 h-4" /></a>
                       </div>
                    </div>
                 </div>
               )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button icon={<Share2 className="w-4 h-4" />} onClick={() => {
                navigator.share({ title: property.title, url: window.location.href });
              }} className="h-20 bg-white/5 border-white/10 text-white hover:text-primary rounded-[2rem] font-black uppercase text-[9px] tracking-[0.2em]">Share Report</Button>
              <Button 
                href={property.brochure_url}
                target="_blank"
                icon={<Download className="w-4 h-4" />} 
                className="h-20 bg-white/5 border-white/10 text-white hover:text-primary rounded-[2rem] font-black uppercase text-[9px] tracking-[0.2em]"
              >
                Key Features
              </Button>
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
        visible={!!activePlan}
        onCancel={() => setActivePlan(null)}
        footer={null}
        width={1000}
        centered
        className="premium-modal"
        bodyStyle={{ background: '#000', padding: 0 }}
      >
        <img src={activePlan || ""} className="w-full h-auto p-4" />
      </Modal>
    </div>
  );
};
