'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useSiteSettings } from '@/lib/use-site-settings';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { settings } = useSiteSettings();

  const submit = async () => {
    if (!form.name || !form.email || !form.message) return toast.error('Veuillez remplir tous les champs obligatoires.');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
    toast.success('Message envoyé ! Nous vous répondrons bientôt.');
  };

  return (
    <div className="bg-cream min-h-screen">
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <img src="https://images.pexels.com/photos/13871340/pexels-photo-13871340.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080" alt="Contact" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-dark/60 to-forest-dark/85" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-sans text-xs uppercase tracking-[0.4em] text-gold mb-3">
            Contactez-Nous
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-5xl md:text-6xl font-medium text-cream text-shadow-lg">
            Contact
          </motion.h1>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="font-display text-4xl text-forest mb-6">Visitez PHỞ Dijon</h2>
              <div className="space-y-5">
                {[
                  { icon: MapPin, title: 'Adresse', value: settings.contact_address },
                  { icon: Phone, title: 'Téléphone', value: settings.contact_phone },
                  { icon: Mail, title: 'Email', value: settings.contact_email },
                  { icon: Clock, title: 'Horaires', value: settings.contact_hours },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-forest flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-sans text-sm text-forest/50 uppercase tracking-wider">{item.title}</p>
                      <p className="font-sans text-lg text-forest">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-2xl overflow-hidden shadow-lg">
                <iframe
                  src={settings.google_maps_url}
                  className="w-full h-64 border-0"
                  loading="lazy"
                  title="Localisation de PHỞ Dijon"
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {sent ? (
                <div className="bg-white rounded-3xl shadow-xl p-10 text-center h-full flex flex-col items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-gold flex items-center justify-center mb-4">
                    <Send className="h-8 w-8 text-forest-dark" />
                  </div>
                  <h3 className="font-display text-3xl text-forest mb-2">Message Envoyé !</h3>
                  <p className="text-forest/60 mb-6">Merci, {form.name}. Nous répondrons à {form.email} sous 24 heures.</p>
                  <Button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="bg-forest text-cream hover:bg-forest-light">
                    Envoyer un Autre Message
                  </Button>
                </div>
              ) : (
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
                  <h3 className="font-display text-3xl text-forest mb-6">Envoyez un Message</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-forest mb-1.5 block">Nom *</Label>
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg" placeholder="Votre nom" />
                    </div>
                    <div>
                      <Label className="text-forest mb-1.5 block">Email *</Label>
                      <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-lg" placeholder="votre@email.com" />
                    </div>
                    <div>
                      <Label className="text-forest mb-1.5 block">Sujet</Label>
                      <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="rounded-lg" placeholder="Comment pouvons-nous vous aider ?" />
                    </div>
                    <div>
                      <Label className="text-forest mb-1.5 block">Message *</Label>
                      <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="rounded-lg" placeholder="Votre message..." rows={5} />
                    </div>
                    <Button onClick={submit} disabled={loading} size="lg" className="w-full bg-gold text-forest-dark hover:bg-gold-light font-semibold h-14">
                      {loading ? 'Envoi en cours...' : 'Envoyer le Message'}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
