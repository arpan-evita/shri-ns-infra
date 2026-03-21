-- COMPLETE PROPERTY SCHEMA SYNC (Run this in Supabase SQL Editor)
DO $$ 
BEGIN 
    -- 1. Listing Status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='listing_status') THEN
        ALTER TABLE properties ADD COLUMN listing_status TEXT DEFAULT 'Draft' CHECK (listing_status IN ('Draft', 'Published', 'Archived'));
    END IF;

    -- 2. Location
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='pincode') THEN
        ALTER TABLE properties ADD COLUMN pincode INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='full_address') THEN
        ALTER TABLE properties ADD COLUMN full_address TEXT;
    END IF;

    -- 3. Media & Connectivity
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='video_url') THEN
        ALTER TABLE properties ADD COLUMN video_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='map_embed_url') THEN
        ALTER TABLE properties ADD COLUMN map_embed_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='virtual_tour_360') THEN
        ALTER TABLE properties ADD COLUMN virtual_tour_360 TEXT;
    END IF;

    -- 4. Financial
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='booking_amount') THEN
        ALTER TABLE properties ADD COLUMN booking_amount NUMERIC;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='stamp_duty') THEN
        ALTER TABLE properties ADD COLUMN stamp_duty NUMERIC;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='registration_charges') THEN
        ALTER TABLE properties ADD COLUMN registration_charges NUMERIC;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='price_negotiable') THEN
        ALTER TABLE properties ADD COLUMN price_negotiable BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='loan_available') THEN
        ALTER TABLE properties ADD COLUMN loan_available BOOLEAN DEFAULT FALSE;
    END IF;

    -- 5. SEO
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='meta_title') THEN
        ALTER TABLE properties ADD COLUMN meta_title TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='meta_description') THEN
        ALTER TABLE properties ADD COLUMN meta_description TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='focus_keyword') THEN
        ALTER TABLE properties ADD COLUMN focus_keyword TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='og_image') THEN
        ALTER TABLE properties ADD COLUMN og_image TEXT;
    END IF;

    -- 6. System
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='updated_at') THEN
        ALTER TABLE properties ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;
