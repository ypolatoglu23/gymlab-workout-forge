-- Drop existing RESTRICTIVE policies and recreate as PERMISSIVE for workouts
DROP POLICY IF EXISTS "Users can view their own workouts" ON public.workouts;
DROP POLICY IF EXISTS "Users can insert their own workouts" ON public.workouts;
DROP POLICY IF EXISTS "Users can update their own workouts" ON public.workouts;
DROP POLICY IF EXISTS "Users can delete their own workouts" ON public.workouts;

CREATE POLICY "Users can view their own workouts" 
ON public.workouts 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workouts" 
ON public.workouts 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workouts" 
ON public.workouts 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workouts" 
ON public.workouts 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Drop existing RESTRICTIVE policies and recreate as PERMISSIVE for routines
DROP POLICY IF EXISTS "Users can view public routines or their own" ON public.routines;
DROP POLICY IF EXISTS "Users can insert their own routines" ON public.routines;
DROP POLICY IF EXISTS "Users can update their own routines" ON public.routines;
DROP POLICY IF EXISTS "Users can delete their own routines" ON public.routines;

CREATE POLICY "Users can view their own routines" 
ON public.routines 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert their own routines" 
ON public.routines 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own routines" 
ON public.routines 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own routines" 
ON public.routines 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Drop existing RESTRICTIVE policies and recreate as PERMISSIVE for exercise_logs
DROP POLICY IF EXISTS "Users can view their own exercise logs" ON public.exercise_logs;
DROP POLICY IF EXISTS "Users can insert their own exercise logs" ON public.exercise_logs;
DROP POLICY IF EXISTS "Users can update their own exercise logs" ON public.exercise_logs;
DROP POLICY IF EXISTS "Users can delete their own exercise logs" ON public.exercise_logs;

CREATE POLICY "Users can view their own exercise logs" 
ON public.exercise_logs 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exercise logs" 
ON public.exercise_logs 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercise logs" 
ON public.exercise_logs 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exercise logs" 
ON public.exercise_logs 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);