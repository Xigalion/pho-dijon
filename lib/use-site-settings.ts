'use client';

import { useEffect, useState } from 'react';
import { supabase, type SiteSettings } from '@/lib/supabase';

const defaultSettings: SiteSettings = {
  id: 1,
  seo_title: 'PHỞ Dijon — Restaurant Vietnamien Authentique à Dijon',
  seo_description: 'Découvrez l\'authentique cuisine vietnamienne au cœur de Dijon.',
  seo_keywords: 'restaurant vietnamien Dijon, pho Dijon',
  google_maps_url: '',
  instagram_url: '',
  facebook_url: '',
  twitter_url: '',
  youtube_url: '',
  tiktok_url: '',
  logo_url: '',
  favicon_url: '',
  google_analytics_id: '',
  search_console_code: '',
  google_calendar_url: '',
  google_calendar_enabled: false,
  contact_address: '12 Rue des Forges, 21000 Dijon, France',
  contact_phone: '+33 3 80 00 00 00',
  contact_email: 'bonjour@phodijon.fr',
  contact_hours: 'Ouvert tous les jours · 11h30 — 22h00',
  notification_email: 'bonjour@phodijon.fr',
  email_notifications_enabled: true,
  updated_at: '',
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
      if (data) setSettings(data as SiteSettings);
      setLoading(false);
    })();
  }, []);

  return { settings, loading, setSettings };
}
