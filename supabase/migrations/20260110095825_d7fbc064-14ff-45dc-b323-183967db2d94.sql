
-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  height_cm NUMERIC,
  weight_kg NUMERIC,
  goal_weight_kg NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exercises table (library of exercises)
CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  description TEXT,
  instructions TEXT[],
  tips TEXT[],
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create routines table (workout templates)
CREATE TABLE public.routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  exercises JSONB NOT NULL DEFAULT '[]',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workouts table (completed workout sessions)
CREATE TABLE public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  routine_id UUID REFERENCES public.routines(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exercise_logs table (individual exercise sets within a workout)
CREATE TABLE public.exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE SET NULL,
  exercise_name TEXT NOT NULL,
  set_number INTEGER NOT NULL,
  weight_kg NUMERIC,
  reps INTEGER,
  duration_seconds INTEGER,
  is_completed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create nutrition_entries table
CREATE TABLE public.nutrition_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type TEXT NOT NULL,
  food_name TEXT NOT NULL,
  calories INTEGER NOT NULL DEFAULT 0,
  protein_g NUMERIC DEFAULT 0,
  carbs_g NUMERIC DEFAULT 0,
  fats_g NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create body_measurements table for tracking progress
CREATE TABLE public.body_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  measured_at DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg NUMERIC,
  body_fat_percentage NUMERIC,
  chest_cm NUMERIC,
  waist_cm NUMERIC,
  hips_cm NUMERIC,
  biceps_cm NUMERIC,
  thighs_cm NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Exercises policies (public read, no user modification)
CREATE POLICY "Anyone can view exercises" ON public.exercises FOR SELECT USING (true);

-- Routines policies
CREATE POLICY "Users can view public routines or their own" ON public.routines FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can insert their own routines" ON public.routines FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own routines" ON public.routines FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own routines" ON public.routines FOR DELETE USING (auth.uid() = user_id);

-- Workouts policies
CREATE POLICY "Users can view their own workouts" ON public.workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own workouts" ON public.workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own workouts" ON public.workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own workouts" ON public.workouts FOR DELETE USING (auth.uid() = user_id);

-- Exercise logs policies
CREATE POLICY "Users can view their own exercise logs" ON public.exercise_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own exercise logs" ON public.exercise_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own exercise logs" ON public.exercise_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own exercise logs" ON public.exercise_logs FOR DELETE USING (auth.uid() = user_id);

-- Nutrition entries policies
CREATE POLICY "Users can view their own nutrition entries" ON public.nutrition_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own nutrition entries" ON public.nutrition_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own nutrition entries" ON public.nutrition_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own nutrition entries" ON public.nutrition_entries FOR DELETE USING (auth.uid() = user_id);

-- Body measurements policies
CREATE POLICY "Users can view their own measurements" ON public.body_measurements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own measurements" ON public.body_measurements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own measurements" ON public.body_measurements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own measurements" ON public.body_measurements FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_routines_updated_at BEFORE UPDATE ON public.routines FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default exercises for the library
INSERT INTO public.exercises (name, category, muscle_group, description, instructions, tips) VALUES
('Bench Press', 'Strength', 'Chest', 'Classic compound exercise for chest development', ARRAY['Lie flat on a bench with feet on the floor', 'Grip the bar slightly wider than shoulder-width', 'Lower the bar to your chest with control', 'Press the bar back up to the starting position'], ARRAY['Keep your shoulder blades squeezed together', 'Maintain a slight arch in your lower back', 'Drive through your feet for stability']),
('Squat', 'Strength', 'Legs', 'Fundamental lower body compound movement', ARRAY['Stand with feet shoulder-width apart', 'Keep your chest up and core engaged', 'Lower your hips back and down', 'Push through your heels to stand back up'], ARRAY['Keep your knees tracking over your toes', 'Maintain a neutral spine throughout', 'Go as deep as your mobility allows']),
('Deadlift', 'Strength', 'Back', 'Full body pulling movement', ARRAY['Stand with feet hip-width apart, bar over mid-foot', 'Hinge at hips to grip the bar', 'Keep back flat, drive through heels to stand', 'Lower with control by hinging at hips'], ARRAY['Keep the bar close to your body', 'Engage your lats before lifting', 'Lock out hips and knees together']),
('Overhead Press', 'Strength', 'Shoulders', 'Vertical pressing movement for shoulder development', ARRAY['Stand with feet shoulder-width apart', 'Hold bar at shoulder height', 'Press the bar overhead until arms are locked', 'Lower with control back to shoulders'], ARRAY['Squeeze your glutes for stability', 'Move your head back slightly as bar passes', 'Lock out at the top']),
('Pull-ups', 'Strength', 'Back', 'Bodyweight pulling exercise', ARRAY['Hang from bar with overhand grip', 'Pull yourself up until chin clears bar', 'Lower with control to full extension', 'Repeat for desired reps'], ARRAY['Initiate the pull with your lats', 'Avoid swinging or kipping', 'Full range of motion is key']),
('Barbell Row', 'Strength', 'Back', 'Horizontal pulling movement', ARRAY['Hinge at hips holding barbell', 'Pull bar to lower chest/upper abs', 'Squeeze shoulder blades at top', 'Lower with control'], ARRAY['Keep your back flat throughout', 'Pull with your elbows, not your hands', 'Avoid using momentum']),
('Dumbbell Curl', 'Strength', 'Arms', 'Isolation exercise for biceps', ARRAY['Stand holding dumbbells at sides', 'Curl weights up while keeping elbows fixed', 'Squeeze biceps at the top', 'Lower with control'], ARRAY['Keep your elbows pinned to your sides', 'Avoid swinging the weights', 'Control the negative']),
('Tricep Pushdown', 'Strength', 'Arms', 'Isolation exercise for triceps', ARRAY['Stand at cable machine with rope attachment', 'Push the rope down until arms are straight', 'Squeeze triceps at the bottom', 'Return with control'], ARRAY['Keep elbows at your sides', 'Spread the rope at the bottom', 'Avoid leaning forward']),
('Leg Press', 'Strength', 'Legs', 'Machine-based leg exercise', ARRAY['Sit in leg press with feet on platform', 'Lower the weight with control', 'Press through heels to extend legs', 'Avoid locking knees at top'], ARRAY['Keep your lower back flat against pad', 'Do not let knees cave inward', 'Use a full range of motion']),
('Lat Pulldown', 'Strength', 'Back', 'Cable pulling exercise for lats', ARRAY['Sit at lat pulldown machine', 'Pull bar down to upper chest', 'Squeeze lats at the bottom', 'Return with control'], ARRAY['Lead with your elbows', 'Avoid leaning too far back', 'Full stretch at the top']),
('Plank', 'Core', 'Core', 'Isometric core strengthening exercise', ARRAY['Start in push-up position on forearms', 'Keep body in straight line', 'Engage core and hold position', 'Breathe steadily throughout'], ARRAY['Do not let hips sag or pike up', 'Keep neck neutral', 'Squeeze glutes for stability']),
('Running', 'Cardio', 'Full Body', 'Cardiovascular endurance exercise', ARRAY['Start at a comfortable pace', 'Maintain good posture', 'Land midfoot with each stride', 'Breathe rhythmically'], ARRAY['Start slow and build up', 'Stay hydrated', 'Wear proper footwear']);
