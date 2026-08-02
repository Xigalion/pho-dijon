'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, CheckCircle2, Home, TreePine, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const times = [
  '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
  '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
];

export default function ReservationPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    seating: 'indoor',
    special_request: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.name || !form.email || !form.phone || !form.date || !form.time) {
      toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    
    setLoading(true);

    const { data, error } = await supabase.rpc('create_reservation', {
      p_name: form.name,
      p_email: form.email,
      p_phone: form.phone,
      p_date: form.date,
      p_time: form.time,
      p_guests: form.guests,
      p_seating: form.seating,
      p_special_request: form.special_request,
    });

    setLoading(false);

    if (error) {
      toast.error("Impossible d'envoyer la réservation. Veuillez réessayer.");
    } else {
      setSubmitted(true);
      toast.success('Demande de réservation envoyée !');
      if (data) {
        fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL}/functions/v1/reservation-notification`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reservationId: data, type: 'reservation' }),
        }).catch(() => {});
      }
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg text-center"
        >
          <div className="h-20 w-20 rounded-full bg-gold flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-forest-dark" />
          </div>
          <h1 className="font-display text-4xl text-forest mb-4">Réservation Reçue !</h1>
          <p className="text-forest/60 mb-2">
            Merci, {form.name}. Nous avons bien reçu votre demande de réservation pour{' '}
            <strong>{form.guests} personnes</strong> le{' '}
            <strong>{new Date(form.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</strong>{' '}
            à <strong>{form.time}</strong>.
          </p>
          <p className="text-forest/60 mb-8">
            Nous vous enverrons une confirmation à <strong>{form.email}</strong> très prochainement.
          </p>
          <Button
            onClick={() => {
              setSubmitted(false);
              setForm({ name: '', email: '', phone: '', date: '', time: '', guests: 2, seating: 'indoor', special_request: '' });
            }}
            className="bg-forest text-cream hover:bg-forest-light"
          >
            Nouvelle Réservation
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/26729397/pexels-photo-26729397.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080"
          alt="Salle du restaurant"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-dark/60 to-forest-dark/85" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-sans text-xs uppercase tracking-[0.4em] text-gold mb-3"
          >
            Réservez Votre Table
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-6xl font-medium text-cream text-shadow-lg"
          >
            Réservations
          </motion.h1>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-10"
          >
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-forest mb-1.5 block">Nom Complet *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="rounded-lg"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-forest mb-1.5 block">Téléphone *</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="rounded-lg"
                    placeholder="+33 6 00 00 00 00"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-forest mb-1.5 block">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="rounded-lg"
                  placeholder="votre@email.com"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date" className="text-forest mb-1.5 block flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <Label className="text-forest mb-1.5 block flex items-center gap-1">
                    <Clock className="h-4 w-4" /> Heure *
                  </Label>
                  <div className="grid grid-cols-3 gap-1.5 max-h-32 overflow-y-auto rounded-lg border border-forest/10 p-2">
                    {times.map((t) => (
                      <button
                        key={t}
                        onClick={() => setForm({ ...form, time: t })}
                        className={cn(
                          'px-2 py-1.5 text-sm rounded-md transition-all font-sans',
                          form.time === t
                            ? 'bg-gold text-forest-dark font-semibold'
                            : 'text-forest/60 hover:bg-cream'
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-forest mb-1.5 block flex items-center gap-1">
                    <Users className="h-4 w-4" /> Personnes
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setForm({ ...form, guests: Math.max(1, form.guests - 1) })}
                    >
                      −
                    </Button>
                    <span className="w-12 text-center font-display text-2xl text-forest">{form.guests}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setForm({ ...form, guests: Math.min(20, form.guests + 1) })}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-forest mb-2 block">Préférence de Place</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setForm({ ...form, seating: 'indoor' })}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-xl border-2 transition-all',
                      form.seating === 'indoor'
                        ? 'border-gold bg-gold/10'
                        : 'border-forest/10 hover:border-forest/30'
                    )}
                  >
                    <Home className="h-5 w-5 text-forest" />
                    <div className="text-left">
                      <p className="font-sans font-semibold text-forest">Intérieur</p>
                      <p className="text-xs text-forest/50">Salle cosy</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setForm({ ...form, seating: 'terrace' })}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-xl border-2 transition-all',
                      form.seating === 'terrace'
                        ? 'border-gold bg-gold/10'
                        : 'border-forest/10 hover:border-forest/30'
                    )}
                  >
                    <TreePine className="h-5 w-5 text-forest" />
                    <div className="text-left">
                      <p className="font-sans font-semibold text-forest">Terrasse</p>
                      <p className="text-xs text-forest/50">En extérieur</p>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="special" className="text-forest mb-1.5 block flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" /> Demandes Spéciales
                </Label>
                <Textarea
                  id="special"
                  value={form.special_request}
                  onChange={(e) => setForm({ ...form, special_request: e.target.value })}
                  className="rounded-lg"
                  placeholder="Allergies, célébrations, préférences de placement..."
                  rows={3}
                />
              </div>

              <Button
                onClick={submit}
                disabled={loading}
                size="lg"
                className="w-full bg-forest text-cream hover:bg-forest-light font-semibold text-base h-14"
              >
                {loading ? 'Envoi en cours...' : 'Confirmer la Réservation'}
              </Button>
              <p className="text-center text-xs text-forest/40">
                Nous enverrons un email de confirmation dans les 2 heures pendant les heures d'ouverture.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}