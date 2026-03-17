"use client";

import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';

export const FilterBar = ({ initialFilters }: { initialFilters: any }) => {
  const navigate = useNavigate();
  useSearchParams();
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
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-sm flex flex-col md:flex-row flex-wrap gap-4 items-stretch md:items-center">
      <div className="flex-grow min-w-0 relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c4a661] w-4 h-4" />
        <input 
          type="text" 
          placeholder="Location..."
          value={filters.location}
          onChange={(e) => setFilters({...filters, location: e.target.value})}
          className="w-full pl-12 pr-4 py-3 bg-[#111] border border-white/10 text-white text-sm focus:outline-none focus:border-[#c4a661] transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-grow lg:flex-grow-0">
        <select 
          value={filters.type}
          onChange={(e) => setFilters({...filters, type: e.target.value})}
          className="w-full p-3 bg-[#1a1916] border border-white/10 text-white text-sm focus:outline-none focus:border-[#c4a661] transition-colors appearance-none"
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
          className="w-full p-3 bg-[#1a1916] border border-white/10 text-white text-sm focus:outline-none focus:border-[#c4a661] transition-colors appearance-none"
        >
          <option value="">Status</option>
          <option value="buy">For Sale</option>
          <option value="rent">For Rent</option>
        </select>

        <select 
          value={filters.bedrooms}
          onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
          className="w-full p-3 bg-[#1a1916] border border-white/10 text-white text-sm focus:outline-none focus:border-[#c4a661] transition-colors appearance-none"
        >
          <option value="">Bedrooms</option>
          <option value="1">1 BHK</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
          <option value="4">4+ BHK</option>
        </select>
      </div>

      <button 
        onClick={handleApply}
        className="bg-[#c4a661] text-black font-black px-8 py-3.5 hover:bg-[#b09556] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
      >
        <Search className="w-4 h-4" /> SEARCH PROPERTIES
      </button>
    </div>
  );
};
