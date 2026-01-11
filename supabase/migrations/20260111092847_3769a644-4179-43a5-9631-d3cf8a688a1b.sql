-- Add unit preference columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN weight_unit text NOT NULL DEFAULT 'kg',
ADD COLUMN height_unit text NOT NULL DEFAULT 'cm';

-- Add check constraints for valid values
ALTER TABLE public.profiles 
ADD CONSTRAINT valid_weight_unit CHECK (weight_unit IN ('kg', 'lbs')),
ADD CONSTRAINT valid_height_unit CHECK (height_unit IN ('cm', 'ft'));