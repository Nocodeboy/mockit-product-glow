
-- Create user_mockups table to store generated mockups
CREATE TABLE IF NOT EXISTS public.user_mockups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  original_image_url TEXT NOT NULL,
  mockup_urls TEXT[] NOT NULL DEFAULT '{}',
  style TEXT DEFAULT 'professional',
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_mockups ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own mockups" ON public.user_mockups
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mockups" ON public.user_mockups
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mockups" ON public.user_mockups
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mockups" ON public.user_mockups
  FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for user mockups
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-mockups', 'user-mockups', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the bucket
CREATE POLICY "Users can upload their own mockups" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'user-mockups' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view mockups" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-mockups');

CREATE POLICY "Users can delete their own mockups" ON storage.objects
  FOR DELETE USING (bucket_id = 'user-mockups' AND auth.uid()::text = (storage.foldername(name))[1]);
