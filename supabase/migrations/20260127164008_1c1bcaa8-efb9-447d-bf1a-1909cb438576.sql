-- Add is_locked column to presentations table
ALTER TABLE public.presentations
ADD COLUMN is_locked boolean NOT NULL DEFAULT false;

-- Add a comment explaining the column
COMMENT ON COLUMN public.presentations.is_locked IS 'When true, prevents any modifications to the presentation';