'use client';

import { useState, useEffect } from 'react';
import { Save, Globe, MapPin, Share2, Image as ImageIcon, BarChart3, Calendar, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase, type SiteSettings } from '@/lib/supabase';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Section = 'seo' | 'maps' | 'social' | 'branding' | 'analytics' | 'calendar' | 'contact' | 'email';

const sections: { id: Section; label: string; icon: any }[] = [
  { id: 'seo', label: 'SEO', icon: Globe },
  { id: 'maps', label: 'Google Maps', icon: MapPin },
  { id: 'social', label: 'Réseaux Sociaux', icon: Share2 },
  { id: 'branding', label: 'Logo & Favicon', icon: ImageIcon },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'calendar', label: 'Google Calendar', icon: Calendar },
  { id: 'contact', label: 'Coordonnées', icon: Mail },
  { id: 'email', label: 'Notifications Email', icon: Mail },
];

export function SettingsManager() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [section, setSection] = useState<Section>('seo');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
      if (data) setSettings(data as SiteSettings);
    })();
  }, []);

  const update = (key: keyof SiteSettings, value: string | boolean) => {
    setSettings((prev) => prev ? { ...prev, [key]: value } : prev);
  };

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase.from('site_settings').update({
      seo_title: settings.seo_title,
      seo_description: settings.seo_description,
      seo_keywords: settings.seo_keywords,
      google_maps_url: settings.google_maps_url,
      instagram_url: settings.instagram_url,
      facebook_url: settings.facebook_url,
      twitter_url: settings.twitter_url,
      youtube_url: settings.youtube_url,
      tiktok_url: settings.tiktok_url,
      logo_url: settings.logo_url,
      favicon_url: settings.favicon_url,
      google_analytics_id: settings.google_analytics_id,
      search_console_code: settings.search_console_code,
      google_calendar_url: settings.google_calendar_url,
      google_calendar_enabled: settings.google_calendar_enabled,
      contact_address: settings.contact_address,
      contact_phone: settings.contact_phone,
      contact_email: settings.contact_email,
      contact_hours: settings.contact_hours,
      notification_email: settings.notification_email,
      email_notifications_enabled: settings.email_notifications_enabled,
      updated_at: new Date().toISOString(),
    }).eq('id', 1);
    setSaving(false);
    if (error) toast.error('Échec de l\'enregistrement des paramètres');
    else toast.success('Paramètres enregistrés avec succès');
  };

  if (!settings) return <p className="text-cream/40 text-center py-12">Chargement...</p>;

  return (
    <div>
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-sans font-medium transition-all whitespace-nowrap',
              section === s.id ? 'bg-gold text-forest-dark' : 'bg-forest-light/30 text-cream/70 hover:bg-forest-light/50'
            )}
          >
            <s.icon className="h-4 w-4" />
            {s.label}
          </button>
        ))}
      </div>

      <div className="bg-forest-light/20 rounded-2xl p-6 space-y-5">
        {section === 'seo' && (
          <>
            <div>
              <Label className="text-cream/70 mb-1.5 block">Titre SEO</Label>
              <Input value={settings.seo_title} onChange={(e) => update('seo_title', e.target.value)} className="bg-forest-light/20 border-forest-light/30 text-cream" />
              <p className="text-cream/40 text-xs mt-1">Affiché dans l'onglet du navigateur et les résultats de recherche.</p>
            </div>
            <div>
              <Label className="text-cream/70 mb-1.5 block">Méta Description</Label>
              <Textarea value={settings.seo_description} onChange={(e) => update('seo_description', e.target.value)} className="bg-forest-light/20 border-forest-light/30 text-cream" rows={3} />
              <p className="text-cream/40 text-xs mt-1">Description courte affichée sous le titre dans Google.</p>
            </div>
            <div>
              <Label className="text-cream/70 mb-1.5 block">Mots-clés</Label>
              <Input value={settings.seo_keywords} onChange={(e) => update('seo_keywords', e.target.value)} className="bg-forest-light/20 border-forest-light/30 text-cream" />
              <p className="text-cream/40 text-xs mt-1">Séparés par des virgules (ex: restaurant vietnamien Dijon, pho).</p>
            </div>
          </>
        )}

        {section === 'maps' && (
          <div>
            <Label className="text-cream/70 mb-1.5 block">Lien d'intégration Google Maps</Label>
            <Textarea value={settings.google_maps_url} onChange={(e) => update('google_maps_url', e.target.value)} className="bg-forest-light/20 border-forest-light/30 text-cream" rows={3} />
            <p className="text-cream/40 text-xs mt-1">Sur Google Maps, cliquez sur Partager → Intégrer une carte → copiez le lien src.</p>
            {settings.google_maps_url && (
              <div className="mt-4 rounded-xl overflow-hidden border border-forest-light/20">
                <iframe src={settings.google_maps_url} className="w-full h-48" loading="lazy" title="Aperçu Google Maps" />
              </div>
            )}
          </div>
        )}

        {section === 'social' && (
          <>
            {[
              { key: 'instagram_url' as const, label: 'Instagram' },
              { key: 'facebook_url' as const, label: 'Facebook' },
              { key: 'twitter_url' as const, label: 'Twitter / X' },
              { key: 'youtube_url' as const, label: 'YouTube' },
              { key: 'tiktok_url' as const, label: 'TikTok' },
            ].map((s) => (
              <div key={s.key}>
                <Label className="text-cream/70 mb-1.5 block">{s.label}</Label>
                <Input value={settings[s.key]} onChange={(e) => update(s.key, e.target.value)} placeholder={`https://${s.label.toLowerCase()}.com/...`} className="bg-forest-light/20 border-forest-light/30 text-cream" />
              </div>
            ))}
          </>
        )}

        {section === 'branding' && (
          <>
            <div>
              <Label className="text-cream/70 mb-1.5 block">Logo (URL)</Label>
              <Input value={settings.logo_url} onChange={(e) => update('logo_url', e.target.value)} placeholder="https://...logo.png" className="bg-forest-light/20 border-forest-light/30 text-cream" />
              <p className="text-cream/40 text-xs mt-1">Téléchargez votre logo et collez le lien ici. Affiché dans la barre de navigation.</p>
              {settings.logo_url && <img src={settings.logo_url} alt="Logo" className="mt-3 h-16 rounded-lg" />}
            </div>
            <div>
              <Label className="text-cream/70 mb-1.5 block">Favicon (URL)</Label>
              <Input value={settings.favicon_url} onChange={(e) => update('favicon_url', e.target.value)} placeholder="https://...favicon.ico" className="bg-forest-light/20 border-forest-light/30 text-cream" />
              <p className="text-cream/40 text-xs mt-1">Petite icône affichée dans l'onglet du navigateur (32×32 recommandé).</p>
              {settings.favicon_url && <img src={settings.favicon_url} alt="Favicon" className="mt-3 h-8 w-8 rounded" />}
            </div>
          </>
        )}

        {section === 'analytics' && (
          <>
            <div>
              <Label className="text-cream/70 mb-1.5 block">ID Google Analytics</Label>
              <Input value={settings.google_analytics_id} onChange={(e) => update('google_analytics_id', e.target.value)} placeholder="G-XXXXXXXXXX" className="bg-forest-light/20 border-forest-light/30 text-cream" />
              <p className="text-cream/40 text-xs mt-1">Trouvez-le dans Google Analytics → Admin → Flux de données.</p>
            </div>
            <div>
              <Label className="text-cream/70 mb-1.5 block">Code de vérification Google Search Console</Label>
              <Input value={settings.search_console_code} onChange={(e) => update('search_console_code', e.target.value)} placeholder="google-site-verification=..." className="bg-forest-light/20 border-forest-light/30 text-cream" />
              <p className="text-cream/40 text-xs mt-1">Collez la valeur de la balise de vérification (sans la balise meta complète).</p>
            </div>
          </>
        )}

        {section === 'calendar' && (
          <>
            <div className="flex items-center justify-between p-4 bg-forest-light/10 rounded-xl">
              <div>
                <p className="text-cream font-sans font-semibold">Activer l'intégration Google Calendar</p>
                <p className="text-cream/40 text-sm">Synchronise les réservations avec votre calendrier Google.</p>
              </div>
              <Switch checked={settings.google_calendar_enabled} onCheckedChange={(v) => update('google_calendar_enabled', v)} />
            </div>
            <div>
              <Label className="text-cream/70 mb-1.5 block">URL d'intégration Google Calendar</Label>
              <Textarea value={settings.google_calendar_url} onChange={(e) => update('google_calendar_url', e.target.value)} placeholder="https://calendar.google.com/calendar/embed?src=..." className="bg-forest-light/20 border-forest-light/30 text-cream" rows={3} />
              <p className="text-cream/40 text-xs mt-1">Sur Google Calendar → Paramètres → Intégrer le calendrier → copiez le lien d'intégration.</p>
            </div>
          </>
        )}

        {section === 'contact' && (
          <>
            {[
              { key: 'contact_address' as const, label: 'Adresse' },
              { key: 'contact_phone' as const, label: 'Téléphone' },
              { key: 'contact_email' as const, label: 'Email' },
              { key: 'contact_hours' as const, label: 'Horaires' },
            ].map((c) => (
              <div key={c.key}>
                <Label className="text-cream/70 mb-1.5 block">{c.label}</Label>
                <Input value={settings[c.key]} onChange={(e) => update(c.key, e.target.value)} className="bg-forest-light/20 border-forest-light/30 text-cream" />
              </div>
            ))}
          </>
        )}

        {section === 'email' && (
          <>
            <div className="flex items-center justify-between p-4 bg-forest-light/10 rounded-xl">
              <div>
                <p className="text-cream font-sans font-semibold">Notifications par email</p>
                <p className="text-cream/40 text-sm">Recevoir un email à chaque nouvelle réservation.</p>
              </div>
              <Switch checked={settings.email_notifications_enabled} onCheckedChange={(v) => update('email_notifications_enabled', v)} />
            </div>
            <div>
              <Label className="text-cream/70 mb-1.5 block">Email de notification</Label>
              <Input value={settings.notification_email} onChange={(e) => update('notification_email', e.target.value)} placeholder="bonjour@phodijon.fr" className="bg-forest-light/20 border-forest-light/30 text-cream" />
              <p className="text-cream/40 text-xs mt-1">Adresse email où recevoir les notifications de réservation.</p>
            </div>
          </>
        )}
      </div>

      <Button onClick={save} disabled={saving} size="lg" className="w-full mt-6 bg-gold text-forest-dark hover:bg-gold-light font-semibold h-14">
        <Save className="h-5 w-5 mr-2" /> {saving ? 'Enregistrement...' : 'Enregistrer les Paramètres'}
      </Button>
    </div>
  );
}
