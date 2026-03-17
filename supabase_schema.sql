-- 1. Create Agents Table
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    photo TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Properties Table (Advanced Indian Context)
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Defensive Column Addition for Properties Table
DO $$ 
BEGIN 
    -- Basic Info
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='project_name') THEN
        ALTER TABLE properties ADD COLUMN project_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='price') THEN
        ALTER TABLE properties ADD COLUMN price NUMERIC;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='price_per_sqft') THEN
        ALTER TABLE properties ADD COLUMN price_per_sqft NUMERIC;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='property_type') THEN
        ALTER TABLE properties ADD COLUMN property_type TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='bhk_type') THEN
        ALTER TABLE properties ADD COLUMN bhk_type TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='status') THEN
        ALTER TABLE properties ADD COLUMN status TEXT CHECK (status IN ('buy', 'rent'));
    END IF;
    
    -- Areas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='carpet_area') THEN
        ALTER TABLE properties ADD COLUMN carpet_area NUMERIC;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='builtup_area') THEN
        ALTER TABLE properties ADD COLUMN builtup_area NUMERIC;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='super_builtup_area') THEN
        ALTER TABLE properties ADD COLUMN super_builtup_area NUMERIC;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='area_unit') THEN
        ALTER TABLE properties ADD COLUMN area_unit TEXT DEFAULT 'sqft';
    END IF;

    -- Specs
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='bedrooms') THEN
        ALTER TABLE properties ADD COLUMN bedrooms INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='bathrooms') THEN
        ALTER TABLE properties ADD COLUMN bathrooms INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='balconies') THEN
        ALTER TABLE properties ADD COLUMN balconies INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='floor_no') THEN
        ALTER TABLE properties ADD COLUMN floor_no INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='total_floors') THEN
        ALTER TABLE properties ADD COLUMN total_floors INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='facing') THEN
        ALTER TABLE properties ADD COLUMN facing TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='furnishing_status') THEN
        ALTER TABLE properties ADD COLUMN furnishing_status TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='parking') THEN
        ALTER TABLE properties ADD COLUMN parking TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='age_of_property') THEN
        ALTER TABLE properties ADD COLUMN age_of_property TEXT;
    END IF;

    -- Possession
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='possession_status') THEN
        ALTER TABLE properties ADD COLUMN possession_status TEXT CHECK (possession_status IN ('Ready to Move', 'Under Construction', 'New Launch'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='possession_date') THEN
        ALTER TABLE properties ADD COLUMN possession_date DATE;
    END IF;

    -- Location
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='city') THEN
        ALTER TABLE properties ADD COLUMN city TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='location') THEN
        ALTER TABLE properties ADD COLUMN location TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='latitude') THEN
        ALTER TABLE properties ADD COLUMN latitude NUMERIC;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='longitude') THEN
        ALTER TABLE properties ADD COLUMN longitude NUMERIC;
    END IF;

    -- Legal
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='rera_id') THEN
        ALTER TABLE properties ADD COLUMN rera_id TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='maintenance_charges') THEN
        ALTER TABLE properties ADD COLUMN maintenance_charges NUMERIC;
    END IF;
    
    -- Meta
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='agent_id') THEN
        ALTER TABLE properties ADD COLUMN agent_id UUID REFERENCES agents(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='is_featured') THEN
        ALTER TABLE properties ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='brochure_url') THEN
        ALTER TABLE properties ADD COLUMN brochure_url TEXT;
    END IF;
END $$;

-- 3. Create Property Images Table
CREATE TABLE IF NOT EXISTS property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.1 Create Property Floor Plans Table
CREATE TABLE IF NOT EXISTS property_floor_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    title TEXT, -- e.g., "First Floor", "Unit Type A"
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Amenities Table
CREATE TABLE IF NOT EXISTS amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    icon TEXT,
    category TEXT -- Security, Sports, Leisure, Utility
);

-- 5. Junction table for Property Amenities
CREATE TABLE IF NOT EXISTS property_amenity_relation (
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (property_id, amenity_id)
);

-- 6. Nearby Places / Connectivity
CREATE TABLE IF NOT EXISTS nearby_places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    type TEXT, -- School, Hospital, Metro, Mall
    name TEXT NOT NULL,
    distance NUMERIC, -- in KM
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    image_url TEXT,
    category TEXT,
    author TEXT,
    status TEXT CHECK (status IN ('published', 'draft')) DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. Specialized Property Leads Table
CREATE TABLE IF NOT EXISTS property_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    message TEXT,
    status TEXT DEFAULT 'New', -- New, Contacted, Converted, Lost
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Toggle RLS
ALTER TABLE property_leads ENABLE ROW LEVEL SECURITY;

-- Policy
DO $$ 
BEGIN 
    DROP POLICY IF EXISTS "Public Insert Leads" ON property_leads;
END $$;
CREATE POLICY "Public Insert Leads" ON property_leads FOR INSERT WITH CHECK (true);

-- 10. Seed Default Amenities
INSERT INTO amenities (name, icon, category) VALUES
('Security', 'Shield', 'Utility'),
('Swimming Pool', 'Waves', 'Leisure'),
('Gym', 'Dumbbell', 'Sports'),
('WiFi', 'Wifi', 'Utility'),
('Clubhouse', 'Cigarette', 'Leisure'),
('Garden', 'Trees', 'Leisure'),
('Parking', 'Car', 'Utility'),
('Power Backup', 'CloudLightning', 'Utility'),
('Elevator', 'Construction', 'Utility'),
('Spa', 'Sparkles', 'Leisure'),
('Jogging Track', 'Run', 'Sports'),
('Kids Play Area', 'Baby', 'Leisure')
ON CONFLICT (name) DO NOTHING;
