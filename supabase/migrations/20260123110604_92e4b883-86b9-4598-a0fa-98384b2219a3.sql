-- Create storage bucket for slide screenshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('slide-screenshots', 'slide-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read slide screenshots (they're temporary)
CREATE POLICY "Anyone can view slide screenshots"
ON storage.objects FOR SELECT
USING (bucket_id = 'slide-screenshots');

-- Allow anyone to upload slide screenshots
CREATE POLICY "Anyone can upload slide screenshots"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'slide-screenshots');

-- Allow anyone to delete slide screenshots
CREATE POLICY "Anyone can delete slide screenshots"
ON storage.objects FOR DELETE
USING (bucket_id = 'slide-screenshots');