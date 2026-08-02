/*
# Add site settings, backup tracking, and admin auth support

1. New Tables
- `site_settings` — single-row table holding all editable site configuration:
  - SEO (title, meta description, keywords)
  - Google Maps embed URL
  - Social media links (Instagram, Facebook, Twitter/X, YouTube, TikTok)
  - Logo URL and favicon URL
  - Google Analytics tracking ID
  - Google Search Console verification code
  - Google Calendar integration (embed URL, enabled flag)
  - Contact info (address, phone, email, hours)
  - Email notification settings (notification email address, enabled flag)
- `backups` — records of automatic and manual database backups:
  - id, filename, size, type (auto/manual), table counts, status, created_at

2. Security
- `site_settings`: RLS enabled. Public read (anon + authenticated) so the site can load settings client-side. Only authenticated admins can update.
- `backups`: RLS enabled. Only authenticated users can read/insert/delete (admin-only data).

3. Important Notes
- site_settings is seeded with one row (id=1) containing sensible defaults.
- The admin user will be created via Supabase Auth (email/password) by the site owner through the /admin/login page.
- All settings are stored as text/boolean columns for simplicity.
*/

CREATE TABLE IF NOT EXISTS site_settings (
  id integer PRIMARY KEY DEFAULT 1,
  -- SEO
  seo_title text DEFAULT 'PHỞ Dijon — Restaurant Vietnamien Authentique à Dijon',
  seo_description text DEFAULT 'Découvrez l''authentique cuisine vietnamienne au cœur de Dijon. Pho traditionnel, bun, banh mi et bien plus.',
  seo_keywords text DEFAULT 'restaurant vietnamien Dijon, pho Dijon, cuisine vietnamienne authentique, banh mi Dijon, restaurant asiatique Dijon',
  -- Google Maps
  google_maps_url text DEFAULT 'https://www.openstreetmap.org/export/embed.html?bbox=5.021%2C47.317%2C5.041%2C47.327&layer=mapnik&marker=47.322%2C5.031',
  -- Social media
  instagram_url text DEFAULT '',
  facebook_url text DEFAULT '',
  twitter_url text DEFAULT '',
  youtube_url text DEFAULT '',
  tiktok_url text DEFAULT '',
  -- Branding
  logo_url text DEFAULT '',
  favicon_url text DEFAULT '',
  -- Analytics
  google_analytics_id text DEFAULT '',
  search_console_code text DEFAULT '',
  -- Google Calendar
  google_calendar_url text DEFAULT '',
  google_calendar_enabled boolean DEFAULT false,
  -- Contact info
  contact_address text DEFAULT '12 Rue des Forges, 21000 Dijon, France',
  contact_phone text DEFAULT '+33 3 80 00 00 00',
  contact_email text DEFAULT 'bonjour@phodijon.fr',
  contact_hours text DEFAULT 'Ouvert tous les jours · 11h30 — 22h00',
  -- Email notifications
  notification_email text DEFAULT 'bonjour@phodijon.fr',
  email_notifications_enabled boolean DEFAULT true,
  -- Timestamps
  updated_at timestamptz DEFAULT now()
);

-- Seed the single settings row
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read: the site needs to load settings (SEO, logo, social links, etc.) without auth
DROP POLICY IF EXISTS "public_read_site_settings" ON site_settings;
CREATE POLICY "public_read_site_settings"
ON site_settings FOR SELECT
TO anon, authenticated USING (true);

-- Only authenticated admins can update settings
DROP POLICY IF EXISTS "admin_update_site_settings" ON site_settings;
CREATE POLICY "admin_update_site_settings"
ON site_settings FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

-- Backups table
CREATE TABLE IF NOT EXISTS backups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  file_size bigint DEFAULT 0,
  backup_type text DEFAULT 'manual',
  table_counts jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'completed',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE backups ENABLE ROW LEVEL SECURITY;

-- Only authenticated admins can manage backups
DROP POLICY IF EXISTS "admin_read_backups" ON backups;
CREATE POLICY "admin_read_backups"
ON backups FOR SELECT
TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_backups" ON backups;
CREATE POLICY "admin_insert_backups"
ON backups FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_backups" ON backups;
CREATE POLICY "admin_delete_backups"
ON backups FOR DELETE
TO authenticated USING (true);
