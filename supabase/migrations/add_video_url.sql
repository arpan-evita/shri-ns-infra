-- Add video_url column to properties table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='video_url') THEN
        ALTER TABLE properties ADD COLUMN video_url TEXT;
    END IF;
END $$;
