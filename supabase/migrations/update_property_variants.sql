-- Universal Dynamic Property System Migration

-- 1. Add developer_name to properties
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='developer_name') THEN
        ALTER TABLE properties ADD COLUMN developer_name TEXT;
    END IF;
END $$;

-- 2. Create property_variants table
CREATE TABLE IF NOT EXISTS property_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    label TEXT, -- e.g. "3BHK | 1645 SqFt"
    type TEXT, -- Residential, Commercial, etc.
    configuration TEXT, -- 3BHK, 4BHK, Shop A
    size NUMERIC,
    size_unit TEXT DEFAULT 'SqFt',
    price NUMERIC,
    price_unit TEXT DEFAULT 'Cr',
    status TEXT DEFAULT 'Available', -- Available, Sold Out
    specifications JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Update property_type constraints (if any) or just leave it for application logic
-- Assuming property_type is a TEXT column without strict CHECK constraints for now.

-- 4. Create index for performance
CREATE INDEX IF NOT EXISTS idx_property_variants_property_id ON property_variants(property_id);

-- 5. RLS Policies for property_variants
ALTER TABLE property_variants ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'property_variants' AND policyname = 'Allow public read access'
    ) THEN
        CREATE POLICY "Allow public read access" ON property_variants FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'property_variants' AND policyname = 'Allow admin all access'
    ) THEN
        CREATE POLICY "Allow admin all access" ON property_variants FOR ALL USING (true);
    END IF;
END $$;
