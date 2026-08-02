'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MapPin, Phone, Clock, Mail, Instagram, Facebook, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useSiteSettings } from '@/lib/use-site-settings';

export function Footer() {
  const [email, setEmail] = useState('');
  const { settings } = useSiteSettings();

  const subscribe = async () => {
    if (!email) return;
    const { error } = await supabase.from('newsletter_subscribers').insert({ email });
    if (error) {
      toast.error('Inscription impossible. Veuillez réessayer.');
    } else {
      toast.success('Bienvenue dans la famille PHỞ Dijon ! Vérifiez votre boîte mail.');
      setEmail('');
    }
  };

  return (
    <footer className="bg-forest-dark text-cream/70">
      <div className="border-t border-forest-light/20">
        <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <h3 className="font-display text-3xl text-cream mb-3">
              PH<span className="gold-text">Ở</span> Dijon
            </h3>
            <p className="text-sm leading-relaxed mb-6">
              Cuisine vietnamienne authentique préparée avec tradition, passion et les
              meilleurs ingrédients au cœur de Dijon.
            </p>
            <div className="flex gap-3">
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-forest-light/40 flex items-center justify-center hover:bg-gold hover:text-forest-dark transition-colors" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-forest-light/40 flex items-center justify-center hover:bg-gold hover:text-forest-dark transition-colors" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-sans text-sm uppercase tracking-widest text-gold mb-4">
              Nous Visiter
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                {settings.contact_address}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold shrink-0" />
                {settings.contact_phone}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold shrink-0" />
                {settings.contact_email}
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                {settings.contact_hours}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-sm uppercase tracking-widest text-gold mb-4">
              Explorer
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/menu" className="hover:text-gold transition-colors">La Carte</Link></li>
              <li><Link href="/reservation" className="hover:text-gold transition-colors">Réservations</Link></li>
              <li><Link href="/order" className="hover:text-gold transition-colors">Commander en ligne</Link></li>
              <li><Link href="/events" className="hover:text-gold transition-colors">Événements</Link></li>
              <li><Link href="/private-dining" className="hover:text-gold transition-colors">Privatisation</Link></li>
              <li><Link href="/gift-cards" className="hover:text-gold transition-colors">Cartes Cadeaux</Link></li>
              <li><Link href="/about" className="hover:text-gold transition-colors">À Propos</Link></li>
              <li><Link href="/faq" className="hover:text-gold transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-sm uppercase tracking-widest text-gold mb-4">
              Newsletter
            </h4>
            <p className="text-sm mb-4">
              Inscrivez-vous pour recevoir nos offres exclusives, nouveaux plats et invitations aux événements.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-forest-light/30 border-forest-light/30 text-cream placeholder:text-cream/40"
              />
              <Button
                onClick={subscribe}
                className="bg-gold text-forest-dark hover:bg-gold-light shrink-0"
                size="icon"
                aria-label="S'inscrire"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-forest-light/20">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/50">
          <p>© {new Date().getFullYear()} PHỞ Dijon. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/admin" className="hover:text-gold transition-colors">Espace Gestion</Link>
            <a href="#" className="hover:text-gold transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-gold transition-colors">Mentions Légales</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
