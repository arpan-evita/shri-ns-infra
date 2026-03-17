import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize, 
  Calendar, 
  Home, 
  CheckCircle2,
  Phone,
  Mail,
  User
} from "lucide-react";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data: property } = await supabase
    .from('properties')
    .select('title, description')
    .eq('slug', params.slug)
    .single();

  if (!property) return { title: 'Property Not Found' };

  return {
    title: `${property.title} | Shri NS Infra`,
    description: property.description?.substring(0, 160),
    openGraph: {
      title: property.title,
      description: property.description || '',
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { data: property, error } = await supabase
    .from('properties')
    .select(`
      *,
      agents(*),
      property_images(*),
      property_feature_values(
        value,
        property_features(name, icon)
      )
    `)
    .eq('slug', params.slug)
    .single();

  if (!property || error) {
    notFound();
  }

  // Schema.org JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "price": property.price,
    "priceCurrency": "INR",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.city,
      "streetAddress": property.location
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Gallery placeholder - simplified */}
            <div className="grid grid-cols-2 gap-4 h-[500px]">
              {property.property_images?.slice(0, 3).map((img: any, idx: number) => (
                <div key={img.id} className={`${idx === 0 ? 'col-span-2 h-2/3' : 'h-1/3'}`}>
                  <img src={img.image_url} className="w-full h-full object-cover rounded-sm" alt={property.title} />
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-white/10 pb-8">
                <div className="space-y-2">
                  <h1 className="text-4xl font-black text-white">{property.title}</h1>
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-5 h-5 text-[#c4a661]" />
                    <span>{property.location}, {property.city}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-[#c4a661]">₹{property.price?.toLocaleString('en-IN')}</div>
                  <div className="text-slate-400 font-bold uppercase tracking-widest text-sm">{property.status === 'buy' ? 'For Sale' : 'For Rent'}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                    <BedDouble className="w-6 h-6 text-[#c4a661]" />
                  </div>
                  <div>
                    <div className="text-white font-bold">{property.bedrooms}</div>
                    <div className="text-slate-400 text-xs uppercase font-bold tracking-tighter">Bedrooms</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                    <Bath className="w-6 h-6 text-[#c4a661]" />
                  </div>
                  <div>
                    <div className="text-white font-bold">{property.bathrooms}</div>
                    <div className="text-slate-400 text-xs uppercase font-bold tracking-tighter">Bathrooms</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                    <Maximize className="w-6 h-6 text-[#c4a661]" />
                  </div>
                  <div>
                    <div className="text-white font-bold">{property.area}</div>
                    <div className="text-slate-400 text-xs uppercase font-bold tracking-tighter">Sq. Ft Area</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                    <Home className="w-6 h-6 text-[#c4a661]" />
                  </div>
                  <div>
                    <div className="text-white font-bold">{property.property_type}</div>
                    <div className="text-slate-400 text-xs uppercase font-bold tracking-tighter">Property Type</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Description</h3>
                <p className="text-slate-400 leading-relaxed text-lg whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Dynamic Features */}
              {property.property_feature_values?.length > 0 && (
                <div className="space-y-6 pt-8 border-t border-white/10">
                  <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Property Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {property.property_feature_values.map((fv: any) => (
                      <div key={fv.property_features.name} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#c4a661]" />
                        <div className="text-slate-300">
                          <span className="font-bold text-white">{fv.property_features.name}:</span> {fv.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Agent Card */}
            {property.agents && (
              <div className="bg-white/5 border border-white/10 p-8 rounded-sm space-y-6">
                <div className="flex items-center gap-4">
                  <img src={property.agents.photo} className="w-20 h-20 rounded-full object-cover border-2 border-[#c4a661]" alt={property.agents.name} />
                  <div>
                    <h4 className="text-xl font-bold text-white">{property.agents.name}</h4>
                    <p className="text-[#c4a661] text-xs font-bold uppercase tracking-widest">Property Consultant</p>
                  </div>
                </div>
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <a href={`tel:${property.agents.phone}`} className="flex items-center gap-3 text-slate-300 hover:text-[#c4a661] transition-colors">
                    <Phone className="w-5 h-5" /> <span>{property.agents.phone}</span>
                  </a>
                  <a href={`mailto:${property.agents.email}`} className="flex items-center gap-3 text-slate-300 hover:text-[#c4a661] transition-colors">
                    <Mail className="w-5 h-5" /> <span>{property.agents.email}</span>
                  </a>
                </div>
              </div>
            )}

            {/* Inquiry Form */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-sm space-y-8">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Enquire Now</h3>
              <form className="space-y-6">
                <input type="text" placeholder="Your Name" className="w-full bg-white/5 border-b border-white/10 py-3 text-white focus:outline-none focus:border-[#c4a661] transition-colors" />
                <input type="email" placeholder="Your Email" className="w-full bg-white/5 border-b border-white/10 py-3 text-white focus:outline-none focus:border-[#c4a661] transition-colors" />
                <input type="text" placeholder="Phone Number" className="w-full bg-white/5 border-b border-white/10 py-3 text-white focus:outline-none focus:border-[#c4a661] transition-colors" />
                <textarea rows={4} placeholder="Your Message" className="w-full bg-white/5 border-b border-white/10 py-3 text-white focus:outline-none focus:border-[#c4a661] transition-colors resize-none"></textarea>
                <button className="w-full bg-[#c4a661] text-black font-black py-4 hover:bg-[#b09556] transition-all uppercase tracking-widest">
                  Send Enquiry
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
