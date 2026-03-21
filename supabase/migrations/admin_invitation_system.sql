-- 1. Create admin_invites table
CREATE TABLE IF NOT EXISTS public.admin_invites (
    email TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Allow Super Admins to manage invites
ALTER TABLE public.admin_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Super Admin Full Access on Invites" 
ON public.admin_invites FOR ALL 
TO authenticated 
USING (
    auth.jwt() ->> 'email' IN ('arpansadhu13@gmail.com', 'shrinsinframarketing@gmail.com')
);

-- 3. Update handle_new_user to check the whitelist
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, is_approved)
    VALUES (
        new.id, 
        new.email, 
        CASE 
            WHEN new.email IN ('arpansadhu13@gmail.com', 'shrinsinframarketing@gmail.com') THEN TRUE 
            WHEN EXISTS (SELECT 1 FROM public.admin_invites WHERE email = new.email) THEN TRUE
            ELSE FALSE 
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
