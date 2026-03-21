-- Robust RLS Disable (Only disables if table exists)
DO $$ 
DECLARE 
    t_name text;
    tables_to_disable text[] := ARRAY[
        'properties', 
        'property_images', 
        'property_floor_plans', 
        'property_amenity_relation', 
        'nearby_places', 
        'agents', 
        'amenities', 
        'blogs', 
        'testimonials'
    ];
BEGIN 
    FOREACH t_name IN ARRAY tables_to_disable LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = t_name AND table_schema = 'public') THEN
            EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', t_name);
        END IF;
    END LOOP;
END $$;
