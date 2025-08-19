-- Fix function search path security issue
DROP FUNCTION IF EXISTS create_admin_user();

CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Check if admin user already exists
    SELECT auth.uid() INTO admin_user_id;
    
    -- If no authenticated user, we'll create policies that allow admin operations
    -- For now, let's temporarily allow admin operations without strict auth
END;
$$;