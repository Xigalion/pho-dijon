'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Users, UtensilsCrossed, Music, Wine, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/site/section-heading';

const packages = [
  {
    name: 'Réunion Intime',
    guests: 'Jusqu\'à 20 personnes',
    price: '45€',
    perPerson: true,
    image: 'https://images.pexels.com/photos/36028724/pexels-photo-36028724.jpeg?auto=compress&cs=tinysrgb&h=500&w=700',
    features: [
      'Coin privé dans la salle',
      'Menu fixe 3 services',
      'Serveur dédié',
      'Options de menu personnalisables',
      'Boisson de bienvenue offerte',
    ],
  },
  {
    name: 'Salle Privée',
    guests: 'Jusqu\'à 40 personnes',
    price: '75€',
    perPerson: true,
    image: 'https://images.pexels.com/photos/17001766/pexels-photo-17001766.jpeg?auto=compress&cs=tinysrgb&h=500&w=700',
    features: [
      'Salle privée exclusive',
      'Menu dégustation 5 services',
      'Accompagnement sommelier personnalisé',
      'Décor et ambiance sur mesure',
      'Équipement audiovisuel',
      'Équipe de service dédiée',
    ],
    featured: true,
  },
  {
    name: 'Privatisation Totale',
    guests: 'Jusqu\'à 80 personnes',
    price: '3 500€',
    perPerson: false,
    image: 'https://images.pexels.com/photos/26729397/pexels-photo-26729397.jpeg?auto=compress&cs=tinysrgb&h=500&w=700',
    features: [
      'Restaurant entièrement privé',
      'Menu sur mesure complet',
      'Stations de cuisine en live',
      'Service bar et cocktails',
      'Coordinateur d\'événement',
      'Installation musique et divertissement',
    ],
  },
];

export default function PrivateDiningPage() {
  return (
    <div className="bg-cream min-h-screen">
      <section className="relative h-[50vh] min-h-[380px] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/17001766/pexels-photo-17001766.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080"
          alt="Privatisation"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-dark/60 to-forest-dark/85" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-sans text-xs uppercase tracking-[0.4em] text-gold mb-3"
          >
            Expériences Exclusives
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-medium text-cream text-shadow-lg"
          >
            Privatisation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-cream/70 max-w-xl"
          >
            Célébrez les moments spéciaux de la vie avec une expérience gastronomique vietnamienne inoubliable.
          </motion.p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Formules Sur Mesure"
            title="Choisissez Votre Expérience"
            subtitle="Des dîners intimes aux grandes célébrations, nous créons des expériences gastronomiques vietnamiennes sur mesure pour chaque occasion."
          />
          <div className="grid lg:grid-cols-3 gap-8">
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col ${
                  pkg.featured ? 'ring-2 ring-gold lg:scale-105' : ''
                }`}
              >
                {pkg.featured && (
                  <div className="absolute top-4 right-4 bg-gold text-forest-dark text-xs font-sans font-bold px-3 py-1 rounded-full z-10">
                    Le Plus Populaire
                  </div>
                )}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={pkg.image} alt={pkg.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-7 flex-grow flex flex-col">
                  <h3 className="font-display text-2xl text-forest mb-1">{pkg.name}</h3>
                  <p className="text-sm text-forest/50 mb-4 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-gold" /> {pkg.guests}
                  </p>
                  <div className="mb-6">
                    <span className="font-display text-4xl text-forest">{pkg.price}</span>
                    {pkg.perPerson && <span className="text-forest/50 text-sm"> / personne</span>}
                  </div>
                  <ul className="space-y-2.5 mb-8 flex-grow">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-forest/70">
                        <Check className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/reservation">
                    <Button className={`w-full font-semibold ${pkg.featured ? 'bg-gold text-forest-dark hover:bg-gold-light' : 'bg-forest text-cream hover:bg-forest-light'}`}>
                      Demander un Devis
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-5xl px-6">
          <SectionHeading
            eyebrow="Parfait Pour Chaque Occasion"
            title="Ce Que Nous Organisons"
            align="center"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: 'Anniversaires', desc: 'Célébrez une année de plus avec un festin mémorable.' },
              { icon: UtensilsCrossed, title: 'Anniversaires de Couple', desc: 'Dîners intimes pour les moments importants de la vie.' },
              { icon: Wine, title: 'Entreprise', desc: 'Impressionnez vos clients avec une expérience unique.' },
              { icon: Music, title: 'Célébrations', desc: 'Fiançailles, diplômes et tout ce qui s\'ensuit.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-cream"
              >
                <div className="h-14 w-14 rounded-full bg-forest flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="font-display text-xl text-forest mb-2">{item.title}</h3>
                <p className="text-sm text-forest/60">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 forest-gradient text-cream">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-4xl md:text-5xl font-medium mb-4">
              Prêt à Organiser Votre Événement ?
            </h2>
            <p className="text-cream/70 text-lg mb-8 max-w-xl mx-auto">
              Notre coordinateur d'événements travaillera avec vous pour créer une expérience personnalisée. Contactez-nous dès aujourd'hui.
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-gold text-forest-dark hover:bg-gold-light font-semibold px-8">
                Nous Contacter <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
