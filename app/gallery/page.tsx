'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { supabase, type GalleryImage } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'all', label: 'Tout' },
  { id: 'food', label: 'Plats' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'kitchen', label: 'Cuisine' },
  { id: 'staff', label: 'Équipe' },
  { id: 'customers', label: 'Clients' },
];

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [active, setActive] = useState('all');
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('gallery_images').select('*').order('created_at');
      if (data) setImages(data as GalleryImage[]);
    })();
  }, []);

  const filtered = active === 'all' ? images : images.filter((img) => img.category === active);

  return (
    <div className="bg-cream min-h-screen">
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/26729398/pexels-photo-26729398.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080"
          alt="Restaurant"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-dark/60 to-forest-dark/85" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-sans text-xs uppercase tracking-[0.4em] text-gold mb-3"
          >
            Moments chez PHỞ Dijon
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-6xl font-medium text-cream text-shadow-lg"
          >
            Galerie
          </motion.h1>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={cn(
                  'px-5 py-2 rounded-full text-sm font-sans font-medium transition-all',
                  active === cat.id ? 'bg-forest text-cream' : 'bg-white text-forest/60 hover:bg-forest/10'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filtered.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 6) * 0.05 }}
                className="break-inside-avoid"
              >
                <button
                  onClick={() => setLightbox(img.image_url)}
                  className="group relative block w-full overflow-hidden rounded-2xl shadow-lg"
                >
                  <img
                    src={img.image_url}
                    alt={img.title}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                    <div>
                      <p className="font-display text-xl text-cream">{img.title}</p>
                      <p className="text-xs text-gold capitalize">{categories.find((c) => c.id === img.category)?.label || img.category}</p>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-forest-dark/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 text-cream/70 hover:text-gold" onClick={() => setLightbox(null)}>
              <X className="h-8 w-8" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={lightbox}
              alt="Galerie"
              className="max-h-[90vh] max-w-full rounded-xl shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
