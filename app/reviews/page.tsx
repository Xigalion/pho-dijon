'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionHeading } from '@/components/site/section-heading';
import { supabase, type Testimonial } from '@/lib/supabase';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Testimonial[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
      if (data) setReviews(data as Testimonial[]);
    })();
  }, []);

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '5.0';

  return (
    <div className="bg-cream min-h-screen">
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <img src="https://images.pexels.com/photos/10135116/pexels-photo-10135116.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080" alt="Restaurant" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-dark/60 to-forest-dark/85" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-sans text-xs uppercase tracking-[0.4em] text-gold mb-3">
            Expériences Clients
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-5xl md:text-6xl font-medium text-cream text-shadow-lg">
            Avis
          </motion.h1>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: avgRating, label: 'Note Moyenne', suffix: '/5' },
              { value: '1 200+', label: 'Avis Google' },
              { value: '98%', label: 'Recommandent' },
              { value: '4,9', label: 'TripAdvisor' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-4xl md:text-5xl text-forest">{stat.value}{stat.suffix || ''}</p>
                <p className="text-sm text-forest/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="Ce Que Disent Nos Clients" title="Avis Vérifiés" subtitle="De vrais avis de nos clients sur Google, Instagram et TripAdvisor." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.1 }}>
                <Card className="p-6 border-0 shadow-lg rounded-2xl h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: r.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-gold text-gold" />
                      ))}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {r.source === 'google' ? 'Google' : r.source === 'instagram' ? 'Instagram' : 'TripAdvisor'}
                    </Badge>
                  </div>
                  <Quote className="h-8 w-8 text-gold/30 mb-3" />
                  <p className="text-forest/70 leading-relaxed italic flex-grow">« {r.comment} »</p>
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-forest/10">
                    {r.avatar_url ? (
                      <img src={r.avatar_url} alt={r.name} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-forest text-cream flex items-center justify-center font-display text-lg">{r.name.charAt(0)}</div>
                    )}
                    <p className="font-sans font-semibold text-forest text-sm">{r.name}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 forest-gradient text-cream">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-4xl font-medium mb-4">Partagez Votre Expérience</h2>
            <p className="text-cream/70 text-lg mb-8">Vous avez passé un bon moment chez PHỞ Dijon ? Nous adorerions vous lire.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gold text-forest-dark px-6 py-3 rounded-lg font-sans font-semibold hover:bg-gold-light transition-colors">
                Laisser un Avis Google <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
