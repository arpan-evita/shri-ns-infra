import { Link } from 'react-router-dom';
import { MapPin, Maximize, Home, Clock } from 'lucide-react';

interface PropertyCardProps {
  property: {
    title: string;
    slug: string;
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
  };
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <div className="group bg-[#0f0f0f] border border-white/5 rounded-none overflow-hidden hover:border-primary/50 transition-all duration-500 shadow-2xl">
      <Link to={`/properties/${property.slug}`} className="block relative h-72 overflow-hidden">
        <img 
          src={property.featured_image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop'} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          alt={property.title}
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="bg-primary text-black text-[9px] font-black px-3 py-1.5 uppercase tracking-[0.2em] rounded-none shadow-lg">
            {property.status === 'buy' ? 'For Sale' : 'For Rent'}
          </div>
          {property.possession_status && (
            <div className="bg-black/80 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 uppercase tracking-[0.2em] rounded-none border border-white/10 shadow-lg">
              {property.possession_status}
            </div>
          )}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
           <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-none flex justify-between items-center transition-all duration-500 group-hover:bg-primary/20 group-hover:border-primary/30">
              <div className="text-white font-black text-xl">
                ₹{property.price ? property.price.toLocaleString('en-IN') : 'Price on Request'}
              </div>
              <div className="text-slate-300 text-[10px] font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded-none">
                ₹{property.price_per_sqft || (property.price && property.area ? Math.round(property.price/property.area) : 0)} /sqft
              </div>
           </div>
        </div>
      </Link>
      
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <Link to={`/properties/${property.slug}`}>
            <h3 className="text-xl font-bold text-white hover:text-primary transition-colors line-clamp-1 uppercase tracking-tight">{property.title}</h3>
          </Link>
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{property.location}, {property.city}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-1 bg-white/[0.03] p-1 rounded-none">
          <div className="bg-[#151515] p-3 text-center rounded-none space-y-1">
            <Home className="w-4 h-4 text-primary mx-auto opacity-70" />
            <div className="text-[10px] text-white font-black uppercase tracking-tighter">{property.bhk_type || `${property.bedrooms} BHK`}</div>
          </div>
          <div className="bg-[#151515] p-3 text-center rounded-none space-y-1">
            <Maximize className="w-4 h-4 text-primary mx-auto opacity-70" />
            <div className="text-[10px] text-white font-black uppercase tracking-tighter">{property.carpet_area || property.area} SQFT</div>
          </div>
          <div className="bg-[#151515] p-3 text-center rounded-none space-y-1">
            <Clock className="w-4 h-4 text-primary mx-auto opacity-70" />
            <div className="text-[10px] text-white font-black uppercase tracking-tighter">READY</div>
          </div>
        </div>
      </div>
    </div>
  );
};
