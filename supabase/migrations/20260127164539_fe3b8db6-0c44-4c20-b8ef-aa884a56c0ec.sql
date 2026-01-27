-- Add created_by field to track deck ownership
ALTER TABLE public.presentations
ADD COLUMN created_by text;