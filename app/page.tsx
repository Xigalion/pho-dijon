'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  ArrowRight,
  UtensilsCrossed,
  Calendar,
  ShoppingBag,
  Award,
  Clock,
  Leaf,
  Quote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionHeading } from '@/components/site/section-heading';
import { SpiceLevel } from '@/components/site/spice-level';
import { supabase, type MenuItem, type Testimonial } from '@/lib/supabase';

const heroSlides = [
  {
    image:
      'https://images.pexels.com/photos/6646072/pexels-photo-6646072.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
    title: 'Phở Bò Tái',
    sub: 'Bouillon d\'os mijoté 24 heures, bœuf saignant, herbes fraîches',
  },
  {
    image:
      'https://images.pexels.com/photos/12386446/pexels-photo-12386446.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
    title: 'Gỏi Cuốn',
    sub: 'Rouleaux de printemps frais, crevettes, sauce aux cacahuètes',
  },
  {
    image:
      'https://images.pexels.com/photos/32961655/pexels-photo-32961655.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
    title: 'Bánh Mì',
    sub: 'Baguette croustillante, porc grillé au citronnelle',
  },
];

const featuredCategories = [
  { name: 'Phở', image: 'https://images.pexels.com/photos/6646072/pexels-photo-6646072.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', href: '/menu?category=pho' },
  { name: 'Bún Bò', image: 'https://images.pexels.com/photos/6646022/pexels-photo-6646022.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', href: '/menu?category=noodles' },
  { name: 'Rouleaux de Printemps', image: 'https://images.pexels.com/photos/12386446/pexels-photo-12386446.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', href: '/menu?category=vegetarian' },
  { name: 'Bánh Mì', image: 'https://images.pexels.com/photos/32961655/pexels-photo-32961655.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', href: '/menu?category=pho' },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featured, setFeatured] = useState<MenuItem[]>([]);
  const [chefSpecial, setChefSpecial] = useState<MenuItem | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    (async () => {
      const { data: menu } = await supabase
        .from('menu_items')
        .select('*')
        .order('sort_order')
        .limit(8);
      if (menu) setFeatured(menu as MenuItem[]);

      const { data: chef } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_chef_choice', true)
        .order('sort_order')
        .limit(1)
        .maybeSingle();
      if (chef) setChefSpecial(chef as MenuItem);

      const { data: reviews } = await supabase
        .from('testimonials')
        .select('*')
        .limit(6);
      if (reviews) setTestimonials(reviews as Testimonial[]);
    })();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen min-h-[700px] overflow-hidden">
        <AnimatePresence mode="wait">
          {heroSlides.map((slide, i) =>
            i === currentSlide ? (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-forest-dark/70 via-forest-dark/50 to-forest-dark/85" />
              </motion.div>
            ) : null
          )}
        </AnimatePresence>

        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-4"
          >
            <span className="font-sans text-xs uppercase tracking-[0.4em] text-gold">
              Cuisine Vietnamienne Authentique · Dijon
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-display text-6xl md:text-8xl lg:text-9xl font-medium text-cream text-shadow-lg"
          >
            PH<span className="gold-text">Ở</span> Dijon
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-4 max-w-xl text-lg md:text-xl text-cream/80 font-light"
          >
            {heroSlides[currentSlide].sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Link href="/reservation">
              <Button size="lg" className="bg-gold text-forest-dark hover:bg-gold-light font-semibold text-base px-8 h-14">
                <Calendar className="mr-2 h-5 w-5" />
                Réserver une Table
              </Button>
            </Link>
            <Link href="/menu">
              <Button size="lg" variant="outline" className="border-cream/30 text-cream hover:bg-cream/10 hover:text-cream font-semibold text-base px-8 h-14 bg-transparent">
                <UtensilsCrossed className="mr-2 h-5 w-5" />
                Voir la Carte
              </Button>
            </Link>
            <Link href="/order">
              <Button size="lg" variant="outline" className="border-gold/50 text-gold hover:bg-gold/10 hover:text-gold font-semibold text-base px-8 h-14 bg-transparent">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Commander en Ligne
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2"
          >
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentSlide ? 'w-10 bg-gold' : 'w-2 bg-cream/40'
                }`}
                aria-label={`Diapositive ${i + 1}`}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Catégories Phares */}
      <section className="py-20 bg-cream bamboo-pattern">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Nos Spécialités"
            title="Un Goût du Vietnam"
            subtitle="Des bols fumants de pho aux bánh mì croustillants, chaque plat est préparé selon des recettes authentiques transmises de génération en génération."
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={cat.href}>
                  <div className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="font-display text-2xl text-cream group-hover:text-gold transition-colors">
                        {cat.name}
                      </h3>
                      <div className="flex items-center gap-1 text-gold text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Découvrir <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plats en Vedette */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Plats en Vedette"
            title="Les Favoris du Jour"
            subtitle="Les plats les plus appréciés de notre cuisine, préparés frais chaque jour avec les meilleurs ingrédients."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.slice(0, 4).map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-2xl">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {item.is_chef_choice && (
                      <Badge className="absolute top-3 left-3 bg-gold text-forest-dark hover:bg-gold">
                        <Award className="h-3 w-3 mr-1" /> Choix du Chef
                      </Badge>
                    )}
                    {item.is_popular && !item.is_chef_choice && (
                      <Badge className="absolute top-3 left-3 bg-forest text-cream hover:bg-forest-light">
                        Populaire
                      </Badge>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-display text-xl text-forest">{item.name}</h3>
                      <span className="font-sans text-lg font-semibold text-gold-dark whitespace-nowrap">
                        {item.price.toFixed(2).replace('.', ',')}€
                      </span>
                    </div>
                    <p className="text-sm text-forest/60 leading-relaxed line-clamp-2 mb-3">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-forest/50">{item.calories} cal</span>
                      <SpiceLevel level={item.spice_level} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/menu">
              <Button size="lg" className="bg-forest text-cream hover:bg-forest-light font-semibold px-8">
                Voir la Carte Complète <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Plat du Chef */}
      {chefSpecial && (
        <section className="py-20 forest-gradient text-cream relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={chefSpecial.image_url}
                    alt={chefSpecial.name}
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gold text-forest-dark hover:bg-gold text-sm">
                      <Award className="h-4 w-4 mr-1" /> Recommandation du Chef
                    </Badge>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-gold text-forest-dark rounded-2xl px-6 py-4 shadow-xl">
                  <span className="font-display text-3xl font-semibold">{chefSpecial.price.toFixed(2).replace('.', ',')}€</span>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold mb-3">
                  Plat du Jour
                </p>
                <h2 className="font-display text-5xl font-medium mb-4">{chefSpecial.name}</h2>
                <p className="text-lg text-cream/70 leading-relaxed mb-6">
                  {chefSpecial.description}
                </p>
                <div className="flex items-center gap-6 mb-8">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gold" />
                    <span className="text-sm">{chefSpecial.calories} calories</span>
                  </div>
                  <SpiceLevel level={chefSpecial.spice_level} />
                  {chefSpecial.is_popular && (
                    <div className="flex items-center gap-1 text-gold">
                      <Star className="h-4 w-4 fill-gold" />
                      <span className="text-sm">Populaire</span>
                    </div>
                  )}
                </div>
                <Link href="/order">
                  <Button size="lg" className="bg-gold text-forest-dark hover:bg-gold-light font-semibold px-8">
                    Commander <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Témoignages */}
      <section className="py-20 bg-cream">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Avis Clients"
            title="Ce Que Disent Nos Clients"
            subtitle="Plus de 1 200 avis cinq étoiles sur Google. Voici ce que nos clients pensent de leur expérience chez PHỞ Dijon."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1 }}
              >
                <Card className="p-6 border-0 shadow-lg rounded-2xl h-full flex flex-col">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-gold/30 mb-3" />
                  <p className="text-forest/70 leading-relaxed flex-grow italic">
                    « {t.comment} »
                  </p>
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-forest/10">
                    {t.avatar_url ? (
                      <img
                        src={t.avatar_url}
                        alt={t.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-forest text-cream flex items-center justify-center font-display text-lg">
                        {t.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-sans font-semibold text-forest text-sm">{t.name}</p>
                      <p className="text-xs text-forest/50 flex items-center gap-1">
                        {t.source === 'google' ? 'Avis Google' : 'Instagram'}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 forest-gradient text-cream">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Leaf className="h-12 w-12 text-gold mx-auto mb-6" />
            <h2 className="font-display text-4xl md:text-5xl font-medium mb-4">
              Inscrivez-vous à Notre Newsletter
            </h2>
            <p className="text-cream/70 text-lg mb-8 max-w-xl mx-auto">
              Soyez les premiers informés des nouveaux plats, événements spéciaux et offres
              exclusives de PHỞ Dijon.
            </p>
            <NewsletterForm />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!email) return;
    const { error } = await supabase.from('newsletter_subscribers').insert({ email });
    if (!error) {
      setDone(true);
      setEmail('');
    }
  };

  if (done) {
    return (
      <div className="inline-flex items-center gap-2 text-gold text-lg font-sans">
        <Star className="h-5 w-5 fill-gold" />
        Merci pour votre inscription !
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        placeholder="votre@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-lg bg-forest-light/30 border border-forest-light/40 text-cream placeholder:text-cream/40 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
      />
      <Button
        onClick={submit}
        size="lg"
        className="bg-gold text-forest-dark hover:bg-gold-light font-semibold"
      >
        S'inscrire
      </Button>
    </div>
  );
}
