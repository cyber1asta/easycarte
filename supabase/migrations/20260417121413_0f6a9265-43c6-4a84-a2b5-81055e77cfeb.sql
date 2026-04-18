
-- Auto-create profile + auto-assign 'user' role when a new account signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email))
  ON CONFLICT DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Unique constraint to support ON CONFLICT for roles
DO $$ BEGIN
  ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_role_unique UNIQUE (user_id, role);
EXCEPTION WHEN duplicate_table THEN NULL; WHEN duplicate_object THEN NULL; END $$;

-- Backfill profiles for existing users
INSERT INTO public.profiles (user_id, display_name)
SELECT u.id, COALESCE(u.raw_user_meta_data->>'full_name', u.email)
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE p.id IS NULL;

-- Backfill default 'user' role for existing users without any role
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'user'::app_role
FROM auth.users u
LEFT JOIN public.user_roles r ON r.user_id = u.id
WHERE r.id IS NULL;

-- Promote the currently-testing user to admin
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'takihouria2002@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Seed a few starter templates
INSERT INTO public.templates (name, description, category, price, currency, is_active, image_url) VALUES
  ('Minimal Noir', 'Sleek black & white card with elegant typography', 'minimal', 120, 'MAD', true, null),
  ('Gold Executive', 'Premium gold-accented design for executives', 'premium', 180, 'MAD', true, null),
  ('Modern Gradient', 'Vibrant gradient design for creatives', 'creative', 140, 'MAD', true, null),
  ('Classic Corporate', 'Timeless corporate look', 'corporate', 100, 'MAD', true, null);

-- Seed default site settings
INSERT INTO public.site_settings (key, value, description) VALUES
  ('site_name', 'EasyCarte', 'Public site name'),
  ('contact_email', 'contact@easycarte.ma', 'Primary contact email'),
  ('contact_phone', '0642910204', 'Primary contact phone'),
  ('whatsapp_number', '212642910204', 'WhatsApp number (international format)'),
  ('instagram_handle', 'e_asycarte', 'Instagram handle without @'),
  ('location', 'Salé, Morocco', 'Business location');
