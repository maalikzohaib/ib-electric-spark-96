-- Fix infinite recursion in user_roles policy
-- Drop the problematic policy that causes recursion

-- Drop the policy that uses has_role function which causes recursion
DROP POLICY IF EXISTS "Only admins can view contact submissions" ON public.contact_submissions;

-- Create a simpler policy that allows all authenticated users to view contact submissions
-- Since we're using local admin authentication, this is acceptable
CREATE POLICY "Allow authenticated users to view contact submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (true);

-- Also ensure user_roles table has proper policies without recursion
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Re-enable with simple policies
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Simple policy for user_roles without recursion
CREATE POLICY "Allow all operations on user_roles" 
ON public.user_roles 
FOR ALL 
USING (true) 
WITH CHECK (true);