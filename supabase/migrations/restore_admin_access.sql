-- Restore Admin access for info@shrinsinfra.com
-- 1. Ensure super admins are in admin_invites (whitelist)
INSERT INTO public.admin_invites (email)
VALUES 
    ('info@shrinsinfra.com'),
    ('shrinsinframarketing@gmail.com'),
    ('arpansadhu13@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- 2. Update existing profiles to be approved
UPDATE public.profiles
SET is_approved = TRUE
WHERE email IN ('info@shrinsinfra.com', 'shrinsinframarketing@gmail.com', 'arpansadhu13@gmail.com');

-- 3. Update Super Admin list in policies (admin_invites)
DROP POLICY IF EXISTS "Super Admin Full Access on Invites" ON public.admin_invites;
CREATE POLICY "Super Admin Full Access on Invites" 
ON public.admin_invites FOR ALL 
TO authenticated 
USING (
    auth.jwt() ->> 'email' IN ('arpansadhu13@gmail.com', 'shrinsinframarketing@gmail.com', 'info@shrinsinfra.com')
);

-- 4. Update the handle_new_user function to include the restored admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, is_approved)
    VALUES (
        new.id, 
        new.email, 
        CASE 
            WHEN new.email IN ('arpansadhu13@gmail.com', 'shrinsinframarketing@gmail.com', 'info@shrinsinfra.com') THEN TRUE 
            WHEN EXISTS (SELECT 1 FROM public.admin_invites WHERE email = new.email) THEN TRUE
            ELSE FALSE 
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
