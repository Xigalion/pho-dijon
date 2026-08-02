/*
# PHỞ Dijon — Restaurant Schema (single-tenant, no auth)

1. New Tables
- `menu_items`: restaurant menu dishes (pho, rice, noodles, vegetarian, desserts, drinks)
  - id, name, description, price, category, image_url, calories, spice_level, is_popular, is_chef_choice, is_available, sort_order, created_at
- `reservations`: customer booking requests
  - id, name, email, phone, date, time, guests, seating (indoor/terrace), special_request, status, created_at
- `orders`: online orders (delivery/pickup)
  - id, customer_name, customer_phone, customer_email, type (delivery/pickup), address, items (jsonb), subtotal, discount_code, total, status, estimated_time, created_at
- `events`: restaurant events (Tet, private, birthday, corporate)
  - id, title, description, image_url, date, time, location, price, capacity, created_at
- `gallery_images`: gallery photos (food, restaurant, kitchen, staff, customers)
  - id, title, image_url, category, created_at
- `testimonials`: customer reviews
  - id, name, rating, comment, source (google/instagram), avatar_url, created_at
- `gift_cards`: gift card purchases
  - id, purchaser_name, recipient_name, recipient_email, amount, message, code, created_at
- `newsletter_subscribers`: newsletter signups
  - id, email, created_at
- `promotions`: discount codes and loyalty promotions
  - id, code, description, discount_type (percent/fixed), discount_value, active, created_at

2. Security
- This is a single-tenant public restaurant website with no sign-in screen.
- All tables use `TO anon, authenticated` policies so the anon-key frontend can read/write.
- Public read on all tables; public insert on reservations, orders, gift_cards, newsletter_subscribers.
- Menu items, events, gallery, testimonials, promotions are editable (update/delete) by anon for the admin dashboard demo.
*/

-- Menu items
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'pho',
  image_url text NOT NULL DEFAULT '',
  calories integer NOT NULL DEFAULT 0,
  spice_level integer NOT NULL DEFAULT 0,
  is_popular boolean NOT NULL DEFAULT false,
  is_chef_choice boolean NOT NULL DEFAULT false,
  is_available boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_menu" ON menu_items;
CREATE POLICY "anon_select_menu" ON menu_items FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_menu" ON menu_items;
CREATE POLICY "anon_insert_menu" ON menu_items FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_menu" ON menu_items;
CREATE POLICY "anon_update_menu" ON menu_items FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_menu" ON menu_items;
CREATE POLICY "anon_delete_menu" ON menu_items FOR DELETE TO anon, authenticated USING (true);

-- Reservations
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  guests integer NOT NULL DEFAULT 2,
  seating text NOT NULL DEFAULT 'indoor',
  special_request text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_reservations" ON reservations;
CREATE POLICY "anon_select_reservations" ON reservations FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_reservations" ON reservations;
CREATE POLICY "anon_insert_reservations" ON reservations FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_reservations" ON reservations;
CREATE POLICY "anon_update_reservations" ON reservations FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_reservations" ON reservations;
CREATE POLICY "anon_delete_reservations" ON reservations FOR DELETE TO anon, authenticated USING (true);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL DEFAULT '',
  customer_email text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'pickup',
  address text NOT NULL DEFAULT '',
  items jsonb NOT NULL DEFAULT '[]',
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  discount_code text NOT NULL DEFAULT '',
  total numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  estimated_time text NOT NULL DEFAULT '25-35 min',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE TO anon, authenticated USING (true);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  date date,
  time text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  capacity integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_events" ON events;
CREATE POLICY "anon_select_events" ON events FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_events" ON events;
CREATE POLICY "anon_insert_events" ON events FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_events" ON events;
CREATE POLICY "anon_update_events" ON events FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_events" ON events;
CREATE POLICY "anon_delete_events" ON events FOR DELETE TO anon, authenticated USING (true);

-- Gallery images
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  category text NOT NULL DEFAULT 'food',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_gallery" ON gallery_images;
CREATE POLICY "anon_select_gallery" ON gallery_images FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_gallery" ON gallery_images;
CREATE POLICY "anon_insert_gallery" ON gallery_images FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_gallery" ON gallery_images;
CREATE POLICY "anon_update_gallery" ON gallery_images FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_gallery" ON gallery_images;
CREATE POLICY "anon_delete_gallery" ON gallery_images FOR DELETE TO anon, authenticated USING (true);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  comment text NOT NULL DEFAULT '',
  source text NOT NULL DEFAULT 'google',
  avatar_url text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_testimonials" ON testimonials;
CREATE POLICY "anon_select_testimonials" ON testimonials FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_testimonials" ON testimonials;
CREATE POLICY "anon_insert_testimonials" ON testimonials FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_testimonials" ON testimonials;
CREATE POLICY "anon_update_testimonials" ON testimonials FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_testimonials" ON testimonials;
CREATE POLICY "anon_delete_testimonials" ON testimonials FOR DELETE TO anon, authenticated USING (true);

-- Gift cards
CREATE TABLE IF NOT EXISTS gift_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchaser_name text NOT NULL,
  recipient_name text NOT NULL,
  recipient_email text NOT NULL,
  amount numeric(10,2) NOT NULL DEFAULT 50,
  message text NOT NULL DEFAULT '',
  code text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE gift_cards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_giftcards" ON gift_cards;
CREATE POLICY "anon_select_giftcards" ON gift_cards FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_giftcards" ON gift_cards;
CREATE POLICY "anon_insert_giftcards" ON gift_cards FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_giftcards" ON gift_cards;
CREATE POLICY "anon_update_giftcards" ON gift_cards FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_giftcards" ON gift_cards;
CREATE POLICY "anon_delete_giftcards" ON gift_cards FOR DELETE TO anon, authenticated USING (true);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_newsletter" ON newsletter_subscribers;
CREATE POLICY "anon_select_newsletter" ON newsletter_subscribers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_newsletter" ON newsletter_subscribers;
CREATE POLICY "anon_insert_newsletter" ON newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_newsletter" ON newsletter_subscribers;
CREATE POLICY "anon_delete_newsletter" ON newsletter_subscribers FOR DELETE TO anon, authenticated USING (true);

-- Promotions
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  description text NOT NULL DEFAULT '',
  discount_type text NOT NULL DEFAULT 'percent',
  discount_value numeric(10,2) NOT NULL DEFAULT 10,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_promotions" ON promotions;
CREATE POLICY "anon_select_promotions" ON promotions FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_promotions" ON promotions;
CREATE POLICY "anon_insert_promotions" ON promotions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_promotions" ON promotions;
CREATE POLICY "anon_update_promotions" ON promotions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_promotions" ON promotions;
CREATE POLICY "anon_delete_promotions" ON promotions FOR DELETE TO anon, authenticated USING (true);