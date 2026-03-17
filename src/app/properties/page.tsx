import { supabase } from "@/lib/supabase";
import { PropertyCard } from "@/components/property/PropertyCard";
import { FilterBar } from "@/components/property/FilterBar";

interface SearchParams {
  location?: string;
  type?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  status?: string;
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  let query = supabase
    .from('properties')
    .select(`
      *,
      property_images(image_url, is_featured)
    `);

  // Apply Filters
  if (searchParams.location) {
    query = query.ilike('city', `%${searchParams.location}%`);
  }
  if (searchParams.type) {
    query = query.eq('property_type', searchParams.type);
  }
  if (searchParams.status) {
    query = query.eq('status', searchParams.status);
  }
  if (searchParams.minPrice) {
    query = query.gte('price', parseInt(searchParams.minPrice));
  }
  if (searchParams.maxPrice) {
    query = query.lte('price', parseInt(searchParams.maxPrice));
  }
  if (searchParams.bedrooms) {
    query = query.eq('bedrooms', parseInt(searchParams.bedrooms));
  }

  const { data: properties, error } = await query;

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

        {/* Filter Bar */}
        <FilterBar initialFilters={searchParams} />

        {/* Results */}
        {error ? (
          <div className="text-center py-24 text-red-500 bg-red-500/10 border border-red-500/20">
            Error loading properties: {error.message}
          </div>
        ) : properties && properties.length > 0 ? (
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
}
