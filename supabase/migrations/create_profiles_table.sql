-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by authenticated users" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Master Admin Full Access" 
ON public.profiles FOR ALL 
TO authenticated 
USING (
    auth.jwt() ->> 'email' IN ('arpansadhu13@gmail.com', 'shrinsinframarketing@gmail.com', 'info@shrinsinfra.com')
)
WITH CHECK (
    auth.jwt() ->> 'email' IN ('arpansadhu13@gmail.com', 'shrinsinframarketing@gmail.com', 'info@shrinsinfra.com')
);

-- Function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, is_approved)
    VALUES (
        new.id, 
        new.email, 
        CASE 
            WHEN new.email IN ('arpansadhu13@gmail.com', 'shrinsinframarketing@gmail.com') THEN TRUE 
            ELSE FALSE 
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
