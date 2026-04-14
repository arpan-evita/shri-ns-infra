-- Universal Dynamic Property System Migration (Phase 2 - PDF Alignment)

-- 1. Extend properties table
DO $$ 
BEGIN 
    -- Basic Info
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='developer_name') THEN
        ALTER TABLE properties ADD COLUMN developer_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='property_uid') THEN
        ALTER TABLE properties ADD COLUMN property_uid TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='sub_type') THEN
        ALTER TABLE properties ADD COLUMN sub_type TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='is_featured') THEN
        ALTER TABLE properties ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
    END IF;

    -- Location
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='country') THEN
        ALTER TABLE properties ADD COLUMN country TEXT DEFAULT 'India';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='state') THEN
        ALTER TABLE properties ADD COLUMN state TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='micro_market') THEN
        ALTER TABLE properties ADD COLUMN micro_market TEXT;
    END IF;

    -- Pricing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='max_price') THEN
        ALTER TABLE properties ADD COLUMN max_price NUMERIC;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='price_per_sq_yd') THEN
        ALTER TABLE properties ADD COLUMN price_per_sq_yd NUMERIC;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='eoi_amount') THEN
        ALTER TABLE properties ADD COLUMN eoi_amount NUMERIC;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='plc_charges') THEN
        ALTER TABLE properties ADD COLUMN plc_charges TEXT;
    END IF;

    -- Project Details
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='launch_date') THEN
        ALTER TABLE properties ADD COLUMN launch_date DATE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='total_land_area') THEN
        ALTER TABLE properties ADD COLUMN total_land_area TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='total_towers') THEN
        ALTER TABLE properties ADD COLUMN total_towers INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='total_units') THEN
        ALTER TABLE properties ADD COLUMN total_units INTEGER;
    END IF;

    -- SEO & Media
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='meta_keywords') THEN
        ALTER TABLE properties ADD COLUMN meta_keywords TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='canonical_url') THEN
        ALTER TABLE properties ADD COLUMN canonical_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='schema_markup') THEN
        ALTER TABLE properties ADD COLUMN schema_markup TEXT;
    END IF;

    -- Lead Routing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='whatsapp_number') THEN
        ALTER TABLE properties ADD COLUMN whatsapp_number TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='alternate_contact_number') THEN
        ALTER TABLE properties ADD COLUMN alternate_contact_number TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='cta_label_override') THEN
        ALTER TABLE properties ADD COLUMN cta_label_override TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='lead_source_tag') THEN
        ALTER TABLE properties ADD COLUMN lead_source_tag TEXT;
    END IF;
END $$;

-- 2. Create property_variants table (with extra fields)
CREATE TABLE IF NOT EXISTS property_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    label TEXT, 
    type TEXT, 
    configuration TEXT, 
    size NUMERIC,
    size_unit TEXT DEFAULT 'SqFt',
    price NUMERIC,
    price_unit TEXT DEFAULT 'Cr',
    status TEXT DEFAULT 'Available',
    inventory_count INTEGER DEFAULT 1,
    notes TEXT,
    specifications JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create property_specifications table
CREATE TABLE IF NOT EXISTS property_specifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_property_variants_property_id ON property_variants(property_id);
CREATE INDEX IF NOT EXISTS idx_property_specifications_property_id ON property_specifications(property_id);

-- 5. RLS Policies
ALTER TABLE property_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_specifications ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    -- property_variants policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'property_variants' AND policyname = 'Allow public read access') THEN
        CREATE POLICY "Allow public read access" ON property_variants FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'property_variants' AND policyname = 'Allow admin all access') THEN
        CREATE POLICY "Allow admin all access" ON property_variants FOR ALL USING (true);
    END IF;

    -- property_specifications policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'property_specifications' AND policyname = 'Allow public read access') THEN
        CREATE POLICY "Allow public read access" ON property_specifications FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'property_specifications' AND policyname = 'Allow admin all access') THEN
        CREATE POLICY "Allow admin all access" ON property_specifications FOR ALL USING (true);
    END IF;
END $$;
