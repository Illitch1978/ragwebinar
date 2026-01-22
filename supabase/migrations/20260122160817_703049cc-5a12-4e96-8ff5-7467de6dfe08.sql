-- Create presentations table
CREATE TABLE public.presentations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  client_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public access for now - no auth required)
ALTER TABLE public.presentations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read presentations
CREATE POLICY "Anyone can view presentations" 
ON public.presentations 
FOR SELECT 
USING (true);

-- Allow anyone to create presentations
CREATE POLICY "Anyone can create presentations" 
ON public.presentations 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to update presentations
CREATE POLICY "Anyone can update presentations" 
ON public.presentations 
FOR UPDATE 
USING (true);

-- Allow anyone to delete presentations
CREATE POLICY "Anyone can delete presentations" 
ON public.presentations 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_presentations_updated_at
BEFORE UPDATE ON public.presentations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();