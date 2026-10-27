-- Migration: Secure Admin Dashboard & Authorization
-- Description: Create public.admin_users, is_admin() function, and quote_requests RLS policies

-- 1. Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL,
    role text NOT NULL DEFAULT 'admin',
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 2. Policy: authenticated users can query their own admin record
DROP POLICY IF EXISTS "Allow users to check their own admin status" ON public.admin_users;
CREATE POLICY "Allow users to check their own admin status"
ON public.admin_users
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 3. Helper function: checks if auth.uid() is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
$$;

-- 4. Enable RLS on quote_requests (idempotent)
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- 5. Admin RLS Policies for quote_requests
DROP POLICY IF EXISTS "Allow admins to read quote requests" ON public.quote_requests;
CREATE POLICY "Allow admins to read quote requests"
ON public.quote_requests
FOR SELECT
TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS "Allow admins to update quote requests" ON public.quote_requests;
CREATE POLICY "Allow admins to update quote requests"
ON public.quote_requests
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Allow admins to delete quote requests" ON public.quote_requests;
CREATE POLICY "Allow admins to delete quote requests"
ON public.quote_requests
FOR DELETE
TO authenticated
USING (public.is_admin());
