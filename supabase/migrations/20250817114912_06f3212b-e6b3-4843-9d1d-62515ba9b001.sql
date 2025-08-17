-- Add SELECT policy for contact_submissions table to restrict access to admins only
CREATE POLICY "Only admins can view contact submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));