'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase, type EventItem } from '@/lib/supabase';

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('events').select('*').order('date');
      if (data) setEvents(data as EventItem[]);
    })();
  }, []);

  return (
    <div className="bg-cream min-h-screen">
      <section className="relative h-[45vh] min-h-[320px] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/13197707/pexels-photo-13197707.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080"
          alt="Événements vietnamiens"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-dark/60 to-forest-dark/85" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-sans text-xs uppercase tracking-[0.4em] text-gold mb-3"
          >
            Célébrez Avec Nous
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-medium text-cream text-shadow-lg"
          >
            Événements
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-cream/70 max-w-xl"
          >
            Du Nouvel An vietnamien aux soirées dégustation intimes, découvrez la culture et les saveurs du Vietnam.
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 space-y-8">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`grid lg:grid-cols-2 gap-8 items-center bg-white rounded-3xl shadow-lg overflow-hidden`}
            >
              <div className={`relative aspect-[16/10] overflow-hidden ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                <img src={event.image_url} alt={event.title} className="h-full w-full object-cover" />
              </div>
              <div className={`p-8 lg:p-12 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                {event.date && (
                  <Badge className="bg-gold text-forest-dark hover:bg-gold mb-4">
                    {new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </Badge>
                )}
                <h2 className="font-display text-3xl md:text-4xl text-forest mb-4">{event.title}</h2>
                <p className="text-forest/60 leading-relaxed mb-6">{event.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {event.time && (
                    <div className="flex items-center gap-2 text-sm text-forest/60">
                      <Clock className="h-4 w-4 text-gold" /> {event.time}
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm text-forest/60">
                      <MapPin className="h-4 w-4 text-gold" /> {event.location}
                    </div>
                  )}
                  {event.capacity > 0 && (
                    <div className="flex items-center gap-2 text-sm text-forest/60">
                      <Users className="h-4 w-4 text-gold" /> {event.capacity} places
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-forest/60">
                    <Calendar className="h-4 w-4 text-gold" /> {event.price.toFixed(0)}€ / personne
                  </div>
                </div>
                <Link href="/reservation">
                  <Button className="bg-forest text-cream hover:bg-forest-light font-semibold">
                    Réserver une Place <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16 forest-gradient text-cream">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-medium mb-4">
              Vous Organisez un Événement Privé ?
            </h2>
            <p className="text-cream/70 text-lg mb-8 max-w-xl mx-auto">
              Anniversaires, dîners d'entreprise ou réunions intimes — laissez-nous créer une expérience vietnamienne inoubliable pour vous.
            </p>
            <Link href="/private-dining">
              <Button size="lg" className="bg-gold text-forest-dark hover:bg-gold-light font-semibold px-8">
                Découvrir la Privatisation <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
