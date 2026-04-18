
INSERT INTO storage.buckets (id, name, public)
VALUES ('template-images', 'template-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view template images"
ON storage.objects FOR SELECT
USING (bucket_id = 'template-images');

CREATE POLICY "Admins can upload template images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'template-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update template images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'template-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete template images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'template-images' AND public.has_role(auth.uid(), 'admin'));
