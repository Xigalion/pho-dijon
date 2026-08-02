'use client';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  calories: number;
  spice_level: number;
  is_popular: boolean;
  is_chef_choice: boolean;
  is_available: boolean;
  sort_order: number;
};

export type Reservation = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  seating: string;
  special_request: string;
  status: string;
  created_at: string;
};

export type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  type: string;
  address: string;
  items: any[];
  subtotal: number;
  discount_code: string;
  total: number;
  status: string;
  estimated_time: string;
  created_at: string;
};

export type EventItem = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  date: string | null;
  time: string;
  location: string;
  price: number;
  capacity: number;
};

export type GalleryImage = {
  id: string;
  title: string;
  image_url: string;
  category: string;
};

export type Testimonial = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  source: string;
  avatar_url: string;
};

export type Promotion = {
  id: string;
  code: string;
  description: string;
  discount_type: string;
  discount_value: number;
  active: boolean;
};

export type SiteSettings = {
  id: number;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  google_maps_url: string;
  instagram_url: string;
  facebook_url: string;
  twitter_url: string;
  youtube_url: string;
  tiktok_url: string;
  logo_url: string;
  favicon_url: string;
  google_analytics_id: string;
  search_console_code: string;
  google_calendar_url: string;
  google_calendar_enabled: boolean;
  contact_address: string;
  contact_phone: string;
  contact_email: string;
  contact_hours: string;
  notification_email: string;
  email_notifications_enabled: boolean;
  updated_at: string;
};

export type Backup = {
  id: string;
  filename: string;
  file_size: number;
  backup_type: string;
  table_counts: Record<string, number>;
  status: string;
  created_at: string;
};
