'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Star, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SpiceLevel } from '@/components/site/spice-level';
import { supabase, type MenuItem } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'all', label: 'Tout' },
  { id: 'pho', label: 'Phở & Bánh Mì' },
  { id: 'rice', label: 'Riz' },
  { id: 'noodles', label: 'Nouilles' },
  { id: 'vegetarian', label: 'Végétarien' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'drinks', label: 'Boissons' },
];

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [active, setActive] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('menu_items').select('*').order('sort_order');
      if (data) setItems(data as MenuItem[]);
    })();
  }, []);

  const filtered = items.filter((item) => {
    const matchCat = active === 'all' || item.category === active;
    const matchSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="bg-cream min-h-screen">
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/6646022/pexels-photo-6646022.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080"
          alt="Cuisine vietnamienne"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-dark/60 to-forest-dark/85" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-sans text-xs uppercase tracking-[0.4em] text-gold mb-3"
          >
            Notre Carte
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-medium text-cream text-shadow-lg"
          >
            Saveurs Authentiques
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-cream/70 max-w-xl"
          >
            Chaque plat raconte une histoire de tradition, de famille et des rues vibrantes du Vietnam.
          </motion.p>
        </div>
      </section>

      <section className="sticky top-0 z-30 glass shadow-md">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActive(cat.id)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-sans font-medium transition-all',
                    active === cat.id
                      ? 'bg-gold text-forest-dark shadow-md'
                      : 'bg-forest-light/20 text-cream/80 hover:bg-forest-light/40 hover:text-cream'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cream/40" />
              <Input
                placeholder="Rechercher un plat..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-forest-light/20 border-forest-light/30 text-cream placeholder:text-cream/40"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={active + search}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl bg-white">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {item.is_chef_choice && (
                          <Badge className="bg-gold text-forest-dark hover:bg-gold">
                            <Award className="h-3 w-3 mr-1" /> Choix du Chef
                          </Badge>
                        )}
                        {item.is_popular && (
                          <Badge className="bg-forest text-cream hover:bg-forest-light">
                            <Star className="h-3 w-3 mr-1 fill-cream" /> Populaire
                          </Badge>
                        )}
                      </div>
                      {!item.is_available && (
                        <div className="absolute inset-0 bg-forest-dark/60 flex items-center justify-center">
                          <span className="text-cream font-sans text-lg">Indisponible</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-display text-xl text-forest">{item.name}</h3>
                        <span className="font-sans text-lg font-semibold text-gold-dark whitespace-nowrap">
                          {item.price.toFixed(2).replace('.', ',')}€
                        </span>
                      </div>
                      <p className="text-sm text-forest/60 leading-relaxed mb-4">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-forest/10">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-forest/50 font-sans">
                            {item.calories} cal
                          </span>
                          <SpiceLevel level={item.spice_level} />
                        </div>
                        <span className="text-xs text-forest/40 capitalize font-sans">
                          {categories.find((c) => c.id === item.category)?.label || item.category}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-forest/50">
              <p className="text-lg">Aucun plat trouvé. Essayez une autre recherche.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
