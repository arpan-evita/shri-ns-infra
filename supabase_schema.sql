-- Create Agents Table
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    photo TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Properties Table
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price NUMERIC,
    property_type TEXT,
    status TEXT CHECK (status IN ('buy', 'rent')),
    bedrooms INTEGER,
    bathrooms INTEGER,
    area NUMERIC,
    city TEXT,
    location TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Property Images Table
CREATE TABLE IF NOT EXISTS property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE
);

-- Create Property Features Table
CREATE TABLE IF NOT EXISTS property_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    icon TEXT
);

-- Create Property Feature Values Table
CREATE TABLE IF NOT EXISTS property_feature_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    feature_id UUID REFERENCES property_features(id) ON DELETE CASCADE,
    value TEXT NOT NULL,
    UNIQUE(property_id, feature_id)
);

-- Create Leads Table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security) - Basic setup
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_feature_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public Read Access" ON properties FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON property_images FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON agents FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON property_features FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON property_feature_values FOR SELECT USING (true);

-- Leads: Anyone can insert, but only authenticated (admin) can select
CREATE POLICY "Public Insert Leads" ON leads FOR INSERT WITH CHECK (true);
-- Admin policies would normally check for admin role/email, simplifying for now
-- CREATE POLICY "Admin Select Leads" ON leads FOR SELECT USING (auth.role() = 'authenticated');
