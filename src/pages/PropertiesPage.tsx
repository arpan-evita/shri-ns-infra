import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { PropertyCard } from "@/components/property/PropertyCard";
import { FilterBar } from "@/components/property/FilterBar";
import { PageBanner } from "@/components/sections/PageBanner";

export const PropertiesPage = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      let query = supabase
        .from('properties')
        .select(`
          *,
          developer_name,
          listing_status,
          property_images(image_url, is_featured),
          property_variants(*)
        `);

      const location = searchParams.get('location');
      const type = searchParams.get('type');
      const statusParam = searchParams.get('status');
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      const bedrooms = searchParams.get('bedrooms');

      // If no status filter in URL, default to Published
      if (!statusParam) {
        query = query.eq('listing_status', 'Published');
      } else if (statusParam !== 'all') {
        query = query.eq('listing_status', statusParam);
      }

      if (location) query = query.ilike('city', `%${location}%`);
      if (type) query = query.eq('property_type', type);
      // 'status' column in DB is for Buy/Rent (purpose)
      const purpose = searchParams.get('purpose');
      if (purpose) query = query.eq('status', purpose);
      if (minPrice) query = query.gte('price', parseInt(minPrice));
      if (maxPrice) query = query.lte('price', parseInt(maxPrice));
      if (bedrooms) query = query.eq('bedrooms', parseInt(bedrooms));

      const { data, error: fetchError } = await query;

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setProperties(data || []);
      }
      setLoading(false);
    };

    fetchProperties();
  }, [searchParams]);

  return (
    <div className="flex flex-col min-h-screen">
      <PageBanner title="Properties" />
      
      <div className="pb-16 md:pb-24 px-6 pt-12 md:pt-20 mx-auto max-w-7xl w-full space-y-8 md:space-y-12">
        <div className="space-y-2 md:space-y-4 text-left">
          <span className="text-[#c4a661] text-xl md:text-3xl font-light uppercase tracking-tight">Explore</span>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">Property Listings</h1>
          <p className="text-slate-400 max-w-2xl text-sm md:text-lg font-medium leading-relaxed">
            Find the perfect home or investment across the most premium locations in Delhi NCR. Use the filters below to refine your search.
          </p>
        </div>

        <FilterBar initialFilters={Object.fromEntries(searchParams)} />

        {loading ? (
          <div className="text-center py-24 text-slate-500">Loading properties...</div>
        ) : error ? (
          <div className="text-center py-24 text-red-500 bg-red-500/10 border border-red-500/20">
            Error loading properties: {error}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={{
                  ...property,
                  featured_image: property.property_images?.find((img: any) => img.is_featured)?.image_url || property.property_images?.[0]?.image_url
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-slate-500 border border-white/5 bg-white/5">
            No properties found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};
