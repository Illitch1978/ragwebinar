-- Add presenter_notes column to store per-slide notes as JSONB
-- Format: { "0": "notes for slide 0", "1": "notes for slide 1", ... }
ALTER TABLE public.presentations 
ADD COLUMN presenter_notes jsonb DEFAULT '{}'::jsonb;