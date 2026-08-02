'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, Leaf, Award, Users, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/site/section-heading';

export default function AboutPage() {
  return (
    <div className="bg-cream min-h-screen">
      <section className="relative h-[50vh] min-h-[380px] overflow-hidden">
        <img src="https://images.pexels.com/photos/4253300/pexels-photo-4253300.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080" alt="Chef" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-dark/60 to-forest-dark/85" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-sans text-xs uppercase tracking-[0.4em] text-gold mb-3">
            Notre Histoire
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-5xl md:text-7xl font-medium text-cream text-shadow-lg">
            À Propos
          </motion.h1>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img src="https://images.pexels.com/photos/2977514/pexels-photo-2977514.jpeg?auto=compress&cs=tinysrgb&h=700&w=900" alt="Chef au travail" className="w-full aspect-[4/3] object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gold text-forest-dark rounded-2xl px-6 py-4 shadow-xl hidden sm:block">
                <p className="font-display text-3xl font-semibold">15+</p>
                <p className="text-sm">ans de tradition</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold-dark mb-3">De Hanoï à Dijon</p>
              <h2 className="font-display text-4xl md:text-5xl text-forest mb-6">Le Voyage d'une Famille</h2>
              <div className="space-y-4 text-forest/70 leading-relaxed">
                <p>
                  PHỞ Dijon est né d'un rêve simple : partager les saveurs authentiques du Vietnam avec les habitants de Dijon. Notre fondatrice, la Chef Nguyen Thi Linh, a grandi dans les rues animées de Hanoï, où la nourriture n'est pas seulement un repas — c'est un langage d'amour, de communauté et de tradition.
                </p>
                <p>
                  Après s'être installée en France en 2008, elle a commencé à cuisiner pour ses amis et voisins, servant des bols de pho depuis sa cuisine. Le bouche-à-oreille s'est répandu rapidement. Ce qui a commencé comme des dîners intimes s'est transformé en événements pop-up, et finalement, en 2011, PHỞ Dijon a ouvert ses portes Rue des Forges.
                </p>
                <p>
                  Aujourd'hui, nous restons un restaurant familial, fidèles aux mêmes principes qui guident la Chef Linh depuis le début : des recettes authentiques, les ingrédients les plus frais et un accueil chaleureux pour chaque client qui franchit notre porte.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-5xl px-6">
          <SectionHeading eyebrow="Nos Valeurs" title="Ce Que Nous Défendons" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: 'Authenticité', desc: 'Des recettes transmises de génération en génération, jamais compromises.' },
              { icon: Leaf, title: 'Ingrédients Frais', desc: 'Produits locaux et épices importées du Vietnam.' },
              { icon: Award, title: 'Qualité', desc: "Un bouillon d'os mijoté 24 heures, frais chaque jour." },
              { icon: Users, title: 'Communauté', desc: 'Un lieu accueillant où chaque client se sent comme famille.' },
            ].map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6 rounded-2xl bg-cream">
                <div className="h-14 w-14 rounded-full bg-forest flex items-center justify-center mx-auto mb-4">
                  <v.icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="font-display text-xl text-forest mb-2">{v.title}</h3>
                <p className="text-sm text-forest/60">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="Rencontrez l'Équipe" title="Les Gens Derrière PHỞ Dijon" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Chef Nguyen Thi Linh', role: 'Fondatrice & Chef Exécutive', image: 'https://images.pexels.com/photos/2977514/pexels-photo-2977514.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' },
              { name: 'Marc Dubois', role: 'Directeur de Restaurant', image: 'https://images.pexels.com/photos/17318176/pexels-photo-17318176.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' },
              { name: 'Tran Van Minh', role: 'Sous-Chef', image: 'https://images.pexels.com/photos/4253300/pexels-photo-4253300.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' },
            ].map((person, i) => (
              <motion.div key={person.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="group relative rounded-2xl overflow-hidden shadow-lg">
                  <img src={person.image} alt={person.name} className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-2xl text-cream">{person.name}</h3>
                    <p className="text-gold text-sm">{person.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 forest-gradient text-cream">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Clock className="h-12 w-12 text-gold mx-auto mb-6" />
            <h2 className="font-display text-4xl font-medium mb-4">Ouvert Tous les Jours · 11h30 — 22h00</h2>
            <p className="text-cream/70 text-lg mb-8">Venez nous rendre visite au cœur de Dijon. Sans réservation pour le déjeuner.</p>
            <Link href="/reservation">
              <Button size="lg" className="bg-gold text-forest-dark hover:bg-gold-light font-semibold px-8">
                Réserver une Table <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
