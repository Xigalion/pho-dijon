'use client';

import { useEffect } from 'react';
import { useSiteSettings } from '@/lib/use-site-settings';

export function AnalyticsHead() {
  const { settings, loading } = useSiteSettings();

  useEffect(() => {
    if (loading || !settings.google_analytics_id) return;

    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${settings.google_analytics_id}');
    `;
    document.head.appendChild(script2);

    return () => {
      script1.remove();
      script2.remove();
    };
  }, [loading, settings.google_analytics_id]);

  useEffect(() => {
    if (loading || !settings.search_console_code) return;

    const meta = document.createElement('meta');
    meta.name = 'google-site-verification';
    meta.content = settings.search_console_code;
    document.head.appendChild(meta);

    return () => {
      meta.remove();
    };
  }, [loading, settings.search_console_code]);

  useEffect(() => {
    if (loading) return;

    if (settings.favicon_url) {
      let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = settings.favicon_url;
    }

    if (settings.seo_title) {
      document.title = settings.seo_title;
    }

    if (settings.seo_description) {
      let meta = document.querySelector("meta[name='description']") as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = settings.seo_description;
    }

    if (settings.seo_keywords) {
      let meta = document.querySelector("meta[name='keywords']") as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'keywords';
        document.head.appendChild(meta);
      }
      meta.content = settings.seo_keywords;
    }
  }, [loading, settings.favicon_url, settings.seo_title, settings.seo_description, settings.seo_keywords]);

  return null;
}
