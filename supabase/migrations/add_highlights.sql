-- Add highlights column to properties table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='highlights') THEN
        ALTER TABLE properties ADD COLUMN highlights TEXT;
    END IF;
END $$;
