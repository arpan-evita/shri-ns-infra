-- Add listing_status column to properties table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='listing_status') THEN
        ALTER TABLE properties ADD COLUMN listing_status TEXT DEFAULT 'Draft' CHECK (listing_status IN ('Draft', 'Published', 'Archived'));
    END IF;
END $$;
