"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, Home, MapPin, IndianRupee } from 'lucide-react';

export const FilterBar = ({ initialFilters }: { initialFilters: any }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    location: initialFilters.location || '',
    type: initialFilters.type || '',
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
    bedrooms: initialFilters.bedrooms || '',
    status: initialFilters.status || '',
  });

  const handleApply = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value as string);
    });
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="bg-white/5 border border-white/10 p-2 md:p-4 rounded-sm flex flex-wrap gap-4 items-center">
      <div className="flex-grow min-w-[200px] relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c4a661] w-4 h-4" />
        <input 
          type="text" 
          placeholder="Location..."
          value={filters.location}
          onChange={(e) => setFilters({...filters, location: e.target.value})}
          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#c4a661]"
        />
      </div>

      <select 
        value={filters.type}
        onChange={(e) => setFilters({...filters, type: e.target.value})}
        className="min-w-[150px] p-3 bg-[#1a1916] border border-white/10 text-white focus:outline-none focus:border-[#c4a661]"
      >
        <option value="">Property Type</option>
        <option value="Apartment">Apartment</option>
        <option value="Villa">Villa</option>
        <option value="Plot">Plot</option>
        <option value="Commercial">Commercial</option>
      </select>

      <select 
        value={filters.status}
        onChange={(e) => setFilters({...filters, status: e.target.value})}
        className="min-w-[150px] p-3 bg-[#1a1916] border border-white/10 text-white focus:outline-none focus:border-[#c4a661]"
      >
        <option value="">Status</option>
        <option value="buy">For Sale</option>
        <option value="rent">For Rent</option>
      </select>

      <select 
        value={filters.bedrooms}
        onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
        className="min-w-[120px] p-3 bg-[#1a1916] border border-white/10 text-white focus:outline-none focus:border-[#c4a661]"
      >
        <option value="">Bedrooms</option>
        <option value="1">1 BHK</option>
        <option value="2">2 BHK</option>
        <option value="3">3 BHK</option>
        <option value="4">4+ BHK</option>
      </select>

      <button 
        onClick={handleApply}
        className="bg-[#c4a661] text-black font-bold px-8 py-3 hover:bg-[#b09556] transition-all flex items-center gap-2"
      >
        <Search className="w-4 h-4" /> SEARCH
      </button>
    </div>
  );
};
