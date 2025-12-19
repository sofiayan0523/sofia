-- Create capture_images table to store image URL and NID mappings
CREATE TABLE public.capture_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  nid TEXT NOT NULL,
  file_name TEXT,
  mime_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.capture_images ENABLE ROW LEVEL SECURITY;

-- RLS policy: Users can view their own capture images
CREATE POLICY "Users can view their own capture images"
ON public.capture_images
FOR SELECT
USING (auth.uid() = user_id);

-- RLS policy: Users can insert their own capture images
CREATE POLICY "Users can insert their own capture images"
ON public.capture_images
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS policy: Public can view all capture images (needed for blog display)
CREATE POLICY "Public can view all capture images"
ON public.capture_images
FOR SELECT
USING (true);