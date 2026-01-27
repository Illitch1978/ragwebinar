-- Add terms_and_conditions field to brand_guides for Proposal PDFs
ALTER TABLE public.brand_guides 
ADD COLUMN terms_and_conditions text;