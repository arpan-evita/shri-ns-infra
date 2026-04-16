import { Link } from 'react-router-dom';
import { MapPin, Maximize, Home, Phone, ChevronRight, Star } from 'lucide-react';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    slug: string;
    property_uid?: string | null;
    is_featured?: boolean | null;
    price: number | null;
    price_per_sqft?: number | null;
    location: string | null;
    city: string | null;
    bedrooms: number | null;
    bathrooms: number | null;
    area: number | null;
    carpet_area?: number | null;
    bhk_type?: string | null;
    featured_image: string;
    status: 'buy' | 'rent' | null;
    possession_status?: string | null;
    developer_name?: string | null;
    property_type?: string | null;
    highlights?: string | null;
    whatsapp_number?: string | null;
    property_variants?: any[];
  };
}

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.845L0 24l6.337-1.662c1.635.891 3.474 1.361 5.341 1.362h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const variants = property.property_variants || [];
  const prices = variants.map(v => v.price).filter(p => p > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : property.price;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

  const configurations = Array.from(new Set(variants.map(v => v.configuration))).filter(Boolean).join(', ');

  const getStatusColor = (status: string) => {
    if (status?.includes('Ready')) return 'bg-emerald-500';
    if (status?.includes('Launch')) return 'bg-amber-500';
    return 'bg-blue-500';
  };

  return (
    <div className={`group bg-[#111111] border ${property.is_featured ? 'border-primary/40 shadow-[0_0_30px_rgba(201,164,29,0.15)] scale-[1.01]' : 'border-white/5 shadow-2xl'} rounded-none overflow-hidden hover:border-primary transition-all duration-500 flex flex-col h-full relative`}>
      {/* 1. Visual Section */}
      <Link to={`/properties/${property.slug}`} className="block relative h-72 overflow-hidden shrink-0">
        <img 
          src={property.featured_image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=75&w=600&auto=format&fit=crop&fm=webp'} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          alt={property.title}
          loading="lazy"
          decoding="async"
          width={600}
          height={288}
        />
        
        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          <div className="bg-primary text-black text-[9px] font-black px-3 py-1.5 uppercase tracking-[0.2em] rounded-none shadow-xl border-l-4 border-black/20">
            {property.property_type || 'Premium Project'}
          </div>
          {property.possession_status && (
            <div className={`${getStatusColor(property.possession_status)} text-white text-[9px] font-black px-3 py-1.5 uppercase tracking-[0.2em] rounded-none shadow-xl flex items-center gap-2`}>
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {property.possession_status}
            </div>
          )}
          {property.is_featured && (
            <div className="bg-black text-primary border border-primary/40 text-[9px] font-black px-3 py-1.5 uppercase tracking-[0.2em] rounded-none shadow-xl flex items-center gap-2">
               <Star className="w-3 h-3 fill-primary" />
               FEATURED
            </div>
          )}
        </div>
        
        {/* UID Badge (Right) */}
        {property.property_uid && (
          <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md text-white/60 text-[8px] font-black px-2 py-1 uppercase tracking-widest border border-white/10">
             REF: {property.property_uid}
          </div>
        )}

        {/* Price Overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
           <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-none flex justify-between items-center transition-all duration-500 group-hover:bg-primary/20 group-hover:border-primary/40">
              <div className="text-white">
                <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Starting From</div>
                <div className="text-2xl font-black flex items-baseline gap-1">
                  <span className="text-sm">â‚¹</span>
                  {minPrice ? minPrice.toLocaleString('en-IN') : 'Price on Request'}
                  {maxPrice && minPrice !== null && maxPrice > minPrice && (
                    <span className="text-slate-400 text-sm font-bold ml-1"> - {maxPrice.toLocaleString('en-IN')}</span>
                  )}
                </div>
              </div>
              <div className="bg-white/5 p-2 rounded-none border border-white/10 group-hover:border-primary/30 transition-colors">
                <ChevronRight className="w-5 h-5 text-primary" />
              </div>
           </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
      </Link>
      
      {/* 2. Content Section */}
      <div className="p-6 flex flex-col flex-grow space-y-5">
        <div className="space-y-3">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
               {property.developer_name && (
                 <div className="text-primary text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 mb-1">
                   <Star className="w-3 h-3 fill-primary" />
                   {property.developer_name}
                 </div>
               )}
               <Link to={`/properties/${property.slug}`}>
                 <h3 className="text-xl md:text-2xl font-bold text-white hover:text-primary transition-colors line-clamp-1 uppercase tracking-tighter leading-none">{property.title}</h3>
               </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
            <MapPin className="w-4 h-4 text-primary opacity-60" />
            <span>{property.location}, {property.city}</span>
          </div>
        </div>

        {/* Dynamic Highlights / Configurations */}
        <div className="space-y-4 flex-grow">
          {configurations ? (
             <div className="bg-white/[0.03] border border-white/5 p-3 rounded-none">
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">Available Units</div>
                <div className="text-[10px] text-white font-black uppercase tracking-tight line-clamp-1">
                  {configurations}
                </div>
             </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/[0.03] p-2 flex items-center gap-3 border border-white/5">
                <Home className="w-4 h-4 text-primary/50" />
                <span className="text-[10px] text-white font-black uppercase">{property.bhk_type || (property.bedrooms ? property.bedrooms + ' BHK' : 'N/A')}</span>
              </div>
              <div className="bg-white/[0.03] p-2 flex items-center gap-3 border border-white/5">
                <Maximize className="w-4 h-4 text-primary/50" />
                <span className="text-[10px] text-white font-black uppercase">{property.area} SQFT</span>
              </div>
            </div>
          )}

          {property.highlights && (
            <div className="flex flex-wrap gap-2">
               {property.highlights.split('\n').slice(0, 3).map((h, i) => (
                 <span key={i} className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-primary/5 text-primary border border-primary/10">
                   {h.trim()}
                 </span>
               ))}
            </div>
          )}
        </div>

        {/* 3. CTA Actions */}
        <div className="pt-6 border-t border-white/5 grid grid-cols-3 gap-2">
           <a href={`tel:${property.whatsapp_number || '+91919312121411'}`} className="bg-[#151515] hover:bg-white/5 text-white p-3 flex items-center justify-center transition-all border border-white/5 group/btn">
             <Phone className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
           </a>
           <a href={`https://wa.me/${(property.whatsapp_number || '91919312121411').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="bg-[#151515] hover:bg-[#25D366]/10 text-white hover:text-[#25D366] p-3 flex items-center justify-center transition-all border border-white/5 group/btn">
             <WhatsAppIcon className="group-hover/btn:scale-110 transition-transform" />
           </a>
           <Link to={`/properties/${property.slug}`} className="col-span-1 bg-primary hover:bg-white text-black font-black text-[10px] uppercase tracking-widest flex items-center justify-center transition-all shadow-lg hover:shadow-primary/20">
             DETAILS
           </Link>
        </div>
      </div>
    </div>
  );
};

