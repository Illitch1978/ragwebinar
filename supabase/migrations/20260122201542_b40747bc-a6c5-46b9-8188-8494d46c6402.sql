-- Create brand_guides table for storing presentation templates
CREATE TABLE public.brand_guides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  design_system JSONB NOT NULL DEFAULT '{}',
  slide_templates JSONB NOT NULL DEFAULT '[]',
  example_content TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.brand_guides ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read brand guides (they're templates)
CREATE POLICY "Brand guides are viewable by everyone" 
ON public.brand_guides 
FOR SELECT 
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_brand_guides_updated_at
BEFORE UPDATE ON public.brand_guides
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add a column to presentations to track which brand guide was used
ALTER TABLE public.presentations 
ADD COLUMN brand_guide_id UUID REFERENCES public.brand_guides(id),
ADD COLUMN generated_slides JSONB;