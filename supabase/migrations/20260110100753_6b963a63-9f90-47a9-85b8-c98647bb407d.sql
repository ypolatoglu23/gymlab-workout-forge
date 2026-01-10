
-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;

-- Create restricted policy - users can only view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Create a security definer function for leaderboard (exposes only non-sensitive data)
CREATE OR REPLACE FUNCTION public.get_leaderboard_profiles()
RETURNS TABLE (
  user_id UUID,
  username TEXT,
  avatar_url TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.user_id, p.username, p.avatar_url
  FROM public.profiles p
$$;
