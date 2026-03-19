-- Add map_embed_url column to properties table
-- This stores the Google Maps embed src URL pasted by the admin
ALTER TABLE properties ADD COLUMN IF NOT EXISTS map_embed_url TEXT;
