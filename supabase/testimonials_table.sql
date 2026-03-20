-- Run this in your Supabase SQL Editor
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    location TEXT, -- e.g., "Delhi", "Noida"
    rating INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (optional but recommended)
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public Read Testimonials" ON testimonials FOR SELECT USING (true);
