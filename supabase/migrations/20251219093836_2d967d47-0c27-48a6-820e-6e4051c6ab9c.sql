-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'thoughts',
  cover_image TEXT,
  read_time TEXT DEFAULT '5 min',
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_posts
-- Anyone can view published posts
CREATE POLICY "Published posts are viewable by everyone" 
ON public.blog_posts 
FOR SELECT 
USING (published = true);

-- Authors can view all their own posts (including drafts)
CREATE POLICY "Authors can view their own posts" 
ON public.blog_posts 
FOR SELECT 
USING (auth.uid() = user_id);

-- Authors can create their own posts
CREATE POLICY "Authors can create their own posts" 
ON public.blog_posts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Authors can update their own posts
CREATE POLICY "Authors can update their own posts" 
ON public.blog_posts 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Authors can delete their own posts
CREATE POLICY "Authors can delete their own posts" 
ON public.blog_posts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true);

-- Create storage policies for blog images
CREATE POLICY "Blog images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own blog images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'blog-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own blog images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'blog-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Enable realtime for blog_posts
ALTER PUBLICATION supabase_realtime ADD TABLE public.blog_posts;