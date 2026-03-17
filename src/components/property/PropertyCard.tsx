import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, BedDouble, Bath, Maximize } from 'lucide-react';

interface PropertyCardProps {
  property: {
    title: string;
    slug: string;
    price: number | null;
    location: string | null;
    bedrooms: number | null;
    bathrooms: number | null;
    area: number | null;
    featured_image: string;
    status: 'buy' | 'rent' | null;
  };
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <div className="group bg-white/5 border border-white/10 rounded-sm overflow-hidden hover:border-[#c4a661] transition-all duration-300">
      <Link href={`/properties/${property.slug}`} className="block relative h-64 overflow-hidden">
        <img 
          src={property.featured_image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop'} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          alt={property.title}
        />
        <div className="absolute top-4 left-4 bg-black/80 text-[#c4a661] text-xs font-bold px-3 py-1 uppercase tracking-widest border border-[#c4a661]/30">
          FOR {property.status === 'buy' ? 'SALE' : 'RENT'}
        </div>
      </Link>
      
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <Link href={`/properties/${property.slug}`}>
            <h3 className="text-xl font-bold text-white hover:text-[#c4a661] transition-colors line-clamp-1">{property.title}</h3>
          </Link>
          <div className="text-xl font-black text-[#c4a661]">
            ₹{property.price ? property.price.toLocaleString('en-IN') : 'Price on Request'}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <MapPin className="w-4 h-4 text-[#c4a661]" />
          <span>{property.location}</span>
        </div>
        
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="flex flex-col items-center gap-1">
            <BedDouble className="w-5 h-5 text-slate-400" />
            <span className="text-xs text-slate-300 font-medium">{property.bedrooms} Beds</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Bath className="w-5 h-5 text-slate-400" />
            <span className="text-xs text-slate-300 font-medium">{property.bathrooms} Baths</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Maximize className="w-5 h-5 text-slate-400" />
            <span className="text-xs text-slate-300 font-medium">{property.area} Sq.Ft</span>
          </div>
        </div>
      </div>
    </div>
  );
};
