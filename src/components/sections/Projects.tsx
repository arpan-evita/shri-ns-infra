import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { PropertyCard } from '@/components/property/PropertyCard';

export const Projects = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback data in case database is empty
  const fallbackProjects = [
    {
      id: "1",
      title: "Astrus Capella",
      slug: "astrus-capella",
      price: 5000000,
      price_per_sqft: 14000,
      location: "Pinewood Enclave",
      city: "Ghaziabad",
      bedrooms: 0,
      bathrooms: 0,
      area: 312,
      carpet_area: 312,
      bhk_type: "NULL BHK",
      featured_image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1935&auto=format&fit=crop",
      status: "buy",
      possession_status: "New Launch"
    },
    {
      id: "2",
      title: "SKA Divine",
      slug: "ska-divine",
      price: 8500000,
      price_per_sqft: 12500,
      location: "Sector 143",
      city: "Noida",
      bedrooms: 3,
      bathrooms: 3,
      area: 1650,
      carpet_area: 1200,
      bhk_type: "3 BHK",
      featured_image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
      status: "buy",
      possession_status: "Ready"
    },
    {
      id: "3",
      title: "Karyan",
      slug: "karyan",
      price: 6500000,
      price_per_sqft: 11000,
      location: "Sector 16B",
      city: "Noida Extension",
      bedrooms: 2,
      bathrooms: 2,
      area: 1150,
      carpet_area: 900,
      bhk_type: "2 BHK",
      featured_image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
      status: "buy",
      possession_status: "Under Construction"
    },
    {
      id: "4",
      title: "Entilla 4CS",
      slug: "entilla-4cs",
      price: 12000000,
      price_per_sqft: 16000,
      location: "Sector 150",
      city: "Noida",
      bedrooms: 4,
      bathrooms: 4,
      area: 2500,
      carpet_area: 2000,
      bhk_type: "4 BHK",
      featured_image: "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=2067&auto=format&fit=crop",
      status: "buy",
      possession_status: "Ready"
    }
  ];

  useEffect(() => {
    const fetchFeaturesProperties = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images(image_url, is_featured)
        `)
        .order('created_at', { ascending: false })
        .limit(4);

      if (!error && data && data.length > 0) {
        setProperties(data);
      } else {
        setProperties(fallbackProjects);
      }
      setLoading(false);
    };

    fetchFeaturesProperties();
  }, []);

  return (
    <section className="bg-background-dark py-16 md:py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 md:mb-16 gap-8 text-left">
          <div className="space-y-4">
            <span className="text-primary text-xl md:text-2xl font-light uppercase tracking-tight">Our Project</span>
            <h2 className="text-white text-3xl md:text-5xl font-black leading-tight uppercase tracking-tighter">Delivering Quality Homes & Smart Investments</h2>
            <p className="text-slate-400 max-w-xl text-base md:text-lg font-medium leading-relaxed">
              We represent some of the most prestigious developments in the region, ensuring every investment provides long-term value and excellence.
            </p>
          </div>
          <Link to="/properties" className="border border-primary px-8 py-3 text-white font-bold hover:bg-primary hover:text-black transition-all uppercase tracking-widest text-sm flex items-center gap-2 whitespace-nowrap">
            VIEW ALL <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        {loading ? (
           <div className="text-center py-24 text-slate-500 font-black uppercase tracking-[0.5em] animate-pulse">Loading Premium Properties...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {properties.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={{
                  ...property,
                  featured_image: property.property_images?.find((img: any) => img.is_featured)?.image_url || property.property_images?.[0]?.image_url || property.featured_image
                }} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
