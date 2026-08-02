'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, MapPin, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSiteSettings } from '@/lib/use-site-settings';
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/menu', label: 'Carte' },
  { href: '/reservation', label: 'Réserver' },
  { href: '/order', label: 'Commander' },
  { href: '/gallery', label: 'Galerie' },
  { href: '/events', label: 'Événements' },
  { href: '/private-dining', label: 'Privatisation' },
  { href: '/gift-cards', label: 'Cartes Cadeaux' },
  { href: '/reviews', label: 'Avis' },
  { href: '/about', label: 'À Propos' },
  { href: '/contact', label: 'Contact' },
  { href: '/faq', label: 'FAQ' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { settings } = useSiteSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isHome = pathname === '/';

  return (
    <>
      <div className="hidden lg:flex items-center justify-center gap-6 bg-forest-dark text-cream/70 text-xs px-6 py-2 font-sans">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-gold" />
          {settings.contact_address}
        </span>
        <span className="h-3 w-px bg-cream/20" />
        <span className="flex items-center gap-1.5">
          <Phone className="h-3.5 w-3.5 text-gold" />
          {settings.contact_phone}
        </span>
        <span className="h-3 w-px bg-cream/20" />
        <span className="text-gold/80">{settings.contact_hours}</span>
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-500',
          scrolled || !isHome
            ? 'glass shadow-lg shadow-forest-dark/20'
            : 'bg-transparent'
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3 lg:py-4">
          <Link href="/" className="flex items-center gap-2 group">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt="PHỞ Dijon" className="h-10 lg:h-12 w-auto" />
            ) : (
              <span className="font-display text-2xl lg:text-3xl font-semibold tracking-wide text-cream group-hover:text-gold transition-colors">
                PH<span className="gold-text">Ở</span>
              </span>
            )}
            <span className="hidden sm:inline text-xs font-sans uppercase tracking-[0.3em] text-gold/80 mt-1">
              Dijon
            </span>
          </Link>

          <div className="hidden xl:flex items-center gap-1">
            {navLinks.slice(0, 8).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 text-sm font-sans transition-colors rounded-md',
                  pathname === link.href
                    ? 'text-gold'
                    : 'text-cream/80 hover:text-gold'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-1 ml-2">
              {navLinks.slice(8).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 text-sm font-sans transition-colors rounded-md',
                    pathname === link.href
                      ? 'text-gold'
                      : 'text-cream/80 hover:text-gold'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/order">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex text-cream hover:text-gold hover:bg-forest-light"
              >
                <ShoppingBag className="h-4 w-4 mr-1.5" />
                Commander
              </Button>
            </Link>
            <Link href="/reservation">
              <Button
                size="sm"
                className="hidden sm:flex bg-gold text-forest-dark hover:bg-gold-light font-semibold"
              >
                Réserver
              </Button>
            </Link>
            <button
              className="xl:hidden text-cream p-2"
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] xl:hidden"
          >
            <div
              className="absolute inset-0 bg-forest-dark/80 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-forest-dark shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-forest-light/30">
                <span className="font-display text-2xl text-cream">
                  PH<span className="gold-text">Ở</span> Dijon
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-cream/70 hover:text-gold"
                  aria-label="Fermer le menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex flex-col p-4 gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-4 py-3 text-base font-sans rounded-lg transition-colors',
                      pathname === link.href
                        ? 'text-gold bg-forest-light/40'
                        : 'text-cream/80 hover:text-gold hover:bg-forest-light/20'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link href="/admin" className="px-4 py-3 text-sm text-cream/50 hover:text-gold mt-2 border-t border-forest-light/20 pt-4">
                  Espace Gestion
                </Link>
              </div>
              <div className="p-6 border-t border-forest-light/30">
                <Link href="/reservation">
                  <Button className="w-full bg-gold text-forest-dark hover:bg-gold-light font-semibold">
                    Réserver une Table
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
