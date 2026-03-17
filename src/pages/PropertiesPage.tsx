import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { PropertyCard } from "@/components/property/PropertyCard";
import { FilterBar } from "@/components/property/FilterBar";

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
          property_images(image_url, is_featured)
        `);

      const location = searchParams.get('location');
      const type = searchParams.get('type');
      const status = searchParams.get('status');
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      const bedrooms = searchParams.get('bedrooms');

      if (location) query = query.ilike('city', `%${location}%`);
      if (type) query = query.eq('property_type', type);
      if (status) query = query.eq('status', status);
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
    <div className="pt-32 pb-24 px-6 min-h-screen">
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="space-y-4">
          <span className="text-[#c4a661] text-4xl font-light">Explore</span>
          <h1 className="text-6xl font-black text-white uppercase">Property Listings</h1>
          <p className="text-slate-400 max-w-2xl text-lg">
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
