-- =============================================================================
-- RESEARCHBRIDGE MIGRATION: REMOVE STANFORD REFERENCES
-- Run this script in the Supabase SQL Editor if you already executed the schema.
-- It safely updates existing records in place without dropping tables or losing data.
-- =============================================================================

-- 1. Update Institution Name and Verified Domains
UPDATE public.institutions
SET 
    name = 'University Academic Network',
    verified_domains = ARRAY['university.edu', 'stanford.edu'],
    updated_at = NOW()
WHERE 
    id = '22222222-2222-2222-2222-222222222201' 
    OR slug = 'stanford' 
    OR name ILIKE '%Stanford%';

-- Ensure canonical institution record exists and has updated name
INSERT INTO public.institutions (id, name, slug, verified_domains, is_active)
VALUES (
    '22222222-2222-2222-2222-222222222201',
    'University Academic Network',
    'stanford',
    ARRAY['university.edu', 'stanford.edu'],
    true
)
ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    verified_domains = EXCLUDED.verified_domains;

-- 2. Update Public Profiles with updated email domain
UPDATE public.profiles
SET 
    email = REPLACE(email, '@stanford.edu', '@university.edu'),
    updated_at = NOW()
WHERE email ILIKE '%@stanford.edu';

-- 3. Update Supabase Auth Users table (safely wrapped in DO block in case of permission constraints)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'auth' AND table_name = 'users'
    ) THEN
        UPDATE auth.users
        SET email = REPLACE(email, '@stanford.edu', '@university.edu')
        WHERE email ILIKE '%@stanford.edu';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        NULL; -- Safely ignore if auth table permissions are restricted
END $$;

-- 4. Update Professor Onboarding Requests
UPDATE public.professor_onboarding_requests
SET 
    institutional_email = REPLACE(institutional_email, '@stanford.edu', '@university.edu'),
    updated_at = NOW()
WHERE institutional_email ILIKE '%@stanford.edu';

-- 5. Return updated institution to verify
SELECT id, name, slug, verified_domains, is_active FROM public.institutions;

